import { z } from 'zod';
import { admin, ApiError, json, rate, route } from '@/lib/server/core';
import { authClient, saveSession } from '@/lib/server/admin-session';
export const POST=route(async req=>{
  await rate(req,'admin-login',6);
  const body=z.object({username:z.string().max(100),password:z.string().min(1).max(200)}).parse(await json(req));
  const email=process.env.ADMIN_EMAIL;
  if(!email||!process.env.ADMIN_USERNAME)throw new ApiError(503,'Acesso ainda em configuração.');
  if(body.username!==process.env.ADMIN_USERNAME)throw new ApiError(401,'Usuário ou senha incorretos.');
  const {data,error}=await authClient().auth.signInWithPassword({email,password:body.password});
  if(error||!data.session)throw new ApiError(401,'Usuário ou senha incorretos.');
  await admin(data.session.access_token);
  await saveSession(data.session.access_token,data.session.expires_in);
  return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});
});
