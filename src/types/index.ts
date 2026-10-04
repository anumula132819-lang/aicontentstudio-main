export type SocialPlatform = 'instagram' | 'linkedin' | 'x' | 'tiktok' | 'github';

export type TargetFormat = 
  | 'multi-native' 
  | 'carousel' 
  | 'short-video' 
  | 'thread' 
  | 'audio-podcast' 
  | 'blog-summary';

export interface InstagramContent {
  hook: string;
  caption: string;
  hashtags: string[];
  cta: string;
  visualIdea: string;
}

export interface LinkedInContent {
  hook: string;
  body: string;
  closingQuestion: string;
  hashtags: string[];
}

export interface XContent {
  hook: string;
  tweets: string[];
}

export interface TikTokScene {
  timestamp: string;
  visual: string;
  textOverlay: string;
  voiceover: string;
}

export interface TikTokContent {
  title: string;
  hook: string;
  scenes: TikTokScene[];
  caption: string;
  audioSuggestion: string;
}

export interface GitHubContent {
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  callToAction: string;
}

export interface GenerationResult {
  summary: string;
  instagram: InstagramContent;
  linkedin: LinkedInContent;
  x: XContent;
  tiktok: TikTokContent;
  github: GitHubContent;
  timestamp?: number;
}

export type VariationTone = 'professional' | 'storytelling' | 'bold' | 'educational';

export interface PlatformVariation {
  id: string;
  tone: VariationTone;
  title: string;
  content: string;
  hook: string;
  keyTakeaway: string;
}

export interface CalendarPost {
  id: string;
  platform: SocialPlatform;
  title: string;
  snippet: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: 'scheduled' | 'draft' | 'published';
}

export interface SavedItem {
  id: string;
  platform: SocialPlatform;
  title: string;
  content: string;
  tags: string[];
  savedAt: string;
  sourceIdea: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface VoiceSettings {
  enabled: boolean;
  voiceURI: string;
  volume: number; // 0 to 1
  rate: number;   // 0.8 to 1.5
  pitch: number;  // 0.8 to 1.5
}

export interface SocialAccountSetting {
  platform: SocialPlatform;
  handle: string;
  connected: boolean;
  defaultTime: string;
}

export interface StudioSettings {
  accounts: SocialAccountSetting[];
  timezone: string;
  autoScheduleCadence: 'daily' | 'weekdays' | 'peak-windows';
  aiCreativity: number;
}
