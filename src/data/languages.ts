export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
];

export function detectLanguageFromText(text: string): SupportedLanguage {
  if (!text || text.trim().length === 0) return SUPPORTED_LANGUAGES[0];

  // Simple heuristic detection for scripts and frequent keywords
  const lower = text.toLowerCase();
  
  if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(text)) {
    if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) {
      return SUPPORTED_LANGUAGES.find(l => l.code === 'ja') || SUPPORTED_LANGUAGES[0];
    }
    return SUPPORTED_LANGUAGES.find(l => l.code === 'zh') || SUPPORTED_LANGUAGES[0];
  }
  if (/[\uac00-\ud7af]/.test(text)) {
    return SUPPORTED_LANGUAGES.find(l => l.code === 'ko') || SUPPORTED_LANGUAGES[0];
  }
  if (/[\u0900-\u097f]/.test(text)) {
    return SUPPORTED_LANGUAGES.find(l => l.code === 'hi') || SUPPORTED_LANGUAGES[0];
  }
  if (/[\u0600-\u06ff]/.test(text)) {
    return SUPPORTED_LANGUAGES.find(l => l.code === 'ar') || SUPPORTED_LANGUAGES[0];
  }
  if (/[\u0400-\u04ff]/.test(text)) {
    return SUPPORTED_LANGUAGES.find(l => l.code === 'ru') || SUPPORTED_LANGUAGES[0];
  }

  // European words detection
  if (/\b(el|la|los|las|de|en|por|para|con|un|una|es|seguridad)\b/.test(lower) && !/\b(the|is|and)\b/.test(lower)) {
    return SUPPORTED_LANGUAGES.find(l => l.code === 'es') || SUPPORTED_LANGUAGES[0];
  }
  if (/\b(le|la|les|des|du|dans|avec|pour|est|une|un)\b/.test(lower) && !/\b(the|is|and)\b/.test(lower)) {
    return SUPPORTED_LANGUAGES.find(l => l.code === 'fr') || SUPPORTED_LANGUAGES[0];
  }
  if (/\b(der|die|das|und|nicht|mit|ein|eine|ist|für)\b/.test(lower) && !/\b(the|is|and)\b/.test(lower)) {
    return SUPPORTED_LANGUAGES.find(l => l.code === 'de') || SUPPORTED_LANGUAGES[0];
  }
  if (/\b(você|não|com|para|uma|este|segurança)\b/.test(lower)) {
    return SUPPORTED_LANGUAGES.find(l => l.code === 'pt') || SUPPORTED_LANGUAGES[0];
  }

  return SUPPORTED_LANGUAGES[0]; // English default
}
