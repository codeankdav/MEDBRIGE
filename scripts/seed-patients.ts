import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { PATIENT_LIST } from '../src/data/patients';

const file=path.resolve('data/medbridge-db.json');mkdirSync(path.dirname(file),{recursive:true});
const current=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{schemaVersion:1,patients:[],tokens:[],audit:[]};
const patients=new Map((current.patients||[]).map((p:any)=>[p.id,p]));
for(const p of PATIENT_LIST)patients.set(p.id,p);
writeFileSync(file,JSON.stringify({...current,schemaVersion:1,patients:[...patients.values()],tokens:current.tokens||[],audit:current.audit||[]},null,2));
console.log(`Seed complete: ${patients.size} unique synthetic patient records in ${file}`);
