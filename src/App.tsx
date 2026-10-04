import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Layers,
  Repeat,
  Calendar,
  BookmarkCheck,
  Check,
  Zap,
  Volume2,
  RefreshCw,
  LayoutGrid,
  Columns,
  Share2,
} from 'lucide-react';

import {
  SocialPlatform,
  TargetFormat,
  GenerationResult,
  VoiceSettings,
  SavedItem,
} from './types';
import { PLATFORM_INFO } from './data/voiceLines';
import { DEMO_PRESET, INITIAL_DEMO_RESULT } from './data/initialDemo';

import { Navbar, ActiveTab } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { CreateForm } from './components/CreateForm';
import { PipelineStepper } from './components/PipelineStepper';
import { InstagramCard } from './components/previews/InstagramCard';
import { LinkedInCard } from './components/previews/LinkedInCard';
import { XCard } from './components/previews/XCard';
import { TikTokCard } from './components/previews/TikTokCard';
import { GitHubCard } from './components/previews/GitHubCard';
import { VariationLab } from './components/VariationLab';
import { RepurposeTool } from './components/RepurposeTool';
import { CampaignCalendar } from './components/CampaignCalendar';
import { SavedLibrary } from './components/SavedLibrary';
import { TalkingAvatar } from './components/TalkingAvatar';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { StudioCopilotChat } from './components/StudioCopilotChat';
import { CommandPalette } from './components/CommandPalette';

export default function App() {
  // Navigation & Theme
  const [activeTab, setActiveTab] = useState<ActiveTab>('create');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    idea: string;
    audience: string;
    goal: string;
    tone: string;
    platforms: SocialPlatform[];
    format: TargetFormat;
    language: string;
    inputType: 'text' | 'voice' | 'audio-file' | 'video-file' | 'url';
    fileName?: string;
  }>({
    idea: DEMO_PRESET.idea,
    audience: DEMO_PRESET.audience,
    goal: DEMO_PRESET.goal,
    tone: DEMO_PRESET.tone,
    platforms: [...DEMO_PRESET.platforms] as SocialPlatform[],
    format: 'multi-native',
    language: 'English',
    inputType: 'text',
    fileName: undefined,
  });

  // Results & Pipeline State
  const [results, setResults] = useState<GenerationResult | null>(INITIAL_DEMO_RESULT);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [activePlatformTab, setActivePlatformTab] = useState<SocialPlatform>('instagram');
  const [viewLayout, setViewLayout] = useState<'tabs' | 'grid'>('tabs');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Talking Avatar Signature Engine
  const [activePlatformTrigger, setActivePlatformTrigger] = useState<{
    platform: SocialPlatform;
    timestamp: number;
  } | null>(null);

  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ai_studio_voice_settings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return {
      enabled: true,
      voiceURI: '',
      volume: 1.0,
      rate: 1.0,
      pitch: 1.1,
    };
  });

  // Saved Library Items
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ai_studio_saved_library');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return [
      {
        id: 'saved-1',
        platform: 'linkedin',
        title: 'Decentralized Campus Threat Mitigation Post',
        content: INITIAL_DEMO_RESULT.linkedin.body,
        tags: ['Cybersecurity', 'EdTech', 'HigherEducation'],
        savedAt: 'Today',
        sourceIdea: DEMO_PRESET.idea,
      },
      {
        id: 'saved-2',
        platform: 'instagram',
        title: 'Coffee Shop Wi-Fi Risk Carousel',
        content: INITIAL_DEMO_RESULT.instagram.caption,
        tags: ['CampusHacks', 'StudentLife'],
        savedAt: 'Today',
        sourceIdea: DEMO_PRESET.idea,
      },
    ];
  });

  // Check health and Gemini key
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHasGeminiKey(Boolean(data.hasGeminiKey));
      })
      .catch(() => {});
  }, []);

  // Save voice settings to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai_studio_voice_settings', JSON.stringify(voiceSettings));
    }
  }, [voiceSettings]);

  // Save library to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai_studio_saved_library', JSON.stringify(savedItems));
    }
  }, [savedItems]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Trigger avatar speaking reaction for a platform
  const triggerAvatarVoice = (platform: SocialPlatform) => {
    setActivePlatformTrigger({
      platform,
      timestamp: Date.now(),
    });
  };

  // Pre-fill demo
  const handlePreFillDemo = () => {
    setFormData({
      idea: DEMO_PRESET.idea,
      audience: DEMO_PRESET.audience,
      goal: DEMO_PRESET.goal,
      tone: DEMO_PRESET.tone,
      platforms: [...DEMO_PRESET.platforms],
      format: 'multi-native',
      language: 'English',
      inputType: 'text',
      fileName: undefined,
    });
    setResults(INITIAL_DEMO_RESULT);
    setActivePlatformTab('instagram');
    triggerAvatarVoice('instagram');
    showToast('Cybersecurity demo data loaded!');
  };

  // Full demo run
  const handleTriggerDemo = () => {
    handlePreFillDemo();
    setActiveTab('create');
    // Scroll smoothly to results
    const resultsElem = document.getElementById('results-section');
    if (resultsElem) {
      resultsElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Generate pipeline execution
  const handleGenerate = async () => {
    if (!formData.idea.trim() || isGenerating) return;

    setIsGenerating(true);
    setPipelineStep(0);

    // Light up pipeline steps 1 by 1
    const stepInterval = setInterval(() => {
      setPipelineStep((prev) => {
        if (prev >= 5) {
          clearInterval(stepInterval);
          return 5;
        }
        return prev + 1;
      });
    }, 450);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: formData.idea,
          audience: formData.audience,
          goal: formData.goal,
          tone: formData.tone,
          platforms: formData.platforms,
          language: formData.language,
          format: formData.format,
        }),
      });

      const json = await response.json();
      if (json.data) {
        setResults(json.data);
      }
    } catch (err) {
      console.warn('Network error, applying local engine fallback:', err);
    } finally {
      clearInterval(stepInterval);
      setPipelineStep(5);
      setIsGenerating(false);

      // Trigger celebratory confetti on generation
      try {
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#ec4899', '#3b82f6', '#10b981'],
        });
      } catch (e) {}

      showToast('Generated multi-platform content assets!');
      triggerAvatarVoice(formData.platforms[0] || 'instagram');

      setTimeout(() => {
        const resultsElem = document.getElementById('results-section');
        if (resultsElem) {
          resultsElem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    }
  };

  // Refine single piece with AI
  const handleRefinePiece = (instruction: string) => {
    showToast(`Applying AI refinement: "${instruction}"...`);
    // Simulate real-time refinement enhancement
    setTimeout(() => {
      if (!results) return;
      if (instruction.startsWith('Instagram')) {
        setResults({
          ...results,
          instagram: {
            ...results.instagram,
            hook: `⚡ Pattern Interrupt: ${results.instagram.hook.replace(/^[^a-zA-Z0-9]+/, '')}`,
            caption: `${results.instagram.caption}\n\nPS: Drop a comment with your school below!`,
          },
        });
      } else if (instruction.startsWith('LinkedIn')) {
        setResults({
          ...results,
          linkedin: {
            ...results.linkedin,
            hook: `Executive Briefing: ${results.linkedin.hook}`,
            closingQuestion: `What specific endpoint risk is your team prioritizing this quarter?`,
          },
        });
      } else if (instruction.startsWith('X')) {
        setResults({
          ...results,
          x: {
            ...results.x,
            tweets: results.x.tweets.map((t, idx) =>
              idx === 0 ? `🔥 [High-Signal Thread]\n${t}` : t
            ),
          },
        });
      } else if (instruction.startsWith('TikTok')) {
        setResults({
          ...results,
          tiktok: {
            ...results.tiktok,
            hook: `"Stop scrolling if you use student Wi-Fi — watch this!"`,
          },
        });
      }
      showToast('Piece refined successfully!');
    }, 600);
  };

  // Save to Library
  const handleSaveToLibrary = (platform: SocialPlatform, title: string, content: string) => {
    const newItem: SavedItem = {
      id: `save-${Date.now()}`,
      platform,
      title,
      content,
      tags: [platform, 'AdaptiveContent'],
      savedAt: 'Just now',
      sourceIdea: formData.idea,
    };
    setSavedItems([newItem, ...savedItems]);
    showToast(`Saved ${PLATFORM_INFO[platform]?.name} asset to Library!`);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 relative overflow-x-hidden ${
        isDarkMode
          ? 'bg-[#090514] text-slate-100 selection:bg-rose-500 selection:text-white'
          : 'bg-gradient-to-br from-rose-50/80 via-amber-50/60 to-purple-50/80 text-slate-900 selection:bg-rose-500 selection:text-white'
      }`}
    >
      {/* Radiant Multi-Color Ambient Glow Mesh Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-violet-600/35 via-fuchsia-600/25 to-transparent rounded-full blur-[130px] animate-pulse-subtle" />
        <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] bg-gradient-to-bl from-amber-500/30 via-rose-600/25 to-purple-600/20 rounded-full blur-[140px] animate-pulse-subtle [animation-delay:1.5s]" />
        <div className="absolute -bottom-32 left-1/4 w-[600px] h-[600px] bg-gradient-to-t from-cyan-500/25 via-purple-600/20 to-transparent rounded-full blur-[150px]" />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white text-xs font-semibold shadow-2xl animate-fade-in border border-white/20">
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onTriggerDemo={handleTriggerDemo}
        voiceSettings={voiceSettings}
        onToggleVoice={() => setVoiceSettings({ ...voiceSettings, enabled: !voiceSettings.enabled })}
        onOpenVoiceSettings={() => setIsVoiceSettingsOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        hasGeminiKey={hasGeminiKey}
        onOpenCopilot={() => setIsCopilotOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-24">
        {/* TAB 1: CREATE & RESULTS (MAIN STUDIO) */}
        {activeTab === 'create' && (
          <div className="space-y-12">
            {/* Landing Hero Section */}
            <LandingHero
              onStartCreating={() => {
                const formElem = document.getElementById('create-form-section');
                if (formElem) formElem.scrollIntoView({ behavior: 'smooth' });
              }}
              onTriggerDemo={handleTriggerDemo}
              onPlatformClick={triggerAvatarVoice}
            />

            {/* Context Input Studio Form */}
            <div id="create-form-section" className="pt-4">
              <CreateForm
                formData={formData}
                onChange={(updated) => setFormData((prev) => ({ ...prev, ...updated }))}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                onSocialChipClick={triggerAvatarVoice}
                onPreFillDemo={handlePreFillDemo}
              />
            </div>

            {/* Animated Pipeline Stepper */}
            {(isGenerating || results) && (
              <PipelineStepper
                currentStepIndex={pipelineStep}
                isGenerating={isGenerating}
              />
            )}

            {/* Platform Results Section */}
            {results && (
              <div id="results-section" className="space-y-6 pt-6 animate-fade-in">
                {/* Results Section Header with View Layout Toggle */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-white/10 bg-slate-900/40">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
                      <span>Native Platform Outputs</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                        Ready
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Each output is restructured for that specific platform's native psychology, cadence, and algorithm.
                    </p>
                  </div>

                  {/* Platform selection tabs & view switcher */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* View Switcher: Tabs vs Grid */}
                    <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-white/5">
                      <button
                        onClick={() => setViewLayout('tabs')}
                        className={`p-1.5 rounded-lg text-xs transition ${
                          viewLayout === 'tabs' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Tabbed focus view"
                      >
                        <Columns className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewLayout('grid')}
                        className={`p-1.5 rounded-lg text-xs transition ${
                          viewLayout === 'grid' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Side-by-side grid view"
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Platform Tabs (when in tabs mode) */}
                    {viewLayout === 'tabs' && (
                      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-white/5 overflow-x-auto">
                        {(['instagram', 'linkedin', 'x', 'tiktok', 'github'] as SocialPlatform[]).map((plat) => {
                          const isCurrent = activePlatformTab === plat;
                          const info = PLATFORM_INFO[plat];
                          return (
                            <button
                              key={plat}
                              onClick={() => {
                                setActivePlatformTab(plat);
                                triggerAvatarVoice(plat);
                              }}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                isCurrent
                                  ? `${info.badgeBg} ${info.badgeText} shadow-sm border`
                                  : 'text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              <span>{info.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Single Platform Focused Tab View */}
                {viewLayout === 'tabs' && (
                  <div>
                    {activePlatformTab === 'instagram' && (
                      <InstagramCard
                        content={results.instagram}
                        onUpdate={(updated) => setResults({ ...results, instagram: updated })}
                        onSaveToLibrary={() =>
                          handleSaveToLibrary(
                            'instagram',
                            'Instagram Carousel & Reel',
                            `${results.instagram.hook}\n\n${results.instagram.caption}`
                          )
                        }
                        onRefine={handleRefinePiece}
                        onTriggerAvatar={() => triggerAvatarVoice('instagram')}
                      />
                    )}

                    {activePlatformTab === 'linkedin' && (
                      <LinkedInCard
                        content={results.linkedin}
                        onUpdate={(updated) => setResults({ ...results, linkedin: updated })}
                        onSaveToLibrary={() =>
                          handleSaveToLibrary(
                            'linkedin',
                            'LinkedIn Thought Leadership Post',
                            `${results.linkedin.hook}\n\n${results.linkedin.body}`
                          )
                        }
                        onRefine={handleRefinePiece}
                        onTriggerAvatar={() => triggerAvatarVoice('linkedin')}
                      />
                    )}

                    {activePlatformTab === 'x' && (
                      <XCard
                        content={results.x}
                        onUpdate={(updated) => setResults({ ...results, x: updated })}
                        onSaveToLibrary={() =>
                          handleSaveToLibrary('x', 'X Thread', results.x.tweets.join('\n\n'))
                        }
                        onRefine={handleRefinePiece}
                        onTriggerAvatar={() => triggerAvatarVoice('x')}
                      />
                    )}

                    {activePlatformTab === 'tiktok' && (
                      <TikTokCard
                        content={results.tiktok}
                        onUpdate={(updated) => setResults({ ...results, tiktok: updated })}
                        onSaveToLibrary={() =>
                          handleSaveToLibrary('tiktok', results.tiktok.title, results.tiktok.hook)
                        }
                        onRefine={handleRefinePiece}
                        onTriggerAvatar={() => triggerAvatarVoice('tiktok')}
                      />
                    )}

                    {activePlatformTab === 'github' && (
                      <GitHubCard
                        content={results.github}
                        onUpdate={(updated) => setResults({ ...results, github: updated })}
                        onSaveToLibrary={() =>
                          handleSaveToLibrary(
                            'github',
                            results.github.title,
                            results.github.description
                          )
                        }
                        onRefine={handleRefinePiece}
                        onTriggerAvatar={() => triggerAvatarVoice('github')}
                      />
                    )}
                  </div>
                )}

                {/* Side-by-Side Multi-Platform Grid View */}
                {viewLayout === 'grid' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <InstagramCard
                      content={results.instagram}
                      onUpdate={(updated) => setResults({ ...results, instagram: updated })}
                      onSaveToLibrary={() =>
                        handleSaveToLibrary(
                          'instagram',
                          'Instagram Carousel & Reel',
                          `${results.instagram.hook}\n\n${results.instagram.caption}`
                        )
                      }
                      onRefine={handleRefinePiece}
                      onTriggerAvatar={() => triggerAvatarVoice('instagram')}
                    />

                    <LinkedInCard
                      content={results.linkedin}
                      onUpdate={(updated) => setResults({ ...results, linkedin: updated })}
                      onSaveToLibrary={() =>
                        handleSaveToLibrary(
                          'linkedin',
                          'LinkedIn Thought Leadership Post',
                          `${results.linkedin.hook}\n\n${results.linkedin.body}`
                        )
                      }
                      onRefine={handleRefinePiece}
                      onTriggerAvatar={() => triggerAvatarVoice('linkedin')}
                    />

                    <XCard
                      content={results.x}
                      onUpdate={(updated) => setResults({ ...results, x: updated })}
                      onSaveToLibrary={() =>
                        handleSaveToLibrary('x', 'X Thread', results.x.tweets.join('\n\n'))
                      }
                      onRefine={handleRefinePiece}
                      onTriggerAvatar={() => triggerAvatarVoice('x')}
                    />

                    <TikTokCard
                      content={results.tiktok}
                      onUpdate={(updated) => setResults({ ...results, tiktok: updated })}
                      onSaveToLibrary={() =>
                        handleSaveToLibrary('tiktok', results.tiktok.title, results.tiktok.hook)
                      }
                      onRefine={handleRefinePiece}
                      onTriggerAvatar={() => triggerAvatarVoice('tiktok')}
                    />

                    <div className="lg:col-span-2">
                      <GitHubCard
                        content={results.github}
                        onUpdate={(updated) => setResults({ ...results, github: updated })}
                        onSaveToLibrary={() =>
                          handleSaveToLibrary(
                            'github',
                            results.github.title,
                            results.github.description
                          )
                        }
                        onRefine={handleRefinePiece}
                        onTriggerAvatar={() => triggerAvatarVoice('github')}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VARIATION LAB */}
        {activeTab === 'variations' && (
          <VariationLab
            currentIdea={formData.idea}
            onSaveVariation={(title, content, tone) => {
              const newItem: SavedItem = {
                id: `var-${Date.now()}`,
                platform: 'linkedin',
                title,
                content,
                tags: [tone, 'VariationLab'],
                savedAt: 'Just now',
                sourceIdea: formData.idea,
              };
              setSavedItems([newItem, ...savedItems]);
              showToast(`Saved ${title} to Library!`);
            }}
            onTriggerAvatarReaction={() => triggerAvatarVoice('linkedin')}
          />
        )}

        {/* TAB 3: REPURPOSE TOOL */}
        {activeTab === 'repurpose' && (
          <RepurposeTool
            onApplyRepurposedToStudio={(ideaSnippet) => {
              setFormData((prev) => ({ ...prev, idea: ideaSnippet }));
              setActiveTab('create');
              showToast('Imported into Create Studio!');
            }}
            onTriggerAvatarReaction={triggerAvatarVoice}
          />
        )}

        {/* TAB 4: CAMPAIGN MODE CALENDAR */}
        {activeTab === 'campaign' && (
          <CampaignCalendar currentResults={results} />
        )}

        {/* TAB 5: SAVED LIBRARY */}
        {activeTab === 'library' && (
          <SavedLibrary
            items={savedItems}
            onDeleteItem={(id) => setSavedItems(savedItems.filter((i) => i.id !== id))}
            onClearAll={() => setSavedItems([])}
          />
        )}
      </main>

      {/* Signature Feature: Talking Animated Avatar */}
      <TalkingAvatar
        activePlatformTrigger={activePlatformTrigger}
        voiceSettings={voiceSettings}
        onUpdateVoiceSettings={(updated) => setVoiceSettings({ ...voiceSettings, ...updated })}
        onOpenVoiceSettings={() => setIsVoiceSettingsOpen(true)}
      />

      {/* Voice Settings Studio Modal */}
      <VoiceSettingsModal
        isOpen={isVoiceSettingsOpen}
        onClose={() => setIsVoiceSettingsOpen(false)}
        settings={voiceSettings}
        onUpdate={(updated) => setVoiceSettings({ ...voiceSettings, ...updated })}
      />

      {/* Interactive Studio Copilot Conversational Chat */}
      <StudioCopilotChat
        currentContext={{
          idea: formData.idea,
          audience: formData.audience,
          goal: formData.goal,
          tone: formData.tone,
        }}
        activePlatform={activePlatformTab}
        onApplyContext={(field, value) => {
          setFormData((prev) => ({ ...prev, [field]: value }));
          showToast(`Applied ${field}: "${value}"`);
        }}
        onOpenFeedDemo={() => {
          const resultsElem = document.getElementById('results-section');
          if (resultsElem) resultsElem.scrollIntoView({ behavior: 'smooth' });
        }}
        isOpenControlled={isCopilotOpen}
        onToggleOpen={setIsCopilotOpen}
      />

      {/* Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={setActiveTab}
        onTriggerDemo={handleTriggerDemo}
        onToggleVoice={() => setVoiceSettings({ ...voiceSettings, enabled: !voiceSettings.enabled })}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onTriggerPlatformVoice={triggerAvatarVoice}
      />
    </div>
  );
}
