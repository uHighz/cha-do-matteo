import {z} from 'zod';
import {route,rate,json,idSchema,itemsSchema,guest,newToken,tokenHash,rpc} from '@/lib/server/core';
export const POST=route(async(req)=>{await rate(req,'reserve');const b=z.object({rsvpId:idSchema,items:itemsSchema}).parse(await json(req));await guest(req,b.rsvpId);const token=newToken();const data=await rpc('reserve_gifts',{p_rsvp:b.rsvpId,p_token_hash:tokenHash(token),p_items:b.items});return Response.json({...data,token},{status:201});});
