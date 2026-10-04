import { GenerationResult } from '../types';

export const DEMO_PRESET = {
  idea: 'AI-powered cybersecurity platform that protects students from phishing scams, credential harvesting, and campus Wi-Fi snooping in real-time.',
  audience: 'College students & early-career tech enthusiasts',
  goal: 'Awareness + promotion',
  tone: 'Professional but engaging',
  platforms: ['instagram', 'linkedin', 'x', 'tiktok'] as const,
  language: 'English',
};

export const INITIAL_DEMO_RESULT: GenerationResult = {
  summary: 'Context-tailored distribution for cybersecurity platform aimed at college students, balancing security authority with engaging peer-level relatability.',
  instagram: {
    hook: '🚨 That free coffee shop Wi-Fi might cost you your student loan login.',
    caption: `Be honest: How many public Wi-Fi networks is your laptop connected to right now?\n\nBetween campus libraries, local cafés, and dorms, 73% of college students have encountered credential phishing or fake login portals.\n\n🛡️ What if your cybersecurity tool actually worked like background noise cancellation for hackers?\n\n✨ Real-time zero-day protection\n⚡ Zero slowdown on your video lectures\n🎯 Instant alerts before you click suspicious exam or syllabus links\n\nDrop a comment below with your worst campus tech fail! 👇`,
    hashtags: ['#CyberSecurity', '#CollegeHacks', '#CampusLife', '#StudentTech', '#SafeBrowsing', '#EdTech'],
    cta: 'Save this post and share with your roommate who still uses "Password123" 🔒',
    visualIdea: 'Slide 1: High-contrast aesthetic carousel with a split-screen photo of a laptop at a rainy campus café vs a matrix radar blip. Slide 2-4: The 3 biggest digital traps in student life.',
  },
  linkedin: {
    hook: '73% of collegiate credentials leaked online in 2025 came from innocent coffee shop Wi-Fi logins.\n\nHere is how we redesigned threat detection for the next generation of knowledge workers:',
    body: `Most enterprise cybersecurity solutions assume the end-user has an IT department looking over their shoulder.\n\nCollege students operate on the opposite end of the spectrum:\n• 4 to 6 unsecured mobile/laptop device transitions per day\n• Rapid adoption of experimental tools and torrented course materials\n• Target-rich environment for sophisticated credential phishing\n\nInstead of lecturing students on security hygiene, we built an autonomous, AI-driven defense layer that silently intercepts malicious TLS handshakes and anomalous DNS requests in real-time.\n\nThe result? Zero false alarms during finals week, and total protection across hostile campus networks.`,
    closingQuestion: 'Education leaders and CISOs: How is your organization addressing decentralized student endpoint vulnerability this semester?',
    hashtags: ['#Cybersecurity', '#EdTech', '#HigherEducation', '#CloudSecurity', '#ProductInnovation'],
  },
  x: {
    hook: 'Your campus Wi-Fi is actively leaking your passwords. Here is the breakdown in 4 tweets: 🧵👇',
    tweets: [
      '1/ Your campus Wi-Fi is actively leaking your credentials. Not because you clicked a weird link, but because student networks are hacker playgrounds.\n\nHere is what happens when you connect in the student union: 🧵👇',
      '2/ "Evil Twin" hotspots spoof the official campus SSID. You think you\'re loading Canvas or Blackboard, but every keystroke is proxied through a man-in-the-middle script.',
      '3/ We built an AI engine that inspects handshake certs in <2ms before your browser even sends a packet. No clunky VPN latency. No broken Spotify streams.',
      '4/ Security shouldn\'t require a computer science degree to stay safe.\n\nTry the free student tier today. Link below! 🛡️⚡',
    ],
  },
  tiktok: {
    title: 'How hackers steal your student portal in 5 seconds flat ☕💻',
    hook: '"If you connect to campus Wi-Fi without doing this first, STOP SCROLLING right now."',
    scenes: [
      {
        timestamp: '0:00 - 0:03',
        visual: 'Creator holding iced latte, laptop open at library. Sudden snap zoom to screen showing fake login.',
        textOverlay: 'POV: You connected to "Campus_Guest_Free"',
        voiceover: 'If you connect to campus Wi-Fi without doing this first, stop scrolling right now.',
      },
      {
        timestamp: '0:03 - 0:11',
        visual: 'Quick B-roll: Wi-Fi settings dropdown showing 3 identical "Campus_Student" networks with 1 letter off.',
        textOverlay: '⚠️ The "Evil Twin" Wi-Fi trap',
        voiceover: 'See that network? Hackers sit 2 tables away spoofing the campus Wi-Fi to steal your Canvas and bank passwords.',
      },
      {
        timestamp: '0:11 - 0:21',
        visual: 'Clean app UI showing glowing green shield icon blocking an intercept with sound effect ding.',
        textOverlay: 'AI Shields On 🛡️ Instant Block',
        voiceover: 'Our AI platform intercepts rogue access points in 2 milliseconds before your password leaves your keyboard.',
      },
      {
        timestamp: '0:21 - 0:30',
        visual: 'Creator smiling, closing laptop, pointing down to comments.',
        textOverlay: 'Free for verified .edu emails 🎓',
        voiceover: 'It is 100% free with any .edu email. Comment your school below and stay safe out there!',
      },
    ],
    caption: 'Don\'t let someone steal your tuition refund 😭 Free for college students #cybersecurity #studenthacks #collegeadvice #techtok',
    audioSuggestion: 'Original Audio - Suspense pulse transitioning to smooth lofi beat',
  },
  github: {
    title: 'AegisAI // Autonomous Endpoint Threat Detection for Campus Environments',
    tagline: 'Lightweight Rust daemon + localized ML heuristics for real-time Wi-Fi handshake defense.',
    description: `### 🛡️ Why AegisAI?\n\nTraditional enterprise EDR suites consume 2GB+ of memory and cripple battery life. AegisAI is designed for student machines: zero background overhead, blazing speed, and deterministic interception.\n\n\`\`\`bash\n# Instant install on macOS / Linux\ncurl -fsSL https://get.aegis-defense.dev | sh\n\`\`\`\n\n### ⚡ Features\n- **Zero-Latency Handshake Verification:** Validates TLS certificates against decentralized root registries in <2ms.\n- **Heuristic Phish Buster:** Local on-device NLP model intercepts deceptive domain lookups.\n- **Battery-Centric Runtime:** Built in Rust with minimal telemetry.`,
    tags: ['cybersecurity', 'rust', 'network-security', 'edr', 'phishing-protection'],
    callToAction: '⭐ Star our repository to support open-source student privacy!',
  },
};
