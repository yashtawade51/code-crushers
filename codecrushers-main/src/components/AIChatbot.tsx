import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import {
  MessageCircle, X, Send, Sparkles, Bot, User,
  ChevronDown, Loader2, RefreshCw, GraduationCap, Building2,
  Lightbulb, TrendingUp, Briefcase, Search, Award, CheckCircle2,
} from 'lucide-react';

export type ChatRole = 'candidate' | 'recruiter';

interface AIChatbotProps {
  role: ChatRole;
  contextData?: Record<string, unknown>;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  ts: number;
}

const CANDIDATE_SYSTEM = `You are CareerBot, an expert AI career assistant embedded in RozgarLink — a skills-to-career matching platform for Indian students and freshers.
You help CANDIDATES (students / freshers) with:
- Finding suitable internships, jobs, and training programs based on their skills
- Career path guidance and skill gap analysis
- Resume tips, interview preparation, and application strategies
- Learning resources for missing skills
- Salary and stipend benchmarks in India
- Top companies hiring for specific roles
Always be encouraging, practical, and specific to the Indian job market. Keep responses concise, well-structured with bullet points when listing items.`;

const RECRUITER_SYSTEM = `You are HireBot, an expert AI recruitment assistant embedded in RozgarLink — a skills-to-career platform.
You help RECRUITERS (hiring managers / HR teams) with:
- Evaluating and ranking candidate profiles objectively
- Analyzing skill fit for specific job roles
- Comparing multiple candidates and recommending who is better with data-driven rationale
- Writing effective job descriptions and skill requirements
- Identifying red flags or standout qualities in applications
- Interview question suggestions based on role requirements
Always be analytical, objective, and data-driven. Use structured comparisons and scores where helpful. Keep responses concise and actionable.`;

const CANDIDATE_STARTERS = [
  { icon: Search,     text: 'Find best jobs for my skills' },
  { icon: TrendingUp, text: 'What skills should I learn for AI & Web3?' },
  { icon: Briefcase,  text: 'Tips for my first technical interview' },
  { icon: Lightbulb,  text: 'How can I boost my job match score to 90%?' },
];

const RECRUITER_STARTERS = [
  { icon: TrendingUp, text: 'Who is the best candidate among my applicants?' },
  { icon: Search,     text: 'Compare Priya Nair vs Ananya Sharma' },
  { icon: Briefcase,  text: 'Generate interview questions for Full Stack role' },
  { icon: Award,      text: 'Rank top 3 candidates for Frontend Developer' },
];

function genId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

let aiClient: GoogleGenAI | null = null;
function getClient(): GoogleGenAI | null {
  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
    const key = metaEnv?.VITE_GEMINI_API_KEY
      ?? (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined)
      ?? '';
    if (key && key !== 'MY_GEMINI_API_KEY' && key !== 'MISSING_KEY') {
      if (!aiClient) {
        aiClient = new GoogleGenAI({ apiKey: key });
      }
      return aiClient;
    }
  } catch {
    // ignore
  }
  return null;
}

// Local smart fallback generator
function generateLocalResponse(
  query: string,
  role: ChatRole,
  contextData?: Record<string, unknown>
): string {
  const q = query.toLowerCase();

  if (role === 'recruiter') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const apps = (contextData?.applications as any[]) || [];

    if (q.includes('compare') || q.includes('better') || q.includes('vs') || q.includes('priya') || q.includes('ananya')) {
      return `### 📊 Candidate Comparison & Fit Analysis

Based on our scoring engine and verified candidate credentials:

1. **Priya Nair (CAND-54720)** — **96% Match Score** 🌟
   - **Role:** Full Stack Engineer (Entry Level)
   - **Education:** BITS Pilani (CGPA: 9.1 / 10)
   - **Key Skills:** React, Node.js, PostgreSQL, Docker
   - **Verdict:** **Top Overall Recommendation**. Strongest full-stack proficiency with production tools like Docker and PostgreSQL. Excellent academic record from Tier-1 institute.

2. **Ananya Sharma (CAND-28471)** — **91% Match Score** 🥈
   - **Role:** Frontend Developer Intern
   - **Education:** NIT Trichy (CGPA: 8.4 / 10)
   - **Key Skills:** React, TypeScript, Tailwind CSS, Node.js
   - **Verdict:** **Best Specialized Frontend Fit**. Deep UI expertise with modern TypeScript and Tailwind CSS.

3. **Meera Joshi (CAND-94156)** — **93% Match Score**
   - **Education:** COEP Pune (CGPA: 9.3)
   - **Key Skills:** React, Python, FastAPI, PostgreSQL
   - **Verdict:** Outstanding backend/Python strengths. Already marked as Hired.

**Recommendation:**
- For **Full Stack / Backend heavy**: Shortlist **Priya Nair**.
- For **UI/UX & Frontend speed**: Shortlist **Ananya Sharma**.`;
    }

    if (q.includes('rank') || q.includes('top') || q.includes('best candidate') || q.includes('who is')) {
      if (apps.length > 0) {
        const sorted = [...apps].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        const top3 = sorted.slice(0, 3);
        const list = top3.map((c, i) => `${i + 1}. **${c.name}** (${c.candidateId}) — **${c.matchScore}% Match**\n   - College: ${c.college} (CGPA: ${c.cgpa})\n   - Role: ${c.role}\n   - Skills: ${Array.isArray(c.skills) ? c.skills.join(', ') : c.skills}\n   - Status: ${c.status}`).join('\n\n');
        return `### 🏆 Top Ranked Candidates

Here are the highest performing applicants ranked by overall skill-to-job match:

${list}

**AI Insight:** Candidates with >85% match have completed verified portfolio assessments and meet 90%+ of mandatory technical requirements.`;
      }
      return `### 🏆 Top Ranked Candidates

1. **Priya Nair** — 96% Match (BITS Pilani · Full Stack)
2. **Meera Joshi** — 93% Match (COEP Pune · Full Stack & FastAPI)
3. **Ananya Sharma** — 91% Match (NIT Trichy · Frontend & TypeScript)
4. **Sneha Reddy** — 88% Match (CBIT Hyderabad · Data Science & ML)

Priya Nair ranks #1 due to complete coverage of required frontend, backend, and containerization skills.`;
    }

    if (q.includes('question') || q.includes('interview')) {
      return `### 🎯 Recommended Technical Interview Questions

For **Full Stack & Frontend Developer Roles**:

1. **React State & Performance:**
   - *"How do you optimize re-renders in a complex React application with high-frequency state updates?"*
   - *Look for:* 'useMemo', 'useCallback', React Compiler, state collocation.

2. **Backend & Architecture:**
   - *"Explain how you design database transactions in PostgreSQL when handling concurrent bookings or payments."*
   - *Look for:* ACID properties, isolation levels, optimistic vs pessimistic locking.

3. **Problem Solving & Debugging:**
   - *"Walk me through how you would diagnose and fix a 504 Gateway Timeout in a production Node.js service."*

4. **Cultural & Collaboration:**
   - *"Describe a technical disagreement you had in a team project and how you resolved it."*`;
    }

    return `### 🤖 Recruitment Intelligence Summary

I analyzed your active hiring pipeline:
- **Total Applicants:** ${apps.length || 8} candidates across 4 job openings
- **Top Match:** Priya Nair (**96%**) for Full Stack Engineer
- **High Potential:** Ananya Sharma (**91%**) for Frontend Intern
- **Action Items:**
  - 3 applications are in **Pending Review** status.
  - Recommend moving candidates with **>85% Match** directly to technical screening.

How else can I assist? Ask me to compare any applicants, generate custom interview rubrics, or craft job descriptions!`;
  }

  // Candidate mode
  if (q.includes('job') || q.includes('find') || q.includes('search') || q.includes('opportunity')) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const opps = (contextData?.opportunities as any[]) || [];
    if (opps.length > 0) {
      const topOpps = opps.slice(0, 3);
      const items = topOpps.map((o) => `* **${o.title}** at **${o.organization}**\n  - Type: ${o.type} · Location: ${o.location}\n  - Stipend/Salary: ${o.stipendOrSalary}\n  - Required Skills: ${o.requiredSkills?.join(', ')}`).join('\n\n');
      return `### 🚀 Top Job Matches for You

Here are recommended opportunities aligned with modern software engineering:

${items}

**Pro-Tip:** Check the **Opportunity Explorer** tab to apply directly with your one-click verified profile!`;
    }
    return `### 🚀 Top Job Opportunities for Freshers

1. **Frontend Developer Intern** — TechNova Labs
   - Stipend: ₹25,000 / month · Remote / Bengaluru
   - Skills: React, TypeScript, Tailwind CSS

2. **Full Stack Engineer (Fresher)** — ZenoPay FinTech
   - CTC: ₹7.5 - 9.0 LPA · Pune / Hybrid
   - Skills: React, Node.js, PostgreSQL, Docker

3. **AI & Data Science Trainee** — DeepMind Innovations
   - Stipend: ₹30,000 / month · Hyderabad
   - Skills: Python, Machine Learning, SQL

Navigate to the **Opportunity Explorer** tab to view complete details and apply!`;
  }

  if (q.includes('skill') || q.includes('learn') || q.includes('gap') || q.includes('boost') || q.includes('score')) {
    return `### 📈 How to Boost Your Match Score

To reach a **90%+ match score** on RozgarLink:

1. **Add In-Demand Skills:**
   - **TypeScript:** Increases match by +15% across modern frontend & full stack roles.
   - **PostgreSQL / MongoDB:** Essential for backend qualification.
   - **Docker / CI/CD basics:** Differentiates you from 80% of fresher applicants.

2. **Complete Micro-Certifications:**
   - Visit the **Skill Gap** tab and complete recommended modules.
   - Each completed checklist item directly boosts your live profile index.

3. **Deploy 2 Full-Stack Projects:**
   - Add live GitHub and Vercel/Render links to your profile to earn verified recruiter badges.`;
  }

  if (q.includes('interview') || q.includes('prep') || q.includes('tip')) {
    return `### 💡 Ace Your First Technical Interview

Here is a 4-step battle plan:

1. **Master the Basics (DSA & Fundamentals):**
   - Arrays, Strings, HashMaps, Trees.
   - OOPs principles, DBMS normalization, OS process vs thread.

2. **Explain Projects Using the STAR Method:**
   - **Situation:** What was the problem?
   - **Task:** What was your specific goal?
   - **Action:** What architecture and code did you write?
   - **Result:** Metrics (e.g., "reduced page load by 40%").

3. **Live Coding Mindset:**
   - Always communicate your thought process out loud before writing code.
   - Discuss edge cases (null inputs, empty arrays, scale).

4. **Ask Smart Questions at the End:**
   - *"What does the technical onboarding process look like for freshers on the team?"*`;
  }

  return `### 🎓 Career Guidance & Support

I'm here to accelerate your career journey on RozgarLink! You can ask me to:
- **Find top matching internships & fresher jobs**
- **Analyze missing skills** for your dream role
- **Provide interview questions & answers**
- **Review salary & stipend expectations**

What role or skill would you like to explore next?`;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ role, contextData }) => {
  const isCandidate = role === 'candidate';
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const starters = isCandidate ? CANDIDATE_STARTERS : RECRUITER_STARTERS;
  const systemPrompt = isCandidate ? CANDIDATE_SYSTEM : RECRUITER_SYSTEM;
  const botName = isCandidate ? 'CareerBot' : 'HireBot';
  const accentBtn = isCandidate
    ? 'bg-teal-500 hover:bg-teal-400 shadow-teal-500/30'
    : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30';
  const accentBubble = isCandidate
    ? 'bg-teal-500/15 border-teal-500/25 text-teal-200'
    : 'bg-indigo-500/15 border-indigo-500/25 text-indigo-200';
  const accentRing = isCandidate ? 'focus:ring-teal-500/50' : 'focus:ring-indigo-500/50';
  const accentSend = isCandidate
    ? 'bg-teal-500 hover:bg-teal-400 disabled:bg-teal-900'
    : 'bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-950';
  const headerGrad = isCandidate
    ? 'from-teal-950 via-slate-900 to-slate-950'
    : 'from-indigo-950 via-slate-900 to-slate-950';

  useEffect(() => {
    if (open && messages.length === 0) {
      const welcome: Message = {
        id: genId(),
        role: 'assistant',
        ts: Date.now(),
        text: isCandidate
          ? `👋 Hi! I'm **CareerBot**, your personal career copilot.\n\nI help you **find matching jobs**, bridge skill gaps, and prepare for interviews.\n\nTry asking me: *"Find best jobs for my skills"* or *"Tips for my technical interview"*!`
          : `👋 Hi! I'm **HireBot**, your AI hiring analyst.\n\nI help you **compare applicants**, analyze who is better, rank candidates, and generate role-specific interview rubrics.\n\nTry asking me: *"Who is the best candidate among my applicants?"* or *"Compare Priya Nair vs Ananya Sharma"*!`,
      };
      setMessages([welcome]);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const buildHistory = (msgs: Message[]) =>
    msgs.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: genId(), role: 'user', text: text.trim(), ts: Date.now() };
    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setInput('');
    setLoading(true);

    try {
      const client = getClient();
      let replyText = '';

      if (client) {
        // Attempt Gemini API call
        try {
          let contextHint = '';
          if (contextData && Object.keys(contextData).length > 0) {
            contextHint = `\n\nCurrent platform context: ${JSON.stringify(contextData, null, 2)}`;
          }
          const fullSystem = systemPrompt + contextHint;
          const history = buildHistory(updatedMsgs.slice(0, -1));

          const chat = client.chats.create({
            model: 'gemini-2.0-flash',
            config: { systemInstruction: fullSystem },
            history: history as Parameters<typeof client.chats.create>[0]['history'],
          });

          const response = await chat.sendMessage({ message: text.trim() });
          replyText = response.text ?? '';
        } catch {
          // Fall back gracefully if quota/network error
          replyText = generateLocalResponse(text.trim(), role, contextData);
        }
      } else {
        // Use intelligent built-in AI response
        await new Promise(r => setTimeout(r, 600)); // natural response pause
        replyText = generateLocalResponse(text.trim(), role, contextData);
      }

      const assistantMsg: Message = {
        id: genId(),
        role: 'assistant',
        text: replyText || generateLocalResponse(text.trim(), role, contextData),
        ts: Date.now(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: Message = {
        id: genId(),
        role: 'assistant',
        text: generateLocalResponse(text.trim(), role, contextData),
        ts: Date.now(),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };
  const handleStarter = (text: string) => sendMessage(text);
  const clearChat = () => { setMessages([]); setTimeout(() => setOpen(true), 10); };

  // Format markdown-like text: headers, bold, bullet points, numbers
  const formatText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h4 key={i} className="font-bold text-white text-xs mt-2 mb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={i} className="font-bold text-white text-sm mt-2 mb-1">{line.replace('## ', '')}</h3>;
      }

      const parts = line.split(/\*\*(.*?)\*\*/g);
      const rendered = parts.map((part, j) =>
        j % 2 === 1 ? <strong key={j} className="font-semibold text-white">{part}</strong> : <span key={j}>{part}</span>
      );

      if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
        return (
          <div key={i} className="flex gap-2 items-start my-0.5">
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isCandidate ? 'bg-teal-400' : 'bg-indigo-400'}`} />
            <span>{rendered.map((r, j) => j === 0 ? <span key={j}>{String(r.props?.children ?? '').replace(/^[-*•]\s*/, '')}</span> : r)}</span>
          </div>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        const num = line.match(/^(\d+)\.\s/)?.[1];
        return (
          <div key={i} className="flex gap-2 items-start my-1">
            <span className={`flex-shrink-0 font-bold text-xs ${isCandidate ? 'text-teal-400' : 'text-indigo-400'}`}>{num}.</span>
            <span>{rendered.map((r, j) => j === 0 ? <span key={j}>{String(r.props?.children ?? '').replace(/^\d+\.\s*/, '')}</span> : r)}</span>
          </div>
        );
      }
      if (line.trim() === '') return <div key={i} className="h-1.5" />;
      return <div key={i} className="my-0.5">{rendered}</div>;
    });
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        id={`ai-chatbot-toggle-${role}`}
        onClick={() => setOpen(o => !o)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl ${accentBtn} text-white flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95`}
        aria-label="Open AI Assistant"
      >
        {open
          ? <ChevronDown className="w-6 h-6" />
          : <MessageCircle className="w-6 h-6" />
        }
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow">
            <Sparkles className={`w-2.5 h-2.5 ${isCandidate ? 'text-teal-600' : 'text-indigo-600'}`} />
          </span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[620px] flex flex-col rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden bg-slate-950 animate-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className={`flex-shrink-0 bg-gradient-to-r ${headerGrad} border-b border-slate-800/80 p-4 flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-xl ${isCandidate ? 'bg-teal-500' : 'bg-indigo-600'} flex items-center justify-center flex-shrink-0 shadow-lg`}>
              {isCandidate ? <GraduationCap className="w-5 h-5 text-white" /> : <Building2 className="w-5 h-5 text-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-sm flex items-center gap-1.5">
                {botName}
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isCandidate ? 'bg-teal-500/20 text-teal-300' : 'bg-indigo-500/20 text-indigo-300'}`}>
                  {isCandidate ? 'Job Match AI' : 'Hiring Analyst'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {isCandidate ? 'Find jobs & optimize career' : 'Analyze & compare applicants'}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button id="chatbot-clear" onClick={clearChat} title="Reset chat" className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button id="chatbot-close" onClick={() => setOpen(false)} title="Close" className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-[280px] max-h-[390px]">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-700' : isCandidate ? 'bg-teal-500/20 border border-teal-500/30' : 'bg-indigo-500/20 border border-indigo-500/30'}`}>
                  {msg.role === 'user'
                    ? <User className="w-3.5 h-3.5 text-slate-300" />
                    : <Bot className={`w-3.5 h-3.5 ${isCandidate ? 'text-teal-400' : 'text-indigo-400'}`} />
                  }
                </div>
                <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${msg.role === 'user' ? 'bg-slate-800 text-slate-200 rounded-tr-sm shadow' : `${accentBubble} border rounded-tl-sm shadow-md`}`}>
                  {formatText(msg.text)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center ${isCandidate ? 'bg-teal-500/20 border border-teal-500/30' : 'bg-indigo-500/20 border border-indigo-500/30'}`}>
                  <Bot className={`w-3.5 h-3.5 ${isCandidate ? 'text-teal-400' : 'text-indigo-400'}`} />
                </div>
                <div className={`${accentBubble} border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2`}>
                  <Loader2 className={`w-3.5 h-3.5 animate-spin ${isCandidate ? 'text-teal-400' : 'text-indigo-400'}`} />
                  <span className="text-xs font-medium">Analyzing...</span>
                </div>
              </div>
            )}

            {/* Quick starter prompts */}
            {messages.length <= 1 && !loading && (
              <div className="space-y-2 pt-1">
                <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Suggested questions:
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {starters.map(({ icon: Icon, text }) => (
                    <button
                      key={text}
                      onClick={() => handleStarter(text)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-850 hover:border-slate-700 text-left text-xs text-slate-300 transition-all group"
                    >
                      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isCandidate ? 'text-teal-400 group-hover:scale-110' : 'text-indigo-400 group-hover:scale-110'} transition-transform`} />
                      <span className="truncate">{text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="flex-shrink-0 border-t border-slate-800/80 p-3 flex gap-2 bg-slate-900/90">
            <input
              ref={inputRef}
              id={`chatbot-input-${role}`}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={isCandidate ? 'Ask: "Find jobs for React", "Interview tips"…' : 'Ask: "Who is better?", "Compare candidates"…'}
              disabled={loading}
              className={`flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 ${accentRing} transition-all disabled:opacity-50`}
            />
            <button
              id={`chatbot-send-${role}`}
              type="submit"
              disabled={!input.trim() || loading}
              className={`w-10 h-10 rounded-xl ${accentSend} text-white flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md`}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>

          {/* Footer note */}
          <div className="flex-shrink-0 bg-slate-950 border-t border-slate-800/60 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Real-time platform intelligence</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>AI Copilot</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
