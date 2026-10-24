import React from 'react';
import { PatientProfile } from '../types/medical';
import { QRCodeSVG } from 'qrcode.react';

interface Props {
  patient: PatientProfile;
  accessPin: string;
  onClose: () => void;
  qrValue: string;
}

export const WalletPassModal: React.FC<Props> = ({ patient, accessPin, onClose, qrValue }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#181c24] border border-[#3d494c]/60 rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative text-[#dfe2ee]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#31353e]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#06b6d4]/20 text-[#4cd7f6] border border-[#4cd7f6]/30">
              <span className="material-symbols-outlined text-[24px]">wallet</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-lg text-white font-bold">
                Emergency Medical ID Wallet Card
              </h3>
              <p className="text-xs text-[#bcc9cd] mt-0.5">
                Physical Wallet Card & Mobile Health Pass Preview
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#869397] hover:text-white hover:bg-[#262a33] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Printable Card Preview */}
        <div className="my-6 flex justify-center">
          <div
            id="emergency-wallet-card"
            className="w-full max-w-md bg-gradient-to-br from-[#0a0e16] to-[#1c2028] border-2 border-[#4cd7f6]/50 rounded-2xl p-5 shadow-2xl text-white relative overflow-hidden"
          >
            {/* Top decorative stripe */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#ef4444] via-[#06b6d4] to-[#4edea3]" />

            {/* Header in Card */}
            <div className="flex items-center justify-between mt-1 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#06b6d4]/20 border border-[#06b6d4]/50 flex items-center justify-center text-[#4cd7f6]">
                  <span className="material-symbols-outlined text-[18px]">emergency</span>
                </div>
                <div>
                  <div className="text-xs font-bold font-mono tracking-wider text-white">
                    EMERGENCY MEDICAL PASS
                  </div>
                  <div className="text-[10px] text-[#869397] font-mono">
                    MEDBRIDGE PATIENT ACCESS
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#ffb4ab] font-mono tracking-tight">
                  {patient.bloodGroup}
                </span>
                <span className="text-[10px] block text-[#869397] font-mono">
                  {patient.rhFactor}
                </span>
              </div>
            </div>

            {/* Patient Name & MRN */}
            <div className="mb-4 bg-[#0a0e16]/80 p-3 rounded-xl border border-[#31353e]">
              <div className="text-[10px] text-[#869397] uppercase font-mono">PATIENT NAME & MRN</div>
              <div className="text-base font-bold text-white tracking-wide">{patient.name}</div>
              <div className="text-xs text-[#4cd7f6] font-mono">MRN: #{patient.mrn} • DOB: {patient.dateOfBirth || patient.dob.slice(0,10)} · Age {patient.age}</div>
            </div>

            {/* QR Code and Pin in Card */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white p-2 rounded-xl flex items-center justify-center shadow-inner">
                <QRCodeSVG value={qrValue || 'https://medbridge.invalid/no-active-token'} size={96} level="H" includeMargin />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] text-[#869397] uppercase font-mono">EMERGENCY PIN</span>
                <span className="text-xl font-bold font-mono text-[#4cd7f6] bg-[#0a0e16] px-2.5 py-1.5 rounded-lg border border-[#31353e] tracking-widest my-1">
                  {accessPin}
                </span>
                <span className="text-[10px] text-[#bcc9cd] leading-tight">
                  Scan to request the patient-authorized triage categories
                </span>
              </div>
            </div>

            {/* Critical Flags */}
            <div className="space-y-1.5 text-[11px] border-t border-[#31353e] pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[#869397]">CRITICAL ALLERGIES:</span>
                <span className="text-[#ffb4ab] font-bold">
                  {patient.allergies.map((a) => a.name).join(', ')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#869397]">ADVANCE DIRECTIVE:</span>
                <span className="text-[#4edea3] font-bold">{patient.directives.codeStatus}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#869397]">PRIMARY CONTACT:</span>
                <span className="text-white font-mono">
                  {patient.emergencyContacts[0]?.name} ({patient.emergencyContacts[0]?.phone})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer print action */}
        <div className="pt-4 border-t border-[#31353e] flex items-center justify-between">
          <span className="text-xs text-[#869397]">
            Format: Standard CR80 Wallet Card (3.375" x 2.125")
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#003640] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              Print Medical Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
