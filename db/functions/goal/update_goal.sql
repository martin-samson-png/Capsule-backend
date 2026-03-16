create or replace function public.update_goal(
  p_id uuid,
  p_label text,
  p_target_amount_cents bigint,
  p_deadline date,
  p_status text,
  p_set_deadline boolean default false
)
returns void
language plpgsql
security invoker
as $$
declare
  v_uid uuid;
  v_goal record;
  v_new_target_amount_cents bigint;
  v_new_status text;
begin
  v_uid:= auth.uid();
  if v_uid is null then raise exception using
    errcode = 'P0001',
    message = 'Non authentifié';
  end if;

  if p_id is null then raise exception using
    errcode = 'P0002',
    message = 'p_id obligatoire';
  end if;


  if p_label is null and p_target_amount_cents is null and p_status is null
  and p_set_deadline is false then raise exception using
    errcode = 'P0002',
    message = 'Aucun champ à mettre à jour';
  end if;

  if p_status is not null and p_status not in ('active', 'completed', 'cancelled') then
  raise exception using
    errcode = 'P0002',
    message = 'Status invalide';
  end if;

  if p_set_deadline and p_deadline is not null and p_deadline < current_date then
  raise exception using
    errcode = 'P0002',
    message = 'La deadline ne peut pas être dans le passé';
  end if;

  if p_target_amount_cents is not null and p_target_amount_cents <= 0 then
  raise exception using
    errcode  = 'P0002',
    message = 'Le montant cible doit être > 0';
  end if;

  select * into v_goal from goals where id = p_id and user_id = v_uid for update;
  if not found then raise exception using
    errcode = 'P0002',
    message = 'Objectif introuvable';
  end if;

  v_new_target_amount_cents := coalesce(p_target_amount_cents, v_goal.target_amount_cents);
  
  v_new_status := case
    when p_status = 'cancelled' then 'cancelled'
    when v_goal.current_amount_cents >= v_new_target_amount_cents then 'completed'
    else 'active'
  end;

  update goals g
  set
    target_amount_cents = v_new_target_amount_cents,
    label = coalesce(p_label, g.label),
    deadline = case when p_set_deadline then p_deadline else g.deadline end,
    status = v_new_status
  where g.id = p_id and g.user_id = v_uid;

end;
$$;

grant execute on function public.update_goal(uuid, text, bigint, date, boolean) to authenticated;