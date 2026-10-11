import React, { useState } from 'react';
import {
  Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Sparkles,
  GraduationCap, Briefcase, TrendingUp, Building2, Users, BadgeCheck,
  ChevronLeft, Zap, CheckCircle, ChevronRight,
} from 'lucide-react';

export type UserRole = 'candidate' | 'recruiter';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
}

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
  onCancel?: () => void;
  initialRole?: UserRole;
}

type AuthMode = 'login' | 'register';
type Step = 'role-select' | 'auth';

// ID generators
function generateId(role: UserRole): string {
  const prefix = role === 'candidate' ? 'CAND' : 'RECR';
  const num = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${num}`;
}

const CANDIDATE_FEATURES = [
  { icon: Zap,          text: 'Smart Skill-to-Opportunity Matching' },
  { icon: TrendingUp,   text: 'Real-time Skill Gap Analysis' },
  { icon: Briefcase,    text: 'Internship & Job Tracker' },
  { icon: GraduationCap,text: 'Curated Learning Resources' },
];

const RECRUITER_FEATURES = [
  { icon: Users,        text: 'AI-Powered Candidate Screening' },
  { icon: BadgeCheck,   text: 'Verified Skill Profiles' },
  { icon: Briefcase,    text: 'Post & Manage Job Listings' },
  { icon: TrendingUp,   text: 'Analytics & Hiring Insights' },
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onCancel, initialRole }) => {
  const [step, setStep]         = useState<Step>(initialRole ? 'auth' : 'role-select');
  const [role, setRole]         = useState<UserRole>(initialRole || 'candidate');
  const [mode, setMode]         = useState<AuthMode>('login');
  const [showPwd, setShowPwd]   = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors]     = useState<Record<string, string>>({});

  // shared fields
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  // register-only
  const [name, setName]           = useState('');
  const [phone, setPhone]         = useState('');
  const [company, setCompany]     = useState('');  // recruiter only
  const [confirmPwd, setConfirmPwd] = useState('');
  const [agreed, setAgreed]       = useState(false);

  const isCandidate = role === 'candidate';

  const selectRole = (r: UserRole) => {
    setRole(r);
    setStep('auth');
    setMode('login');
    setErrors({});
  };

  const back = () => {
    setStep('role-select');
    setErrors({});
    setEmail(''); setPassword(''); setName(''); setPhone('');
    setCompany(''); setConfirmPwd(''); setAgreed(false);
  };

  const switchMode = (m: AuthMode) => { setMode(m); setErrors({}); };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email.';
    if (!password) e.password = 'Password is required.';
    else if (password.length < (mode === 'register' ? 8 : 6)) e.password = `Min. ${mode === 'register' ? 8 : 6} characters.`;

    if (mode === 'register') {
      if (!name.trim()) e.name = 'Full name is required.';
      if (!phone.trim()) e.phone = 'Phone is required.';
      else if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) e.phone = 'Enter a valid 10-digit number.';
      if (!isCandidate && !company.trim()) e.company = 'Company name is required.';
      if (!confirmPwd) e.confirmPwd = 'Please confirm your password.';
      else if (password !== confirmPwd) e.confirmPwd = 'Passwords do not match.';
      if (!agreed) e.agreed = 'You must agree to the terms.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1100));
    onLogin({ id: generateId(role), name: mode === 'login' ? email.split('@')[0] : name, email, role });
    setIsLoading(false);
  };

  const handleDemo = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 700));
    onLogin({
      id: generateId(role),
      name: isCandidate ? 'Demo Candidate' : 'Demo Recruiter',
      email: isCandidate ? 'demo.candidate@rozgarlink.in' : 'demo.recruiter@rozgarlink.in',
      role,
    });
    setIsLoading(false);
  };

  const features = isCandidate ? CANDIDATE_FEATURES : RECRUITER_FEATURES;
  const accentFrom = isCandidate ? 'from-teal-400' : 'from-indigo-400';
  const accentTo   = isCandidate ? 'to-cyan-400'  : 'to-violet-400';
  const btnBg      = isCandidate ? 'bg-teal-500 hover:bg-teal-400 shadow-teal-500/20' : 'bg-indigo-500 hover:bg-indigo-400 shadow-indigo-500/20';
  const ringColor  = isCandidate ? 'focus:ring-teal-500/50 focus:border-teal-500/60' : 'focus:ring-indigo-500/50 focus:border-indigo-500/60';
  const badgeBg    = isCandidate ? 'bg-teal-500/15 border-teal-500/30 text-teal-400' : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400';
  const pulseColor = isCandidate ? 'bg-teal-400' : 'bg-indigo-400';
  const iconColor  = isCandidate ? 'text-teal-400' : 'text-indigo-400';
  const iconBg     = isCandidate ? 'bg-teal-500/15 border-teal-500/20' : 'bg-indigo-500/15 border-indigo-500/20';

  const inputCls = (errKey: string) =>
    `w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${errors[errKey] ? 'border-red-500/70' : `border-slate-700/80 ${ringColor}`}`;

  /* ── ROLE SELECT ── */
  if (step === 'role-select') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-10">
          {/* Top navigation */}
          {onCancel && (
            <div className="flex justify-start">
              <button
                onClick={onCancel}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to RozgarLink Home</span>
              </button>
            </div>
          )}

          {/* Logo */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">RozgarLink</span>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Who are you?</h1>
            <p className="text-slate-400 text-sm sm:text-base">Choose your role to get started with the right experience.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Candidate Card */}
            <button id="role-candidate" onClick={() => selectRole('candidate')}
              className="group relative p-7 rounded-2xl border border-slate-700/80 bg-slate-900/70 hover:border-teal-500/60 hover:bg-slate-800/80 transition-all text-left overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-teal-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-white">Candidate</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 font-semibold border border-teal-500/30">ID: CAND-XXXXX</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">Students & freshers looking for internships, jobs, and skill-building opportunities.</p>
                </div>
                <ul className="space-y-2 text-xs text-slate-400">
                  {['Match with 500+ opportunities', 'AI skill gap analysis', 'Track applications'].map(t => (
                    <li key={t} className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />{t}</li>
                  ))}
                </ul>
                <div className="flex items-center gap-1.5 text-teal-400 text-sm font-semibold">
                  <span>Get started</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>

            {/* Recruiter Card */}
            <button id="role-recruiter" onClick={() => selectRole('recruiter')}
              className="group relative p-7 rounded-2xl border border-slate-700/80 bg-slate-900/70 hover:border-indigo-500/60 hover:bg-slate-800/80 transition-all text-left overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-indigo-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-white">Recruiter</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-semibold border border-indigo-500/30">ID: RECR-XXXXX</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">Companies & hiring managers searching for skilled, verified student talent.</p>
                </div>
                <ul className="space-y-2 text-xs text-slate-400">
                  {['Post & manage job listings', 'AI candidate matching', 'Skill-verified profiles'].map(t => (
                    <li key={t} className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />{t}</li>
                  ))}
                </ul>
                <div className="flex items-center gap-1.5 text-indigo-400 text-sm font-semibold">
                  <span>Get started</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          </div>

          <p className="text-center text-slate-600 text-xs">
            By continuing you agree to our <a href="#" className="text-slate-400 hover:underline">Terms</a> & <a href="#" className="text-slate-400 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    );
  }

  /* ── AUTH FORM ── */
  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${isCandidate ? 'from-teal-950' : 'from-indigo-950'} via-slate-900 to-slate-950`} />
        <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full ${isCandidate ? 'bg-teal-500/10' : 'bg-indigo-500/10'} blur-3xl`} />
        <div className={`absolute top-1/2 -right-24 w-80 h-80 rounded-full ${isCandidate ? 'bg-cyan-500/8' : 'bg-violet-500/8'} blur-3xl`} />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 flex flex-col justify-between h-full p-10 xl:p-14">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${isCandidate ? 'bg-teal-500 shadow-teal-500/30' : 'bg-indigo-500 shadow-indigo-500/30'} flex items-center justify-center shadow-lg`}>
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">RozgarLink</span>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${badgeBg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${pulseColor} animate-pulse`} />
                {isCandidate ? 'Candidate Portal' : 'Recruiter Portal'}
              </div>
              <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight">
                {isCandidate ? (<>Your Skills.<br/>Your Career.<br/></>) : (<>Find Talent.<br/>Build Teams.<br/></>)}
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${accentFrom} ${accentTo}`}>
                  {isCandidate ? 'Your Future.' : 'Grow Faster.'}
                </span>
              </h1>
              <p className="text-slate-400 text-base xl:text-lg leading-relaxed max-w-md">
                {isCandidate
                  ? 'Discover opportunities perfectly matched to your skills, goals, and potential.'
                  : 'Connect with pre-screened, skill-verified student talent ready to make an impact.'}
              </p>
            </div>
            <ul className="space-y-3.5">
              {features.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${iconBg} border flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                  </div>
                  <span className="text-slate-300 text-sm font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold ${isCandidate ? 'border-teal-500/30 text-teal-400 bg-teal-500/10' : 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10'}`}>
              {isCandidate ? '🎓 Candidate ID: CAND-XXXXX' : '🏢 Recruiter ID: RECR-XXXXX'}
            </div>
            <p className="text-slate-600 text-xs">A unique ID will be generated upon registration.</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex flex-col justify-center px-6 sm:px-10 xl:px-16 py-10 bg-slate-950 overflow-y-auto">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Back + Mobile Logo */}
          <div className="flex items-center gap-3">
            <button id="back-to-role" onClick={back} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-medium transition-colors">
              <ChevronLeft className="w-4 h-4" />Back
            </button>
            {onCancel && (
              <button onClick={onCancel} className="text-slate-400 hover:text-white text-xs font-medium ml-auto flex items-center gap-1 transition-colors">
                <span>Exit to Home</span>
              </button>
            )}
            <div className={`flex items-center gap-2 lg:hidden ${onCancel ? '' : 'ml-auto'}`}>
              <div className={`w-7 h-7 rounded-lg ${isCandidate ? 'bg-teal-500' : 'bg-indigo-500'} flex items-center justify-center`}>
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              </div>
              <span className="text-white font-bold text-base">RozgarLink</span>
            </div>
          </div>

          {/* Role badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${badgeBg}`}>
            {isCandidate ? <GraduationCap className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
            {isCandidate ? 'Candidate Portal' : 'Recruiter Portal'}
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {mode === 'login' ? 'Welcome back 👋' : `Create ${isCandidate ? 'Candidate' : 'Recruiter'} Account`}
            </h2>
            <p className="text-slate-400 text-sm mt-1.5">
              {mode === 'login'
                ? `Sign in to your ${isCandidate ? 'candidate' : 'recruiter'} dashboard.`
                : isCandidate ? 'Start discovering opportunities built for you.' : 'Start finding the right talent for your team.'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl bg-slate-800/70 border border-slate-700/60 p-1 gap-1">
            {(['login', 'register'] as AuthMode[]).map(m => (
              <button key={m} id={`auth-tab-${m}`} onClick={() => switchMode(m)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === m
                  ? `${isCandidate ? 'bg-teal-500' : 'bg-indigo-500'} text-slate-950 shadow-md`
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form id="auth-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
            {mode === 'register' && (
              <>
                <div className="space-y-1.5">
                  <label htmlFor="f-name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input id="f-name" type="text" autoComplete="name" placeholder={isCandidate ? 'Riya Sharma' : 'Arjun Mehta'} value={name} onChange={e => setName(e.target.value)} className={inputCls('name')} />
                  </div>
                  {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="f-phone" className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input id="f-phone" type="tel" autoComplete="tel" placeholder="9876543210" value={phone} onChange={e => setPhone(e.target.value)} className={inputCls('phone')} />
                  </div>
                  {errors.phone && <p className="text-red-400 text-xs">{errors.phone}</p>}
                </div>
                {!isCandidate && (
                  <div className="space-y-1.5">
                    <label htmlFor="f-company" className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">Company Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      <input id="f-company" type="text" placeholder="Acme Technologies Pvt Ltd" value={company} onChange={e => setCompany(e.target.value)} className={inputCls('company')} />
                    </div>
                    {errors.company && <p className="text-red-400 text-xs">{errors.company}</p>}
                  </div>
                )}
              </>
            )}

            <div className="space-y-1.5">
              <label htmlFor="f-email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input id="f-email" type="email" autoComplete="email" placeholder={isCandidate ? 'you@college.edu' : 'hr@company.com'} value={email} onChange={e => setEmail(e.target.value)} className={inputCls('email')} />
              </div>
              {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="f-password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input id="f-password" type={showPwd ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  placeholder={mode === 'login' ? '••••••••' : 'Min. 8 characters'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-11 py-3 rounded-xl bg-slate-800/80 border text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${errors.password ? 'border-red-500/70' : `border-slate-700/80 ${ringColor}`}`} />
                <button type="button" id="toggle-pwd" onClick={() => setShowPwd(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
            </div>

            {mode === 'register' && (
              <div className="space-y-1.5">
                <label htmlFor="f-confirm" className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input id="f-confirm" type={showCPwd ? 'text' : 'password'} autoComplete="new-password"
                    placeholder="Repeat your password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)}
                    className={`w-full pl-10 pr-11 py-3 rounded-xl bg-slate-800/80 border text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${errors.confirmPwd ? 'border-red-500/70' : `border-slate-700/80 ${ringColor}`}`} />
                  <button type="button" id="toggle-cpwd" onClick={() => setShowCPwd(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showCPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPwd && <p className="text-red-400 text-xs">{errors.confirmPwd}</p>}
              </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button type="button" id="forgot-pwd" className={`text-xs font-medium transition-colors ${isCandidate ? 'text-teal-400 hover:text-teal-300' : 'text-indigo-400 hover:text-indigo-300'}`}>Forgot password?</button>
              </div>
            )}

            {mode === 'register' && (
              <div className="space-y-1">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5 flex-shrink-0">
                    <input id="terms-check" type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="sr-only" />
                    <div className={`rounded-md border-2 flex items-center justify-center transition-all ${agreed ? `${isCandidate ? 'bg-teal-500 border-teal-500' : 'bg-indigo-500 border-indigo-500'}` : errors.agreed ? 'border-red-500' : 'border-slate-600 group-hover:border-slate-400'}`} style={{ width: '18px', height: '18px' }}>
                      {agreed && <CheckCircle className="w-3 h-3 text-slate-950" />}
                    </div>
                  </div>
                  <span className="text-slate-400 text-xs leading-relaxed">I agree to the <a href="#" className={`font-medium hover:underline ${isCandidate ? 'text-teal-400' : 'text-indigo-400'}`}>Terms of Service</a> and <a href="#" className={`font-medium hover:underline ${isCandidate ? 'text-teal-400' : 'text-indigo-400'}`}>Privacy Policy</a></span>
                </label>
                {errors.agreed && <p className="text-red-400 text-xs pl-7">{errors.agreed}</p>}
              </div>
            )}

            <button id="auth-submit" type="submit" disabled={isLoading}
              className={`w-full py-3.5 rounded-xl ${btnBg} disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 mt-2`}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                <><span>{mode === 'login' ? 'Sign In to Dashboard' : `Create ${isCandidate ? 'Candidate' : 'Recruiter'} Account`}</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" /><span className="text-slate-600 text-xs font-medium">or</span><div className="flex-1 h-px bg-slate-800" />
          </div>

          <button id="demo-login" type="button" onClick={handleDemo} disabled={isLoading}
            className="w-full py-3 rounded-xl border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 disabled:opacity-60 text-slate-300 hover:text-white text-sm font-semibold transition-all flex items-center justify-center gap-2">
            <Sparkles className={`w-4 h-4 ${iconColor}`} />
            <span>Try Demo {isCandidate ? 'Candidate' : 'Recruiter'} Account</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <p className="text-center text-slate-500 text-xs">
            {mode === 'login'
              ? <><span>No account? </span><button id="switch-register" onClick={() => switchMode('register')} className={`font-semibold transition-colors ${isCandidate ? 'text-teal-400 hover:text-teal-300' : 'text-indigo-400 hover:text-indigo-300'}`}>Register free →</button></>
              : <><span>Have an account? </span><button id="switch-login" onClick={() => switchMode('login')} className={`font-semibold transition-colors ${isCandidate ? 'text-teal-400 hover:text-teal-300' : 'text-indigo-400 hover:text-indigo-300'}`}>Sign in →</button></>}
          </p>
        </div>
      </div>
    </div>
  );
};
