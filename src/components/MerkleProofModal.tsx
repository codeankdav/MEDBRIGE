import React from 'react';
import { PatientProfile } from '../types/medical';

interface Props {
  patient: PatientProfile;
  merkleRoot: string;
  onClose: () => void;
}

export const MerkleProofModal: React.FC<Props> = ({ patient, merkleRoot, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#181c24] border border-[#3d494c]/60 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative text-[#dfe2ee]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#31353e]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#00a572]/20 text-[#4edea3] border border-[#4edea3]/30">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-lg text-white font-bold">
                  Cryptographic Merkle Proof Verification
                </h3>
                <span className="bg-[#00a572]/20 text-[#4edea3] text-[11px] font-mono px-2 py-0.5 rounded font-bold">
                  VALIDATED
                </span>
              </div>
              <p className="text-xs text-[#bcc9cd] mt-0.5">
                St. Mary Health Network • Decentralized Healthcare Audit Ledger #8492-AX
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

        {/* Status Callout */}
        <div className="my-5 p-4 rounded-lg bg-[#1c2028] border border-[#4edea3]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#4edea3] animate-pulse"></span>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#4edea3] font-bold block">
                Demo Proof Status: Placeholder
              </span>
              <span className="text-xs text-[#bcc9cd]">
                This screen shows demonstration data; it does not verify stored clinical records.
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono bg-[#0a0e16] px-2.5 py-1 rounded text-[#4cd7f6] border border-[#3d494c]/40">
            Block #19,402,118
          </span>
        </div>

        {/* Merkle Tree Flow */}
        <div className="space-y-4 font-mono text-xs">
          {/* Merkle Root */}
          <div className="p-3.5 rounded-lg bg-[#0a0e16] border border-[#4cd7f6]/40">
            <div className="flex items-center justify-between text-[#869397] text-[11px] uppercase mb-1">
              <span>Merkle Root Hash (SHA-256)</span>
              <span className="text-[#4cd7f6] font-bold">Notarized Header</span>
            </div>
            <div className="text-sm font-bold text-[#4cd7f6] break-all selection:bg-[#4cd7f6]/30">
              {merkleRoot}
            </div>
          </div>

          {/* Tree Branches */}
          <div className="relative pl-6 border-l-2 border-[#3d494c] ml-4 space-y-3">
            {/* Branch 1 */}
            <div className="p-3 rounded bg-[#1c2028] border border-[#31353e]">
              <div className="text-[10px] text-[#869397] uppercase">Branch Node A (Consent & Authorization)</div>
              <div className="text-xs text-white truncate">0x4a7e91d8820c...bc213ef9081</div>
              <div className="text-[11px] text-[#bcc9cd] mt-1 font-sans">
                Leaf 1: Patient MRN ({patient.mrn}) + Active Ephemeral Scope Envelope
              </div>
            </div>

            {/* Branch 2 */}
            <div className="p-3 rounded bg-[#1c2028] border border-[#31353e]">
              <div className="text-[10px] text-[#869397] uppercase">Branch Node B (Emergency Responder Access)</div>
              <div className="text-xs text-white truncate">0xd3b771e892cc...a1099fe4512</div>
              <div className="text-[11px] text-[#bcc9cd] mt-1 font-sans">
                Leaf 2: Clinician Badge #ER-402 (Dr. Kabir Sharma) + Mutual FirstNet Auth
              </div>
            </div>

            {/* Branch 3 */}
            <div className="p-3 rounded bg-[#1c2028] border border-[#31353e]">
              <div className="text-[10px] text-[#869397] uppercase">Branch Node C (Clinical Directives & Vitals)</div>
              <div className="text-xs text-white truncate">0x9812cc11fe7a...7720ba981ef</div>
              <div className="text-[11px] text-[#bcc9cd] mt-1 font-sans">
                Leaf 3: Blood Group ({patient.bloodGroup}) + POLST Directives + Allergies Hash
              </div>
            </div>
          </div>

          {/* Metadata details */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-[11px]">
            <div className="p-2.5 rounded bg-[#1c2028]">
              <span className="text-[#869397] block">Consensus Network</span>
              <span className="text-white font-bold">St. Mary Health Federated Ledger</span>
            </div>
            <div className="p-2.5 rounded bg-[#1c2028]">
              <span className="text-[#869397] block">Access Validation</span>
              <span className="text-white font-bold">Opaque token · server checked</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-4 border-t border-[#31353e] flex items-center justify-between">
          <span className="text-xs text-[#869397] flex items-center gap-1 font-mono">
            <span className="material-symbols-outlined text-[16px] text-[#4edea3]">lock</span>
            Synthetic demo audit entry
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#003640] font-bold text-xs rounded-lg transition-colors"
          >
            Dismiss Verification
          </button>
        </div>
      </div>
    </div>
  );
};
