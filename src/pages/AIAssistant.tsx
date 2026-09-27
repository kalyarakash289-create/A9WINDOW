import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../lib/store';
import { Bot, Send, AlertTriangle, Shield, Zap } from 'lucide-react';

const suggestedQuestions = [
  "Why is my PC running slow?",
  "What is using my RAM?",
  "Which startup items should I disable?",
  "How can I free up disk space?",
  "Is my system healthy?",
];

export function AIAssistant() {
  const { aiMessages, addAiMessage } = useAppStore();
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showPermission, setShowPermission] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  const handleSend = (question?: string) => {
    const q = question || input.trim();
    if (!q) return;

    setPendingQuestion(q);
    setShowPermission(true);
  };

  const handlePermissionGranted = () => {
    setShowPermission(false);
    const q = pendingQuestion;
    setInput('');

    addAiMessage({
      id: Date.now().toString(),
      role: 'user',
      content: q,
      timestamp: Date.now(),
    });

    setIsThinking(true);

    setTimeout(() => {
      const response = generateResponse(q);
      addAiMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: Date.now(),
        actions: response.actions,
      });
      setIsThinking(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-a9-text">AI Assistant</h1>
          <p className="text-sm text-a9-text-muted mt-1">Get intelligent help for your PC</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-a9-surface-2 border border-a9-border">
          <Shield size={12} className="text-a9-green" />
          <span className="text-xs text-a9-text-dim">Privacy Protected</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {aiMessages.length === 0 && (
          <div className="glass-panel p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-gradient-to-br from-a9-cyan/10 to-a9-violet/10">
                <Bot size={32} className="text-a9-cyan" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-a9-text mb-2">A9 AI Assistant</h3>
            <p className="text-sm text-a9-text-muted max-w-md mx-auto mb-6">
              Ask questions about your PC performance, get optimization suggestions, or troubleshoot issues.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="px-3 py-2 rounded-lg bg-a9-surface-2 border border-a9-border text-xs text-a9-text-muted hover:text-a9-text hover:border-a9-cyan/30 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {aiMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-a9-cyan/20 to-a9-blue/20 border border-a9-cyan/20'
                : 'glass-panel'
            }`}>
              <p className="text-sm text-a9-text whitespace-pre-wrap">{msg.content}</p>
              {msg.actions && msg.actions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-a9-border space-y-2">
                  {msg.actions.map((action) => (
                    <button
                      key={action.id}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-a9-surface-2 border border-a9-border text-xs text-a9-text-muted hover:text-a9-cyan hover:border-a9-cyan/30 transition-colors"
                    >
                      <Zap size={12} />
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start">
            <div className="glass-panel px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-a9-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-a9-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-a9-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-a9-text-dim">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="glass-panel p-3">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your PC..."
            className="flex-1 bg-transparent text-sm text-a9-text placeholder-a9-text-dim outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isThinking}
            className="p-2 rounded-lg bg-a9-cyan/20 text-a9-cyan hover:bg-a9-cyan/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Permission Dialog */}
      {showPermission && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-panel p-6 w-[420px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-a9-cyan/10">
                <Shield size={20} className="text-a9-cyan" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-a9-text">Telemetry Permission</h3>
                <p className="text-xs text-a9-text-muted">AI needs system context to help you</p>
              </div>
            </div>
            <p className="text-sm text-a9-text-muted mb-4">
              Allow A9 AI to use selected system information (CPU usage, memory, running processes) to answer your question?
            </p>
            <div className="glass-panel-sm p-3 mb-4">
              <p className="text-xs text-a9-text-dim">
                ✓ CPU, RAM, GPU usage<br />
                ✓ Running process names<br />
                ✓ Startup items<br />
                ✗ No passwords, API keys, or personal files
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowPermission(false)} className="btn-secondary">Cancel</button>
              <button onClick={handlePermissionGranted} className="btn-primary">Allow Once</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function generateResponse(question: string): { content: string; actions: { id: string; actionId: string; label: string; description: string; approved: boolean }[] } {
  const q = question.toLowerCase();
  
  if (q.includes('slow') || q.includes('performance')) {
    return {
      content: "Based on your system analysis, I've identified several factors that may be affecting performance:\n\n• **High startup load**: 5 applications are configured to start with Windows\n• **Memory pressure**: 61% RAM usage with multiple background applications\n• **Temporary files**: 8.2 GB of temp files can be cleaned\n\nI recommend starting with a system cleanup and reviewing startup items.",
      actions: [
        { id: '1', actionId: 'CLEAR_TEMP', label: 'Run Cleanup', description: 'Remove 8.2 GB of temporary files', approved: false },
        { id: '2', actionId: 'MANAGE_STARTUP', label: 'Review Startup Items', description: 'Check 5 startup applications', approved: false },
      ],
    };
  }
  
  if (q.includes('ram') || q.includes('memory')) {
    return {
      content: "Your memory usage breakdown:\n\n• **Chrome** (3 tabs): ~27.2 GB combined\n• **VS Code**: 9.1 GB\n• **Discord**: 5.4 GB\n• **Spotify**: 4.2 GB\n• **System processes**: ~8 GB\n\nTotal: ~54 GB of 32 GB (with page file usage)\n\nConsider closing unused Chrome tabs or disabling auto-start for Spotify and Discord.",
      actions: [
        { id: '1', actionId: 'REVIEW_PROCESSES', label: 'View Process Details', description: 'See full memory breakdown', approved: false },
      ],
    };
  }
  
  if (q.includes('startup')) {
    return {
      content: "Here are your startup items ranked by impact:\n\n🔴 **High Impact**:\n• Steam Client - Launches game client on boot\n• Adobe Creative Cloud - Background updater\n\n🟡 **Medium Impact**:\n• Discord - Chat application\n• Spotify - Music streaming\n• NVIDIA Container - GPU utilities\n\n🟢 **Low Impact** (keep enabled):\n• OneDrive - Cloud sync\n• Windows Security - Protection\n• Realtek Audio - Sound driver\n\nI recommend disabling Steam and Adobe Creative Cloud from startup if you don't need them immediately on boot.",
      actions: [
        { id: '1', actionId: 'MANAGE_STARTUP', label: 'Open Startup Manager', description: 'Review and manage startup items', approved: false },
      ],
    };
  }
  
  if (q.includes('disk') || q.includes('space') || q.includes('storage')) {
    return {
      content: "Your C: drive has 170.8 GB free (67% used). Here's what's taking space:\n\n• **Recoverable temporary files**: 8.2 GB\n• **Recycle Bin**: 3.0 GB\n• **Browser cache**: 1.5 GB\n• **Windows Update cache**: 512 MB\n\nTotal recoverable: ~13.2 GB\n\nYour D: drive has 818 GB free (60% used) which is healthy.",
      actions: [
        { id: '1', actionId: 'CLEAR_TEMP', label: 'Clean Temporary Files', description: 'Recover 8.2 GB', approved: false },
        { id: '2', actionId: 'EMPTY_RECYCLE_BIN', label: 'Empty Recycle Bin', description: 'Recover 3.0 GB', approved: false },
      ],
    };
  }
  
  return {
    content: "I've analyzed your system and here's a general overview:\n\n• **Health Score**: 72/100 (Needs attention)\n• **CPU**: Normal usage at 23%\n• **Memory**: 61% used - moderate pressure\n• **Storage**: 67% C: drive used\n• **Startup**: 5 items, some high-impact\n• **Network**: Stable connection\n\nWould you like me to help with a specific area? I can help with cleanup, startup optimization, or performance troubleshooting.",
    actions: [
      { id: '1', actionId: 'SCAN_SYSTEM', label: 'Run Full Scan', description: 'Detailed system analysis', approved: false },
    ],
  };
}
