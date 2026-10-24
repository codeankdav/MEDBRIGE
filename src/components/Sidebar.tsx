import React from 'react';

interface Props {
  currentView: 'split' | 'patient' | 'responder' | 'audit' | 'directives' | 'directory';
  onSelectView: (view: 'split' | 'patient' | 'responder' | 'audit' | 'directives' | 'directory') => void;
  sessionTtl: string;
  onRevokeSession: () => void;
  relayId: string;
  latencyMs: number;
  isRevoked: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<Props> = ({
  currentView,
  onSelectView,
  sessionTtl,
  onRevokeSession,
  relayId,
  latencyMs,
  isRevoked,
  mobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'split', label: 'Split Demo Console', icon: 'view_sidebar' },
    { id: 'directory', label: 'Patient Directory', icon: 'groups' },
    { id: 'patient', label: 'QR Token & Passcode', icon: 'qr_code_2' },
    { id: 'responder', label: 'Responder Triage', icon: 'medical_services' },
    { id: 'audit', label: 'Security Audit Logs', icon: 'verified_user' },
    { id: 'directives', label: 'Directives & DNR', icon: 'gavel' },
  ] as const;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed left-0 top-28 md:top-16 bottom-0 w-64 bg-[#181c24] border-r border-[#3d494c]/40 z-40 flex flex-col justify-between py-4 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-3">
          {/* Section Heading */}
          <div className="px-5 flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#869397] tracking-widest uppercase font-semibold">
              Bridge Telemetry
            </span>
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isRevoked ? 'bg-[#ffb4ab]' : 'bg-[#4edea3]'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isRevoked ? 'bg-[#ffb4ab]' : 'bg-[#4edea3]'
              }`} />
            </span>
          </div>

          {/* Nav List */}
          <nav className="flex flex-col gap-1 px-2">
            {navItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectView(item.id);
                    onCloseMobile();
                  }}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg transition-colors text-left text-sm ${
                    active
                      ? 'bg-[#262a33] text-[#4cd7f6] border-l-2 border-[#4cd7f6] font-semibold shadow-sm'
                      : 'text-[#bcc9cd] hover:bg-[#1c2028] hover:text-[#dfe2ee] font-medium'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom TTL Card */}
        <div className="px-3 pt-3 border-t border-[#3d494c]/30 flex flex-col gap-2">
          <div className="bg-[#0a0e16] p-2.5 rounded-lg border border-[#3d494c]/30 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-[#869397] uppercase">TTL SESSION</span>
              <span className={`font-mono text-sm font-bold ${
                isRevoked ? 'text-[#ffb4ab]' : 'text-[#4cd7f6]'
              }`}>
                {isRevoked ? 'EXPIRED' : sessionTtl}
              </span>
            </div>
            <button
              onClick={onRevokeSession}
              disabled={isRevoked}
              className={`px-2 py-1 text-[10px] font-mono rounded uppercase tracking-wider font-semibold transition-colors ${
                isRevoked
                  ? 'bg-[#31353e] text-[#869397] cursor-not-allowed'
                  : 'bg-[#93000a] text-[#ffdad6] hover:bg-[#ffb4ab] hover:text-[#690005]'
              }`}
            >
              {isRevoked ? 'Revoked' : 'Revoke'}
            </button>
          </div>

          <div className="flex items-center justify-between text-[#869397] text-[10px] font-mono px-1">
            <span>RELAY ID: {relayId}</span>
            <span>LATENCY: {latencyMs}ms</span>
          </div>
        </div>
      </aside>
    </>
  );
};
