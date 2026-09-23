import {route,json,rate} from '@/lib/server/core';
import {verifyPayment} from '@/lib/server/payments';
export const POST=route(async(req)=>{await rate(req,'payment-webhook',120);const body=await json(req);return Response.json(await verifyPayment({order_nsu:body.order_nsu,transaction_nsu:body.transaction_nsu,slug:body.invoice_slug||body.slug}));});
