create table public.catalog_items(id text primary key,name text not null,kind text not null check(kind in ('diaper','extra')),price_cents integer not null check(price_cents>0),capacity integer not null check(capacity>=0));
create table public.rsvps(id uuid primary key default gen_random_uuid(),name text not null,whatsapp text not null,attending boolean not null,companions jsonb not null default '[]',token_hash text not null,created_at timestamptz not null default now());
create table public.reservations(id uuid primary key default gen_random_uuid(),rsvp_id uuid not null references public.rsvps(id),token_hash text not null,status text not null default 'pending' check(status in ('pending','confirmed','paid','needs_review','cancelled')),expires_at timestamptz not null default now()+interval '15 minutes',amount integer not null default 0,checkout_url text,transaction_nsu text unique,created_at timestamptz not null default now());
create table public.reservation_items(reservation_id uuid not null references public.reservations(id) on delete cascade,product_id text not null references public.catalog_items(id),delivery text not null check(delivery in ('bring','pay')),price_cents integer not null,primary key(reservation_id,product_id));
create table public.messages(id uuid primary key default gen_random_uuid(),rsvp_id uuid not null references public.rsvps(id),name text not null,message text not null,approved boolean not null default false,created_at timestamptz not null default now());
create table public.photos(id uuid primary key default gen_random_uuid(),rsvp_id uuid not null references public.rsvps(id),name text not null,path text not null,approved boolean not null default false,created_at timestamptz not null default now());
create table public.rate_limits(key text primary key,hits integer not null default 1,started_at timestamptz not null default now());
alter table public.catalog_items enable row level security;
alter table public.rsvps enable row level security;
alter table public.reservations enable row level security;
alter table public.reservation_items enable row level security;
alter table public.messages enable row level security;
alter table public.photos enable row level security;
alter table public.rate_limits enable row level security;
revoke all on public.catalog_items,public.rsvps,public.reservations,public.reservation_items,public.messages,public.photos,public.rate_limits from anon,authenticated;
grant all on public.catalog_items,public.rsvps,public.reservations,public.reservation_items,public.messages,public.photos,public.rate_limits to service_role;
create index reservations_rsvp on public.reservations(rsvp_id);
create index reservation_product on public.reservation_items(product_id);

insert into public.catalog_items values
('diaper-p','Fralda P','diaper',10000,5),('diaper-m','Fralda M','diaper',8500,18),('diaper-g','Fralda G','diaper',9000,22),('diaper-xg','Fralda XG','diaper',8000,18),('diaper-xxg','Fralda XXG','diaper',8000,7),
('treat-wipes','Lenços umedecidos','extra',2800,25),('treat-cream','Creme preventivo de assaduras','extra',2700,5),('treat-soap','Sabonete líquido infantil','extra',3300,8),('treat-shampoo','Shampoo infantil','extra',2000,7),('treat-towel','Toalha com capuz','extra',6000,2),('treat-mouthcloth','Fraldinha de boca','extra',1500,4),('treat-clothdiaper','Fralda de pano','extra',2000,4),('treat-bib','Babador','extra',3000,4),('treat-blanket','Manta','extra',6500,5),('treat-socks','Kit de meias','extra',3000,6);

create function public.check_rate(p_key text,p_limit integer) returns boolean language plpgsql security invoker set search_path='' as $$
declare n integer;
begin
 insert into public.rate_limits(key) values(p_key) on conflict(key) do update set hits=case when rate_limits.started_at<now()-interval '10 minutes' then 1 else rate_limits.hits+1 end,started_at=case when rate_limits.started_at<now()-interval '10 minutes' then now() else rate_limits.started_at end returning hits into n;
 return n<=p_limit;
end $$;

create function public.catalog_availability() returns table(id text,name text,kind text,price_cents integer,available bigint) language sql security invoker set search_path='' as $$
 select c.id,c.name,c.kind,c.price_cents,greatest(0,c.capacity-count(r.id)) from public.catalog_items c left join public.reservation_items i on i.product_id=c.id left join public.reservations r on r.id=i.reservation_id and (r.status in ('confirmed','paid') or (r.status='pending' and r.expires_at>now())) group by c.id;
$$;

create function public.reserve_gifts(p_rsvp uuid,p_token_hash text,p_items jsonb,p_id uuid default null) returns jsonb language plpgsql security invoker set search_path='' as $$
declare rid uuid; expiry timestamptz; rec record; used bigint; total integer; current_status text;
begin
 -- One transaction-wide lock serializes every stock mutation, including payment settlement.
 perform pg_advisory_xact_lock(7312027);
 if not exists(select 1 from public.rsvps where id=p_rsvp and attending) then raise exception 'INVALID_RSVP'; end if;
 if jsonb_array_length(p_items)<1 or jsonb_array_length(p_items)>2 or (select count(distinct x->>'productId') from jsonb_array_elements(p_items)x)<>jsonb_array_length(p_items) then raise exception 'INVALID_ITEMS'; end if;
 if (select count(*) from jsonb_array_elements(p_items)x join public.catalog_items c on c.id=x->>'productId' where c.kind='diaper')<>1 or (select count(*) from jsonb_array_elements(p_items)x join public.catalog_items c on c.id=x->>'productId')<>jsonb_array_length(p_items) then raise exception 'INVALID_ITEMS'; end if;
 if p_id is not null then
  select status,expires_at into current_status,expiry from public.reservations where id=p_id and rsvp_id=p_rsvp and token_hash=p_token_hash for update;
  if current_status is null or current_status<>'pending' then raise exception 'INVALID_RESERVATION'; end if;
  if expiry<=now() then raise exception 'EXPIRED'; end if;
  if exists(select 1 from public.reservations where id=p_id and checkout_url is not null) then raise exception 'INVALID_CHECKOUT_STARTED'; end if;
  rid:=p_id;
 else
  if exists(select 1 from public.reservations where rsvp_id=p_rsvp and (status in ('confirmed','paid') or (status='pending' and expires_at>now()))) then raise exception 'INVALID_EXISTING_RESERVATION'; end if;
  insert into public.reservations(rsvp_id,token_hash) values(p_rsvp,p_token_hash) returning id,expires_at into rid,expiry;
 end if;
 delete from public.reservation_items where reservation_id=rid;
 for rec in select c.*,x->>'delivery' delivery from jsonb_array_elements(p_items)x join public.catalog_items c on c.id=x->>'productId' loop
  if rec.delivery not in ('bring','pay') or rec.delivery is null then raise exception 'INVALID_DELIVERY'; end if;
  select count(*) into used from public.reservation_items i join public.reservations r on r.id=i.reservation_id where i.product_id=rec.id and (r.status in ('confirmed','paid') or (r.status='pending' and r.expires_at>now()));
  if used>=rec.capacity then raise exception 'SOLD_OUT'; end if;
  insert into public.reservation_items(reservation_id,product_id,delivery,price_cents) values(rid,rec.id,rec.delivery,rec.price_cents);
 end loop;
 select coalesce(sum(price_cents) filter(where delivery='pay'),0) into total from public.reservation_items where reservation_id=rid;
 update public.reservations set amount=total where id=rid;
 return jsonb_build_object('id',rid,'expiresAt',expiry,'amount',total);
end $$;

create function public.complete_reservation(p_id uuid,p_token_hash text) returns jsonb language plpgsql security invoker set search_path='' as $$
declare r public.reservations;
begin
 perform pg_advisory_xact_lock(7312027);
 select * into r from public.reservations where id=p_id and token_hash=p_token_hash for update;
 if r.id is null then raise exception 'INVALID_RESERVATION'; end if;
 if r.status in ('confirmed','paid') then return jsonb_build_object('status',r.status); end if;
 if r.status<>'pending' then raise exception 'INVALID_STATUS'; end if;
 if r.expires_at<=now() then raise exception 'EXPIRED'; end if;
 if (select count(*) from public.reservation_items where reservation_id=p_id)<>2 then raise exception 'INVALID_MISSING_EXTRA'; end if;
 if r.amount>0 then return jsonb_build_object('status','requires_payment'); end if;
 update public.reservations set status='confirmed' where id=p_id;
 return jsonb_build_object('status','confirmed');
end $$;

create function public.settle_payment(p_id uuid,p_transaction text,p_amount integer) returns text language plpgsql security invoker set search_path='' as $$
declare r public.reservations; result text;
begin
 perform pg_advisory_xact_lock(7312027);
 select * into r from public.reservations where id=p_id for update;
 if r.id is null or r.amount<>p_amount or p_amount<=0 then raise exception 'INVALID_PAYMENT'; end if;
 if r.transaction_nsu is not null then
  if r.transaction_nsu<>p_transaction then raise exception 'INVALID_TRANSACTION'; end if;
  return r.status;
 end if;
 -- Late payments never consume inventory that may have been allocated elsewhere.
 result:=case when r.status='pending' and r.expires_at>now() then 'paid' else 'needs_review' end;
 update public.reservations set status=result,transaction_nsu=p_transaction where id=p_id;
 return result;
end $$;
revoke all on function public.check_rate(text,integer),public.catalog_availability(),public.reserve_gifts(uuid,text,jsonb,uuid),public.complete_reservation(uuid,text),public.settle_payment(uuid,text,integer) from public,anon,authenticated;
grant execute on function public.check_rate(text,integer),public.catalog_availability(),public.reserve_gifts(uuid,text,jsonb,uuid),public.complete_reservation(uuid,text),public.settle_payment(uuid,text,integer) to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('guest-photos','guest-photos',false,5242880,array['image/jpeg','image/png','image/webp']) on conflict(id) do nothing;

create function public.claim_checkout(p_id uuid,p_token_hash text) returns boolean language plpgsql security invoker set search_path='' as $$
declare r public.reservations;
begin
 perform pg_advisory_xact_lock(7312027);
 select * into r from public.reservations where id=p_id and token_hash=p_token_hash for update;
 if r.id is null or r.status<>'pending' or r.amount<=0 then raise exception 'INVALID_RESERVATION'; end if;
 if r.expires_at<=now() then raise exception 'EXPIRED'; end if;
 if r.checkout_url is not null then raise exception 'INVALID_CHECKOUT_STARTED'; end if;
 if (select count(*) from public.reservation_items where reservation_id=p_id)<>2 then raise exception 'INVALID_MISSING_EXTRA'; end if;
 update public.reservations set checkout_url='__creating__' where id=p_id;
 return true;
end $$;
revoke all on function public.claim_checkout(uuid,text) from public,anon,authenticated;
grant execute on function public.claim_checkout(uuid,text) to service_role;

create function public.edit_rsvp(p_id uuid,p_token_hash text,p_name text,p_whatsapp text,p_attending boolean,p_companions jsonb) returns boolean language plpgsql security invoker set search_path='' as $$
begin
 perform pg_advisory_xact_lock(7312027);
 if not exists(select 1 from public.rsvps where id=p_id and token_hash=p_token_hash) then raise exception 'INVALID_RSVP'; end if;
 if not p_attending and exists(select 1 from public.reservations where rsvp_id=p_id and (status in ('confirmed','paid','needs_review') or (status='pending' and expires_at>now()))) then raise exception 'INVALID_ACTIVE_RESERVATION'; end if;
 update public.rsvps set name=p_name,whatsapp=p_whatsapp,attending=p_attending,companions=p_companions where id=p_id;
 return true;
end $$;
revoke all on function public.edit_rsvp(uuid,text,text,text,boolean,jsonb) from public,anon,authenticated;
grant execute on function public.edit_rsvp(uuid,text,text,text,boolean,jsonb) to service_role;

alter table public.rsvps add constraint rsvp_companions_limit check (
 case when jsonb_typeof(companions)='array' then jsonb_array_length(companions)<=5 and (attending or jsonb_array_length(companions)=0) else false end
);
alter table public.reservation_items add column delivered_at timestamptz;
alter table public.reservation_items add constraint physical_delivery_only check(delivered_at is null or delivery='bring');

create function public.admin_update_catalog(p_id text,p_price_cents integer,p_capacity integer) returns boolean language plpgsql security invoker set search_path='' as $$
declare used bigint;
begin
 perform pg_advisory_xact_lock(7312027);
 if p_price_cents is null or p_price_cents<=0 or p_capacity is null or p_capacity<0 then raise exception 'INVALID_CATALOG'; end if;
 if not exists(select 1 from public.catalog_items where id=p_id) then raise exception 'INVALID_PRODUCT'; end if;
 select count(*) into used from public.reservation_items i join public.reservations r on r.id=i.reservation_id where i.product_id=p_id and (r.status in ('confirmed','paid') or (r.status='pending' and r.expires_at>now()));
 if p_capacity<used then raise exception 'INVALID_CAPACITY_RESERVED'; end if;
 update public.catalog_items set price_cents=p_price_cents,capacity=p_capacity where id=p_id;
 return true;
end $$;

create function public.admin_cancel_reservation(p_id uuid) returns boolean language plpgsql security invoker set search_path='' as $$
declare state text;
begin
 perform pg_advisory_xact_lock(7312027);
 select status into state from public.reservations where id=p_id for update;
 if state is null or state not in ('pending','confirmed') then raise exception 'INVALID_CANCEL_STATUS'; end if;
 if exists(select 1 from public.reservation_items where reservation_id=p_id and delivered_at is not null) then raise exception 'INVALID_ALREADY_DELIVERED'; end if;
 update public.reservations set status='cancelled' where id=p_id;
 return true;
end $$;

create function public.admin_mark_delivered(p_reservation uuid,p_product text) returns boolean language plpgsql security invoker set search_path='' as $$
begin
 perform pg_advisory_xact_lock(7312027);
 if not exists(select 1 from public.reservations where id=p_reservation and status in ('confirmed','paid')) then raise exception 'INVALID_DELIVERY_STATUS'; end if;
 update public.reservation_items set delivered_at=coalesce(delivered_at,now()) where reservation_id=p_reservation and product_id=p_product and delivery='bring';
 if not found then raise exception 'INVALID_PHYSICAL_ITEM'; end if;
 return true;
end $$;
revoke all on function public.admin_update_catalog(text,integer,integer),public.admin_cancel_reservation(uuid),public.admin_mark_delivered(uuid,text) from public,anon,authenticated;
grant execute on function public.admin_update_catalog(text,integer,integer),public.admin_cancel_reservation(uuid),public.admin_mark_delivered(uuid,text) to service_role;
