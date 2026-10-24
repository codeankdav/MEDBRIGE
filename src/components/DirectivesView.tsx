import React, { useState } from 'react';
import { PatientProfile } from '../types/medical';
import { sound } from '../utils/audio';

interface Props {
  patient: PatientProfile;
  onLogAction: (event: string, status: 'VERIFIED' | 'ACCESS GRANTED' | 'OVERRIDE APPLIED') => void;
}

export const DirectivesView: React.FC<Props> = ({ patient, onLogAction }) => {
  const [overrideModal, setOverrideModal] = useState(false);
  const [attendingNotes, setAttendingNotes] = useState('');
  const [overrideSuccess, setOverrideSuccess] = useState(false);

  const isDnr = patient.directives.codeStatus.includes('DNR');

  const handleApplyOverride = () => {
    sound.beep(440, 0.2, 'sawtooth');
    setOverrideSuccess(true);
    onLogAction(
      `ATTENDING_OVERRIDE_EXECUTED: ${attendingNotes || 'Imminent Peril Exception'}`,
      'OVERRIDE APPLIED'
    );
    setTimeout(() => {
      setOverrideModal(false);
      setOverrideSuccess(false);
      setAttendingNotes('');
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#181c24] border border-[#3d494c]/40 rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#e79400]/20 border border-[#ffb95f]/40 flex items-center justify-center text-[#ffb95f] shrink-0">
            <span className="material-symbols-outlined text-[28px]">gavel</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">
                Advance Directives & POLST Registry
              </h2>
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${
                  isDnr
                    ? 'bg-[#93000a]/40 text-[#ffb4ab] border border-[#93000a]'
                    : 'bg-[#00a572]/20 text-[#4edea3] border border-[#4edea3]/40'
                }`}
              >
                {patient.directives.codeStatus}
              </span>
            </div>
            <p className="text-xs text-[#bcc9cd] font-mono mt-0.5">
              Registry ID: {patient.directives.polstRegistryId} • Notarized: {patient.directives.notarizedDate}
            </p>
          </div>
        </div>

        <button
          onClick={() => setOverrideModal(true)}
          className="px-4 py-2 bg-[#e79400]/20 hover:bg-[#e79400]/30 text-[#ffb95f] text-xs font-bold rounded-lg border border-[#ffb95f]/40 flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
          Emergency Attending Override Protocol
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): POLST Legal Sections */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="bg-[#181c24] border border-[#3d494c]/40 rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#31353e]">
              <span className="text-xs font-mono text-[#4cd7f6] uppercase tracking-wider font-bold">
                Section A: Cardiopulmonary Resuscitation (CPR)
              </span>
              <span className="text-xs font-mono text-[#869397]">CALIFORNIA POLST v2026</span>
            </div>

            <div
              className={`p-4 rounded-xl border mb-4 ${
                isDnr
                  ? 'bg-[#93000a]/15 border-[#93000a]/50 text-[#ffb4ab]'
                  : 'bg-[#00a572]/15 border-[#4edea3]/40 text-[#4edea3]'
              }`}
            >
              <div className="flex items-center gap-2 font-mono text-sm font-bold uppercase mb-1">
                <span className="material-symbols-outlined text-[20px]">
                  {isDnr ? 'block' : 'favorite'}
                </span>
                {patient.directives.codeStatus}
              </div>
              <p className="text-xs text-[#dfe2ee]">
                {isDnr
                  ? 'Do not attempt resuscitation in the event of cardiac or respiratory arrest. Allow natural death. Provide comfort measures, pain relief, and airway suctioning.'
                  : 'Full cardiopulmonary resuscitation authorized. Initiate ACLS protocol, defibrillation, and chest compressions.'}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#1c2028] p-3 rounded-lg border border-[#31353e]">
                <span className="text-[#869397] font-mono block text-[10px] uppercase">
                  Section B: Medical Interventions & Intubation
                </span>
                <span className="text-white font-semibold block mt-1">
                  {patient.directives.intubationOrder}
                </span>
              </div>

              <div className="bg-[#1c2028] p-3 rounded-lg border border-[#31353e]">
                <span className="text-[#869397] font-mono block text-[10px] uppercase">
                  Section C: Defibrillation & Pacemaker Handling
                </span>
                <span className="text-white font-semibold block mt-1">
                  {patient.directives.defibrillationOrder}
                </span>
              </div>

              <div className="bg-[#1c2028] p-3 rounded-lg border border-[#31353e]">
                <span className="text-[#869397] font-mono block text-[10px] uppercase">
                  Section D: Artificially Administered Nutrition
                </span>
                <span className="text-white font-semibold block mt-1">
                  {patient.directives.artificialNutrition}
                </span>
              </div>
            </div>
          </div>

          {/* Organ Donation Directives */}
          <div className="bg-[#181c24] border border-[#3d494c]/40 rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4edea3] text-[20px]">
                  volunteer_activism
                </span>
                <h4 className="text-sm font-bold text-white">Anatomical Organ Donor Directive</h4>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  patient.directives.organDonor
                    ? 'bg-[#00a572]/20 text-[#4edea3]'
                    : 'bg-[#31353e] text-[#869397]'
                }`}
              >
                {patient.directives.organDonor ? 'DONOR AUTHORIZED' : 'DECLINED / NOT STATED'}
              </span>
            </div>
            <p className="text-xs text-[#bcc9cd]">
              {patient.directives.organDonor
                ? 'Patient has elected universal anatomical gift authorization for transplant and life-saving research. Contact Donor Network of Northern California upon pronouncement.'
                : 'No organ donation authorization recorded on patient state registry.'}
            </p>
          </div>
        </div>

        {/* Right Column (5 cols): Attending Physician & Proxy Authorization */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="bg-[#181c24] border border-[#3d494c]/40 rounded-xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">
                assignment_ind
              </span>
              Certifying Attending Physician
            </h3>

            <div className="bg-[#1c2028] p-3.5 rounded-xl border border-[#31353e] space-y-2 mb-4">
              <div>
                <span className="text-[10px] text-[#869397] font-mono uppercase block">
                  PHYSICIAN SIGNATURE
                </span>
                <span className="text-sm font-bold text-white">
                  {patient.directives.attendingPhysician}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#bcc9cd] pt-2 border-t border-[#31353e]">
                <span>State License: MD-CA-77192</span>
                <span className="text-[#4edea3] font-mono">DIGITALLY NOTARIZED</span>
              </div>
            </div>

            <div className="text-xs text-[#869397] leading-relaxed">
              These orders are legally binding under California Probate Code Division 4.7 and must be
              honored by all paramedics, emergency medical technicians, and hospital emergency
              departments.
            </div>
          </div>

          {/* Designated Medical Proxy Box */}
          <div className="bg-[#181c24] border border-[#3d494c]/40 rounded-xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4edea3] text-[18px]">
                contacts
              </span>
              Durable Healthcare Power of Attorney
            </h3>

            {patient.emergencyContacts.slice(0, 1).map((contact, idx) => (
              <div key={idx} className="bg-[#1c2028] p-3.5 rounded-xl border border-[#31353e]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{contact.name}</span>
                  <span className="bg-[#00a572]/20 text-[#4edea3] text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                    PRIMARY AGENT
                  </span>
                </div>
                <div className="text-xs text-[#bcc9cd] mt-1">{contact.relationship}</div>
                <div className="mt-3 pt-2 border-t border-[#31353e] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#4cd7f6]">{contact.phone}</span>
                  <span className="text-[10px] font-mono text-[#4edea3]">Full Substituted Judgment</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Override Modal */}
      {overrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#181c24] border border-[#ffb95f]/50 rounded-xl w-full max-w-lg p-6 shadow-2xl relative text-[#dfe2ee]">
            <div className="flex items-center justify-between pb-3 border-b border-[#31353e] mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffb95f] text-[24px]">gavel</span>
                <h3 className="text-base font-bold text-white">Emergency Attending Override</h3>
              </div>
              <button
                onClick={() => setOverrideModal(false)}
                className="text-[#869397] hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {overrideSuccess ? (
              <div className="p-4 bg-[#00a572]/20 border border-[#4edea3] rounded-lg text-center text-[#4edea3] font-mono text-xs font-bold space-y-2">
                <span className="material-symbols-outlined text-[32px]">verified</span>
                <div>OVERRIDE CERTIFICATE RECORDED</div>
                <div className="text-[11px] text-[#bcc9cd]">
                  Emergency chart access exception recorded for this demo session.
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <p className="text-[#bcc9cd]">
                  In acute trauma scenarios where patient is incapacitated and shielded data is
                  critical to preserve life, dual attending emergency credentialing allows temporary
                  temporary break-glass access.
                </p>

                <div>
                  <label className="text-[10px] font-mono uppercase text-[#869397] block mb-1">
                    Attending Physician Badge & Justification
                  </label>
                  <input
                    type="text"
                    value={attendingNotes}
                    onChange={(e) => setAttendingNotes(e.target.value)}
                    placeholder="e.g. Severe polytrauma with acute intracranial hemorrhage..."
                    className="w-full bg-[#0a0e16] border border-[#3d494c]/60 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#ffb95f]"
                  />
                </div>

                <div className="p-3 bg-[#0a0e16] rounded-lg border border-[#3d494c]/30 text-[11px] text-[#869397] font-mono">
                  This demo action is recorded in the local security audit log.
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setOverrideModal(false)}
                    className="px-3 py-1.5 bg-[#262a33] text-white rounded-lg hover:bg-[#31353e]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyOverride}
                    className="px-4 py-1.5 bg-[#ffb95f] hover:bg-[#ffddb8] text-[#472a00] font-bold rounded-lg transition-colors"
                  >
                    Record Break-Glass Access
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
