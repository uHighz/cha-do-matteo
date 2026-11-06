create function public.admin_delete_rsvp(p_id uuid) returns text[] language plpgsql security invoker set search_path='' as $$
declare photo_paths text[];
begin
 perform pg_advisory_xact_lock(7312027);
 perform 1 from public.rsvps where id=p_id for update; if not found then raise exception 'INVALID_RSVP'; end if;
 if exists(select 1 from public.reservations where rsvp_id=p_id and (status in ('confirmed','paid','needs_review') or checkout_url is not null or (status='pending' and expires_at>now()))) then
  raise exception 'GUEST_HAS_CONFIRMED_GIFTS';
 end if;
 select coalesce(array_agg(path),'{}'::text[]) into photo_paths from public.photos where rsvp_id=p_id;
 delete from public.messages where rsvp_id=p_id;
 delete from public.photos where rsvp_id=p_id;
 delete from public.reservations where rsvp_id=p_id;
 delete from public.rsvps where id=p_id;
 return photo_paths;
end $$;
revoke all on function public.admin_delete_rsvp(uuid) from public,anon,authenticated;
grant execute on function public.admin_delete_rsvp(uuid) to service_role;
