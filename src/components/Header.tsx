import React, { useState } from 'react';
import { PatientId, PatientProfile } from '../types/medical';

interface Props {
  patients: PatientProfile[];
  currentPatientId: PatientId;
  onSelectPatient: (id: PatientId) => void;
  currentView: 'split' | 'patient' | 'responder' | 'audit' | 'directives' | 'directory';
  onSelectView: (view: Props['currentView']) => void;
  activeTunnel: boolean;
}
export const Header: React.FC<Props> = ({ patients, currentPatientId, onSelectPatient, currentView, onSelectView }) => {
  const [query,setQuery]=useState('');
  const selected=patients.find(p=>p.id===currentPatientId)!;
  const matches=patients.filter(p=>`${p.name} ${p.mrn} ${p.id}`.toLowerCase().includes(query.toLowerCase())).slice(0,8);
  return <header className="fixed top-0 left-0 right-0 min-h-16 bg-[#0a0e16]/95 backdrop-blur-xl border-b border-[#3d494c]/40 z-50 flex flex-wrap items-center justify-between gap-2 px-3 lg:px-6 py-2">
    <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-[#06b6d4]/20 border border-[#4cd7f6]/40 flex items-center justify-center text-[#4cd7f6]"><span className="material-symbols-outlined">local_hospital</span></div><div><b className="text-sm text-white uppercase">MedBridge QR</b><div className="text-[10px] text-[#869397] font-mono">EHR BRIDGE v2.4</div></div><span className="hidden xl:block text-[10px] text-[#4cd7f6] border border-[#4cd7f6]/40 rounded-full px-2 py-1">100 SYNTHETIC RECORDS</span></div>
    <div className="relative flex-1 min-w-[210px] max-w-[390px] md:ml-4"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name, MRN, or Patient ID" aria-label="Search and select patient" className="w-full bg-[#181c24] border border-[#3d494c]/60 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4cd7f6]"/><div className="text-[9px] text-[#869397] mt-1 ml-1">Selected: {selected.name} · {selected.bloodGroup} · MRN {selected.mrn}</div>{query&&<div className="absolute top-full left-0 right-0 mt-1 max-h-72 overflow-auto rounded-lg border border-[#3d494c] bg-[#181c24] shadow-2xl z-[60]">{matches.map(p=><button key={p.id} onClick={()=>{onSelectPatient(p.id);setQuery('')}} className="w-full text-left px-3 py-2 hover:bg-[#262a33] flex justify-between gap-3"><span className="text-white text-xs">{p.name}<small className="block text-[#869397] font-mono">{p.id}</small></span><span className="text-[#4cd7f6] text-xs font-mono whitespace-nowrap">{p.bloodGroup} · {p.mrn}</span></button>)}{matches.length===0&&<div className="p-3 text-xs text-[#869397]">No matching patients</div>}</div>}</div>
    <nav className="hidden lg:flex gap-1 overflow-x-auto max-w-full">{(['split','patient','responder','directory'] as const).map((view,i)=><button key={view} onClick={()=>onSelectView(view)} className={`px-2 py-2 rounded text-[10px] whitespace-nowrap ${currentView===view?'bg-[#06b6d4] text-[#003640] font-bold':'text-[#bcc9cd] hover:bg-[#1c2028]'}`}>{['Split Demo','Patient Portal','Responder','Directory'][i]}</button>)}</nav>
  </header>;
};
