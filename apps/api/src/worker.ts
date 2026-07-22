import { SaveRequestSchema } from '@game/shared';
export interface Env { SAVES: KVNamespace; CORS_ORIGIN: string }
const json=(data:unknown,status=200,headers:HeadersInit={})=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json','cache-control':'private, no-store',...headers}});
export default { async fetch(req:Request,env:Env):Promise<Response>{
 const requestId=crypto.randomUUID(); const origin=req.headers.get('origin'); const cors:Record<string,string>=origin===env.CORS_ORIGIN?{'access-control-allow-origin':origin,vary:'Origin'}:{};
 if(origin&&origin!==env.CORS_ORIGIN)return json({error:'origin_not_allowed',requestId},403); if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 const url=new URL(req.url); if(url.pathname==='/v1/health'&&req.method==='GET')return json({ok:true,requestId},200,{'cache-control':'public, max-age=30',...cors});
 const token=req.headers.get('authorization')?.replace(/^Bearer /,''); if(!token||token.length<16)return json({error:'unauthorized',requestId},401,cors);
 const match=url.pathname.match(/^\/v1\/saves\/(\d)$/); if(!match)return json({error:'not_found',requestId},404,cors); const slot=Number(match[1]); if(slot>3)return json({error:'invalid_slot',requestId},400,cors);
 const key=`${await digest(token)}:${slot}`;
 if(req.method==='GET'){const value=await env.SAVES.get(key);if(!value)return json({error:'not_found',requestId},404,cors);const parsed=JSON.parse(value) as {revision:number};return json(parsed,200,{etag:`"${parsed.revision}"`,...cors});}
 if(req.method==='PUT'){if(Number(req.headers.get('content-length')??0)>262144)return json({error:'payload_too_large',requestId},413,cors);const idem=req.headers.get('idempotency-key');if(!idem)return json({error:'idempotency_key_required',requestId},400,cors);const prior=await env.SAVES.get(`idem:${key}:${idem}`);if(prior)return json(JSON.parse(prior),200,cors);let body:unknown;try{body=await req.json();}catch{return json({error:'invalid_json',requestId},400,cors);}const parsed=SaveRequestSchema.safeParse(body);if(!parsed.success||parsed.data.slot!==slot)return json({error:'invalid_body',requestId},400,cors);const current=await env.SAVES.get(key,'json') as {revision:number}|null;if(current&&req.headers.get('if-match')!==`"${current.revision}"`)return json({error:'conflict',requestId},412,{etag:`"${current.revision}"`,...cors});const result={...parsed.data,revision:(current?.revision??0)+1,updatedAt:new Date().toISOString()};await env.SAVES.put(key,JSON.stringify(result));await env.SAVES.put(`idem:${key}:${idem}`,JSON.stringify(result),{expirationTtl:86400});return json(result,200,{etag:`"${result.revision}"`,...cors});}
 return json({error:'method_not_allowed',requestId},405,cors);
}};
async function digest(value:string){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return [...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,'0')).join('');}
