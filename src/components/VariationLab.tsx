import React, { useState } from 'react';
import {
  Layers,
  Copy,
  Check,
  Bookmark,
  Sparkles,
  ArrowRightLeft,
  Flame,
  GraduationCap,
  Briefcase,
  HeartHandshake,
} from 'lucide-react';
import { VariationTone } from '../types';

interface VariationLabProps {
  currentIdea: string;
  onSaveVariation: (title: string, content: string, tone: string) => void;
  onTriggerAvatarReaction: () => void;
}

interface VariationCard {
  tone: VariationTone;
  label: string;
  approach: string;
  badgeColor: string;
  icon: React.ReactNode;
  hook: string;
  body: string;
  closing: string;
}

export const VariationLab: React.FC<VariationLabProps> = ({
  currentIdea,
  onSaveVariation,
  onTriggerAvatarReaction,
}) => {
  const [activeTone, setActiveTone] = useState<VariationTone>('bold');
  const [copiedTone, setCopiedTone] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [secondaryTone, setSecondaryTone] = useState<VariationTone>('storytelling');

  const baseIdea = currentIdea || 'AI-powered cybersecurity platform for college students';

  const variations: VariationCard[] = [
    {
      tone: 'professional',
      label: 'Professional',
      approach: 'Authority + credibility',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      icon: <Briefcase className="w-4 h-4 text-blue-400" />,
      hook: 'Decentralized campus networks present an unaddressed 73% vulnerability vector for collegiate credentials.',
      body: `Traditional IT infrastructure prioritizes perimeter firewalls. In decentralized student environments—where laptops transit 5+ rogue access points daily—threat mitigation must move directly to autonomous on-device heuristics.\n\nOur architecture delivers continuous TLS cert validation with sub-2ms latency, ensuring enterprise-grade defense without user workflow friction.`,
      closing: 'How is your IT leadership securing student endpoints against evolving credential-harvesting schemes this term?',
    },
    {
      tone: 'storytelling',
      label: 'Storytelling',
      approach: 'Emotion + narrative',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
      icon: <HeartHandshake className="w-4 h-4 text-pink-400" />,
      hook: 'Two years ago, my roommate lost his entire semester tuition payment to an evil twin Wi-Fi hotspot in the student union.',
      body: `He thought he was logging into our university payment portal. Instead, a rogue script intercepted his credentials in seconds.\n\nWatching the devastation and panic in his eyes was the moment I stopped writing toys and started building real defensive software.\n\nToday, we are launching the protection we wish he had back then. No clunky corporate software. Just clean, invisible peace of mind.`,
      closing: 'Never underestimate the emotional cost of a security breach. Share this with someone you care about.',
    },
    {
      tone: 'bold',
      label: 'Bold & Contrarian',
      approach: 'Pattern interrupt + debate',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: <Flame className="w-4 h-4 text-amber-400" />,
      hook: 'Stop telling students to "use strong passwords". It is lazy advice that completely misses how real hacks happen.',
      body: `90% of student hacks do not happen because a password was "easy to guess". They happen because campus Wi-Fi networks are trivial to spoof with a $15 Raspberry Pi.\n\nBlaming the victim for getting phished is like blaming someone for breathing polluted air.\n\nWe engineered an autonomous defense layer that eliminates the problem at the network handshake layer. Fix the infrastructure, not the human.`,
      closing: 'Hot take? Maybe. But it is the truth the cybersecurity establishment refuses to admit.',
    },
    {
      tone: 'educational',
      label: 'Educational & Tactical',
      approach: 'Value + actionable insight',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: <GraduationCap className="w-4 h-4 text-emerald-400" />,
      hook: 'The 3-Step Campus Wi-Fi Safety Checklist every college student needs before finals week:',
      body: `1. Check the SSID Exact Spelling: Hackers set up "Campus_Guest_WiFi" right next to "Campus_Guest". Look for rogue cert prompts.\n\n2. Turn Off Auto-Join Hotspots: Your phone constantly broadcasts requests looking for known Wi-Fi names. Fake routers exploit this.\n\n3. Deploy Real-Time Anomaly Interception: Run lightweight ML protection that blocks unauthorized certificate mismatches before packets leave.\n\nSave this cheat-sheet before your next library session!`,
      closing: 'Bookmark this post and run through these 3 steps before logging into your exam portal.',
    },
  ];

  const currentVariation = variations.find((v) => v.tone === activeTone) || variations[0];
  const compareVariation = variations.find((v) => v.tone === secondaryTone) || variations[1];

  const handleCopy = (card: VariationCard) => {
    const text = `${card.hook}\n\n${card.body}\n\n${card.closing}`;
    navigator.clipboard.writeText(text);
    setCopiedTone(card.tone);
    setTimeout(() => setCopiedTone(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in text-slate-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              Variation Lab
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono">
              Dynamic Framing
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            One-click alternate psychological angles: Professional, Storytelling, Bold, and Educational.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition border ${
              compareMode
                ? 'bg-purple-600 border-purple-500 text-white shadow-lg'
                : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>{compareMode ? 'Exit Side-by-Side' : 'Side-by-Side Compare'}</span>
          </button>
        </div>
      </div>

      {/* Tone Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {variations.map((v) => {
          const isActive = activeTone === v.tone;
          return (
            <button
              key={v.tone}
              onClick={() => setActiveTone(v.tone)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                isActive
                  ? 'bg-[#160D20] border-[#A855F7] shadow-lg shadow-[#A855F7]/15 scale-[1.01]'
                  : 'bg-[#21132B] border-[#3A2347] hover:border-[#A855F7]/40 text-[#B8A8BE] hover:text-[#FFF8FC]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="p-1.5 rounded-lg bg-[#160D20]">{v.icon}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${v.badgeColor}`}>
                  {v.tone}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#FFF8FC] tracking-tight">{v.label}</div>
              <div className="text-[11px] text-[#F5C451] mt-0.5 font-medium">{v.approach}</div>
            </button>
          );
        })}
      </div>

      {/* Variation Content Presentation (Single or Side-by-Side Comparison) */}
      <div className={`grid gap-6 ${compareMode ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Primary Selected Variation Card */}
        <div className="rounded-3xl studio-card p-6 space-y-4 relative">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#3A2347]">
            <div className="flex items-center gap-2">
              {currentVariation.icon}
              <span className="font-bold text-sm text-[#FFF8FC] font-display">
                {currentVariation.label}
              </span>
              <span className="text-[11px] text-[#F5C451] font-mono bg-[#160D20] px-2 py-0.5 rounded border border-[#3A2347]">
                Approach: {currentVariation.approach}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleCopy(currentVariation)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs text-slate-300 hover:text-white transition"
              >
                {copiedTone === currentVariation.tone ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedTone === currentVariation.tone ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={() =>
                  onSaveVariation(
                    `${currentVariation.label} Variation`,
                    `${currentVariation.hook}\n\n${currentVariation.body}\n\n${currentVariation.closing}`,
                    currentVariation.tone
                  )
                }
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs text-white font-medium shadow transition"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* Hook */}
          <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
              Opening Hook & Frame
            </span>
            <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
              "{currentVariation.hook}"
            </p>
          </div>

          {/* Narrative Body */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Core Narrative Flow
            </span>
            <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
              {currentVariation.body}
            </p>
          </div>

          {/* Closing Prompt */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
              Closing Action & Psychology
            </span>
            <p className="text-xs sm:text-sm text-amber-200 font-medium italic">
              {currentVariation.closing}
            </p>
          </div>
        </div>

        {/* Secondary Comparison Card in Compare Mode */}
        {compareMode && (
          <div className="rounded-3xl glass-panel border border-cyan-500/30 p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                {compareVariation.icon}
                <select
                  value={secondaryTone}
                  onChange={(e) => setSecondaryTone(e.target.value as VariationTone)}
                  className="px-2 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs font-bold text-white focus:outline-none"
                >
                  {variations.map((v) => (
                    <option key={v.tone} value={v.tone}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => handleCopy(compareVariation)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs text-slate-300 hover:text-white transition"
              >
                {copiedTone === compareVariation.tone ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedTone === compareVariation.tone ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Hook */}
            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                Opening Hook & Frame
              </span>
              <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                "{compareVariation.hook}"
              </p>
            </div>

            {/* Narrative Body */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Core Narrative Flow
              </span>
              <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                {compareVariation.body}
              </p>
            </div>

            {/* Closing Prompt */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                Closing Action & Psychology
              </span>
              <p className="text-xs sm:text-sm text-amber-200 font-medium italic">
                {compareVariation.closing}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
