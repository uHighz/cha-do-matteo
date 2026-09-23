import {route,json,reservation,rate} from '@/lib/server/core';
import {verifyPayment} from '@/lib/server/payments';
export const POST=route(async(req)=>{await rate(req,'payment-check',20);const body=await json(req);await reservation(req,body.order_nsu);return Response.json(await verifyPayment(body));});
