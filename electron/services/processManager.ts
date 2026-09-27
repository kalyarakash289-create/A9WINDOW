/**
 * A9 OPTIMIZER - Process Manager Service
 */

import { execPowerShell, execSafe } from '../security/subprocess';

export async function getProcesses() {
  const script = `
    Get-Process | Where-Object { $_.ProcessName } | Sort-Object -Property CPU -Descending | Select-Object -First 50 | ForEach-Object {
      @{
        pid = $_.Id
        name = $_.ProcessName
        cpu = [math]::Round($_.CPU ?? 0, 1)
        memory = [math]::Round($_.WorkingSet64 / 1MB, 1)
        path = $_.Path ?? ''
        status = if ($_.Responding) { 'Running' } else { 'Not Responding' }
        user = $_.SessionId
      }
    } | ConvertTo-Json
  `;
  const result = await execPowerShell(script);
  return JSON.parse(result.stdout);
}

export async function endProcess(pid: number) {
  // Validate PID is reasonable
  if (pid < 1 || pid > 4194304) throw new Error('Invalid PID');
  
  const result = await execSafe('taskkill.exe', ['/PID', String(pid), '/F']);
  return {
    success: result.exitCode === 0,
    message: result.exitCode === 0 ? `Process ${pid} terminated` : `Failed to terminate process ${pid}`,
    output: result.stdout || result.stderr,
  };
}
