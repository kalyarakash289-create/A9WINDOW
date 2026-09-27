import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

export function Performance() {
  const { perfHistory, cpuStats, memoryStats, gpuStats } = useAppStore();
  const [timeRange, setTimeRange] = useState<'1m' | '5m' | '15m'>('1m');

  const getSlice = () => {
    switch (timeRange) {
      case '1m': return perfHistory.slice(-60);
      case '5m': return perfHistory.slice(-300);
      case '15m': return perfHistory.slice(-900);
    }
  };

  const data = getSlice();

  const getStats = (key: 'cpu' | 'memory' | 'gpu') => {
    if (data.length === 0) return { current: 0, avg: 0, peak: 0 };
    const values = data.map(d => d[key]);
    return {
      current: values[values.length - 1],
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      peak: Math.max(...values),
    };
  };

  const cpuStat = getStats('cpu');
  const memStat = getStats('memory');
  const gpuStat = getStats('gpu');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-a9-text">Performance</h1>
          <p className="text-sm text-a9-text-muted mt-1">Real-time system performance monitoring</p>
        </div>
        <div className="flex items-center gap-1 bg-a9-surface-2 rounded-lg p-1 border border-a9-border">
          {(['1m', '5m', '15m'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                ${timeRange === range ? 'bg-a9-cyan/20 text-a9-cyan' : 'text-a9-text-dim hover:text-a9-text'}`}
            >
              {range === '1m' ? '1 min' : range === '5m' ? '5 min' : '15 min'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'CPU', stat: cpuStat, color: 'a9-cyan', icon: <Activity size={14} /> },
          { label: 'Memory', stat: memStat, color: 'a9-blue', icon: <Activity size={14} /> },
          { label: 'GPU', stat: gpuStat, color: 'a9-violet', icon: <Activity size={14} /> },
        ].map(({ label, stat, color }) => (
          <div key={label} className="glass-panel p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-a9-text">{label}</span>
              <span className={`text-lg font-bold text-${color}`}>{stat.current.toFixed(1)}%</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-a9-text-dim block">Current</span>
                <span className="text-xs text-a9-text font-medium">{stat.current.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-[10px] text-a9-text-dim block">Average</span>
                <span className="text-xs text-a9-text font-medium">{stat.avg.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-[10px] text-a9-text-dim block">Peak</span>
                <span className="text-xs text-a9-text font-medium flex items-center gap-0.5">
                  <TrendingUp size={10} className="text-a9-red" />
                  {stat.peak.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="glass-panel p-4">
        <h3 className="text-sm font-semibold text-a9-text mb-4">CPU Usage</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timestamp" hide />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} />
              <Tooltip contentStyle={{ background: '#1a2234', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="cpu" stroke="#06b6d4" fill="rgba(6,182,212,0.1)" strokeWidth={2} name="CPU %" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel p-4">
        <h3 className="text-sm font-semibold text-a9-text mb-4">Memory Usage</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timestamp" hide />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} />
              <Tooltip contentStyle={{ background: '#1a2234', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="memory" stroke="#3b82f6" fill="rgba(59,130,246,0.1)" strokeWidth={2} name="Memory %" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel p-4">
        <h3 className="text-sm font-semibold text-a9-text mb-4">GPU Usage</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timestamp" hide />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} />
              <Tooltip contentStyle={{ background: '#1a2234', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="gpu" stroke="#8b5cf6" fill="rgba(139,92,246,0.1)" strokeWidth={2} name="GPU %" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Network throughput */}
      <div className="glass-panel p-4">
        <h3 className="text-sm font-semibold text-a9-text mb-4">Network Throughput</h3>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timestamp" hide />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip contentStyle={{ background: '#1a2234', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="networkDown" stroke="#10b981" fill="rgba(16,185,129,0.1)" strokeWidth={1.5} name="Download (KB/s)" dot={false} />
              <Area type="monotone" dataKey="networkUp" stroke="#f59e0b" fill="rgba(245,158,11,0.1)" strokeWidth={1.5} name="Upload (KB/s)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hardware Summary */}
      <div className="glass-panel-sm p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <span className="text-xs text-a9-text-dim block">CPU</span>
            <span className="text-sm text-a9-text font-medium">{cpuStats?.name || 'N/A'}</span>
          </div>
          <div>
            <span className="text-xs text-a9-text-dim block">Memory</span>
            <span className="text-sm text-a9-text font-medium">{memoryStats ? `${(memoryStats.total / 1024).toFixed(0)} GB` : 'N/A'}</span>
          </div>
          <div>
            <span className="text-xs text-a9-text-dim block">GPU</span>
            <span className="text-sm text-a9-text font-medium">{gpuStats?.name || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
