import React, { useState } from 'react';
import {
  Copy,
  Check,
  Bookmark,
  Edit3,
  Download,
  Star,
  GitFork,
  Terminal,
  Sparkles,
  Github,
  BookOpen,
  Eye,
  FileText,
  Clock,
  Code2,
} from 'lucide-react';
import { GitHubContent } from '../../types';

interface GitHubCardProps {
  content: GitHubContent;
  onUpdate: (updated: GitHubContent) => void;
  onSaveToLibrary: () => void;
  onRefine: (action: string) => void;
  onTriggerAvatar: () => void;
}

export const GitHubCard: React.FC<GitHubCardProps> = ({
  content,
  onUpdate,
  onSaveToLibrary,
  onRefine,
  onTriggerAvatar,
}) => {
  // Default to 'matter' (Content matter & how to post) first!
  const [activeView, setActiveView] = useState<'matter' | 'demo'>('matter');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copiedClone, setCopiedClone] = useState(false);

  const [title, setTitle] = useState(content.title);
  const [tagline, setTagline] = useState(content.tagline);
  const [description, setDescription] = useState(content.description);
  const [tags, setTags] = useState(content.tags.join(' '));
  const [callToAction, setCallToAction] = useState(content.callToAction);

  const handleCopy = () => {
    const fullMarkdown = `# ${content.title}\n> ${content.tagline}\n\n${content.description}\n\n---\n${content.callToAction}`;
    navigator.clipboard.writeText(fullMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveToLibrary();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleApplyEdit = () => {
    onUpdate({
      title,
      tagline,
      description,
      tags: tags.split(' ').filter(Boolean),
      callToAction,
    });
    setIsEditing(false);
  };

  const handleExport = () => {
    const fullMarkdown = `# ${content.title}\n> ${content.tagline}\n\n${content.description}\n\n---\n${content.callToAction}`;
    const blob = new Blob([fullMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
  };

  const handleCopyClone = () => {
    navigator.clipboard.writeText(`git clone https://github.com/ai-content-studio/release.git`);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <div className="rounded-3xl glass-panel border border-purple-500/25 shadow-2xl overflow-hidden text-slate-100 flex flex-col justify-between">
      {/* Top Card Bar */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-slate-900/70">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onTriggerAvatar}>
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white shadow">
            <Github className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-sm">
              <span className="text-purple-400 font-display">GitHub Release</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
                README &amp; Announcement
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Click icon to hear Maya's voice reaction</div>
          </div>
        </div>

        {/* View Mode Toggle: What & How to Post vs Live Account Demo */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-white/10">
          <button
            onClick={() => setActiveView('matter')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeView === 'matter'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>What &amp; How to Post</span>
          </button>

          <button
            onClick={() => setActiveView('demo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeView === 'demo'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Account Demo</span>
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition text-xs flex items-center gap-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isEditing ? 'Cancel' : 'Edit'}</span>
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition text-xs flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleSave}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition text-xs flex items-center gap-1"
          >
            {saved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
          </button>
          <button
            onClick={handleExport}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-6 space-y-4">
        {isEditing ? (
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-purple-400 uppercase">Repository Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-purple-400 uppercase">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-purple-400 uppercase">Markdown Body</label>
              <textarea
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-purple-400 uppercase">Tags / Topics</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-white/10 text-white"
              />
            </div>
            <button
              onClick={handleApplyEdit}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition"
            >
              Save Changes
            </button>
          </div>
        ) : activeView === 'matter' ? (
          /* STAGE 1: What & How to Post on GitHub */
          <div className="space-y-5 text-left animate-fade-in">
            {/* 1. HOW TO POST: Strategy & Timing Blueprint */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-slate-950 border border-purple-500/30 space-y-3 shadow-lg shadow-purple-950/20">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>🚀 HOW TO POST ON GITHUB • DEVELOPER PLAYBOOK</span>
                </span>
                <span className="text-[11px] text-purple-200 font-mono flex items-center gap-1 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  <Terminal className="w-3 h-3 text-purple-400" />
                  <span>Timing: Tuesday &amp; Wednesday 9:00 AM PST</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] pt-1">
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                  <strong className="text-purple-400 block mb-0.5">1. 30-Second Quickstart</strong>
                  <span className="text-slate-300">
                    Provide a copy-pasteable 1-line curl or npm command at the very top.
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                  <strong className="text-cyan-400 block mb-0.5">2. Architecture Bullet Points</strong>
                  <span className="text-slate-300">
                    Engineers respect benchmarks, sub-2ms latency claims, and zero-telemetry commitments.
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                  <strong className="text-emerald-400 block mb-0.5">3. Clear Open-Source CTA</strong>
                  <span className="text-slate-300">
                    Ask for star ⭐, issue submissions, or pull requests rather than sales pitches.
                  </span>
                </div>
              </div>
            </div>

            {/* 2. WHAT TO POST: Deliverables & README Content */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#FFF8FC] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#A855F7]" />
                  <span>Platform-Adapted Structure • GitHub</span>
                </span>
                <span className="text-[10px] text-[#A855F7] bg-[#A855F7]/10 px-2 py-0.5 rounded border border-[#A855F7]/30 font-mono">
                  Developer Docs
                </span>
              </div>

              {/* Technical Summary */}
              <div className="p-3.5 rounded-xl bg-[#160D20] border border-[#3A2347]">
                <div className="text-[10px] font-bold text-[#A855F7] uppercase tracking-wider mb-1">
                  Technical Summary
                </div>
                <h4 className="text-sm font-bold text-[#FFF8FC] font-display mb-1">{content.title}</h4>
                <p className="text-xs text-[#F5C451] italic font-mono">{content.tagline}</p>
              </div>

              {/* Developer-Focused Content */}
              <div className="p-3.5 rounded-xl bg-[#160D20] border border-[#3A2347]">
                <div className="text-[10px] font-bold text-[#55D6A0] uppercase tracking-wider mb-1">
                  Developer-Focused Content
                </div>
                <div className="font-mono text-xs text-[#FFF8FC] bg-[#0D0814] p-2.5 rounded-lg border border-[#3A2347] overflow-x-auto">
                  <code>git clone https://github.com/aegis-ai/campus-shield.git && cd campus-shield && cargo build --release</code>
                </div>
              </div>

              {/* README / Project Angle */}
              <div className="p-4 rounded-xl bg-[#160D20] border border-[#3A2347] space-y-1.5 font-mono text-xs">
                <div className="text-[10px] font-bold text-[#B8A8BE] uppercase tracking-wider font-sans">
                  README / Project Angle
                </div>
                <div className="whitespace-pre-line leading-relaxed text-[#FFF8FC]">
                  {content.description}
                </div>
              </div>

              {/* Technical CTA */}
              <div className="p-3.5 rounded-xl bg-[#160D20] border border-[#3A2347]">
                <div className="text-[10px] font-bold text-[#F472B6] uppercase tracking-wider mb-1">
                  Technical CTA
                </div>
                <div className="text-xs text-[#FFF8FC] font-semibold">
                  {content.callToAction}
                </div>
              </div>

              {/* Reveal Demo Button */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-purple-300 font-semibold">
                  {content.callToAction}
                </div>

                <button
                  onClick={() => setActiveView('demo')}
                  className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-purple-600/25 transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Eye className="w-4 h-4" />
                  <span>Show Demo in GitHub Repository Feed</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* STAGE 2: Realistic GitHub README / Release UI (Revealed on request) */
          <div className="animate-fade-in space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <span>Simulated GitHub Repo &amp; README View</span>
              <button
                onClick={() => setActiveView('matter')}
                className="text-purple-400 hover:underline flex items-center gap-1"
              >
                <span>Back to Content Matter</span>
                <span>←</span>
              </button>
            </div>

            <div className="rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden text-left">
              {/* Repo Header Bar */}
              <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-300 hover:underline cursor-pointer">ai-content-studio</span>
                  <span className="text-slate-500">/</span>
                  <span className="font-semibold text-white">release-v2.0</span>
                  <span className="px-1.5 py-0.2 rounded-full border border-slate-700 bg-slate-800 text-[10px] text-slate-400">
                    Public
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    <span>3.8k</span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
                    <GitFork className="w-3.5 h-3.5" />
                    <span>412</span>
                  </div>
                </div>
              </div>

              {/* Quick Clone Terminal Box */}
              <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-400 truncate">
                  <Terminal className="w-3.5 h-3.5 text-purple-400" />
                  <span>git clone https://github.com/ai-content-studio/release.git</span>
                </div>
                <button
                  onClick={handleCopyClone}
                  className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition"
                  title="Copy git clone"
                >
                  {copiedClone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Rendered README Body */}
              <div className="p-5 space-y-4 font-sans text-slate-300 text-xs sm:text-sm">
                <div>
                  <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                    <span>{content.title}</span>
                  </h3>
                  <p className="text-slate-400 text-xs italic mt-1 font-mono">
                    {content.tagline}
                  </p>
                </div>

                {/* Badges bar */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                    build: passing
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono border border-blue-500/30">
                    license: MIT
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono border border-purple-500/30">
                    release: v2.0-stable
                  </span>
                </div>

                {/* Markdown Description */}
                <div className="whitespace-pre-line leading-relaxed text-slate-200 bg-slate-900/60 p-4 rounded-xl border border-white/5 font-mono text-xs">
                  {content.description}
                </div>

                {/* Call to action & tags */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800">
                  <div className="flex flex-wrap gap-1">
                    {content.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-[10px] border border-purple-500/20"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs font-semibold text-purple-400">
                    {content.callToAction}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Refine with AI Quick Action Bar */}
        <div className="pt-3 border-t border-white/10">
          <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>Refine GitHub piece with AI:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['Improve Hook', 'Add Architecture ASCII', 'More Technical', 'Add Benchmark Metrics', 'Sharpen Quickstart'].map((act) => (
              <button
                key={act}
                onClick={() => onRefine(`GitHub: ${act}`)}
                className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-[11px] border border-purple-500/20 transition hover:scale-105"
              >
                {act}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
