import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { Search, RefreshCw, XCircle, AlertTriangle, FolderOpen } from 'lucide-react';

export function Processes() {
  const { processes } = useAppStore();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'cpu' | 'memory'>('cpu');
  const [selectedProcess, setSelectedProcess] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const filtered = processes
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'cpu') return b.cpu - a.cpu;
      if (sortBy === 'memory') return b.memory - a.memory;
      return a.name.localeCompare(b.name);
    });

  const handleEndProcess = () => {
    setShowConfirm(false);
    setSelectedProcess(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-a9-text">Processes</h1>
          <p className="text-sm text-a9-text-muted mt-1">{processes.length} running processes</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-a9-text-dim" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search processes..."
            className="w-full pl-9 pr-4 py-2 bg-a9-surface-2 border border-a9-border rounded-lg text-sm text-a9-text placeholder-a9-text-dim outline-none focus:border-a9-cyan/50"
          />
        </div>
        <div className="flex items-center gap-1 bg-a9-surface-2 rounded-lg p-1 border border-a9-border">
          {(['cpu', 'memory', 'name'] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors
                ${sortBy === sort ? 'bg-a9-cyan/20 text-a9-cyan' : 'text-a9-text-dim hover:text-a9-text'}`}
            >
              {sort}
            </button>
          ))}
        </div>
      </div>

      {/* Process Table */}
      <div className="glass-panel overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Process</th>
              <th>PID</th>
              <th>CPU %</th>
              <th>Memory %</th>
              <th>Publisher</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((proc) => (
              <tr key={proc.pid} className={`${proc.isSystem ? 'opacity-70' : ''}`}>
                <td>
                  <div className="flex items-center gap-2">
                    {proc.isSystem && <AlertTriangle size={12} className="text-a9-yellow" />}
                    <span className="text-sm font-medium text-a9-text">{proc.name}</span>
                  </div>
                </td>
                <td className="text-sm text-a9-text-dim font-mono">{proc.pid}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-12 progress-bar">
                      <div className={`progress-fill ${proc.cpu > 10 ? 'bg-a9-red' : proc.cpu > 5 ? 'bg-a9-yellow' : 'bg-a9-green'}`} style={{ width: `${Math.min(proc.cpu * 5, 100)}%` }} />
                    </div>
                    <span className="text-xs text-a9-text-dim">{proc.cpu.toFixed(1)}%</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-12 progress-bar">
                      <div className={`progress-fill ${proc.memory > 10 ? 'bg-a9-red' : proc.memory > 5 ? 'bg-a9-yellow' : 'bg-a9-blue'}`} style={{ width: `${Math.min(proc.memory * 5, 100)}%` }} />
                    </div>
                    <span className="text-xs text-a9-text-dim">{proc.memory.toFixed(1)}%</span>
                  </div>
                </td>
                <td className="text-xs text-a9-text-muted">{proc.publisher || 'Unknown'}</td>
                <td><span className="badge badge-good">{proc.status}</span></td>
                <td>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded hover:bg-a9-surface-3 text-a9-text-dim hover:text-a9-text transition-colors" title="Open location">
                      <FolderOpen size={12} />
                    </button>
                    {!proc.isSystem && (
                      <button
                        onClick={() => { setSelectedProcess(proc.pid); setShowConfirm(true); }}
                        className="p-1.5 rounded hover:bg-a9-red/10 text-a9-text-dim hover:text-a9-red transition-colors"
                        title="End process"
                      >
                        <XCircle size={12} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* End Process Confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-panel p-6 w-96">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-a9-red/10">
                <AlertTriangle size={20} className="text-a9-red" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-a9-text">End Process</h3>
                <p className="text-xs text-a9-text-muted">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-a9-text-muted mb-6">
              Are you sure you want to end process PID {selectedProcess}? 
              Unsaved data may be lost.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowConfirm(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleEndProcess} className="btn-danger">End Process</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
