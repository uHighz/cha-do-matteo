import { z } from 'zod';
import { db, json, route, ApiError, rpc } from '@/lib/server/core';
import { requireAdmin } from '@/lib/server/admin-session';
export const GET=route(async()=>{
  await requireAdmin();const client=db();
  const tables=['rsvps','reservations','messages','photos','catalog_items'] as const;
  const selects=['id,name,whatsapp,attending,companions,created_at','id,rsvp_id,status,expires_at,amount,created_at,reservation_items(product_id,delivery,price_cents,delivered_at)','id,name,message,approved,created_at','id,name,path,approved,created_at','id,name,kind,price_cents,capacity'];
  const results=await Promise.all(tables.map((table,i)=>client.from(table).select(selects[i]).limit(1000)));
  if(results.some(x=>x.error))throw new ApiError(503,'Não foi possível carregar o painel.');
  const data=Object.fromEntries(tables.map((t,i)=>[t,results[i].data]));
  data.photos=await Promise.all((data.photos||[]).map(async (p:any)=>{const signed=await client.storage.from('guest-photos').createSignedUrl(p.path,600);return {...p,url:signed.data?.signedUrl};}));
  return Response.json(data,{headers:{'Cache-Control':'no-store'}});
});
export const PATCH=route(async req=>{
  await requireAdmin();
  const body=z.discriminatedUnion('kind',[
    z.object({kind:z.literal('messages'),id:z.string().uuid(),approved:z.boolean()}),
    z.object({kind:z.literal('photos'),id:z.string().uuid(),approved:z.boolean()}),
    z.object({kind:z.literal('catalog'),id:z.string().max(80),priceCents:z.number().int().positive().max(10000000),capacity:z.number().int().min(0).max(10000)}),
    z.object({kind:z.literal('cancel'),id:z.string().uuid()}),
    z.object({kind:z.literal('delivered'),id:z.string().uuid(),productId:z.string().max(80)})
  ]).parse(await json(req));
  if(body.kind==='catalog'){
    await rpc('admin_update_catalog',{p_id:body.id,p_price_cents:body.priceCents,p_capacity:body.capacity});
    return Response.json({ok:true});
  }
  if(body.kind==='cancel'){
    await rpc('admin_cancel_reservation',{p_id:body.id});
    return Response.json({ok:true});
  }
  if(body.kind==='delivered'){
    await rpc('admin_mark_delivered',{p_reservation:body.id,p_product:body.productId});
    return Response.json({ok:true});
  }
  const {error}=await db().from(body.kind).update({approved:body.approved}).eq('id',body.id);
  if(error)throw new ApiError(503,'Não foi possível salvar a aprovação.');
  return Response.json({ok:true});
});
