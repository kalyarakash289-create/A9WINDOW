/**
 * A9 OPTIMIZER - IPC Handlers
 * 
 * Registers all IPC handlers for communication between
 * the main process and renderer process.
 * 
 * Security:
 * - All inputs are validated
 * - No arbitrary command execution
 * - Controlled subprocess spawning
 * - Timeout enforcement
 * - Output sanitization
 */

import { IPCMain } from 'electron';
import { getSystemInfo } from '../services/systemInfo';
import { getCpuStats, getMemoryStats, getGpuStats } from '../services/hardwareMonitor';
import { getDiskInfo, getNetworkInfo } from '../services/systemInfo';
import { getProcesses, endProcess } from '../services/processManager';
import { getStartupItems, toggleStartupItem } from '../services/startupManager';
import { scanCleanup, executeCleanup } from '../services/cleanupEngine';
import { scanOptimization, executeOptimization } from '../services/optimizerEngine';
import { getHardwareInfo, getDrivers } from '../services/hardwareMonitor';
import { getHealthScore } from '../services/healthScorer';
import { handleAiMessage, testAiConnection } from '../services/aiService';
import { getSettings, setSettings } from '../services/settingsManager';
import { saveCredential, getCredential, removeCredential, testCredential } from '../services/credentialStore';
import { generateReport, exportReport } from '../services/reportGenerator';
import { launchTool } from '../services/windowsTools';
import { runNetworkCommand } from '../services/networkTools';
import { logger } from './logger';

// Input validators
function validateString(input: unknown, maxLength = 1000): string {
  if (typeof input !== 'string') throw new Error('Expected string');
  if (input.length > maxLength) throw new Error('Input too long');
  return input;
}

function validateNumber(input: unknown): number {
  if (typeof input !== 'number' || !isFinite(input)) throw new Error('Expected number');
  return input;
}

function validatePid(pid: unknown): number {
  const n = validateNumber(pid);
  if (n < 0 || n > 4194304) throw new Error('Invalid PID');
  return n;
}

function validatePath(p: unknown): string {
  const path = validateString(p, 4096);
  // Prevent path traversal
  if (path.includes('..') || path.includes('\0')) throw new Error('Invalid path');
  return path;
}

export function registerIpcHandlers(ipcMain: IPCMain) {
  // System info
  ipcMain.handle('system:getInfo', async () => {
    try {
      return { success: true, data: await getSystemInfo(), error: null };
    } catch (error) {
      logger.error('Failed to get system info', error);
      return { success: false, data: null, error: 'Failed to retrieve system information' };
    }
  });

  ipcMain.handle('system:getCpuStats', async () => {
    try {
      return { success: true, data: await getCpuStats(), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'CPU monitoring unavailable' };
    }
  });

  ipcMain.handle('system:getMemoryStats', async () => {
    try {
      return { success: true, data: await getMemoryStats(), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Memory monitoring unavailable' };
    }
  });

  ipcMain.handle('system:getGpuStats', async () => {
    try {
      return { success: true, data: await getGpuStats(), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'GPU monitoring unavailable' };
    }
  });

  ipcMain.handle('system:getDiskInfo', async () => {
    try {
      return { success: true, data: await getDiskInfo(), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Disk info unavailable' };
    }
  });

  ipcMain.handle('system:getNetworkInfo', async () => {
    try {
      return { success: true, data: await getNetworkInfo(), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Network info unavailable' };
    }
  });

  ipcMain.handle('system:getProcesses', async () => {
    try {
      return { success: true, data: await getProcesses(), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Process list unavailable' };
    }
  });

  ipcMain.handle('system:getStartupItems', async () => {
    try {
      return { success: true, data: await getStartupItems(), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Startup items unavailable' };
    }
  });

  ipcMain.handle('system:getHardwareInfo', async () => {
    try {
      return { success: true, data: await getHardwareInfo(), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Hardware info unavailable' };
    }
  });

  ipcMain.handle('system:getDrivers', async () => {
    try {
      return { success: true, data: await getDrivers(), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Driver info unavailable' };
    }
  });

  ipcMain.handle('system:getHealthScore', async () => {
    try {
      return { success: true, data: await getHealthScore(), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Health score unavailable' };
    }
  });

  // Cleanup
  ipcMain.handle('cleanup:scan', async () => {
    try {
      return { success: true, data: await scanCleanup(), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Cleanup scan failed' };
    }
  });

  ipcMain.handle('cleanup:execute', async (_, items: unknown) => {
    try {
      if (!Array.isArray(items)) throw new Error('Expected array');
      const validated = items.map(i => validateString(i));
      return { success: true, data: await executeCleanup(validated), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Cleanup execution failed' };
    }
  });

  // Optimizer
  ipcMain.handle('optimizer:scan', async () => {
    try {
      return { success: true, data: await scanOptimization(), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Optimization scan failed' };
    }
  });

  ipcMain.handle('optimizer:execute', async (_, actions: unknown) => {
    try {
      if (!Array.isArray(actions)) throw new Error('Expected array');
      const validated = actions.map(a => validateString(a));
      return { success: true, data: await executeOptimization(validated), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Optimization execution failed' };
    }
  });

  // Startup management
  ipcMain.handle('startup:toggle', async (_, id: unknown, enabled: unknown) => {
    try {
      const validatedId = validateString(id);
      const validatedEnabled = typeof enabled === 'boolean' ? enabled : Boolean(enabled);
      return { success: true, data: await toggleStartupItem(validatedId, validatedEnabled), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Failed to toggle startup item' };
    }
  });

  // Process management
  ipcMain.handle('process:end', async (_, pid: unknown) => {
    try {
      const validatedPid = validatePid(pid);
      return { success: true, data: await endProcess(validatedPid), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Failed to end process' };
    }
  });

  // Network tools
  ipcMain.handle('network:ping', async (_, host: unknown) => {
    try {
      const validatedHost = validateString(host, 253);
      // Validate hostname format
      if (!/^[a-zA-Z0-9.-]+$/.test(validatedHost)) throw new Error('Invalid hostname');
      return { success: true, data: await runNetworkCommand('ping', validatedHost), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Ping failed' };
    }
  });

  ipcMain.handle('network:flushDns', async () => {
    try {
      return { success: true, data: await runNetworkCommand('flushDns'), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'DNS flush failed (may require admin)' };
    }
  });

  // AI
  ipcMain.handle('ai:sendMessage', async (_, message: unknown, context: unknown) => {
    try {
      const validatedMessage = validateString(message, 4000);
      return { success: true, data: await handleAiMessage(validatedMessage, context as object), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'AI service unavailable' };
    }
  });

  ipcMain.handle('ai:testConnection', async (_, provider: unknown) => {
    try {
      const validatedProvider = validateString(provider, 50);
      return { success: true, data: await testAiConnection(validatedProvider), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Connection test failed' };
    }
  });

  // Settings
  ipcMain.handle('settings:get', async () => {
    try {
      return { success: true, data: await getSettings(), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Failed to load settings' };
    }
  });

  ipcMain.handle('settings:set', async (_, settings: unknown) => {
    try {
      if (typeof settings !== 'object' || settings === null) throw new Error('Expected object');
      return { success: true, data: await setSettings(settings as Record<string, unknown>), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Failed to save settings' };
    }
  });

  // Credentials
  ipcMain.handle('credentials:save', async (_, key: unknown, value: unknown) => {
    try {
      const validatedKey = validateString(key, 100);
      const validatedValue = validateString(value, 10000);
      return { success: true, data: await saveCredential(validatedKey, validatedValue), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Failed to save credential' };
    }
  });

  ipcMain.handle('credentials:get', async (_, key: unknown) => {
    try {
      const validatedKey = validateString(key, 100);
      return { success: true, data: await getCredential(validatedKey), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Failed to get credential' };
    }
  });

  ipcMain.handle('credentials:remove', async (_, key: unknown) => {
    try {
      const validatedKey = validateString(key, 100);
      return { success: true, data: await removeCredential(validatedKey), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Failed to remove credential' };
    }
  });

  ipcMain.handle('credentials:test', async (_, key: unknown) => {
    try {
      const validatedKey = validateString(key, 100);
      return { success: true, data: await testCredential(validatedKey), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Credential test failed' };
    }
  });

  // Tools
  ipcMain.handle('tools:launch', async (_, toolId: unknown) => {
    try {
      const validatedToolId = validateString(toolId, 100);
      return { success: true, data: await launchTool(validatedToolId), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Failed to launch tool' };
    }
  });

  // Reports
  ipcMain.handle('reports:generate', async () => {
    try {
      return { success: true, data: await generateReport(), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Failed to generate report' };
    }
  });

  ipcMain.handle('reports:export', async (_, format: unknown) => {
    try {
      const validatedFormat = validateString(format, 10);
      if (!['txt', 'json', 'html'].includes(validatedFormat)) throw new Error('Invalid format');
      return { success: true, data: await exportReport(validatedFormat), error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Failed to export report' };
    }
  });

  // Logs
  ipcMain.handle('logs:open', async () => {
    try {
      const { shell } = require('electron');
      const logPath = logger.getLogPath();
      await shell.openPath(logPath);
      return { success: true, data: null, error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Failed to open logs' };
    }
  });

  logger.info('IPC handlers registered successfully');
}
