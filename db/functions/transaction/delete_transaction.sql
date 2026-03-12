create or replace function public.delete_transfer_transaction(
  p_from_account_id uuid,
  p_to_account_id uuid,
  p_amount_cents bigint
)
returns void
language plpgsql
as $$
declare
  v_uid uuid;
begin
  v_uid := auth.uid();
  if v_uid is null then raise exception using
    errcode = 'P0001',
    message = 'Non authentifié';
  end if;

  if p_amount_cents is null or p_amount_cents <= 0 then
  raise exception using
    errcode = 'P0002',
    message = 'Le montant doit être > 0';
  end if;

  perform 1 from accounts where id = p_from_account_id and user_id = v_uid for update;
    if not found then raise exception using
      errcode = 'P0002',
      message = 'From_account_id introuvable';
    end if;
  perform 1 from accounts where id = p_to_account_id and user_id = v_uid for update;
     if not found then raise exception using
      errcode = 'P0002',
      message = 'To_account_id introuvable';
    end if;

  update accounts
  set balance_cents = balance_cents + p_amount_cents
  where id = p_from_account_id and user_id = v_uid;

  update accounts
  set balance_cents = balance_cents - p_amount_cents
  where id = p_to_account_id and user_id = v_uid;
end;
$$;

create or replace function public.delete_standard_transaction(
  p_account_id uuid,
  p_amount_cents bigint,
  p_type text
)
returns void
language plpgsql
as $$
declare
  v_uid uuid;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception using
      errcode = 'P0001',
      message = 'Non authentifié';
  end if;

  if p_amount_cents is null or p_amount_cents <= 0 then
  raise exception using
    errcode = 'P0002',
    message = 'Le montant doit être > 0';
  end if;

  perform 1 from accounts where id = p_account_id and user_id = v_uid for update;
  if not found then raise exception using
    errcode = 'P0002',
    message = 'Account_id introuvable';
  end if;

  update accounts
  set balance_cents = balance_cents + case
    when p_type = 'income' then -p_amount_cents 
    when p_type = 'expense' then p_amount_cents 
    else 0
    end
    where id = p_account_id and user_id = v_uid;
end;
$$

create or replace function public.delete_contribution_transaction(
  p_transaction_id uuid,
  p_account_id uuid,
  p_amount_cents bigint
)
returns void
language plpgsql
as $$
declare
  v_uid uuid;
  v_goal_id uuid;
begin
  v_uid := auth.uid();
  if v_uid is null then raise exception using
    errcode = 'P0001',
    message = 'Non authentifié';
  end if;

  if p_amount_cents is null or p_amount_cents <= 0 then
  raise exception using
    errcode = 'P0002',
    message = 'Le montant doit être > 0';
  end if;

  perform 1 from transactions where id = p_transaction_id and user_id = v_uid for update;
  if not found then raise exception using 
    errcode = 'P0002',
    message = 'Transaction_id introuvable';
  end if;

  perform 1 from accounts where id = p_account_id and user_id = v_uid for update;
  if not found then raise exception using
    errcode = 'P0002', 
    message = 'Account_id introuvable';
  end if;

  select goal_id into v_goal_id from goal_contributions where transaction_id = p_transaction_id for update;
  if not found then raise exception using
    errcode = 'P0002',
    message = 'Contribution liée à aucun objectif';
  end if;

  perform 1 from goals where id = v_goal_id and user_id = v_uid for update;
  if not found then raise exception using
    errcode = 'P0002',
    message = 'Goal_id introuvable';
  end if;

  update accounts
  set balance_cents = balance_cents + p_amount_cents
  where id = p_account_id and user_id = v_uid;

  update goals g
  set 
  current_amount_cents = g.current_amount_cents - p_amount_cents,
  status = case
    when g.current_amount_cents - p_amount_cents >= g.target_amount_cents then 'completed'
    else 'active'
    end,
  where id = v_goal_id and user_id = v_uid;
end;
$$

create or replace function public.delete_transaction(
  p_id uuid
)
returns void
language plpgsql
security invoker
as $$
declare
  v_uid uuid;
  v_tx record;
begin
  v_uid:=auth.uid();
  if v_uid is null then
    raise exception using
      errcode = 'P0001',
      message = 'Non authentifié';
  end if;

  if p_id is null then
    raise exception using
      errcode = 'P0002',
      message = 'p_id obligatoire';
  end if;

  select account_id, from_account_id, to_account_id, type, amount_cents 
  into v_tx from transactions
  where id = p_id and user_id = v_uid
  for update;
  if not found then
    raise exception using
      errcode = 'P0003',
      message = 'Transaction introuvable';
  end if;

  if v_tx.type = 'transfer' then
    perform public.delete_transfer_transaction(
      v_tx.from_account_id, v_tx.to_account_id, v_tx.amount_cents
    );

  elsif v_tx.type in ('expense', 'income') then
    perform public.delete_standard_transaction(
      v_tx.account_id, v_tx.amount_cents, v_tx.type
    );

  elsif v_tx.type = 'contribution' then
    perform public.delete_contribution_transaction(
      p_id, v_tx.account_id, v_tx.amount_cents
    );
  else
    raise exception using
      errcode = 'P0005',
      message = 'Type inconnu';
  end if;

  delete from transactions
  where id = p_id and user_id = v_uid;
  if not found then
    raise exception using
      errcode = 'P0003',
      message = 'Transaction introuvable';
  end if;
end;
$$;

grant execute on function public.delete_transaction(uuid) to authenticated;
