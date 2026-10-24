import React, { useState } from 'react';
import { AuditLogEntry, PatientProfile } from '../types/medical';

interface Props {
  patient: PatientProfile;
  auditLogs: AuditLogEntry[];
  merkleRoot: string;
  onOpenMerkleProof: () => void;
  onOpenFhirExport: () => void;
}

export const AuditLogSection: React.FC<Props> = ({
  patient,
  auditLogs,
  merkleRoot,
  onOpenMerkleProof,
  onOpenFhirExport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      String(log.actor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(log.badgeId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(log.actionEvent || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(log.status || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-[#181c24] border border-[#3d494c]/40 rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#06b6d4]/20 border border-[#4cd7f6]/40 flex items-center justify-center text-[#4cd7f6] shrink-0">
            <span className="material-symbols-outlined text-[28px]">verified_user</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Immutable Security & Consent Audit Ledger</h2>
              <span className="bg-[#00a572]/20 text-[#4edea3] text-xs font-mono px-2 py-0.5 rounded font-bold">
                LOCAL AUDIT LOG
              </span>
            </div>
            <p className="text-xs text-[#bcc9cd] font-mono mt-0.5">
              Subject: {patient.name} (MRN #{patient.mrn}) • Merkle Anchor: {merkleRoot}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenFhirExport}
            className="px-3.5 py-2 bg-[#1c2028] hover:bg-[#262a33] text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 border border-[#3d494c]/40"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export FHIR (JSON)
          </button>
          <button
            onClick={onOpenMerkleProof}
            className="px-3.5 py-2 bg-[#4cd7f6] hover:bg-[#acedff] text-[#003640] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-[#4cd7f6]/20"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            Verify Merkle Proof
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#181c24] border border-[#3d494c]/40 rounded-xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined text-[#869397] text-[18px] absolute left-3 top-2.5">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by actor, event, badge..."
            className="w-full bg-[#0a0e16] border border-[#3d494c]/50 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#869397] focus:outline-none focus:border-[#4cd7f6]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'VERIFIED', 'ACCESS GRANTED', 'MINTED', 'EXPIRED / REVOKED'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-colors ${
                statusFilter === filter
                  ? 'bg-[#06b6d4] text-[#003640]'
                  : 'bg-[#1c2028] text-[#bcc9cd] hover:bg-[#262a33]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#181c24] border border-[#3d494c]/40 rounded-xl shadow-xl overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0a0e16] text-[#869397] font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor & Badge ID</th>
                <th className="py-3 px-4">Role Pill</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4 text-right">Status</th>
                <th className="py-3 px-4 font-mono text-right">SHA-256 Hash Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#31353e]/60 text-[#bcc9cd]">
              {filteredLogs.map((log) => {
                const isErr = log.color === 'error';
                const isSec = log.color === 'secondary';
                return (
                  <tr key={log.id} className="hover:bg-[#1c2028] transition-colors">
                    <td
                      className={`py-3.5 px-4 font-mono text-xs font-semibold ${
                        isErr ? 'text-[#ffb4ab]' : 'text-[#4cd7f6]'
                      }`}
                    >
                      {log.timestamp}
                    </td>
                    <td className="py-3.5 px-4 text-white font-semibold flex items-center gap-2">
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          isErr ? 'text-[#ffb4ab]' : isSec ? 'text-[#4edea3]' : 'text-[#4cd7f6]'
                        }`}
                      >
                        {isErr ? 'block' : isSec ? 'medical_services' : 'person'}
                      </span>
                      {log.actor} ({log.badgeId})
                    </td>
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4 text-right">
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
                    <td className="py-3.5 px-4 font-mono text-right text-[11px] text-[#869397]">
                      {log.hashProof}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Hash Bar */}
        <div className="p-4 bg-[#0a0e16] border-t border-[#31353e]/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-[#869397] font-mono text-[10px]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[16px]">
              fingerprint
            </span>
            <span>
              MERKLE ROOT HASH: <span className="text-white font-semibold">{merkleRoot}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>ACCESS: SERVER VALIDATED</span>
            <span>•</span>
            <span className="text-[#4edea3] font-semibold">SYNTHETIC DEMO DATA</span>
          </div>
        </div>
      </div>
    </div>
  );
};
