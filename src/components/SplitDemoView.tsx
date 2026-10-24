import React, { useState } from 'react';
import { PatientProfile, ConsentScopes, AuditLogEntry } from '../types/medical';
import { sound } from '../utils/audio';
import { QRCodeSVG } from 'qrcode.react';

interface Props {
  patient: PatientProfile;
  scopes: ConsentScopes;
  onToggleScope: (key: keyof ConsentScopes) => void;
  tokenDuration: '45s' | '15m' | '1h';
  onSelectDuration: (d: '45s' | '15m' | '1h') => void;
  countdownSeconds: number;
  accessPin: string;
  isUnlocked: boolean;
  onUnlockToggle: (credential?: string) => void;
  isRevoked: boolean;
  onRevoke: () => void;
  onGenerateNewToken: () => void;
  humanVerified: boolean;
  onToggleHumanVerified: () => void;
  auditLogs: AuditLogEntry[];
  onOpenMerkleProof: () => void;
  onOpenFhirExport: () => void;
  merkleRoot: string;
  onOverrideSensitive: () => void;
  isSensitiveOverridden: boolean;
  qrValue: string;
  onBreakGlass?: () => void;
}

export const SplitDemoView: React.FC<Props> = ({
  patient,
  scopes,
  onToggleScope,
  tokenDuration,
  onSelectDuration,
  countdownSeconds,
  accessPin,
  isUnlocked,
  onUnlockToggle,
  onBreakGlass,
  isRevoked,
  onRevoke,
  onGenerateNewToken,
  humanVerified,
  onToggleHumanVerified,
  auditLogs,
  onOpenMerkleProof,
  onOpenFhirExport,
  merkleRoot,
  onOverrideSensitive,
  isSensitiveOverridden,
  qrValue,
}) => {
  const [pinInput, setPinInput] = useState(accessPin || '');

  React.useEffect(() => {
    if (accessPin) {
      setPinInput(accessPin);
    }
  }, [accessPin]);

  // Format timer string MM:SS
  const mins = Math.floor(countdownSeconds / 60);
  const secs = countdownSeconds % 60;
  const timeFormatted = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}s`;

  return (
    <div className="flex flex-col w-full">
      {/* Top System Context Strip */}
      <div className="w-full bg-[#181c24] rounded-lg p-3 lg:p-4 shadow-md mb-5 flex flex-col xl:flex-row xl:items-center justify-between gap-3 border border-[#3d494c]/30">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-[#0a0e16] px-3.5 py-1.5 rounded-full border border-[#3d494c]/30">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isRevoked ? 'bg-[#ffb4ab]' : 'bg-[#4edea3] animate-ping'
              }`}
            />
            <span
              className={`font-mono text-xs uppercase tracking-wider font-bold ${
                isRevoked ? 'text-[#ffb4ab]' : 'text-[#4edea3]'
              }`}
            >
              {isRevoked ? 'TUNNEL REVOKED' : 'TUNNEL ACTIVE'}
            </span>
          </div>

          <span className="font-mono text-xs text-[#dfe2ee] font-semibold tracking-wide flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">lock</span>
            EPHEMERAL CONSENT-GATED BRIDGE{' '}
            <span className="text-[#869397] font-normal">[SERVER-VALIDATED TOKEN]</span>
          </span>

          <span className="text-[10px] font-mono text-[#869397] uppercase tracking-widest hidden md:inline">
            | SHA-256: 8F2A...68C1
          </span>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#1c2028] px-3 py-1 rounded-full border border-[#3d494c]/30">
            <span className="material-symbols-outlined text-[#4edea3] text-[16px]">
              wifi_tethering
            </span>
            <span className="text-[10px] font-mono text-[#bcc9cd] font-medium">
              RESPONDER CONNECTED
            </span>
            <span className="font-mono text-xs text-white font-bold">1</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#1c2028] px-3 py-1 rounded-full border border-[#3d494c]/30">
            <span className="material-symbols-outlined text-[#ffb95f] text-[16px]">
              emergency
            </span>
            <span className="text-[10px] font-mono text-[#bcc9cd] font-medium">TRIAGE</span>
            <span className="font-mono text-xs text-[#ffb95f] font-bold">
              {patient.triageSeverity}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#1c2028] px-3 py-1 rounded-full border border-[#3d494c]/30">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[16px]">
              verified
            </span>
            <span className="text-[10px] font-mono text-[#bcc9cd] font-medium">LOG</span>
            <span className="font-mono text-xs text-[#4cd7f6] font-bold">IMMUTABLE</span>
          </div>
        </div>
      </div>

      {/* Main 12-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
        {/* LEFT COLUMN: Patient Consent & QR Studio (5 Cols) */}
        <section className="lg:col-span-5 flex flex-col gap-5">
          <div className="bg-[#181c24] rounded-xl p-5 shadow-xl relative overflow-hidden border border-[#3d494c]/30">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#4cd7f6]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-lg bg-[#31353e] text-[#4cd7f6]">
                  <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#4cd7f6] tracking-widest uppercase font-semibold block">
                    Patient Consent & QR Token Studio
                  </span>
                  <h2 className="text-xl text-white font-bold">Granular Consent Controls</h2>
                </div>
              </div>

              <span className="bg-[#4cd7f6]/15 text-[#4cd7f6] border border-[#4cd7f6]/30 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
                Step 1: Granular Consent Controls
              </span>
            </div>

            <p className="text-xs text-[#bcc9cd] mb-4">
              Choose which clinical categories the responder API may return after validating this patient&apos;s active token.
            </p>

            {/* Granular Scope Toggles */}
            <div className="flex flex-col gap-2.5 mb-5">
              {/* Scope 1: Blood & Allergies */}
              <div className="p-3 rounded-lg bg-[#1c2028] hover:bg-[#262a33] transition-colors flex items-center justify-between gap-3 border border-[#3d494c]/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-[#93000a]/40 text-[#ffb4ab]">
                    <span className="material-symbols-outlined text-[20px]">water_drop</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-white font-bold">
                        Blood Group & Severe Allergies
                      </span>
                      <span className="bg-[#ef4444]/20 text-[#ffb4ab] text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">
                        CRITICAL
                      </span>
                    </div>
                    <span className="text-xs text-[#bcc9cd]">
                      Instant transfusion and anaphylaxis prophylaxis
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onToggleScope('bloodAllergies')}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors relative flex items-center focus:outline-none ${
                    scopes.bloodAllergies ? 'bg-[#4cd7f6]' : 'bg-[#31353e]'
                  }`}
                  aria-label="Toggle blood and allergies consent"
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-[#003640] transform shadow-sm transition-transform ${
                      scopes.bloodAllergies ? 'translate-x-5' : 'translate-x-0 bg-[#869397]'
                    }`}
                  />
                </button>
              </div>

              {/* Scope 2: Active Medications & Implants */}
              <div className="p-3 rounded-lg bg-[#1c2028] hover:bg-[#262a33] transition-colors flex items-center justify-between gap-3 border border-[#3d494c]/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-[#06b6d4]/20 text-[#4cd7f6]">
                    <span className="material-symbols-outlined text-[20px]">medication</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-white font-bold">
                        Active Medications & Implants
                      </span>
                      <span className="bg-[#06b6d4]/20 text-[#4cd7f6] text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">
                        MEDS
                      </span>
                    </div>
                    <span className="text-xs text-[#bcc9cd]">
                      Apixaban regimen & cardiac pacemaker telemetry
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onToggleScope('medicationsImplants')}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors relative flex items-center focus:outline-none ${
                    scopes.medicationsImplants ? 'bg-[#4cd7f6]' : 'bg-[#31353e]'
                  }`}
                  aria-label="Toggle medications and implants consent"
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-[#003640] transform shadow-sm transition-transform ${
                      scopes.medicationsImplants ? 'translate-x-5' : 'translate-x-0 bg-[#869397]'
                    }`}
                  />
                </button>
              </div>

              {/* Scope 3: Chronic Conditions */}
              <div className="p-3 rounded-lg bg-[#1c2028] hover:bg-[#262a33] transition-colors flex items-center justify-between gap-3 border border-[#3d494c]/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-[#31353e] text-[#4edea3]">
                    <span className="material-symbols-outlined text-[20px]">health_and_safety</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-white font-bold">Chronic Conditions</span>
                    <span className="text-xs text-[#bcc9cd]">
                      Atrial fibrillation and hypertension baseline
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onToggleScope('chronicConditions')}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors relative flex items-center focus:outline-none ${
                    scopes.chronicConditions ? 'bg-[#4cd7f6]' : 'bg-[#31353e]'
                  }`}
                  aria-label="Toggle chronic conditions consent"
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-[#003640] transform shadow-sm transition-transform ${
                      scopes.chronicConditions ? 'translate-x-5' : 'translate-x-0 bg-[#869397]'
                    }`}
                  />
                </button>
              </div>

              {/* Scope 4: Emergency Contacts */}
              <div className="p-3 rounded-lg bg-[#1c2028] hover:bg-[#262a33] transition-colors flex items-center justify-between gap-3 border border-[#3d494c]/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-[#31353e] text-[#4edea3]">
                    <span className="material-symbols-outlined text-[20px]">contact_emergency</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-white font-bold">Emergency Contacts</span>
                    <span className="text-xs text-[#bcc9cd]">
                      Next of kin proxy & authorized phone link
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onToggleScope('emergencyContacts')}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors relative flex items-center focus:outline-none ${
                    scopes.emergencyContacts ? 'bg-[#4cd7f6]' : 'bg-[#31353e]'
                  }`}
                  aria-label="Toggle emergency contacts consent"
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-[#003640] transform shadow-sm transition-transform ${
                      scopes.emergencyContacts ? 'translate-x-5' : 'translate-x-0 bg-[#869397]'
                    }`}
                  />
                </button>
              </div>

              {/* Scope 5: Sensitive Outpatient History (Data Minimization) */}
              <div
                className={`p-3 rounded-lg border transition-colors flex items-center justify-between gap-3 ${
                  isSensitiveOverridden
                    ? 'bg-[#1c2028] border-[#ffb95f]/40'
                    : 'bg-[#0a0e16] opacity-75 border-[#3d494c]/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded ${
                      isSensitiveOverridden
                        ? 'bg-[#e79400]/20 text-[#ffb95f]'
                        : 'bg-[#262a33] text-[#869397]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isSensitiveOverridden ? 'lock_open' : 'lock'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-sm font-bold ${
                          isSensitiveOverridden ? 'text-white' : 'text-[#bcc9cd] line-through'
                        }`}
                      >
                        Sensitive Outpatient History
                      </span>
                      <span className="bg-[#31353e] text-[#869397] text-[10px] font-mono px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px]">shield</span>
                        {isSensitiveOverridden ? 'OVERRIDE APPLIED' : 'DATA MINIMIZATION'}
                      </span>
                    </div>
                    <span className="text-xs text-[#869397]">
                      {isSensitiveOverridden
                        ? 'Temporarily disclosed under emergency clinical order'
                        : 'Psychiatry notes & genetic profile shielded'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onOverrideSensitive}
                  className={`w-11 h-6 rounded-full p-0.5 relative flex items-center focus:outline-none transition-colors ${
                    isSensitiveOverridden ? 'bg-[#ffb95f]' : 'bg-[#31353e] cursor-pointer'
                  }`}
                  title={isSensitiveOverridden ? 'Revoke override' : 'Emergency Override'}
                >
                  <span
                    className={`w-5 h-5 rounded-full shadow-sm transition-transform ${
                      isSensitiveOverridden
                        ? 'translate-x-5 bg-[#472a00]'
                        : 'translate-x-0 bg-[#869397]'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Token Validity Duration Selector */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-[#869397] uppercase tracking-wider font-semibold">
                  Token Validity Duration
                </span>
                <span className="font-mono text-xs text-[#4cd7f6] font-bold">
                  {tokenDuration === '45s'
                    ? '45s Demo Mode'
                    : tokenDuration === '15m'
                    ? '15 Mins Emergency Window'
                    : '1 Hour Extended Transfer'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <button
                  onClick={() => onSelectDuration('45s')}
                  className={`py-2 px-2 rounded text-xs font-bold text-center transition-all ${
                    tokenDuration === '45s'
                      ? 'bg-[#06b6d4] text-[#003640] shadow-md shadow-[#06b6d4]/20'
                      : 'bg-[#1c2028] hover:bg-[#262a33] text-white font-semibold'
                  }`}
                >
                  45s Demo
                </button>
                <button
                  onClick={() => onSelectDuration('15m')}
                  className={`py-2 px-2 rounded text-xs font-bold text-center transition-all ${
                    tokenDuration === '15m'
                      ? 'bg-[#06b6d4] text-[#003640] shadow-md shadow-[#06b6d4]/20'
                      : 'bg-[#1c2028] hover:bg-[#262a33] text-white font-semibold'
                  }`}
                >
                  15 Mins
                </button>
                <button
                  onClick={() => onSelectDuration('1h')}
                  className={`py-2 px-2 rounded text-xs font-bold text-center transition-all ${
                    tokenDuration === '1h'
                      ? 'bg-[#06b6d4] text-[#003640] shadow-md shadow-[#06b6d4]/20'
                      : 'bg-[#1c2028] hover:bg-[#262a33] text-white font-semibold'
                  }`}
                >
                  1 Hour
                </button>
              </div>

              <button
                onClick={onGenerateNewToken}
                className="w-full py-2.5 px-4 rounded-lg bg-[#4cd7f6] hover:bg-[#acedff] text-[#003640] font-bold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">key</span>
                Generate Emergency QR Token
              </button>
            </div>

            {/* Active Token Card */}
            <div className="bg-[#0a0e16] rounded-xl p-4 border border-[#3d494c]/40 shadow-2xl relative">
              <div className="flex items-center justify-between pb-2 border-b border-[#31353e]/60 mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isRevoked
                        ? 'bg-[#ffb4ab]'
                        : countdownSeconds === 0
                        ? 'bg-[#ffb95f]'
                        : 'bg-[#4edea3] animate-ping'
                    }`}
                  />
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isRevoked
                        ? 'bg-[#93000a]/30 text-[#ffb4ab] border-[#93000a]'
                        : countdownSeconds === 0
                        ? 'bg-[#e79400]/20 text-[#ffb95f] border-[#ffb95f]/40'
                        : 'bg-[#4edea3]/15 text-[#4edea3] border-[#4edea3]/40'
                    }`}
                  >
                    {isRevoked ? 'REVOKED' : countdownSeconds === 0 ? 'EXPIRED' : 'ACTIVE'}
                  </span>
                </div>

                <span
                  className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                    isRevoked || countdownSeconds === 0
                      ? 'bg-[#93000a]/20 text-[#ffb4ab] border-[#93000a]'
                      : countdownSeconds < 15
                      ? 'bg-[#e79400]/30 text-[#ffb95f] border-[#ffb95f]/50 animate-pulse'
                      : 'bg-[#e79400]/20 text-[#ffb95f] border-[#ffb95f]/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px] animate-pulse">timer</span>
                  {isRevoked ? '00:00s' : `${timeFormatted} Remaining`}
                </span>
              </div>

              {/* QR and PIN block */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                {/* SVG QR Code */}
                <div className="p-2.5 bg-white rounded-xl shadow-lg shrink-0 relative group">
                  <QRCodeSVG value={qrValue || 'https://medbridge.invalid/no-active-token'} size={128} level="H" includeMargin />
                  {isRevoked && (
                    <div className="absolute inset-0 bg-red-950/70 rounded-xl flex items-center justify-center text-[#ffb4ab] font-mono font-bold text-xs uppercase tracking-wider">
                      Revoked
                    </div>
                  )}
                </div>

                {/* 6-Digit PIN */}
                <div className="flex flex-col items-center sm:items-start w-full">
                  <span className="text-[10px] font-mono text-[#869397] tracking-wider uppercase mb-1 font-semibold">
                    6-Digit Ephemeral Access PIN
                  </span>
                  <div className="font-mono text-2xl font-extrabold text-white bg-[#262a33] px-4 py-2 rounded-lg border border-[#3d494c]/40 tracking-widest shadow-inner mb-2">
                    {isRevoked ? '------' : accessPin}
                  </div>
                  <span className="text-xs text-[#bcc9cd] text-center sm:text-left">
                    Opaque token · server-validated access
                  </span>
                </div>
              </div>

              {/* Revoke Button */}
              <button
                onClick={onRevoke}
                disabled={isRevoked}
                className={`w-full py-2.5 px-4 rounded-lg font-bold uppercase tracking-wider text-xs transition-all shadow-md flex items-center justify-center gap-2 ${
                  isRevoked
                    ? 'bg-[#31353e] text-[#869397] cursor-not-allowed'
                    : 'bg-[#ffb4ab] hover:bg-[#ffdad6] text-[#690005] shadow-[#ffb4ab]/20'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                {isRevoked ? 'Access Revoked' : 'Revoke Access Immediately'}
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Emergency Responder Triage Portal (7 Cols) */}
        <section className="lg:col-span-7 flex flex-col gap-5">
          <div className="bg-[#181c24] rounded-xl p-5 shadow-xl relative border border-[#3d494c]/30">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-lg bg-[#00a572]/20 text-[#4edea3]">
                  <span className="material-symbols-outlined text-[24px]">medical_services</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#4edea3] tracking-widest uppercase font-semibold block">
                    Authorized Emergency Responder View
                  </span>
                  <h2 className="text-xl text-white font-bold">Emergency Clinical Triage Intake</h2>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-[#00a572]/20 px-3 py-1 rounded-full self-start sm:self-auto border border-[#4edea3]/40">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isUnlocked && !isRevoked ? 'bg-[#4edea3] animate-pulse' : 'bg-[#ffb4ab]'
                  }`}
                />
                <span className="text-[10px] font-mono text-[#4edea3] font-bold tracking-wider uppercase">
                  {isUnlocked && !isRevoked
                    ? 'Step 2: Paramedic Triage Portal (Unlocked)'
                    : 'Step 2: Paramedic Triage Portal (Locked)'}
                </span>
              </div>
            </div>

            {/* Responder Credentials Bar */}
            <div className="bg-[#0a0e16] p-3 rounded-lg mb-4 flex flex-wrap items-center justify-between gap-3 border border-[#3d494c]/40">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-[#869397]">RESPONDER NAME</span>
                  <span className="text-xs text-white font-bold">Dr. Kabir Sharma</span>
                </div>

                <div className="h-7 w-px bg-[#31353e] hidden sm:block" />

                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-[#869397]">BADGE ID</span>
                  <span className="font-mono text-xs text-[#4cd7f6] font-bold">ER-402</span>
                </div>

                <div className="h-7 w-px bg-[#31353e] hidden sm:block" />

                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-[#869397]">6-DIGIT CODE</span>
                  <input
                    type="text"
                    maxLength={8}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder={accessPin || "482-910"}
                    className="font-mono text-xs text-[#4edea3] font-bold bg-[#181c24] px-2 py-0.5 rounded border border-[#3d494c]/50 w-28 focus:outline-none focus:border-[#4cd7f6]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.beep(880, 0.15);
                    if (onBreakGlass) onBreakGlass();
                    else onUnlockToggle(accessPin);
                  }}
                  className="px-2.5 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 bg-[#e79400]/20 hover:bg-[#e79400]/30 text-[#ffb95f] border border-[#ffb95f]/40 shadow-sm"
                  title="Immediately unseal records under Emergency Break-Glass protocol"
                >
                  <span className="material-symbols-outlined text-[16px]">lock_open</span>
                  Break-Glass
                </button>
                <button
                  onClick={() => {
                    sound.scanSuccess();
                    onUnlockToggle(isUnlocked ? undefined : (pinInput || accessPin));
                  }}
                  disabled={isRevoked}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md ${
                    isRevoked
                      ? 'bg-[#31353e] text-[#869397] cursor-not-allowed'
                      : isUnlocked
                      ? 'bg-[#262a33] text-[#4cd7f6] hover:bg-[#31353e]'
                      : 'bg-[#4edea3] hover:bg-[#6ffbbe] text-[#003824]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isUnlocked ? 'lock' : 'verified'}
                  </span>
                  {isUnlocked ? 'Relock Portal' : 'Verify & Unlock'}
                </button>
              </div>
            </div>

            {/* AI Clinical Contraindication Summary Banner */}
            <div className="bg-[#e79400]/20 border border-[#ffb95f]/40 p-3.5 rounded-lg mb-5 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#ffb95f] text-[24px] shrink-0 mt-0.5">
                  warning
                </span>
                <div className="flex flex-col w-full">
                  <span className="text-xs text-[#ffb95f] font-bold tracking-tight uppercase">
                    AI Clinical Contraindication Summary
                  </span>
                  <p className="text-xs text-white font-medium my-1">
                    {isUnlocked ? patient.aiContraindicationSummary : 'Verify the patient token to view clinical contraindication details.'}
                  </p>
                  <div className="flex items-center gap-2 mt-1 pt-2 border-t border-[#ffb95f]/30">
                    <label className="flex items-center gap-2 cursor-pointer select-none bg-[#0a0e16]/80 px-2.5 py-1.5 rounded border border-[#ffb95f]/40 w-full hover:bg-[#0a0e16]">
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
                        Human Review: {humanVerified ? 'Clinician verification recorded' : 'Not yet recorded'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Clinical Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Blood Group */}
              <div className="bg-[#1c2028] rounded-xl p-4 flex flex-col justify-between shadow-lg border border-[#ffb4ab]/30 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[#ffb4ab] tracking-wider uppercase font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">water_drop</span>
                    BLOOD GROUP
                  </span>
                  <span className="bg-[#31353e] text-[#869397] font-mono text-xs px-2 py-0.5 rounded font-bold">
                    {scopes.bloodAllergies && !isRevoked && isUnlocked ? patient.rhFactor : 'LOCKED'}
                  </span>
                </div>

                {scopes.bloodAllergies && !isRevoked && isUnlocked ? (
                  <>
                    <div className="my-3">
                      <span className="text-4xl text-[#ffb4ab] font-extrabold tracking-tight block">
                        {patient.bloodGroup}
                      </span>
                      <span className="text-xs text-white font-semibold">
                        {patient.universalDonor
                          ? 'UNIVERSAL ERYTHROCYTE DONOR'
                          : `${patient.bloodGroup} TYPED`}
                      </span>
                    </div>

                    <div className="bg-[#0a0e16] p-2 rounded text-[#869397] text-[11px] font-mono">
                      <span>
                        Antibody Screen:{' '}
                        <strong className="text-[#4edea3]">{patient.antibodyScreen}</strong>
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="my-6 text-center py-4 bg-[#0a0e16]/60 rounded-lg border border-[#3d494c]/20">
                    <span className="material-symbols-outlined text-[#869397] text-[24px]">lock</span>
                    <span className="text-xs text-[#869397] block mt-1 font-mono">
                      Shielded by Patient Scope Consent
                    </span>
                  </div>
                )}
              </div>

              {/* Card 2: Severe Allergies */}
              <div className="bg-[#1c2028] rounded-xl p-4 flex flex-col justify-between shadow-lg border border-[#3d494c]/30 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[#ffb95f] tracking-wider uppercase font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">report_problem</span>
                    SEVERE ALLERGIES
                  </span>
                  <span className="bg-[#31353e] text-[#869397] text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                    {scopes.bloodAllergies && !isRevoked && isUnlocked ? 'SHARED' : 'LOCKED'}
                  </span>
                </div>

                {scopes.bloodAllergies && !isRevoked && isUnlocked ? (
                  <>
                    <div className="flex flex-col gap-2 my-2">
                      {patient.allergies.map((allergy, idx) => (
                        <div
                          key={idx}
                          className="bg-[#262a33] px-2.5 py-1.5 rounded flex items-center justify-between"
                        >
                          <span className="text-xs text-white font-bold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                            {allergy.name}
                          </span>
                          <span className="text-[10px] font-mono text-[#ffb4ab] font-bold uppercase">
                            {allergy.reaction}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#0a0e16] p-2 rounded text-[#869397] text-[11px] font-mono flex items-center justify-between">
                      <span>
                        Contraindication:{' '}
                        <strong className="text-[#ffb4ab]">
                          {patient.allergies[0]?.contraindications || 'None logged'}
                        </strong>
                      </span>
                      {patient.allergies[0]?.rescueDevice && (
                        <span className="text-[#4edea3] font-bold">
                          {patient.allergies[0].rescueDevice}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="my-6 text-center py-4 bg-[#0a0e16]/60 rounded-lg border border-[#3d494c]/20">
                    <span className="material-symbols-outlined text-[#869397] text-[24px]">lock</span>
                    <span className="text-xs text-[#869397] block mt-1 font-mono">
                      Shielded by Patient Scope Consent
                    </span>
                  </div>
                )}
              </div>

              {/* Card 3: Medications & Implants */}
              <div className="bg-[#1c2028] rounded-xl p-4 flex flex-col justify-between shadow-lg border border-[#3d494c]/30 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[#4cd7f6] tracking-wider uppercase font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">medication</span>
                    MEDICATIONS & IMPLANTS
                  </span>
                  <span className="bg-[#31353e] text-[#869397] text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                    {scopes.medicationsImplants && !isRevoked && isUnlocked ? 'SHARED' : 'LOCKED'}
                  </span>
                </div>

                {scopes.medicationsImplants && !isRevoked && isUnlocked ? (
                  <>
                    <div className="flex flex-col gap-2 my-2">
                      {patient.medications.slice(0, 1).map((med, idx) => (
                        <div key={idx} className="bg-[#262a33] px-2.5 py-2 rounded flex flex-col">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white font-bold">{med.name}</span>
                            <span className="text-[10px] font-mono text-[#4cd7f6] font-bold">
                              {med.route} ({med.frequency})
                            </span>
                          </div>
                          <span className="text-[11px] text-[#bcc9cd]">{med.classification}</span>
                        </div>
                      ))}

                      {patient.implants.slice(0, 1).map((imp, idx) => (
                        <div
                          key={idx}
                          className="bg-[#262a33] px-2.5 py-2 rounded flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">
                            ecg_heart
                          </span>
                          <div className="flex flex-col">
                            <span className="text-xs text-white font-bold">{imp.name}</span>
                            <span className="text-[10px] font-mono text-[#ffb95f] font-semibold">
                              {imp.mriStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#0a0e16] p-2 rounded text-[#869397] text-[11px] font-mono">
                      <span>
                        Telemetry Link:{' '}
                        <strong className="text-[#4edea3]">
                          {patient.implants[0]?.telemetryStatus || 'LOCAL CACHED'}
                        </strong>
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="my-6 text-center py-4 bg-[#0a0e16]/60 rounded-lg border border-[#3d494c]/20">
                    <span className="material-symbols-outlined text-[#869397] text-[24px]">lock</span>
                    <span className="text-xs text-[#869397] block mt-1 font-mono">
                      Shielded by Patient Scope Consent
                    </span>
                  </div>
                )}
              </div>

              {/* Card 4: Sensitive History */}
              <div className="bg-[#0a0e16] rounded-xl p-4 flex flex-col justify-between shadow-lg border border-[#3d494c]/40 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[#869397] tracking-wider uppercase font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    SENSITIVE HISTORY
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      isSensitiveOverridden
                        ? 'bg-[#e79400]/20 text-[#ffb95f]'
                        : 'bg-[#31353e] text-[#869397]'
                    }`}
                  >
                    {isSensitiveOverridden ? 'OVERRIDDEN' : 'SHIELDED'}
                  </span>
                </div>

                {isSensitiveOverridden && isUnlocked ? (
                  <div className="my-2 space-y-2 text-xs">
                    <div className="bg-[#1c2028] p-2.5 rounded border border-[#ffb95f]/40">
                      <span className="text-[#ffb95f] font-mono text-[10px] block uppercase font-bold">
                        Psychiatry Notes (Sensitive)
                      </span>
                      <p className="text-white mt-1 text-[11px]">
                        {patient.sensitiveHistory.psychiatryNotes}
                      </p>
                    </div>
                    <div className="bg-[#1c2028] p-2.5 rounded border border-[#31353e]">
                      <span className="text-[#4cd7f6] font-mono text-[10px] block uppercase font-bold">
                        Genomic Profile (Sensitive)
                      </span>
                      <p className="text-[#bcc9cd] mt-1 text-[11px]">
                        {patient.sensitiveHistory.genomicNotes}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="my-auto py-5 flex flex-col items-center justify-center text-center">
                    <div className="p-3 rounded-full bg-[#262a33] text-[#869397] mb-2">
                      <span className="material-symbols-outlined text-[30px]">lock</span>
                    </div>
                    <span className="text-sm text-[#bcc9cd] font-bold">
                      Restricted by Patient Consent
                    </span>
                    <span className="text-xs text-[#869397] mt-1">
                      Outpatient psychiatric and genomic notes are hidden unless an authorized override is recorded.
                    </span>
                  </div>
                )}

                <div className="bg-[#1c2028] p-2 rounded text-center">
                  <button
                  onClick={onOverrideSensitive}
                  disabled={!isUnlocked}
                    className="text-[10px] font-mono text-[#ffb95f] hover:text-[#ffddb8] font-semibold flex items-center justify-center gap-1 mx-auto transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">gavel</span>
                    {isSensitiveOverridden
                      ? 'Re-seal Sensitive Category'
                      : 'Tier-2 Court / Attending Override Required'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* BOTTOM FULL-WIDTH SECTION: Real-Time Access & Consent Audit Logs */}
      <section className="w-full bg-[#181c24] rounded-xl p-5 shadow-xl mb-10 border border-[#3d494c]/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#31353e]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#1c2028] text-[#4cd7f6]">
              <span className="material-symbols-outlined text-[22px]">history_edu</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg text-white font-bold">
                  Immutable Consent & Access Audit Log
                </h3>
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
              </div>
              <p className="text-xs text-[#bcc9cd]">
                Consent-scoped access events recorded in the local audit log for patient{' '}
                {patient.name} (MRN #{patient.mrn}).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenFhirExport}
              className="px-3.5 py-2 bg-[#1c2028] hover:bg-[#262a33] text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 focus:outline-none border border-[#3d494c]/40"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export FHIR Log (JSON)
            </button>
            <button
              onClick={onOpenMerkleProof}
              className="px-3.5 py-2 bg-[#4cd7f6] hover:bg-[#acedff] text-[#003640] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 focus:outline-none shadow-md shadow-[#4cd7f6]/20 font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              Verify Ledger Proof
            </button>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0a0e16] text-[#869397] font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-3.5 rounded-l">Timestamp</th>
                <th className="py-3 px-3.5">Actor & Badge ID</th>
                <th className="py-3 px-3.5">Role Pill</th>
                <th className="py-3 px-3.5">Action Event</th>
                <th className="py-3 px-3.5 rounded-r text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#31353e]/60 text-[#bcc9cd]">
              {auditLogs.map((log) => {
                const isErr = log.color === 'error';
                const isSec = log.color === 'secondary';
                return (
                  <tr key={log.id} className="hover:bg-[#1c2028] transition-colors">
                    <td
                      className={`py-3 px-3.5 font-mono text-xs font-semibold ${
                        isErr ? 'text-[#ffb4ab]' : 'text-[#4cd7f6]'
                      }`}
                    >
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-3.5 text-white font-semibold flex items-center gap-2">
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          isErr ? 'text-[#ffb4ab]' : isSec ? 'text-[#4edea3]' : 'text-[#4cd7f6]'
                        }`}
                      >
                        {isErr ? 'block' : isSec ? 'medical_services' : 'person'}
                      </span>
                      {log.actor} ({log.badgeId})
                    </td>
                    <td className="py-3 px-3.5">
                      <span
                        className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          isErr
                            ? 'bg-[#31353e] text-[#869397]'
                            : isSec
                            ? 'bg-[#4edea3]/15 text-[#4edea3]'
                            : 'bg-[#4cd7f6]/15 text-[#4cd7f6]'
                        }`}
                      >
                        {log.rolePill}
                      </span>
                    </td>
                    <td className="py-3 px-3.5">
                      <span
                        className={`font-mono text-xs font-bold ${
                          isErr
                            ? 'text-[#ffb4ab]'
                            : isSec
                            ? 'text-[#4edea3]'
                            : 'text-white'
                        }`}
                      >
                        {log.actionEvent}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <span
                        className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                          isErr
                            ? 'bg-[#93000a]/40 text-[#ffb4ab]'
                            : isSec
                            ? 'bg-[#4edea3]/15 text-[#4edea3]'
                            : 'bg-[#4cd7f6]/15 text-[#4cd7f6]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isErr ? 'bg-[#ffb4ab]' : isSec ? 'bg-[#4edea3]' : 'bg-[#4cd7f6]'
                          }`}
                        />
                        {log.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Hash Bar */}
        <div className="mt-4 pt-3 border-t border-[#31353e]/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-[#869397] font-mono text-[10px]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[16px]">
              fingerprint
            </span>
            <span>
              MERKLE ROOT HASH:{' '}
              <span className="text-white font-semibold">{merkleRoot}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>ACCESS: SERVER VALIDATED · AUDIT: PERSISTED</span>
            <span>•</span>
            <span className="text-[#4edea3] font-semibold">SYNTHETIC DEMO DATA</span>
          </div>
        </div>
      </section>
    </div>
  );
};
