# A9 OPTIMIZER - PowerShell Helper Scripts
# These scripts are called by the Electron main process via secure subprocess execution.
# They perform real Windows system operations.

<#
.SYNOPSIS
    Get comprehensive system information
.DESCRIPTION
    Returns CPU, memory, disk, network, and OS information
#>

function Get-A9SystemInfo {
    [CmdletBinding()]
    param()
    
    $result = @{
        timestamp = (Get-Date).ToString("o")
        os = @{
            caption = (Get-CimInstance Win32_OperatingSystem).Caption
            version = (Get-CimInstance Win32_OperatingSystem).Version
            build = (Get-CimInstance Win32_OperatingSystem).BuildNumber
            architecture = (Get-CimInstance Win32_OperatingSystem).OSArchitecture
        }
        cpu = @{
            name = (Get-CimInstance Win32_Processor).Name.Trim()
            cores = (Get-CimInstance Win32_Processor).NumberOfCores
            threads = (Get-CimInstance Win32_Processor).NumberOfLogicalProcessors
            loadPercent = (Get-CimInstance Win32_Processor).LoadPercentage
        }
        memory = @{
            totalMB = [math]::Floor((Get-CimInstance Win32_OperatingSystem).TotalVisibleMemorySize / 1KB)
            freeMB = [math]::Floor((Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory / 1KB)
        }
        disks = Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" | ForEach-Object {
            @{
                letter = $_.DeviceID
                label = $_.VolumeName
                totalMB = [math]::Floor($_.Size / 1MB)
                freeMB = [math]::Floor($_.FreeSpace / 1MB)
            }
        }
    }
    
    $result.memory.usedMB = $result.memory.totalMB - $result.memory.freeMB
    $result.memory.usagePercent = [math]::Floor(($result.memory.usedMB / $result.memory.totalMB) * 100)
    
    return $result | ConvertTo-Json -Depth 5
}

<#
.SYNOPSIS
    Scan for cleanable temporary files
#>
function Scan-A9Cleanup {
    [CmdletBinding()]
    param(
        [string[]]$Paths = @(
            "$env:TEMP",
            "$env:SystemRoot\Temp",
            "$env:LOCALAPPDATA\Temp"
        )
    )
    
    $results = @()
    
    foreach ($path in $Paths) {
        $expandedPath = [Environment]::ExpandEnvironmentVariables($path)
        
        if (Test-Path $expandedPath) {
            try {
                $files = Get-ChildItem -Path $expandedPath -Recurse -File -ErrorAction SilentlyContinue
                $totalSize = ($files | Measure-Object -Property Length -Sum).Sum
                $oldFiles = $files | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-1) }
                $cleanableSize = ($oldFiles | Measure-Object -Property Length -Sum).Sum
                
                $results += @{
                    path = $expandedPath
                    totalFiles = $files.Count
                    totalSize = $totalSize
                    cleanableFiles = $oldFiles.Count
                    cleanableSize = $cleanableSize
                }
            }
            catch {
                $results += @{
                    path = $expandedPath
                    error = $_.Exception.Message
                }
            }
        }
    }
    
    return $results | ConvertTo-Json -Depth 3
}

<#
.SYNOPSIS
    Get startup items from registry
#>
function Get-A9StartupItems {
    [CmdletBinding()]
    param()
    
    $items = @()
    
    # HKCU Run
    $hkcuPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"
    if (Test-Path $hkcuPath) {
        $props = Get-ItemProperty -Path $hkcuPath -ErrorAction SilentlyContinue
        $props.PSObject.Properties | Where-Object { $_.Name -notlike 'PS*' } | ForEach-Object {
            $items += @{
                id = "HKCU_RUN_$($_.Name)"
                name = $_.Name
                value = $_.Value
                location = "HKCU\Run"
                enabled = $true
            }
        }
    }
    
    # HKLM Run
    $hklmPath = "HKLM:\Software\Microsoft\Windows\CurrentVersion\Run"
    if (Test-Path $hklmPath) {
        $props = Get-ItemProperty -Path $hklmPath -ErrorAction SilentlyContinue
        $props.PSObject.Properties | Where-Object { $_.Name -notlike 'PS*' } | ForEach-Object {
            $items += @{
                id = "HKLM_RUN_$($_.Name)"
                name = $_.Name
                value = $_.Value
                location = "HKLM\Run"
                enabled = $true
            }
        }
    }
    
    return $items | ConvertTo-Json -Depth 3
}

<#
.SYNOPSIS
    Disable a startup item (reversible)
#>
function Disable-A9StartupItem {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$ItemId,
        
        [Parameter(Mandatory)]
        [string]$RegistryPath,
        
        [Parameter(Mandatory)]
        [string]$ValueName
    )
    
    # Store original value for undo
    $backupPath = "HKCU:\Software\A9Optimizer\DisabledStartup"
    if (-not (Test-Path $backupPath)) {
        New-Item -Path $backupPath -Force | Out-Null
    }
    
    # Get current value
    $currentValue = (Get-ItemProperty -Path $RegistryPath -Name $ValueName -ErrorAction SilentlyContinue).$ValueName
    
    if ($currentValue) {
        # Backup
        Set-ItemProperty -Path $backupPath -Name $ValueName -Value $currentValue
        
        # Remove from startup
        Remove-ItemProperty -Path $RegistryPath -Name $ValueName -ErrorAction Stop
        
        return @{ success = $true; message = "Disabled startup item: $ValueName" } | ConvertTo-Json
    }
    
    return @{ success = $false; message = "Item not found" } | ConvertTo-Json
}
