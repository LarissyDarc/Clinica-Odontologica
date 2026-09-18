import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequest, createRequestId, validateRequest, readRequests, saveRequest, removeRequest, sendRequest, STORAGE_KEY } from '../src/requests.js';
const record = { id: 'ef5a2446-8b47-468e-a9af-5d9c8f5e8d42', name: 'Teste', email: 'teste@example.com', service: 'Ortodontia', consent: true, createdAt: new Date().toISOString(), status: 'pending' };
const config = { url: 'https://example.supabase.co', key: 'sb_publishable_test' };
function storage() { const data = new Map(); return { getItem: k => data.get(k) ?? null, setItem: (k,v) => data.set(k,v) }; }
test('records persist and syncing the same id does not duplicate local history', () => {
 const local = storage(); saveRequest(local,record); assert.equal(readRequests(local).length,1);
 saveRequest(local,{...record,status:'synced'}); assert.equal(readRequests(local).length,1); assert.equal(readRequests(local)[0].status,'synced');
 assert.equal(removeRequest(local,record.id).length,0);
});
test('corrupt storage is not silently overwritten', () => {
 const local=storage(); local.setItem(STORAGE_KEY,'bad json'); assert.throws(()=>saveRequest(local,record)); assert.equal(local.getItem(STORAGE_KEY),'bad json');
});
test('storage quota failures and missing consent do not report success', () => {
 assert.throws(()=>saveRequest({getItem:()=>null,setItem:()=>{throw Error('Quota');}},record));
 assert.throws(()=>saveRequest(storage(),{...record,consent:false}));
});
test('remote failure leaves durable pending record for retry with the same id', async () => {
 const local=storage(); saveRequest(local,record);
 await assert.rejects(sendRequest(record,config,async()=>({ok:false}))); assert.equal(readRequests(local)[0].status,'pending');
 let payload;
 const result=await sendRequest(readRequests(local)[0],config,async(url,options)=>{payload=JSON.parse(options.body);assert.equal(url,'https://example.supabase.co/rest/v1/rpc/submit_appointment');return {ok:true};});
 assert.equal(payload.p_id,record.id); assert.equal(result.status,'synced');
});
test('without configuration no network request is attempted', async () => {
 await assert.rejects(sendRequest(record,{url:'',key:''},()=>{throw Error('Should not call');}),/configurado/);
});
test('submission works without randomUUID, including local network HTTP access', () => {
 const fallback = { getRandomValues: array => globalThis.crypto.getRandomValues(array) };
 const id = createRequestId(fallback);
 assert.match(id,/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
 assert.notEqual(id,createRequestId(fallback));
 assert.ok(validateRequest(createRequest(record,null,fallback)));
});
test('retry after both storage and network failures keeps id until data changes', () => {
 const first = createRequest(record);
 assert.equal(createRequest(record,first).id,first.id);
 assert.notEqual(createRequest({...record,name:'Outra pessoa'},first).id,first.id);
});
test('malformed UUIDs are rejected before they reach PostgreSQL', () => {
 assert.equal(validateRequest({...record,id:'a'.repeat(36)}),false);
});
test('missing crypto and invalid fields are handled as validation failures', () => {
 assert.throws(()=>createRequestId({}),/navegador/);
 assert.throws(()=>createRequest({...record,name:'  '}),/Informe/);
});
test('remote request does not depend on AbortSignal.timeout browser support', async () => {
 const original = AbortSignal.timeout;
 try {
  AbortSignal.timeout = undefined;
  const result = await sendRequest(record,config,async(url,options)=>{assert.ok(options.signal instanceof AbortSignal);return {ok:true};});
  assert.equal(result.status,'synced');
 } finally { AbortSignal.timeout = original; }
});