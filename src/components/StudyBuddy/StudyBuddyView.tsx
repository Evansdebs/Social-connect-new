import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Brain,
  Send,
  Sparkles,
  BookOpen,
  Lightbulb,
  Copy,
  CheckCircle2
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const SUBJECTS = [
  { id: 'math', label: 'Mathematics', icon: '📐', color: 'from-blue-500 to-cyan-500' },
  { id: 'science', label: 'Science', icon: '🔬', color: 'from-emerald-500 to-teal-500' },
  { id: 'english', label: 'English & Literature', icon: '📚', color: 'from-violet-500 to-purple-500' },
  { id: 'history', label: 'History & Social Studies', icon: '🏛️', color: 'from-amber-500 to-orange-500' },
  { id: 'coding', label: 'Computer Science', icon: '💻', color: 'from-rose-500 to-pink-500' },
  { id: 'general', label: 'General Study Help', icon: '💡', color: 'from-slate-500 to-slate-600' },
];

const QUICK_PROMPTS = [
  'Explain the Pythagorean theorem with examples',
  'Help me outline an essay on climate change',
  'Create 5 practice quiz questions about photosynthesis',
  "Explain Newton's laws of motion simply",
  'What are the key themes in Things Fall Apart?',
  'Help me solve simultaneous equations step-by-step',
];

const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

async function askGemini(messages: { role: string; content: string }[], subject: string): Promise<string> {
  const apiKey = GEMINI_API_KEY;
  if (!apiKey) {
    return `💡 **AI Study Buddy is ready!**\n\nPlease configure your \`VITE_GEMINI_API_KEY\` in your \`.env\` file to enable live AI-generated tutoring.\n\nIn the meantime, here are proven campus revision strategies:\n\n• **Pomodoro Technique**: 25 minutes of deep focus followed by 5 minutes of rest\n• **Active Recall**: Test yourself with flashcards or practice questions before reading notes\n• **Feynman Technique**: Teach the core concept out loud in plain, everyday language\n• **Formula Mind Maps**: Connect key equations to real-life physical examples\n• **Peer Study**: Discuss past examination questions with classmates on Campus Connect!`;
  }

  const systemPrompt = `You are an encouraging, knowledgeable AI Study Buddy for secondary school and university students in Ghana and West Africa. You specialize in ${subject}. Your tone is friendly, clear, and motivating. You use simple language, relatable examples (African context when helpful), and structured responses with emoji. Always encourage students and celebrate their progress.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: messages.map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        })),
        generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
      }),
    });

    const data = await response.json();
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    return 'I could not generate a response. Please try asking again.';
  } catch {
    return '⚠️ Connection error. Please check your network connection and try again.';
  }
}

export const StudyBuddyView: React.FC = () => {
  const { currentUser } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi ${currentUser.name.split(' ')[0]}! 👋 I am your AI Campus Study Buddy, powered by Gemini.\n\nI can help you with:\n• 📐 **Mathematics** — equations, proofs, calculus, and problem-solving\n• 🔬 **Science** — physics, chemistry, biology explanations\n• 📚 **English & Literature** — essay outlines, text analysis, grammar\n• 🏛️ **History & Social Studies** — events, timelines, and arguments\n• 💻 **Computer Science** — algorithms, debugging, syntax, logic\n• 💡 **Exam Preparation** — revision strategies and study schedules\n\nWhat subject are you tackling today? Select a subject or ask anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('general');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const historyForAPI = [...messages.filter((m) => m.id !== 'welcome'), userMsg]
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.content }));

    const subject = SUBJECTS.find((s) => s.id === selectedSubject)?.label || 'General';
    const reply = await askGemini(historyForAPI, subject);

    const assistantMsg: Message = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeSubject = SUBJECTS.find((s) => s.id === selectedSubject);

  // Render markdown-ish content with clean typography
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold text-neutral-900">{line.slice(2, -2)}</p>;
      }
      if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <p key={i} className="flex gap-2">
            <span className="text-violet-500 font-bold shrink-0">•</span>
            <span>{line.slice(2).replace(/\*\*(.*?)\*\*/g, '$1')}</span>
          </p>
        );
      }
      if (/^\d+\./.test(line)) {
        return (
          <p key={i} className="flex gap-2">
            <span className="text-violet-600 font-bold shrink-0">{line.match(/^\d+/)?.[0]}.</span>
            <span>{line.replace(/^\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}</span>
          </p>
        );
      }
      if (line.startsWith('###')) return <h4 key={i} className="font-black text-xs text-neutral-900 mt-2">{line.slice(3).trim()}</h4>;
      if (line.startsWith('##')) return <h3 key={i} className="font-black text-sm text-neutral-900 mt-2">{line.slice(2).trim()}</h3>;
      if (line === '') return <div key={i} className="h-2" />;
      return <p key={i}>{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[550px] bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="shrink-0 bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-xs rounded-2xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-black text-base tracking-tight">AI Study Buddy</h1>
              <p className="text-[11px] text-white/80">Intelligent Academic Assistant • Campus Connect</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Active
            </span>
          </div>
        </div>

        {/* Subject selector */}
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {SUBJECTS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                selectedSubject === sub.id
                  ? 'bg-white text-neutral-900 shadow-md'
                  : 'bg-white/15 text-white/90 hover:bg-white/25'
              }`}
            >
              <span>{sub.icon}</span>
              <span>{sub.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}
            {msg.role === 'user' && (
              <img
                src={currentUser.avatar}
                alt=""
                className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-neutral-200"
              />
            )}
            <div className={`flex-1 max-w-2xl ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
              <div
                className={`rounded-2xl px-4 py-3 text-xs leading-relaxed space-y-1 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : 'bg-white border border-neutral-200 text-neutral-800 rounded-bl-xs shadow-xs'
                }`}
              >
                {msg.role === 'assistant' ? renderContent(msg.content) : <p>{msg.content}</p>}
              </div>
              <div className={`flex items-center gap-2 mt-1 px-1 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                <span className="text-[9px] text-neutral-400">{msg.timestamp}</span>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => copyToClipboard(msg.id, msg.content)}
                    className="text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="bg-white border border-neutral-200 rounded-2xl rounded-bl-xs px-4 py-3 shadow-xs">
              <div className="flex gap-1.5 items-center h-4">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="shrink-0 px-4 py-2 border-t border-neutral-100 bg-white">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => sendMessage(prompt)}
              className="shrink-0 text-[10px] font-medium px-2.5 py-1.5 rounded-xl bg-violet-50 text-violet-700 border border-violet-100 hover:bg-violet-100 transition-colors whitespace-nowrap cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="shrink-0 p-3.5 bg-white border-t border-neutral-200">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 flex items-center bg-neutral-100 hover:bg-white border border-neutral-200 hover:border-violet-300 rounded-2xl px-4 py-2.5 gap-2 transition-all focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-200">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${activeSubject?.label || 'anything'} to your AI Study Buddy...`}
              className="flex-1 bg-transparent text-xs text-neutral-900 placeholder-neutral-400 outline-none"
              disabled={isLoading}
            />
            <Lightbulb className="w-3.5 h-3.5 text-violet-400 shrink-0" />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-gradient-to-br from-violet-600 to-blue-600 disabled:opacity-40 text-white rounded-2xl transition-all hover:brightness-110 active:scale-95 shadow-md shadow-violet-500/20 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[9px] text-neutral-400 text-center mt-2">
          AI Study Buddy can make mistakes. Always verify important academic formulas and dates with your teachers.
        </p>
      </div>
    </div>
  );
};
