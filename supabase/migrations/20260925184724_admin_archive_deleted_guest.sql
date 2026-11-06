alter table public.rsvps add column archived_at timestamptz;

drop function public.admin_delete_rsvp(uuid);

create function public.admin_delete_rsvp(p_id uuid)
returns jsonb
language plpgsql
security invoker
set search_path=''
as $$
declare
  photo_paths text[];
  has_checkout_link boolean;
begin
  perform pg_advisory_xact_lock(7312027);
  perform 1 from public.rsvps where id=p_id for update;
  if not found then raise exception 'INVALID_RSVP'; end if;

  if exists (
    select 1 from public.reservations
    where rsvp_id=p_id and (
      status in ('confirmed','paid','needs_review')
      or (status='pending' and expires_at>now())
      or checkout_url='__creating__'
    )
  ) then
    raise exception 'GUEST_HAS_CONFIRMED_GIFTS';
  end if;

  select coalesce(array_agg(path),'{}'::text[])
  into photo_paths
  from public.photos where rsvp_id=p_id;

  delete from public.messages where rsvp_id=p_id;
  delete from public.photos where rsvp_id=p_id;

  select exists(
    select 1 from public.reservations
    where rsvp_id=p_id and checkout_url is not null and checkout_url<>'__creating__'
  ) into has_checkout_link;

  if has_checkout_link then
    update public.reservations
    set token_hash='revoked-'||id::text
    where rsvp_id=p_id;

    update public.rsvps
    set name='Convidado removido',
        whatsapp='REMOVIDO',
        attending=false,
        companions='[]'::jsonb,
        token_hash='revoked-'||id::text,
        archived_at=now()
    where id=p_id;

    return jsonb_build_object('photo_paths',photo_paths,'archived',true);
  end if;

  delete from public.reservations where rsvp_id=p_id;
  delete from public.rsvps where id=p_id;
  return jsonb_build_object('photo_paths',photo_paths,'archived',false);
end;
$$;

revoke all on function public.admin_delete_rsvp(uuid) from public,anon,authenticated;
grant execute on function public.admin_delete_rsvp(uuid) to service_role;
