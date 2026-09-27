import { useAppStore } from '../lib/store';
import { Cpu, MemoryStick, Monitor, HardDrive, Wifi, Thermometer, Clock, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function formatBytes(bytes: number): string {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + ' GB';
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
  return (bytes / 1024).toFixed(1) + ' KB';
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${mins}m`;
}

function StatCard({ icon, label, value, subValue, color, chart }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  color: string;
  chart?: { value: number }[];
}) {
  return (
    <div className="glass-panel p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
          <span className="text-xs font-medium text-a9-text-muted uppercase tracking-wide">{label}</span>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-a9-text">{value}</div>
          {subValue && <div className="text-xs text-a9-text-dim mt-0.5">{subValue}</div>}
        </div>
        {chart && (
          <div className="w-24 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart}>
                <Area type="monotone" dataKey="value" stroke="#06b6d4" fill="rgba(6,182,212,0.1)" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export function Dashboard() {
  const { cpuStats, memoryStats, gpuStats, diskInfo, networkInfo, healthScore, perfHistory } = useAppStore();

  const cpuHistory = perfHistory.slice(-30).map(p => ({ value: p.cpu }));
  const memHistory = perfHistory.slice(-30).map(p => ({ value: p.memory }));
  const gpuHistory = perfHistory.slice(-30).map(p => ({ value: p.gpu }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-a9-text">Dashboard</h1>
          <p className="text-sm text-a9-text-muted mt-1">Real-time system monitoring and health overview</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-a9-text-dim">
          <Clock size={12} />
          <span>Updated every second</span>
        </div>
      </div>

      {/* Health Score */}
      {healthScore && (
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-a9-text">A9 Health Score</h2>
            <span className={`text-3xl font-bold ${healthScore.score >= 80 ? 'text-a9-green' : healthScore.score >= 60 ? 'text-a9-yellow' : 'text-a9-red'}`}>
              {healthScore.score}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {healthScore.factors.map((factor) => (
              <div key={factor.id} className="glass-panel-sm p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-a9-text-muted truncate">{factor.label}</span>
                  <span className={`badge badge-${factor.status}`}>
                    {factor.status}
                  </span>
                </div>
                <div className="progress-bar mt-2">
                  <div
                    className={`progress-fill ${factor.status === 'good' ? 'bg-a9-green' : factor.status === 'warning' ? 'bg-a9-yellow' : 'bg-a9-red'}`}
                    style={{ width: `${(factor.value / factor.max) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-a9-text-dim mt-2 leading-tight">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cpuStats && (
          <StatCard
            icon={<Cpu size={16} className="text-a9-cyan" />}
            label="CPU"
            value={`${cpuStats.usage.toFixed(1)}%`}
            subValue={cpuStats.name}
            color="bg-a9-cyan/10"
            chart={cpuHistory}
          />
        )}
        {memoryStats && (
          <StatCard
            icon={<MemoryStick size={16} className="text-a9-blue" />}
            label="Memory"
            value={`${memoryStats.usagePercent}%`}
            subValue={`${(memoryStats.used / 1024).toFixed(1)} / ${(memoryStats.total / 1024).toFixed(1)} GB`}
            color="bg-a9-blue/10"
            chart={memHistory}
          />
        )}
        {gpuStats && (
          <StatCard
            icon={<Monitor size={16} className="text-a9-violet" />}
            label="GPU"
            value={`${gpuStats.usage.toFixed(1)}%`}
            subValue={gpuStats.name}
            color="bg-a9-violet/10"
            chart={gpuHistory}
          />
        )}
        {diskInfo.map((disk) => (
          <StatCard
            key={disk.letter}
            icon={<HardDrive size={16} className="text-a9-green" />}
            label={`Disk ${disk.letter}`}
            value={`${disk.usagePercent}%`}
            subValue={`${formatBytes(disk.free * 1048576)} free`}
            color="bg-a9-green/10"
          />
        ))}
        {networkInfo.map((net) => (
          <StatCard
            key={net.adapter}
            icon={<Wifi size={16} className="text-a9-cyan" />}
            label="Network"
            value={`${(net.download / 1000).toFixed(1)} MB/s`}
            subValue={`↑ ${(net.upload / 1000).toFixed(1)} MB/s`}
            color="bg-a9-cyan/10"
          />
        ))}
        {cpuStats?.temperature && (
          <StatCard
            icon={<Thermometer size={16} className="text-a9-yellow" />}
            label="CPU Temp"
            value={`${cpuStats.temperature}°C`}
            subValue={cpuStats.temperature > 80 ? 'High' : 'Normal'}
            color="bg-a9-yellow/10"
          />
        )}
      </div>

      {/* System Info Bar */}
      <div className="glass-panel p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div>
            <span className="text-xs text-a9-text-dim block">OS</span>
            <span className="text-sm text-a9-text font-medium">Windows 11 Pro</span>
          </div>
          <div>
            <span className="text-xs text-a9-text-dim block">Version</span>
            <span className="text-sm text-a9-text font-medium">23H2</span>
          </div>
          <div>
            <span className="text-xs text-a9-text-dim block">Build</span>
            <span className="text-sm text-a9-text font-medium">22631.3880</span>
          </div>
          <div>
            <span className="text-xs text-a9-text-dim block">Architecture</span>
            <span className="text-sm text-a9-text font-medium">x64</span>
          </div>
          <div>
            <span className="text-xs text-a9-text-dim block">Uptime</span>
            <span className="text-sm text-a9-text font-medium">{formatUptime(14523)}</span>
          </div>
          <div>
            <span className="text-xs text-a9-text-dim block">Admin</span>
            <span className="text-sm text-a9-text font-medium flex items-center gap-1">
              <AlertTriangle size={12} className="text-a9-yellow" />
              No
            </span>
          </div>
        </div>
      </div>

      {/* Live Performance Chart */}
      <div className="glass-panel p-4">
        <h3 className="text-sm font-semibold text-a9-text mb-4">Live Performance (Last 30s)</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={perfHistory.slice(-30)}>
              <XAxis dataKey="timestamp" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip
                contentStyle={{ background: '#1a2234', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="cpu" stroke="#06b6d4" fill="rgba(6,182,212,0.05)" strokeWidth={1.5} name="CPU" dot={false} />
              <Area type="monotone" dataKey="memory" stroke="#3b82f6" fill="rgba(59,130,246,0.05)" strokeWidth={1.5} name="Memory" dot={false} />
              <Area type="monotone" dataKey="gpu" stroke="#8b5cf6" fill="rgba(139,92,246,0.05)" strokeWidth={1.5} name="GPU" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-6 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-a9-cyan rounded"></div>
            <span className="text-xs text-a9-text-dim">CPU</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-a9-blue rounded"></div>
            <span className="text-xs text-a9-text-dim">Memory</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-a9-violet rounded"></div>
            <span className="text-xs text-a9-text-dim">GPU</span>
          </div>
        </div>
      </div>
    </div>
  );
}
