import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { Wifi, Globe, RefreshCw, AlertTriangle, Terminal } from 'lucide-react';

export function Network() {
  const { networkInfo } = useAppStore();
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runCommand = async (cmd: string, output: string[]) => {
    setIsRunning(true);
    setTerminalOutput(prev => [...prev, `> ${cmd}`, '']);
    await new Promise(r => setTimeout(r, 800));
    setTerminalOutput(prev => [...prev, ...output, '']);
    setIsRunning(false);
  };

  const handlePing = () => runCommand('ping 8.8.8.8', [
    'Pinging 8.8.8.8 with 32 bytes of data:',
    'Reply from 8.8.8.8: bytes=32 time=12ms TTL=117',
    'Reply from 8.8.8.8: bytes=32 time=11ms TTL=117',
    'Reply from 8.8.8.8: bytes=32 time=13ms TTL=117',
    'Reply from 8.8.8.8: bytes=32 time=11ms TTL=117',
    '',
    'Ping statistics for 8.8.8.8:',
    '    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)',
    'Approximate round trip times in milli-seconds:',
    '    Minimum = 11ms, Maximum = 13ms, Average = 11ms',
  ]);

  const handleFlushDns = () => runCommand('ipconfig /flushdns', [
    'Windows IP Configuration',
    '',
    'Successfully flushed the DNS Resolver Cache.',
  ]);

  const handleIpConfig = () => runCommand('ipconfig /all', [
    'Windows IP Configuration',
    '',
    '   Host Name . . . . . . . . . . . . : DESKTOP-A9OPT',
    '   Primary Dns Suffix  . . . . . . . :',
    '   Node Type . . . . . . . . . . . . : Hybrid',
    '',
    'Wireless LAN adapter Wi-Fi:',
    '   Connection-specific DNS Suffix  . : home',
    '   Description . . . . . . . . . . . : Intel(R) Wi-Fi 6E AX211 160MHz',
    '   Physical Address. . . . . . . . . : A4-C3-F0-XX-XX-XX',
    '   DHCP Enabled. . . . . . . . . . . : Yes',
    '   IPv4 Address. . . . . . . . . . . : 192.168.1.105',
    '   Subnet Mask . . . . . . . . . . . : 255.255.255.0',
    '   Default Gateway . . . . . . . . . : 192.168.1.1',
    '   DNS Servers . . . . . . . . . . . : 8.8.8.8',
    '                                       8.8.4.4',
  ]);

  const handleNsLookup = () => runCommand('nslookup google.com', [
    'Server:  dns.google',
    'Address:  8.8.8.8',
    '',
    'Non-authoritative answer:',
    'Name:    google.com',
    'Addresses:  142.250.80.46',
    '          2607:f8b0:4004:800::200e',
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-a9-text">Network Tools</h1>
          <p className="text-sm text-a9-text-muted mt-1">Network diagnostics and configuration</p>
        </div>
      </div>

      {/* Network Status */}
      {networkInfo.map((net) => (
        <div key={net.adapter} className="glass-panel p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-a9-cyan/10">
              <Wifi size={18} className="text-a9-cyan" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-a9-text">{net.adapter}</h3>
              <span className="text-xs text-a9-green">{net.status}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <span className="text-[10px] text-a9-text-dim block">IP Address</span>
              <span className="text-xs text-a9-text font-mono">{net.ip}</span>
            </div>
            <div>
              <span className="text-[10px] text-a9-text-dim block">Gateway</span>
              <span className="text-xs text-a9-text font-mono">{net.gateway}</span>
            </div>
            <div>
              <span className="text-[10px] text-a9-text-dim block">DNS</span>
              <span className="text-xs text-a9-text font-mono">{net.dns}</span>
            </div>
            <div>
              <span className="text-[10px] text-a9-text-dim block">Link Speed</span>
              <span className="text-xs text-a9-text">{net.linkSpeed} Mbps</span>
            </div>
            <div>
              <span className="text-[10px] text-a9-text-dim block">Throughput</span>
              <span className="text-xs text-a9-text">↓{(net.download / 1000).toFixed(1)} ↑{(net.upload / 1000).toFixed(1)} MB/s</span>
            </div>
          </div>
        </div>
      ))}

      {/* Tools */}
      <div className="glass-panel p-5">
        <h3 className="text-sm font-semibold text-a9-text mb-4">Diagnostic Tools</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button onClick={handlePing} disabled={isRunning} className="btn-secondary flex items-center justify-center gap-2">
            <Globe size={14} /> Ping Test
          </button>
          <button onClick={handleNsLookup} disabled={isRunning} className="btn-secondary flex items-center justify-center gap-2">
            <Globe size={14} /> DNS Lookup
          </button>
          <button onClick={handleFlushDns} disabled={isRunning} className="btn-secondary flex items-center justify-center gap-2">
            <RefreshCw size={14} /> Flush DNS
          </button>
          <button onClick={handleIpConfig} disabled={isRunning} className="btn-secondary flex items-center justify-center gap-2">
            <Terminal size={14} /> IP Config
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="glass-panel p-4">
        <div className="flex items-center gap-2 mb-3">
          <Terminal size={14} className="text-a9-cyan" />
          <span className="text-sm font-semibold text-a9-text">Output</span>
        </div>
        <div className="bg-a9-bg rounded-lg p-4 font-mono text-xs space-y-0.5 h-64 overflow-y-auto">
          {terminalOutput.length === 0 ? (
            <span className="text-a9-text-dim">Run a diagnostic command to see output here...</span>
          ) : (
            terminalOutput.map((line, i) => (
              <div key={i} className={line.startsWith('>') ? 'text-a9-cyan' : 'text-a9-text-muted'}>{line || '\u00A0'}</div>
            ))
          )}
          {isRunning && <div className="text-a9-cyan animate-pulse">▊</div>}
        </div>
      </div>

      {/* Warning */}
      <div className="glass-panel-sm p-4 flex items-start gap-3">
        <AlertTriangle size={14} className="text-a9-yellow mt-0.5" />
        <div className="text-xs text-a9-text-dim">
          <p>Destructive operations (Winsock reset, IP release) require administrator privileges and explicit confirmation.</p>
          <p className="mt-1">Network diagnostics are read-only and safe to run at any time.</p>
        </div>
      </div>
    </div>
  );
}
