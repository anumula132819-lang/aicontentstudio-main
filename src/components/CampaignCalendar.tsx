import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowRight,
  Share2,
  Sliders,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { CalendarPost, SocialPlatform, GenerationResult, StudioSettings } from '../types';
import { PLATFORM_INFO } from '../data/voiceLines';

interface CampaignCalendarProps {
  currentResults?: GenerationResult | null;
  onSelectPostSnippet?: (snippet: string) => void;
  settings?: StudioSettings;
  onOpenSettings?: () => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const CampaignCalendar: React.FC<CampaignCalendarProps> = ({
  currentResults,
  onSelectPostSnippet,
  settings,
  onOpenSettings,
}) => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Initial scheduling state
  const [posts, setPosts] = useState<CalendarPost[]>([
    {
      id: 'post-1',
      platform: 'linkedin',
      title: 'Decentralized Campus Security Audit',
      snippet: '73% of collegiate credentials leaked online in 2025 came from coffee shop Wi-Fi logins...',
      date: 'Monday',
      time: '08:45 AM',
      status: 'scheduled',
    },
    {
      id: 'post-2',
      platform: 'x',
      title: 'Wi-Fi Pineapple Threat Breakdown',
      snippet: '1/ Your campus Wi-Fi is actively leaking your credentials. Not because you clicked a weird link...',
      date: 'Tuesday',
      time: '11:15 AM',
      status: 'scheduled',
    },
    {
      id: 'post-3',
      platform: 'instagram',
      title: 'Free Coffee Shop Wi-Fi Risk Carousel',
      snippet: '🚨 That free coffee shop Wi-Fi might cost you your student loan login...',
      date: 'Wednesday',
      time: '04:30 PM',
      status: 'draft',
    },
    {
      id: 'post-4',
      platform: 'tiktok',
      title: 'Library Wi-Fi Trap Video Hook',
      snippet: 'If you connect to campus Wi-Fi without doing this first, STOP SCROLLING right now...',
      date: 'Thursday',
      time: '06:15 PM',
      status: 'draft',
    },
    {
      id: 'post-5',
      platform: 'github',
      title: 'AegisAI v2.0 Release Notes & Daemon',
      snippet: 'Autonomous Endpoint Threat Detection for Campus Environments with Rust daemon...',
      date: 'Friday',
      time: '10:00 AM',
      status: 'published',
    },
  ]);

  // Form state for creating a new custom schedule
  const [newPlatform, setNewPlatform] = useState<SocialPlatform>('linkedin');
  const [newDay, setNewDay] = useState<string>('Monday');
  const [newTime, setNewTime] = useState<string>('09:00 AM');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSnippet, setNewSnippet] = useState<string>('');
  const [newStatus, setNewStatus] = useState<'scheduled' | 'draft'>('scheduled');

  // Pre-fill from current results if available
  const handlePreFillForPlatform = (plat: SocialPlatform) => {
    setNewPlatform(plat);
    if (!currentResults) return;

    if (plat === 'linkedin') {
      setNewTitle('LinkedIn Strategic Insight');
      setNewSnippet(currentResults.linkedin.hook);
      setNewTime(settings?.accounts.find((a) => a.platform === 'linkedin')?.defaultTime || '08:45 AM');
    } else if (plat === 'x') {
      setNewTitle('𝕏 Viral Distribution Thread');
      setNewSnippet(currentResults.x.hook);
      setNewTime(settings?.accounts.find((a) => a.platform === 'x')?.defaultTime || '11:30 AM');
    } else if (plat === 'instagram') {
      setNewTitle('Instagram Visual Hook & Carousel');
      setNewSnippet(currentResults.instagram.hook);
      setNewTime(settings?.accounts.find((a) => a.platform === 'instagram')?.defaultTime || '06:15 PM');
    } else if (plat === 'tiktok') {
      setNewTitle('TikTok High-Retention Video Hook');
      setNewSnippet(currentResults.tiktok.hook);
      setNewTime(settings?.accounts.find((a) => a.platform === 'tiktok')?.defaultTime || '07:30 PM');
    } else if (plat === 'github') {
      setNewTitle('GitHub Technical Readme & Release');
      setNewSnippet(currentResults.github.tagline);
      setNewTime(settings?.accounts.find((a) => a.platform === 'github')?.defaultTime || '10:00 AM');
    }
  };

  const handleCreateScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const createdPost: CalendarPost = {
      id: `post-custom-${Date.now()}`,
      platform: newPlatform,
      title: newTitle.trim(),
      snippet: newSnippet.trim() || 'No preview snippet provided',
      date: newDay,
      time: newTime.trim() || '09:00 AM',
      status: newStatus,
    };

    setPosts([createdPost, ...posts]);
    setSelectedDay(newDay);
    setIsCreateModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewSnippet('');
  };

  // Auto-schedule generated outputs across the week
  const handleAutoSchedule = () => {
    if (!currentResults) return;
    const newSchedule: CalendarPost[] = [
      {
        id: `auto-li-${Date.now()}`,
        platform: 'linkedin',
        title: 'LinkedIn Thought Leadership',
        snippet: currentResults.linkedin.hook,
        date: 'Monday',
        time: settings?.accounts.find((a) => a.platform === 'linkedin')?.defaultTime || '08:45 AM',
        status: 'scheduled',
      },
      {
        id: `auto-x-${Date.now()}`,
        platform: 'x',
        title: '𝕏 Distribution Thread',
        snippet: currentResults.x.hook,
        date: 'Tuesday',
        time: settings?.accounts.find((a) => a.platform === 'x')?.defaultTime || '11:15 AM',
        status: 'scheduled',
      },
      {
        id: `auto-ig-${Date.now()}`,
        platform: 'instagram',
        title: 'Instagram Carousel Post',
        snippet: currentResults.instagram.hook,
        date: 'Wednesday',
        time: settings?.accounts.find((a) => a.platform === 'instagram')?.defaultTime || '04:30 PM',
        status: 'scheduled',
      },
      {
        id: `auto-tt-${Date.now()}`,
        platform: 'tiktok',
        title: 'TikTok Viral Storyboard',
        snippet: currentResults.tiktok.hook,
        date: 'Thursday',
        time: settings?.accounts.find((a) => a.platform === 'tiktok')?.defaultTime || '06:15 PM',
        status: 'draft',
      },
      {
        id: `auto-gh-${Date.now()}`,
        platform: 'github',
        title: 'GitHub Announcement',
        snippet: currentResults.github.tagline,
        date: 'Friday',
        time: settings?.accounts.find((a) => a.platform === 'github')?.defaultTime || '10:00 AM',
        status: 'published',
      },
    ];
    setPosts(newSchedule);
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setPosts(
      posts.map((p) => {
        if (p.id !== id) return p;
        const nextStatus =
          p.status === 'scheduled' ? 'published' : p.status === 'published' ? 'draft' : 'scheduled';
        return { ...p, status: nextStatus };
      })
    );
  };

  const filteredPosts = posts.filter(
    (p) => platformFilter === 'all' || p.platform === platformFilter
  );

  const selectedDayPosts = filteredPosts.filter((p) => p.date === selectedDay);

  const connectedAccountsCount =
    settings?.accounts.filter((a) => a.connected).length ?? 5;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in text-[#FFF8FC]">
      {/* Header with AI-GENERATED CAMPAIGN Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl studio-card border border-[#3A2347] bg-[#21132B]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="p-2 rounded-xl bg-[#A855F7]/20 text-[#A855F7]">
              <CalendarIcon className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#FFF8FC]">
              Campaign Mode Calendar
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#A855F7]/15 border border-[#A855F7]/40 text-[#F5C451] font-mono font-bold">
              ✦ AI-GENERATED CAMPAIGN
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#55D6A0]/15 text-[#55D6A0] border border-[#55D6A0]/30 font-mono">
              NOT CROSS-POSTED. PLATFORM-ADAPTED.
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#B8A8BE]">
            Orchestrate your multi-platform distribution timeline across interested social media accounts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#160D20] hover:bg-[#21132B] border border-[#3A2347] hover:border-[#A855F7]/50 text-xs font-semibold text-[#B8A8BE] hover:text-[#FFF8FC] transition shadow-sm"
              title="Configure social handles and default times"
            >
              <Sliders className="w-3.5 h-3.5 text-[#F5C451]" />
              <span>Schedule Settings</span>
            </button>
          )}

          <button
            onClick={() => {
              handlePreFillForPlatform(newPlatform);
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#160D20] hover:bg-[#21132B] border border-[#A855F7]/50 text-xs font-semibold text-[#FFF8FC] shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>+ Create Time Schedule</span>
          </button>

          <button
            onClick={handleAutoSchedule}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C026D3] hover:brightness-105 text-[#FFF8FC] text-xs font-semibold shadow-md transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F5C451]" />
            <span>Auto-Schedule Campaign</span>
          </button>
        </div>
      </div>

      {/* Clear Dashboard Overview (4 scannable stat cards so users don't get confused) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl studio-card border border-[#3A2347] bg-[#160D20]">
          <div className="text-[11px] font-semibold text-[#B8A8BE] uppercase tracking-wider">
            Total Scheduled
          </div>
          <div className="text-2xl font-bold font-mono text-[#FFF8FC] mt-1 tabular-nums">
            {posts.length} Posts
          </div>
          <div className="text-[10px] text-[#55D6A0] mt-0.5 font-mono">
            {posts.filter((p) => p.status === 'scheduled').length} pending · {posts.filter((p) => p.status === 'published').length} active
          </div>
        </div>

        <div className="p-4 rounded-2xl studio-card border border-[#3A2347] bg-[#160D20]">
          <div className="text-[11px] font-semibold text-[#B8A8BE] uppercase tracking-wider">
            Connected Accounts
          </div>
          <div className="text-2xl font-bold font-mono text-[#F472B6] mt-1 tabular-nums">
            {connectedAccountsCount} / 5
          </div>
          <div className="text-[10px] text-[#B8A8BE] mt-0.5">
            LinkedIn, 𝕏, IG, TikTok, GH
          </div>
        </div>

        <div className="p-4 rounded-2xl studio-card border border-[#3A2347] bg-[#160D20]">
          <div className="text-[11px] font-semibold text-[#B8A8BE] uppercase tracking-wider">
            Next Up Slot
          </div>
          <div className="text-sm font-bold text-[#F5C451] mt-1.5 truncate">
            {posts[0]?.platform ? PLATFORM_INFO[posts[0].platform]?.name : 'LinkedIn'} • {posts[0]?.time || '08:45 AM'}
          </div>
          <div className="text-[10px] text-[#B8A8BE] mt-0.5 font-mono truncate">
            {posts[0]?.date || 'Monday'}
          </div>
        </div>

        <div className="p-4 rounded-2xl studio-card border border-[#3A2347] bg-[#160D20]">
          <div className="text-[11px] font-semibold text-[#B8A8BE] uppercase tracking-wider">
            Timezone Sync
          </div>
          <div className="text-sm font-bold text-[#FFF8FC] mt-1.5 truncate font-mono">
            {settings?.timezone.split(' ')[0] || 'America/New_York'}
          </div>
          <div className="text-[10px] text-[#55D6A0] mt-0.5 flex items-center gap-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#55D6A0] animate-pulse" />
            <span>Optimal windows synced</span>
          </div>
        </div>
      </div>

      {/* Compact Visual Flow: ONE IDEA → Instagram → LinkedIn → X → TikTok → GitHub */}
      <div className="p-4 rounded-2xl studio-card border border-[#3A2347] bg-[#160D20]/80">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-[#A855F7]/20 border border-[#A855F7]/40 text-[#F5C451] font-bold font-display uppercase tracking-wide">
              ONE IDEA
            </span>
            <ArrowRight className="w-4 h-4 text-[#B8A8BE]" />
          </div>

          <div className="flex flex-wrap items-center gap-2 overflow-x-auto py-1">
            {(['instagram', 'linkedin', 'x', 'tiktok', 'github'] as SocialPlatform[]).map(
              (plat, index, arr) => {
                const info = PLATFORM_INFO[plat];
                const platPost = posts.find((p) => p.platform === plat);
                return (
                  <React.Fragment key={plat}>
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold"
                      style={{
                        backgroundColor: `${info.color}15`,
                        borderColor: `${info.color}40`,
                        color: '#FFF8FC',
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: info.color }}
                      />
                      <span>{info.name}</span>
                      {platPost && (
                        <span className="text-[10px] opacity-75 font-mono">
                          ({platPost.date.slice(0, 3)} {platPost.time})
                        </span>
                      )}
                    </div>
                    {index < arr.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-[#3A2347] hidden sm:inline" />
                    )}
                  </React.Fragment>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* Platform Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-xs text-[#B8A8BE] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          <button
            onClick={() => setPlatformFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              platformFilter === 'all'
                ? 'bg-[#A855F7] text-white font-semibold shadow-sm'
                : 'bg-[#160D20] text-[#B8A8BE] hover:text-[#FFF8FC] border border-[#3A2347]'
            }`}
          >
            All Channels ({posts.length})
          </button>
          {(['instagram', 'linkedin', 'x', 'tiktok', 'github'] as SocialPlatform[]).map((plat) => {
            const info = PLATFORM_INFO[plat];
            const count = posts.filter((p) => p.platform === plat).length;
            const active = platformFilter === plat;
            return (
              <button
                key={plat}
                onClick={() => setPlatformFilter(plat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
                  active
                    ? 'text-white font-semibold shadow-sm border'
                    : 'bg-[#160D20] text-[#B8A8BE] hover:text-[#FFF8FC] border border-[#3A2347]'
                }`}
                style={
                  active
                    ? { backgroundColor: info.color, borderColor: info.color }
                    : {}
                }
              >
                <span>{info.name}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Week Day Strips (with prominent selected day) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
        {DAYS_OF_WEEK.map((day) => {
          const dayPosts = filteredPosts.filter((p) => p.date === day);
          const isSelected = selectedDay === day;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-gradient-to-b from-[#A855F7]/30 to-[#21132B] border-[#A855F7] shadow-xl shadow-[#A855F7]/20 scale-[1.03] ring-1 ring-[#A855F7]/50'
                  : 'studio-card border-[#3A2347] bg-[#160D20] hover:border-[#A855F7]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-bold ${isSelected ? 'text-[#F5C451]' : 'text-[#FFF8FC]'}`}>
                  {day.slice(0, 3)}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? 'bg-[#A855F7] text-white font-bold'
                      : 'bg-white/10 text-[#B8A8BE]'
                  }`}
                >
                  {dayPosts.length}
                </span>
              </div>
              <div className="flex -space-x-1 mt-2">
                {dayPosts.map((p) => (
                  <span
                    key={p.id}
                    className="w-3.5 h-3.5 rounded-full border border-[#0D0814] shadow-sm"
                    style={{ backgroundColor: PLATFORM_INFO[p.platform]?.color || '#888' }}
                    title={`${PLATFORM_INFO[p.platform]?.name}: ${p.time}`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Agenda View */}
      <div className="rounded-3xl studio-card border border-[#3A2347] bg-[#21132B] p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#3A2347] gap-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#A855F7]" />
            <h3 className="font-bold text-sm sm:text-base text-[#FFF8FC] font-display">
              Schedule for {selectedDay}
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#A855F7]/20 text-[#F5C451] font-mono">
              {selectedDayPosts.length} Slots Active
            </span>
          </div>

          <button
            onClick={() => {
              setNewDay(selectedDay);
              handlePreFillForPlatform(newPlatform);
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#160D20] hover:bg-[#3A2347] border border-[#3A2347] text-xs font-semibold text-[#FFF8FC] transition"
          >
            <Plus className="w-3.5 h-3.5 text-[#F472B6]" />
            <span>Add Slot for {selectedDay}</span>
          </button>
        </div>

        <div className="space-y-3">
          {selectedDayPosts.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#160D20] border border-[#3A2347]/50 space-y-2">
              <div className="text-sm font-semibold text-[#B8A8BE]">
                No posts scheduled for {selectedDay} yet
              </div>
              <p className="text-xs text-[#B8A8BE]/70 max-w-md mx-auto">
                Click "+ Create Time Schedule" to plan a post for an interested social media account, or click "Auto-Schedule Campaign" above to distribute your generated outputs.
              </p>
            </div>
          ) : (
            selectedDayPosts.map((post) => {
              const info = PLATFORM_INFO[post.platform] || PLATFORM_INFO.instagram;

              return (
                <div
                  key={post.id}
                  className="p-4 rounded-2xl bg-[#160D20] border border-[#3A2347] hover:border-[#A855F7]/50 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0 mt-0.5 shadow"
                      style={{ backgroundColor: info.color }}
                    >
                      {info.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-[#FFF8FC]">{post.title}</span>
                        <button
                          onClick={() => handleToggleStatus(post.id)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition cursor-pointer ${
                            post.status === 'published'
                              ? 'bg-[#55D6A0]/20 text-[#55D6A0] border-[#55D6A0]/40'
                              : post.status === 'scheduled'
                              ? 'bg-[#A855F7]/20 text-[#F5C451] border-[#A855F7]/40'
                              : 'bg-white/10 text-[#B8A8BE] border-white/20'
                          }`}
                          title="Click to toggle status (Scheduled / Published / Draft)"
                        >
                          {post.status.toUpperCase()}
                        </button>
                      </div>
                      <p className="text-xs text-[#B8A8BE] mt-1 line-clamp-1 max-w-xl">
                        {post.snippet}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="flex items-center gap-1.5 text-xs text-[#FFF8FC] font-mono px-2.5 py-1 rounded-lg bg-[#21132B] border border-[#3A2347]">
                      <Clock className="w-3.5 h-3.5 text-[#F472B6]" />
                      <span>{post.time}</span>
                    </div>

                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 rounded-lg text-[#B8A8BE] hover:text-rose-400 hover:bg-white/5 transition"
                      title="Delete slot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* CREATE TIME SCHEDULE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl studio-card border border-[#3A2347] bg-[#21132B] shadow-2xl p-6 space-y-5 text-xs text-[#FFF8FC]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#3A2347]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#A855F7]/20 text-[#A855F7]">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base font-display text-[#FFF8FC]">
                    Create Time Schedule for Social Account
                  </h3>
                  <p className="text-[11px] text-[#B8A8BE]">
                    Plan upcoming post distribution for your target audience
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-[#B8A8BE] hover:text-white hover:bg-white/5 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateScheduleSubmit} className="space-y-4">
              {/* Interested Social Media Account Selector */}
              <div>
                <label className="text-[11px] font-semibold text-[#F5C451] uppercase tracking-wider block mb-1.5">
                  Interested Social Media Account
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['linkedin', 'x', 'instagram', 'tiktok', 'github'] as SocialPlatform[]).map((plat) => {
                    const info = PLATFORM_INFO[plat];
                    const isSelected = newPlatform === plat;
                    return (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => handlePreFillForPlatform(plat)}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition ${
                          isSelected
                            ? 'bg-[#A855F7]/20 border-[#A855F7] text-white shadow'
                            : 'bg-[#160D20] border-[#3A2347] text-[#B8A8BE] hover:border-white/20'
                        }`}
                      >
                        <div
                          className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold text-white"
                          style={{ backgroundColor: info.color }}
                        >
                          {info.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-[10px] font-medium truncate max-w-full">{info.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Day of Week & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#B8A8BE] uppercase tracking-wider block mb-1">
                    Day of Week
                  </label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#160D20] border border-[#3A2347] text-xs text-[#FFF8FC] focus:border-[#A855F7] focus:outline-none"
                  >
                    {DAYS_OF_WEEK.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#B8A8BE] uppercase tracking-wider block mb-1">
                    Scheduled Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#F472B6]" />
                    <input
                      type="text"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      placeholder="e.g. 09:00 AM"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#160D20] border border-[#3A2347] text-xs text-[#FFF8FC] font-mono focus:border-[#A855F7] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Post Title */}
              <div>
                <label className="text-[11px] font-semibold text-[#B8A8BE] uppercase tracking-wider block mb-1">
                  Post Title / Subject
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Campus Wi-Fi Security Awareness Carousel"
                  required
                  className="w-full p-2.5 rounded-xl bg-[#160D20] border border-[#3A2347] text-xs text-[#FFF8FC] focus:border-[#A855F7] focus:outline-none"
                />
              </div>

              {/* Content / Snippet */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-[#B8A8BE] uppercase tracking-wider">
                    Copy Snippet / Hook
                  </label>
                  {currentResults && (
                    <button
                      type="button"
                      onClick={() => handlePreFillForPlatform(newPlatform)}
                      className="text-[10px] text-[#A855F7] hover:text-[#F472B6] transition flex items-center gap-1 font-mono"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Sync from AI results</span>
                    </button>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={newSnippet}
                  onChange={(e) => setNewSnippet(e.target.value)}
                  placeholder="Paste or write the hook, key caption excerpt, or talking points..."
                  className="w-full p-2.5 rounded-xl bg-[#160D20] border border-[#3A2347] text-xs text-[#FFF8FC] focus:border-[#A855F7] focus:outline-none"
                />
              </div>

              {/* Status */}
              <div>
                <label className="text-[11px] font-semibold text-[#B8A8BE] uppercase tracking-wider block mb-1">
                  Status
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStatus('scheduled')}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition ${
                      newStatus === 'scheduled'
                        ? 'bg-[#A855F7]/20 border-[#A855F7] text-[#F5C451]'
                        : 'bg-[#160D20] border-[#3A2347] text-[#B8A8BE]'
                    }`}
                  >
                    Scheduled
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus('draft')}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition ${
                      newStatus === 'draft'
                        ? 'bg-white/10 border-white/30 text-white'
                        : 'bg-[#160D20] border-[#3A2347] text-[#B8A8BE]'
                    }`}
                  >
                    Draft
                  </button>
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#3A2347]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#160D20] hover:bg-[#3A2347] text-[#B8A8BE] hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C026D3] text-white font-semibold shadow-md hover:brightness-105 transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save to Schedule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
