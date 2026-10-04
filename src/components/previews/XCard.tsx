import React, { useState } from 'react';
import {
  Copy,
  Check,
  Bookmark,
  Edit3,
  Download,
  Heart,
  MessageCircle,
  Repeat,
  BarChart2,
  Sparkles,
  Share,
  Eye,
  FileText,
  Clock,
  Zap,
} from 'lucide-react';
import { XContent } from '../../types';

interface XCardProps {
  content: XContent;
  onUpdate: (updated: XContent) => void;
  onSaveToLibrary: () => void;
  onRefine: (action: string) => void;
  onTriggerAvatar: () => void;
}

export const XCard: React.FC<XCardProps> = ({
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

  const [hook, setHook] = useState(content.hook);
  const [rawTweets, setRawTweets] = useState(content.tweets.join('\n\n---\n\n'));

  const handleCopy = () => {
    const fullText = content.tweets.join('\n\n');
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
    const splitTweets = rawTweets
      .split('\n\n---\n\n')
      .map((t) => t.trim())
      .filter(Boolean);
    onUpdate({
      hook,
      tweets: splitTweets.length > 0 ? splitTweets : [rawTweets],
    });
    setIsEditing(false);
  };

  const handleExport = () => {
    const data = `X (TWITTER) THREAD\n\n${content.tweets.map((t, i) => `[Tweet ${i + 1}]\n${t}`).join('\n\n')}`;
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'x-thread.txt';
    a.click();
  };

  return (
    <div className="rounded-3xl glass-panel border border-slate-700 shadow-2xl overflow-hidden text-slate-100 flex flex-col justify-between">
      {/* Top Card Bar */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-slate-900/70">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onTriggerAvatar}>
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white shadow">
            𝕏
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-sm">
              <span className="text-slate-200 font-display">𝕏 (Twitter) Post</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {content.tweets.length > 1 ? `${content.tweets.length}-Tweet Thread` : 'Single Post'}
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
                ? 'bg-purple-600 text-white shadow-sm border border-purple-500/50'
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
                ? 'bg-purple-600 text-white shadow-sm border border-purple-500/50'
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
              <label className="text-[11px] font-semibold text-slate-300 uppercase">Opening Hook</label>
              <input
                type="text"
                value={hook}
                onChange={(e) => setHook(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 uppercase">
                Tweets (Separate each tweet with "---")
              </label>
              <textarea
                rows={8}
                value={rawTweets}
                onChange={(e) => setRawTweets(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-xs"
              />
            </div>
            <button
              onClick={handleApplyEdit}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
            >
              Save Changes
            </button>
          </div>
        ) : activeView === 'matter' ? (
          /* STAGE 1: What & How to Post on 𝕏 */
          <div className="space-y-5 text-left animate-fade-in">
            {/* 1. HOW TO POST: Strategy & Timing Blueprint */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-950 border border-purple-500/30 space-y-3 shadow-lg shadow-purple-950/20">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>🚀 HOW TO POST ON 𝕏 • VIRAL THREAD MECHANICS</span>
                </span>
                <span className="text-[11px] text-purple-200 font-mono flex items-center gap-1 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  <Clock className="w-3 h-3 text-purple-400" />
                  <span>Best Time: 11:30 AM – 1:30 PM &amp; 8:00 PM</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] pt-1">
                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-white/5">
                  <strong className="text-purple-400 block mb-0.5">1. The Tweet 1 Hook</strong>
                  <span className="text-slate-300">
                    Must stand on its own as a provocative statement with a 🧵👇 indicator.
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-white/5">
                  <strong className="text-sky-400 block mb-0.5">2. High Information Density</strong>
                  <span className="text-slate-300">
                    Cut all preamble. Tweet 2 must immediately explain the core technical or business breakdown.
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-white/5">
                  <strong className="text-emerald-400 block mb-0.5">3. Retweet (RT) CTA</strong>
                  <span className="text-slate-300">
                    Closing tweet should summarize the takeaway and ask for a retweet of Tweet 1.
                  </span>
                </div>
              </div>
            </div>

            {/* 2. WHAT TO POST: Deliverable Assets & Exact Thread Blocks */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#FFF8FC] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#A855F7]" />
                  <span>Platform-Adapted Structure • 𝕏 (Twitter)</span>
                </span>
                <span className="text-[10px] text-[#A855F7] bg-[#A855F7]/10 px-2 py-0.5 rounded border border-[#A855F7]/30 font-mono">
                  Concise Thread
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#160D20] border border-[#3A2347]">
                <div className="text-[10px] font-bold text-[#F472B6] uppercase tracking-wider mb-1">
                  Short Hook
                </div>
                <p className="text-sm font-semibold text-[#FFF8FC] leading-relaxed font-display">
                  {content.hook}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-bold text-[#B8A8BE] uppercase tracking-wider">
                  Concise Thought (Thread Breakdown)
                </div>
                {content.tweets.map((t, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#160D20] border border-[#3A2347] text-xs text-[#FFF8FC] whitespace-pre-line leading-relaxed">
                    <span className="text-[#A855F7] font-mono font-bold mr-2">[{idx + 1}/{content.tweets.length}]</span>
                    {t}
                  </div>
                ))}
              </div>

              {/* Conversation Trigger Box */}
              <div className="p-3.5 rounded-xl bg-[#160D20] border border-[#3A2347]">
                <div className="text-[10px] font-bold text-[#F5C451] uppercase tracking-wider mb-1">
                  Conversation Trigger
                </div>
                <p className="text-xs sm:text-sm text-[#B8A8BE] leading-relaxed">
                  "RT if you study from coffee shops • Drop your campus in replies to unlock student beta access 🛡️"
                </p>
              </div>

              {/* Reveal Demo Button */}
              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => setActiveView('demo')}
                  className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-gradient-to-r from-slate-800 to-purple-900 hover:from-slate-700 hover:to-purple-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl border border-purple-500/30 transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Eye className="w-4 h-4 text-purple-400" />
                  <span>Show Demo in 𝕏 Account Feed</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* STAGE 2: Realistic X Thread Feed Mockup (Revealed on request) */
          <div className="animate-fade-in space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <span>Simulated 𝕏 Account Thread Preview</span>
              <button
                onClick={() => setActiveView('matter')}
                className="text-purple-400 hover:underline flex items-center gap-1"
              >
                <span>Back to Content Matter</span>
                <span>←</span>
              </button>
            </div>

            <div className="space-y-3 max-w-xl mx-auto text-left rounded-3xl bg-black border border-slate-800 p-5 shadow-2xl">
              {content.tweets.map((tweet, idx) => {
                const isLast = idx === content.tweets.length - 1;
                return (
                  <div key={idx} className="relative flex gap-3">
                    {/* Avatar & Vertical Thread Connector */}
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow">
                        CS
                      </div>
                      {!isLast && (
                        <div className="w-0.5 grow bg-slate-700 my-1 rounded-full" />
                      )}
                    </div>

                    {/* Tweet Content Box */}
                    <div className="grow pb-4">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-bold text-white">Content Studio</span>
                        <span className="text-slate-400">@content_ai</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-500">{idx * 2 + 1}m</span>
                      </div>

                      <div className="mt-1 text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                        {tweet}
                      </div>

                      {/* Engagement bar */}
                      <div className="mt-2.5 flex items-center justify-between text-slate-400 text-xs max-w-md pt-1">
                        <button className="flex items-center gap-1.5 hover:text-sky-400 transition">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span className="text-[11px]">{14 + idx * 8}</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-emerald-400 transition">
                          <Repeat className="w-3.5 h-3.5" />
                          <span className="text-[11px]">{42 + idx * 12}</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-rose-400 transition">
                          <Heart className="w-3.5 h-3.5" />
                          <span className="text-[11px]">{310 + idx * 55}</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-purple-400 transition">
                          <BarChart2 className="w-3.5 h-3.5" />
                          <span className="text-[11px]">{2.4 + idx}k</span>
                        </button>
                        <button className="hover:text-white transition">
                          <Share className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Refine with AI Quick Action Bar */}
        <div className="pt-3 border-t border-white/10">
          <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-slate-300" />
            <span>Refine 𝕏 piece with AI:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['Improve Hook', 'Make Punchier', 'Expand to 5 Tweets', 'Add Hot Take', 'More Viral'].map((act) => (
              <button
                key={act}
                onClick={() => onRefine(`X: ${act}`)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition hover:scale-105"
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
