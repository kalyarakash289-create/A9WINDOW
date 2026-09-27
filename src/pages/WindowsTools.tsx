import { FolderOpen, Monitor, Cpu, HardDrive, Settings, Terminal, Shield, Server, FileText, Wrench } from 'lucide-react';

const tools = [
  { name: 'System Information', desc: 'View detailed system information', icon: <Monitor size={20} />, cmd: 'msinfo32.exe' },
  { name: 'Task Manager', desc: 'Manage running processes', icon: <Cpu size={20} />, cmd: 'taskmgr.exe' },
  { name: 'Device Manager', desc: 'Manage hardware devices', icon: <Wrench size={20} />, cmd: 'devmgmt.msc' },
  { name: 'Disk Management', desc: 'Manage disk partitions', icon: <HardDrive size={20} />, cmd: 'diskmgmt.msc' },
  { name: 'Services', desc: 'Manage Windows services', icon: <Server size={20} />, cmd: 'services.msc' },
  { name: 'Event Viewer', desc: 'View system event logs', icon: <FileText size={20} />, cmd: 'eventvwr.msc' },
  { name: 'Control Panel', desc: 'Windows Control Panel', icon: <Settings size={20} />, cmd: 'control.exe' },
  { name: 'Windows Settings', desc: 'Modern Windows settings', icon: <Settings size={20} />, cmd: 'ms-settings:' },
  { name: 'Command Prompt', desc: 'Windows command line', icon: <Terminal size={20} />, cmd: 'cmd.exe' },
  { name: 'PowerShell', desc: 'Windows PowerShell', icon: <Terminal size={20} />, cmd: 'powershell.exe' },
  { name: 'Registry Editor', desc: 'Windows Registry (Admin)', icon: <Shield size={20} />, cmd: 'regedit.exe' },
  { name: 'Windows Security', desc: 'Security settings', icon: <Shield size={20} />, cmd: 'windowsdefender://' },
];

export function WindowsTools() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-a9-text">Windows Tools</h1>
        <p className="text-sm text-a9-text-muted mt-1">Quick access to built-in Windows utilities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <button
            key={tool.name}
            className="glass-panel p-5 text-left hover:border-a9-cyan/30 transition-all group"
            onClick={() => {
              // In Electron, this would launch the actual tool via IPC
              console.log(`Launch: ${tool.cmd}`);
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-lg bg-a9-surface-3 group-hover:bg-a9-cyan/10 transition-colors">
                <span className="text-a9-text-muted group-hover:text-a9-cyan transition-colors">{tool.icon}</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-a9-text">{tool.name}</h3>
                <p className="text-xs text-a9-text-dim">{tool.desc}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-a9-text-dim font-mono">{tool.cmd}</span>
              <FolderOpen size={12} className="text-a9-text-dim group-hover:text-a9-cyan transition-colors" />
            </div>
          </button>
        ))}
      </div>

      <div className="glass-panel-sm p-4">
        <p className="text-xs text-a9-text-dim">
          <strong className="text-a9-text-muted">Note:</strong> Some tools require administrator privileges. 
          When running in the Electron desktop version, these tools launch directly via Windows API. 
          Tools that require elevation will trigger a UAC prompt.
        </p>
      </div>
    </div>
  );
}
