import {z} from 'zod';
import {route,json,idSchema,reservation,ApiError,db,rate,rpc,bearer,tokenHash} from '@/lib/server/core';
import {paymentsEnabled,infinite,handle} from '@/lib/server/payments';
export const POST=route(async(req)=>{
 paymentsEnabled();await rate(req,'checkout',8);const body=z.object({reservationId:idSchema}).parse(await json(req));const r=await reservation(req,body.reservationId);
 if(r.status!=='pending'||new Date(r.expires_at).getTime()<=Date.now())throw new ApiError(409,'Sua reserva expirou ou já foi finalizada.');
 if(r.checkout_url&&r.checkout_url!=='__creating__')return Response.json({url:r.checkout_url});
 const site=process.env.NEXT_PUBLIC_SITE_URL;if(!site||!site.startsWith('https://'))throw new ApiError(503,'O pagamento ainda está sendo configurado.');
 await rpc('claim_checkout',{p_id:r.id,p_token_hash:tokenHash(bearer(req))});
 const client=db();const {data:items,error}=await client.from('reservation_items').select('price_cents,product_id,catalog_items(name)').eq('reservation_id',r.id).eq('delivery','pay');
 if(error||!items?.length)throw new ApiError(503,'Não foi possível preparar o pagamento.');
 const result=await infinite('links',{handle:handle(),order_nsu:r.id,redirect_url:`${site.replace(/\/$/,'')}/pagamento`,webhook_url:`${site.replace(/\/$/,'')}/api/webhooks/infinitepay`,items:items.map((i:any)=>({quantity:1,price:i.price_cents,description:i.catalog_items?.name||i.product_id}))});
 const url=z.string().url().parse(result.url);const parsed=new URL(url);
 if(parsed.protocol!=='https:'||!['checkout.infinitepay.com.br','checkout.infinitepay.io'].includes(parsed.hostname))throw new ApiError(502,'Endereço de pagamento inválido.');
 const {error:saveError}=await client.from('reservations').update({checkout_url:url}).eq('id',r.id).eq('checkout_url','__creating__');if(saveError)throw new ApiError(503,'Pagamento iniciado. Aguarde e entre em contato com a família antes de tentar novamente.');
 return Response.json({url});
});
