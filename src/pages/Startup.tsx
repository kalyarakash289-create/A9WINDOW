import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { Play, ToggleLeft, ToggleRight, FolderOpen, AlertTriangle } from 'lucide-react';

export function Startup() {
  const { startupItems, setStartupItems } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'enabled' | 'disabled'>('all');

  const filtered = startupItems.filter(item => {
    if (filter === 'enabled') return item.enabled;
    if (filter === 'disabled') return !item.enabled;
    return true;
  });

  const toggleItem = (id: string) => {
    setStartupItems(startupItems.map(item =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    ));
  };

  const getImpactBadge = (impact: string) => {
    const styles: Record<string, string> = { high: 'badge-medium', medium: 'badge-low', low: 'badge-safe', none: 'badge-safe' };
    return styles[impact] || 'badge-safe';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-a9-text">Startup Manager</h1>
          <p className="text-sm text-a9-text-muted mt-1">{startupItems.length} startup items • {startupItems.filter(i => i.enabled).length} enabled</p>
        </div>
        <div className="flex items-center gap-1 bg-a9-surface-2 rounded-lg p-1 border border-a9-border">
          {(['all', 'enabled', 'disabled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors
                ${filter === f ? 'bg-a9-cyan/20 text-a9-cyan' : 'text-a9-text-dim hover:text-a9-text'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Startup List */}
      <div className="glass-panel overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Application</th>
              <th>Publisher</th>
              <th>Location</th>
              <th>Impact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="flex items-center gap-2">
                    <Play size={12} className="text-a9-cyan" />
                    <span className="text-sm font-medium text-a9-text">{item.name}</span>
                  </div>
                </td>
                <td className="text-xs text-a9-text-muted">{item.publisher}</td>
                <td className="text-xs text-a9-text-dim font-mono truncate max-w-[200px]">{item.location}</td>
                <td><span className={`badge ${getImpactBadge(item.impact)}`}>{item.impact}</span></td>
                <td>
                  <span className={`text-xs font-medium ${item.enabled ? 'text-a9-green' : 'text-a9-text-dim'}`}>
                    {item.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="p-1.5 rounded hover:bg-a9-surface-3 text-a9-text-dim hover:text-a9-cyan transition-colors"
                      title={item.enabled ? 'Disable' : 'Enable'}
                    >
                      {item.enabled ? <ToggleRight size={16} className="text-a9-green" /> : <ToggleLeft size={16} />}
                    </button>
                    <button className="p-1.5 rounded hover:bg-a9-surface-3 text-a9-text-dim hover:text-a9-text transition-colors" title="Open location">
                      <FolderOpen size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info */}
      <div className="glass-panel-sm p-4 flex items-start gap-3">
        <AlertTriangle size={14} className="text-a9-yellow mt-0.5" />
        <div className="text-xs text-a9-text-dim">
          <p className="font-medium text-a9-text-muted mb-1">Startup Management Notes</p>
          <p>• Disabling startup items is reversible. Original state is preserved.</p>
          <p>• System-critical items (Windows Security, audio drivers) should remain enabled.</p>
          <p>• High-impact items significantly affect boot time.</p>
        </div>
      </div>
    </div>
  );
}
