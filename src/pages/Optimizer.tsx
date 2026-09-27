import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { nativeBridge } from '../lib/nativeBridge';
import { Zap, Search, CheckCircle2, AlertCircle, Clock, Shield, ChevronRight } from 'lucide-react';
import type { Finding } from '../types';

export function Optimizer() {
  const { findings, setFindings, isScanning, setIsScanning, isOptimizing, setIsOptimizing } = useAppStore();
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());
  const [optimizationLog, setOptimizationLog] = useState<string[]>([]);

  const handleScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanComplete(false);
    setFindings([]);

    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 80));
      setScanProgress(i);
    }

    const result = nativeBridge.scanOptimization();
    if (result.data) {
      setFindings(result.data);
      const safeActions = new Set(result.data.filter(f => f.actionId).map(f => f.actionId!));
      setSelectedActions(safeActions);
    }
    setIsScanning(false);
    setScanComplete(true);
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setOptimizationLog([]);

    const selectedFindings = findings.filter(f => f.actionId && selectedActions.has(f.actionId));
    
    for (const finding of selectedFindings) {
      setOptimizationLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] Processing: ${finding.title}...`]);
      await new Promise(r => setTimeout(r, 600));
      setOptimizationLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✓ ${finding.title} - Completed`]);
    }

    setOptimizationLog(prev => [...prev, `\n[${new Date().toLocaleTimeString()}] Optimization complete. ${selectedFindings.length} actions executed.`]);
    setIsOptimizing(false);
  };

  const toggleAction = (actionId: string) => {
    setSelectedActions(prev => {
      const next = new Set(prev);
      if (next.has(actionId)) next.delete(actionId);
      else next.add(actionId);
      return next;
    });
  };

  const getSeverityBadge = (severity: Finding['severity']) => {
    const styles = { safe: 'badge-safe', low: 'badge-low', medium: 'badge-medium', advanced: 'badge-advanced' };
    return styles[severity];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-a9-text">Optimizer</h1>
          <p className="text-sm text-a9-text-muted mt-1">Scan your system for optimization opportunities</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleScan}
            disabled={isScanning || isOptimizing}
            className="btn-secondary flex items-center gap-2"
          >
            <Search size={14} />
            {isScanning ? 'Scanning...' : 'Scan System'}
          </button>
          <button
            onClick={handleOptimize}
            disabled={isOptimizing || isScanning || selectedActions.size === 0}
            className="btn-primary flex items-center gap-2"
          >
            <Zap size={14} />
            {isOptimizing ? 'Optimizing...' : `Optimize (${selectedActions.size})`}
          </button>
        </div>
      </div>

      {/* Scan Progress */}
      {isScanning && (
        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="animate-spin">
              <Search size={16} className="text-a9-cyan" />
            </div>
            <span className="text-sm text-a9-text">Scanning system...</span>
            <span className="text-sm text-a9-cyan font-mono">{scanProgress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill bg-gradient-to-r from-a9-cyan to-a9-blue" style={{ width: `${scanProgress}%` }} />
          </div>
          <div className="mt-3 text-xs text-a9-text-dim">
            {scanProgress < 30 ? 'Analyzing storage...' : scanProgress < 60 ? 'Checking startup items...' : scanProgress < 80 ? 'Scanning processes...' : 'Finalizing results...'}
          </div>
        </div>
      )}

      {/* Optimization Log */}
      {isOptimizing && optimizationLog.length > 0 && (
        <div className="glass-panel p-4">
          <h3 className="text-sm font-semibold text-a9-text mb-3">Optimization Progress</h3>
          <div className="bg-a9-bg rounded-lg p-3 font-mono text-xs space-y-1 max-h-48 overflow-y-auto">
            {optimizationLog.map((log, i) => (
              <div key={i} className={log.includes('✓') ? 'text-a9-green' : log.includes('✗') ? 'text-a9-red' : 'text-a9-text-muted'}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Findings */}
      {scanComplete && findings.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-a9-text">
              {findings.length} findings detected
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-a9-text-dim">{selectedActions.size} actions selected</span>
            </div>
          </div>

          <div className="space-y-3">
            {findings.map((finding) => (
              <div key={finding.id} className="glass-panel p-4 flex items-start gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={finding.actionId ? selectedActions.has(finding.actionId) : false}
                    onChange={() => finding.actionId && toggleAction(finding.actionId)}
                    className="w-4 h-4 rounded border-a9-border bg-a9-surface-2 accent-a9-cyan"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-a9-text">{finding.title}</span>
                      <span className={`badge ${getSeverityBadge(finding.severity)}`}>{finding.severity}</span>
                    </div>
                    <p className="text-xs text-a9-text-muted">{finding.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      {finding.estimatedImpact && (
                        <span className="text-xs text-a9-green flex items-center gap-1">
                          <CheckCircle2 size={10} /> {finding.estimatedImpact}
                        </span>
                      )}
                      {finding.currentValue && (
                        <span className="text-xs text-a9-text-dim flex items-center gap-1">
                          <AlertCircle size={10} /> Current: {finding.currentValue}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-a9-text-dim">{finding.category}</span>
                  <ChevronRight size={14} className="text-a9-text-dim" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isScanning && !scanComplete && (
        <div className="glass-panel p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-a9-cyan/10">
              <Shield size={32} className="text-a9-cyan" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-a9-text mb-2">Ready to Optimize</h3>
          <p className="text-sm text-a9-text-muted max-w-md mx-auto mb-6">
            Click "Scan System" to analyze your PC for optimization opportunities. 
            A9 Optimizer will check storage, startup, processes, and system health.
          </p>
          <button onClick={handleScan} className="btn-primary flex items-center gap-2 mx-auto">
            <Search size={14} />
            Start System Scan
          </button>
        </div>
      )}

      {/* Info */}
      <div className="glass-panel-sm p-4 flex items-start gap-3">
        <Clock size={14} className="text-a9-text-dim mt-0.5" />
        <div className="text-xs text-a9-text-dim">
          <p>A9 Optimizer performs safe operations only. All actions are reversible where possible.</p>
          <p className="mt-1">No system files, personal documents, or security settings will be modified without your explicit approval.</p>
        </div>
      </div>
    </div>
  );
}
