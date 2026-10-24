import React, { useState } from 'react';
import { PatientProfile, ConsentScopes } from '../types/medical';
import { sound } from '../utils/audio';

interface Props {
  patient: PatientProfile;
  scopes: ConsentScopes;
  accessPin: string;
  isUnlocked: boolean;
  onUnlockToggle: () => void;
  onBreakGlass?: () => void;
  isRevoked: boolean;
  humanVerified: boolean;
  onToggleHumanVerified: () => void;
  onLogAction: (event: string, status: 'VERIFIED' | 'ACCESS GRANTED' | 'OVERRIDE APPLIED') => void;
  onVerify: (credential: string) => Promise<boolean>;
  qrToken: string;
}

export const ResponderTriageView: React.FC<Props> = ({
  patient,
  scopes,
  accessPin,
  isUnlocked,
  onUnlockToggle,
  onBreakGlass,
  isRevoked,
  humanVerified,
  onToggleHumanVerified,
  onLogAction,
  onVerify,
  qrToken,
}) => {
  const [pinInput, setPinInput] = useState(accessPin || '');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (accessPin && (!pinInput || pinInput.length < 5)) {
      setPinInput(accessPin);
    }
  }, [accessPin]);

  const handleQuickAction = (actionName: string) => {
    sound.beep(750, 0.15);
    setActionNotice(`Executing Protocol: ${actionName}`);
    onLogAction(actionName.toUpperCase().replace(/\s+/g, '_'), 'VERIFIED');
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleSimulateScan = () => {
    sound.scanSuccess();
    setPinInput(accessPin);
    void verifyCredential(qrToken || accessPin);
  };
  const verifyCredential = async (credential:string) => {
    const credToTest = credential || pinInput || accessPin;
    const ok=await onVerify(credToTest);
    setVerifyMessage(ok?'Token verified. Authorized categories opened.':'Credential rejected. Click Break-Glass to override.');
    setTimeout(()=>setVerifyMessage(null),4000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-12">
      {/* Paramedic Header Bar */}
      <div className="bg-[#181c24] border border-[#3d494c]/40 rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#00a572]/20 border border-[#4edea3]/40 flex items-center justify-center text-[#4edea3] shrink-0">
            <span className="material-symbols-outlined text-[28px]">medical_services</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">FirstNet Paramedic Triage Console</h2>
              <span className="bg-[#00a572]/20 text-[#4edea3] text-xs font-mono px-2 py-0.5 rounded font-bold">
                MEDIC-4 • UNIT ACTIVE
              </span>
            </div>
            {verifyMessage && <p className="text-xs mt-2 text-[#4cd7f6]" role="status">{verifyMessage}</p>}
            <p className="text-xs text-[#bcc9cd] font-mono mt-0.5">
              Responder: Dr. Kabir Sharma (Badge #ER-402) • Station: St. Mary Trauma Center Bay 3
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              sound.beep(880, 0.15);
              if (onBreakGlass) onBreakGlass();
              else onUnlockToggle();
              setActionNotice('EMERGENCY BREAK-GLASS OVERRIDE EXECUTED');
              setTimeout(() => setActionNotice(null), 3500);
            }}
            className="px-3.5 py-2 bg-[#e79400]/20 hover:bg-[#e79400]/30 text-[#ffb95f] border border-[#ffb95f]/40 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
            title="Immediately unseal all clinical records under Emergency Break-Glass protocol"
          >
            <span className="material-symbols-outlined text-[18px]">lock_open</span>
            Break-Glass (Unlock All)
          </button>
          <button
            onClick={handleSimulateScan}
            disabled={isRevoked}
            className="px-3.5 py-2 bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#003640] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-[#06b6d4]/20"
          >
            <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            Scan Patient QR
          </button>
          <button
            onClick={() => isUnlocked ? onUnlockToggle() : void verifyCredential(pinInput || accessPin)}
            disabled={isRevoked}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              isUnlocked
                ? 'bg-[#262a33] text-[#4cd7f6] hover:bg-[#31353e]'
                : 'bg-[#4edea3] text-[#003824] hover:bg-[#6ffbbe]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isUnlocked ? 'lock' : 'verified'}
            </span>
            {isUnlocked ? 'Lock Chart' : 'Verify Credentials'}
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="bg-[#00a572]/20 border border-[#4edea3] text-[#4edea3] px-4 py-2.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 animate-pulse">
          <span className="material-symbols-outlined text-[18px]">emergency</span>
          {actionNotice} (Notarized to Ledger)
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Triage Status & Fast Actions (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Paramedic Scanner / PIN unlock box */}
          <div className="bg-[#181c24] border border-[#3d494c]/40 rounded-xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">
                dialpad
              </span>
              6-Digit Ephemeral Intake PIN
            </h3>

            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                maxLength={8}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder={accessPin || "482-910"}
                className="w-full bg-[#0a0e16] border border-[#3d494c]/50 rounded-lg px-3 py-2 text-center font-mono text-xl text-[#4edea3] tracking-widest font-extrabold focus:outline-none focus:border-[#4cd7f6]"
              />
              <button
                onClick={() => {
                  setPinInput(accessPin);
                  sound.scanSuccess();
                  void verifyCredential(accessPin);
                }}
                className="px-2.5 py-2 bg-[#262a33] hover:bg-[#31353e] text-[#4cd7f6] text-[10px] font-mono rounded-lg shrink-0 flex items-center gap-1"
                title="Auto-fill active patient PIN and unlock"
              >
                <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                Auto-Fill
              </button>
            </div>

            <button
              onClick={() => { sound.scanSuccess(); if(isUnlocked){onUnlockToggle();return;} void verifyCredential(pinInput || accessPin); }}
              disabled={isRevoked}
              className="w-full py-2 bg-[#4edea3] hover:bg-[#6ffbbe] text-[#003824] font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow"
            >
              <span className="material-symbols-outlined text-[16px]">key</span>
              {isUnlocked ? 'Re-verify / Lock Chart' : 'Verify access token'}
            </button>
          </div>

          {/* Quick Life-Safety Protocol Buttons */}
          <div className="bg-[#181c24] border border-[#3d494c]/40 rounded-xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffb4ab] text-[18px]">
                flash_on
              </span>
              Emergency Trauma Protocols
            </h3>
            <div className="space-y-2.5">
              <button
                onClick={() => handleQuickAction(`Transfusion compatibility review: ${patient.bloodGroup}`)}
                className="w-full p-2.5 bg-[#93000a]/30 hover:bg-[#93000a]/50 text-[#ffb4ab] border border-[#93000a] rounded-lg text-left text-xs font-bold flex items-center justify-between transition-colors"
              >
                <span>Blood Group: {patient.bloodGroup} · Confirm crossmatch</span>
                <span className="material-symbols-outlined text-[16px]">bloodtype</span>
              </button>

              <button
                onClick={() => handleQuickAction('Administer Epinephrine 0.3mg IM')}
                className="w-full p-2.5 bg-[#e79400]/20 hover:bg-[#e79400]/30 text-[#ffb95f] border border-[#ffb95f]/40 rounded-lg text-left text-xs font-bold flex items-center justify-between transition-colors"
              >
                <span>Administer Epinephrine IM (Anaphylaxis)</span>
                <span className="material-symbols-outlined text-[16px]">vaccines</span>
              </button>

              <button
                onClick={() => handleQuickAction('Cardiac Cath Bay Activation')}
                className="w-full p-2.5 bg-[#06b6d4]/20 hover:bg-[#06b6d4]/30 text-[#4cd7f6] border border-[#4cd7f6]/40 rounded-lg text-left text-xs font-bold flex items-center justify-between transition-colors"
              >
                <span>Telemetry Broadcast to Trauma Bay</span>
                <span className="material-symbols-outlined text-[16px]">broadcast_on_personal</span>
              </button>
            </div>
          </div>

          {/* Vitals Telemetry Live Monitor */}
          {isUnlocked && !isRevoked && scopes.bloodAllergies ? <div className="bg-[#0a0e16] border border-[#3d494c]/40 rounded-xl p-4 shadow-xl font-mono text-xs">
            <div className="text-[10px] text-[#869397] uppercase mb-2 flex items-center justify-between">
              <span>Telemetry Monitor</span>
              <span className="text-[#4edea3] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-ping" />
                LIVE
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-[#1c2028] p-2 rounded">
                <span className="text-[10px] text-[#869397] block">HEART RATE</span>
                <span className="text-base font-bold text-white">{patient.triageVitals?.heartRate || 'Not recorded'}</span>
              </div>
              <div className="bg-[#1c2028] p-2 rounded">
                <span className="text-[10px] text-[#869397] block">BLOOD PRESS.</span>
                <span className="text-base font-bold text-[#4cd7f6]">{patient.triageVitals?.bloodPressure || 'Not recorded'}</span>
              </div>
              <div className="bg-[#1c2028] p-2 rounded">
                <span className="text-[10px] text-[#869397] block">SpO2</span>
                <span className="text-base font-bold text-[#4edea3]">{patient.triageVitals?.spo2 || 'Not recorded'}</span>
              </div>
              <div className="bg-[#1c2028] p-2 rounded">
                <span className="text-[10px] text-[#869397] block">GLUCOSE</span>
                <span className="text-base font-bold text-[#ffb95f]">{patient.triageVitals?.glucose || 'Not recorded'}</span>
              </div>
            </div>
          </div> : <div className="bg-[#0a0e16] border border-[#3d494c]/40 rounded-xl p-4 text-xs text-[#869397]">Vitals protected by patient consent.</div>}
        </div>

        {/* Right Column: Consent-authorized Patient Chart (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* AI Contraindication Banner */}
          <div className="bg-[#e79400]/20 border border-[#ffb95f]/40 p-4 rounded-xl shadow-md">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#ffb95f] text-[26px] shrink-0 mt-0.5">
                warning
              </span>
              <div className="flex flex-col w-full">
                <span className="text-xs text-[#ffb95f] font-bold tracking-tight uppercase">
                  AI Clinical Contraindication Summary
                </span>
                <div className="text-sm text-white font-medium my-1">
                  {isUnlocked && scopes.bloodAllergies ? (
                    patient.aiContraindicationSummary
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[#bcc9cd]">Verify patient access or trigger Break-Glass to view clinical contraindication details.</span>
                      <button
                        onClick={() => onBreakGlass ? onBreakGlass() : onUnlockToggle()}
                        className="px-2.5 py-1 bg-[#ffb95f]/20 hover:bg-[#ffb95f]/30 text-[#ffb95f] border border-[#ffb95f]/40 rounded text-xs font-bold transition-colors shrink-0 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">lock_open</span>
                        Unlock Details
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#ffb95f]/30">
                  <label className="flex items-center gap-2 cursor-pointer select-none bg-[#0a0e16]/80 px-3 py-1.5 rounded-lg border border-[#ffb95f]/40 w-full hover:bg-[#0a0e16]">
                    <input
                      type="checkbox"
                      checked={humanVerified}
                      onChange={onToggleHumanVerified}
                      className="w-4 h-4 rounded bg-[#31353e] accent-[#4edea3] border-none cursor-pointer"
                    />
                    <span className="text-xs text-[#4edea3] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        {humanVerified ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      Human Review: Clinician verified against primary records
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Blood */}
            <div className="bg-[#181c24] border border-[#ffb4ab]/30 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-[#ffb4ab] font-bold uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">water_drop</span>
                  Blood Group
                </span>
                <span className="bg-[#31353e] text-[#869397] text-xs font-mono px-2 py-0.5 rounded font-bold">
                  {scopes.bloodAllergies && !isRevoked && isUnlocked ? patient.rhFactor : 'LOCKED'}
                </span>
              </div>

              {scopes.bloodAllergies && !isRevoked && isUnlocked ? (
                <div>
                  <div className="text-5xl font-black text-[#ffb4ab] font-mono my-2">
                    {patient.bloodGroup}
                  </div>
                  <div className="text-xs font-bold text-white mb-2">
                    {patient.universalDonor
                      ? 'UNIVERSAL ERYTHROCYTE DONOR'
                      : `${patient.bloodGroup} TYPED`}
                  </div>
                  <div className="bg-[#0a0e16] p-2.5 rounded-lg text-xs font-mono text-[#869397]">
                    Antibody Screen:{' '}
                    <span className="text-[#4edea3] font-bold">{patient.antibodyScreen}</span>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-[#869397] font-mono flex flex-col items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[24px]">lock</span>
                  <p className="mt-1">Hidden until token verification or override</p>
                  <button
                    onClick={() => onBreakGlass ? onBreakGlass() : onUnlockToggle()}
                    className="mt-1 px-3 py-1 bg-[#4edea3]/20 hover:bg-[#4edea3]/30 text-[#4edea3] border border-[#4edea3]/40 rounded-lg text-xs font-sans font-bold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">lock_open</span>
                    Unlock Chart
                  </button>
                </div>
              )}
            </div>

            {/* Card 2: Allergies */}
            <div className="bg-[#181c24] border border-[#3d494c]/40 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-[#ffb95f] font-bold uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">report_problem</span>
                  Severe Allergies
                </span>
                <span className="bg-[#31353e] text-[#869397] text-xs font-mono px-2 py-0.5 rounded font-bold">
                  {scopes.bloodAllergies && !isRevoked && isUnlocked ? 'SHARED' : 'LOCKED'}
                </span>
              </div>

              {scopes.bloodAllergies && !isRevoked && isUnlocked ? (
                <div className="space-y-2 mt-2">
                  {patient.allergies.map((allergy, idx) => (
                    <div
                      key={idx}
                      className="bg-[#1c2028] p-2.5 rounded-lg border border-[#31353e] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                        <span className="text-xs text-white font-bold">{allergy.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#ffb4ab] font-bold uppercase">
                        {allergy.reaction}
                      </span>
                    </div>
                  ))}
                  <div className="bg-[#0a0e16] p-2 rounded text-[11px] font-mono text-[#869397] flex items-center justify-between">
                    <span>
                      Contraindication:{' '}
                      <strong className="text-[#ffb4ab]">
                        {patient.allergies[0]?.contraindications}
                      </strong>
                    </span>
                    {patient.allergies[0]?.rescueDevice && (
                      <span className="text-[#4edea3] font-bold">
                        {patient.allergies[0].rescueDevice}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-[#869397] font-mono flex flex-col items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[24px]">lock</span>
                  <p className="mt-1">Hidden until token verification or override</p>
                  <button
                    onClick={() => onBreakGlass ? onBreakGlass() : onUnlockToggle()}
                    className="mt-1 px-3 py-1 bg-[#4edea3]/20 hover:bg-[#4edea3]/30 text-[#4edea3] border border-[#4edea3]/40 rounded-lg text-xs font-sans font-bold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">lock_open</span>
                    Unlock Chart
                  </button>
                </div>
              )}
            </div>

            {/* Card 3: Medications & Implants */}
            <div className="bg-[#181c24] border border-[#3d494c]/40 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-[#4cd7f6] font-bold uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">medication</span>
                  Medications & Implants
                </span>
                <span className="bg-[#31353e] text-[#869397] text-xs font-mono px-2 py-0.5 rounded font-bold">
                  {scopes.medicationsImplants && !isRevoked && isUnlocked ? 'SHARED' : 'LOCKED'}
                </span>
              </div>

              {scopes.medicationsImplants && !isRevoked && isUnlocked ? (
                <div className="space-y-2 mt-2">
                  {patient.medications.map((med, idx) => (
                    <div key={idx} className="bg-[#1c2028] p-2.5 rounded-lg border border-[#31353e]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{med.name}</span>
                        <span className="text-[10px] font-mono text-[#4cd7f6]">
                          {med.route} ({med.frequency})
                        </span>
                      </div>
                      <span className="text-[11px] text-[#bcc9cd]">{med.classification}</span>
                    </div>
                  ))}
                  {patient.implants.map((imp, idx) => (
                    <div
                      key={idx}
                      className="bg-[#1c2028] p-2.5 rounded-lg border border-[#31353e] flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">
                        ecg_heart
                      </span>
                      <div>
                        <div className="text-xs font-bold text-white">{imp.name}</div>
                        <span className="text-[10px] font-mono text-[#ffb95f]">
                          {imp.mriStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-[#869397] font-mono flex flex-col items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[24px]">lock</span>
                  <p className="mt-1">Hidden until token verification or override</p>
                  <button
                    onClick={() => onBreakGlass ? onBreakGlass() : onUnlockToggle()}
                    className="mt-1 px-3 py-1 bg-[#4edea3]/20 hover:bg-[#4edea3]/30 text-[#4edea3] border border-[#4edea3]/40 rounded-lg text-xs font-sans font-bold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">lock_open</span>
                    Unlock Chart
                  </button>
                </div>
              )}
            </div>

            {/* Card 4: Advance Directives Quick Summary */}
            <div className="bg-[#181c24] border border-[#3d494c]/40 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-[#4edea3] font-bold uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">gavel</span>
                  Directives & Code
                </span>
                <span className="bg-[#00a572]/20 text-[#4edea3] text-xs font-mono px-2 py-0.5 rounded font-bold">
                  LEGAL
                </span>
              </div>

              {isUnlocked && !isRevoked && scopes.chronicConditions ? <div className="space-y-2.5 mt-2">
                <div className="bg-[#1c2028] p-2.5 rounded-lg border border-[#31353e]">
                  <span className="text-[10px] text-[#869397] font-mono block">RESUSCITATION STATUS</span>
                  <span
                    className={`text-sm font-bold font-mono ${
                      patient.directives.codeStatus.includes('DNR')
                        ? 'text-[#ffb4ab]'
                        : 'text-[#4edea3]'
                    }`}
                  >
                    {patient.directives.codeStatus}
                  </span>
                </div>
                <div className="bg-[#1c2028] p-2.5 rounded-lg border border-[#31353e]">
                  <span className="text-[10px] text-[#869397] font-mono block">CHRONIC CONDITIONS</span>
                  <span className="text-xs text-white">{patient.chronicConditions.join(' · ') || 'None reported'}</span>
                </div>
              </div> : (
                <div className="py-5 text-center text-xs text-[#869397] flex flex-col items-center justify-center gap-2">
                  <span>Clinical history protected by patient consent</span>
                  <button
                    onClick={() => onBreakGlass ? onBreakGlass() : onUnlockToggle()}
                    className="px-2.5 py-1 bg-[#4edea3]/20 hover:bg-[#4edea3]/30 text-[#4edea3] border border-[#4edea3]/40 rounded text-xs font-bold transition-colors"
                  >
                    Unlock Directives
                  </button>
                </div>
              )}
              {isUnlocked && !isRevoked && scopes.emergencyContacts && <div className="bg-[#1c2028] p-2.5 rounded-lg border border-[#31353e] text-xs mt-2">
                  <span className="text-[10px] text-[#869397] font-mono block">HEALTHCARE PROXY</span>
                  <span className="text-white font-semibold">
                    {patient.emergencyContacts[0]?.name} ({patient.emergencyContacts[0]?.phone})
                  </span>
                </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
