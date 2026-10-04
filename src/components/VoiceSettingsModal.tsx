import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, X, Play, RotateCcw, Check } from 'lucide-react';
import { VoiceSettings } from '../types';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: VoiceSettings;
  onUpdate: (settings: Partial<VoiceSettings>) => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdate,
}) => {
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  if (!isOpen) return null;

  const handleTestVoice = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("Hey there! Ready to create some unforgettable content together?");
    utterance.volume = settings.volume;
    utterance.pitch = settings.pitch;
    utterance.rate = settings.rate;

    if (settings.voiceURI) {
      const selected = availableVoices.find(v => v.voiceURI === settings.voiceURI);
      if (selected) utterance.voice = selected;
    }

    utterance.onstart = () => setIsPlayingTest(true);
    utterance.onend = () => setIsPlayingTest(false);
    utterance.onerror = () => setIsPlayingTest(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleReset = () => {
    onUpdate({
      enabled: true,
      voiceURI: '',
      volume: 1,
      pitch: 1.1,
      rate: 1.0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-6 rounded-2xl glass-panel border border-purple-500/30 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold font-display">Avatar Voice Studio</h3>
              <p className="text-xs text-slate-400">Customize browser speech synthesis for the talking muse</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-sm">
          {/* Enable / Mute Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5">
            <div className="flex items-center gap-2.5">
              {settings.enabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-rose-400" />
              )}
              <div>
                <div className="font-medium text-slate-200">Avatar Voice Reaction</div>
                <div className="text-xs text-slate-400">Speak playfully on social platform clicks</div>
              </div>
            </div>
            <button
              onClick={() => onUpdate({ enabled: !settings.enabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.enabled ? 'bg-purple-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Voice Picker Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Select Voice</label>
            <select
              value={settings.voiceURI}
              onChange={(e) => onUpdate({ voiceURI: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="">Default (Natural Female Voice recommended)</option>
              {availableVoices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang}) {v.default ? '★' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Pitch Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Pitch (Slightly raised recommended)</span>
              <span className="font-mono text-purple-400">{settings.pitch.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.5"
              step="0.1"
              value={settings.pitch}
              onChange={(e) => onUpdate({ pitch: parseFloat(e.target.value) })}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Rate / Speed Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Pacing (Rate)</span>
              <span className="font-mono text-purple-400">{settings.rate.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.4"
              step="0.1"
              value={settings.rate}
              onChange={(e) => onUpdate({ rate: parseFloat(e.target.value) })}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Volume Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Volume</span>
              <span className="font-mono text-purple-400">{Math.round(settings.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              onChange={(e) => onUpdate({ volume: parseFloat(e.target.value) })}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-5 mt-5 border-t border-white/10">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestVoice}
              disabled={isPlayingTest}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition border border-purple-500/30"
            >
              <Play className="w-3.5 h-3.5" />
              {isPlayingTest ? 'Speaking...' : 'Test Voice'}
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium shadow-md transition"
            >
              <Check className="w-3.5 h-3.5" />
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
