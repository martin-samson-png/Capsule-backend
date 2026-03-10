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
      message = 'Champs manquant';
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

  select id, account_id, from_account_id, to_account_id, type, amount_cents, category_id, label 
  into v_tx from transactions
  where id = p_id and user_id = v_uid
  for update;
  if not found then raise exception using
    errcode = 'P0003',
    message = 'Transaction introuvable';
  end if;

  v_new_amount := coalesce(p_amount_cents, v_tx.amount_cents);
  v_delta := v_new_amount - v_tx.amount_cents;

  update transactions t
  set
    amount_cents = v_new_amount,
    date = coalesce(p_date, t.date),
    category_id = case when p_set_category then p_category_id else t.category_id end,
    label = case when p_set_label then p_label else t.label end,
    updated_at = now()
  where t.id = p_id and t.user_id = v_uid;

  if v_tx.type = 'transfer' then
    if v_delta <> 0 then
      perform 1 from accounts where id = v_tx.from_account_id and user_id = v_uid for update;

      perform 1 from accounts where id = v_tx.to_account_id and user_id = v_uid for update;

      update accounts
      set balance_cents = balance_cents - (v_delta)
      where id = v_tx.from_account_id and user_id = v_uid;

      update accounts
      set balance_cents = balance_cents + (v_delta)
      where id = v_tx.to_account_id and user_id = v_uid;
    end if;
  
  elsif v_tx.type in ('income', 'expense') then
    if v_delta <> 0 then
      perform 1 from accounts where id = v_tx.account_id and user_id = v_uid for update;

      update accounts 
      set balance_cents = balance_cents + case
        when v_tx.type ='income' then v_delta
        when v_tx.type = 'expense' then -v_delta
        else 0
      end
      where id = v_tx.account_id and user_id = v_uid;
    end if;
  else 
    raise exception using
      errcode = 'P0005', 
      message = 'Type inconnu';
  end if;
end;
$$;

grant execute on function public.update_transaction(uuid, bigint, date, uuid, boolean, text, boolean) to authenticated;