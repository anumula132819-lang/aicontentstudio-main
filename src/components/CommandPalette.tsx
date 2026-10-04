import React, { useState, useEffect } from 'react';
import {
  Command,
  Search,
  Sparkles,
  Layers,
  Repeat,
  Calendar,
  BookmarkCheck,
  Zap,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  X,
  ArrowRight,
} from 'lucide-react';
import { ActiveTab } from './Navbar';
import { SocialPlatform } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: ActiveTab) => void;
  onTriggerDemo: () => void;
  onToggleVoice: () => void;
  onToggleTheme: () => void;
  onTriggerPlatformVoice: (platform: SocialPlatform) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onTriggerDemo,
  onToggleVoice,
  onToggleTheme,
  onTriggerPlatformVoice,
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle palette
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'demo',
      title: 'Run 3-Minute Live Demo',
      desc: 'Pre-fills cybersecurity platform example across all channels',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      run: () => {
        onTriggerDemo();
        onClose();
      },
    },
    {
      id: 'create',
      title: 'Go to Create Studio',
      desc: 'Input context and generate platform assets',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      run: () => {
        onSelectTab('create');
        onClose();
      },
    },
    {
      id: 'variations',
      title: 'Open Variation Lab',
      desc: 'Compare Professional, Storytelling, Bold & Educational angles',
      icon: <Layers className="w-4 h-4 text-cyan-400" />,
      run: () => {
        onSelectTab('variations');
        onClose();
      },
    },
    {
      id: 'repurpose',
      title: 'Open Repurpose Engine',
      desc: 'Paste long text & extract 5 platform formats',
      icon: <Repeat className="w-4 h-4 text-pink-400" />,
      run: () => {
        onSelectTab('repurpose');
        onClose();
      },
    },
    {
      id: 'campaign',
      title: 'Campaign Mode Calendar',
      desc: 'Schedule and orchestrate your weekly post timeline',
      icon: <Calendar className="w-4 h-4 text-emerald-400" />,
      run: () => {
        onSelectTab('campaign');
        onClose();
      },
    },
    {
      id: 'library',
      title: 'Open Saved Library',
      desc: 'Access saved cards, snippets & JSON export',
      icon: <BookmarkCheck className="w-4 h-4 text-blue-400" />,
      run: () => {
        onSelectTab('library');
        onClose();
      },
    },
    {
      id: 'voice-ig',
      title: 'Hear Avatar Voice: Instagram',
      desc: 'Play a playful voice line for Instagram',
      icon: <Volume2 className="w-4 h-4 text-pink-400" />,
      run: () => {
        onTriggerPlatformVoice('instagram');
        onClose();
      },
    },
    {
      id: 'voice-li',
      title: 'Hear Avatar Voice: LinkedIn',
      desc: 'Play a professional voice line for LinkedIn',
      icon: <Volume2 className="w-4 h-4 text-blue-400" />,
      run: () => {
        onTriggerPlatformVoice('linkedin');
        onClose();
      },
    },
    {
      id: 'voice-gh',
      title: 'Hear Avatar Voice: GitHub',
      desc: 'Play a developer voice line for GitHub',
      icon: <Volume2 className="w-4 h-4 text-purple-400" />,
      run: () => {
        onTriggerPlatformVoice('github');
        onClose();
      },
    },
    {
      id: 'toggle-voice',
      title: 'Toggle Avatar Voice (Mute/Unmute)',
      desc: 'Turn speech synthesis on or off',
      icon: <VolumeX className="w-4 h-4 text-slate-400" />,
      run: () => {
        onToggleVoice();
        onClose();
      },
    },
    {
      id: 'toggle-theme',
      title: 'Toggle Theme (Dark / Light)',
      desc: 'Switch UI appearance',
      icon: <Sun className="w-4 h-4 text-amber-300" />,
      run: () => {
        onToggleTheme();
        onClose();
      },
    },
  ];

  const filtered = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl glass-panel border border-purple-500/30 shadow-2xl overflow-hidden text-slate-100">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-white/10 bg-slate-900/90">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, tool, or action..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={item.run}
                className="w-full p-2.5 rounded-xl hover:bg-purple-900/30 flex items-center justify-between transition text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-white/5 group-hover:border-purple-500/30 transition">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-purple-300 transition">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{item.desc}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition" />
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Navigate with arrows or click</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
