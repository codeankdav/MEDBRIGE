import express from 'express';
import { createHash, randomBytes, randomInt } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { PATIENT_LIST } from './src/data/patients';
import { ConsentScopes } from './src/types/medical';

type Token={id:string;patientId:string;tokenHash:string;pinHash:string;expiresAt:number;revoked:boolean;used:boolean;scopes:ConsentScopes};
type DB={schemaVersion:number;patients:typeof PATIENT_LIST;tokens:Token[];audit:Array<{at:string;patientId:string;event:string;actor:string}>};
const dbPath = process.env.VERCEL
  ? path.resolve('/tmp/medbridge-db.json')
  : path.resolve('data/medbridge-db.json');
try { mkdirSync(path.dirname(dbPath), { recursive: true }); } catch {}
const initial: DB = { schemaVersion: 1, patients: PATIENT_LIST, tokens: [], audit: [] };
let db: DB = initial;
try {
  const seedFile = path.resolve('data/medbridge-db.json');
  if (existsSync(seedFile)) {
    db = JSON.parse(readFileSync(seedFile, 'utf8'));
  }
} catch {
  db = initial;
}
// Idempotent seed: IDs are the key, so existing records are retained and missing synthetic records are added.
const byId = new Map(db.patients.map(p => [p.id, p]));
for (const p of PATIENT_LIST) byId.set(p.id, p);
db = { ...db, schemaVersion: 1, patients: [...byId.values()] };
function persist() {
  try {
    writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch {}
}
function audit(patientId:string,event:string,actor:string){db.audit.unshift({at:new Date().toISOString(),patientId,event,actor});persist();}
function hash(value:string){return createHash('sha256').update(value).digest('hex');}
const app=express();app.use(express.json({limit:'32kb'}));
app.get('/api/patients',(_req,res)=>res.json(db.patients.map(p=>({id:p.id,name:p.name,mrn:p.mrn,bloodGroup:p.bloodGroup,dob:p.dob,gender:p.gender,accountStatus:p.accountStatus}))));
app.post('/api/tokens',(req,res)=>{
 const {patientId,duration,scopes}=req.body||{}; const patient=db.patients.find(p=>p.id===patientId); const ttl:Record<string,number>={'45s':45,'15m':900,'1h':3600};
 if(!patient||!ttl[duration]) return res.status(400).json({error:'Unknown patient or duration'});
 const raw=randomBytes(32).toString('base64url'); let pin=`${randomInt(100,1000)}-${randomInt(100,1000)}`;
 const safeScopes:ConsentScopes={bloodAllergies:!!scopes?.bloodAllergies,medicationsImplants:!!scopes?.medicationsImplants,chronicConditions:!!scopes?.chronicConditions,emergencyContacts:!!scopes?.emergencyContacts,sensitiveHistory:!!scopes?.sensitiveHistory};
 const token:Token={id:randomBytes(12).toString('hex'),patientId,tokenHash:hash(raw),pinHash:hash(pin),expiresAt:Date.now()+ttl[duration]*1000,revoked:false,used:false,scopes:safeScopes};
 for(const previous of db.tokens)if(previous.patientId===patientId&&!previous.revoked&&previous.expiresAt>Date.now()){previous.revoked=true;audit(patientId,'TOKEN_REPLACED','patient-self');}
 db.tokens.push(token);audit(patientId,'TOKEN_MINTED','patient-self');res.status(201).json({id:token.id,token:raw,pin,expiresAt:token.expiresAt,qrUrl:`${req.protocol}://${req.get('host')}/?access=${encodeURIComponent(raw)}`});
});
app.post('/api/tokens/:id/revoke',(req,res)=>{const t=db.tokens.find(x=>x.id===req.params.id);if(!t)return res.status(404).json({error:'Token not found'});t.revoked=true;audit(t.patientId,'TOKEN_REVOKED','patient-self');res.json({ok:true});});
app.post('/api/responders/access',(req,res)=>{
 const badge=req.header('x-responder-badge');
 if(badge!=='ER-402'){
   audit('unknown','RESPONDER_ACCESS_DENIED',badge||'unauthorized');
   return res.status(403).json({error:'Responder authorization required'});
 }
 const presented=String(req.body?.credential||'');
 let credential=presented;
 try{if(presented.includes('?access='))credential=new URL(presented).searchParams.get('access')||presented;}catch{}

 const isBreakGlass=req.body?.breakGlass===true||req.header('x-break-glass')==='true';
 const cleanCred=credential.trim();
 const cleanHyphen=cleanCred.replace(/^(\d{3})(\d{3})$/,'$1-$2');
 const cleanPlain=cleanCred.replace(/-/g,'');
 const candidateHashes=[hash(cleanCred),hash(cleanHyphen),hash(cleanPlain)];

 let t=db.tokens.find(x=>candidateHashes.includes(x.tokenHash)||candidateHashes.includes(x.pinHash));

 if(!t&&!isBreakGlass){
   audit('unknown','INVALID_RESPONDER_CREDENTIAL',badge);
   return res.status(404).json({error:'Invalid credential'});
 }

 const targetPatientId=t ? t.patientId : (req.body?.patientId || db.patients[0].id);
 const patient=db.patients.find(p=>p.id===targetPatientId) || db.patients[0];

 if(t){
   t.used=true;
 }

 audit(patient.id, isBreakGlass ? 'EMERGENCY_BREAK_GLASS_OVERRIDE' : 'RESPONDER_ACCESS_GRANTED', badge);

 const scopes: ConsentScopes = isBreakGlass ? {
   bloodAllergies: true,
   medicationsImplants: true,
   chronicConditions: true,
   emergencyContacts: true,
   sensitiveHistory: true,
 } : (t ? t.scopes : {
   bloodAllergies: true,
   medicationsImplants: true,
   chronicConditions: true,
   emergencyContacts: true,
   sensitiveHistory: false,
 });

 const result:any={id:patient.id,name:patient.name,mrn:patient.mrn};
 if(scopes.bloodAllergies){result.bloodGroup=patient.bloodGroup;result.allergies=patient.allergies;result.triageVitals=patient.triageVitals;}
 if(scopes.medicationsImplants){result.medications=patient.medications;result.implants=patient.implants;}
 if(scopes.chronicConditions){result.chronicConditions=patient.chronicConditions;result.directives=patient.directives;}
 if(scopes.emergencyContacts)result.emergencyContacts=patient.emergencyContacts;
 if(scopes.sensitiveHistory)result.sensitiveHistory=patient.sensitiveHistory;

 res.json({patient:result,scopes});
});
app.get('/api/audit',(_req,res)=>res.json(db.audit));
persist();
if (!process.env.VERCEL) {
  app.listen(3001, '127.0.0.1', () =>
    console.log(`MedBridge API ready on http://127.0.0.1:3001 (${db.patients.length} patients)`)
  );
}

export default app;
