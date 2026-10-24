import React, { useState } from 'react';
import { PatientProfile, ConsentScopes } from '../types/medical';
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
  isRevoked: boolean;
  onRevoke: () => void;
  onGenerateNewToken: () => void;
  onOpenWalletModal: () => void;
  qrValue: string;
}

export const PatientPortalView: React.FC<Props> = ({
  patient,
  scopes,
  onToggleScope,
  tokenDuration,
  onSelectDuration,
  countdownSeconds,
  accessPin,
  isRevoked,
  onRevoke,
  onGenerateNewToken,
  onOpenWalletModal,
  qrValue,
}) => {
  const [proxyNotified, setProxyNotified] = useState(false);

  const mins = Math.floor(countdownSeconds / 60);
  const secs = countdownSeconds % 60;
  const timeFormatted = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}s`;

  const handleNotifyProxy = () => {
    setProxyNotified(true);
    sound.beep(600, 0.1);
    setTimeout(() => setProxyNotified(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-[#181c24] border border-[#3d494c]/40 rounded-xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#06b6d4]/20 border border-[#4cd7f6]/40 flex items-center justify-center text-[#4cd7f6] shrink-0">
            <span className="material-symbols-outlined text-[32px]">shield_person</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white">{patient.name}</h2>
              <span className="bg-[#06b6d4]/20 text-[#4cd7f6] text-xs font-mono px-2 py-0.5 rounded font-bold">
                PATIENT PORTAL
              </span>
            </div>
            <p className="text-xs text-[#bcc9cd] mt-1 font-mono">
              MRN: #{patient.mrn} • DOB: {patient.dateOfBirth || patient.dob.slice(0,10)} · Age {patient.age} • Consent-managed emergency session
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenWalletModal}
            className="px-4 py-2.5 bg-[#262a33] hover:bg-[#31353e] text-white text-xs font-bold rounded-lg border border-[#3d494c]/60 flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">wallet</span>
            Emergency Medical Pass
          </button>
          <button
            onClick={onGenerateNewToken}
            className="px-4 py-2.5 bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#003640] text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-md shadow-[#06b6d4]/20"
          >
            <span className="material-symbols-outlined text-[18px]">key</span>
            Mint Fresh QR Token
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active QR Token & NFC Wristband (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-[#181c24] border border-[#3d494c]/40 rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#31353e]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">
                  qr_code_2
                </span>
                <h3 className="text-base font-bold text-white">Active Emergency QR</h3>
              </div>
              <span
                className={`font-mono text-xs px-2.5 py-0.5 rounded-full border ${
                  isRevoked
                    ? 'bg-[#93000a]/20 text-[#ffb4ab] border-[#93000a]'
                    : countdownSeconds === 0
                    ? 'bg-[#e79400]/20 text-[#ffb95f] border-[#ffb95f]/40'
                    : 'bg-[#4edea3]/20 text-[#4edea3] border-[#4edea3]/40'
                }`}
              >
                {isRevoked ? 'REVOKED' : countdownSeconds === 0 ? 'EXPIRED' : `${timeFormatted}`}
              </span>
            </div>

            {/* QR Center */}
            <div className="bg-[#0a0e16] p-6 rounded-xl border border-[#3d494c]/40 flex flex-col items-center justify-center text-center mb-4">
              <div className="p-3 bg-white rounded-2xl shadow-xl mb-4 relative">
                <QRCodeSVG value={qrValue || 'https://medbridge.invalid/no-active-token'} size={176} level="H" includeMargin />
                {isRevoked && (
                  <div className="absolute inset-0 bg-red-950/80 rounded-2xl flex flex-col items-center justify-center text-[#ffb4ab]">
                    <span className="material-symbols-outlined text-[36px]">block</span>
                    <span className="font-mono text-xs font-bold mt-1 uppercase">Revoked</span>
                  </div>
                )}
              </div>

              <div className="text-[10px] font-mono text-[#869397] uppercase mb-1">
                One-Time Access Passcode
              </div>
              <div className="font-mono text-3xl font-extrabold text-[#4cd7f6] bg-[#1c2028] px-6 py-2 rounded-xl border border-[#3d494c]/60 tracking-widest shadow-inner">
                {isRevoked ? '------' : accessPin}
              </div>
              <p className="text-xs text-[#bcc9cd] mt-2 max-w-xs">
                First responders scan this code or enter the PIN to request only the categories you enabled.
              </p>
            </div>

            {/* Token duration buttons */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#869397]">
                <span>Choose TTL Expiration Window</span>
                <span className="text-[#4cd7f6] font-mono font-bold">{tokenDuration}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onSelectDuration('45s')}
                  className={`py-2 rounded text-xs font-bold ${
                    tokenDuration === '45s'
                      ? 'bg-[#06b6d4] text-[#003640]'
                      : 'bg-[#262a33] text-white hover:bg-[#31353e]'
                  }`}
                >
                  45s Demo
                </button>
                <button
                  onClick={() => onSelectDuration('15m')}
                  className={`py-2 rounded text-xs font-bold ${
                    tokenDuration === '15m'
                      ? 'bg-[#06b6d4] text-[#003640]'
                      : 'bg-[#262a33] text-white hover:bg-[#31353e]'
                  }`}
                >
                  15 Minutes
                </button>
                <button
                  onClick={() => onSelectDuration('1h')}
                  className={`py-2 rounded text-xs font-bold ${
                    tokenDuration === '1h'
                      ? 'bg-[#06b6d4] text-[#003640]'
                      : 'bg-[#262a33] text-white hover:bg-[#31353e]'
                  }`}
                >
                  1 Hour
                </button>
              </div>

              <button
                onClick={onRevoke}
                disabled={isRevoked}
                className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${
                  isRevoked
                    ? 'bg-[#31353e] text-[#869397] cursor-not-allowed'
                    : 'bg-[#ffb4ab] hover:bg-[#ffdad6] text-[#690005]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
                {isRevoked ? 'Token Inactive' : 'Revoke Token Immediately'}
              </button>
            </div>
          </div>

          {/* NFC Wristband / Hardware Token Box */}
          <div className="bg-[#181c24] border border-[#3d494c]/40 rounded-xl p-5 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-[#00a572]/20 text-[#4edea3]">
                <span className="material-symbols-outlined text-[22px]">contactless</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Emergency NFC Band Paired</h4>
                <p className="text-xs text-[#869397] font-mono">UID: 04:A2:89:FE:19:90 • NTAG424 DNA</p>
              </div>
            </div>
            <p className="text-xs text-[#bcc9cd] leading-relaxed">
              This synthetic demo pairs a patient pass with a short-lived, server-validated token.
            </p>
          </div>
        </div>

        {/* Right: Detailed Consent Categories & Emergency Contacts (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-[#181c24] border border-[#3d494c]/40 rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#31353e]">
              <div>
                <h3 className="text-base font-bold text-white">Granular Disclosure Toggles</h3>
                <p className="text-xs text-[#869397]">
                  You have sovereign control over which medical categories are transmitted.
                </p>
              </div>
              <span className="bg-[#00a572]/20 text-[#4edea3] text-xs font-mono px-2.5 py-1 rounded-full border border-[#4edea3]/40">
                CONSENT SCOPED
              </span>
            </div>

            <div className="space-y-3">
              {/* Category 1 */}
              <div className="p-3.5 bg-[#1c2028] rounded-xl border border-[#3d494c]/30 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Blood Group & Allergies</span>
                    <span className="bg-[#ef4444]/20 text-[#ffb4ab] text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">
                      HIGH RISK
                    </span>
                  </div>
                  <p className="text-xs text-[#bcc9cd] mt-0.5">
                    {patient.bloodGroup} ({patient.rhFactor}),{' '}
                    {patient.allergies.map((a) => a.name).join(', ')}
                  </p>
                </div>
                <button
                  onClick={() => onToggleScope('bloodAllergies')}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors relative flex items-center ${
                    scopes.bloodAllergies ? 'bg-[#4cd7f6]' : 'bg-[#31353e]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-[#003640] shadow transition-transform ${
                      scopes.bloodAllergies ? 'translate-x-6' : 'translate-x-0 bg-[#869397]'
                    }`}
                  />
                </button>
              </div>

              {/* Category 2 */}
              <div className="p-3.5 bg-[#1c2028] rounded-xl border border-[#3d494c]/30 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      Medications & Critical Implants
                    </span>
                    <span className="bg-[#06b6d4]/20 text-[#4cd7f6] text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-[#bcc9cd] mt-0.5">
                    {patient.medications[0]?.name}, {patient.implants[0]?.name}
                  </p>
                </div>
                <button
                  onClick={() => onToggleScope('medicationsImplants')}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors relative flex items-center ${
                    scopes.medicationsImplants ? 'bg-[#4cd7f6]' : 'bg-[#31353e]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-[#003640] shadow transition-transform ${
                      scopes.medicationsImplants ? 'translate-x-6' : 'translate-x-0 bg-[#869397]'
                    }`}
                  />
                </button>
              </div>

              {/* Category 3 */}
              <div className="p-3.5 bg-[#1c2028] rounded-xl border border-[#3d494c]/30 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-white">Chronic Diagnoses Baseline</span>
                  <p className="text-xs text-[#bcc9cd] mt-0.5">
                    {patient.chronicConditions.join(' • ')}
                  </p>
                </div>
                <button
                  onClick={() => onToggleScope('chronicConditions')}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors relative flex items-center ${
                    scopes.chronicConditions ? 'bg-[#4cd7f6]' : 'bg-[#31353e]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-[#003640] shadow transition-transform ${
                      scopes.chronicConditions ? 'translate-x-6' : 'translate-x-0 bg-[#869397]'
                    }`}
                  />
                </button>
              </div>

              {/* Category 4 */}
              <div className="p-3.5 bg-[#1c2028] rounded-xl border border-[#3d494c]/30 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-white">Emergency Proxy Contacts</span>
                  <p className="text-xs text-[#bcc9cd] mt-0.5">
                    Next of kin phone link & medical power of attorney authorization
                  </p>
                </div>
                <button
                  onClick={() => onToggleScope('emergencyContacts')}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors relative flex items-center ${
                    scopes.emergencyContacts ? 'bg-[#4cd7f6]' : 'bg-[#31353e]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-[#003640] shadow transition-transform ${
                      scopes.emergencyContacts ? 'translate-x-6' : 'translate-x-0 bg-[#869397]'
                    }`}
                  />
                </button>
              </div>

              {/* Category 5 */}
              <div className="p-3.5 bg-[#0a0e16] rounded-xl border border-[#3d494c]/30 flex items-center justify-between opacity-80">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#bcc9cd] line-through">
                      Sensitive Outpatient Behavioral & Genetic Notes
                    </span>
                    <span className="bg-[#31353e] text-[#869397] text-[10px] font-mono px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">shield</span>
                      CONSENT SHIELDED
                    </span>
                  </div>
                  <p className="text-xs text-[#869397] mt-0.5">
                    Never transmitted in emergency envelopes unless court or dual-attending override
                    issued.
                  </p>
                </div>
                <span className="material-symbols-outlined text-[#869397] text-[20px]">lock</span>
              </div>
            </div>
          </div>

          {/* Emergency Proxy List */}
          <div className="bg-[#181c24] border border-[#3d494c]/40 rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#31353e]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4edea3] text-[20px]">
                  contact_phone
                </span>
                <h3 className="text-base font-bold text-white">Designated Emergency Proxies</h3>
              </div>
              <button
                onClick={handleNotifyProxy}
                className="px-3 py-1.5 bg-[#1c2028] hover:bg-[#262a33] text-[#4edea3] text-xs font-bold rounded-lg border border-[#4edea3]/40 flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                {proxyNotified ? 'SMS Dispatched!' : 'Simulate Proxy Alert'}
              </button>
            </div>

            <div className="space-y-3">
              {patient.emergencyContacts.map((contact, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-[#1c2028] rounded-xl border border-[#3d494c]/30 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{contact.name}</span>
                      {contact.authorizedProxy && (
                        <span className="bg-[#00a572]/20 text-[#4edea3] text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                          PRIMARY PROXY
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#bcc9cd] block mt-0.5">
                      {contact.relationship}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs text-[#4cd7f6] font-bold block">
                      {contact.phone}
                    </span>
                    <span className="text-[10px] text-[#4edea3] font-mono">SMS / Voice Relay Enabled</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
