import React from 'react';
import {
  Sparkles,
  Layers,
  Repeat,
  Calendar,
  BookmarkCheck,
  Volume2,
  VolumeX,
  Command,
  Sun,
  Moon,
  Zap,
} from 'lucide-react';
import { VoiceSettings } from '../types';

export type ActiveTab = 'create' | 'variations' | 'repurpose' | 'campaign' | 'library';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onTriggerDemo: () => void;
  voiceSettings: VoiceSettings;
  onToggleVoice: () => void;
  onOpenVoiceSettings: () => void;
  onOpenCommandPalette: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  hasGeminiKey: boolean;
  onOpenCopilot?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onTriggerDemo,
  voiceSettings,
  onToggleVoice,
  onOpenVoiceSettings,
  onOpenCommandPalette,
  isDarkMode,
  onToggleTheme,
  hasGeminiKey,
  onOpenCopilot,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'create', label: 'Create', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'variations', label: 'Variation Lab', icon: <Layers className="w-4 h-4" /> },
    { id: 'repurpose', label: 'Repurpose', icon: <Repeat className="w-4 h-4" /> },
    { id: 'campaign', label: 'Campaign Mode', icon: <Calendar className="w-4 h-4" /> },
    { id: 'library', label: 'Saved Library', icon: <BookmarkCheck className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 glass-panel backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Tagline with Maya Avatar */}
        <div
          onClick={() => onSelectTab('create')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <img
              src="/copilot-avatar.jpg"
              alt="AI Content Studio"
              className="w-full h-full object-cover object-top rounded-[14px]"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-amber-200 via-rose-200 to-purple-200 bg-clip-text text-transparent">
                AI Content Studio
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PRO ✨
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden md:block">
              Create once. Adapt everywhere.
            </p>
          </div>
        </div>

        {/* Center Nav tabs */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-slate-950/80 border border-white/10 shadow-inner">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right action utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Maya Copilot Trigger in Navbar */}
          {onOpenCopilot && (
            <button
              onClick={onOpenCopilot}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-600/20 hover:from-amber-500/30 hover:to-purple-600/30 border border-amber-400/40 text-amber-200 text-xs font-semibold shadow-sm transition hover:scale-105 active:scale-95"
              title="Chat with Maya, Content Studio Copilot"
            >
              <div className="relative w-5 h-5 rounded-full overflow-hidden border border-amber-300 shrink-0">
                <img
                  src="/copilot-avatar.jpg"
                  alt="Maya Copilot"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <span className="hidden md:inline font-display text-amber-300">Ask Maya</span>
            </button>
          )}

          {/* Try Demo Button */}
          <button
            onClick={onTriggerDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold shadow-sm transition hover:scale-[1.02] active:scale-[0.98]"
            title="Auto-fill 3-minute sample presentation flow"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Try Demo</span>
          </button>

          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-purple-500/40 text-slate-400 hover:text-white text-xs transition"
            title="Open Command Palette (Ctrl+K)"
          >
            <Command className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">Command</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-slate-300 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Voice Settings & Toggle */}
          <div className="flex items-center rounded-xl bg-slate-900 border border-white/10 p-0.5">
            <button
              onClick={onToggleVoice}
              className={`p-1.5 rounded-lg transition ${
                voiceSettings.enabled
                  ? 'text-purple-400 hover:bg-purple-500/20'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
              title={voiceSettings.enabled ? 'Avatar voice is ON' : 'Avatar voice is MUTED'}
            >
              {voiceSettings.enabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onOpenVoiceSettings}
              className="px-1.5 text-[10px] text-slate-400 hover:text-white border-l border-white/10 transition"
              title="Voice pitch, rate & options"
            >
              Voice
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 transition"
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav strip */}
      <div className="lg:hidden flex items-center justify-around px-2 py-2 border-t border-white/5 bg-slate-950/80 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
