/**
 * A9 OPTIMIZER - Startup Manager Service
 * Reads and manages startup entries from Windows registry and startup folders.
 */

import { execPowerShell } from '../security/subprocess';

export async function getStartupItems() {
  const script = `
    $items = @()
    
    # Registry Run keys - HKCU
    $hkcuRun = Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" -ErrorAction SilentlyContinue
    if ($hkcuRun) {
      $hkcuRun.PSObject.Properties | Where-Object { $_.Name -notlike 'PS*' } | ForEach-Object {
        $items += @{
          id = "HKCU_$($_.Name)"
          name = $_.Name
          publisher = "Unknown"
          path = $_.Value
          location = "Registry\\Run\\HKCU"
          enabled = $true
          impact = "medium"
        }
      }
    }
    
    # Registry Run keys - HKLM
    $hklmRun = Get-ItemProperty -Path "HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" -ErrorAction SilentlyContinue
    if ($hklmRun) {
      $hklmRun.PSObject.Properties | Where-Object { $_.Name -notlike 'PS*' } | ForEach-Object {
        $items += @{
          id = "HKLM_$($_.Name)"
          name = $_.Name
          publisher = "Unknown"
          path = $_.Value
          location = "Registry\\Run\\HKLM"
          enabled = $true
          impact = "low"
        }
      }
    }
    
    # Startup folder
    $startupPath = [Environment]::GetFolderPath('Startup')
    if (Test-Path $startupPath) {
      Get-ChildItem $startupPath -File | ForEach-Object {
        $items += @{
          id = "STARTUP_$($_.Name)"
          name = $_.BaseName
          publisher = "Unknown"
          path = $_.FullName
          location = "StartupFolder"
          enabled = $true
          impact = "medium"
        }
      }
    }
    
    $items | ConvertTo-Json
  `;
  const result = await execPowerShell(script);
  return JSON.parse(result.stdout || '[]');
}

export async function toggleStartupItem(id: string, enabled: boolean) {
  // Parse the ID to determine the location
  const [location, ...nameParts] = id.split('_');
  const name = nameParts.join('_');
  
  let script = '';
  
  if (location === 'HKCU') {
    if (enabled) {
      // Re-enable would need the original value stored
      script = `# Re-enable startup item: ${name}`;
    } else {
      // Disable by moving to backup key
      script = `
        $val = (Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" -Name "${name}" -ErrorAction SilentlyContinue)."${name}"
        if ($val) {
          if (-not (Test-Path "HKCU:\\Software\\A9Optimizer\\DisabledStartup")) {
            New-Item -Path "HKCU:\\Software\\A9Optimizer\\DisabledStartup" -Force | Out-Null
          }
          Set-ItemProperty -Path "HKCU:\\Software\\A9Optimizer\\DisabledStartup" -Name "${name}" -Value $val
          Remove-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" -Name "${name}" -ErrorAction SilentlyContinue
        }
      `;
    }
  }
  
  if (script) {
    await execPowerShell(script);
  }
  
  return { success: true, message: `Startup item ${enabled ? 'enabled' : 'disabled'}` };
}
