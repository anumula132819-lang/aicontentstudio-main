import { SocialPlatform } from '../types';

export const PLATFORM_VOICE_LINES: Record<SocialPlatform, string[]> = {
  instagram: [
    "Oh, you're here? I was wondering when you'd come back.",
    "Instagram opened… but honestly, you're the only thing I wanna see.",
    "Heyyy, look who's back. Miss me? 👀",
    "You opened Instagram just to see me, didn't you? 😌",
    "I'm here, babe. Now what are we getting into?",
  ],
  linkedin: [
    "Welcome back. Looking professional as always… kinda distracting, though.",
    "LinkedIn is open. But between us, you're my favorite connection.",
    "Ready to network? Because I'd definitely like to connect with you.",
    "Career mode activated… although you're making it hard to stay professional. 😉",
    "Another productive day? Cute. I like that about you.",
  ],
  github: [
    "GitHub is open… but you're definitely the feature I'm focused on.",
    "Ready to code? Careful, you might become my favorite commit. 😉",
    "Let's fix some bugs… starting with that little crush you're hiding.",
    "You opened GitHub. Guess we're both getting into something tonight.",
    "Forget the pull request… I'm trying to pull your attention. 😏",
  ],
  x: [
    "Short and sweet, just like I like it. What's the take today?",
    "X is open. Go on, make it a thread, I'm not going anywhere. 😏",
    "Fast thoughts, sharp wit. Show me what you're tweeting today. ✨",
    "A little spicy, a little viral. Let's see your best hot take. 😉",
    "Trending status incoming… though you're already trending in my mind. 🚀",
  ],
  tiktok: [
    "Lights, camera… you. Let's make this one go viral. 🎬",
    "TikTok mode on. Hook them in three seconds, like you did with me. 😌",
    "Scroll-stopping energy right here. Ready to film your masterpiece? ✨",
    "Algorithm won't know what hit it. Drop that beat, superstar! 🎵",
    "Ready for the For You Page? You're already on mine. 😏",
  ],
};

// Tracks the last spoken line per platform to guarantee no immediate repeats
const lastSpokenIndex: Record<SocialPlatform, number> = {
  instagram: -1,
  linkedin: -1,
  github: -1,
  x: -1,
  tiktok: -1,
};

export function getRandomVoiceLine(platform: SocialPlatform): string {
  const lines = PLATFORM_VOICE_LINES[platform];
  if (!lines || lines.length === 0) return 'Ready to create something amazing!';

  let nextIndex = Math.floor(Math.random() * lines.length);
  // Ensure never the same line twice in a row if there are multiple lines
  if (lines.length > 1 && nextIndex === lastSpokenIndex[platform]) {
    nextIndex = (nextIndex + 1) % lines.length;
  }

  lastSpokenIndex[platform] = nextIndex;
  return lines[nextIndex];
}

export const PLATFORM_INFO: Record<SocialPlatform, {
  name: string;
  color: string;
  gradient: string;
  badgeBg: string;
  badgeText: string;
  tagline: string;
}> = {
  instagram: {
    name: 'Instagram',
    color: '#E1306C',
    gradient: 'from-amber-500 via-pink-500 to-purple-600',
    badgeBg: 'bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-purple-500/10 border-pink-500/30',
    badgeText: 'text-pink-400',
    tagline: 'Visual Hooks & Reels',
  },
  linkedin: {
    name: 'LinkedIn',
    color: '#0A66C2',
    gradient: 'from-blue-600 to-cyan-500',
    badgeBg: 'bg-blue-500/10 border-blue-500/30',
    badgeText: 'text-blue-400',
    tagline: 'Professional Authority',
  },
  x: {
    name: 'X (Twitter)',
    color: '#000000',
    gradient: 'from-slate-700 to-slate-900',
    badgeBg: 'bg-slate-500/10 border-slate-500/30',
    badgeText: 'text-slate-300',
    tagline: 'Punchy Takes & Threads',
  },
  tiktok: {
    name: 'TikTok',
    color: '#EE1D52',
    gradient: 'from-cyan-400 via-teal-500 to-rose-500',
    badgeBg: 'bg-rose-500/10 border-rose-500/30',
    badgeText: 'text-rose-400',
    tagline: 'Storyboards & Voiceovers',
  },
  github: {
    name: 'GitHub',
    color: '#2ea44f',
    gradient: 'from-purple-600 to-slate-800',
    badgeBg: 'bg-purple-500/10 border-purple-500/30',
    badgeText: 'text-purple-400',
    tagline: 'README & Developer Announcements',
  },
};
