create or replace function public.update_goal(
  p_id uuid,
  p_label text,
  p_target_amount_cents bigint,
  p_deadline date,
  p_set_deadline boolean default false
)
returns void
language plpgsql
security invoker
as $$
declare
  v_uid uuid;
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

  if p_label is null and p_target_amount_cents is null
  and p_set_deadline is false then raise exception using
    errcode = 'P0002',
    message = 'Aucun champ à mettre à jour'
  end if;

  perform 1 from goals where id = p_id and user_id = v_uid for update;
  if not found then raise exception using
    errcode = 'P0002',
    message = 'Objectif introuvable'
  end if;

  update goals g
  set
    target_amount_cents = coalesce(p_target_amount_cents, g.target_amount_cents),
    label = coalesce(p_label, g.label),
    deadline = case when p_set_deadline then p_deadline else g.deadline end,
    updated_at = now()
  where g.id = p_id and g.user_id = v_uid;

end;
$$;

grant execute on function public.update_goal(uuid, text, bigint, date, boolean) to authenticated;