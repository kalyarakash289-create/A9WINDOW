import { useAppStore } from '../lib/store';
import { HardDrive, FolderTree } from 'lucide-react';

function formatMB(mb: number): string {
  if (mb >= 1048576) return (mb / 1048576).toFixed(1) + ' TB';
  if (mb >= 1024) return (mb / 1024).toFixed(1) + ' GB';
  return mb.toFixed(0) + ' MB';
}

export function Storage() {
  const { diskInfo } = useAppStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-a9-text">Storage Analyzer</h1>
          <p className="text-sm text-a9-text-muted mt-1">Disk usage analysis and storage overview</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <FolderTree size={14} />
          Scan Folder
        </button>
      </div>

      {/* Disk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {diskInfo.map((disk) => (
          <div key={disk.letter} className="glass-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-a9-green/10">
                  <HardDrive size={20} className="text-a9-green" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-a9-text">{disk.label} ({disk.letter})</h3>
                  <p className="text-xs text-a9-text-dim">{disk.model}</p>
                </div>
              </div>
              <span className="badge badge-good">{disk.health}</span>
            </div>

            {/* Usage Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-a9-text-muted">{formatMB(disk.used)} used</span>
                <span className="text-xs text-a9-text-dim">{formatMB(disk.total)} total</span>
              </div>
              <div className="h-3 bg-a9-surface-3 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${disk.usagePercent > 90 ? 'bg-a9-red' : disk.usagePercent > 75 ? 'bg-a9-yellow' : 'bg-a9-green'}`}
                  style={{ width: `${disk.usagePercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-a9-text-dim">{disk.usagePercent}% used</span>
                <span className="text-xs text-a9-green">{formatMB(disk.free)} free</span>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-a9-border">
              <div>
                <span className="text-[10px] text-a9-text-dim block">Filesystem</span>
                <span className="text-xs text-a9-text">{disk.filesystem}</span>
              </div>
              <div>
                <span className="text-[10px] text-a9-text-dim block">Interface</span>
                <span className="text-xs text-a9-text">{disk.interface}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* File Type Breakdown */}
      <div className="glass-panel p-5">
        <h3 className="text-sm font-semibold text-a9-text mb-4">Storage Breakdown by Type</h3>
        <div className="space-y-3">
          {[
            { type: 'Applications', size: 145, percent: 42, color: 'bg-a9-cyan' },
            { type: 'Documents', size: 52, percent: 15, color: 'bg-a9-blue' },
            { type: 'Media (Photos/Videos)', size: 78, percent: 23, color: 'bg-a9-violet' },
            { type: 'System Files', size: 35, percent: 10, color: 'bg-a9-yellow' },
            { type: 'Temporary / Cache', size: 22, percent: 6, color: 'bg-a9-red' },
            { type: 'Other', size: 14, percent: 4, color: 'bg-a9-text-dim' },
          ].map((item) => (
            <div key={item.type} className="flex items-center gap-3">
              <span className="text-xs text-a9-text-muted w-40 truncate">{item.type}</span>
              <div className="flex-1 h-2 bg-a9-surface-3 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }} />
              </div>
              <span className="text-xs text-a9-text-dim w-16 text-right">{item.size} GB</span>
              <span className="text-xs text-a9-text-dim w-10 text-right">{item.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Large Files */}
      <div className="glass-panel p-5">
        <h3 className="text-sm font-semibold text-a9-text mb-4">Largest Files Detected</h3>
        <div className="space-y-2">
          {[
            { name: 'pagefile.sys', path: 'C:\\', size: '16.0 GB' },
            { name: 'hiberfil.sys', path: 'C:\\', size: '12.0 GB' },
            { name: 'swapfile.sys', path: 'C:\\', size: '256 MB' },
            { name: 'WinSxS Backup', path: 'C:\\Windows\\WinSxS', size: '8.4 GB' },
            { name: 'game_install.iso', path: 'D:\\Downloads', size: '4.2 GB' },
          ].map((file, i) => (
            <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-a9-surface-2/50">
              <div>
                <span className="text-xs font-medium text-a9-text">{file.name}</span>
                <span className="text-[10px] text-a9-text-dim ml-2">{file.path}</span>
              </div>
              <span className="text-xs text-a9-text-dim">{file.size}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
