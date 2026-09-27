// A9 OPTIMIZER - Native Bridge Abstraction
// In production Electron build, this communicates with the main process via IPC
// In web preview mode, this provides realistic system data structures

import type {
  CpuStats, MemoryStats, GpuStats, DiskInfo, NetworkInfo,
  ProcessInfo, StartupItem, CleanupItem, DriverInfo, HardwareInfo,
  SystemInfo, Finding, NativeBridgeResponse, HealthScore, PerformanceDataPoint
} from '../types';

// Performance history buffer
const perfHistory: PerformanceDataPoint[] = [];
const MAX_HISTORY = 900; // 15 minutes at 1-second intervals

// Simulated base values (in real Electron, these come from Windows APIs)
const BASE_CPU = 23;
const BASE_MEM = 61;
const BASE_GPU = 12;
const BASE_DISK = 5;

function randomFluctuation(base: number, range: number): number {
  return Math.max(0, Math.min(100, base + (Math.random() - 0.5) * range));
}

function generatePerfPoint(): PerformanceDataPoint {
  return {
    timestamp: Date.now(),
    cpu: randomFluctuation(BASE_CPU, 15),
    memory: randomFluctuation(BASE_MEM, 5),
    gpu: randomFluctuation(BASE_GPU, 20),
    disk: randomFluctuation(BASE_DISK, 10),
    networkUp: Math.random() * 500,
    networkDown: Math.random() * 2000,
  };
}

// Initialize history
for (let i = 0; i < 60; i++) {
  perfHistory.push({
    ...generatePerfPoint(),
    timestamp: Date.now() - (60 - i) * 1000,
  });
}

export const nativeBridge = {
  // System Information
  getSystemInfo(): NativeBridgeResponse<SystemInfo> {
    return {
      success: true,
      data: {
        os: 'Windows 11 Pro',
        version: '23H2',
        build: '22631.3880',
        architecture: 'x64',
        hostname: 'DESKTOP-A9OPT',
        uptime: 14523,
        isAdmin: false,
      },
      error: null,
    };
  },

  // CPU Stats
  getCpuStats(): NativeBridgeResponse<CpuStats> {
    return {
      success: true,
      data: {
        name: 'Intel Core i7-12700K',
        cores: 12,
        threads: 20,
        architecture: 'x64',
        frequency: 3600,
        usage: randomFluctuation(BASE_CPU, 15),
        temperature: 52 + Math.floor(Math.random() * 8),
        available: true,
      },
      error: null,
    };
  },

  // Memory Stats
  getMemoryStats(): NativeBridgeResponse<MemoryStats> {
    const total = 32768;
    const used = Math.floor(total * (BASE_MEM / 100) + (Math.random() - 0.5) * 1000);
    return {
      success: true,
      data: {
        total,
        used,
        free: total - used,
        usagePercent: Math.round((used / total) * 100),
        speed: 3200,
        isAvailable: true,
      },
      error: null,
    };
  },

  // GPU Stats
  getGpuStats(): NativeBridgeResponse<GpuStats> {
    return {
      success: true,
      data: {
        name: 'NVIDIA GeForce RTX 3070',
        vram: 8192,
        usage: randomFluctuation(BASE_GPU, 20),
        temperature: 45 + Math.floor(Math.random() * 10),
        available: true,
      },
      error: null,
    };
  },

  // Disk Info
  getDiskInfo(): NativeBridgeResponse<DiskInfo[]> {
    return {
      success: true,
      data: [
        {
          label: 'System',
          letter: 'C:',
          filesystem: 'NTFS',
          total: 512000,
          used: 341200,
          free: 170800,
          usagePercent: 67,
          health: 'Good',
          interface: 'NVMe',
          model: 'Samsung 980 PRO 500GB',
        },
        {
          label: 'Data',
          letter: 'D:',
          filesystem: 'NTFS',
          total: 2048000,
          used: 1230000,
          free: 818000,
          usagePercent: 60,
          health: 'Good',
          interface: 'SATA',
          model: 'Seagate Barracuda 2TB',
        },
      ],
      error: null,
    };
  },

  // Network Info
  getNetworkInfo(): NativeBridgeResponse<NetworkInfo[]> {
    return {
      success: true,
      data: [
        {
          adapter: 'Wi-Fi',
          status: 'Connected',
          ip: '192.168.1.105',
          gateway: '192.168.1.1',
          dns: '8.8.8.8',
          mac: 'A4:C3:F0:XX:XX:XX',
          linkSpeed: 866,
          upload: Math.random() * 500,
          download: Math.random() * 2000,
        },
      ],
      error: null,
    };
  },

  // Processes
  getProcesses(): NativeBridgeResponse<ProcessInfo[]> {
    const processes: ProcessInfo[] = [
      { pid: 4, name: 'System', cpu: 0.1, memory: 0.2, path: 'C:\\Windows\\System32', publisher: 'Microsoft', status: 'Running', user: 'SYSTEM', isSystem: true },
      { pid: 128, name: 'Registry', cpu: 0.0, memory: 0.5, path: 'C:\\Windows\\System32', publisher: 'Microsoft', status: 'Running', user: 'SYSTEM', isSystem: true },
      { pid: 512, name: 'svchost.exe', cpu: 0.3, memory: 1.2, path: 'C:\\Windows\\System32', publisher: 'Microsoft', status: 'Running', user: 'SYSTEM', isSystem: true },
      { pid: 1024, name: 'explorer.exe', cpu: 1.2, memory: 3.8, path: 'C:\\Windows', publisher: 'Microsoft', status: 'Running', user: 'User', isSystem: false },
      { pid: 2048, name: 'chrome.exe', cpu: 4.5, memory: 12.3, path: 'C:\\Program Files\\Google\\Chrome', publisher: 'Google LLC', status: 'Running', user: 'User', isSystem: false },
      { pid: 2049, name: 'chrome.exe', cpu: 2.1, memory: 8.7, path: 'C:\\Program Files\\Google\\Chrome', publisher: 'Google LLC', status: 'Running', user: 'User', isSystem: false },
      { pid: 2050, name: 'chrome.exe', cpu: 1.8, memory: 6.2, path: 'C:\\Program Files\\Google\\Chrome', publisher: 'Google LLC', status: 'Running', user: 'User', isSystem: false },
      { pid: 3001, name: 'Code.exe', cpu: 3.2, memory: 9.1, path: 'C:\\Users\\User\\AppData\\Local\\Programs\\Microsoft VS Code', publisher: 'Microsoft', status: 'Running', user: 'User', isSystem: false },
      { pid: 3500, name: 'discord.exe', cpu: 1.5, memory: 5.4, path: 'C:\\Users\\User\\AppData\\Local\\Discord', publisher: 'Discord Inc.', status: 'Running', user: 'User', isSystem: false },
      { pid: 4000, name: 'Spotify.exe', cpu: 0.8, memory: 4.2, path: 'C:\\Users\\User\\AppData\\Roaming\\Spotify', publisher: 'Spotify AB', status: 'Running', user: 'User', isSystem: false },
      { pid: 4500, name: 'Steam.exe', cpu: 0.3, memory: 2.1, path: 'C:\\Program Files (x86)\\Steam', publisher: 'Valve Corporation', status: 'Running', user: 'User', isSystem: false },
      { pid: 5000, name: 'SearchHost.exe', cpu: 0.5, memory: 2.8, path: 'C:\\Windows\\SystemApps', publisher: 'Microsoft', status: 'Running', user: 'User', isSystem: true },
      { pid: 5500, name: 'RuntimeBroker.exe', cpu: 0.1, memory: 1.5, path: 'C:\\Windows\\System32', publisher: 'Microsoft', status: 'Running', user: 'User', isSystem: true },
      { pid: 6000, name: 'dwm.exe', cpu: 1.8, memory: 3.2, path: 'C:\\Windows\\System32', publisher: 'Microsoft', status: 'Running', user: 'User', isSystem: true },
      { pid: 6500, name: 'csrss.exe', cpu: 0.2, memory: 0.8, path: 'C:\\Windows\\System32', publisher: 'Microsoft', status: 'Running', user: 'SYSTEM', isSystem: true },
    ];
    return { success: true, data: processes, error: null };
  },

  // Startup Items
  getStartupItems(): NativeBridgeResponse<StartupItem[]> {
    return {
      success: true,
      data: [
        { id: '1', name: 'Discord', publisher: 'Discord Inc.', path: 'C:\\Users\\User\\AppData\\Local\\Discord\\Update.exe', location: 'Registry\\Run', enabled: true, impact: 'medium' },
        { id: '2', name: 'Spotify', publisher: 'Spotify AB', path: 'C:\\Users\\User\\AppData\\Roaming\\Spotify\\Spotify.exe', location: 'Registry\\Run', enabled: true, impact: 'medium' },
        { id: '3', name: 'OneDrive', publisher: 'Microsoft', path: 'C:\\Users\\User\\AppData\\Local\\Microsoft\\OneDrive\\OneDrive.exe', location: 'Registry\\Run', enabled: true, impact: 'low' },
        { id: '4', name: 'Steam Client', publisher: 'Valve', path: 'C:\\Program Files (x86)\\Steam\\steam.exe', location: 'Registry\\Run', enabled: true, impact: 'high' },
        { id: '5', name: 'Adobe Creative Cloud', publisher: 'Adobe', path: 'C:\\Program Files\\Adobe\\Creative Cloud\\ACC.exe', location: 'TaskScheduler', enabled: true, impact: 'high' },
        { id: '6', name: 'Windows Security', publisher: 'Microsoft', path: 'C:\\Program Files\\Windows Defender\\MSASCuiL.exe', location: 'Registry\\Run', enabled: true, impact: 'low' },
        { id: '7', name: 'Realtek Audio', publisher: 'Realtek', path: 'C:\\Windows\\System32\\RtAudio64.exe', location: 'Registry\\Run', enabled: true, impact: 'low' },
        { id: '8', name: 'NVIDIA Container', publisher: 'NVIDIA', path: 'C:\\Program Files\\NVIDIA Corporation\\NvContainer\\nvcontainer.exe', location: 'TaskScheduler', enabled: true, impact: 'medium' },
      ],
      error: null,
    };
  },

  // Cleanup Items
  scanCleanup(): NativeBridgeResponse<CleanupItem[]> {
    return {
      success: true,
      data: [
        { id: '1', name: 'Windows Temp Files', path: 'C:\\Windows\\Temp', size: 2147483648, fileCount: 1247, safe: true, selected: true, category: 'temp' },
        { id: '2', name: 'User Temp Files', path: 'C:\\Users\\User\\AppData\\Local\\Temp', size: 1073741824, fileCount: 892, safe: true, selected: true, category: 'temp' },
        { id: '3', name: 'Windows Update Cache', path: 'C:\\Windows\\SoftwareDistribution\\Download', size: 536870912, fileCount: 23, safe: true, selected: true, category: 'cache' },
        { id: '4', name: 'Thumbnail Cache', path: 'C:\\Users\\User\\AppData\\Local\\Microsoft\\Windows\\Explorer', size: 104857600, fileCount: 45, safe: true, selected: true, category: 'cache' },
        { id: '5', name: 'Crash Dumps', path: 'C:\\Users\\User\\AppData\\Local\\CrashDumps', size: 268435456, fileCount: 8, safe: true, selected: true, category: 'dumps' },
        { id: '6', name: 'Recycle Bin', path: 'C:\\$Recycle.Bin', size: 3221225472, fileCount: 156, safe: true, selected: false, category: 'recycle' },
        { id: '7', name: 'Browser Cache (Chrome)', path: 'C:\\Users\\User\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cache', size: 1610612736, fileCount: 4521, safe: true, selected: true, category: 'browser' },
        { id: '8', name: 'Delivery Optimization', path: 'C:\\Windows\\SoftwareDistribution\\DeliveryOptimization', size: 419430400, fileCount: 12, safe: true, selected: true, category: 'cache' },
        { id: '9', name: 'Windows Error Reports', path: 'C:\\ProgramData\\Microsoft\\Windows\\WER', size: 157286400, fileCount: 34, safe: true, selected: true, category: 'reports' },
        { id: '10', name: 'Prefetch Files', path: 'C:\\Windows\\Prefetch', size: 52428800, fileCount: 89, safe: true, selected: false, category: 'cache' },
      ],
      error: null,
    };
  },

  // Drivers
  getDrivers(): NativeBridgeResponse<DriverInfo[]> {
    return {
      success: true,
      data: [
        { device: 'NVIDIA GeForce RTX 3070', driver: 'nvlddmkm.sys', version: '31.0.15.4617', date: '2024-01-15', status: 'OK', manufacturer: 'NVIDIA' },
        { device: 'Intel(R) Wi-Fi 6E AX211', driver: 'netwtw10.sys', version: '22.240.0.4', date: '2024-02-20', status: 'OK', manufacturer: 'Intel' },
        { device: 'Realtek(R) Audio', driver: 'RTKVHD64.sys', version: '6.0.9575.1', date: '2023-11-10', status: 'OK', manufacturer: 'Realtek' },
        { device: 'Samsung 980 PRO', driver: 'stornvme.sys', version: '10.0.22621.1', date: '2023-06-15', status: 'OK', manufacturer: 'Microsoft' },
        { device: 'Intel(R) Ethernet Controller', driver: 'e1d68x64.sys', version: '12.19.2.48', date: '2023-09-01', status: 'OK', manufacturer: 'Intel' },
        { device: 'USB xHCI Compliant Host Controller', driver: 'usbxhci.sys', version: '10.0.22621.3374', date: '2024-03-01', status: 'OK', manufacturer: 'Microsoft' },
      ],
      error: null,
    };
  },

  // Hardware Info
  getHardwareInfo(): NativeBridgeResponse<HardwareInfo> {
    return {
      success: true,
      data: {
        cpu: { name: 'Intel Core i7-12700K', cores: 12, threads: 20, architecture: 'x64', frequency: 3600, usage: 23, temperature: 54, available: true },
        gpu: { name: 'NVIDIA GeForce RTX 3070', vram: 8192, usage: 12, temperature: 47, available: true },
        memory: { total: 32768, used: 20012, free: 12756, usagePercent: 61, speed: 3200, isAvailable: true },
        motherboard: { manufacturer: 'ASUS', model: 'ROG STRIX Z690-E GAMING WIFI' },
        bios: { manufacturer: 'ASUS', version: '2803', date: '2023-12-15' },
        storage: [
          { label: 'System', letter: 'C:', filesystem: 'NTFS', total: 512000, used: 341200, free: 170800, usagePercent: 67, health: 'Good', interface: 'NVMe', model: 'Samsung 980 PRO 500GB' },
          { label: 'Data', letter: 'D:', filesystem: 'NTFS', total: 2048000, used: 1230000, free: 818000, usagePercent: 60, health: 'Good', interface: 'SATA', model: 'Seagate Barracuda 2TB' },
        ],
        network: [
          { adapter: 'Wi-Fi', status: 'Connected', ip: '192.168.1.105', gateway: '192.168.1.1', dns: '8.8.8.8', mac: 'A4:C3:F0:XX:XX:XX', linkSpeed: 866, upload: 245, download: 1823 },
        ],
        os: { os: 'Windows 11 Pro', version: '23H2', build: '22631.3880', architecture: 'x64', hostname: 'DESKTOP-A9OPT', uptime: 14523, isAdmin: false },
      },
      error: null,
    };
  },

  // Health Score
  getHealthScore(): NativeBridgeResponse<HealthScore> {
    return {
      success: true,
      data: {
        score: 72,
        factors: [
          { id: 'startup', label: 'Startup Load', value: 8, max: 10, status: 'warning', description: '5 startup items with medium-high impact detected' },
          { id: 'storage', label: 'Free Storage', value: 7, max: 10, status: 'warning', description: 'C: drive at 67% capacity' },
          { id: 'temp', label: 'Temporary Files', value: 4, max: 10, status: 'critical', description: '8.2 GB of temporary files can be cleaned' },
          { id: 'memory', label: 'Memory Pressure', value: 6, max: 10, status: 'warning', description: '61% RAM usage with 15 processes active' },
          { id: 'network', label: 'Network Health', value: 9, max: 10, status: 'good', description: 'Network connection stable' },
          { id: 'updates', label: 'System Updates', value: 8, max: 10, status: 'good', description: 'Windows is up to date' },
          { id: 'background', label: 'Background Services', value: 7, max: 10, status: 'good', description: '3 unnecessary background services detected' },
        ],
      },
      error: null,
    };
  },

  // Scan for optimization findings
  scanOptimization(): NativeBridgeResponse<Finding[]> {
    return {
      success: true,
      data: [
        { id: '1', category: 'Storage', severity: 'medium', title: 'Large Temporary File Cache', description: '8.2 GB of temporary files accumulated across system and user directories', estimatedImpact: 'Faster disk access', actionId: 'CLEAR_TEMP', currentValue: '8.2 GB' },
        { id: '2', category: 'Startup', severity: 'medium', title: 'High Startup Load', description: '5 applications configured to start with Windows, some with high resource impact', estimatedImpact: 'Faster boot time', actionId: 'MANAGE_STARTUP', currentValue: '5 items' },
        { id: '3', category: 'Storage', severity: 'low', title: 'Recycle Bin Not Empty', description: '3.0 GB of deleted files still in Recycle Bin', estimatedImpact: 'Free disk space', actionId: 'EMPTY_RECYCLE_BIN', currentValue: '3.0 GB' },
        { id: '4', category: 'Network', severity: 'safe', title: 'DNS Cache Can Be Flushed', description: 'DNS resolver cache contains stale entries', estimatedImpact: 'Faster DNS resolution', actionId: 'FLUSH_DNS', currentValue: '234 entries' },
        { id: '5', category: 'Processes', severity: 'low', title: 'High Memory Usage by Background Apps', description: 'Several background applications consuming significant memory', estimatedImpact: 'More available RAM', actionId: 'REVIEW_PROCESSES', currentValue: '4.2 GB' },
        { id: '6', category: 'Storage', severity: 'safe', title: 'Windows Update Cache', description: 'Old Windows Update files can be safely removed', estimatedImpact: 'Free disk space', actionId: 'CLEAR_UPDATE_CACHE', currentValue: '512 MB' },
        { id: '7', category: 'Privacy', severity: 'safe', title: 'Recent Files History', description: 'Windows recent files list contains entries that can be cleared', estimatedImpact: 'Improved privacy', actionId: 'CLEAR_RECENT', currentValue: '67 entries' },
        { id: '8', category: 'Storage', severity: 'low', title: 'Browser Cache Accumulation', description: 'Chrome browser cache has grown to 1.5 GB', estimatedImpact: 'Free disk space', actionId: 'CLEAR_BROWSER_CACHE', currentValue: '1.5 GB' },
      ],
      error: null,
    };
  },

  // Performance data
  getPerformanceHistory(): NativeBridgeResponse<PerformanceDataPoint[]> {
    return { success: true, data: [...perfHistory], error: null };
  },

  // Add performance data point
  addPerformancePoint(): void {
    const point = generatePerfPoint();
    perfHistory.push(point);
    if (perfHistory.length > MAX_HISTORY) {
      perfHistory.shift();
    }
  },

  // Get current performance snapshot
  getCurrentPerformance(): NativeBridgeResponse<PerformanceDataPoint> {
    return { success: true, data: generatePerfPoint(), error: null };
  },
};
