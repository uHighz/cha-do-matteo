import { ApiError, rate, route } from '@/lib/server/core';
import { authClient } from '@/lib/server/admin-session';
export const POST=route(async req=>{
  await rate(req,'admin-recover',3);
  const email=process.env.ADMIN_EMAIL;const site=process.env.NEXT_PUBLIC_SITE_URL;
  if(!email||!site)throw new ApiError(503,'Recuperação ainda em configuração.');
  const {error}=await authClient().auth.resetPasswordForEmail(email,{redirectTo:new URL('/admin/redefinir',site).href});
  if(error)throw new ApiError(503,'Não foi possível enviar a recuperação. Tente mais tarde.');
  return Response.json({message:'Confira o e-mail de recuperação cadastrado.'});
});
