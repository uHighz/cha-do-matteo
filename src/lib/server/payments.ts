import 'server-only';
import {z} from 'zod';
import {ApiError,db,rpc} from './core';
export function paymentsEnabled(){if(process.env.PAYMENTS_ENABLED!=='true')throw new ApiError(503,'Os pagamentos online ainda não estão disponíveis. Você pode escolher levar o presente.');}
export const handle=()=>process.env.INFINITEPAY_HANDLE||'gabriel-aquino02';
export async function infinite(path:string,payload:unknown){
 const response=await fetch(`https://api.checkout.infinitepay.io/${path}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000),cache:'no-store'});
 if(!response.ok)throw new ApiError(502,'O serviço de pagamento está temporariamente indisponível.');
 return response.json();
}
const proofSchema=z.object({order_nsu:z.string().uuid(),transaction_nsu:z.string().min(1).max(200),slug:z.string().min(1).max(200)});
export async function verifyPayment(input:unknown){
 paymentsEnabled();const proof=proofSchema.parse(input);
 const {data:order,error}=await db().from('reservations').select('id,amount,checkout_url').eq('id',proof.order_nsu).maybeSingle();
 if(error)throw new ApiError(503,'Não foi possível consultar o pedido.');
 if(!order||order.amount<=0||!order.checkout_url)throw new ApiError(400,'Pedido inválido.');
 const check=await infinite('payment_check',{handle:handle(),...proof});
 // Neither redirect parameters nor webhook contents constitute payment proof.
 if(check.success!==true||check.paid!==true)return {status:'pending'};
 if(!Number.isSafeInteger(check.amount)||check.amount!==order.amount)throw new ApiError(409,'O valor recebido precisa de conferência pela família.');
 const status=await rpc('settle_payment',{p_id:order.id,p_transaction:proof.transaction_nsu,p_amount:check.amount});
 return {status};
}
