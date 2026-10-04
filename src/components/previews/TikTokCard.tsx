import React, { useState } from 'react';
import {
  Copy,
  Check,
  Bookmark,
  Edit3,
  Download,
  Heart,
  MessageSquare,
  Share2,
  Music,
  Sparkles,
  Clapperboard,
  Flame,
  Eye,
  FileText,
  Clock,
  Video,
} from 'lucide-react';
import { TikTokContent, TikTokScene } from '../../types';

interface TikTokCardProps {
  content: TikTokContent;
  onUpdate: (updated: TikTokContent) => void;
  onSaveToLibrary: () => void;
  onRefine: (action: string) => void;
  onTriggerAvatar: () => void;
}

export const TikTokCard: React.FC<TikTokCardProps> = ({
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
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);

  const [title, setTitle] = useState(content.title);
  const [hook, setHook] = useState(content.hook);
  const [caption, setCaption] = useState(content.caption);
  const [audioSuggestion, setAudioSuggestion] = useState(content.audioSuggestion);

  const handleCopy = () => {
    const scenesText = content.scenes
      .map(
        (s, i) =>
          `[Scene ${i + 1} (${s.timestamp})]\nVISUAL: ${s.visual}\nTEXT OVERLAY: ${s.textOverlay}\nVOICEOVER: "${s.voiceover}"`
      )
      .join('\n\n');
    const fullText = `TIKTOK VIDEO CONCEPT: ${content.title}\n\nHOOK: ${content.hook}\n\nSCENE BREAKDOWN:\n${scenesText}\n\nCAPTION: ${content.caption}\n\nAUDIO: ${content.audioSuggestion}`;
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
      ...content,
      title,
      hook,
      caption,
      audioSuggestion,
    });
    setIsEditing(false);
  };

  const handleExport = () => {
    const scenesText = content.scenes
      .map(
        (s, i) =>
          `SCENE ${i + 1} (${s.timestamp})\n- Visual: ${s.visual}\n- Text on screen: ${s.textOverlay}\n- Voiceover: ${s.voiceover}\n`
      )
      .join('\n');
    const data = `TIKTOK PRODUCTION SCRIPT\n\nTitle: ${content.title}\nHook: ${content.hook}\nAudio: ${content.audioSuggestion}\n\n${scenesText}\nCaption:\n${content.caption}`;
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tiktok-script.txt';
    a.click();
  };

  const activeScene = content.scenes[selectedSceneIndex] || content.scenes[0];

  return (
    <div className="rounded-3xl glass-panel border border-rose-500/25 shadow-2xl overflow-hidden text-slate-100 flex flex-col justify-between">
      {/* Top Card Bar */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-slate-900/70">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onTriggerAvatar}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-rose-500 to-pink-500 p-0.5 shadow flex items-center justify-center">
            <Clapperboard className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-sm">
              <span className="text-rose-400 font-display">TikTok Video</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30">
                Short-Form Storyboard
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
                ? 'bg-rose-600 text-white shadow-sm'
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
                ? 'bg-rose-600 text-white shadow-sm'
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
              <label className="text-[11px] font-semibold text-rose-400 uppercase">Video Concept Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-rose-400 uppercase">3-Second Hook</label>
              <input
                type="text"
                value={hook}
                onChange={(e) => setHook(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-rose-400 uppercase">Caption</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-rose-400 uppercase">Audio / Sound Recommendation</label>
              <input
                type="text"
                value={audioSuggestion}
                onChange={(e) => setAudioSuggestion(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-white/10 text-white"
              />
            </div>
            <button
              onClick={handleApplyEdit}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition"
            >
              Save Changes
            </button>
          </div>
        ) : activeView === 'matter' ? (
          /* STAGE 1: What & How to Post on TikTok */
          <div className="space-y-5 text-left animate-fade-in">
            {/* 1. HOW TO POST: Strategy & Timing Blueprint */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/50 via-pink-950/40 to-slate-900 border border-rose-500/30 space-y-3 shadow-lg shadow-rose-950/20">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-rose-400" />
                  <span>🚀 HOW TO POST ON TIKTOK • VIRAL RETENTION PLAYBOOK</span>
                </span>
                <span className="text-[11px] text-rose-200 font-mono flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  <Clock className="w-3 h-3 text-rose-400" />
                  <span>Optimal Length: 28 – 35 Seconds</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] pt-1">
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                  <strong className="text-rose-400 block mb-0.5">1. The 3-Second Snap Hook</strong>
                  <span className="text-slate-300">
                    Use physical motion (handheld snap or zoom) + on-screen text sticker to prevent swipe-away.
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                  <strong className="text-cyan-400 block mb-0.5">2. Scene B-Roll Pacing</strong>
                  <span className="text-slate-300">
                    Switch camera angle or screen overlay every 2.5 seconds to maintain high viewer attention.
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                  <strong className="text-amber-400 block mb-0.5">3. Sound Pairing</strong>
                  <span className="text-slate-300">
                    Use trending creator audio mixed at 12% under clear voiceover to tap algorithmic sound hubs.
                  </span>
                </div>
              </div>
            </div>

            {/* 2. WHAT TO POST: Deliverable Assets & Production Storyboard */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#FFF8FC] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#F472B6]" />
                  <span>Platform-Adapted Structure • TikTok</span>
                </span>
                <span className="text-[10px] text-[#F472B6] bg-[#F472B6]/10 px-2 py-0.5 rounded border border-[#F472B6]/30 font-mono">
                  Short-Form Video
                </span>
              </div>

              {/* Fast Hook Box */}
              <div className="p-3.5 rounded-xl bg-[#160D20] border border-[#3A2347]">
                <div className="text-[10px] font-bold text-[#F472B6] uppercase tracking-wider mb-1">
                  Fast Hook (0–3 Seconds)
                </div>
                <h4 className="text-sm font-bold text-[#FFF8FC] font-display mb-1">{content.title}</h4>
                <p className="text-xs sm:text-sm font-semibold text-[#F472B6] italic font-sans">
                  "{content.hook}"
                </p>
              </div>

              {/* Video / Scene Concept & Dialogue */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-[#B8A8BE] uppercase tracking-wider">
                  Video &amp; Scene Concept (Dialogue &amp; On-Screen Cues)
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {content.scenes.map((s, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#160D20] border border-[#3A2347] text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#A855F7] font-bold">Scene {idx + 1} ({s.timestamp})</span>
                        <span className="text-[#F5C451]">On-Screen: "{s.textOverlay}"</span>
                      </div>
                      <div className="text-[#B8A8BE] text-[11px]">Visual Concept: {s.visual}</div>
                      <div className="text-[#FFF8FC] italic">Dialogue: "{s.voiceover}"</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Box */}
              <div className="p-3.5 rounded-xl bg-[#160D20] border border-[#3A2347] space-y-1">
                <div className="text-[10px] font-bold text-[#A855F7] uppercase tracking-wider">
                  CTA (Video Call to Action)
                </div>
                <p className="text-xs text-[#FFF8FC] font-medium">
                  "Comment 'SHIELD' below to get free access before campus Wi-Fi breaks your accounts 🛡️"
                </p>
              </div>

              {/* Reveal Demo Button */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-rose-400" />
                  <span>Audio: {content.audioSuggestion}</span>
                </div>

                <button
                  onClick={() => setActiveView('demo')}
                  className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-rose-600/25 transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Eye className="w-4 h-4" />
                  <span>Show Demo in TikTok Account Feed</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* STAGE 2: Realistic TikTok Smartphone Simulation (Revealed on request) */
          <div className="animate-fade-in space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <span>Simulated TikTok Vertical Phone Screen Preview</span>
              <button
                onClick={() => setActiveView('matter')}
                className="text-rose-400 hover:underline flex items-center gap-1"
              >
                <span>Back to Content Matter</span>
                <span>←</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Phone Screen Mockup */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-64 h-[380px] rounded-[32px] bg-slate-950 border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between p-3.5 text-white">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-950/60 via-slate-900 to-rose-950/60 opacity-80" />

                  {/* Top Notch & Audio Banner */}
                  <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-300">
                    <div className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-full border border-white/10 truncate max-w-[170px]">
                      <Music className="w-2.5 h-2.5 text-rose-400" />
                      <span className="truncate">{content.audioSuggestion}</span>
                    </div>
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                  </div>

                  {/* Center Dynamic On-Screen Text Sticker */}
                  <div className="relative z-10 my-auto text-center px-2">
                    <div className="inline-block px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-rose-500/40 text-xs font-bold text-white shadow-xl animate-bounce">
                      {activeScene?.textOverlay || content.hook}
                    </div>
                    <div className="mt-2 text-[10px] text-rose-300 font-mono">
                      Scene {selectedSceneIndex + 1} ({activeScene?.timestamp})
                    </div>
                  </div>

                  {/* Bottom Overlay & Right-side Engagement Icons */}
                  <div className="relative z-10 flex items-end justify-between">
                    <div className="text-left text-[11px] space-y-1 max-w-[160px]">
                      <div className="font-bold text-white">@studio_creator</div>
                      <p className="text-[10px] text-slate-300 line-clamp-2">{content.caption}</p>
                    </div>

                    <div className="flex flex-col items-center gap-2.5 text-[9px] text-slate-300">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-slate-800/80 flex items-center justify-center">
                          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                        </div>
                        <span>48.2k</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-slate-800/80 flex items-center justify-center">
                          <MessageSquare className="w-3.5 h-3.5" />
                        </div>
                        <span>1,290</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-slate-800/80 flex items-center justify-center">
                          <Share2 className="w-3.5 h-3.5" />
                        </div>
                        <span>9.4k</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scene Breakdown details */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-3 text-left">
                <div>
                  <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
                    🎬 {content.title}
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-200 mb-3">
                    🔥 Hook: {content.hook}
                  </div>
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {content.scenes.map((scene, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSceneIndex(idx)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                        selectedSceneIndex === idx
                          ? 'bg-rose-600 text-white shadow'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      Scene {idx + 1} ({scene.timestamp})
                    </button>
                  ))}
                </div>

                {activeScene && (
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-cyan-400 uppercase">Visual:</span>
                      <p className="text-slate-300 mt-0.5">{activeScene.visual}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase">Text on Screen:</span>
                      <p className="text-amber-200 font-mono mt-0.5">"{activeScene.textOverlay}"</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-rose-400 uppercase">Voiceover:</span>
                      <p className="text-white font-medium italic mt-0.5">"{activeScene.voiceover}"</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-white/5 text-[11px] text-slate-400">
                  <Music className="w-3.5 h-3.5 text-rose-400" />
                  <span>Audio Vibe: <strong className="text-slate-200">{content.audioSuggestion}</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Refine with AI Quick Action Bar */}
        <div className="pt-3 border-t border-white/10">
          <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-rose-400" />
            <span>Refine TikTok piece with AI:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['Improve Hook', 'Make Faster Paced', 'More Gen-Z Slang', 'Sharpen CTA', 'Add Visual Gag'].map((act) => (
              <button
                key={act}
                onClick={() => onRefine(`TikTok: ${act}`)}
                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px] border border-rose-500/20 transition hover:scale-105"
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
