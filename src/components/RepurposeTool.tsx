import React, { useState } from 'react';
import {
  Repeat,
  Sparkles,
  Copy,
  Check,
  FileText,
  Clock,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { SocialPlatform } from '../types';

interface RepurposeToolProps {
  onApplyRepurposedToStudio: (idea: string) => void;
  onTriggerAvatarReaction: (platform: SocialPlatform) => void;
}

export const RepurposeTool: React.FC<RepurposeToolProps> = ({
  onApplyRepurposedToStudio,
  onTriggerAvatarReaction,
}) => {
  const [sourceText, setSourceText] = useState(
    `Why Most Enterprise Security Fails in Higher Education:

When we set out to analyze security incidents across 40+ university campuses in 2024, one jarring statistic stood out: over 70% of collegiate credential compromises did not happen because of zero-day kernel exploits or brute-force attacks on central servers. They occurred because college students constantly migrate between coffee shop networks, dorm Wi-Fi, and public library access points.

Students operate outside corporate perimeters. They don't have IT support desks, they install tools rapidly, and they ignore generic security warning dialogs. Traditional VPNs throttle their bandwidth, causing students to shut them off entirely.

The solution isn't to lecture students with annual compliance videos. The solution is autonomous, on-device intelligence: inspecting TLS handshakes and anomalous certificate spoofing at the network driver level in under 2 milliseconds without battery drain or speed penalties.

When security works invisibly without disrupting flow, user adoption reaches 100%. That is how we protect the next generation.`
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'instagram' | 'linkedin' | 'x' | 'tiktok' | 'blog'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Compute text stats
  const wordCount = sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0;
  const charCount = sourceText.length;
  const readingTimeMin = Math.ceil(wordCount / 200);

  // Repurposed formats derived from text
  const repurposedResults = {
    instagram: {
      title: 'Instagram Carousel Summary',
      hook: '🚨 The $15 gadget stealing student passwords on campus Wi-Fi:',
      content: `Slide 1: Why 70% of student hacks happen at coffee shops (and not because of weak passwords)\nSlide 2: The "Evil Twin" Wi-Fi trap explained in 10 seconds\nSlide 3: Why traditional corporate VPNs fail students (speed throttling & annoying popups)\nSlide 4: The modern fix: Autonomous sub-2ms handshake inspection\n\n📌 Save this checklist before you connect in the library!`,
    },
    linkedin: {
      title: 'LinkedIn Executive Briefing',
      hook: 'We audited 40+ university campuses in 2024. Here is the unvarnished reality of decentralized endpoint security:',
      content: `70% of collegiate credential breaches stem from transient public Wi-Fi access points—not server-side vulnerabilities.\n\nKey takeaways for CISOs and higher-ed leaders:\n1. Compliance videos don't change behavior. Frictionless systems do.\n2. When security tools throttle bandwidth, students turn them off.\n3. Protection must move to localized, autonomous TLS heuristics.\n\nBuilding security that works invisibly is the only way to achieve 100% genuine compliance.`,
    },
    x: {
      title: 'X (Twitter) 4-Tweet Viral Thread',
      hook: 'Why 70% of college student hacks have nothing to do with weak passwords: 🧵👇',
      content: `1/ We analyzed security incidents across 40+ universities.\n\n70% of credential leaks happened on coffee shop and library Wi-Fi networks.\n\nHere's why campus tech is broken: 🧵👇\n\n2/ Students don't sit behind corporate firewalls. They hop 5+ public networks daily. Hackers easily clone official SSID names with a $15 Wi-Fi pineapple.\n\n3/ Why don't they use VPNs? Because slow speeds and lecture buffering make students turn them off immediately.\n\n4/ The breakthrough: Autonomous on-device ML that intercepts fake certificates in <2ms without throttling video. Invisible security wins every time.`,
    },
    tiktok: {
      title: 'TikTok 60-Second Video Script',
      hook: '"If your college Wi-Fi doesn\'t ask for this one thing, your passwords are in danger."',
      content: `[0:00 - 0:05] Close-up of laptop connecting to "Library_Guest_Free". Alarm sound effect.\n[0:05 - 0:20] "Did you know 70% of student hacks happen because fake hotspots mimic your school's Wi-Fi?"\n[0:20 - 0:40] Show split screen: Normal internet vs Hacker screen intercepting keystrokes.\n[0:40 - 0:60] "Instead of slow VPNs that crash your Spotify, our AI blocks fake certs in 2ms. Free with student email! Link in bio."`,
    },
    blog: {
      title: 'Newsletter / Blog Executive Synthesis',
      hook: 'The Invisible Shield: Why Autonomous Endpoint Defense Beats Policy Compliance',
      content: `Summary:\nTraditional IT compliance models fail in higher education because student behavior is decentralized and latency-sensitive. By replacing intrusive software with autonomous, sub-2ms network-layer heuristics, security leaders can protect distributed student endpoints without degrading user experience.`,
    },
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleApplyToStudio = () => {
    onApplyRepurposedToStudio(sourceText.slice(0, 300));
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in text-slate-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Repeat className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              Content Repurposing Multi-Channel Engine
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Paste one long-form article, podcast transcript, or essay to instantly synthesize 5 platform assets.
          </p>
        </div>

        <button
          onClick={handleApplyToStudio}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg transition"
        >
          <span>Send to Create Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Input Box with live telemetry stats */}
      <div className="rounded-3xl glass-panel border border-white/10 p-6 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            <span>Source Long-Form Content / Transcript</span>
          </label>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} chars</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-purple-300">
              <Clock className="w-3 h-3" />
              <span>~{readingTimeMin} min read</span>
            </span>
          </div>
        </div>

        <textarea
          rows={6}
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder="Paste full article, podcast transcription, meeting summary or newsletter here..."
          className="w-full p-4 rounded-2xl bg-slate-950/80 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs sm:text-sm text-slate-100 placeholder-slate-500 transition resize-y font-sans leading-relaxed"
        />
      </div>

      {/* Repurposed Outputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Instagram Post */}
        <div className="rounded-2xl glass-panel border border-pink-500/20 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-bold text-pink-400 flex items-center gap-1.5">
              <span>📸</span>
              <span>{repurposedResults.instagram.title}</span>
            </span>
            <button
              onClick={() => handleCopy('ig', `${repurposedResults.instagram.hook}\n\n${repurposedResults.instagram.content}`)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1"
            >
              {copiedKey === 'ig' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[10px]">{copiedKey === 'ig' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="text-xs font-semibold text-white">{repurposedResults.instagram.hook}</div>
          <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans">
            {repurposedResults.instagram.content}
          </p>
        </div>

        {/* LinkedIn Briefing */}
        <div className="rounded-2xl glass-panel border border-blue-500/20 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
              <span>💼</span>
              <span>{repurposedResults.linkedin.title}</span>
            </span>
            <button
              onClick={() => handleCopy('li', `${repurposedResults.linkedin.hook}\n\n${repurposedResults.linkedin.content}`)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1"
            >
              {copiedKey === 'li' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[10px]">{copiedKey === 'li' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="text-xs font-semibold text-white">{repurposedResults.linkedin.hook}</div>
          <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans">
            {repurposedResults.linkedin.content}
          </p>
        </div>

        {/* X Thread */}
        <div className="rounded-2xl glass-panel border border-slate-700 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span>𝕏</span>
              <span>{repurposedResults.x.title}</span>
            </span>
            <button
              onClick={() => handleCopy('x', `${repurposedResults.x.hook}\n\n${repurposedResults.x.content}`)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1"
            >
              {copiedKey === 'x' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[10px]">{copiedKey === 'x' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="text-xs font-semibold text-white">{repurposedResults.x.hook}</div>
          <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans">
            {repurposedResults.x.content}
          </p>
        </div>

        {/* TikTok Script */}
        <div className="rounded-2xl glass-panel border border-rose-500/20 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
              <span>🎬</span>
              <span>{repurposedResults.tiktok.title}</span>
            </span>
            <button
              onClick={() => handleCopy('tt', `${repurposedResults.tiktok.hook}\n\n${repurposedResults.tiktok.content}`)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1"
            >
              {copiedKey === 'tt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[10px]">{copiedKey === 'tt' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="text-xs font-semibold text-white">{repurposedResults.tiktok.hook}</div>
          <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans">
            {repurposedResults.tiktok.content}
          </p>
        </div>
      </div>
    </div>
  );
};
