import { useAppStore } from '../lib/store';
import type { PageId } from '../types';
import {
  LayoutDashboard, Zap, Activity, Cpu, Play, HardDrive,
  Trash2, Shield, Wifi, Monitor, Wrench, FolderOpen,
  Bot, FileText, Settings, Info, ChevronLeft, ChevronRight
} from 'lucide-react';

const navItems: { id: PageId; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'optimizer', label: 'Optimizer', icon: <Zap size={18} /> },
  { id: 'performance', label: 'Performance', icon: <Activity size={18} /> },
  { id: 'processes', label: 'Processes', icon: <Cpu size={18} /> },
  { id: 'startup', label: 'Startup', icon: <Play size={18} /> },
  { id: 'storage', label: 'Storage', icon: <HardDrive size={18} /> },
  { id: 'cleanup', label: 'Cleanup', icon: <Trash2 size={18} /> },
  { id: 'privacy', label: 'Privacy', icon: <Shield size={18} /> },
  { id: 'network', label: 'Network', icon: <Wifi size={18} /> },
  { id: 'hardware', label: 'Hardware', icon: <Monitor size={18} /> },
  { id: 'drivers', label: 'Drivers', icon: <Wrench size={18} /> },
  { id: 'tools', label: 'Windows Tools', icon: <FolderOpen size={18} /> },
  { id: 'ai', label: 'AI Assistant', icon: <Bot size={18} /> },
  { id: 'reports', label: 'Reports', icon: <FileText size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  { id: 'about', label: 'About', icon: <Info size={18} /> },
];

export function Sidebar() {
  const { currentPage, setCurrentPage, sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <aside className={`flex flex-col h-full border-r border-a9-border bg-a9-surface transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-56'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-a9-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-a9-cyan to-a9-blue">
          <span className="text-white font-black text-xs">A9</span>
        </div>
        {!sidebarCollapsed && (
          <div className="flex flex-col">
            <span className="gradient-text font-bold text-sm tracking-tight">A9 OPTIMIZER</span>
            <span className="text-[10px] text-a9-text-dim">v1.0.0</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-200 mb-0.5
              ${currentPage === item.id
                ? 'bg-gradient-to-r from-a9-cyan/10 to-a9-blue/5 text-a9-cyan border-l-2 border-a9-cyan'
                : 'text-a9-text-muted hover:text-a9-text hover:bg-a9-surface-2'
              }`}
            title={sidebarCollapsed ? item.label : undefined}
          >
            <span className={currentPage === item.id ? 'text-a9-cyan' : ''}>{item.icon}</span>
            {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-a9-border p-3">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full p-2 rounded-lg text-a9-text-dim hover:text-a9-text hover:bg-a9-surface-2 transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2 mt-2 px-2">
            <span className="status-dot status-healthy"></span>
            <span className="text-xs text-a9-text-dim">System Online</span>
          </div>
        )}
      </div>
    </aside>
  );
}
