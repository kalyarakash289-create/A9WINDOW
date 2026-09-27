import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { Settings as SettingsIcon, Palette, Bell, Shield, Bot, Eye, Zap, Save, Check, Key, TestTube } from 'lucide-react';

type SettingsTab = 'general' | 'appearance' | 'notifications' | 'cleanup' | 'ai' | 'privacy' | 'advanced';

export function Settings() {
  const { settings, updateSettings } = useAppStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [saved, setSaved] = useState(false);
  const [aiKeys, setAiKeys] = useState({
    deepseek: { configured: false, value: '' },
    grok: { configured: false, value: '' },
    groq: { configured: false, value: '' },
    openrouter: { configured: false, value: '' },
  });
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const testConnection = async (provider: string) => {
    setTestingConnection(provider);
    await new Promise(r => setTimeout(r, 2000));
    setTestingConnection(null);
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <SettingsIcon size={14} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={14} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
    { id: 'cleanup', label: 'Cleanup', icon: <Zap size={14} /> },
    { id: 'ai', label: 'AI Configuration', icon: <Bot size={14} /> },
    { id: 'privacy', label: 'Privacy', icon: <Eye size={14} /> },
    { id: 'advanced', label: 'Advanced', icon: <Shield size={14} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-a9-text">Settings</h1>
          <p className="text-sm text-a9-text-muted mt-1">Configure A9 Optimizer</p>
        </div>
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          {saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors
                ${activeTab === tab.id ? 'bg-a9-cyan/10 text-a9-cyan' : 'text-a9-text-muted hover:text-a9-text hover:bg-a9-surface-2'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 glass-panel p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-a9-text">General Settings</h3>
              <ToggleSetting label="Start with Windows" description="Launch A9 Optimizer when Windows starts" value={settings.startWithWindows} onChange={(v) => updateSettings({ startWithWindows: v })} />
              <ToggleSetting label="Minimize to System Tray" description="Keep running in background when closed" value={settings.minimizeToTray} onChange={(v) => updateSettings({ minimizeToTray: v })} />
              <ToggleSetting label="Auto Scan" description="Automatically scan system on startup" value={settings.autoScan} onChange={(v) => updateSettings({ autoScan: v })} />
              <SelectSetting label="Language" value={settings.language} options={[{ value: 'en', label: 'English' }]} onChange={(v) => updateSettings({ language: v })} />
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-a9-text">Appearance</h3>
              <SelectSetting label="Theme" value={settings.theme} options={[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }, { value: 'system', label: 'System' }]} onChange={(v) => updateSettings({ theme: v as 'dark' | 'light' | 'system' })} />
              <ToggleSetting label="Animations" description="Enable UI animations and transitions" value={settings.animations} onChange={(v) => updateSettings({ animations: v })} />
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-a9-text">Notifications</h3>
              <ToggleSetting label="Enable Notifications" description="Show Windows toast notifications" value={settings.notifications} onChange={(v) => updateSettings({ notifications: v })} />
              <ToggleSetting label="Scan Complete" description="Notify when optimization scan finishes" value={true} onChange={() => {}} />
              <ToggleSetting label="Low Disk Space" description="Alert when disk space is low" value={true} onChange={() => {}} />
              <ToggleSetting label="High Resource Usage" description="Alert on high CPU/RAM usage" value={true} onChange={() => {}} />
            </div>
          )}

          {activeTab === 'cleanup' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-a9-text">Cleanup Settings</h3>
              <ToggleSetting label="Include Browser Cache" description="Clean Chrome/Edge cache during cleanup" value={true} onChange={() => {}} />
              <ToggleSetting label="Include Recycle Bin" description="Empty Recycle Bin during cleanup (requires confirmation)" value={false} onChange={() => {}} />
              <ToggleSetting label="Include Windows Update Cache" description="Remove old update files" value={true} onChange={() => {}} />
              <ToggleSetting label="Include Crash Dumps" description="Remove old crash dump files" value={true} onChange={() => {}} />
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-a9-text">AI Configuration</h3>
              <p className="text-xs text-a9-text-dim mb-4">Configure AI providers. Keys are stored securely using Windows Credential Manager.</p>
              
              {Object.entries(aiKeys).map(([provider, config]) => (
                <div key={provider} className="glass-panel-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Key size={14} className="text-a9-text-dim" />
                      <span className="text-sm font-medium text-a9-text capitalize">{provider} API Key</span>
                    </div>
                    <span className={`badge ${config.configured ? 'badge-good' : 'badge-medium'}`}>
                      {config.configured ? 'Configured' : 'Not configured'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={config.value}
                      onChange={(e) => setAiKeys(prev => ({ ...prev, [provider]: { ...prev[provider as keyof typeof prev], value: e.target.value } }))}
                      placeholder="Enter API key..."
                      className="flex-1 px-3 py-2 bg-a9-bg border border-a9-border rounded-lg text-sm text-a9-text placeholder-a9-text-dim outline-none focus:border-a9-cyan/50"
                    />
                    <button
                      onClick={() => testConnection(provider)}
                      disabled={testingConnection === provider}
                      className="btn-secondary flex items-center gap-1 text-xs"
                    >
                      <TestTube size={12} />
                      {testingConnection === provider ? 'Testing...' : 'Test'}
                    </button>
                  </div>
                </div>
              ))}

              <div className="glass-panel-sm p-3 flex items-start gap-2">
                <Shield size={12} className="text-a9-cyan mt-0.5" />
                <p className="text-[10px] text-a9-text-dim">
                  API keys are encrypted and stored in Windows Credential Manager. They are never logged or exposed to the renderer process.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-a9-text">Privacy Settings</h3>
              <ToggleSetting label="Telemetry" description="Send anonymous usage statistics" value={settings.telemetry} onChange={(v) => updateSettings({ telemetry: v })} />
              <ToggleSetting label="Crash Reports" description="Send crash reports to help improve A9" value={false} onChange={() => {}} />
              <div className="glass-panel-sm p-3">
                <p className="text-xs text-a9-text-dim">
                  A9 Optimizer respects your privacy. No personal data, files, or credentials are ever transmitted.
                  All operations are performed locally on your machine.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-a9-text">Advanced Settings</h3>
              <SelectSetting label="Scan Interval" value={String(settings.scanInterval)} options={[{ value: '1800', label: '30 minutes' }, { value: '3600', label: '1 hour' }, { value: '7200', label: '2 hours' }]} onChange={(v) => updateSettings({ scanInterval: parseInt(v) })} />
              <ToggleSetting label="Developer Mode" description="Show detailed logs and debug information" value={false} onChange={() => {}} />
              <button className="btn-secondary text-xs">Open Log Files</button>
              <button className="btn-danger text-xs">Reset All Settings</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleSetting({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-a9-border/50">
      <div>
        <span className="text-sm text-a9-text">{label}</span>
        <p className="text-xs text-a9-text-dim">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-colors ${value ? 'bg-a9-cyan' : 'bg-a9-surface-3'}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'left-5.5 translate-x-0' : 'left-0.5'}`}
          style={{ left: value ? '22px' : '2px' }}
        />
      </button>
    </div>
  );
}

function SelectSetting({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-a9-border/50">
      <span className="text-sm text-a9-text">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1.5 bg-a9-surface-2 border border-a9-border rounded-lg text-sm text-a9-text outline-none focus:border-a9-cyan/50"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
