import React, { useState } from 'react';
import {
  Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Sparkles,
  GraduationCap, Briefcase, TrendingUp, Building2, Users, BadgeCheck,
  ChevronLeft, Zap, CheckCircle, Award, CheckCircle2, ShieldCheck,
  Compass,
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

function generateId(role: UserRole): string {
  const prefix = role === 'candidate' ? 'CAND' : 'RECR';
  const num = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${num}`;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onCancel, initialRole = 'candidate' }) => {
  const [activeRole, setActiveRole] = useState<UserRole>(initialRole);
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPwd, setShowPwd] = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [college, setCollege] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [agreed, setAgreed] = useState(false);

  const isCandidate = activeRole === 'candidate';

  const switchRole = (r: UserRole) => {
    setActiveRole(r);
    setErrors({});
    setEmail('');
    setPassword('');
    setConfirmPwd('');
  };

  const switchMode = (m: AuthMode) => {
    setMode(m);
    setErrors({});
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address.';
    if (!password) e.password = 'Password is required.';
    else if (password.length < (mode === 'register' ? 8 : 6)) {
      e.password = `Min. ${mode === 'register' ? 8 : 6} characters required.`;
    }

    if (mode === 'register') {
      if (!name.trim()) e.name = 'Full name is required.';
      if (!phone.trim()) e.phone = 'Phone number is required.';
      else if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) e.phone = 'Enter a valid 10-digit number.';
      if (!isCandidate && !company.trim()) e.company = 'Company name is required.';
      if (isCandidate && !college.trim()) e.college = 'College or University name is required.';
      if (!confirmPwd) e.confirmPwd = 'Confirm password is required.';
      else if (password !== confirmPwd) e.confirmPwd = 'Passwords do not match.';
      if (!agreed) e.agreed = 'You must accept the terms & conditions.';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const emailPrefix = email.trim().split('@')[0] || '';
      const fallbackNameFromEmail = emailPrefix
        .split(/[._-]/)
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const resolvedName =
        name.trim() || fallbackNameFromEmail || (isCandidate ? 'Ananya Sharma' : 'Vikram Malhotra');

      const user: AuthUser = {
        id: generateId(activeRole),
        name: resolvedName,
        email: email.trim(),
        role: activeRole,
        ...(activeRole === 'recruiter' ? { company: company.trim() || 'TechNova Solutions' } : {}),
      };
      onLogin(user);
    }, 400);
  };

  const DEMO_PERSONAS = {
    candidate: [
      { id: 'CAND-28471', name: 'Ananya Sharma', email: 'ananya@campus.edu', tag: 'NIT Trichy · Frontend', role: 'candidate' as const },
      { id: 'CAND-71932', name: 'Rohan Deshmukh', email: 'rohan.deshmukh@university.edu', tag: 'Apex Inst · Data Science', role: 'candidate' as const },
      { id: 'CAND-40285', name: 'Vikram Joshi', email: 'vikram.j@techcol.edu', tag: 'State Eng · Cloud/DevOps', role: 'candidate' as const },
    ],
    recruiter: [
      { id: 'RECR-78815', name: 'Vikram Malhotra', email: 'vikram@technova.com', company: 'TechNova Solutions', tag: 'TechNova Solutions · VP Hiring', role: 'recruiter' as const },
      { id: 'RECR-99214', name: 'Meera Nair', email: 'meera@infosys.com', company: 'Infosys BPM', tag: 'Infosys BPM · Lead Campus Talent', role: 'recruiter' as const },
      { id: 'RECR-84012', name: 'Siddharth Rao', email: 'siddharth@tcs.com', company: 'Tata Consultancy Services', tag: 'TCS · Global University Hiring', role: 'recruiter' as const },
    ],
  };

  const handlePersonaLogin = (p: AuthUser) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(p);
    }, 300);
  };

  // Color theming tokens
  const theme = isCandidate
    ? {
        accent: 'teal',
        primaryBg: 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20',
        ring: 'focus:ring-teal-500/30 focus:border-teal-600',
        badge: 'bg-teal-100/80 border-teal-200 text-teal-800',
        gradient: 'from-teal-50/90 via-emerald-50/60 to-slate-50',
        glow: 'bg-teal-500/10',
        text: 'text-teal-600',
        iconBg: 'bg-teal-100 text-teal-700 border-teal-200',
      }
    : {
        accent: 'indigo',
        primaryBg: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20',
        ring: 'focus:ring-indigo-500/30 focus:border-indigo-600',
        badge: 'bg-indigo-100/80 border-indigo-200 text-indigo-800',
        gradient: 'from-indigo-50/90 via-purple-50/60 to-slate-50',
        glow: 'bg-indigo-500/10',
        text: 'text-indigo-600',
        iconBg: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 font-sans">
      {/* ── TOP HEADER / PANEL SWITCHER BAR ── */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-8 py-3.5 sticky top-0 z-20 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 via-teal-900 to-teal-600 flex items-center justify-center text-white shadow-xs transition-colors">
              <Compass className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-base tracking-tight">
                Rozgar<span className="text-teal-600">Link</span>
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline ml-2">Skills-to-Career Platform</span>
            </div>
          </div>

          {/* DEDICATED PANEL SWITCHER TABS */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-xs">
            <button
              id="tab-candidate-panel"
              type="button"
              onClick={() => switchRole('candidate')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isCandidate
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Candidate Login Panel</span>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${isCandidate ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
                CAND-ID
              </span>
            </button>

            <button
              id="tab-recruiter-panel"
              type="button"
              onClick={() => switchRole('recruiter')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                !isCandidate
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Recruiter Login Panel</span>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${!isCandidate ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
                RECR-ID
              </span>
            </button>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors px-3 py-1.5 rounded-xl hover:bg-slate-100 border border-slate-200"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          )}
        </div>
      </header>

      {/* ── MAIN AUTH SECTION ── */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* ── LEFT PANEL: ROLE BRANDING & FEATURE DOSSIER (5 COLS) ── */}
          <div className={`lg:col-span-5 relative p-8 sm:p-10 flex flex-col justify-between overflow-hidden bg-gradient-to-br ${theme.gradient} border-b lg:border-b-0 lg:border-r border-slate-200`}>
            <div className={`absolute -top-24 -left-24 w-80 h-80 rounded-full ${theme.glow} blur-3xl`} />
            
            <div className="relative z-10 space-y-6">
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold ${theme.badge}`}>
                {isCandidate ? <GraduationCap className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                <span>{isCandidate ? 'Candidate Portal (CAND-XXXXX)' : 'Recruiter Portal (RECR-XXXXX)'}</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {isCandidate ? 'Accelerate Your Dream Tech Career' : 'Hire Verified Engineering Talent'}
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                  {isCandidate
                    ? 'Algorithmic skills-to-career matchmaking for students and freshers across India with certified KYC verification.'
                    : 'Streamline campus hiring with objective AI candidate rankings, certified skill verifications, and comparison dossiers.'}
                </p>
              </div>

              {/* Feature points */}
              <div className="space-y-3 pt-2">
                {(isCandidate
                  ? [
                      { icon: Zap, text: 'Smart Skill-to-Opportunity Match Engine' },
                      { icon: ShieldCheck, text: 'Technical Language Certificate Verification' },
                      { icon: Award, text: 'Verified CGPA with Official Marksheet OCR' },
                      { icon: Briefcase, text: 'One-Click Internship & Job Applications' },
                    ]
                  : [
                      { icon: Users, text: 'AI-Powered "Who is Better?" Candidate Comparison' },
                      { icon: ShieldCheck, text: 'Verified KYC Credentials & Marksheet Audit' },
                      { icon: TrendingUp, text: 'Comprehensive Technical Language Fit Breakdown' },
                      { icon: Briefcase, text: 'Unified Single-Tab Application Review Pipeline' },
                    ]
                ).map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-xs text-slate-700">
                    <div className={`w-6 h-6 rounded-lg ${theme.iconBg} border flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Demo Login trigger */}
            <div className="relative z-10 pt-6 border-t border-slate-200/90 mt-6 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Choose Demo {isCandidate ? 'Candidate' : 'Recruiter'} Profile:</span>
                </span>
              </div>
              <div className="space-y-1.5">
                {(isCandidate ? DEMO_PERSONAS.candidate : DEMO_PERSONAS.recruiter).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePersonaLogin(p)}
                    disabled={isLoading}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-between gap-2 shadow-xs group"
                  >
                    <div className="min-w-0">
                      <div className={`text-xs font-bold text-slate-900 ${isCandidate ? 'group-hover:text-teal-700' : 'group-hover:text-indigo-700'} transition-colors flex items-center gap-1.5 truncate`}>
                        <span>{p.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                          {p.id}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">{p.tag}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL: TAILORED AUTH FORM (7 COLS) ── */}
          <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-white">
            <div className="w-full max-w-md mx-auto space-y-6">
              
              {/* Sign In vs Register tabs */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {mode === 'login'
                      ? `${isCandidate ? 'Candidate' : 'Recruiter'} Sign In`
                      : `Create ${isCandidate ? 'Candidate' : 'Recruiter'} Account`}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {mode === 'login' ? 'Enter credentials to access your dashboard' : 'Fill details below to generate your unique ID'}
                  </p>
                </div>

                <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="e.g. Ananya Sharma"
                          className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white ${theme.ring} ${errors.name ? 'border-rose-400' : 'border-slate-200'}`}
                        />
                      </div>
                      {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
                    </div>

                    {isCandidate ? (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">College / University</label>
                        <div className="relative">
                          <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={college}
                            onChange={e => setCollege(e.target.value)}
                            placeholder="e.g. National Institute of Technology"
                            className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white ${theme.ring} ${errors.college ? 'border-rose-400' : 'border-slate-200'}`}
                          />
                        </div>
                        {errors.college && <p className="text-[11px] text-rose-600 mt-1">{errors.college}</p>}
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization</label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={company}
                            onChange={e => setCompany(e.target.value)}
                            placeholder="e.g. TechNova Technologies"
                            className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white ${theme.ring} ${errors.company ? 'border-rose-400' : 'border-slate-200'}`}
                          />
                        </div>
                        {errors.company && <p className="text-[11px] text-rose-600 mt-1">{errors.company}</p>}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="e.g. 9876543210"
                          className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white ${theme.ring} ${errors.phone ? 'border-rose-400' : 'border-slate-200'}`}
                        />
                      </div>
                      {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
                    </div>
                  </>
                )}

                {mode === 'login' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name (Profile Name)
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder={isCandidate ? "Enter candidate name (e.g. Rohan Deshmukh)" : "Enter recruiter name (e.g. Meera Nair)"}
                          className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white ${theme.ring} border-slate-200`}
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Your profile name across RozgarLink will be set to this name.
                      </p>
                    </div>

                    {!isCandidate && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Company / Organization
                        </label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={company}
                            onChange={e => setCompany(e.target.value)}
                            placeholder="e.g. TechNova Solutions, Infosys BPM, TCS"
                            className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white ${theme.ring} border-slate-200`}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isCandidate ? 'Candidate Email ID' : 'Official Recruiter Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder={isCandidate ? 'candidate@campus.edu' : 'recruiter@company.com'}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white ${theme.ring} ${errors.email ? 'border-rose-400' : 'border-slate-200'}`}
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 border text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white ${theme.ring} ${errors.password ? 'border-rose-400' : 'border-slate-200'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[11px] text-rose-600 mt-1">{errors.password}</p>}
                </div>

                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showCPwd ? 'text' : 'password'}
                        value={confirmPwd}
                        onChange={e => setConfirmPwd(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 border text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white ${theme.ring} ${errors.confirmPwd ? 'border-rose-400' : 'border-slate-200'}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCPwd(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        {showCPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPwd && <p className="text-[11px] text-rose-600 mt-1">{errors.confirmPwd}</p>}
                  </div>
                )}

                {mode === 'register' && (
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={e => setAgreed(e.target.checked)}
                        className="rounded border-slate-300 bg-white text-teal-600 focus:ring-teal-500"
                      />
                      <span>I agree to RozgarLink Terms & Verified KYC Policies</span>
                    </label>
                    {errors.agreed && <p className="text-[11px] text-rose-600 mt-1">{errors.agreed}</p>}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 rounded-xl text-xs font-bold text-white ${theme.primaryBg} transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:opacity-50`}
                >
                  {isLoading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>{mode === 'login' ? `Sign In to ${isCandidate ? 'Candidate' : 'Recruiter'} Portal` : `Create ${isCandidate ? 'Candidate' : 'Recruiter'} ID`}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center text-xs text-slate-500">
                {mode === 'login' ? (
                  <span>
                    Don't have an account?{' '}
                    <button onClick={() => switchMode('register')} className={`${theme.text} font-bold hover:underline`}>
                      Register for free
                    </button>
                  </span>
                ) : (
                  <span>
                    Already registered?{' '}
                    <button onClick={() => switchMode('login')} className={`${theme.text} font-bold hover:underline`}>
                      Sign in directly
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-[11px] text-slate-500">
        RozgarLink Secure Authentication · End-to-end 256-bit encrypted credential management
      </footer>
    </div>
  );
};
