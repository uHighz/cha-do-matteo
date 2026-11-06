import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { createHash, randomBytes } from 'node:crypto';
import { z } from 'zod';

export class ApiError extends Error { constructor(public status:number,message:string){super(message);} }
export function db(){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key) throw new ApiError(503,'O serviço ainda está sendo configurado. Tente novamente mais tarde.');
  return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
}
export const tokenHash=(token:string)=>createHash('sha256').update(token).digest('hex');
export const newToken=()=>randomBytes(32).toString('base64url');
export function bearer(req:Request){const token=req.headers.get('authorization')?.replace(/^Bearer /,'');if(!token||token.length<32||token.length>200)throw new ApiError(401,'Acesso não autorizado.');return token;}
export async function guest(req:Request,id:string){
  const {data,error}=await db().from('rsvps').select('id,name,attending').eq('id',id).eq('token_hash',tokenHash(bearer(req))).maybeSingle();
  if(error)throw new ApiError(503,'Não foi possível consultar sua confirmação.');if(!data)throw new ApiError(401,'Confirmação não encontrada.');return data;
}
export async function reservation(req:Request,id:string){
  const {data,error}=await db().from('reservations').select('*').eq('id',id).eq('token_hash',tokenHash(bearer(req))).maybeSingle();
  if(error)throw new ApiError(503,'Não foi possível consultar a reserva.');if(!data)throw new ApiError(401,'Reserva não encontrada.');return data;
}
export async function admin(token:string){
  const {data,error}=await db().auth.getUser(token);
  const allowed=(process.env.ADMIN_USER_IDS||process.env.ADMIN_USER_ID||'').split(',').map(x=>x.trim());
  if(error||!data.user||(!allowed.includes(data.user.id)&&data.user.app_metadata?.role!=='admin'))throw new ApiError(403,'Acesso restrito.');return data.user;
}
export async function json(req:Request){
  if(Number(req.headers.get('content-length')||0)>20000)throw new ApiError(413,'Dados muito grandes.');
  const raw=await req.text();if(raw.length>20000)throw new ApiError(413,'Dados muito grandes.');
  try{return JSON.parse(raw);}catch{throw new ApiError(400,'Dados inválidos.');}
}
export function route(fn:(req:Request,ctx:any)=>Promise<Response>){return async(req:Request,ctx:any)=>{try{
  if(!['GET','HEAD'].includes(req.method)){
    const origin=req.headers.get('origin');const expected=new URL(process.env.NEXT_PUBLIC_SITE_URL||req.url).origin;
    if(origin&&origin!==expected)throw new ApiError(403,'Origem não permitida.');
  }
  return await fn(req,ctx);
}catch(e){if(e instanceof z.ZodError)return Response.json({error:'Confira os campos informados.'},{status:400});
if(e instanceof ApiError)return Response.json({error:e.message},{status:e.status});
console.error('API failure',e instanceof Error?e.message:'unknown');return Response.json({error:'Não foi possível concluir. Tente novamente.'},{status:503});}};}
export async function rpc(name:string,args:Record<string,unknown>){const {data,error}=await db().rpc(name,args);if(error){if(error.message.includes('GUEST_HAS_CONFIRMED_GIFTS'))throw new ApiError(409,'Este convidado tem presentes confirmados ou pagamento em andamento. Cancele a reserva primeiro para proteger os presentes e o pagamento.');if(error.message.includes('SOLD_OUT'))throw new ApiError(409,'Um dos presentes acabou de ser reservado. Escolha outro.');if(error.message.includes('EXPIRED'))throw new ApiError(409,'Sua reserva expirou. Escolha os presentes novamente.');if(error.message.includes('INVALID'))throw new ApiError(400,'Seleção inválida.');throw new ApiError(503,'Não foi possível concluir sua solicitação.');}return data;}
export async function rate(req:Request,scope:string,limit=15){
  const ip=req.headers.get('x-vercel-forwarded-for')||req.headers.get('x-forwarded-for')?.split(',')[0]||'local';
  const key=tokenHash(scope+':'+ip);const ok=await rpc('check_rate',{p_key:key,p_limit:limit});if(!ok)throw new ApiError(429,'Muitas tentativas. Aguarde alguns minutos.');
}
export { idSchema, itemsSchema } from '../validation';
