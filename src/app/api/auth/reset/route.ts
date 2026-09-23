import { z } from 'zod';
import { admin, ApiError, json, rate, route } from '@/lib/server/core';
import { authClient } from '@/lib/server/admin-session';
export const POST=route(async req=>{
  await rate(req,'admin-reset',6);
  const input=z.object({accessToken:z.string().min(32).max(5000),refreshToken:z.string().min(10).max(5000),password:z.string().min(12).max(128)}).parse(await json(req));
  await admin(input.accessToken);
  const client=authClient();
  const {error:sessionError}=await client.auth.setSession({access_token:input.accessToken,refresh_token:input.refreshToken});
  if(sessionError)throw new ApiError(401,'Link expirado. Solicite outro.');
  const {error}=await client.auth.updateUser({password:input.password});
  if(error)throw new ApiError(400,'Não foi possível atualizar a senha. Use uma senha forte diferente da anterior.');
  await client.auth.signOut({scope:'global'});
  return Response.json({ok:true});
});
