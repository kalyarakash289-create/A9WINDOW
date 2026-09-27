/**
 * A9 OPTIMIZER - Cleanup Engine
 * Scans and removes safe temporary files and caches.
 */

import { execPowerShell } from '../security/subprocess';
import * as path from 'path';
import * as fs from 'fs';

// Safe directories that can be cleaned
const SAFE_CLEAN_PATHS = [
  { id: 'win_temp', name: 'Windows Temp Files', path: 'C:\\Windows\\Temp', category: 'temp' },
  { id: 'user_temp', name: 'User Temp Files', path: '%TEMP%', category: 'temp' },
  { id: 'prefetch', name: 'Prefetch Files', path: 'C:\\Windows\\Prefetch', category: 'cache' },
  { id: 'thumb_cache', name: 'Thumbnail Cache', path: '%LOCALAPPDATA%\\Microsoft\\Windows\\Explorer', category: 'cache' },
  { id: 'crash_dumps', name: 'Crash Dumps', path: '%LOCALAPPDATA%\\CrashDumps', category: 'dumps' },
  { id: 'win_update_cache', name: 'Windows Update Cache', path: 'C:\\Windows\\SoftwareDistribution\\Download', category: 'cache' },
  { id: 'delivery_opt', name: 'Delivery Optimization', path: 'C:\\Windows\\SoftwareDistribution\\DeliveryOptimization', category: 'cache' },
  { id: 'error_reports', name: 'Windows Error Reports', path: 'C:\\ProgramData\\Microsoft\\Windows\\WER', category: 'reports' },
];

export async function scanCleanup() {
  const results = [];
  
  for (const target of SAFE_CLEAN_PATHS) {
    try {
      const resolvedPath = target.path
        .replace('%TEMP%', process.env.TEMP || '')
        .replace('%LOCALAPPDATA%', process.env.LOCALAPPDATA || '');
      
      if (fs.existsSync(resolvedPath)) {
        const stats = await getDirectoryStats(resolvedPath);
        results.push({
          id: target.id,
          name: target.name,
          path: resolvedPath,
          size: stats.size,
          fileCount: stats.fileCount,
          safe: true,
          selected: true,
          category: target.category,
        });
      }
    } catch {
      // Path not accessible, skip
    }
  }
  
  return results;
}

async function getDirectoryStats(dirPath: string): Promise<{ size: number; fileCount: number }> {
  try {
    const script = `
      $items = Get-ChildItem -Path "${dirPath}" -Recurse -File -ErrorAction SilentlyContinue
      @{
        size = ($items | Measure-Object -Property Length -Sum).Sum
        fileCount = $items.Count
      } | ConvertTo-Json
    `;
    const result = await execPowerShell(script, { timeout: 15000 });
    const data = JSON.parse(result.stdout);
    return { size: data.size || 0, fileCount: data.fileCount || 0 };
  } catch {
    return { size: 0, fileCount: 0 };
  }
}

export async function executeCleanup(itemIds: string[]) {
  const results = [];
  
  for (const id of itemIds) {
    const target = SAFE_CLEAN_PATHS.find(t => t.id === id);
    if (!target) {
      results.push({ success: false, actionId: id, message: 'Unknown cleanup target' });
      continue;
    }
    
    try {
      const resolvedPath = target.path
        .replace('%TEMP%', process.env.TEMP || '')
        .replace('%LOCALAPPDATA%', process.env.LOCALAPPDATA || '');
      
      const script = `
        Get-ChildItem -Path "${resolvedPath}" -Recurse -File -ErrorAction SilentlyContinue | 
          Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-1) } |
          Remove-Item -Force -ErrorAction SilentlyContinue
      `;
      
      await execPowerShell(script, { timeout: 30000 });
      results.push({ success: true, actionId: id, message: `Cleaned ${target.name}` });
    } catch (error) {
      results.push({ success: false, actionId: id, message: `Failed to clean ${target.name}` });
    }
  }
  
  return results;
}
