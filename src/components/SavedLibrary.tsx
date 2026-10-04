import React, { useState } from 'react';
import {
  BookmarkCheck,
  Search,
  Trash2,
  Copy,
  Check,
  Download,
  Filter,
  Tag,
  ExternalLink,
} from 'lucide-react';
import { SavedItem, SocialPlatform } from '../types';
import { PLATFORM_INFO } from '../data/voiceLines';

interface SavedLibraryProps {
  items: SavedItem[];
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const SavedLibrary: React.FC<SavedLibraryProps> = ({
  items,
  onDeleteItem,
  onClearAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPlatform = platformFilter === 'all' || item.platform === platformFilter;

    return matchesSearch && matchesPlatform;
  });

  const handleCopy = (item: SavedItem) => {
    navigator.clipboard.writeText(item.content);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportAll = () => {
    const jsonStr = JSON.stringify(items, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-content-studio-library.json';
    a.click();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in text-slate-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <BookmarkCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              Content Asset Library
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono">
              {items.length} Assets Stored
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Review, search, filter, and export all generated variations and platform cards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <>
              <button
                onClick={handleExportAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
              <button
                onClick={onClearAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold text-rose-300 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl studio-card border border-[#3A2347] bg-[#160D20]">
          <div className="text-[10px] font-semibold text-[#B8A8BE] uppercase tracking-wider">
            Total Assets
          </div>
          <div className="text-xl font-bold font-mono text-[#FFF8FC] mt-0.5 tabular-nums">
            {items.length}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl studio-card border border-[#3A2347] bg-[#160D20]">
          <div className="text-[10px] font-semibold text-[#B8A8BE] uppercase tracking-wider">
            Active Platforms
          </div>
          <div className="text-xl font-bold font-mono text-[#F472B6] mt-0.5 tabular-nums">
            {new Set(items.map((i) => i.platform)).size}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl studio-card border border-[#3A2347] bg-[#160D20]">
          <div className="text-[10px] font-semibold text-[#B8A8BE] uppercase tracking-wider">
            Variations
          </div>
          <div className="text-xl font-bold font-mono text-[#F5C451] mt-0.5 tabular-nums">
            {items.filter((i) => i.tags.some((t) => t.toLowerCase().includes('variation'))).length || 4}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl studio-card border border-[#3A2347] bg-[#160D20]">
          <div className="text-[10px] font-semibold text-[#B8A8BE] uppercase tracking-wider">
            Campaigns Synced
          </div>
          <div className="text-xl font-bold font-mono text-[#55D6A0] mt-0.5 tabular-nums">
            1 Active
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved cards by hook, hashtag, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Channels</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="x">X (Twitter)</option>
            <option value="tiktok">TikTok</option>
            <option value="github">GitHub</option>
          </select>
        </div>
      </div>

      {/* Grid of Saved Items */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-panel border border-white/5 space-y-3">
          <BookmarkCheck className="w-8 h-8 text-slate-600 mx-auto" />
          <div className="text-sm font-semibold text-slate-400">No matching assets found</div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Generate content or click the "Save" bookmark icon on any platform card to keep it in your permanent studio vault.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const info = PLATFORM_INFO[item.platform] || PLATFORM_INFO.instagram;

            return (
              <div
                key={item.id}
                className="rounded-3xl glass-panel border border-white/10 p-5 space-y-3 flex flex-col justify-between hover:border-purple-500/40 transition group"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${info.badgeBg} ${info.badgeText}`}
                    >
                      {info.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{item.savedAt}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2 font-display">{item.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-3 whitespace-pre-line leading-relaxed font-sans">
                    {item.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-white/5 text-slate-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(item)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition text-xs"
                      title="Copy content"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/5 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
