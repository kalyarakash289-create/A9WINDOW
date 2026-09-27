import { Info, Shield, FileText, ExternalLink, Heart } from 'lucide-react';

export function About() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-a9-text">About</h1>
        <p className="text-sm text-a9-text-muted mt-1">A9 Optimizer information and credits</p>
      </div>

      {/* Main About Card */}
      <div className="glass-panel p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-a9-cyan via-a9-blue to-a9-violet flex items-center justify-center shadow-lg shadow-a9-cyan/20">
            <span className="text-white font-black text-2xl">A9</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold gradient-text mb-2">A9 OPTIMIZER</h2>
        <p className="text-sm text-a9-text-muted mb-4">Professional Windows Optimization & Diagnostics</p>
        
        <div className="flex items-center justify-center gap-6 text-xs text-a9-text-dim mb-6">
          <span>Version 1.0.0</span>
          <span>•</span>
          <span>Windows x64</span>
          <span>•</span>
          <span>Electron + React</span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button className="btn-primary text-xs">Check for Updates</button>
          <button className="btn-secondary text-xs">Open Logs</button>
          <button className="btn-secondary text-xs">System Info</button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <Info size={16} className="text-a9-cyan" />
            <h3 className="text-sm font-semibold text-a9-text">Application Info</h3>
          </div>
          <div className="space-y-2">
            <InfoRow label="Version" value="1.0.0" />
            <InfoRow label="Build" value="2024.03.15" />
            <InfoRow label="Architecture" value="Windows x64" />
            <InfoRow label="Electron" value="28.x" />
            <InfoRow label="React" value="18.x" />
            <InfoRow label="Node.js" value="20.x" />
          </div>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-a9-green" />
            <h3 className="text-sm font-semibold text-a9-text">Security</h3>
          </div>
          <div className="space-y-2">
            <InfoRow label="Context Isolation" value="Enabled" />
            <InfoRow label="Node Integration" value="Disabled" />
            <InfoRow label="Sandbox" value="Enabled" />
            <InfoRow label="IPC Validation" value="Strict" />
            <InfoRow label="Credential Storage" value="Windows CM" />
            <InfoRow label="CSP" value="Enforced" />
          </div>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={16} className="text-a9-blue" />
            <h3 className="text-sm font-semibold text-a9-text">Licenses</h3>
          </div>
          <div className="space-y-2 text-xs text-a9-text-dim">
            <p>A9 Optimizer is built with open-source software:</p>
            <p>• Electron (MIT License)</p>
            <p>• React (MIT License)</p>
            <p>• TypeScript (Apache 2.0)</p>
            <p>• Tailwind CSS (MIT License)</p>
            <p>• Recharts (MIT License)</p>
            <p>• Lucide Icons (ISC License)</p>
          </div>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <ExternalLink size={16} className="text-a9-violet" />
            <h3 className="text-sm font-semibold text-a9-text">Links</h3>
          </div>
          <div className="space-y-3">
            <a href="#" className="flex items-center gap-2 text-xs text-a9-cyan hover:underline">
              <ExternalLink size={12} /> Documentation
            </a>
            <a href="#" className="flex items-center gap-2 text-xs text-a9-cyan hover:underline">
              <ExternalLink size={12} /> Privacy Policy
            </a>
            <a href="#" className="flex items-center gap-2 text-xs text-a9-cyan hover:underline">
              <ExternalLink size={12} /> Terms of Service
            </a>
            <a href="#" className="flex items-center gap-2 text-xs text-a9-cyan hover:underline">
              <ExternalLink size={12} /> Report an Issue
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-xs text-a9-text-dim flex items-center justify-center gap-1">
          Made with <Heart size={10} className="text-a9-red" /> by A9 Team
        </p>
        <p className="text-[10px] text-a9-text-dim mt-1">© 2024 A9. All rights reserved.</p>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-a9-text-dim">{label}</span>
      <span className="text-xs text-a9-text font-medium">{value}</span>
    </div>
  );
}
