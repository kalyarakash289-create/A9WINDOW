import { useState } from 'react';
import { Shield, Eye, Trash2, Lock, AlertTriangle, CheckCircle } from 'lucide-react';

export function Privacy() {
  const [actions, setActions] = useState([
    { id: '1', name: 'Clear Recent Files History', description: 'Remove recently opened file list', safe: true, done: false },
    { id: '2', name: 'Clear Windows Search History', description: 'Remove search queries from Windows Search', safe: true, done: false },
    { id: '3', name: 'Clear Browser Cache', description: 'Remove cached web content from Chrome', safe: true, done: false },
    { id: '4', name: 'Clear Thumbnail Cache', description: 'Remove cached image thumbnails', safe: true, done: false },
    { id: '5', name: 'Clear Temp Internet Files', description: 'Remove temporary internet files', safe: true, done: false },
    { id: '6', name: 'Clear Windows Timeline', description: 'Remove activity history', safe: true, done: false },
    { id: '7', name: 'Clear Clipboard History', description: 'Remove clipboard data history', safe: true, done: false },
    { id: '8', name: 'Disable Telemetry', description: 'Reduce Windows diagnostic data collection', safe: false, done: false },
  ]);

  const toggleAction = (id: string) => {
    setActions(actions.map(a => a.id === id ? { ...a, done: !a.done } : a));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-a9-text">Privacy</h1>
          <p className="text-sm text-a9-text-muted mt-1">Manage privacy settings and clear traces</p>
        </div>
      </div>

      {/* Privacy Status */}
      <div className="glass-panel p-5">
        <div className="flex items-center gap-3 mb-4">
          <Shield size={20} className="text-a9-cyan" />
          <h3 className="text-sm font-semibold text-a9-text">Privacy Status</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Telemetry', value: 'Reduced', status: 'good' },
            { label: 'Activity History', value: 'Active', status: 'warning' },
            { label: 'Location Services', value: 'Off', status: 'good' },
            { label: 'Advertising ID', value: 'Disabled', status: 'good' },
          ].map((item) => (
            <div key={item.label} className="glass-panel-sm p-3">
              <span className="text-[10px] text-a9-text-dim block uppercase">{item.label}</span>
              <span className={`text-sm font-medium ${item.status === 'good' ? 'text-a9-green' : 'text-a9-yellow'}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="glass-panel p-5">
        <h3 className="text-sm font-semibold text-a9-text mb-4">Privacy Actions</h3>
        <div className="space-y-2">
          {actions.map((action) => (
            <div key={action.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-a9-surface-2/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded ${action.safe ? 'bg-a9-green/10' : 'bg-a9-yellow/10'}`}>
                  {action.safe ? <Eye size={12} className="text-a9-green" /> : <AlertTriangle size={12} className="text-a9-yellow" />}
                </div>
                <div>
                  <span className="text-sm text-a9-text">{action.name}</span>
                  <p className="text-xs text-a9-text-dim">{action.description}</p>
                </div>
              </div>
              <button
                onClick={() => toggleAction(action.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                  ${action.done ? 'bg-a9-green/10 text-a9-green' : 'bg-a9-surface-3 text-a9-text-dim hover:text-a9-text'}`}
              >
                {action.done ? <span className="flex items-center gap-1"><CheckCircle size={12} /> Done</span> : 'Clear'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notice */}
      <div className="glass-panel-sm p-4 flex items-start gap-3">
        <Lock size={14} className="text-a9-blue mt-0.5" />
        <div className="text-xs text-a9-text-dim">
          <p className="font-medium text-a9-text-muted mb-1">Privacy Notice</p>
          <p>A9 Optimizer does not collect, transmit, or store personal data. All privacy operations are performed locally on your machine.</p>
          <p className="mt-1">This tool does not guarantee complete anonymity or undetectability. For advanced privacy needs, consult dedicated security software.</p>
        </div>
      </div>
    </div>
  );
}
