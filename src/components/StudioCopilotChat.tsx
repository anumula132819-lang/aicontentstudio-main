import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  Bot,
  Copy,
  Check,
  User,
  Wand2,
  Layers,
  ArrowRight,
  TrendingUp,
  Target,
  Users,
  Palette,
  Eye,
  Rocket,
  PackageCheck,
  Scissors,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { SocialPlatform, ChatMessage } from '../types';

interface StudioCopilotChatProps {
  currentContext: {
    idea?: string;
    audience?: string;
    goal?: string;
    tone?: string;
  };
  activePlatform?: SocialPlatform;
  onApplyContext?: (field: 'audience' | 'goal' | 'tone', value: string) => void;
  onOpenFeedDemo?: (platform: SocialPlatform) => void;
  isOpenControlled?: boolean;
  onToggleOpen?: (open: boolean) => void;
}

export const StudioCopilotChat: React.FC<StudioCopilotChatProps> = ({
  currentContext,
  activePlatform,
  onApplyContext,
  onOpenFeedDemo,
  isOpenControlled,
  onToggleOpen,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = isOpenControlled !== undefined ? isOpenControlled : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (onToggleOpen) onToggleOpen(open);
    setInternalIsOpen(open);
  };

  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `👋 Hi! I'm **Maya**, your Content Studio Copilot! 🧡✨\n\nI can help you brainstorm **What to Post & How to Post** for ${activePlatform ? activePlatform.toUpperCase() : 'your channels'}, refine your **Target Audience**, map your **Tactical Goals**, or tune your **Brand Voice**.\n\nUse the actionable quick buttons below or ask me anything!`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: 'Just now',
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          currentContext,
          activePlatform,
        }),
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "Here's a strategic perspective on what and how to post for your content!",
        timestamp: 'Just now',
      };
      setMessages([...newMessages, assistantMsg]);
    } catch (err) {
      console.warn('Chat request failed, providing local copilot advice:', err);
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: `### 💡 Maya's Recommendation on What & How to Post:\n\n**📦 WHAT TO POST on ${activePlatform?.toUpperCase() || 'Social Media'}:**\n- **The Hook:** A pattern-interrupt question highlighting a hidden risk or metric.\n- **The Value Delivery:** 3 bullet points with tactical steps.\n- **The Call-to-Action:** Direct action prompt ("Bookmark this checklist").\n\n**🚀 HOW TO POST:**\n- Post during peak hours (8:30-10 AM or 7-9 PM).\n- Use rich media (carousel slides or video).\n- Click the **"Live Account Demo"** toggle on the card to preview the feed!`,
        timestamp: 'Just now',
      };
      setMessages([...newMessages, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // 5 Actionable Buttons requested by user:
  // Improve Hook, Change Tone, Create Variation, Shorten Content, Explain This Post
  const handleActionableButton = (action: 'improve-hook' | 'change-tone' | 'create-variation' | 'shorten' | 'explain') => {
    const ideaSnippet = currentContext.idea || 'our product launch';
    const plat = activePlatform ? activePlatform.toUpperCase() : 'multi-platform';

    switch (action) {
      case 'improve-hook':
        handleSendMessage(`Improve the Hook for: "${ideaSnippet}". Give me 3 high-impact, scroll-stopping alternatives tailored for ${plat}.`);
        break;
      case 'change-tone':
        handleSendMessage(`Change the Tone of this content. Re-calibrate it from "${currentContext.tone || 'standard'}" to a bolder, punchier, high-authority tone with concrete proof.`);
        break;
      case 'create-variation':
        handleSendMessage(`Create a new psychological Variation for "${ideaSnippet}". Give me a Storytelling / Vulnerable narrative version that builds deep trust.`);
        break;
      case 'shorten':
        handleSendMessage(`Shorten this content to an ultra-dense, 50-word high-signal version for fast mobile reading.`);
        break;
      case 'explain':
        handleSendMessage(`Explain this post: Break down why this specific hook and platform structure works with the ${plat} algorithm and audience psychology.`);
        break;
    }
  };

  const handleCopyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <>
      {/* Floating Trigger Button: The Avatar Photo with Glowing Online Ring */}
      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 left-5 z-40 flex items-center gap-3 p-1.5 pr-4 rounded-full studio-card border-2 border-[#F5C451]/60 shadow-2xl shadow-[#A855F7]/20 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 group bg-[#160D20]/95"
          title="Click to chat with Maya, your Content Studio Copilot"
        >
          {/* Avatar Character Photo */}
          <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#F5C451] via-[#F472B6] to-[#A855F7] shadow-xl group-hover:rotate-3 transition-transform shrink-0">
            <img
              src="/copilot-avatar.jpg"
              alt="Maya Copilot"
              onError={(e) => {
                // SVG fallback if image path ever fails
                (e.currentTarget as any).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="%23A855F7"><circle cx="12" cy="12" r="10"/></svg>';
              }}
              className="w-full h-full object-cover object-top rounded-full border border-[#FFF8FC]/30"
            />
            {/* Live Green Online Dot */}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#55D6A0] rounded-full border-2 border-[#0D0814] shadow animate-ping" />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#55D6A0] rounded-full border-2 border-[#0D0814] shadow" />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs sm:text-sm text-[#FFF8FC] font-display group-hover:text-[#F5C451] transition">
                Maya Copilot
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#55D6A0]/15 text-[#55D6A0] text-[9px] font-mono border border-[#55D6A0]/30 font-bold">
                Online
              </span>
            </div>
            <p className="text-[10px] text-[#B8A8BE] flex items-center gap-1">
              <span>Ask What &amp; How to Post</span>
              <span className="text-[#F5C451] group-hover:translate-x-0.5 transition-transform">✨</span>
            </p>
          </div>
        </div>
      )}

      {/* Floating Chat Modal (Collapsible / Minimizable) */}
      {isOpen && (
        <div
          className={`fixed bottom-5 left-5 z-50 w-full sm:w-[460px] rounded-3xl studio-card border border-[#3A2347] shadow-2xl flex flex-col transition-all duration-300 overflow-hidden bg-[#21132B]/95 backdrop-blur-xl ${
            isMinimized ? 'h-16' : 'h-[580px]'
          }`}
        >
          {/* Header with Avatar Photo */}
          <div className="px-4 py-3 bg-[#160D20] border-b border-[#3A2347] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-[#F5C451] via-[#F472B6] to-[#A855F7] shadow-lg shrink-0">
                <img
                  src="/copilot-avatar.jpg"
                  alt="Maya"
                  className="w-full h-full object-cover object-top rounded-full border border-white/20"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#55D6A0] rounded-full border border-[#0D0814] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-xs text-[#FFF8FC]">
                  <span>Maya • Content Studio Copilot</span>
                </div>
                <div className="text-[10px] text-[#F5C451] flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#F5C451]" />
                  <span>Improve Hook · Change Tone · What &amp; How to Post</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 rounded text-[#B8A8BE] hover:text-[#FFF8FC] hover:bg-white/10 transition"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-[#B8A8BE] hover:text-rose-400 hover:bg-white/10 transition"
                title="Close chat"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          {!isMinimized && (
            <>
              {/* Context Bar */}
              <div className="px-4 py-1.5 bg-[#160D20]/70 border-b border-[#3A2347] flex items-center justify-between text-[10px] text-[#B8A8BE]">
                <span className="truncate max-w-[240px]">
                  Context: <strong className="text-[#F5C451]">{currentContext.idea?.slice(0, 26) || 'Campus Security Platform'}...</strong>
                </span>
                <span className="text-[#A855F7] uppercase font-mono font-bold">
                  {activePlatform || 'Multi-Platform'}
                </span>
              </div>

              {/* Actionable Buttons working on current content */}
              <div className="px-3 py-2 bg-[#160D20]/90 border-b border-[#3A2347] flex items-center gap-1.5 overflow-x-auto text-[10px]">
                <span className="text-[#B8A8BE] text-[9px] uppercase font-semibold shrink-0">Actions:</span>
                <button
                  onClick={() => handleActionableButton('improve-hook')}
                  className="px-2.5 py-1 rounded-full bg-[#A855F7]/15 hover:bg-[#A855F7]/25 text-[#A855F7] border border-[#A855F7]/30 whitespace-nowrap transition font-medium flex items-center gap-1"
                >
                  <Wand2 className="w-2.5 h-2.5" />
                  <span>Improve Hook</span>
                </button>
                <button
                  onClick={() => handleActionableButton('change-tone')}
                  className="px-2.5 py-1 rounded-full bg-[#F472B6]/15 hover:bg-[#F472B6]/25 text-[#F472B6] border border-[#F472B6]/30 whitespace-nowrap transition font-medium flex items-center gap-1"
                >
                  <Palette className="w-2.5 h-2.5" />
                  <span>Change Tone</span>
                </button>
                <button
                  onClick={() => handleActionableButton('create-variation')}
                  className="px-2.5 py-1 rounded-full bg-[#F5C451]/15 hover:bg-[#F5C451]/25 text-[#F5C451] border border-[#F5C451]/30 whitespace-nowrap transition font-medium flex items-center gap-1"
                >
                  <Layers className="w-2.5 h-2.5" />
                  <span>Create Variation</span>
                </button>
                <button
                  onClick={() => handleActionableButton('shorten')}
                  className="px-2.5 py-1 rounded-full bg-[#55D6A0]/15 hover:bg-[#55D6A0]/25 text-[#55D6A0] border border-[#55D6A0]/30 whitespace-nowrap transition font-medium flex items-center gap-1"
                >
                  <Scissors className="w-2.5 h-2.5" />
                  <span>Shorten Content</span>
                </button>
                <button
                  onClick={() => handleActionableButton('explain')}
                  className="px-2.5 py-1 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 whitespace-nowrap transition font-medium flex items-center gap-1"
                >
                  <HelpCircle className="w-2.5 h-2.5" />
                  <span>Explain This Post</span>
                </button>
              </div>

              {/* Messages list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs leading-relaxed">
                {messages.map((msg, idx) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mt-0.5 border border-[#F5C451]/50 shadow">
                        <img
                          src="/copilot-avatar.jpg"
                          alt="Maya"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    )}

                    <div
                      className={`relative max-w-[85%] p-3.5 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-[#A855F7] to-[#C026D3] text-white rounded-tr-none shadow-md font-medium'
                          : 'bg-[#160D20] border border-[#3A2347] text-[#FFF8FC] rounded-tl-none shadow-md'
                      }`}
                    >
                      <div className="whitespace-pre-line leading-relaxed font-sans">{msg.content}</div>

                      {msg.role === 'assistant' && (
                        <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] text-[#B8A8BE]">
                          <span>{msg.timestamp}</span>
                          <button
                            onClick={() => handleCopyMessage(msg.content, idx)}
                            className="p-1 rounded hover:bg-white/10 text-[#B8A8BE] hover:text-white transition"
                            title="Copy reply"
                          >
                            {copiedIndex === idx ? (
                              <Check className="w-3 h-3 text-[#55D6A0]" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {msg.role === 'user' && (
                      <div className="w-7 h-7 rounded-full bg-[#160D20] border border-[#3A2347] flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-white">
                        <User className="w-3.5 h-3.5 text-[#F5C451]" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-2.5 items-center text-[#B8A8BE] text-xs">
                    <div className="w-5 h-5 rounded-full overflow-hidden border border-[#F5C451] shrink-0 animate-spin-slow shadow">
                      <img src="/copilot-avatar.jpg" alt="Maya" className="w-full h-full object-cover object-top" />
                    </div>
                    <span className="text-[#F5C451] font-medium">Maya is formulating strategic guidance...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input field */}
              <div className="p-3 bg-[#160D20] border-t border-[#3A2347] flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder="Ask Maya: 'Improve hook', 'How to post on LinkedIn'..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#21132B] border border-[#3A2347] text-xs text-[#FFF8FC] placeholder-[#B8A8BE]/50 focus:outline-none focus:border-[#A855F7]"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C026D3] hover:brightness-105 disabled:opacity-40 text-white transition shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
