create or replace function public.create_transfer(
  p_from_account_id uuid,
  p_to_account_id uuid,
  p_amount_cents bigint,
  p_date date,
  p_label text default null
)
returns table(
  tx_id uuid,
  from_account_id uuid,
  to_account_id uuid,
  date date,
  amount_cents bigint,
  label text,
  created_at timestamptz,
  tx_type text,
  from_balance_cents bigint,
  to_balance_cents bigint
)
language plpgsql
security invoker
as $$
declare 
  v_uid uuid;
  v_from_balance bigint;
  v_to_balance bigint;
  v_new_from_balance bigint;
  v_new_to_balance bigint;
  v_tx_id uuid;
  v_tx_created_at timestamptz;

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

  if p_from_account_id is null or p_to_account_id is null then
    raise exception using
      errcode = 'P0002',
      message = 'from_account_id et to_account_id sont requient';
  end if;
  if p_from_account_id = p_to_account_id then
    raise exception using
      errcode = 'P0002',
      message = 'from_account_id et to_account_id doivent être différent';
  end if;

  if p_date is null then raise exception using
    errcode = 'P0002',
    message = 'Date requis';
  end if;
  if p_date > current_date then raise exception using
    errcode = 'P0002',
    message = 'La date ne peut pas être dans le futur';
  end if;

  select balance_cents into v_from_balance from accounts 
  where id = p_from_account_id and user_id = v_uid and type = 'main'
  for update;
  if not found then raise exception using
    errcode = 'P0003',
    message = 'Compte introuvable';
  end if;

  select balance_cents into v_to_balance from accounts
  where id = p_to_account_id and user_id = v_uid
  for update;
  if not found then raise exception using
    errcode = 'P0003',
    message = 'Compte introuvable';
  end if;

  if v_from_balance < p_amount_cents then 
    raise exception using
    errcode = 'P0005',
    message = 'Fond insuffisant';
  end if;

  update accounts a
  set balance_cents = a.balance_cents - p_amount_cents
  where a.id = p_from_account_id and a.user_id = v_uid
  returning a.balance_cents into v_new_from_balance;
  if not found then raise exception using
    errcode = 'P0006', 
    message = 'Echec de la mise à jour de from account ';
  end if;

  update accounts a
  set balance_cents = a.balance_cents + p_amount_cents
  where a.id = p_to_account_id and a.user_id = v_uid
  returning a.balance_cents into v_new_to_balance;
  if not found then raise exception using 
  errcode = 'P0006', 
  message = 'Echec de la mise à jour de to account';
  end if;

  insert into transactions (user_id, from_account_id, to_account_id, date, amount_cents, label, type) 
  values (v_uid, p_from_account_id, p_to_account_id, p_date, p_amount_cents, p_label, 'transfer')
  returning transactions.id, transactions.created_at into v_tx_id, v_tx_created_at;

  return query 
  select
    v_tx_id, 
    p_from_account_id,
    p_to_account_id,
    p_date,
    p_amount_cents,
    p_label,
    v_tx_created_at,
    'transfer',
    v_new_from_balance,
    v_new_to_balance;
end;
$$;

grant execute on function public.create_transfer(uuid, uuid, bigint, date, text) to authenticated;