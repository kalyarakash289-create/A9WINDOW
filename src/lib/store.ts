import { create } from 'zustand';
import type { PageId, AppSettings, Finding, CleanupItem, ProcessInfo, StartupItem, PerformanceDataPoint, HealthScore, CpuStats, MemoryStats, GpuStats, DiskInfo, NetworkInfo, AIMessage } from '../types';

interface AppState {
  // Navigation
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  
  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // System data
  cpuStats: CpuStats | null;
  memoryStats: MemoryStats | null;
  gpuStats: GpuStats | null;
  diskInfo: DiskInfo[];
  networkInfo: NetworkInfo[];
  processes: ProcessInfo[];
  startupItems: StartupItem[];
  cleanupItems: CleanupItem[];
  findings: Finding[];
  healthScore: HealthScore | null;
  perfHistory: PerformanceDataPoint[];
  
  // Actions
  setCpuStats: (stats: CpuStats) => void;
  setMemoryStats: (stats: MemoryStats) => void;
  setGpuStats: (stats: GpuStats) => void;
  setDiskInfo: (info: DiskInfo[]) => void;
  setNetworkInfo: (info: NetworkInfo[]) => void;
  setProcesses: (procs: ProcessInfo[]) => void;
  setStartupItems: (items: StartupItem[]) => void;
  setCleanupItems: (items: CleanupItem[]) => void;
  setFindings: (findings: Finding[]) => void;
  setHealthScore: (score: HealthScore) => void;
  addPerfPoint: (point: PerformanceDataPoint) => void;
  
  // UI state
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
  isOptimizing: boolean;
  setIsOptimizing: (optimizing: boolean) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  
  // AI
  aiMessages: AIMessage[];
  addAiMessage: (msg: AIMessage) => void;
  clearAiMessages: () => void;
  
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Navigation
  currentPage: 'dashboard',
  setCurrentPage: (page) => set({ currentPage: page }),
  
  // Settings
  settings: {
    theme: 'dark',
    animations: true,
    telemetry: false,
    startWithWindows: false,
    minimizeToTray: true,
    autoScan: true,
    notifications: true,
    language: 'en',
    scanInterval: 3600,
  },
  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings },
  })),
  
  // System data
  cpuStats: null,
  memoryStats: null,
  gpuStats: null,
  diskInfo: [],
  networkInfo: [],
  processes: [],
  startupItems: [],
  cleanupItems: [],
  findings: [],
  healthScore: null,
  perfHistory: [],
  
  setCpuStats: (stats) => set({ cpuStats: stats }),
  setMemoryStats: (stats) => set({ memoryStats: stats }),
  setGpuStats: (stats) => set({ gpuStats: stats }),
  setDiskInfo: (info) => set({ diskInfo: info }),
  setNetworkInfo: (info) => set({ networkInfo: info }),
  setProcesses: (procs) => set({ processes: procs }),
  setStartupItems: (items) => set({ startupItems: items }),
  setCleanupItems: (items) => set({ cleanupItems: items }),
  setFindings: (findings) => set({ findings }),
  setHealthScore: (score) => set({ healthScore: score }),
  addPerfPoint: (point) => set((state) => ({
    perfHistory: [...state.perfHistory.slice(-899), point],
  })),
  
  // UI state
  isScanning: false,
  setIsScanning: (scanning) => set({ isScanning: scanning }),
  isOptimizing: false,
  setIsOptimizing: (optimizing) => set({ isOptimizing: optimizing }),
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  
  // AI
  aiMessages: [],
  addAiMessage: (msg) => set((state) => ({
    aiMessages: [...state.aiMessages, msg],
  })),
  clearAiMessages: () => set({ aiMessages: [] }),
  
  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
