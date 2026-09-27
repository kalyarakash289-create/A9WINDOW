import { useAppStore } from '../lib/store';
import { nativeBridge } from '../lib/nativeBridge';
import { Wrench, CheckCircle, ExternalLink } from 'lucide-react';

export function Drivers() {
  const drivers = nativeBridge.getDrivers().data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-a9-text">Driver Center</h1>
          <p className="text-sm text-a9-text-muted mt-1">{drivers.length} installed drivers</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <ExternalLink size={14} />
          Open Device Manager
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Device</th>
              <th>Driver</th>
              <th>Version</th>
              <th>Date</th>
              <th>Manufacturer</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver, i) => (
              <tr key={i}>
                <td className="text-sm font-medium text-a9-text">{driver.device}</td>
                <td className="text-xs text-a9-text-dim font-mono">{driver.driver}</td>
                <td className="text-xs text-a9-text-dim font-mono">{driver.version}</td>
                <td className="text-xs text-a9-text-dim">{driver.date}</td>
                <td className="text-xs text-a9-text-muted">{driver.manufacturer}</td>
                <td>
                  <span className="flex items-center gap-1 text-xs text-a9-green">
                    <CheckCircle size={12} /> {driver.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glass-panel-sm p-4 flex items-start gap-3">
        <Wrench size={14} className="text-a9-blue mt-0.5" />
        <div className="text-xs text-a9-text-dim">
          <p className="font-medium text-a9-text-muted mb-1">Driver Management</p>
          <p>A9 Optimizer displays installed driver information. For driver updates, visit your hardware manufacturer's official support website.</p>
          <p className="mt-1">Never install drivers from unverified third-party sources. Use only official manufacturer or Microsoft-signed drivers.</p>
        </div>
      </div>
    </div>
  );
}
