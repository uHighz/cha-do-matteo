import {route,idSchema,rpc,bearer,tokenHash} from '@/lib/server/core';
export const POST=route(async(req,ctx)=>{const {id}=await ctx.params;idSchema.parse(id);return Response.json(await rpc('complete_reservation',{p_id:id,p_token_hash:tokenHash(bearer(req))}));});
