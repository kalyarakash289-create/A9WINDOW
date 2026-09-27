import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { FileText, Download, Calendar, CheckCircle } from 'lucide-react';

export function Reports() {
  const { healthScore, cpuStats, memoryStats, diskInfo } = useAppStore();
  const [exportFormat, setExportFormat] = useState<string | null>(null);

  const reports = [
    { id: '1', date: '2024-03-15 14:32', type: 'Optimization Scan', score: 72, items: 8 },
    { id: '2', date: '2024-03-14 09:15', type: 'Cleanup', score: null, items: 12 },
    { id: '3', date: '2024-03-13 18:45', type: 'Optimization Scan', score: 68, items: 11 },
    { id: '4', date: '2024-03-12 11:20', type: 'System Report', score: 70, items: null },
    { id: '5', date: '2024-03-10 16:00', type: 'Cleanup', score: null, items: 8 },
  ];

  const handleExport = (format: string) => {
    setExportFormat(format);
    setTimeout(() => setExportFormat(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-a9-text">Reports</h1>
          <p className="text-sm text-a9-text-muted mt-1">System reports and optimization history</p>
        </div>
        <div className="flex items-center gap-2">
          {['TXT', 'JSON', 'HTML'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => handleExport(fmt)}
              className="btn-secondary flex items-center gap-2 text-xs"
            >
              {exportFormat === fmt ? <CheckCircle size={12} /> : <Download size={12} />}
              {exportFormat === fmt ? 'Exported!' : `Export ${fmt}`}
            </button>
          ))}
        </div>
      </div>

      {/* Current Snapshot */}
      <div className="glass-panel p-5">
        <h3 className="text-sm font-semibold text-a9-text mb-4">Current System Snapshot</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel-sm p-3">
            <span className="text-[10px] text-a9-text-dim block">Health Score</span>
            <span className={`text-xl font-bold ${healthScore && healthScore.score >= 70 ? 'text-a9-green' : 'text-a9-yellow'}`}>
              {healthScore?.score || 'N/A'}
            </span>
          </div>
          <div className="glass-panel-sm p-3">
            <span className="text-[10px] text-a9-text-dim block">CPU Usage</span>
            <span className="text-xl font-bold text-a9-cyan">{cpuStats?.usage.toFixed(1) || '0'}%</span>
          </div>
          <div className="glass-panel-sm p-3">
            <span className="text-[10px] text-a9-text-dim block">Memory</span>
            <span className="text-xl font-bold text-a9-blue">{memoryStats?.usagePercent || '0'}%</span>
          </div>
          <div className="glass-panel-sm p-3">
            <span className="text-[10px] text-a9-text-dim block">Disk C:</span>
            <span className="text-xl font-bold text-a9-green">{diskInfo[0]?.usagePercent || '0'}%</span>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="glass-panel overflow-hidden">
        <div className="px-4 py-3 border-b border-a9-border">
          <h3 className="text-sm font-semibold text-a9-text">Report History</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Score</th>
              <th>Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="text-xs text-a9-text-dim flex items-center gap-2">
                  <Calendar size={12} />
                  {report.date}
                </td>
                <td className="text-sm text-a9-text">{report.type}</td>
                <td>
                  {report.score ? (
                    <span className={`text-sm font-medium ${report.score >= 75 ? 'text-a9-green' : 'text-a9-yellow'}`}>
                      {report.score}/100
                    </span>
                  ) : (
                    <span className="text-xs text-a9-text-dim">—</span>
                  )}
                </td>
                <td className="text-xs text-a9-text-dim">{report.items ? `${report.items} items` : '—'}</td>
                <td>
                  <button className="text-xs text-a9-cyan hover:underline flex items-center gap-1">
                    <FileText size={12} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
