import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../lib/store';
import type { PageId } from '../types';
import { Search } from 'lucide-react';

const commands: { id: PageId; label: string; description: string }[] = [
  { id: 'dashboard', label: 'Dashboard', description: 'System overview and monitoring' },
  { id: 'optimizer', label: 'Optimizer', description: 'Scan and optimize your system' },
  { id: 'performance', label: 'Performance', description: 'Real-time performance charts' },
  { id: 'processes', label: 'Processes', description: 'View and manage running processes' },
  { id: 'startup', label: 'Startup', description: 'Manage startup applications' },
  { id: 'storage', label: 'Storage', description: 'Analyze disk usage' },
  { id: 'cleanup', label: 'Cleanup', description: 'Clean temporary files and caches' },
  { id: 'privacy', label: 'Privacy', description: 'Privacy and security tools' },
  { id: 'network', label: 'Network', description: 'Network diagnostics and tools' },
  { id: 'hardware', label: 'Hardware', description: 'System hardware information' },
  { id: 'drivers', label: 'Drivers', description: 'View installed drivers' },
  { id: 'tools', label: 'Windows Tools', description: 'Quick access to Windows utilities' },
  { id: 'ai', label: 'AI Assistant', description: 'Get AI-powered help for your PC' },
  { id: 'reports', label: 'Reports', description: 'System reports and history' },
  { id: 'settings', label: 'Settings', description: 'Application settings' },
  { id: 'about', label: 'About', description: 'About A9 Optimizer' },
];

export function CommandPalette() {
  const { setCurrentPage, setCommandPaletteOpen } = useAppStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      setCurrentPage(filtered[selectedIndex].id);
      setCommandPaletteOpen(false);
    }
  };

  const handleSelect = (id: PageId) => {
    setCurrentPage(id);
    setCommandPaletteOpen(false);
  };

  return (
    <div className="command-overlay" onClick={() => setCommandPaletteOpen(false)}>
      <div className="command-palette" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-a9-border">
          <Search size={16} className="text-a9-text-dim" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, tools, settings..."
            className="flex-1 bg-transparent text-sm text-a9-text placeholder-a9-text-dim outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] bg-a9-surface-3 rounded border border-a9-border text-a9-text-dim">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-a9-text-dim">
              No results found
            </div>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.id}
                onClick={() => handleSelect(cmd.id)}
                className={`flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors
                  ${i === selectedIndex ? 'bg-a9-surface-2 text-a9-text' : 'text-a9-text-muted hover:bg-a9-surface-2/50'}`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{cmd.label}</span>
                  <span className="text-xs text-a9-text-dim">{cmd.description}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
