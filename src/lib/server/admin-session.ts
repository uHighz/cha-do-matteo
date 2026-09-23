import 'server-only';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { admin, ApiError } from './core';
export const sessionCookie='matteo_admin';
export function authClient(){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key)throw new ApiError(503,'Acesso administrativo ainda em configuração.');
  return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
}
export async function requireAdmin(){
  const token=(await cookies()).get(sessionCookie)?.value;
  if(!token)throw new ApiError(401,'Entre para acessar o painel.');
  return admin(token);
}
export async function saveSession(token:string,expires:number){
  (await cookies()).set(sessionCookie,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:Math.min(expires,3600)});
}
