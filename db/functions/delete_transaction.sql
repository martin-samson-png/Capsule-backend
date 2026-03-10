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
    perform 1 from accounts where id = v_tx.from_account_id and user_id = v_uid for update;
    perform 1 from accounts where id = v_tx.to_account_id and user_id = v_uid for update;

    update accounts
    set balance_cents = balance_cents + v_tx.amount_cents
    where id = v_tx.from_account_id and user_id = v_uid;

    update accounts
    set balance_cents = balance_cents - v_tx.amount_cents
    where id = v_tx.to_account_id and user_id = v_uid;

  elsif v_tx.type in ('expense', 'income') then
    perform 1 from accounts where id = v_tx.account_id and user_id = v_uid for update;

    update accounts
    set balance_cents = balance_cents + case
      when v_tx.type = 'income' then -v_tx.amount_cents 
      when v_tx.type = 'expense' then v_tx.amount_cents 
      else 0
    end
    where id = v_tx.account_id and user_id = v_uid;

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