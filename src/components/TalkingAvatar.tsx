import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, X, Sparkles, Settings2 } from 'lucide-react';
import { SocialPlatform, VoiceSettings } from '../types';
import { getRandomVoiceLine, PLATFORM_INFO } from '../data/voiceLines';

interface TalkingAvatarProps {
  activePlatformTrigger?: { platform: SocialPlatform; timestamp: number } | null;
  voiceSettings: VoiceSettings;
  onUpdateVoiceSettings: (settings: Partial<VoiceSettings>) => void;
  onOpenVoiceSettings: () => void;
}

export const TalkingAvatar: React.FC<TalkingAvatarProps> = ({
  activePlatformTrigger,
  voiceSettings,
  onUpdateVoiceSettings,
  onOpenVoiceSettings,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [spokenLine, setSpokenLine] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [currentPlatform, setCurrentPlatform] = useState<SocialPlatform>('instagram');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [mouthShape, setMouthShape] = useState<'neutral' | 'open' | 'smile' | 'round'>('neutral');

  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mouthTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger avatar appearance whenever activePlatformTrigger changes
  useEffect(() => {
    if (!activePlatformTrigger) return;
    const { platform } = activePlatformTrigger;
    setCurrentPlatform(platform);

    const line = getRandomVoiceLine(platform);
    setSpokenLine(line);
    setDisplayedText('');
    setIsVisible(true);

    // Stop previous timers and speech
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    if (mouthTimerRef.current) clearInterval(mouthTimerRef.current);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // Type out the line with a typewriter effect
    let charIndex = 0;
    typingTimerRef.current = setInterval(() => {
      charIndex++;
      setDisplayedText(line.slice(0, charIndex));
      if (charIndex >= line.length) {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      }
    }, 28);

    // Speak aloud using browser SpeechSynthesis if not muted
    if (voiceSettings.enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(line);
      utterance.volume = voiceSettings.volume;
      utterance.rate = voiceSettings.rate;
      utterance.pitch = voiceSettings.pitch;

      // Select chosen voice or best available female-sounding voice
      const voices = window.speechSynthesis.getVoices();
      if (voiceSettings.voiceURI) {
        const found = voices.find((v) => v.voiceURI === voiceSettings.voiceURI);
        if (found) utterance.voice = found;
      } else {
        // Find natural female English voice as default
        const femaleVoice = voices.find(
          (v) =>
            (v.name.toLowerCase().includes('female') ||
              v.name.toLowerCase().includes('samantha') ||
              v.name.toLowerCase().includes('victoria') ||
              v.name.toLowerCase().includes('zira') ||
              v.name.toLowerCase().includes('natural') ||
              v.name.toLowerCase().includes('karen')) &&
            v.lang.startsWith('en')
        );
        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setMouthShape('smile');
        // Auto-dismiss 3 seconds after speaking concludes
        dismissTimerRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 3200);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setMouthShape('neutral');
        dismissTimerRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 3500);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // If voice is muted, keep bubble visible for read time and then slide away
      const readingTime = Math.max(3000, line.length * 65);
      dismissTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, readingTime);
    }

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, [activePlatformTrigger]);

  // Sync mouth movement while speaking
  useEffect(() => {
    if (isSpeaking) {
      const shapes: ('open' | 'round' | 'smile' | 'neutral')[] = ['open', 'round', 'smile', 'open', 'neutral'];
      let idx = 0;
      mouthTimerRef.current = setInterval(() => {
        idx = (idx + 1) % shapes.length;
        setMouthShape(shapes[idx]);
      }, 140);
    } else {
      if (mouthTimerRef.current) clearInterval(mouthTimerRef.current);
      setMouthShape(isVisible ? 'smile' : 'neutral');
    }

    return () => {
      if (mouthTimerRef.current) clearInterval(mouthTimerRef.current);
    };
  }, [isSpeaking, isVisible]);

  // Idle blinking effect every 3-5 seconds
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 160);
    }, 3800);

    return () => clearInterval(blinkInterval);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const platformInfo = PLATFORM_INFO[currentPlatform] || PLATFORM_INFO.instagram;

  return (
    <div className="fixed bottom-5 right-5 z-50 pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.85 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="flex flex-col items-end pointer-events-auto max-w-sm sm:max-w-md"
          >
            {/* Speech Bubble */}
            <div className="relative mb-3 mr-4 p-4 rounded-2xl shadow-2xl glass-panel border border-purple-500/30 text-white backdrop-blur-xl">
              {/* Header inside bubble */}
              <div className="flex items-center justify-between gap-3 mb-2 pb-1.5 border-b border-white/10 text-xs">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className={platformInfo.badgeText}>{platformInfo.name}</span>
                  <span className="text-slate-400">• Studio Muse</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateVoiceSettings({ enabled: !voiceSettings.enabled })}
                    className="p-1 text-slate-400 hover:text-white transition-colors rounded hover:bg-white/10"
                    title={voiceSettings.enabled ? 'Mute avatar voice' : 'Unmute avatar voice'}
                  >
                    {voiceSettings.enabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-rose-400" />}
                  </button>
                  <button
                    onClick={onOpenVoiceSettings}
                    className="p-1 text-slate-400 hover:text-white transition-colors rounded hover:bg-white/10"
                    title="Voice settings"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="p-1 text-slate-400 hover:text-rose-400 transition-colors rounded hover:bg-white/10"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Typed Voice Line Content */}
              <p className="text-sm font-medium text-slate-100 leading-relaxed font-sans min-h-[40px]">
                {displayedText}
                {displayedText.length < spokenLine.length && (
                  <span className="inline-block w-1.5 h-4 ml-0.5 bg-purple-400 animate-pulse align-middle" />
                )}
              </p>

              {/* Speech bubble arrow pointing down */}
              <div className="absolute -bottom-2 right-12 w-4 h-4 bg-slate-900 border-r border-b border-purple-500/30 transform rotate-45" />
            </div>

            {/* Avatar Character Character (Displaying the 3D Girl Avatar with speaking ripples) */}
            <div className="relative group cursor-pointer" onClick={() => onUpdateVoiceSettings({ enabled: !voiceSettings.enabled })}>
              {/* Outer Radiant Glow Halo */}
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 rounded-full blur-md opacity-80 group-hover:opacity-100 transition duration-300 animate-pulse" />

              {/* Avatar Frame */}
              <div className="relative w-22 h-22 sm:w-26 sm:h-26 rounded-full bg-slate-950 p-1 border-2 border-amber-400 shadow-2xl overflow-hidden">
                <img
                  src="/copilot-avatar.jpg"
                  alt="Maya Muse"
                  className={`w-full h-full object-cover object-top rounded-full transition-transform duration-300 ${
                    isSpeaking ? 'scale-105' : 'scale-100 group-hover:scale-105'
                  }`}
                />

                {/* Animated speech ripples when speaking */}
                {isSpeaking && (
                  <div className="absolute inset-0 rounded-full border-2 border-amber-300 animate-ping opacity-60 pointer-events-none" />
                )}

                {/* Sound waves badge when speaking */}
                {isSpeaking && (
                  <div className="absolute bottom-1 right-2 flex items-center gap-0.5 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full px-2 py-0.5 shadow-md">
                    <span className="w-1 h-2 bg-white rounded-full animate-bounce" />
                    <span className="w-1 h-3.5 bg-white rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                )}
              </div>

              {/* Status indicator tag */}
              <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-950 border border-amber-400/60 text-[10px] font-semibold text-amber-300 shadow-xl flex items-center gap-1 whitespace-nowrap">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>{isSpeaking ? 'Maya Speaking' : 'Maya Muse'}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
