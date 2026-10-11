import React, { useState, useMemo } from 'react';
import {
  Briefcase, Users, User, CheckCircle, XCircle, Clock, Eye,
  Search, ChevronDown, Star, MapPin, GraduationCap,
  Phone, Mail, FileText, TrendingUp, BarChart2, Building2,
  Sparkles, LogOut, Download, ArrowUpRight, Calendar,
  ArrowRight, Award, GitCompare, RefreshCw, Check, CheckCircle2,
  ShieldCheck, FileCheck,
} from 'lucide-react';
import { AuthUser } from './LoginPage';
import { AIChatbot } from './AIChatbot';
import { VerificationDocument } from '../types';

interface RecruiterDashboardProps {
  user: AuthUser;
  onLogout: () => void;
}

type AppStatus = 'Pending' | 'Shortlisted' | 'Interview' | 'Rejected' | 'Hired';

interface CandidateApplication {
  id: string;
  candidateId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  jobId: string;
  jobTitle: string;
  skills: string[];
  cgpa: string;
  college: string;
  degree: string;
  experience: string;
  appliedDate: string;
  matchScore: number;
  status: AppStatus;
  resumeUrl?: string;
  documents?: VerificationDocument[];
}

const MOCK_JOBS = [
  { id: 'job-1', title: 'Frontend Developer Intern', applicants: 24, active: true },
  { id: 'job-2', title: 'Full Stack Engineer (Entry Level)', applicants: 18, active: true },
  { id: 'job-3', title: 'Data Science Trainee', applicants: 31, active: true },
  { id: 'job-4', title: 'Backend Developer Intern', applicants: 15, active: false },
];

const INITIAL_APPLICATIONS: CandidateApplication[] = [
  {
    id: 'app-001', candidateId: 'CAND-28471', name: 'Ananya Sharma', email: 'ananya@campus.edu', phone: '+91 98765 43210', role: 'Frontend Developer Intern', jobId: 'job-1', jobTitle: 'Frontend Developer Intern', skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'], cgpa: '8.4', college: 'NIT Trichy', degree: 'B.Tech CSE', experience: 'Final Year Student', appliedDate: '2026-10-08', matchScore: 91, status: 'Shortlisted',
    documents: [
      { id: 'doc-001', name: 'Ananya_Sharma_Resume.pdf', type: 'Resume / CV', fileSize: '1.4 MB', uploadedAt: '2026-10-08', status: 'Verified', verificationScore: 98, notes: 'Verified curriculum vitae against GitHub/LinkedIn.' },
      { id: 'doc-002', name: 'NIT_Trichy_Student_ID.png', type: 'College ID', fileSize: '2.1 MB', uploadedAt: '2026-10-07', status: 'Verified', verificationScore: 96, notes: 'Verified active student enrollment.' },
    ],
  },
  {
    id: 'app-002', candidateId: 'CAND-39102', name: 'Rahul Verma', email: 'rahul.v@iit.ac.in', phone: '+91 77654 21098', role: 'Frontend Developer Intern', jobId: 'job-1', jobTitle: 'Frontend Developer Intern', skills: ['React', 'JavaScript', 'HTML/CSS'], cgpa: '7.8', college: 'IIT Bombay', degree: 'B.Tech CS', experience: 'Pre-final Year', appliedDate: '2026-10-07', matchScore: 83, status: 'Pending',
    documents: [
      { id: 'doc-003', name: 'Rahul_Verma_Resume.pdf', type: 'Resume / CV', fileSize: '1.2 MB', uploadedAt: '2026-10-07', status: 'Verified', verificationScore: 92, notes: 'Resume verified.' },
    ],
  },
  {
    id: 'app-003', candidateId: 'CAND-54720', name: 'Priya Nair', email: 'priya.n@bits.edu', phone: '+91 90112 34567', role: 'Full Stack Engineer (Entry Level)', jobId: 'job-2', jobTitle: 'Full Stack Engineer (Entry Level)', skills: ['React', 'Node.js', 'PostgreSQL', 'Docker'], cgpa: '9.1', college: 'BITS Pilani', degree: 'B.E. CS', experience: 'Fresh Graduate', appliedDate: '2026-10-09', matchScore: 96, status: 'Interview',
    documents: [
      { id: 'doc-004', name: 'Priya_Nair_FullStack_Resume.pdf', type: 'Resume / CV', fileSize: '1.6 MB', uploadedAt: '2026-10-09', status: 'Verified', verificationScore: 99, notes: '100% credential match.' },
      { id: 'doc-005', name: 'BITS_Pilani_Degree_Certificate.pdf', type: 'Degree Certificate', fileSize: '3.2 MB', uploadedAt: '2026-10-09', status: 'Verified', verificationScore: 97, notes: 'Accredited university seal verified.' },
      { id: 'doc-006', name: 'Final_Semester_Transcripts.pdf', type: 'Marksheet / Transcript', fileSize: '2.5 MB', uploadedAt: '2026-10-09', status: 'Verified', verificationScore: 98, notes: 'CGPA 9.1 confirmed.' },
    ],
  },
  { id: 'app-004', candidateId: 'CAND-61843', name: 'Karan Mehta', email: 'karan.m@vit.ac.in', phone: '+91 88234 56789', role: 'Data Science Trainee', jobId: 'job-3', jobTitle: 'Data Science Trainee', skills: ['Python', 'Pandas', 'Machine Learning', 'SQL'], cgpa: '8.0', college: 'VIT Vellore', degree: 'B.Tech IT', experience: 'Final Year Student', appliedDate: '2026-10-06', matchScore: 78, status: 'Pending' },
  { id: 'app-005', candidateId: 'CAND-72910', name: 'Sneha Reddy', email: 'sneha.r@cbit.ac.in', phone: '+91 91234 56780', role: 'Data Science Trainee', jobId: 'job-3', jobTitle: 'Data Science Trainee', skills: ['Python', 'TensorFlow', 'Pandas', 'Tableau'], cgpa: '8.7', college: 'CBIT Hyderabad', degree: 'B.Tech CSE', experience: 'Final Year Student', appliedDate: '2026-10-05', matchScore: 88, status: 'Shortlisted' },
  { id: 'app-006', candidateId: 'CAND-83047', name: 'Dev Patel', email: 'dev.p@svnit.ac.in', phone: '+91 80011 22334', role: 'Backend Developer Intern', jobId: 'job-4', jobTitle: 'Backend Developer Intern', skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs'], cgpa: '7.5', college: 'SVNIT Surat', degree: 'B.Tech CSE', experience: 'Pre-final Year', appliedDate: '2026-10-04', matchScore: 72, status: 'Rejected' },
  { id: 'app-007', candidateId: 'CAND-94156', name: 'Meera Joshi', email: 'meera.j@coep.ac.in', phone: '+91 98001 23456', role: 'Full Stack Engineer (Entry Level)', jobId: 'job-2', jobTitle: 'Full Stack Engineer (Entry Level)', skills: ['React', 'Python', 'FastAPI', 'PostgreSQL'], cgpa: '9.3', college: 'COEP Pune', degree: 'B.Tech CS', experience: 'Fresh Graduate', appliedDate: '2026-10-03', matchScore: 93, status: 'Hired' },
  { id: 'app-008', candidateId: 'CAND-10523', name: 'Arjun Singh', email: 'arjun.s@dtu.ac.in', phone: '+91 76543 21098', role: 'Frontend Developer Intern', jobId: 'job-1', jobTitle: 'Frontend Developer Intern', skills: ['Vue.js', 'JavaScript', 'CSS'], cgpa: '7.2', college: 'DTU Delhi', degree: 'B.Tech IT', experience: 'Pre-final Year', appliedDate: '2026-10-10', matchScore: 65, status: 'Pending' },
];

const STATUS_CONFIG: Record<AppStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  Pending:     { label: 'Pending Review', color: 'text-amber-800',  bg: 'bg-amber-50 border-amber-200',  icon: Clock },
  Shortlisted: { label: 'Shortlisted',    color: 'text-teal-800',   bg: 'bg-teal-50 border-teal-200',    icon: Star },
  Interview:   { label: 'Interview',      color: 'text-blue-800',   bg: 'bg-blue-50 border-blue-200',    icon: Calendar },
  Rejected:    { label: 'Rejected',       color: 'text-rose-800',   bg: 'bg-rose-50 border-rose-200',    icon: XCircle },
  Hired:       { label: 'Hired',          color: 'text-emerald-800',bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle },
};

function getScoreColor(score: number) {
  if (score >= 90) return 'text-emerald-600';
  if (score >= 80) return 'text-teal-600';
  if (score >= 70) return 'text-amber-600';
  return 'text-rose-600';
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ user, onLogout }) => {
  const [applications, setApplications] = useState<CandidateApplication[]>(INITIAL_APPLICATIONS);
  const [selectedApp, setSelectedApp] = useState<CandidateApplication | null>(INITIAL_APPLICATIONS[0]);
  const [search, setSearch] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [rightPanelTab, setRightPanelTab] = useState<'dossier' | 'analytics'>('dossier');

  // Compare candidates state (up to 2 candidates)
  const [compareIds, setCompareIds] = useState<string[]>(['app-003', 'app-001']);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  // Status update handler
  const handleUpdateStatus = (appId: string, newStatus: AppStatus) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    if (selectedApp?.id === appId) {
      setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
    }
    setStatusMessage(`Application updated to ${newStatus}`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const toggleCompare = (appId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareIds(prev => {
      if (prev.includes(appId)) return prev.filter(id => id !== appId);
      if (prev.length >= 2) return [prev[1], appId];
      return [...prev, appId];
    });
  };

  // Filtered applications
  const filtered = useMemo(() => {
    return applications.filter(a => {
      const matchSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.candidateId.toLowerCase().includes(search.toLowerCase()) ||
        a.skills.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
        a.jobTitle.toLowerCase().includes(search.toLowerCase());
      const matchJob = selectedJobId === 'all' || a.jobId === selectedJobId;
      const matchStatus = filterStatus === 'all' || a.status === filterStatus;
      return matchSearch && matchJob && matchStatus;
    });
  }, [applications, search, selectedJobId, filterStatus]);

  // Comparison candidates
  const comparedCandidates = useMemo(() => {
    return compareIds.map(id => applications.find(a => a.id === id)).filter(Boolean) as CandidateApplication[];
  }, [compareIds, applications]);

  // Overall metrics
  const stats = useMemo(() => ({
    total: applications.length,
    pending: applications.filter(a => a.status === 'Pending').length,
    shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
    interview: applications.filter(a => a.status === 'Interview').length,
    hired: applications.filter(a => a.status === 'Hired').length,
  }), [applications]);

  // Top candidates
  const topCandidates = useMemo(() => {
    return [...applications].sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
  }, [applications]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* ── TOP HEADER (ALL PROCESS IN ONE VIEW) ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base tracking-tight">{user.company || 'TechCorp'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Recruiter Workspace
                </span>
              </div>
              <p className="text-xs text-slate-500">All-in-one Job Screening & AI Evaluation Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Compare Trigger */}
            <button
              onClick={() => setShowCompareModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>AI Compare ({compareIds.length}/2)</span>
            </button>

            <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                {user.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'R'}
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-xs font-semibold text-slate-900 leading-tight">{user.name}</span>
                <span className="text-[10px] text-indigo-600 font-mono font-medium">{user.id} · {user.company || 'Recruiter'}</span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all border border-slate-200"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN WORKSPACE (ALL IN ONE TAB) ── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">

        {/* ── TOP PIPELINE STATS BAR ── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Total Applicants', value: stats.total,       icon: Users,       color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
            { label: 'Pending Review',   value: stats.pending,     icon: Clock,       color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200' },
            { label: 'Shortlisted',      value: stats.shortlisted, icon: Star,        color: 'text-teal-600',   bg: 'bg-teal-50 border-teal-200' },
            { label: 'In Interview',     value: stats.interview,   icon: Calendar,    color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-200' },
            { label: 'Offers / Hired',   value: stats.hired,       icon: CheckCircle, color: 'text-emerald-600',bg: 'bg-emerald-50 border-emerald-200' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center gap-3 shadow-xs">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="min-w-0">
                <div className={`text-xl font-bold ${color}`}>{value}</div>
                <div className="text-[11px] text-slate-500 font-medium truncate">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── PROCESS 1: INSTANT JOB ROLE SELECTOR BAR (NO TAB SWITCH) ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Select Job Role to Review</span>
            </div>
            <span className="text-xs text-slate-500">Click any job to filter candidate applications instantly</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedJobId('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedJobId === 'all'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              All Open Positions ({applications.length})
            </button>
            {MOCK_JOBS.map(job => {
              const count = applications.filter(a => a.jobId === job.id).length;
              const isSelected = selectedJobId === job.id;
              return (
                <button
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  <span>{job.title}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── AI SUMMARY STRIP: "WHO IS BETTER" QUICK RECOMMENDATION ── */}
        <div className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 border border-indigo-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span>AI Hiring Analysis: Highest Ranked Candidate</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono font-bold">
                  96% Match
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                <strong className="text-slate-900">Priya Nair</strong> (BITS Pilani · Full Stack) leads overall with verified Docker & PostgreSQL proficiencies.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => {
                setCompareIds(['app-003', 'app-001']);
                setShowCompareModal(true);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all flex items-center gap-1.5"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare Priya vs Ananya</span>
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* ── CORE WORKSPACE: 2-COLUMN UNIFIED PROCESSING ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── LEFT COLUMN: APPLICATIONS LIST WITH QUICK FILTERS & ACTIONS (7 cols) ── */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search and status filters */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex flex-col sm:flex-row gap-2.5 shadow-xs">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by candidate name, ID, or skill..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="pl-3 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs appearance-none focus:outline-none cursor-pointer focus:bg-white"
                  >
                    <option value="all">All Statuses</option>
                    {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">{filtered.length} candidate{filtered.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Candidates card list */}
            <div className="space-y-2.5">
              {filtered.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400 text-sm shadow-xs">
                  No applications match your filter criteria.
                </div>
              ) : (
                filtered.map(app => {
                  const s = STATUS_CONFIG[app.status];
                  const SIcon = s.icon;
                  const isSelected = selectedApp?.id === app.id;
                  const isCheckedForCompare = compareIds.includes(app.id);

                  return (
                    <div
                      key={app.id}
                      onClick={() => {
                        setSelectedApp(app);
                        setRightPanelTab('dossier');
                      }}
                      className={`w-full text-left bg-white border rounded-2xl p-4 transition-all hover:border-indigo-400 hover:shadow-md cursor-pointer ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/40 shadow-sm ring-1 ring-indigo-500/30'
                          : 'border-slate-200 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Compare check box */}
                        <button
                          onClick={(e) => toggleCompare(app.id, e)}
                          title="Select to compare who is better"
                          className={`mt-1 w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                            isCheckedForCompare
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'bg-white border-slate-300 text-transparent hover:border-indigo-400'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>

                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-sm flex-shrink-0">
                          {app.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>

                        {/* Candidate info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-900">{app.name}</span>
                            <span className="text-[11px] text-indigo-600 font-mono font-medium">{app.candidateId}</span>
                            <span className="text-[10px] text-slate-500 font-mono">CGPA: {app.cgpa}</span>
                            {app.documents?.some(d => d.status === 'Verified') && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Verified KYC
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {app.jobTitle} · <span className="text-slate-700 font-medium">{app.college}</span>
                          </div>

                          {/* Skills tags */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {app.skills.map(sk => (
                              <span key={sk} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                                {sk}
                              </span>
                            ))}
                          </div>

                          {/* Direct Quick Status Stepper Buttons */}
                          <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100" onClick={e => e.stopPropagation()}>
                            <span className="text-[10px] text-slate-500 font-medium mr-1">Move to:</span>
                            {(['Shortlisted', 'Interview', 'Hired', 'Rejected'] as AppStatus[]).map(st => {
                              const active = app.status === st;
                              return (
                                <button
                                  key={st}
                                  onClick={() => handleUpdateStatus(app.id, st)}
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-all ${
                                    active
                                      ? `${STATUS_CONFIG[st].bg} ${STATUS_CONFIG[st].color} ring-1 ring-current`
                                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                  }`}
                                >
                                  {st}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Match score & Status */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <div className={`text-sm font-extrabold ${getScoreColor(app.matchScore)}`}>
                            {app.matchScore}%
                          </div>
                          <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border font-semibold ${s.bg} ${s.color}`}>
                            <SIcon className="w-3 h-3" />
                            {app.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN: CANDIDATE DETAIL REVIEW & EMBEDDED ANALYTICS (5 cols) ── */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6.5rem)] lg:overflow-y-auto pr-1">

            {/* View Switcher Tabs (Dossier vs Analytics) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-1.5 flex items-center gap-1 shadow-xs">
              <button
                type="button"
                onClick={() => setRightPanelTab('dossier')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  rightPanelTab === 'dossier'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Candidate Dossier</span>
                {selectedApp && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono font-semibold">
                    {selectedApp.name.split(' ')[0]}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setRightPanelTab('analytics')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  rightPanelTab === 'analytics'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Live Rankings & Pipeline</span>
              </button>
            </div>

            {rightPanelTab === 'dossier' ? (
              /* Selected candidate review drawer */
              selectedApp ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-base shadow-xs">
                        {selectedApp.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-base">{selectedApp.name}</div>
                        <div className="text-xs text-indigo-600 font-mono font-medium">{selectedApp.candidateId}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-extrabold ${getScoreColor(selectedApp.matchScore)}`}>
                        {selectedApp.matchScore}%
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">Match Fit</div>
                    </div>
                  </div>

                  {/* Match progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Algorithm Fit Score</span>
                      <span className="font-bold text-slate-900">{selectedApp.matchScore} / 100</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-500"
                        style={{ width: `${selectedApp.matchScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200">
                      <div className="text-[11px] text-slate-500 font-medium">College / University</div>
                      <div className="font-semibold text-slate-800 truncate mt-0.5">{selectedApp.college}</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200">
                      <div className="text-[11px] text-slate-500 font-medium">Degree & CGPA</div>
                      <div className="font-semibold text-slate-800 truncate mt-0.5">
                        {selectedApp.degree} · {selectedApp.cgpa}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200">
                      <div className="text-[11px] text-slate-500 font-medium">Applied Role</div>
                      <div className="font-semibold text-slate-800 truncate mt-0.5">{selectedApp.role}</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200">
                      <div className="text-[11px] text-slate-500 font-medium">Applied Date</div>
                      <div className="font-semibold text-slate-800 truncate mt-0.5">{selectedApp.appliedDate}</div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="space-y-1 text-xs text-slate-500 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-700">{selectedApp.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-700">{selectedApp.phone}</span>
                    </div>
                  </div>

                  {/* Skills verified */}
                  <div>
                    <div className="text-xs font-semibold text-slate-900 mb-2">Verified Technical Skills</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedApp.skills.map((sk) => (
                        <span
                          key={sk}
                          className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Verification Documents & KYC */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Verification Documents (KYC)</span>
                      </div>
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {(selectedApp.documents || []).filter((d) => d.status === 'Verified').length} Verified
                      </span>
                    </div>

                    <div className="space-y-2">
                      {(
                        selectedApp.documents || [
                          {
                            id: 'doc-001',
                            name: `${selectedApp.name.replace(/\s+/g, '_')}_Resume.pdf`,
                            type: 'Resume / CV',
                            fileSize: '1.4 MB',
                            uploadedAt: selectedApp.appliedDate,
                            status: 'Verified',
                            verificationScore: 98,
                            notes: 'Verified against institute records.',
                          },
                          {
                            id: 'doc-002',
                            name: `${selectedApp.college.replace(/\s+/g, '_')}_Student_ID.png`,
                            type: 'College ID',
                            fileSize: '2.1 MB',
                            uploadedAt: selectedApp.appliedDate,
                            status: 'Verified',
                            verificationScore: 95,
                            notes: 'Student identification roll verified.',
                          },
                        ]
                      ).map((doc) => (
                        <div
                          key={doc.id}
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center flex-shrink-0">
                              <FileCheck className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-slate-900 truncate">{doc.name}</div>
                              <div className="text-[10px] text-slate-500">
                                {doc.type} · {doc.fileSize}{' '}
                                {doc.verificationScore ? `· ${doc.verificationScore}% OCR` : ''}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 flex-shrink-0">
                            <Check className="w-3 h-3 text-emerald-600" /> {doc.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Application Actions */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <div className="text-xs font-semibold text-slate-900">Update Hiring Status</div>
                    <div className="grid grid-cols-2 gap-2">
                      {(['Shortlisted', 'Interview', 'Hired', 'Rejected'] as AppStatus[]).map((st) => {
                        const active = selectedApp.status === st;
                        const cfg = STATUS_CONFIG[st];
                        const SIcon = cfg.icon;
                        return (
                          <button
                            key={st}
                            onClick={() => handleUpdateStatus(selectedApp.id, st)}
                            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                              active
                                ? `${cfg.bg} ${cfg.color} ring-2 ring-indigo-500/40`
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            <SIcon className="w-3.5 h-3.5" />
                            <span>{st}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Resume button */}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Downloading verified resume and dossier for ${selectedApp.name}...`);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-xs"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Candidate Resume & Dossier</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-sm shadow-xs">
                  Click any candidate application on the left to inspect their dossier.
                </div>
              )
            ) : (
              /* Live Rankings and Analytics Panel */
              <div className="space-y-4">
                {/* Process 3: Inline AI Ranking */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      Top Candidates by Match Fit
                    </h3>
                    <span className="text-[11px] text-slate-500">Live Ranking</span>
                  </div>
                  <div className="space-y-2">
                    {topCandidates.map((app, i) => (
                      <div
                        key={app.id}
                        onClick={() => {
                          setSelectedApp(app);
                          setRightPanelTab('dossier');
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-200"
                      >
                        <span className="text-xs font-bold font-mono text-slate-400 w-4">{i + 1}</span>
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0">
                          {app.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">{app.name}</div>
                          <div className="text-[11px] text-slate-500 truncate">{app.jobTitle}</div>
                        </div>
                        <div className={`text-xs font-bold ${getScoreColor(app.matchScore)}`}>
                          {app.matchScore}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pipeline Status Breakdown Inline Widget */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-indigo-600" />
                    Pipeline Breakdown
                  </h3>
                  {(Object.entries(STATUS_CONFIG) as [AppStatus, (typeof STATUS_CONFIG)[AppStatus]][]).map(
                    ([status, cfg]) => {
                      const count = applications.filter((a) => a.status === status).length;
                      const pct = applications.length ? Math.round((count / applications.length) * 100) : 0;
                      const SIcon = cfg.icon;
                      return (
                        <div key={status} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className={`flex items-center gap-1.5 font-semibold ${cfg.color}`}>
                              <SIcon className="w-3.5 h-3.5" />
                              {status}
                            </span>
                            <span className="text-slate-500">
                              {count} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                status === 'Pending'
                                  ? 'bg-amber-500'
                                  : status === 'Shortlisted'
                                  ? 'bg-teal-500'
                                  : status === 'Interview'
                                  ? 'bg-blue-500'
                                  : status === 'Rejected'
                                  ? 'bg-rose-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MODAL: AI "WHO IS BETTER" SIDE-BY-SIDE COMPARISON ── */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  AI Candidate Comparison: "Who is Better?"
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Objective algorithmic comparison across verified skills, academic performance, and job fit.
                </p>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {comparedCandidates.length < 2 ? (
              <div className="bg-slate-50 rounded-2xl p-6 text-center text-slate-500 text-sm border border-slate-200">
                Please select at least 2 candidates using the checkboxes in the applications list to compare them!
              </div>
            ) : (
              <div className="space-y-5">
                {/* Side-by-side cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {comparedCandidates.slice(0, 2).map((cand, idx) => {
                    const isWinner = idx === 0 && cand.matchScore >= (comparedCandidates[1]?.matchScore ?? 0);
                    return (
                      <div
                        key={cand.id}
                        className={`rounded-2xl p-4 border space-y-3 ${
                          isWinner
                            ? 'bg-indigo-50/50 border-indigo-300 shadow-sm ring-1 ring-indigo-400/30'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            {isWinner && (
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-1">
                                🌟 Recommended Choice
                              </span>
                            )}
                            <h4 className="font-bold text-slate-900 text-base">{cand.name}</h4>
                            <div className="text-xs text-indigo-600 font-mono font-medium">{cand.candidateId}</div>
                          </div>
                          <div className={`text-xl font-black ${getScoreColor(cand.matchScore)}`}>
                            {cand.matchScore}%
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-700">
                          <div><strong className="text-slate-900">Role:</strong> {cand.jobTitle}</div>
                          <div><strong className="text-slate-900">Institute:</strong> {cand.college}</div>
                          <div><strong className="text-slate-900">CGPA:</strong> {cand.cgpa} / 10</div>
                          <div><strong className="text-slate-900">Experience:</strong> {cand.experience}</div>
                        </div>

                        <div>
                          <div className="text-[11px] text-slate-500 font-semibold mb-1">Skills:</div>
                          <div className="flex flex-wrap gap-1">
                            {cand.skills.map(sk => (
                              <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-medium">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* AI Executive Summary Verdict */}
                <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    AI Hiring Verdict:
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Between <strong className="text-slate-900">{comparedCandidates[0].name}</strong> ({comparedCandidates[0].matchScore}% match) and <strong className="text-slate-900">{comparedCandidates[1].name}</strong> ({comparedCandidates[1].matchScore}% match),{' '}
                    <strong className="text-slate-900">{comparedCandidates[0].matchScore >= comparedCandidates[1].matchScore ? comparedCandidates[0].name : comparedCandidates[1].name}</strong> demonstrates superior technical versatility, higher academic scoring, and comprehensive coverage of required production tech stacks.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recruiter AI Assistant (HireBot) */}
      <AIChatbot
        role="recruiter"
        contextData={{
          totalApplications: applications.length,
          jobs: MOCK_JOBS,
          applications: applications.map(a => ({
            name: a.name,
            candidateId: a.candidateId,
            role: a.role,
            jobTitle: a.jobTitle,
            matchScore: a.matchScore,
            status: a.status,
            college: a.college,
            cgpa: a.cgpa,
            skills: a.skills,
          })),
        }}
      />
    </div>
  );
};
