import { useEffect, useCallback } from 'react';
import { useAppStore } from './lib/store';
import { nativeBridge } from './lib/nativeBridge';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { CommandPalette } from './components/CommandPalette';
import { Dashboard } from './pages/Dashboard';
import { Optimizer } from './pages/Optimizer';
import { Performance } from './pages/Performance';
import { Processes } from './pages/Processes';
import { Startup } from './pages/Startup';
import { Storage } from './pages/Storage';
import { Cleanup } from './pages/Cleanup';
import { Privacy } from './pages/Privacy';
import { Network } from './pages/Network';
import { Hardware } from './pages/Hardware';
import { Drivers } from './pages/Drivers';
import { WindowsTools } from './pages/WindowsTools';
import { AIAssistant } from './pages/AIAssistant';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { About } from './pages/About';

export default function App() {
  const { currentPage, setCpuStats, setMemoryStats, setGpuStats, setDiskInfo, setNetworkInfo, setProcesses, setStartupItems, setHealthScore, addPerfPoint, commandPaletteOpen, setCommandPaletteOpen } = useAppStore();

  // Initialize system data
  useEffect(() => {
    const cpu = nativeBridge.getCpuStats();
    if (cpu.data) setCpuStats(cpu.data);
    
    const mem = nativeBridge.getMemoryStats();
    if (mem.data) setMemoryStats(mem.data);
    
    const gpu = nativeBridge.getGpuStats();
    if (gpu.data) setGpuStats(gpu.data);
    
    const disk = nativeBridge.getDiskInfo();
    if (disk.data) setDiskInfo(disk.data);
    
    const net = nativeBridge.getNetworkInfo();
    if (net.data) setNetworkInfo(net.data);
    
    const procs = nativeBridge.getProcesses();
    if (procs.data) setProcesses(procs.data);
    
    const startup = nativeBridge.getStartupItems();
    if (startup.data) setStartupItems(startup.data);
    
    const health = nativeBridge.getHealthScore();
    if (health.data) setHealthScore(health.data);

    // Performance polling
    const perfInterval = setInterval(() => {
      nativeBridge.addPerformancePoint();
      const perf = nativeBridge.getCurrentPerformance();
      if (perf.data) addPerfPoint(perf.data);
      
      const cpuUpdate = nativeBridge.getCpuStats();
      if (cpuUpdate.data) setCpuStats(cpuUpdate.data);
      
      const memUpdate = nativeBridge.getMemoryStats();
      if (memUpdate.data) setMemoryStats(memUpdate.data);
      
      const gpuUpdate = nativeBridge.getGpuStats();
      if (gpuUpdate.data) setGpuStats(gpuUpdate.data);
    }, 1000);

    return () => clearInterval(perfInterval);
  }, []);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      setCommandPaletteOpen(!commandPaletteOpen);
    }
    if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    }
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'optimizer': return <Optimizer />;
      case 'performance': return <Performance />;
      case 'processes': return <Processes />;
      case 'startup': return <Startup />;
      case 'storage': return <Storage />;
      case 'cleanup': return <Cleanup />;
      case 'privacy': return <Privacy />;
      case 'network': return <Network />;
      case 'hardware': return <Hardware />;
      case 'drivers': return <Drivers />;
      case 'tools': return <WindowsTools />;
      case 'ai': return <AIAssistant />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      case 'about': return <About />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-a9-bg">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <main className="flex-1 overflow-auto p-6">
          <div className="animate-fade-in">
            {renderPage()}
          </div>
        </main>
      </div>
      {commandPaletteOpen && <CommandPalette />}
    </div>
  );
}
