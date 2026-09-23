import { cookies } from 'next/headers';
import { route, db } from '@/lib/server/core';
import { sessionCookie } from '@/lib/server/admin-session';
export const POST=route(async()=>{
  const jar=await cookies();const token=jar.get(sessionCookie)?.value;
  if(token)await db().auth.admin.signOut(token,'local');
  jar.delete(sessionCookie);
  return Response.json({ok:true});
});
