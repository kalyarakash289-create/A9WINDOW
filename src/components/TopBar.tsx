import { useAppStore } from '../lib/store';
import { Search, Bell, Maximize2 } from 'lucide-react';

export function TopBar() {
  const { healthScore, setCommandPaletteOpen } = useAppStore();
  
  const getStatus = () => {
    if (!healthScore) return { label: 'Initializing...', color: 'status-warning' };
    if (healthScore.score >= 80) return { label: 'Healthy', color: 'status-healthy' };
    if (healthScore.score >= 60) return { label: 'Attention', color: 'status-warning' };
    return { label: 'Critical', color: 'status-critical' };
  };

  const status = getStatus();

  return (
    <header className="flex items-center justify-between h-14 px-6 border-b border-a9-border bg-a9-surface/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className={`status-dot ${status.color}`}></span>
          <span className="text-sm font-medium text-a9-text-muted">System: {status.label}</span>
        </div>
        {healthScore && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-a9-surface-2 border border-a9-border">
            <span className="text-xs text-a9-text-dim">Health Score</span>
            <span className={`text-sm font-bold ${healthScore.score >= 80 ? 'text-a9-green' : healthScore.score >= 60 ? 'text-a9-yellow' : 'text-a9-red'}`}>
              {healthScore.score}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-a9-surface-2 border border-a9-border text-a9-text-dim hover:text-a9-text hover:border-a9-border-light transition-colors"
        >
          <Search size={14} />
          <span className="text-xs">Search...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-a9-surface-3 rounded border border-a9-border text-a9-text-dim">⌘K</kbd>
        </button>

        <button className="p-2 rounded-lg text-a9-text-dim hover:text-a9-text hover:bg-a9-surface-2 transition-colors relative">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-a9-cyan"></span>
        </button>

        <button className="p-2 rounded-lg text-a9-text-dim hover:text-a9-text hover:bg-a9-surface-2 transition-colors">
          <Maximize2 size={16} />
        </button>
      </div>
    </header>
  );
}
