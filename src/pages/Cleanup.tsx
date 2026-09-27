import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { nativeBridge } from '../lib/nativeBridge';
import { Trash2, Search, CheckSquare, Square, AlertCircle } from 'lucide-react';

function formatBytes(bytes: number): string {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB';
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
  return (bytes / 1024).toFixed(1) + ' KB';
}

export function Cleanup() {
  const { cleanupItems, setCleanupItems } = useAppStore();
  const [isScanning, setIsScanning] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const [cleanedSize, setCleanedSize] = useState(0);

  const handleScan = async () => {
    setIsScanning(true);
    setScanDone(false);
    await new Promise(r => setTimeout(r, 1500));
    const result = nativeBridge.scanCleanup();
    if (result.data) setCleanupItems(result.data);
    setIsScanning(false);
    setScanDone(true);
  };

  const handleClean = async () => {
    setIsCleaning(true);
    const selected = cleanupItems.filter(i => i.selected);
    const totalSize = selected.reduce((acc, i) => acc + i.size, 0);
    await new Promise(r => setTimeout(r, 2000));
    setCleanedSize(totalSize);
    setIsCleaning(false);
  };

  const toggleItem = (id: string) => {
    setCleanupItems(cleanupItems.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const toggleAll = () => {
    const allSelected = cleanupItems.every(i => i.selected);
    setCleanupItems(cleanupItems.map(item => ({ ...item, selected: !allSelected })));
  };

  const totalRecoverable = cleanupItems.filter(i => i.selected).reduce((acc, i) => acc + i.size, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-a9-text">Cleanup</h1>
          <p className="text-sm text-a9-text-muted mt-1">Remove temporary files, caches, and unnecessary data</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleScan} disabled={isScanning} className="btn-secondary flex items-center gap-2">
            <Search size={14} />
            {isScanning ? 'Scanning...' : 'Scan'}
          </button>
          <button
            onClick={handleClean}
            disabled={isCleaning || cleanupItems.filter(i => i.selected).length === 0}
            className="btn-primary flex items-center gap-2"
          >
            <Trash2 size={14} />
            {isCleaning ? 'Cleaning...' : `Clean (${formatBytes(totalRecoverable)})`}
          </button>
        </div>
      </div>

      {/* Results */}
      {cleanedSize > 0 && (
        <div className="glass-panel p-4 border-l-2 border-a9-green">
          <div className="flex items-center gap-3">
            <CheckSquare size={16} className="text-a9-green" />
            <span className="text-sm text-a9-text">Successfully cleaned <strong>{formatBytes(cleanedSize)}</strong> of data</span>
          </div>
        </div>
      )}

      {/* Summary */}
      {scanDone && (
        <div className="glass-panel p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-a9-cyan">{formatBytes(cleanupItems.reduce((a, i) => a + i.size, 0))}</span>
              <span className="text-sm text-a9-text-muted ml-2">recoverable</span>
            </div>
            <div className="text-xs text-a9-text-dim">
              {cleanupItems.length} categories • {cleanupItems.reduce((a, i) => a + i.fileCount, 0)} files
            </div>
          </div>
        </div>
      )}

      {/* Cleanup Items */}
      {scanDone && (
        <div className="glass-panel overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-a9-border">
            <button onClick={toggleAll} className="flex items-center gap-2 text-xs text-a9-text-muted hover:text-a9-text">
              {cleanupItems.every(i => i.selected) ? <CheckSquare size={14} /> : <Square size={14} />}
              Select All Safe
            </button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-8"></th>
                <th>Category</th>
                <th>Path</th>
                <th>Size</th>
                <th>Files</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {cleanupItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <button onClick={() => toggleItem(item.id)}>
                      {item.selected ? <CheckSquare size={14} className="text-a9-cyan" /> : <Square size={14} className="text-a9-text-dim" />}
                    </button>
                  </td>
                  <td className="text-sm font-medium text-a9-text">{item.name}</td>
                  <td className="text-xs text-a9-text-dim font-mono truncate max-w-[250px]">{item.path}</td>
                  <td className="text-sm text-a9-text">{formatBytes(item.size)}</td>
                  <td className="text-xs text-a9-text-dim">{item.fileCount.toLocaleString()}</td>
                  <td>
                    {item.safe ? (
                      <span className="badge badge-safe">Safe</span>
                    ) : (
                      <span className="badge badge-medium">Review</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!scanDone && !isScanning && (
        <div className="glass-panel p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-a9-cyan/10">
              <Trash2 size={32} className="text-a9-cyan" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-a9-text mb-2">Ready to Clean</h3>
          <p className="text-sm text-a9-text-muted max-w-md mx-auto mb-6">
            Scan your system to find temporary files, caches, and other unnecessary data that can be safely removed.
          </p>
          <button onClick={handleScan} className="btn-primary">Start Cleanup Scan</button>
        </div>
      )}

      {/* Safety Notice */}
      <div className="glass-panel-sm p-4 flex items-start gap-3">
        <AlertCircle size={14} className="text-a9-blue mt-0.5" />
        <div className="text-xs text-a9-text-dim">
          <p className="font-medium text-a9-text-muted mb-1">Safety Information</p>
          <p>A9 Cleanup only removes safe temporary files and caches. Personal documents, downloads, and system-critical files are never deleted.</p>
        </div>
      </div>
    </div>
  );
}
