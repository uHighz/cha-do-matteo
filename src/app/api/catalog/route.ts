import {route,rpc} from '@/lib/server/core';
export const dynamic='force-dynamic';
export const GET=route(async()=>{const rows=await rpc('catalog_availability',{});return Response.json({items:rows.map((r:any)=>({id:r.id,name:r.name,kind:r.kind,priceCents:r.price_cents,available:r.available}))},{headers:{'Cache-Control':'no-store'}});});
