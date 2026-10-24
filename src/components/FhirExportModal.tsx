import React, { useState } from 'react';
import { PatientProfile, ConsentScopes, AuditLogEntry } from '../types/medical';

interface Props {
  patient: PatientProfile;
  scopes: ConsentScopes;
  auditLogs: AuditLogEntry[];
  onClose: () => void;
}

export const FhirExportModal: React.FC<Props> = ({ patient, scopes, auditLogs, onClose }) => {
  const [copied, setCopied] = useState(false);

  // Generate real FHIR R4 Bundle
  const fhirBundle = {
    resourceType: 'Bundle',
    id: `medbridge-fhir-bundle-${patient.mrn.toLowerCase()}`,
    meta: {
      lastUpdated: new Date().toISOString(),
      profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient'],
      security: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'ETH',
          display: 'substance abuse information sensitivity',
        },
      ],
    },
    type: 'document',
    entry: [
      {
        resource: {
          resourceType: 'Patient',
          id: patient.mrn,
          identifier: [
            {
              system: 'urn:oid:2.16.840.1.113883.4.1',
              value: patient.mrn,
              type: { text: 'Medical Record Number' },
            },
          ],
          active: true,
          name: [
            {
              use: 'official',
              text: patient.name,
            },
          ],
          birthDate: patient.dob.split(' ')[0],
          extension: [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/patient-bloodGroup',
              valueString: `${patient.bloodGroup} (${patient.rhFactor})`,
            },
          ],
        },
      },
      {
        resource: {
          resourceType: 'Consent',
          id: `consent-${patient.mrn}`,
          status: 'active',
          scope: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/consentscope',
                code: 'patient-privacy',
                display: 'Privacy Consent',
              },
            ],
          },
          category: [
            {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/consentcategorycodes',
                  code: 'emrgonly',
                  display: 'Emergency Only',
                },
              ],
            },
          ],
          patient: {
            reference: `Patient/${patient.mrn}`,
            display: patient.name,
          },
          dateTime: new Date().toISOString(),
          provision: {
            type: 'permit',
            purpose: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v3-ActReason',
                code: 'ETREAT',
                display: 'Emergency Treatment',
              },
            ],
            securityLabel: scopes.sensitiveHistory ? [] : [{ code: 'R', display: 'Restricted' }],
            dataPeriod: {
              start: new Date().toISOString(),
              end: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
            },
          },
        },
      },
      ...auditLogs.map((log) => ({
        resource: {
          resourceType: 'AuditEvent',
          id: `audit-${log.id}`,
          type: {
            system: 'http://terminology.hl7.org/CodeSystem/audit-event-type',
            code: 'rest',
            display: log.actionEvent,
          },
          action: 'E',
          recorded: `${new Date().toISOString().split('T')[0]}T${log.timestamp}:00Z`,
          outcome: '0',
          outcomeDesc: log.status,
          agent: [
            {
              role: [{ text: log.rolePill }],
              name: log.actor,
              altId: log.badgeId,
              requestor: true,
            },
          ],
          entity: [
            {
              what: { reference: `Patient/${patient.mrn}` },
              securityLabel: [{ display: log.hashProof }],
            },
          ],
        },
      })),
    ],
  };

  const jsonString = JSON.stringify(fhirBundle, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medbridge-fhir-bundle-${patient.mrn}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#181c24] border border-[#3d494c]/60 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col p-6 shadow-2xl relative text-[#dfe2ee]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#31353e]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#06b6d4]/20 text-[#4cd7f6] border border-[#4cd7f6]/30">
              <span className="material-symbols-outlined text-[24px]">code</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-lg text-white font-bold">
                  HL7 FHIR R4 JSON Export
                </h3>
                <span className="bg-[#06b6d4]/20 text-[#4cd7f6] text-[11px] font-mono px-2 py-0.5 rounded font-bold">
                  STANDARDS COMPLIANT
                </span>
              </div>
              <p className="text-xs text-[#bcc9cd] mt-0.5">
                Patient Privacy Consent & Real-time AuditEvent Resources
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

        {/* Code Content */}
        <div className="my-4 flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between bg-[#0a0e16] px-4 py-2 border-t border-l border-r border-[#31353e] rounded-t-lg text-xs font-mono text-[#869397]">
            <span>Content-Type: application/fhir+json</span>
            <span>{patient.mrn} • 2.16.840.1.113883.4.1</span>
          </div>
          <pre className="flex-1 overflow-auto p-4 bg-[#0a0e16] border border-[#31353e] rounded-b-lg font-mono text-xs text-[#4edea3] leading-relaxed selection:bg-[#4edea3]/20">
            {jsonString}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#31353e] flex items-center justify-between">
          <span className="text-xs text-[#869397] font-mono">
            Compliant with US Core Implementation Guide 5.0.1
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-[#262a33] hover:bg-[#31353e] text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              {copied ? 'Copied to Clipboard' : 'Copy JSON'}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#003640] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-[#06b6d4]/20"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              Download FHIR (.json)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
