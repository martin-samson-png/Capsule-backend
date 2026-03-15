create or replace function  public.create_contribution(
  p_account_id uuid,
  p_goal_id uuid,
  p_category_id uuid,
  p_amount_cents bigint,
  p_date date,
  p_label text default null
)
returns table(
  tx_id uuid,
  account_id uuid,
  date date,
  amount_cents bigint,
  label text,
  type text,
  created_at timestamptz,
  account_balance_cents bigint,
  category_name text,
  goal_current_amount_cents bigint
)
language plpgsql
security invoker
as $$
declare
  v_uid uuid;
  v_tx_id uuid;
  v_tx_created_at timestamptz;
  v_current_amount_cents bigint;
  v_goal record;
  v_category_name text;
  v_balance_cents bigint;
  v_new_amount bigint;

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

  if p_date is null then raise exception using
    errcode = 'P0002',
    message = 'Date requis';
  end if;

  if p_date > current_date then raise exception using
    errcode = 'P0002',
    message = 'La date ne peut pas être dans le futur';
  end if;

  if p_category_id is not null then
    select name into v_category_name from categories
    where id = p_category_id and user_id = v_uid;

    if not found then raise exception using
      errcode = 'P0002',
      message = 'Category_id invalide';
    end if;
  end if;

  perform 1 from accounts where id = p_account_id and user_id = v_uid for update;
  if not found then raise exception using
    errcode = 'P0002',
    message = 'Account_id invalide';
  end if;

  select id, target_amount_cents, current_amount_cents into v_goal from goals where id = p_goal_id and user_id = v_uid and status = 'active' for update;
  if not found then raise exception using
    errcode = 'P0002',
    message = 'Goal_id invalide';
  end if;

  insert into transactions (user_id, account_id, category_id, date, amount_cents, label, type)
  values (v_uid, p_account_id, p_category_id, p_date, p_amount_cents, p_label, 'contribution')
  returning transactions.id, transactions.created_at into v_tx_id, v_tx_created_at;

  insert into goal_contributions (transaction_id, goal_id) values (v_tx_id, v_goal.id);

  v_new_amount:= v_goal.current_amount_cents + p_amount_cents;

  update accounts
  set balance_cents = balance_cents - p_amount_cents
  where id = p_account_id and user_id = v_uid
  returning balance_cents into v_balance_cents;
  if not found then raise exception using
    errcode = 'P0006',
    message = 'Echec de la mise a jour du compte';
  end if;

  update goals g
  set 
    current_amount_cents = v_new_amount,
    status = case when v_new_amount >= g.target_amount_cents then 'completed' else g.status end
  where id = p_goal_id and user_id = v_uid
  returning  goals.current_amount_cents into v_current_amount_cents;
  if not found then raise exception using
    errcode = 'P0006',
    message = 'Echec de la mise a jour du goal';
  end if;

  return query
  select
    v_tx_id,
    p_account_id,
    p_date,
    p_amount_cents,
    p_label,
    'contribution',
    v_tx_created_at,
    v_balance_cents,
    v_category_name,
    v_current_amount_cents;
end;
$$;

grant execute on function public.create_contribution(uuid, uuid, uuid, bigint, date, text) to authenticated;