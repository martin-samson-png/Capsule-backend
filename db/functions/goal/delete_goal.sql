create or replace function public.delete_goal(
  p_id uuid
)
returns void
language plpgsql
as $$
declare
  v_uid uuid;
  v_goal record;
begin
  v_uid:= auth.uid();
  if v_uid is null then raise exception using
    errcode = 'P0001',
    message = 'Non authentifié';
  end if;

  if p_id is null then
    raise exception using
      errcode = 'P0002',
      message = 'p_id obligatoire';
  end if;

  select * into v_goal from goals 
  where id = p_id and user_id = v_uid
  for update;
  if not found then raise exception using
    errcode = 'P0003',
    message = 'Objectif introuvable';
  end if;

  if v_goal.current_amount_cents > 0 then 
  raise exception using 
    errcode = 'P0002',
    message = 'Retirez d’abord l’argent de l’objectif avant de le supprimer.';
  end if;

  delete from goals
  where id = p_id and user_id = v_uid;
end;
$$;

grant execute on function public.delete_goal(uuid) to authenticated;
