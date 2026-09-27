import { useAppStore } from '../lib/store';
import { nativeBridge } from '../lib/nativeBridge';
import { Cpu, Monitor, MemoryStick, HardDrive, Wifi, CircuitBoard, Thermometer } from 'lucide-react';

export function Hardware() {
  const hw = nativeBridge.getHardwareInfo().data;
  if (!hw) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-a9-text">Hardware Center</h1>
        <p className="text-sm text-a9-text-muted mt-1">Complete system hardware information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CPU */}
        <div className="glass-panel p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-a9-cyan/10"><Cpu size={18} className="text-a9-cyan" /></div>
            <h3 className="text-sm font-semibold text-a9-text">Processor</h3>
          </div>
          <div className="space-y-2">
            <InfoRow label="Name" value={hw.cpu.name} />
            <InfoRow label="Cores / Threads" value={`${hw.cpu.cores} / ${hw.cpu.threads}`} />
            <InfoRow label="Architecture" value={hw.cpu.architecture} />
            <InfoRow label="Base Frequency" value={`${hw.cpu.frequency} MHz`} />
            <InfoRow label="Current Usage" value={`${hw.cpu.usage.toFixed(1)}%`} />
            <InfoRow label="Temperature" value={hw.cpu.temperature ? `${hw.cpu.temperature}°C` : 'Unavailable'} />
          </div>
        </div>

        {/* GPU */}
        <div className="glass-panel p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-a9-violet/10"><Monitor size={18} className="text-a9-violet" /></div>
            <h3 className="text-sm font-semibold text-a9-text">Graphics</h3>
          </div>
          <div className="space-y-2">
            <InfoRow label="Name" value={hw.gpu.name} />
            <InfoRow label="VRAM" value={hw.gpu.vram ? `${(hw.gpu.vram / 1024).toFixed(0)} GB` : 'Shared'} />
            <InfoRow label="Current Usage" value={`${hw.gpu.usage.toFixed(1)}%`} />
            <InfoRow label="Temperature" value={hw.gpu.temperature ? `${hw.gpu.temperature}°C` : 'Unavailable'} />
          </div>
        </div>

        {/* Memory */}
        <div className="glass-panel p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-a9-blue/10"><MemoryStick size={18} className="text-a9-blue" /></div>
            <h3 className="text-sm font-semibold text-a9-text">Memory</h3>
          </div>
          <div className="space-y-2">
            <InfoRow label="Total" value={`${(hw.memory.total / 1024).toFixed(0)} GB`} />
            <InfoRow label="Used" value={`${(hw.memory.used / 1024).toFixed(1)} GB`} />
            <InfoRow label="Available" value={`${(hw.memory.free / 1024).toFixed(1)} GB`} />
            <InfoRow label="Speed" value={hw.memory.speed ? `${hw.memory.speed} MHz` : 'N/A'} />
            <InfoRow label="Usage" value={`${hw.memory.usagePercent}%`} />
          </div>
        </div>

        {/* Motherboard & BIOS */}
        <div className="glass-panel p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-a9-green/10"><CircuitBoard size={18} className="text-a9-green" /></div>
            <h3 className="text-sm font-semibold text-a9-text">Motherboard & BIOS</h3>
          </div>
          <div className="space-y-2">
            <InfoRow label="Manufacturer" value={hw.motherboard.manufacturer} />
            <InfoRow label="Model" value={hw.motherboard.model} />
            <InfoRow label="BIOS Vendor" value={hw.bios.manufacturer} />
            <InfoRow label="BIOS Version" value={hw.bios.version} />
            <InfoRow label="BIOS Date" value={hw.bios.date} />
          </div>
        </div>

        {/* Storage */}
        <div className="glass-panel p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-a9-yellow/10"><HardDrive size={18} className="text-a9-yellow" /></div>
            <h3 className="text-sm font-semibold text-a9-text">Storage</h3>
          </div>
          <div className="space-y-3">
            {hw.storage.map((disk) => (
              <div key={disk.letter} className="glass-panel-sm p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-a9-text">{disk.model}</span>
                  <span className="text-xs text-a9-text-dim">{disk.letter}</span>
                </div>
                <div className="flex justify-between text-[10px] text-a9-text-dim">
                  <span>{disk.interface} • {disk.filesystem}</span>
                  <span>{disk.usagePercent}% used</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network & OS */}
        <div className="glass-panel p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-a9-cyan/10"><Wifi size={18} className="text-a9-cyan" /></div>
            <h3 className="text-sm font-semibold text-a9-text">Network & OS</h3>
          </div>
          <div className="space-y-2">
            <InfoRow label="OS" value={hw.os.os} />
            <InfoRow label="Version" value={`${hw.os.version} (Build ${hw.os.build})`} />
            <InfoRow label="Architecture" value={hw.os.architecture} />
            <InfoRow label="Hostname" value={hw.os.hostname} />
            {hw.network[0] && <InfoRow label="Adapter" value={`${hw.network[0].adapter} (${hw.network[0].status})`} />}
          </div>
        </div>
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
