-- Run against an isolated database after applying the migration. Always rolls back.
begin;
do $$
declare a uuid; b uuid; r jsonb; r2 jsonb; status text; caught boolean;
begin
 update public.catalog_items set capacity=1 where id='diaper-p';
 insert into public.rsvps(name,whatsapp,attending,token_hash) values('Teste A','11999999999',true,'guest-a') returning id into a;
 insert into public.rsvps(name,whatsapp,attending,token_hash) values('Teste B','11999999998',true,'guest-b') returning id into b;
 r:=public.reserve_gifts(a,'reserve-a','[{"productId":"diaper-p","delivery":"bring"}]');
 caught:=false;
 begin perform public.complete_reservation((r->>'id')::uuid,'reserve-a'); exception when others then if sqlerrm like '%INVALID_MISSING_EXTRA%' then caught:=true; else raise; end if; end;
 if not caught then raise exception 'Missing extra accepted'; end if;
 caught:=false;
 begin perform public.reserve_gifts(b,'reserve-b','[{"productId":"diaper-p","delivery":"bring"}]'); exception when others then if sqlerrm like '%SOLD_OUT%' then caught:=true; else raise; end if; end;
 if not caught then raise exception 'Oversell accepted'; end if;
 update public.reservations set expires_at=now()-interval '1 minute' where id=(r->>'id')::uuid;
 r2:=public.reserve_gifts(b,'reserve-b','[{"productId":"diaper-p","delivery":"pay"},{"productId":"treat-wipes","delivery":"bring"}]');
 if (r2->>'amount')::integer<>10000 then raise exception 'Wrong server price'; end if;
 caught:=false;
 begin perform public.settle_payment((r2->>'id')::uuid,'transaction-test',1); exception when others then if sqlerrm like '%INVALID_PAYMENT%' then caught:=true; else raise; end if; end;
 if not caught then raise exception 'Wrong amount accepted'; end if;
 status:=public.settle_payment((r2->>'id')::uuid,'transaction-test',10000);
 if status<>'paid' then raise exception 'Payment not settled'; end if;
 status:=public.settle_payment((r2->>'id')::uuid,'transaction-test',10000);
 if status<>'paid' then raise exception 'Payment not idempotent'; end if;
 update public.reservations set amount=10000 where id=(r->>'id')::uuid;
 status:=public.settle_payment((r->>'id')::uuid,'late-transaction-test',10000);
 if status<>'needs_review' then raise exception 'Late payment consumed stock'; end if;
 if (select available from public.catalog_availability() where id='diaper-p')<>0 then raise exception 'Wrong remaining capacity'; end if;
 if has_function_privilege('anon','public.reserve_gifts(uuid,text,jsonb,uuid)','execute') then raise exception 'Anonymous RPC access'; end if;
 if has_table_privilege('anon','public.rsvps','select') then raise exception 'Guest PII accessible'; end if;
end $$;
rollback;
