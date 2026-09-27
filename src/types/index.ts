// A9 OPTIMIZER - Core Type Definitions

export interface SystemInfo {
  os: string;
  version: string;
  build: string;
  architecture: string;
  hostname: string;
  uptime: number;
  isAdmin: boolean;
}

export interface CpuStats {
  name: string;
  cores: number;
  threads: number;
  architecture: string;
  frequency: number;
  usage: number;
  temperature: number | null;
  available: boolean;
}

export interface MemoryStats {
  total: number;
  used: number;
  free: number;
  usagePercent: number;
  speed: number | null;
  isAvailable: boolean;
}

export interface GpuStats {
  name: string;
  vram: number | null;
  usage: number;
  temperature: number | null;
  available: boolean;
}

export interface DiskInfo {
  label: string;
  letter: string;
  filesystem: string;
  total: number;
  used: number;
  free: number;
  usagePercent: number;
  health: string | null;
  interface: string;
  model: string;
}

export interface NetworkInfo {
  adapter: string;
  status: string;
  ip: string;
  gateway: string;
  dns: string;
  mac: string;
  linkSpeed: number | null;
  upload: number;
  download: number;
}

export interface ProcessInfo {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  path: string;
  publisher: string | null;
  status: string;
  user: string;
  isSystem: boolean;
}

export interface StartupItem {
  id: string;
  name: string;
  publisher: string;
  path: string;
  location: string;
  enabled: boolean;
  impact: 'high' | 'medium' | 'low' | 'none';
}

export interface Finding {
  id: string;
  category: string;
  severity: 'safe' | 'low' | 'medium' | 'advanced';
  title: string;
  description: string;
  estimatedImpact?: string;
  actionId?: string;
  currentValue?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  risk: 'safe' | 'low' | 'medium' | 'advanced';
  expectedEffect: string;
  currentState: string;
  actionId: string;
  undoable: boolean;
}

export interface ActionResult {
  success: boolean;
  actionId: string;
  message: string;
  details?: string;
  undoData?: Record<string, unknown>;
}

export interface CleanupItem {
  id: string;
  name: string;
  path: string;
  size: number;
  fileCount: number;
  safe: boolean;
  selected: boolean;
  category: string;
}

export interface DriverInfo {
  device: string;
  driver: string;
  version: string;
  date: string;
  status: string;
  manufacturer: string;
}

export interface HardwareInfo {
  cpu: CpuStats;
  gpu: GpuStats;
  memory: MemoryStats;
  motherboard: { manufacturer: string; model: string };
  bios: { manufacturer: string; version: string; date: string };
  storage: DiskInfo[];
  network: NetworkInfo[];
  os: SystemInfo;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  actions?: AIAction[];
}

export interface AIAction {
  id: string;
  actionId: string;
  label: string;
  description: string;
  approved: boolean;
}

export interface AIConfig {
  deepseekKey: string;
  grokKey: string;
  groqKey: string;
  openrouterKey: string;
  primaryProvider: string;
  configured: boolean;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  animations: boolean;
  telemetry: boolean;
  startWithWindows: boolean;
  minimizeToTray: boolean;
  autoScan: boolean;
  notifications: boolean;
  language: string;
  scanInterval: number;
}

export interface OptimizationReport {
  id: string;
  date: number;
  healthScore: number;
  findings: Finding[];
  actions: ActionResult[];
  systemSnapshot: Partial<HardwareInfo>;
}

export interface PerformanceDataPoint {
  timestamp: number;
  cpu: number;
  memory: number;
  gpu: number;
  disk: number;
  networkUp: number;
  networkDown: number;
}

export interface HealthScore {
  score: number;
  factors: HealthFactor[];
}

export interface HealthFactor {
  id: string;
  label: string;
  value: number;
  max: number;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

export type PageId =
  | 'dashboard'
  | 'optimizer'
  | 'performance'
  | 'processes'
  | 'startup'
  | 'storage'
  | 'cleanup'
  | 'privacy'
  | 'network'
  | 'hardware'
  | 'drivers'
  | 'tools'
  | 'ai'
  | 'reports'
  | 'settings'
  | 'about';

export interface NativeBridgeResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}
