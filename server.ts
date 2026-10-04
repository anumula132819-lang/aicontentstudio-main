import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client if key is available
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// API endpoint to check status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash',
  });
});

// API endpoint for content generation
app.post('/api/generate', async (req, res) => {
  const { idea, audience, goal, tone, platforms, language, format } = req.body;

  if (!idea) {
    return res.status(400).json({ error: 'Idea/Product context is required' });
  }

  // If Gemini API is available, generate via LLM
  if (ai && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are the core intelligence engine of "AI Content Studio".
Convert the following single context into distinct, highly tailored content for each of these platforms: ${(platforms || ['Instagram', 'LinkedIn', 'X', 'TikTok', 'GitHub']).join(', ')}.

Context Details:
- Core Idea/Product: ${idea}
- Target Audience: ${audience || 'General public & enthusiasts'}
- Strategic Goal: ${goal || 'Awareness & Engagement'}
- Brand Tone: ${tone || 'Engaging & Authentic'}
- Target Language: ${language || 'English'}
- Preferred Format: ${format || 'Standard multi-platform'}

REQUIREMENTS FOR EACH PLATFORM:
1. Instagram:
   - hook: scroll-stopping 1-sentence opening
   - caption: formatted with aesthetic spacing, emojis, and line breaks
   - hashtags: 6-10 relevant trending hashtags
   - cta: clear action prompt
   - visualIdea: concrete description for photo carousel or Reels concept
2. LinkedIn:
   - hook: thought-provoking professional insight
   - body: high-signal narrative with clear line breaks, bullet points or takeaways
   - closingQuestion: discussion prompt that drives comments
   - hashtags: 3-5 professional tags
3. X:
   - type: single tweet OR 3-4 tweet thread
   - tweets: array of concise, punchy tweets (under 280 chars each, numbered if thread)
   - hook: initial punchline
4. TikTok:
   - title: video title concept
   - hook: 3-second visual + verbal hook
   - scenes: array of { timestamp: string, visual: string, textOverlay: string, voiceover: string }
   - caption: short punchy caption with 3-4 hashtags
   - audioSuggestion: sound or vibe suggestion
5. GitHub:
   - title: repo or release header
   - tagline: crisp 1-liner
   - description: Markdown formatted README blurb with features, quick-start or announcement
   - tags: topic tags
   - callToAction: star the repo / contribute / try release

Return strictly valid JSON matching this structure:
{
  "summary": "Brief 1-sentence creative direction summary",
  "instagram": { "hook": "...", "caption": "...", "hashtags": ["#..."], "cta": "...", "visualIdea": "..." },
  "linkedin": { "hook": "...", "body": "...", "closingQuestion": "...", "hashtags": ["#..."] },
  "x": { "hook": "...", "tweets": ["..."] },
  "tiktok": { "title": "...", "hook": "...", "scenes": [{"timestamp": "0:00-0:03", "visual": "...", "textOverlay": "...", "voiceover": "..."}], "caption": "...", "audioSuggestion": "..." },
  "github": { "title": "...", "tagline": "...", "description": "...", "tags": ["..."], "callToAction": "..." }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = response.text || '';
      try {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, data: parsed, source: 'gemini' });
      } catch (parseErr) {
        console.warn('Failed to parse Gemini JSON response directly, returning cleaned content');
      }
    } catch (err: any) {
      console.warn('Gemini generation error, falling back to local studio generator:', err?.message || err);
    }
  }

  // Fallback realistic generator
  const generated = generateRealisticFallback({
    idea,
    audience: audience || 'Tech & Modern Professionals',
    goal: goal || 'Growth & Awareness',
    tone: tone || 'Engaging & Authentic',
    language: language || 'English',
    platforms: platforms || ['Instagram', 'LinkedIn', 'X', 'TikTok', 'GitHub'],
  });

  return res.json({ success: true, data: generated, source: 'studio-engine' });
});

// API endpoint for smart context suggestions (Audience, Goal, Tone)
app.post('/api/suggest-context', async (req, res) => {
  const { idea, field } = req.body;

  if (ai && process.env.GEMINI_API_KEY && idea) {
    try {
      const prompt = `Based on this core product idea: "${idea}"
Suggest 4 distinct, high-impact options for the field "${field}" (allowed: 'audience', 'goal', 'tone').
Return valid JSON:
{
  "suggestions": [
    { "title": "Short title", "description": "1 sentence explanation" }
  ]
}`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json', temperature: 0.7 },
      });
      const parsed = JSON.parse(response.text || '{}');
      if (parsed.suggestions) {
        return res.json({ success: true, suggestions: parsed.suggestions });
      }
    } catch (err) {
      console.warn('Gemini suggest-context error, using fallback');
    }
  }

  // Fallback realistic suggestions based on field
  const fallbacks: Record<string, { title: string; description: string }[]> = {
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

  return res.json({ success: true, suggestions: fallbacks[field] || fallbacks.audience });
});

// API endpoint for interactive content studio chat
app.post('/api/chat', async (req, res) => {
  const { messages, currentContext, activePlatform } = req.body;

  if (ai && process.env.GEMINI_API_KEY) {
    try {
      const systemInstruction = `You are "Maya", the friendly, vibrant, and razor-sharp Content Studio Copilot inside AI Content Studio.
Your core mission is to help creators, marketers, founders, and students excel at content intelligence:
1. WHAT TO POST: Break down the exact deliverable content structure, visual assets (carousels, 9:16 vertical video, code snippets, infographics), scroll-stopping hooks, line breaks, audio choices, and CTA.
2. HOW TO POST: Explain the platform-specific distribution algorithm, peak posting times, first 30-minute engagement tactics, hashtag strategy, and feed mechanics for Instagram, LinkedIn, X, TikTok, and GitHub.
3. ADAPTIVE CONTEXT: Suggest specific Target Audiences, Tactical Goals, and Brand Voice styles tailored to the user's idea.
4. LIVE DEMO GUIDANCE: Explain how to preview content in the simulated real account feeds.

Maintain conversation context across multiple turns. Always be warm, encouraging, concise, actionable, and format your answers cleanly using Markdown with emojis.
Active platform context: ${activePlatform || 'Multi-platform'}
Current user project context: ${JSON.stringify(currentContext || {})}`;

      // Convert messages to Gemini format with history
      const geminiContents = (messages || []).map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content || '' }],
      }));

      // Ensure at least one message is present
      const contentsToSubmit = geminiContents.length > 0 
        ? geminiContents 
        : [{ role: 'user', parts: [{ text: 'Hello Maya! What should I post today?' }] }];

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contentsToSubmit,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({
        reply: response.text || "Here's a strategic perspective on what and how to post!",
        source: 'gemini',
      });
    } catch (err: any) {
      console.warn('Gemini chat error, falling back to rule-based assistant:', err?.message || err);
    }
  }

  // Smart conversational fallback responses
  const lastMsg = (messages?.[messages.length - 1]?.content || '').toLowerCase();
  let reply = "Hey there! I'm Maya, your Content Studio Copilot! 🧡✨ I'm here to help you nail **What to Post** and **How to Post** across Instagram, LinkedIn, X, TikTok, and GitHub. What's on your mind?";

  if (lastMsg.includes('what to post') || lastMsg.includes('what should i post') || lastMsg.includes('assets') || lastMsg.includes('deliverable')) {
    const platName = activePlatform ? activePlatform.toUpperCase() : 'YOUR CHANNELS';
    reply = `### 📦 WHAT TO POST on ${platName} • Complete Asset Checklist:

1. **The Core Visual Asset:**
   - ${activePlatform === 'instagram' ? '**4:5 Vertical Carousel (4-7 slides):** Slide 1 is a bold high-contrast title card. Slide 2-5 are high-signal takeaway cards. Slide 6 is the save/bookmark CTA.' : activePlatform === 'tiktok' ? '**9:16 Vertical Video (28-35 sec):** Dynamic live camera or screen recording with high-contrast text overlays and trending background audio.' : activePlatform === 'linkedin' ? '**Single 1200x627px Graphic or 5-page PDF Document Carousel:** Highly professional, clean corporate typography with data points.' : activePlatform === 'x' ? '**16:9 Summary Graphic or Clean Code Snippet:** Attached to Tweet 1 to expand visual real-estate on mobile feeds by 300%.' : '**Polished Markdown README with Badges & Terminal Command:** Clear code blocks, quickstart curl command, and architectural bullet points.'}

2. **The Scroll-Stopping Hook:**
   - Must present a pattern-interrupt dilemma or provocative industry stat in under 90 characters before the cutoff fold.

3. **Value Delivery Structure:**
   - 3 modular bullet points or short, digestible 2-line paragraphs with generous vertical spacing.

4. **Action-Driven CTA:**
   - Tell the viewer *exactly* what action to take (e.g. "Save this for your next launch", "Drop your thoughts below", "Star the repo").

*Would you like me to draft a custom visual mockup description or generate alternate hook ideas?*`;
  } else if (lastMsg.includes('how to post') || lastMsg.includes('timing') || lastMsg.includes('algorithm') || lastMsg.includes('strategy')) {
    const platName = activePlatform ? activePlatform.toUpperCase() : 'SOCIAL MEDIA';
    reply = `### 🚀 HOW TO POST on ${platName} • Distribution & Timing Playbook:

1. **Optimal Peak Window:**
   - ${activePlatform === 'linkedin' ? '**Tuesday – Thursday: 8:00 AM – 10:30 AM** (morning commute & focus window).' : activePlatform === 'instagram' ? '**Daily: 6:00 PM – 9:00 PM** (evening leisure scroll window) or 12:00 PM lunchtime.' : activePlatform === 'tiktok' ? '**Late Afternoon: 3:00 PM – 7:00 PM** (after-school / commute peak retention hours).' : activePlatform === 'x' ? '**11:30 AM – 1:30 PM & 8:00 PM** (lunch hour and evening tech discourse hours).' : '**Tuesday & Wednesday 9:00 AM PST** (optimal global developer visibility).'}

2. **The First 30-Minute Protocol:**
   - Reply to every comment within the first 30 minutes. Most social algorithms evaluate early velocity to determine whether to promote your content to secondary feed rings.

3. **Feed Formatting Discipline:**
   - Never post large unbroken paragraphs on mobile. Use single-line spacing, bullet markers, and clean section breaks.

4. **Link Placement Hack:**
   - ${activePlatform === 'linkedin' ? 'Never put external links in the main post body! Put them in the first comment or mention "Link in bio" to avoid the 40% reach penalty.' : activePlatform === 'x' ? 'Place outbound links in the final tweet of your thread or your profile header.' : 'Direct traffic with a clear "Link in bio" or pinned comment prompt.'}

*Tap the "👀 Live Account Demo" button above to see this layout in the simulated feed!*`;
  } else if (lastMsg.includes('audience') || lastMsg.includes('who should i target')) {
    reply = `### 🎯 Strategic Target Audience Recommendations:
Based on your project context, here are 3 high-converting audience segments:

1. **The Campus Commuter (College Students):**
   - *Pain Point:* Public campus Wi-Fi snooping, phishing traps, and losing access to student portals.
   - *Conversion Driver:* Peer recommendations, relatable campus life memes, and free student tiers.

2. **The Decentralized Remote Worker:**
   - *Pain Point:* Working from coffee shops and co-working spaces with slow, cumbersome corporate VPNs.
   - *Conversion Driver:* Lightweight background speed and zero-logging privacy proofs.

3. **University CISOs & Student Life Directors:**
   - *Pain Point:* Liability for campus data breaches and student credential exposure.
   - *Conversion Driver:* Institutional compliance and automated threat telemetry.

*Which of these audiences resonates most with your current campaign goal?*`;
  } else if (lastMsg.includes('goal') || lastMsg.includes('tactical goal')) {
    reply = `### 🏆 Tactical Goal Recommendations:
1. **Awareness + Community Advocacy:** Focus on alarming statistics (e.g. 73% of student leaks) to drive organic saves, shares, and reposts.
2. **Frictionless Waitlist Conversion:** Offer free protection for verified .edu email domains with a clear 1-click CTA.
3. **Thought Leadership Authority:** Position your technology as the end of clunky VPNs and the birth of on-device ML defense.

Which goal best matches your launch timing?`;
  } else if (lastMsg.includes('voice') || lastMsg.includes('tone')) {
    reply = `### 🎭 Brand Voice Suggestions:
1. **Professional but Engaging:** Speak like a trusted senior engineer who knows how to explain tech over coffee without boring jargon.
2. **Bold & Contrarian:** Call out old security advice ("Strong passwords won't save you from fake routers") to trigger curiosity.
3. **Empathetic & Peer-to-Peer:** Talk student-to-student with relatable campus anecdotes and light humor.`;
  } else if (lastMsg.includes('demo') || lastMsg.includes('show demo') || lastMsg.includes('feed')) {
    reply = `### 📱 Account Live Demo View:
You can switch any platform card from the **What & How to Post** view to the **Live Account Demo** by clicking the toggle at the top of the card! 

This renders the exact simulated mobile or desktop UI—complete with author badges, photo carousel mockups, phone video screens, and real-time like/comment engagement counters. Give it a tap!`;
  } else if (lastMsg.includes('hook')) {
    reply = `### 🔥 3 Scroll-Stopping Hook Angles:
1. **The FOMO / Warning Hook:** *"Your campus Wi-Fi might be actively leaking your passwords right now."*
2. **The Paradigm Shift Hook:** *"Why traditional VPNs are officially dead for college students."*
3. **The Proof Point Hook:** *"How we blocked fake access point sniffing in <2ms with zero battery drain."*`;
  }

  return res.json({ reply, source: 'studio-engine' });
});

// Helper for fallback generation
function generateRealisticFallback(params: {
  idea: string;
  audience: string;
  goal: string;
  tone: string;
  language: string;
  platforms: string[];
}) {
  const { idea, audience, goal, tone } = params;

  return {
    summary: `Tailored context adaptation for "${idea.slice(0, 50)}..." tuned for ${audience} with a ${tone.toLowerCase()} cadence.`,
    instagram: {
      hook: `✨ Stop creating 5 different posts from scratch. Do this instead 👇`,
      caption: `Ever feel like building great content drains all your creative energy before you even hit publish?\n\nHere is the mindset shift that changes everything:\n\n💡 Focus on the core breakthrough: ${idea}.\n🎯 Target specifically for ${audience}.\n⚡ Adapt format, rhythm, and tone for the exact feed you are in.\n\nSave this formula for your next launch! 📌`,
      hashtags: [
        '#ContentStrategy',
        '#CreatorEconomy',
        '#ProductivityHacks',
        '#SmartWorkflow',
        '#CreativeTech',
        '#BuildInPublic',
      ],
      cta: 'Drop a 🔥 in the comments if you want the breakdown template in your DMs!',
      visualIdea:
        'A sleek 4-slide carousel: Slide 1 is a bold graphic showing "1 Idea" branching into 5 radiant platform cards with neon accents. Slide 2-4 reveals the step-by-step transformation.',
    },
    linkedin: {
      hook: `Most teams waste 15+ hours a week rewriting the exact same message across different channels.\n\nHere is how high-velocity leaders solve the distribution bottleneck:`,
      body: `When announcing or launching something new—like "${idea}"—the mistake is trying to be everywhere without context.\n\nAudiences on LinkedIn do not want raw marketing broadcast. They want:\n\n1. The Strategic Context: Why does this matter to ${audience} right now?\n2. The Core Leverage: What measurable outcome is unlocked (${goal})?\n3. The Authentic Perspective: What was the hard lesson learned along the way?\n\nBy establishing a unified context layer first, every downstream asset inherits brand consistency without sounding robotic or templated.`,
      closingQuestion: `How does your team currently balance content velocity with platform-native authenticity?`,
      hashtags: ['#Leadership', '#Strategy', '#Innovation', '#Productivity'],
    },
    x: {
      hook: `The era of manual content resizing is over. Here is the modern pipeline: 🧵👇`,
      tweets: [
        `1/ You don't have a content problem. You have a distribution and context problem.\n\nTake "${idea.slice(0, 60)}..."`,
        `2/ If you post the exact same copy on LinkedIn, X, and TikTok, 2 out of 3 will flop.\n\nWhy? Context.\n• X wants high-density takes\n• LinkedIn wants business impact\n• TikTok wants visceral narrative`,
        `3/ The secret framework:\n\n1. Define 1 rock-solid premise\n2. Pinpoint the exact target audience (${audience})\n3. Map to platform native psychology\n4. Ship 5x faster`,
        `4/ Create once. Contextualize deeply. Adapt everywhere.\n\nRT if this saved you 3 hours this week ⚡`,
      ],
    },
    tiktok: {
      title: `How I turn 1 idea into 5 platforms in 60 seconds 🤯`,
      hook: `"Stop writing your social posts one by one—you're doing it the hard way!"`,
      scenes: [
        {
          timestamp: '0:00 - 0:03',
          visual: 'Fast handheld snap into camera with energetic expression. Text sticker pops up.',
          textOverlay: 'POV: You stopped burning out on content',
          voiceover: 'If you still spend all Sunday writing posts for Monday, stop scrolling right now.',
        },
        {
          timestamp: '0:03 - 0:12',
          visual: 'Screen recording showing 1 sentence input morphing into 5 distinct platform previews.',
          textOverlay: '1 Idea ➡️ 5 Tailored Formats',
          voiceover: `Watch this. I take one concept: "${idea.slice(0, 40)}" and adapt it instantly for ${audience}.`,
        },
        {
          timestamp: '0:12 - 0:22',
          visual: 'Split screen comparing the sleek LinkedIn tone with the punchy TikTok script.',
          textOverlay: 'Context > Copy-Paste',
          voiceover: 'LinkedIn gets the professional case study. X gets the viral thread. No cookie-cutter copy.',
        },
        {
          timestamp: '0:22 - 0:30',
          visual: 'Host smiles and points to bio / comment link with pulse effect.',
          textOverlay: 'Link in bio to try it 🚀',
          voiceover: 'Hit follow and try the AI Content Studio framework today!',
        },
      ],
      caption: `Work smarter, not harder 🚀 Stop manual copy-pasting #creatortips #productivity #aiworkflow #growth`,
      audioSuggestion: 'Upbeat lo-fi synth groove (Trending creator audio)',
    },
    github: {
      title: 'AI Content Studio // Release & Architecture Notes',
      tagline: 'Context-driven content intelligence platform: Create once. Adapt everywhere.',
      description: `### 🌟 Overview\n\n**AI Content Studio** introduces a multi-stage contextual generation pipeline for cross-platform distribution.\n\n\`\`\`bash\n# Quick start with sample idea\nnpx ai-content-studio --context "${idea.slice(0, 35)}..."\n\`\`\`\n\n### ⚡ Key Capabilities\n- **Contextual Reasoning Engine:** Transforms premise + audience (${audience}) + goal (${goal}) into platform-native semantic structures.\n- **Multi-Platform Intelligence:** Native schemas for Instagram, LinkedIn, X, TikTok, and GitHub.\n- **Zero-Friction Variation Lab:** Real-time tone permutation (Professional, Storytelling, Bold, Educational).\n- **Multimodal Ingestion:** Audio transcription, video breakdown, and URL context parsing.`,
      tags: ['content-intelligence', 'multi-platform', 'genai', 'productivity', 'developer-tools'],
      callToAction: '⭐ Star the project on GitHub and explore the architecture docs!',
    },
  };
}

// Development with Vite or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
