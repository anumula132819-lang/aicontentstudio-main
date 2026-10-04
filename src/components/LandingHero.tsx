import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Layers,
  Sliders,
  CheckCircle2,
  Share2,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import { SocialPlatform } from '../types';
import { PLATFORM_INFO } from '../data/voiceLines';

interface LandingHeroProps {
  onStartCreating: () => void;
  onTriggerDemo: () => void;
  onPlatformClick: (platform: SocialPlatform) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartCreating,
  onTriggerDemo,
  onPlatformClick,
}) => {
  const platforms: SocialPlatform[] = ['instagram', 'linkedin', 'x', 'tiktok', 'github'];

  return (
    <section className="relative pt-8 pb-14 overflow-hidden">
      {/* Background radial glows: Soft purple & pink ambient (reduced by ~25%) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[340px] bg-gradient-to-tr from-[#A855F7]/15 via-[#F472B6]/12 to-[#C026D3]/15 blur-[110px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Top Announcement Pill */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#21132B]/80 border border-[#3A2347] text-[#FFF8FC] text-xs font-semibold mb-6 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
          <span className="text-[#F5C451] font-semibold">AI Content Intelligence</span>
          <span className="w-1 h-1 rounded-full bg-[#B8A8BE]" />
          <span className="text-[#B8A8BE] font-medium">Create once. Adapt everywhere.</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-display max-w-4xl mx-auto leading-[1.1]"
        >
          <span className="text-[#FFF8FC]">One idea.</span>{' '}
          <span className="bg-gradient-to-r from-[#F5C451] via-[#F472B6] to-[#C026D3] bg-clip-text text-transparent">
            Every platform.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-5 text-base sm:text-lg md:text-xl text-[#B8A8BE] max-w-2xl mx-auto leading-relaxed font-sans"
        >
          Stop writing bespoke copy from scratch or lazily cross-posting. AI Content Studio
          ingests your strategic context and generates native, high-impact copy tailored to the psychological nuances of Instagram, LinkedIn, 𝕏, TikTok, and GitHub.
        </motion.p>

        {/* Action CTAs: Standardized primary and secondary */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <button
            onClick={onStartCreating}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C026D3] hover:brightness-105 text-[#FFF8FC] font-semibold text-sm shadow-md shadow-[#C026D3]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Start Creating Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onTriggerDemo}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#160D20] hover:bg-[#21132B] text-[#FFF8FC] border border-[#3A2347] hover:border-[#A855F7]/50 font-medium text-sm transition-all hover:scale-[1.01] shadow-sm"
          >
            <Zap className="w-4 h-4 text-[#A855F7]" />
            <span>Try 3-Min Live Demo</span>
          </button>
        </motion.div>

        {/* Animated Visual: One Idea splitting into Platform Cards */}
        <div className="mt-14 relative max-w-4xl mx-auto">
          {/* Central Source Pill */}
          <div className="inline-block relative z-20 mb-8">
            <div className="p-3.5 sm:px-6 sm:py-3.5 rounded-2xl glass-panel border border-purple-500/40 shadow-2xl bg-slate-900/90 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold tracking-wider uppercase text-purple-400">
                  Single Source Premise
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white">
                  "AI-Powered Cybersecurity Platform for College Students"
                </div>
              </div>
            </div>
            {/* Visual connector lines */}
            <div className="hidden md:block w-0.5 h-6 bg-gradient-to-b from-purple-500 to-transparent mx-auto" />
          </div>

          {/* 5 Splitting Platform Target Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {platforms.map((plat, idx) => {
              const info = PLATFORM_INFO[plat];
              return (
                <motion.div
                  key={plat}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + idx * 0.08 }}
                  onClick={() => onPlatformClick(plat)}
                  className="p-3.5 rounded-2xl glass-panel border border-white/10 hover:border-purple-500/50 text-left cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${info.badgeBg} ${info.badgeText}`}
                    >
                      {info.name}
                    </span>
                    <span className="text-[10px] text-slate-400 group-hover:text-purple-300 transition">
                      Hear line 🎙️
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-300 line-clamp-2">
                    {info.tagline}
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Native format</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Workflow Diagram Banner */}
        <div className="mt-14 p-5 sm:p-6 rounded-2xl glass-panel border border-white/10 bg-slate-900/50">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            The Content Studio Architecture
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold mb-1">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>One Context</span>
              </div>
              <p className="text-xs text-slate-300">
                Core premise, target demographics, tactical goal & tone guidelines.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
              <div className="flex items-center gap-2 text-pink-400 text-xs font-semibold mb-1">
                <span className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Multiple Platforms</span>
              </div>
              <p className="text-xs text-slate-300">
                Automated adaptation for Instagram, LinkedIn, X, TikTok, and GitHub.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>Multiple Variations</span>
              </div>
              <p className="text-xs text-slate-300">
                Instantly swap between Professional, Storytelling, Bold, and Educational tones.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">
                  4
                </span>
                <span>Human Refinement</span>
              </div>
              <p className="text-xs text-slate-300">
                1-click micro-refinements, inline editing, calendar scheduling, and export.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
