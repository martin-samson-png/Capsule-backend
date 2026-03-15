create or replace function public.update_transfer_transaction(
  p_from_account_id uuid,
  p_to_account_id uuid,
  p_delta bigint
)
returns void
language plpgsql
as $$
declare
  v_uid uuid;
begin
  v_uid:= auth.uid();
  if v_uid is null then raise exception using
    errcode = 'P0001',
    message = 'Non authentifié';
  end if;

  if p_delta <> 0 then
    perform 1 from accounts where id = p_from_account_id and user_id = v_uid for update;
    if not found then raise exception using
      errcode = 'P0002',
      message = 'From_account_id invalide';
    end if;

    perform 1 from accounts where id = p_to_account_id and user_id = v_uid for update;
    if not found then raise exception using
      errcode = 'P0002',
      message = 'To_account_id invalide';
    end if;

    update accounts
    set balance_cents = balance_cents - (p_delta)
    where id = p_from_account_id and user_id = v_uid;

    update accounts
    set balance_cents = balance_cents + (p_delta)
    where id = p_to_account_id and user_id = v_uid;
  end if;
end;
$$;

create or replace function public.update_standard_transaction(
  p_account_id uuid,
  p_type text,
  p_delta bigint
)
returns void
language plpgsql
as $$
declare
  v_uid uuid;
begin
  v_uid:= auth.uid();
  if v_uid is null then raise exception using
    errcode = 'P0001',
    message = 'Non authentifié';
  end if;
  
  if p_type not in ('expense', 'income') then
  raise exception using
    errcode = 'P0002',
    message = 'Type invalide';
  end if;

  if p_delta <> 0 then
    perform 1 from accounts where id = p_account_id and user_id = v_uid for update;
    if not found then raise exception using
      errcode = 'P0002',
      message = 'Account_id invalide';
    end if;

    update accounts 
    set balance_cents = balance_cents + case
      when p_type ='income' then p_delta
      when p_type = 'expense' then -p_delta
      else 0
      end
    where id = p_account_id and user_id = v_uid;
  end if;
end;
$$;

create or replace function public.update_contribution_transaction(
  p_transaction_id uuid,
  p_account_id uuid,
  p_delta bigint
)
returns void
language plpgsql
as $$
declare
  v_uid uuid;
  v_goal_id uuid;
  v_current_amount_cents bigint;
begin
  v_uid := auth.uid();
  if v_uid is null then raise exception using
    errcode = 'P0001',
    message = 'Non authentifié';
  end if;

  if p_delta <> 0 then
    perform 1 from accounts where id = p_account_id and user_id = v_uid for update;
      if not found then raise exception using
        errcode = 'P0002',
        message = 'Account_id invalide';
      end if;
      
    select goal_id into v_goal_id from goal_contributions where transaction_id = p_transaction_id for update;
    if not found then raise exception using
      errcode = 'P0002',
      message = 'Contribution liée à aucun objectif';
    end if;

    select current_amount_cents into v_current_amount_cents from goals where id = v_goal_id and user_id = v_uid for update; 
    if not found then raise exception using
      errcode = 'P0002',
      message = 'Goal_id invalide';
    end if;

    if v_current_amount_cents + v_delta < 0 then 
    raise exception using
      errcode = 'P0002',
      message = 'Le solde de l''objectif ne peut pas être négatif';
    end if;

    update accounts 
    set balance_cents = balance_cents - p_delta
    where id = p_account_id and user_id = v_uid;

    update goals g
    set current_amount_cents = g.current_amount_cents +  p_delta,
    status = case
      when g.current_amount_cents + p_delta >= g.target_amount_cents then 'completed'
      else 'active'
      end
    where g.id = v_goal_id and g.user_id = v_uid;
  end if;
end;
$$;

create or replace function public.update_transaction(
  p_id uuid,
  p_amount_cents bigint default null,
  p_date date default null,
  p_category_id uuid default null,
  p_set_category boolean default false,
  p_label text default null,
  p_set_label boolean default false
)
returns void
language plpgsql
security invoker
as $$
declare
  v_uid uuid;
  v_new_amount bigint;
  v_delta bigint;
  v_tx record;
begin
  v_uid := auth.uid();
    if v_uid is null then raise exception using
    errcode = 'P0001',
    message = 'Non authentifié';
  end if;

  if p_id is null then raise exception using
    errcode = 'P0002',
    message = 'p_id obligatoire';
  end if;

  if p_amount_cents is null and p_date is null and 
  p_set_category is false and p_set_label is false 
  then raise exception using
    errcode = 'P0002',
    message = 'Aucun champ à mettre à jour';
  end if;

  if p_amount_cents is not null and p_amount_cents <= 0 then
  raise exception using 
    errcode = 'P0002',
    message = 'Le montant doit être > 0';
  end if;

  if p_date is not null and p_date > current_date then 
  raise exception using
    errcode = 'P0002',
    message = 'La date ne peut pas être dans le futur';
  end if;

  if p_set_category and p_category_id then
    perform 1 from categories where id = p_category_id and user_id = v_uid;
    if not found then raise exception using
      errcode = 'P0002',
      message = 'Category_id invalide';
    end if;
  end if;

  select account_id, from_account_id, to_account_id, type, amount_cents, category_id, label 
  into v_tx from transactions
  where id = p_id and user_id = v_uid
  for update;
  if not found then raise exception using
    errcode = 'P0003',
    message = 'Transaction introuvable';
  end if;

  v_new_amount := coalesce(p_amount_cents, v_tx.amount_cents);
  v_delta := v_new_amount - v_tx.amount_cents;

  if v_tx.type = 'transfer' then
    perform public.update_transfer_transaction(
      v_tx.from_account_id, v_tx.to_account_id, v_delta
    );
  
  elsif v_tx.type in ('income', 'expense') then
    perform public.update_standard_transaction(
      v_tx.account_id, v_tx.type, v_delta
    );

  elsif v_tx.type ='contribution' then
    perform public.update_contribution_transaction(
      p_id, v_tx.account_id, v_delta
    );
  else 
    raise exception using
      errcode = 'P0005', 
      message = 'Type inconnu';
  end if;

  update transactions t
  set
    amount_cents = v_new_amount,
    date = coalesce(p_date, t.date),
    category_id = case when p_set_category then p_category_id else t.category_id end,
    label = case when p_set_label then p_label else t.label end,
    updated_at = now()
  where t.id = p_id and t.user_id = v_uid;
end;
$$;

grant execute on function public.update_transaction(uuid, bigint, date, uuid, boolean, text, boolean) to authenticated;