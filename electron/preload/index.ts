/**
 * A9 OPTIMIZER - Preload Script
 * 
 * This script runs in a privileged context before the renderer loads.
 * It exposes a safe, typed API to the renderer via contextBridge.
 * 
 * Security:
 * - Only exposes specific, validated methods
 * - No arbitrary code execution
 * - Input validation on all IPC calls
 * - No Node.js access in renderer
 */

import { contextBridge, ipcRenderer } from 'electron';

// Type-safe IPC invoke wrapper
function invoke<T>(channel: string, ...args: unknown[]): Promise<T> {
  // Validate channel is in allowlist
  const allowedChannels = [
    'system:getInfo',
    'system:getCpuStats',
    'system:getMemoryStats',
    'system:getGpuStats',
    'system:getDiskInfo',
    'system:getNetworkInfo',
    'system:getProcesses',
    'system:getStartupItems',
    'system:getHardwareInfo',
    'system:getDrivers',
    'system:getHealthScore',
    'cleanup:scan',
    'cleanup:execute',
    'optimizer:scan',
    'optimizer:execute',
    'startup:toggle',
    'process:end',
    'network:ping',
    'network:flushDns',
    'network:ipConfig',
    'network:nsLookup',
    'tools:launch',
    'ai:sendMessage',
    'ai:testConnection',
    'settings:get',
    'settings:set',
    'credentials:save',
    'credentials:get',
    'credentials:remove',
    'credentials:test',
    'reports:generate',
    'reports:export',
    'logs:open',
  ];

  if (!allowedChannels.includes(channel)) {
    throw new Error(`IPC channel not allowed: ${channel}`);
  }

  return ipcRenderer.invoke(channel, ...args);
}

// Expose safe API to renderer
const api = {
  // System information
  getSystemInfo: () => invoke('system:getInfo'),
  getCpuStats: () => invoke('system:getCpuStats'),
  getMemoryStats: () => invoke('system:getMemoryStats'),
  getGpuStats: () => invoke('system:getGpuStats'),
  getDiskInfo: () => invoke('system:getDiskInfo'),
  getNetworkInfo: () => invoke('system:getNetworkInfo'),
  getProcesses: () => invoke('system:getProcesses'),
  getStartupItems: () => invoke('system:getStartupItems'),
  getHardwareInfo: () => invoke('system:getHardwareInfo'),
  getDrivers: () => invoke('system:getDrivers'),
  getHealthScore: () => invoke('system:getHealthScore'),

  // Cleanup
  scanCleanup: () => invoke('cleanup:scan'),
  executeCleanup: (items: string[]) => invoke('cleanup:execute', items),

  // Optimizer
  scanOptimization: () => invoke('optimizer:scan'),
  executeOptimization: (actions: string[]) => invoke('optimizer:execute', actions),

  // Startup management
  toggleStartupItem: (id: string, enabled: boolean) => invoke('startup:toggle', id, enabled),

  // Process management
  endProcess: (pid: number) => invoke('process:end', pid),

  // Network tools
  networkPing: (host: string) => invoke('network:ping', host),
  networkFlushDns: () => invoke('network:flushDns'),
  networkIpConfig: () => invoke('network:ipConfig'),
  networkNsLookup: (domain: string) => invoke('network:nsLookup', domain),

  // Windows tools
  launchTool: (toolId: string) => invoke('tools:launch', toolId),

  // AI
  aiSendMessage: (message: string, context?: object) => invoke('ai:sendMessage', message, context),
  aiTestConnection: (provider: string) => invoke('ai:testConnection', provider),

  // Settings
  getSettings: () => invoke('settings:get'),
  setSettings: (settings: object) => invoke('settings:set', settings),

  // Credentials (secure storage)
  saveCredential: (key: string, value: string) => invoke('credentials:save', key, value),
  getCredential: (key: string) => invoke('credentials:get', key),
  removeCredential: (key: string) => invoke('credentials:remove', key),
  testCredential: (key: string) => invoke('credentials:test', key),

  // Reports
  generateReport: () => invoke('reports:generate'),
  exportReport: (format: string) => invoke('reports:export', format),

  // Logs
  openLogs: () => invoke('logs:open'),

  // Platform info
  platform: process.platform,
  isWindows: process.platform === 'win32',
};

export type A9API = typeof api;

contextBridge.exposeInMainWorld('a9', api);
