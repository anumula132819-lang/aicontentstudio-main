import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Upload,
  Link as LinkIcon,
  Sparkles,
  FileText,
  Video,
  Music,
  Check,
  ChevronDown,
  Globe,
  Zap,
} from 'lucide-react';
import { SocialPlatform, TargetFormat } from '../types';
import { PLATFORM_INFO } from '../data/voiceLines';
import { SUPPORTED_LANGUAGES, detectLanguageFromText, SupportedLanguage } from '../data/languages';

interface CreateFormData {
  idea: string;
  audience: string;
  goal: string;
  tone: string;
  platforms: SocialPlatform[];
  format: TargetFormat;
  language: string;
  inputType: 'text' | 'voice' | 'audio-file' | 'video-file' | 'url';
  fileName?: string;
}

interface CreateFormProps {
  formData: CreateFormData;
  onChange: (data: Partial<CreateFormData>) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  onSocialChipClick: (platform: SocialPlatform) => void;
  onPreFillDemo: () => void;
}

const AUDIENCE_SUGGESTIONS = [
  'College students & Gen-Z builders',
  'Founders, VCs & Tech Executives',
  'Software Engineers & Open-Source Devs',
  'B2B SaaS Growth Marketers',
  'Casual Consumers & Mobile Shoppers',
  'Creatives, Designers & Solopreneurs',
];

const GOAL_SUGGESTIONS = [
  'Awareness & Viral Reach',
  'Lead Generation & Waitlist Signups',
  'Product Launch & Feature Announcement',
  'Thought Leadership & Industry Authority',
  'Community Engagement & Discussion',
  'Sales Conversion & Direct CTA',
];

const TONE_SUGGESTIONS = [
  'Professional but engaging',
  'Bold, punchy & contrarian',
  'Educational, tactical & structured',
  'Vulnerable, human & storytelling',
  'Humorous, witty & meme-infused',
  'Visionary & inspiring',
];

const FORMAT_OPTIONS: { id: TargetFormat; label: string; desc: string }[] = [
  { id: 'multi-native', label: 'Multi-Native', desc: 'Platform-optimized formats' },
  { id: 'carousel', label: 'Visual Carousel', desc: 'Slide-by-slide copy & cues' },
  { id: 'short-video', label: 'Short Video Script', desc: 'Hook + scene-by-scene script' },
  { id: 'thread', label: 'Punchy Thread', desc: 'High-density numbered sequence' },
  { id: 'audio-podcast', label: 'Audio / Podcast', desc: 'Spoken cadence with pauses' },
  { id: 'blog-summary', label: 'Briefing / Summary', desc: 'High-signal executive synthesis' },
];

export const CreateForm: React.FC<CreateFormProps> = ({
  formData,
  onChange,
  onGenerate,
  isGenerating,
  onSocialChipClick,
  onPreFillDemo,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [detectedLang, setDetectedLang] = useState<SupportedLanguage>(SUPPORTED_LANGUAGES[0]);
  const [activeTabInput, setActiveTabInput] = useState<'text' | 'voice' | 'file' | 'url'>('text');
  const [urlInput, setUrlInput] = useState('');
  const [urlLoading, setUrlLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // State for active suggestions drawer
  const [activeSuggestionField, setActiveSuggestionField] = useState<'audience' | 'goal' | 'tone' | null>(null);
  const [suggestionList, setSuggestionList] = useState<{ title: string; description: string }[]>([]);
  const [isSuggestingLoading, setIsSuggestingLoading] = useState(false);

  // Fetch or populate suggestions for Audience, Goal, or Tone
  const handleOpenSuggestions = async (field: 'audience' | 'goal' | 'tone') => {
    if (activeSuggestionField === field) {
      setActiveSuggestionField(null);
      return;
    }
    setActiveSuggestionField(field);
    setIsSuggestingLoading(true);

    try {
      const res = await fetch('/api/suggest-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: formData.idea, field }),
      });
      const data = await res.json();
      if (data.suggestions) {
        setSuggestionList(data.suggestions);
      }
    } catch (e) {
      // Fallback suggestions
      const localPresets: Record<string, { title: string; description: string }[]> = {
        audience: [
          { title: 'College Students & Campus Builders', description: 'Tech-savvy students navigating campus networks and peer recommendations.' },
          { title: 'Founders, CISOs & IT Leaders', description: 'Decision-makers looking for friction-free endpoint security and compliance.' },
          { title: 'Early-Career Developers & Remote Workers', description: 'Independent builders frequently working from cafes, co-working spaces, and transit.' },
          { title: 'Digital Privacy Advocates & Everyday Users', description: 'Consumers seeking automated peace of mind without technical complexity.' },
        ],
        goal: [
          { title: 'Viral Awareness & Campus Word-of-Mouth', description: 'Drive high-velocity social sharing, relatable comments, and peer bookmarks.' },
          { title: 'Product Launch & Waitlist Signups', description: 'Convert curiosity into verified .edu email registrations and early-access downloads.' },
          { title: 'Thought Leadership & Category Creation', description: 'Establish that decentralized endpoint security is the new paradigm over corporate VPNs.' },
          { title: 'Community Engagement & Discussion', description: 'Ignite passionate debate around personal Wi-Fi privacy and cybersecurity traps.' },
        ],
        tone: [
          { title: 'Professional but Engaging & Relatable', description: 'Authoritative security data delivered with approachable, peer-to-peer clarity.' },
          { title: 'Bold, Contrarian & Pattern-Interrupting', description: 'Call out outdated security advice to stop scrolling and challenge conventional wisdom.' },
          { title: 'Educational, Step-by-Step & Actionable', description: 'Practical checklists, cheat sheets, and tactical frameworks students can use today.' },
          { title: 'Storytelling, Human & Vulnerable', description: 'Narrative-driven personal anecdotes that connect emotionally before introducing the solution.' },
        ],
      };
      setSuggestionList(localPresets[field] || localPresets.audience);
    } finally {
      setIsSuggestingLoading(false);
    }
  };

  // Auto-detect language when user types or speaks
  useEffect(() => {
    if (formData.idea && formData.idea.trim().length > 10) {
      const detected = detectLanguageFromText(formData.idea);
      setDetectedLang(detected);
    }
  }, [formData.idea]);

  // Handle Speech Recognition
  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = formData.language === 'English' ? 'en-US' : 'auto';

      recognition.onstart = () => {
        setIsRecording(true);
        onChange({ inputType: 'voice' });
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        if (transcript.trim()) {
          onChange({ idea: transcript.trim() });
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (e) {
        console.warn('Recognition start failed:', e);
        setIsRecording(false);
      }
    } else {
      alert('Speech recognition is not supported in this browser environment. You can paste audio transcripts directly!');
    }
  };

  // Simulate file upload (Audio or Video)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.includes('video') || file.name.endsWith('.mp4');
    const isAudio = file.type.includes('audio') || file.name.endsWith('.mp3') || file.name.endsWith('.wav');

    const sampleTranscripts: Record<string, string> = {
      video: `Video transcription extracted from "${file.name}": We built a zero-latency campus security shield for students. It stops fake access point eavesdropping, protects exam credentials, and saves student accounts with AI heuristics.`,
      audio: `Audio recording transcribed from "${file.name}": Hey team, quick voice note on our product launch. Let's position this as the ultimate cybersecurity guardian for college students who study at coffee shops and dorms.`,
    };

    onChange({
      idea: isVideo ? sampleTranscripts.video : sampleTranscripts.audio,
      inputType: isVideo ? 'video-file' : 'audio-file',
      fileName: file.name,
    });
  };

  // URL extraction simulation
  const handleFetchUrl = () => {
    if (!urlInput.trim()) return;
    setUrlLoading(true);
    setTimeout(() => {
      onChange({
        idea: `Source extracted from ${urlInput}: Autonomous cybersecurity platform engineered for student and remote worker endpoint protection. Prevents credential harvesting on public Wi-Fi hotspots using on-device ML anomaly detection.`,
        inputType: 'url',
      });
      setUrlLoading(false);
      setUrlInput('');
    }, 600);
  };

  // Toggle platform selection chip
  const togglePlatform = (plat: SocialPlatform) => {
    onSocialChipClick(plat); // Trigger avatar voice reaction
    const current = [...formData.platforms];
    const exists = current.includes(plat);
    if (exists) {
      if (current.length === 1) return; // Keep at least one
      onChange({ platforms: current.filter((p) => p !== plat) });
    } else {
      onChange({ platforms: [...current, plat] });
    }
  };

  const platformsList: SocialPlatform[] = ['instagram', 'linkedin', 'x', 'tiktok', 'github'];

  // Dynamic progress stepper calculation
  const hasIdea = Boolean(formData.idea.trim());
  const hasAudience = Boolean(formData.audience.trim());
  const hasGoal = Boolean(formData.goal.trim());
  const hasTone = Boolean(formData.tone.trim());
  const hasPlatforms = formData.platforms.length > 0;

  const currentStep = !hasIdea
    ? 0
    : !hasAudience
    ? 1
    : !hasGoal
    ? 2
    : !hasTone
    ? 3
    : !hasPlatforms
    ? 4
    : 5;

  const workflowSteps = [
    { num: '01', label: 'Context', isDone: hasIdea },
    { num: '02', label: 'Audience', isDone: hasAudience },
    { num: '03', label: 'Goal', isDone: hasGoal },
    { num: '04', label: 'Brand Voice', isDone: hasTone },
    { num: '05', label: 'Platforms', isDone: hasPlatforms },
    { num: '06', label: 'Generate', isDone: isGenerating },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl studio-card p-6 sm:p-8 relative">
      {/* Clean Premium Progress Stepper */}
      <div className="mb-7 pb-5 border-b border-[#3A2347]">
        <div className="flex items-center justify-between overflow-x-auto gap-2 pb-2">
          {workflowSteps.map((step, idx) => {
            const isCurrent = currentStep === idx;
            const isCompleted = step.isDone && !isCurrent;
            const isLast = idx === workflowSteps.length - 1;

            return (
              <React.Fragment key={step.num}>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all ${
                      isCurrent
                        ? 'bg-[#A855F7]/25 text-[#F5C451] border border-[#A855F7] font-bold shadow-sm'
                        : isCompleted
                        ? 'bg-[#55D6A0]/15 text-[#55D6A0] border border-[#55D6A0]/30 font-medium'
                        : 'bg-[#160D20] text-[#B8A8BE]/60 border border-[#3A2347]'
                    }`}
                  >
                    <span>{step.num}</span>
                    <span className="font-sans font-medium text-[11px]">{step.label}</span>
                    {isCompleted && <Check className="w-3 h-3 stroke-[2.5]" />}
                  </div>
                </div>
                {!isLast && (
                  <span className="text-[#3A2347] text-xs shrink-0 select-none">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Form Header with Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-[#3A2347]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-[#FFF8FC] flex items-center gap-2.5">
            <span>Context Input Studio</span>
            <span className="px-2 py-0.5 rounded-full bg-[#A855F7]/20 text-[#A855F7] text-xs font-mono font-normal border border-[#A855F7]/30">
              Multimodal
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#B8A8BE] mt-1">
            Provide the underlying premise. The engine maps it to platform algorithms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPreFillDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#160D20] hover:bg-[#21132B] border border-[#3A2347] hover:border-[#A855F7]/50 text-[#F5C451] text-xs font-semibold transition"
          >
            <Zap className="w-3.5 h-3.5 fill-[#F5C451] text-[#F5C451]" />
            <span>Pre-fill Cybersecurity Demo</span>
          </button>
        </div>
      </div>

      {/* Input Mode Selector Bar */}
      <div className="flex items-center gap-2 mb-4 p-1 rounded-xl bg-slate-950/60 border border-white/5 w-fit">
        <button
          type="button"
          onClick={() => setActiveTabInput('text')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTabInput === 'text' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Text & Premise</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTabInput('voice');
            toggleRecording();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            isRecording
              ? 'bg-rose-600 text-white animate-pulse'
              : activeTabInput === 'voice'
              ? 'bg-purple-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          <span>{isRecording ? 'Listening...' : 'Voice Dictate'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTabInput('file');
            fileInputRef.current?.click();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTabInput === 'file' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Audio/Video</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTabInput('url')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTabInput === 'url' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>URL Ingest</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,video/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* URL Ingestion Field if active */}
      {activeTabInput === 'url' && (
        <div className="flex gap-2 mb-4 animate-fade-in">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste blog post, article or documentation URL (e.g. https://...)"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="button"
            onClick={handleFetchUrl}
            disabled={urlLoading}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition"
          >
            {urlLoading ? 'Parsing...' : 'Extract'}
          </button>
        </div>
      )}

      {/* Main Core Idea Textarea */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            1. Core Idea / Product Breakthrough *
          </label>

          {/* Detected input type & language badge */}
          {formData.idea && (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-white/10 text-[11px] text-slate-300">
              <span className="flex items-center gap-1 text-purple-400 font-medium">
                {formData.inputType === 'voice' && <Mic className="w-3 h-3 text-rose-400" />}
                {formData.inputType === 'audio-file' && <Music className="w-3 h-3 text-amber-400" />}
                {formData.inputType === 'video-file' && <Video className="w-3 h-3 text-cyan-400" />}
                {formData.inputType === 'url' && <LinkIcon className="w-3 h-3 text-blue-400" />}
                {formData.inputType === 'text' && <FileText className="w-3 h-3 text-emerald-400" />}
                <span className="capitalize">{formData.inputType.replace('-', ' ')}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <span>{detectedLang.flag}</span>
                <span>{detectedLang.name}</span>
                <span className="text-slate-500 text-[10px]">(Detected)</span>
              </span>
            </div>
          )}
        </div>

        <div className="relative">
          <textarea
            rows={4}
            value={formData.idea}
            onChange={(e) => onChange({ idea: e.target.value, inputType: 'text' })}
            placeholder="E.g. AI-powered cybersecurity platform that protects college students from phishing scams and campus Wi-Fi eavesdropping in real-time..."
            className="w-full p-4 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-white/20 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm text-slate-100 placeholder-slate-500 transition resize-y font-sans"
          />

          {isRecording && (
            <div className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-medium animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Transcribing live speech...</span>
            </div>
          )}
        </div>
      </div>

      {/* Grid of 3 Context Dimensions: Audience, Goal, Tone */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Audience */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              2. Target Audience
            </label>
            <button
              type="button"
              onClick={() => handleOpenSuggestions('audience')}
              className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 hover:underline"
              title="Suggest audience ideas based on your idea"
            >
              <Sparkles className="w-2.5 h-2.5 text-pink-400" />
              <span>Suggest Ideas</span>
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              value={formData.audience}
              onChange={(e) => onChange({ audience: e.target.value })}
              placeholder="E.g. College students, founders..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          {/* Quick chips */}
          <div className="flex flex-wrap gap-1 mt-1">
            {AUDIENCE_SUGGESTIONS.slice(0, 3).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onChange({ audience: item })}
                className="px-2 py-0.5 rounded text-[10px] bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-white/5 transition truncate max-w-[140px]"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              3. Tactical Goal
            </label>
            <button
              type="button"
              onClick={() => handleOpenSuggestions('goal')}
              className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 hover:underline"
              title="Suggest strategic goals for this post"
            >
              <Sparkles className="w-2.5 h-2.5 text-pink-400" />
              <span>Suggest Goals</span>
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              value={formData.goal}
              onChange={(e) => onChange({ goal: e.target.value })}
              placeholder="E.g. Awareness + promotion..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          {/* Quick chips */}
          <div className="flex flex-wrap gap-1 mt-1">
            {GOAL_SUGGESTIONS.slice(0, 3).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onChange({ goal: item })}
                className="px-2 py-0.5 rounded text-[10px] bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-white/5 transition truncate max-w-[140px]"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Brand Voice / Tone */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              4. Brand Voice / Tone
            </label>
            <button
              type="button"
              onClick={() => handleOpenSuggestions('tone')}
              className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 hover:underline"
              title="Suggest tone and brand voices"
            >
              <Sparkles className="w-2.5 h-2.5 text-pink-400" />
              <span>Suggest Voices</span>
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              value={formData.tone}
              onChange={(e) => onChange({ tone: e.target.value })}
              placeholder="E.g. Professional but engaging..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          {/* Quick chips */}
          <div className="flex flex-wrap gap-1 mt-1">
            {TONE_SUGGESTIONS.slice(0, 3).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onChange({ tone: item })}
                className="px-2 py-0.5 rounded text-[10px] bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-white/5 transition truncate max-w-[140px]"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Suggestions Drawer when a suggest button is clicked */}
      {activeSuggestionField && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/30 text-left animate-fade-in shadow-xl">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-display">
                Maya's AI Ideas for{' '}
                {activeSuggestionField === 'audience'
                  ? 'Target Audience'
                  : activeSuggestionField === 'goal'
                  ? 'Tactical Goal'
                  : 'Brand Voice'}
              </span>
            </div>
            <button
              onClick={() => setActiveSuggestionField(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕ Close
            </button>
          </div>

          {isSuggestingLoading ? (
            <div className="p-4 text-center text-xs text-purple-300 italic flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-pink-400" />
              <span>Brainstorming tailored ideas for your idea...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {suggestionList.map((sug, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (activeSuggestionField === 'audience') onChange({ audience: sug.title });
                    if (activeSuggestionField === 'goal') onChange({ goal: sug.title });
                    if (activeSuggestionField === 'tone') onChange({ tone: sug.title });
                    setActiveSuggestionField(null);
                  }}
                  className="p-3 rounded-xl bg-slate-950/80 border border-white/10 hover:border-purple-400 hover:bg-purple-900/20 cursor-pointer transition group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-purple-300 transition">
                      {sug.title}
                    </span>
                    <span className="text-[10px] text-purple-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                      Apply →
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {sug.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Target Format & Language Override */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pt-4 border-t border-white/5">
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            Target Format Adaptation
          </label>
          <select
            value={formData.format}
            onChange={(e) => onChange({ format: e.target.value as TargetFormat })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-purple-500"
          >
            {FORMAT_OPTIONS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label} — {f.desc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            Output Language (Translate & Localize)
          </label>
          <select
            value={formData.language}
            onChange={(e) => onChange({ language: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-purple-500"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.name}>
                {l.flag} {l.name} ({l.nativeName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Platform Multi-Select Chips (With signature avatar voice trigger!) */}
      <div className="space-y-2 mb-8">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            5. Select Target Platforms (Click to toggle & listen to avatar reaction)
          </label>
          <span className="text-[11px] text-purple-400">
            {formData.platforms.length} selected
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {platformsList.map((plat) => {
            const isSelected = formData.platforms.includes(plat);
            const info = PLATFORM_INFO[plat];

            return (
              <button
                key={plat}
                type="button"
                onClick={() => togglePlatform(plat)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                  isSelected
                    ? `${info.badgeBg} ${info.badgeText} shadow-md scale-[1.02]`
                    : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? 'bg-purple-400' : 'bg-slate-600'
                  }`}
                />
                <span>{info.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Big Generate Content Button: Standardized Primary */}
      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating || !formData.idea.trim()}
        className={`w-full py-4 rounded-xl font-bold font-display text-base tracking-wide flex items-center justify-center gap-3 transition-all duration-200 shadow-md ${
          isGenerating || !formData.idea.trim()
            ? 'bg-[#160D20] text-[#B8A8BE]/50 cursor-not-allowed border border-[#3A2347]'
            : 'bg-gradient-to-r from-[#A855F7] to-[#C026D3] hover:brightness-105 text-[#FFF8FC] shadow-[#C026D3]/25 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
        }`}
      >
        <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
        <span>
          {isGenerating
            ? 'Processing in AI Content Engine...'
            : 'Generate Platform-Adapted Content'}
        </span>
      </button>
    </div>
  );
};
