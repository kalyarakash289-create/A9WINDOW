/**
 * A9 OPTIMIZER - System Info Service
 * 
 * Retrieves system information using Windows APIs via PowerShell.
 * In production, uses controlled subprocess calls with argument arrays.
 */

import { execSafe } from '../security/subprocess';

export async function getSystemInfo() {
  const script = `
    $os = Get-CimInstance Win32_OperatingSystem
    $cs = Get-CimInstance Win32_ComputerSystem
    @{
      os = $os.Caption
      version = $os.Version
      build = $os.BuildNumber
      architecture = $os.OSArchitecture
      hostname = $cs.Name
      uptime = [math]::Floor((Get-Date) - $os.LastBootUpTime).TotalSeconds
      isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    } | ConvertTo-Json
  `;
  
  const result = await execSafe('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script]);
  return JSON.parse(result.stdout);
}

export async function getDiskInfo() {
  const script = `
    Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" | ForEach-Object {
      $vol = Get-CimInstance Win32_Volume -Filter "DriveLetter='$($_.DeviceID)'"
      @{
        letter = $_.DeviceID
        label = $_.VolumeName
        filesystem = $_.FileSystem
        total = [math]::Floor($_.Size / 1MB)
        free = [math]::Floor($_.FreeSpace / 1MB)
        used = [math]::Floor(($_.Size - $_.FreeSpace) / 1MB)
        usagePercent = [math]::Floor((($_.Size - $_.FreeSpace) / $_.Size) * 100)
      }
    } | ConvertTo-Json
  `;
  
  const result = await execSafe('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script]);
  return JSON.parse(result.stdout);
}

export async function getNetworkInfo() {
  const script = `
    Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | ForEach-Object {
      $ip = Get-NetIPAddress -InterfaceIndex $_.ifIndex -AddressFamily IPv4 -ErrorAction SilentlyContinue
      @{
        adapter = $_.Name
        status = $_.Status
        ip = if ($ip) { $ip.IPAddress } else { 'N/A' }
        mac = $_.MacAddress
        linkSpeed = $_.LinkSpeed
      }
    } | ConvertTo-Json
  `;
  
  const result = await execSafe('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script]);
  return JSON.parse(result.stdout);
}
