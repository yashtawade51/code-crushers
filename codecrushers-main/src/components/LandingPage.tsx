import React from 'react';
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  TrendingUp,
  Briefcase,
  CheckCircle,
  GraduationCap,
  Sparkles,
  Building2,
} from 'lucide-react';
import { Opportunity, StudentProfile } from '../types';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
  opportunities: Opportunity[];
  profile: StudentProfile;
  onSelectOpportunity: (opp: Opportunity) => void;
  onOpenLogin?: (role?: 'candidate' | 'recruiter') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  opportunities,
  profile,
  onSelectOpportunity,
  onOpenLogin,
}) => {
  const featuredOpps = opportunities.filter((o) => o.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline & Action */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Next-Gen Skills-to-Career Match Engine</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] text-balance">
                Your Skills. <br />
                Your Opportunities. <br />
                <span className="text-teal-600">Your Future.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed text-balance">
                Discover opportunities that match your skills, goals, and potential.
                RozgarLink analyzes your academic coursework, technical stack, and aspirations to match
                you with internships, jobs, and high-impact training programs.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('explore')}
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-teal-700 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <span>Find Opportunities</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#how-it-works"
                  className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold text-sm transition-all hover:bg-slate-50 flex items-center gap-2"
                >
                  <span>Explore How It Works</span>
                </a>
              </div>

              {/* Dual Portal Gateway (Joined Login) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => onOpenLogin ? onOpenLogin('candidate') : onNavigate('dashboard')}
                  className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 hover:border-teal-500/50 text-left transition-all hover:bg-teal-500/15 group shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <GraduationCap className="w-4 h-4 text-teal-600" />
                    <span className="text-xs font-bold text-slate-900">Candidate Portal</span>
                    <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded font-mono font-bold ml-auto">CAND-ID</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Match skills, verify credentials, and apply to 500+ jobs.</p>
                </button>

                <button
                  onClick={() => onOpenLogin ? onOpenLogin('recruiter') : onNavigate('login')}
                  className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 hover:border-indigo-500/50 text-left transition-all hover:bg-indigo-500/15 group shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-900">Recruiter Portal</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-mono font-bold ml-auto">RECR-ID</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Review applicants, AI compare "who is better", and hire.</p>
                </button>
              </div>

              {/* Active Profile Quick Summary */}
              <div className="pt-4 border-t border-slate-200/80 flex items-center gap-3 text-xs text-slate-500">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <span>
                  Demo Candidate Active: <strong className="text-slate-800">{profile.fullName}</strong> ({profile.education.degree})
                </span>
                <span aria-hidden="true">·</span>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="text-teal-600 font-medium hover:underline"
                >
                  View Profile Match Score →
                </button>
              </div>
            </div>

            {/* Right Column: Hero Concept Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
                <img
                  src="/src/assets/images/hero_career_matching_1791700568634.jpg"
                  alt="RozgarLink Career and Skills Match Visualizer"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover max-h-[460px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-5">
                  <div className="text-white space-y-1">
                    <p className="text-xs uppercase tracking-wider font-semibold text-teal-300">
                      Algorithmic Assessment
                    </p>
                    <p className="text-sm font-medium">
                      Multi-parameter affinity across skills, degree compatibility, and project telemetry.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE-STEP JOURNEY SECTION */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
              From profile creation to career breakthrough
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              A transparent matching workflow designed to help students bridge the gap between classroom theory and industry opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-teal-300 transition-colors">
              <div>
                <div className="text-xs font-mono font-bold text-teal-600 mb-2">01</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Create Your Profile</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Enter your university degree, coursework, technical tools, hands-on projects, and career preferences. The platform builds a semantic skill profile.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                <span>Takes ~3 minutes</span>
                <button
                  onClick={() => onNavigate('profile')}
                  className="text-teal-600 font-semibold hover:underline"
                >
                  Configure profile →
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-teal-300 transition-colors">
              <div>
                <div className="text-xs font-mono font-bold text-teal-600 mb-2">02</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Discover Matches</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our algorithm ranks open internships, jobs, and certifications by weighted skill synergy, degree prerequisites, and verified eligibility parameters.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                <span>Weighted scoring</span>
                <button
                  onClick={() => onNavigate('explore')}
                  className="text-teal-600 font-semibold hover:underline"
                >
                  Browse catalog →
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-teal-300 transition-colors">
              <div>
                <div className="text-xs font-mono font-bold text-teal-600 mb-2">03</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Build Your Future</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Spot exactly what skills you lack for your dream job with automated Skill-Gap Analysis, access free learning resources, and track applications seamlessly.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                <span>Skill recommendations</span>
                <button
                  onClick={() => onNavigate('skillgap')}
                  className="text-teal-600 font-semibold hover:underline"
                >
                  Analyze gaps →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
              Core Platform Capabilities
            </span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Purpose-built for student career advancement
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Eliminate rejection guesswork with objective compatibility scores and transparent eligibility checks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">Smart Matching Engine</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Proprietary weighted algorithm evaluates skill synonyms, project frameworks, and coursework rather than simplistic keyword searching.
              </p>
              <ul className="text-xs text-slate-500 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                  <span>Synonym & related tools graph (e.g. React ↔ Next.js)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                  <span>Weighted scoring across 4 key criteria dimensions</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">Eligibility Checking</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Audits hard requirements like degree majors, minimum CGPA thresholds, graduation batches, and work locations before you invest application effort.
              </p>
              <ul className="text-xs text-slate-500 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                  <span>Clear "Eligible", "Conditional", or "Ineligible" status</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                  <span>Actionable explanations for every requirement shortfall</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 mb-5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">Skill-Gap Analysis</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Identifies missing technical competencies between your current resume and target industry benchmarks, along with curated free learning materials.
              </p>
              <ul className="text-xs text-slate-500 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                  <span>Side-by-side possessed vs. missing skill breakdown</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                  <span>Direct links to verified tutorials, docs & courses</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED OPPORTUNITIES SPOTLIGHT */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
                Active Openings
              </span>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
                Featured Industry Roles
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                High-demand internships, graduate tracks, and sponsored certifications.
              </p>
            </div>
            <button
              onClick={() => onNavigate('explore')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View all {opportunities.length} opportunities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredOpps.map((opp) => (
              <div
                key={opp.id}
                className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="font-medium text-teal-700">{opp.type}</span>
                    <span>Deadline: {opp.deadline}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{opp.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{opp.company} · {opp.location}</p>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                    {opp.description}
                  </p>

                  {/* Skills unboxed with bullets */}
                  <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                    {opp.requiredSkills.slice(0, 3).map((s, idx) => (
                      <React.Fragment key={s}>
                        <span className="font-medium text-slate-700">{s}</span>
                        {idx < 2 && <span aria-hidden="true">·</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-slate-900">
                    {opp.stipendSalary}
                  </span>
                  <button
                    onClick={() => {
                      onSelectOpportunity(opp);
                    }}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-900 hover:underline"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION STRIP */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-teal-400 text-xs font-medium">
            <GraduationCap className="w-4 h-4" />
            <span>Ready for your next career milestone?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto">
            Find the opportunities that value what you know.
          </h2>

          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            No endless unread resumes. Get matched based on what you can build today and what you are learning next.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-colors shadow-md"
            >
              Open Student Dashboard
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors border border-slate-700"
            >
              Update My Resume Profile
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
