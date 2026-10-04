import React, { useState } from 'react';
import {
  X,
  Settings,
  Clock,
  Share2,
  Check,
  Shield,
  Sliders,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { StudioSettings, SocialAccountSetting, SocialPlatform } from '../types';
import { PLATFORM_INFO } from '../data/voiceLines';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StudioSettings;
  onSaveSettings: (settings: StudioSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [localSettings, setLocalSettings] = useState<StudioSettings>(settings);
  const [activeTab, setActiveTab] = useState<'accounts' | 'schedules' | 'ai'>('accounts');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAccountChange = (index: number, updates: Partial<SocialAccountSetting>) => {
    const updatedAccounts = [...localSettings.accounts];
    updatedAccounts[index] = { ...updatedAccounts[index], ...updates };
    setLocalSettings({ ...localSettings, accounts: updatedAccounts });
  };

  const handleSave = () => {
    onSaveSettings(localSettings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const timezones = [
    'America/New_York (EST/EDT)',
    'America/Los_Angeles (PST/PDT)',
    'America/Chicago (CST/CDT)',
    'Europe/London (GMT/BST)',
    'Europe/Berlin (CET)',
    'Asia/Kolkata (IST)',
    'Asia/Tokyo (JST)',
    'UTC',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl studio-card border border-[#3A2347] bg-[#21132B] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#160D20] border-b border-[#3A2347] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#A855F7]/20 text-[#A855F7]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-[#FFF8FC]">
                Studio &amp; Social Account Settings
              </h2>
              <p className="text-xs text-[#B8A8BE]">
                Configure connected accounts, default time schedules, and distribution rules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#B8A8BE] hover:text-[#FFF8FC] hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="px-6 pt-3 bg-[#160D20]/50 border-b border-[#3A2347] flex items-center gap-2">
          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'accounts'
                ? 'border-[#A855F7] text-[#FFF8FC] bg-[#21132B]'
                : 'border-transparent text-[#B8A8BE] hover:text-[#FFF8FC]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-[#F472B6]" />
            <span>Social Accounts</span>
          </button>
          <button
            onClick={() => setActiveTab('schedules')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'schedules'
                ? 'border-[#A855F7] text-[#FFF8FC] bg-[#21132B]'
                : 'border-transparent text-[#B8A8BE] hover:text-[#FFF8FC]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#F5C451]" />
            <span>Time Schedule Preferences</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'ai'
                ? 'border-[#A855F7] text-[#FFF8FC] bg-[#21132B]'
                : 'border-transparent text-[#B8A8BE] hover:text-[#FFF8FC]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>Distribution &amp; Engine</span>
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#FFF8FC]">
          {activeTab === 'accounts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F5C451] uppercase tracking-wider">
                  Target Social Media Channels &amp; Profiles
                </span>
                <span className="text-[11px] text-[#55D6A0] font-mono">
                  {localSettings.accounts.filter((a) => a.connected).length} of {localSettings.accounts.length} Connected
                </span>
              </div>

              <div className="space-y-3">
                {localSettings.accounts.map((acc, idx) => {
                  const platInfo = PLATFORM_INFO[acc.platform] || PLATFORM_INFO.instagram;
                  return (
                    <div
                      key={acc.platform}
                      className="p-3.5 rounded-2xl bg-[#160D20] border border-[#3A2347] flex items-center justify-between gap-3 hover:border-[#A855F7]/40 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow shrink-0"
                          style={{ backgroundColor: platInfo.color }}
                        >
                          {platInfo.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-[#FFF8FC] flex items-center gap-1.5">
                            <span>{platInfo.name}</span>
                            {acc.connected ? (
                              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#55D6A0]/15 text-[#55D6A0] border border-[#55D6A0]/30 font-mono">
                                Active
                              </span>
                            ) : (
                              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/5 text-[#B8A8BE] font-mono">
                                Paused
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-[#B8A8BE] mt-0.5">
                            <span>Handle:</span>
                            <input
                              type="text"
                              value={acc.handle}
                              onChange={(e) => handleAccountChange(idx, { handle: e.target.value })}
                              className="px-2 py-0.5 rounded-lg bg-[#21132B] border border-[#3A2347] text-xs text-[#FFF8FC] focus:border-[#A855F7] focus:outline-none w-36 sm:w-44"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAccountChange(idx, { connected: !acc.connected })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                            acc.connected
                              ? 'bg-[#55D6A0]/15 text-[#55D6A0] border border-[#55D6A0]/30 hover:bg-[#55D6A0]/25'
                              : 'bg-white/5 text-[#B8A8BE] border border-white/10 hover:text-white'
                          }`}
                        >
                          {acc.connected ? 'Connected' : 'Connect'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'schedules' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#160D20] border border-[#3A2347] space-y-1">
                <span className="text-xs font-bold text-[#F5C451] uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#F5C451]" />
                  <span>Timezone &amp; Global Calendar Synchronization</span>
                </span>
                <p className="text-[11px] text-[#B8A8BE]">
                  All scheduled publication slots automatically align with your audience's prime peak attention windows.
                </p>
                <div className="pt-2">
                  <select
                    value={localSettings.timezone}
                    onChange={(e) => setLocalSettings({ ...localSettings, timezone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#21132B] border border-[#3A2347] text-xs text-[#FFF8FC] focus:border-[#A855F7] focus:outline-none"
                  >
                    {timezones.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="text-xs font-bold text-[#FFF8FC] uppercase tracking-wider block">
                  Default Platform Time Schedules
                </span>
                {localSettings.accounts.map((acc, idx) => {
                  const platInfo = PLATFORM_INFO[acc.platform] || PLATFORM_INFO.instagram;
                  return (
                    <div
                      key={acc.platform}
                      className="p-3 rounded-xl bg-[#160D20] border border-[#3A2347] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] text-white"
                          style={{ backgroundColor: platInfo.color }}
                        >
                          {platInfo.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-xs text-[#FFF8FC]">{platInfo.name}</span>
                          <span className="text-[10px] text-[#B8A8BE] block font-mono">
                            Optimal: {platInfo.name === 'LinkedIn' ? '08:45 AM (Workday Start)' : platInfo.name === 'X' ? '11:30 AM (Lunch Rush)' : platInfo.name === 'Instagram' ? '06:15 PM (Evening Commute)' : platInfo.name === 'TikTok' ? '07:45 PM (Prime Leisure)' : '10:00 AM (Sprint Review)'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#F472B6]" />
                        <input
                          type="text"
                          value={acc.defaultTime}
                          onChange={(e) => handleAccountChange(idx, { defaultTime: e.target.value })}
                          placeholder="e.g. 09:00 AM"
                          className="px-2.5 py-1 rounded-lg bg-[#21132B] border border-[#3A2347] text-xs text-[#FFF8FC] font-mono focus:border-[#A855F7] focus:outline-none w-24 text-center"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#160D20] border border-[#3A2347] space-y-3">
                <span className="text-xs font-bold text-[#F472B6] uppercase tracking-wider block">
                  Auto-Schedule Cadence Rules
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'daily', title: 'Daily Distribution', desc: '1 platform post per calendar day' },
                    { id: 'weekdays', title: 'Mon - Fri Only', desc: 'Concentrate on professional workdays' },
                    { id: 'peak-windows', title: 'High-Impact Windows', desc: 'Sync precisely with algorithm peaks' },
                  ].map((cadence) => (
                    <button
                      key={cadence.id}
                      type="button"
                      onClick={() =>
                        setLocalSettings({
                          ...localSettings,
                          autoScheduleCadence: cadence.id as any,
                        })
                      }
                      className={`p-3 rounded-xl border text-left transition ${
                        localSettings.autoScheduleCadence === cadence.id
                          ? 'bg-[#A855F7]/15 border-[#A855F7] text-[#FFF8FC]'
                          : 'bg-[#21132B] border-[#3A2347] text-[#B8A8BE] hover:border-white/20'
                      }`}
                    >
                      <div className="font-semibold text-xs text-[#FFF8FC]">{cadence.title}</div>
                      <div className="text-[10px] text-[#B8A8BE] mt-0.5">{cadence.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#160D20] border border-[#3A2347] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F5C451] uppercase tracking-wider">
                    AI Studio Adaptation Intensity
                  </span>
                  <span className="text-xs font-mono text-[#F5C451] font-bold">
                    {localSettings.aiCreativity}%
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  step={5}
                  value={localSettings.aiCreativity}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, aiCreativity: Number(e.target.value) })
                  }
                  className="w-full accent-[#A855F7] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#B8A8BE]">
                  <span>Faithful &amp; Direct</span>
                  <span>Balanced &amp; Native</span>
                  <span>Hyper-Creative &amp; Viral</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-[#160D20] border-t border-[#3A2347] flex items-center justify-between">
          <div className="text-[11px] text-[#B8A8BE]">
            All schedules &amp; accounts save automatically to local studio storage.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#21132B] hover:bg-[#3A2347] border border-[#3A2347] text-xs font-medium text-[#FFF8FC] transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C026D3] hover:brightness-105 text-xs font-semibold text-[#FFF8FC] shadow-md transition"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#55D6A0]" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Preferences</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
