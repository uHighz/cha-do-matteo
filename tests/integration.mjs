// Explicitly run with the Matteo Development env. All records created here are removed.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createClient} from '@supabase/supabase-js';
const base='http://localhost:3000';
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const created=[];
async function request(path,method='GET',body,token,cookie){const r=await fetch(base+path,{method,headers:{'Content-Type':'application/json',Origin:base,...(token?{Authorization:`Bearer ${token}`}:{ }),...(cookie?{Cookie:cookie}:{})},body:body===undefined?undefined:JSON.stringify(body)});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')};}
try{
 assert.equal((await request('/api/admin')).status,401);
 const credentials=JSON.parse(fs.readFileSync('.tools/admin-initial.json','utf8'));
 const login=await request('/api/auth/login','POST',credentials);assert.equal(login.status,200);assert.match(login.cookie,/HttpOnly/i);const cookie=login.cookie.split(';')[0];
 assert.equal((await request('/api/admin','GET',undefined,undefined,cookie)).status,200);
 console.log('PASS: admin login, HttpOnly cookie, private dashboard');
 const before=(await db.rpc('catalog_availability')).data.find(x=>x.id==='treat-towel').available;
 assert.equal(Number(before),2,'Expected original towel capacity before concurrency test');
 for(let i=0;i<3;i++){const person=await request('/api/rsvp','POST',{name:`QA integração ${i}`,whatsapp:'11999990001',attending:true,companions:[]});assert.equal(person.status,201);created.push(person.data);}
 const attempts=await Promise.all(created.map(person=>request('/api/reservations','POST',{rsvpId:person.id,items:[{productId:'diaper-xxg',delivery:'bring'},{productId:'treat-towel',delivery:'bring'}]},person.token)));
 assert.equal(attempts.filter(x=>x.status===201).length,2);assert.equal(attempts.filter(x=>x.status===409).length,1);
 console.log('PASS: concurrent requests do not oversell two available towels');
 const first=attempts.find(x=>x.status===201).data;
 const complete=await request(`/api/reservations/${first.id}/complete`,'POST',{},first.token);assert.equal(complete.data.status,'confirmed');
 assert.equal((await request(`/api/reservations/${first.id}/complete`,'POST',{},first.token)).data.status,'confirmed');
 assert.equal((await request(`/api/reservations/${first.id}`,'GET',undefined,'x'.repeat(43))).status,401);
 console.log('PASS: physical gift confirmation idempotent; wrong token refused');
 const person=created[0];
 assert.equal((await request('/api/messages','POST',{rsvpId:person.id,name:'QA',message:'Mensagem temporária de verificação'},person.token)).status,201);
 const {data:message}=await db.from('messages').select('id').eq('rsvp_id',person.id).single();
 assert.ok(!(await request('/api/messages')).data.items.some(x=>x.id===message.id));
 assert.equal((await request('/api/admin','PATCH',{kind:'messages',id:message.id,approved:true},undefined,cookie)).status,200);
 assert.ok((await request('/api/messages')).data.items.some(x=>x.id===message.id));
 console.log('PASS: messages private until admin approval');
 assert.equal((await request('/api/checkout','POST',{reservationId:first.id},first.token)).status,503);
 console.log('PASS: real payments remain disabled');
 assert.equal((await request('/api/auth/logout','POST',{},undefined,cookie)).status,200);
}finally{
 for(const person of created){for(const table of ['messages','photos','reservations']){const {error}=await db.from(table).delete().eq('rsvp_id',person.id);if(error)throw Error(`Cleanup failed for ${table}`);}const {error}=await db.from('rsvps').delete().eq('id',person.id);if(error)throw Error('Cleanup failed for RSVP');}
 console.log('Temporary integration records removed');
}
