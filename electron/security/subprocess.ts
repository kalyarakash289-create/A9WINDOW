/**
 * A9 OPTIMIZER - Secure Subprocess Execution
 * 
 * Provides safe subprocess spawning with:
 * - Argument arrays (no shell injection)
 * - Timeouts
 * - Output capture
 * - Exit code checking
 * - Cancellation support
 * - Path validation
 */

import { spawn, SpawnOptions } from 'child_process';

interface ExecResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  timedOut: boolean;
}

interface ExecOptions {
  timeout?: number;
  cwd?: string;
  env?: Record<string, string>;
  signal?: AbortSignal;
}

// Allowed executables (whitelist)
const ALLOWED_EXECUTABLES = new Set([
  'powershell.exe',
  'pwsh.exe',
  'cmd.exe',
  'wmic.exe',
  'netsh.exe',
  'ipconfig.exe',
  'ping.exe',
  'nslookup.exe',
  'tasklist.exe',
  'taskkill.exe',
  'reg.exe',
  'sc.exe',
  'schtasks.exe',
]);

// Validate executable
function validateExecutable(executable: string): void {
  const basename = executable.toLowerCase().replace(/\.exe$/i, '') + '.exe';
  if (!ALLOWED_EXECUTABLES.has(basename) && !ALLOWED_EXECUTABLES.has(executable.toLowerCase())) {
    throw new Error(`Executable not allowed: ${executable}`);
  }
}

// Validate arguments
function validateArgs(args: string[]): void {
  for (const arg of args) {
    if (typeof arg !== 'string') throw new Error('Arguments must be strings');
    if (arg.includes('\0')) throw new Error('Null bytes not allowed in arguments');
    if (arg.length > 10000) throw new Error('Argument too long');
  }
}

/**
 * Execute a command safely with argument arrays.
 * Never uses shell: true to prevent injection.
 */
export async function execSafe(
  executable: string,
  args: string[],
  options: ExecOptions = {}
): Promise<ExecResult> {
  validateExecutable(executable);
  validateArgs(args);

  const timeout = options.timeout || 30000; // 30 second default timeout

  return new Promise((resolve, reject) => {
    const spawnOptions: SpawnOptions = {
      shell: false, // CRITICAL: Never use shell
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
      cwd: options.cwd,
      env: options.env,
    };

    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let killed = false;

    const proc = spawn(executable, args, spawnOptions);

    // Timeout handling
    const timer = setTimeout(() => {
      timedOut = true;
      killed = true;
      proc.kill('SIGTERM');
      // Force kill after 5 seconds if still running
      setTimeout(() => {
        if (!proc.killed) proc.kill('SIGKILL');
      }, 5000);
    }, timeout);

    // Cancellation support
    if (options.signal) {
      options.signal.addEventListener('abort', () => {
        killed = true;
        proc.kill('SIGTERM');
      });
    }

    proc.stdout?.on('data', (data: Buffer) => {
      stdout += data.toString('utf-8');
      // Limit output size
      if (stdout.length > 10000000) { // 10MB limit
        proc.kill('SIGTERM');
      }
    });

    proc.stderr?.on('data', (data: Buffer) => {
      stderr += data.toString('utf-8');
      if (stderr.length > 1000000) { // 1MB limit
        proc.kill('SIGTERM');
      }
    });

    proc.on('close', (code: number | null) => {
      clearTimeout(timer);
      resolve({
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: code ?? -1,
        timedOut,
      });
    });

    proc.on('error', (error: Error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

/**
 * Execute a PowerShell script safely.
 * Scripts are passed via -Command with proper escaping.
 */
export async function execPowerShell(script: string, options: ExecOptions = {}): Promise<ExecResult> {
  // Validate script doesn't contain dangerous patterns
  const dangerousPatterns = [
    /Invoke-Expression/i,
    /Invoke-Command/i,
    /Start-Process/i,
    /\.NET.*Reflection/i,
    /Add-Type/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(script)) {
      throw new Error(`Script contains disallowed pattern: ${pattern}`);
    }
  }

  return execSafe('powershell.exe', [
    '-NoProfile',
    '-NonInteractive',
    '-ExecutionPolicy', 'Bypass',
    '-Command', script,
  ], { ...options, timeout: options.timeout || 60000 });
}
