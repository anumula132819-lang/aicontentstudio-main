import React, { useState } from 'react';
import {
  Copy,
  Check,
  Bookmark,
  Edit3,
  Download,
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  MoreHorizontal,
  Sparkles,
  Briefcase,
  Globe,
  Eye,
  FileText,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { LinkedInContent } from '../../types';

interface LinkedInCardProps {
  content: LinkedInContent;
  onUpdate: (updated: LinkedInContent) => void;
  onSaveToLibrary: () => void;
  onRefine: (action: string) => void;
  onTriggerAvatar: () => void;
}

export const LinkedInCard: React.FC<LinkedInCardProps> = ({
  content,
  onUpdate,
  onSaveToLibrary,
  onRefine,
  onTriggerAvatar,
}) => {
  // Default to 'matter' (Content matter & how to post) first as requested!
  const [activeView, setActiveView] = useState<'matter' | 'demo'>('matter');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const [hook, setHook] = useState(content.hook);
  const [body, setBody] = useState(content.body);
  const [closingQuestion, setClosingQuestion] = useState(content.closingQuestion);
  const [hashtags, setHashtags] = useState(content.hashtags.join(' '));

  const handleCopy = () => {
    const fullText = `${content.hook}\n\n${content.body}\n\n${content.closingQuestion}\n\n${content.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
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
      hook,
      body,
      closingQuestion,
      hashtags: hashtags.split(' ').filter(Boolean),
    });
    setIsEditing(false);
  };

  const handleExport = () => {
    const data = `LINKEDIN THOUGHT LEADERSHIP POST\n\nHOOK:\n${content.hook}\n\nBODY:\n${content.body}\n\nCLOSING QUESTION:\n${content.closingQuestion}\n\nHASHTAGS:\n${content.hashtags.join(' ')}`;
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'linkedin-post.txt';
    a.click();
  };

  return (
    <div className="rounded-3xl glass-panel border border-blue-500/25 shadow-2xl overflow-hidden text-slate-100 flex flex-col justify-between">
      {/* Top Card Bar */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-slate-900/70">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onTriggerAvatar}>
          <div className="w-8 h-8 rounded-full bg-blue-600 p-0.5 shadow flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-sm">
              <span className="text-blue-400 font-display">LinkedIn Post</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                Thought Leadership
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
                ? 'bg-blue-600 text-white shadow-sm'
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
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Account Demo</span>
          </button>
        </div>

        {/* Action buttons */}
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
              <label className="text-[11px] font-semibold text-blue-400 uppercase">Hook (Top 2 Lines)</label>
              <textarea
                rows={2}
                value={hook}
                onChange={(e) => setHook(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-blue-400 uppercase">Body Narrative</label>
              <textarea
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-blue-400 uppercase">Closing Question Prompt</label>
              <input
                type="text"
                value={closingQuestion}
                onChange={(e) => setClosingQuestion(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-blue-400 uppercase">Hashtags</label>
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-white/10 text-white"
              />
            </div>
            <button
              onClick={handleApplyEdit}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
            >
              Save Changes
            </button>
          </div>
        ) : activeView === 'matter' ? (
          /* STAGE 1: What & How to Post on LinkedIn */
          <div className="space-y-5 text-left animate-fade-in">
            {/* 1. HOW TO POST: Strategy & Timing Blueprint */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/50 via-indigo-950/40 to-slate-900 border border-blue-500/30 space-y-3 shadow-lg shadow-blue-950/30">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                  <span>🚀 HOW TO POST ON LINKEDIN • ALGORITHM PLAYBOOK</span>
                </span>
                <span className="text-[11px] text-blue-200 font-mono flex items-center gap-1 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  <Clock className="w-3 h-3 text-blue-400" />
                  <span>Peak Window: 8:00 AM – 10:30 AM (Tue - Thu)</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] pt-1">
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                  <strong className="text-blue-400 block mb-0.5">1. Formatting Rule</strong>
                  <span className="text-slate-300">
                    Keep paragraphs under 2 lines with empty line breaks to avoid mobile text cramming.
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                  <strong className="text-cyan-400 block mb-0.5">2. High-Signal Data</strong>
                  <span className="text-slate-300">
                    Lead with an industry metric or counter-intuitive case study rather than promotional broadcast.
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                  <strong className="text-amber-400 block mb-0.5">3. Comment Catalyst</strong>
                  <span className="text-slate-300">
                    End with a targeted peer-level question. Comments drive 80% of secondary feed distribution.
                  </span>
                </div>
              </div>
            </div>

            {/* 2. WHAT TO POST: Deliverable Assets & Exact Copy Blocks */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#FFF8FC] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#0A66C2]" />
                  <span>Platform-Adapted Structure • LinkedIn</span>
                </span>
                <span className="text-[10px] text-[#0A66C2] bg-[#0A66C2]/10 px-2 py-0.5 rounded border border-[#0A66C2]/30 font-mono">
                  Thought Leadership
                </span>
              </div>

              {/* Hook Box */}
              <div className="p-3.5 rounded-xl bg-[#160D20] border border-[#3A2347]">
                <div className="text-[10px] font-bold text-[#0A66C2] uppercase tracking-wider mb-1">
                  Professional Hook
                </div>
                <p className="text-sm font-semibold text-[#FFF8FC] leading-relaxed font-display">
                  {content.hook}
                </p>
              </div>

              {/* Strategic Insight Box */}
              <div className="p-3.5 rounded-xl bg-[#160D20] border border-[#3A2347]">
                <div className="text-[10px] font-bold text-[#F5C451] uppercase tracking-wider mb-1">
                  Strategic Insight
                </div>
                <p className="text-xs sm:text-sm text-[#B8A8BE] leading-relaxed">
                  Decentralized perimeter protection shifts corporate liability into proactive personal endpoint immunity.
                </p>
              </div>

              {/* Structured Body */}
              <div className="p-4 rounded-xl bg-[#160D20] border border-[#3A2347] space-y-1.5">
                <div className="text-[10px] font-bold text-[#B8A8BE] uppercase tracking-wider">
                  Structured Body
                </div>
                <p className="text-xs sm:text-sm text-[#FFF8FC] whitespace-pre-line leading-relaxed font-sans">
                  {content.body}
                </p>
              </div>

              {/* CTA Box */}
              <div className="p-3.5 rounded-xl bg-[#160D20] border border-[#3A2347]">
                <div className="text-[10px] font-bold text-[#A855F7] uppercase tracking-wider mb-1">
                  CTA (Discussion Question)
                </div>
                <p className="text-xs sm:text-sm text-[#FFF8FC] font-medium">
                  {content.closingQuestion}
                </p>
              </div>

              {/* Hashtags & Live Demo Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1 text-[11px] text-blue-400 font-mono">
                  {content.hashtags.map((h, i) => (
                    <span key={i}>{h.startsWith('#') ? h : `#${h}`}</span>
                  ))}
                </div>

                <button
                  onClick={() => setActiveView('demo')}
                  className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-600/25 transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Eye className="w-4 h-4" />
                  <span>Show Demo in LinkedIn Account Feed</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* STAGE 2: Realistic LinkedIn Post Container (Revealed on request) */
          <div className="animate-fade-in space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <span>Simulated LinkedIn Feed Post Preview</span>
              <button
                onClick={() => setActiveView('matter')}
                className="text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Back to Content Matter</span>
                <span>←</span>
              </button>
            </div>

            <div className="rounded-3xl bg-slate-950 border border-white/15 p-5 sm:p-6 shadow-2xl space-y-3 text-left">
              {/* Author Row */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center font-bold text-white shadow">
                    EV
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                      <span>Elena Vance</span>
                      <span className="text-[10px] text-slate-400">• 1st</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Head of Product &amp; Security Insights</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <span>2h</span>
                      <span>•</span>
                      <Globe className="w-3 h-3" />
                    </div>
                  </div>
                </div>
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </div>

              {/* Hook */}
              <div className="text-xs sm:text-sm font-semibold text-slate-100 whitespace-pre-line leading-relaxed">
                {content.hook}
              </div>

              {/* Body */}
              <div className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed pt-1">
                {content.body}
              </div>

              {/* Closing Discussion Question */}
              <div className="pt-2 text-xs sm:text-sm font-medium text-blue-300 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                💡 {content.closingQuestion}
              </div>

              {/* Hashtags */}
              <div className="flex flex-wrap gap-1.5 pt-2 text-[11px] text-blue-400 font-medium">
                {content.hashtags.map((tag, i) => (
                  <span key={i} className="hover:underline cursor-pointer">
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>

              {/* LinkedIn Engagement Bar */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-slate-400 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="flex -space-x-1">
                    <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[9px] text-white">👍</span>
                    <span className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center text-[9px] text-white">❤️</span>
                    <span className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[9px] text-white">💡</span>
                  </span>
                  <span className="text-[11px]">842 reactions • 94 comments</span>
                </div>
              </div>

              {/* Action buttons bar */}
              <div className="pt-2 flex items-center justify-around border-t border-white/5 text-slate-300 text-xs">
                <button className="flex items-center gap-1.5 py-1.5 px-2 rounded hover:bg-white/5 transition">
                  <ThumbsUp className="w-4 h-4 text-blue-400" />
                  <span>Like</span>
                </button>
                <button className="flex items-center gap-1.5 py-1.5 px-2 rounded hover:bg-white/5 transition">
                  <MessageSquare className="w-4 h-4" />
                  <span>Comment</span>
                </button>
                <button className="flex items-center gap-1.5 py-1.5 px-2 rounded hover:bg-white/5 transition">
                  <Repeat2 className="w-4 h-4" />
                  <span>Repost</span>
                </button>
                <button className="flex items-center gap-1.5 py-1.5 px-2 rounded hover:bg-white/5 transition">
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Refine with AI Quick Action Bar */}
        <div className="pt-3 border-t border-white/10">
          <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>Refine LinkedIn piece with AI:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['Improve Hook', 'Shorten', 'Add Data Points', 'More Professional', 'Sharpen Question'].map((act) => (
              <button
                key={act}
                onClick={() => onRefine(`LinkedIn: ${act}`)}
                className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-[11px] border border-blue-500/20 transition hover:scale-105"
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
