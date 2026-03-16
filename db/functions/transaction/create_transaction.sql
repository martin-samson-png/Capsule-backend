create or replace function public.create_transaction(
  p_account_id uuid,
  p_amount_cents bigint,
  p_date date,
  p_type text,
  p_category_id uuid default null,
  p_label text default null
)
returns table(
  tx_id uuid,
  account_id uuid,
  date date,
  amount_cents bigint,
  label text,
  created_at timestamptz,
  tx_type text,
  new_balance_cents bigint,
  category_name text
)
language plpgsql
security invoker
as $$
declare
  v_uid uuid;
  v_account_balance bigint;
  v_tx_id uuid;
  v_tx_created_at timestamptz;
  v_category_name text;

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

  if p_account_id is null then
    raise exception using
      errcode = 'P0002',
      message = 'p_account_id requis';
  end if;

  if p_date is null then raise exception using
    errcode = 'P0002',
    message = 'Date requis';
  end if;
  if p_date > current_date then raise exception using
    errcode = 'P0002',
    message = 'La date ne peut pas être dans le futur';
  end if;

  if p_category_id is not null then
    select label into v_category_name from categories
    where id = p_category_id and user_id = v_uid;

    if not found then raise exception using
      errcode = 'P0002',
      message = 'Category_id invalide';
    end if;
  end if;

  select balance_cents into v_account_balance from accounts
  where id = p_account_id and user_id = v_uid and type = 'main'
  for update;
  if not found then raise exception using
    errcode = 'P0003',
    message = 'Compte introuvable';
  end if;


  if p_type not in ('expense', 'income') then 
    raise exception using
    errcode = 'P0002',
    message = 'Type invalide';
  end if;

  if p_type = 'expense' then 
    update accounts a
    set balance_cents = a.balance_cents - p_amount_cents
    where a.id = p_account_id and a.user_id = v_uid
    returning a.balance_cents into v_account_balance;
    if not found then raise exception using
      errcode = 'P0006',
      message = 'Echec de la mise a jour du compte';
    end if;
  end if;

  if p_type = 'income' then
  update accounts a
  set balance_cents = a.balance_cents + p_amount_cents
  where a.id = p_account_id and a.user_id = v_uid
  returning a.balance_cents into v_account_balance;
   if not found then raise exception using
      errcode = 'P0006',
      message = 'Echec de la mise a jour du compte';
    end if;
  end if;

  insert into transactions (user_id, account_id, category_id, date, amount_cents, label, type)
  values(v_uid, p_account_id, p_category_id, p_date, p_amount_cents, p_label, p_type)
  returning transactions.id, transactions.created_at into v_tx_id, v_tx_created_at;
  
  return query
  select
    v_tx_id,
    p_account_id,
    p_date,
    p_amount_cents,
    p_label,
    v_tx_created_at,
    p_type,
    v_account_balance,
    v_category_name;
  
end;
$$;

grant execute on function public.create_transaction(uuid, bigint, date, text, uuid, text) to authenticated;