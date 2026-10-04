import React, { useState } from 'react';
import {
  Copy,
  Check,
  Bookmark,
  Edit3,
  Download,
  Heart,
  MessageCircle,
  Send,
  MoreHorizontal,
  Sparkles,
  Camera,
  Layers,
  Eye,
  FileText,
  Clock,
  Share2,
  HelpCircle,
} from 'lucide-react';
import { InstagramContent } from '../../types';

interface InstagramCardProps {
  content: InstagramContent;
  onUpdate: (updated: InstagramContent) => void;
  onSaveToLibrary: () => void;
  onRefine: (action: string) => void;
  onTriggerAvatar: () => void;
}

export const InstagramCard: React.FC<InstagramCardProps> = ({
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
  const [activeSlide, setActiveSlide] = useState(0);

  // Editable fields
  const [hook, setHook] = useState(content.hook);
  const [caption, setCaption] = useState(content.caption);
  const [hashtags, setHashtags] = useState(content.hashtags.join(' '));
  const [cta, setCta] = useState(content.cta);
  const [visualIdea, setVisualIdea] = useState(content.visualIdea);

  const handleCopy = () => {
    const fullText = `${content.hook}\n\n${content.caption}\n\n${content.cta}\n\n${content.hashtags.join(' ')}`;
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
      caption,
      hashtags: hashtags.split(' ').filter(Boolean),
      cta,
      visualIdea,
    });
    setIsEditing(false);
  };

  const handleExport = () => {
    const data = `INSTAGRAM POST\n\nHOOK:\n${content.hook}\n\nCAPTION:\n${content.caption}\n\nCALL TO ACTION:\n${content.cta}\n\nHASHTAGS:\n${content.hashtags.join(' ')}\n\nVISUAL/REEL IDEA:\n${content.visualIdea}`;
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'instagram-post.txt';
    a.click();
  };

  return (
    <div className="rounded-3xl glass-panel border border-pink-500/25 shadow-2xl overflow-hidden text-slate-100 flex flex-col justify-between">
      {/* Top Card Bar */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-slate-900/70">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onTriggerAvatar}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-0.5 shadow">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
              <Camera className="w-4 h-4 text-pink-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-sm">
              <span className="text-pink-400 font-display">Instagram Post</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-pink-500/10 text-pink-300 border border-pink-500/30">
                Visual Carousel &amp; Reel
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
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm'
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
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm'
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
            title="Edit copy directly"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isEditing ? 'Cancel' : 'Edit'}</span>
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition text-xs flex items-center gap-1"
            title="Copy caption"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleSave}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition text-xs flex items-center gap-1"
            title="Save to Library"
          >
            {saved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
          </button>
          <button
            onClick={handleExport}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            title="Export text file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-4 sm:p-6 space-y-4">
        {isEditing ? (
          /* Inline Editor */
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-pink-400 uppercase">Hook</label>
              <input
                type="text"
                value={hook}
                onChange={(e) => setHook(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-pink-400 uppercase">Caption Body</label>
              <textarea
                rows={5}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-pink-400 uppercase">CTA &amp; Prompt</label>
              <input
                type="text"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-pink-400 uppercase">Hashtags</label>
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-white/10 text-white"
              />
            </div>
            <button
              onClick={handleApplyEdit}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold transition"
            >
              Save Changes
            </button>
          </div>
        ) : activeView === 'matter' ? (
          /* STAGE 1: What to Post & How to Post on Instagram */
          <div className="space-y-5 text-left animate-fade-in">
            {/* 1. HOW TO POST: Strategy & Timing Blueprint */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/50 via-purple-950/40 to-slate-900 border border-pink-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>🚀 HOW TO POST ON INSTAGRAM • ALGORITHM PLAYBOOK</span>
                </span>
                <span className="text-[11px] text-pink-200 font-mono flex items-center gap-1 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                  <Clock className="w-3 h-3 text-pink-400" />
                  <span>Peak Window: 6:00 PM – 9:00 PM</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] pt-1">
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                  <strong className="text-pink-400 block mb-0.5">1. Visual Framing</strong>
                  <span className="text-slate-300">
                    Post a 4:5 vertical carousel or 9:16 Reel. Bold high-contrast text on Slide 1 stops the scroll.
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                  <strong className="text-purple-400 block mb-0.5">2. Algorithm Hook</strong>
                  <span className="text-slate-300">
                    Place the core question in the first 90 characters before the "...more" cut-off line.
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                  <strong className="text-emerald-400 block mb-0.5">3. First 30 Min Protocol</strong>
                  <span className="text-slate-300">
                    Reply to every comment in the first 30 minutes to trigger secondary explore feed distribution.
                  </span>
                </div>
              </div>
            </div>

            {/* 2. WHAT TO POST: Deliverable Assets & Exact Copy Blocks */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#FFF8FC] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#F472B6]" />
                  <span>Platform-Adapted Structure • Instagram</span>
                </span>
                <span className="text-[10px] text-[#F472B6] bg-[#F472B6]/10 px-2 py-0.5 rounded border border-[#F472B6]/30 font-mono">
                  Visual-First
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Left 7 cols: Copy Text blocks */}
                <div className="md:col-span-7 space-y-3">
                  {/* Hook Box */}
                  <div className="p-3.5 rounded-xl bg-[#160D20] border border-[#3A2347]">
                    <div className="text-[10px] font-bold text-[#F472B6] uppercase tracking-wider mb-1">
                      Hook (Visual-First)
                    </div>
                    <p className="text-sm font-semibold text-[#FFF8FC] leading-relaxed font-display">
                      {content.hook}
                    </p>
                  </div>

                  {/* Caption Body */}
                  <div className="p-4 rounded-xl bg-[#160D20] border border-[#3A2347] space-y-1.5">
                    <div className="text-[10px] font-bold text-[#B8A8BE] uppercase tracking-wider">
                      Caption
                    </div>
                    <p className="text-xs text-[#FFF8FC] whitespace-pre-line leading-relaxed font-sans">
                      {content.caption}
                    </p>
                  </div>

                  {/* CTA & Hashtags */}
                  <div className="p-3 rounded-xl bg-[#160D20] border border-[#3A2347] space-y-2">
                    <div className="text-[10px] font-bold text-[#A855F7] uppercase tracking-wider">
                      CTA (Call to Action)
                    </div>
                    <div className="text-xs font-semibold text-[#FFF8FC]">
                      {content.cta}
                    </div>
                    <div className="flex flex-wrap gap-1 text-[11px] text-[#A855F7] font-mono pt-1">
                      {content.hashtags.map((h, i) => (
                        <span key={i}>{h.startsWith('#') ? h : `#${h}`}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right 5 cols: Visual Asset Concept & Preview Prompt */}
                <div className="md:col-span-5 flex flex-col justify-between space-y-3">
                  <div className="p-4 rounded-2xl bg-[#160D20] border border-[#3A2347] space-y-2">
                    <span className="text-[10px] font-bold text-[#F5C451] uppercase tracking-wider block">
                      Visual Concept (Carousel / Reel)
                    </span>
                    <p className="text-xs text-[#B8A8BE] leading-relaxed italic">
                      "{content.visualIdea}"
                    </p>
                  </div>

                  {/* Big Button to reveal Account Live Demo */}
                  <button
                    onClick={() => setActiveView('demo')}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C026D3] hover:brightness-105 text-[#FFF8FC] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#C026D3]/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Show Demo in Instagram Account Feed</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* STAGE 2: Real Instagram Mobile UI Mockup (Revealed on request) */
          <div className="animate-fade-in space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <span>Simulated Instagram Mobile Account Preview</span>
              <button
                onClick={() => setActiveView('matter')}
                className="text-pink-400 hover:underline flex items-center gap-1"
              >
                <span>Back to Content Matter</span>
                <span>←</span>
              </button>
            </div>

            <div className="max-w-md mx-auto rounded-3xl bg-black border border-white/15 shadow-2xl overflow-hidden">
              {/* Instagram Profile Header */}
              <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-amber-500 p-0.5">
                    <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                      AI
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold flex items-center gap-1 text-white">
                      <span>aistudio.hq</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    </div>
                    <div className="text-[10px] text-slate-400">Campus Security &amp; Tech</div>
                  </div>
                </div>
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </div>

              {/* Visual Media Canvas (Realistic Carousel or Reel Placeholder) */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-900 via-purple-950 to-pink-950 flex flex-col items-center justify-center p-6 text-center border-b border-white/10">
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-3 shadow-lg">
                  <Layers className="w-6 h-6 text-pink-400" />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-1">
                  Carousel Slide {activeSlide + 1}
                </div>
                <p className="text-xs font-medium text-slate-200 line-clamp-3 max-w-xs">
                  "{content.visualIdea}"
                </p>
                <div className="absolute bottom-3 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      className={`w-1.5 h-1.5 rounded-full cursor-pointer ${
                        i === activeSlide ? 'bg-pink-400 w-3' : 'bg-white/40'
                      } transition-all`}
                    />
                  ))}
                </div>
              </div>

              {/* Engagement Action Bar */}
              <div className="px-3.5 pt-2.5 flex items-center justify-between text-slate-200">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <MessageCircle className="w-5 h-5" />
                  <Send className="w-5 h-5" />
                </div>
                <Bookmark className="w-5 h-5" />
              </div>

              {/* Like count & Caption */}
              <div className="px-3.5 pb-4 pt-1.5 text-xs text-left space-y-1.5">
                <div className="font-semibold text-slate-200 text-[11px]">
                  1,842 likes
                </div>

                {/* Hook (Bold) */}
                <div className="font-semibold text-slate-100 text-xs">
                  {content.hook}
                </div>

                {/* Formatted Caption */}
                <p className="text-slate-300 text-[11px] whitespace-pre-line leading-relaxed">
                  {content.caption}
                </p>

                {/* Call to action */}
                <div className="pt-1 text-[11px] font-semibold text-pink-300">
                  {content.cta}
                </div>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-1 text-[10px] text-blue-400 pt-1">
                  {content.hashtags.map((tag, idx) => (
                    <span key={idx} className="hover:underline cursor-pointer">
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Refine with AI Quick Action Bar */}
        <div className="pt-3 border-t border-white/10">
          <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-pink-400" />
            <span>Refine Instagram piece with AI:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['Improve Hook', 'Shorten', 'Make Funnier', 'Add CTA', 'More Professional'].map((act) => (
              <button
                key={act}
                onClick={() => onRefine(`Instagram: ${act}`)}
                className="px-2.5 py-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 text-[11px] border border-pink-500/20 transition hover:scale-105"
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
