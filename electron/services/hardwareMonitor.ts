/**
 * A9 OPTIMIZER - Hardware Monitor Service
 * 
 * Monitors CPU, GPU, memory stats using Windows performance counters
 * and WMI queries.
 */

import { execPowerShell } from '../security/subprocess';

export async function getCpuStats() {
  const script = `
    $cpu = Get-CimInstance Win32_Processor
    $load = (Get-CimInstance Win32_Processor).LoadPercentage
    @{
      name = $cpu.Name.Trim()
      cores = $cpu.NumberOfCores
      threads = $cpu.NumberOfLogicalProcessors
      architecture = $cpu.AddressWidth
      frequency = $cpu.MaxClockSpeed
      usage = $load
      available = $true
    } | ConvertTo-Json
  `;
  const result = await execPowerShell(script);
  return JSON.parse(result.stdout);
}

export async function getMemoryStats() {
  const script = `
    $os = Get-CimInstance Win32_OperatingSystem
    @{
      total = [math]::Floor($os.TotalVisibleMemorySize / 1KB)
      used = [math]::Floor(($os.TotalVisibleMemorySize - $os.FreePhysicalMemory) / 1KB)
      free = [math]::Floor($os.FreePhysicalMemory / 1KB)
      usagePercent = [math]::Floor((($os.TotalVisibleMemorySize - $os.FreePhysicalMemory) / $os.TotalVisibleMemorySize) * 100)
      isAvailable = $true
    } | ConvertTo-Json
  `;
  const result = await execPowerShell(script);
  return JSON.parse(result.stdout);
}

export async function getGpuStats() {
  const script = `
    $gpu = Get-CimInstance Win32_VideoController | Select-Object -First 1
    @{
      name = $gpu.Name
      vram = [math]::Floor($gpu.AdapterRAM / 1MB)
      usage = 0
      available = $true
    } | ConvertTo-Json
  `;
  const result = await execPowerShell(script);
  return JSON.parse(result.stdout);
}

export async function getHardwareInfo() {
  const script = `
    $cpu = Get-CimInstance Win32_Processor
    $gpu = Get-CimInstance Win32_VideoController | Select-Object -First 1
    $os = Get-CimInstance Win32_OperatingSystem
    $mb = Get-CimInstance Win32_BaseBoard
    $bios = Get-CimInstance Win32_BIOS
    @{
      cpu = @{
        name = $cpu.Name.Trim()
        cores = $cpu.NumberOfCores
        threads = $cpu.NumberOfLogicalProcessors
        architecture = "x64"
        frequency = $cpu.MaxClockSpeed
        usage = $cpu.LoadPercentage
        available = $true
      }
      gpu = @{
        name = $gpu.Name
        vram = [math]::Floor($gpu.AdapterRAM / 1MB)
        available = $true
      }
      memory = @{
        total = [math]::Floor($os.TotalVisibleMemorySize / 1KB)
        used = [math]::Floor(($os.TotalVisibleMemorySize - $os.FreePhysicalMemory) / 1KB)
        free = [math]::Floor($os.FreePhysicalMemory / 1KB)
        usagePercent = [math]::Floor((($os.TotalVisibleMemorySize - $os.FreePhysicalMemory) / $os.TotalVisibleMemorySize) * 100)
        isAvailable = $true
      }
      motherboard = @{
        manufacturer = $mb.Manufacturer
        model = $mb.Product
      }
      bios = @{
        manufacturer = $bios.Manufacturer
        version = $bios.SMBIOSBIOSVersion
        date = $bios.ReleaseDate
      }
    } | ConvertTo-Json -Depth 5
  `;
  const result = await execPowerShell(script);
  return JSON.parse(result.stdout);
}

export async function getDrivers() {
  const script = `
    Get-CimInstance Win32_PnPSignedDriver | Where-Object { $_.DeviceName -and $_.DriverVersion } | Select-Object -First 20 | ForEach-Object {
      @{
        device = $_.DeviceName
        driver = $_.InfFilename
        version = $_.DriverVersion
        date = $_.DriverDate
        status = 'OK'
        manufacturer = $_.Manufacturer
      }
    } | ConvertTo-Json
  `;
  const result = await execPowerShell(script);
  return JSON.parse(result.stdout);
}
