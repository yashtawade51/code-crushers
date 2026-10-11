import React from 'react';
import {
  Sparkles,
  TrendingUp,
  Bookmark,
  Calendar,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ArrowUpRight,
  BookOpen,
} from 'lucide-react';
import { Opportunity, MatchAnalysis, StudentProfile } from '../types';
import { OpportunityCard } from './OpportunityCard';

interface DashboardViewProps {
  profile: StudentProfile;
  opportunities: Opportunity[];
  matches: Record<string, MatchAnalysis>;
  savedIds: string[];
  onNavigate: (tab: string) => void;
  onViewDetails: (opp: Opportunity) => void;
  onToggleSave: (oppId: string) => void;
  onOpenMatchModal: (opp: Opportunity) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  opportunities,
  matches,
  savedIds,
  onNavigate,
  onViewDetails,
  onToggleSave,
  onOpenMatchModal,
}) => {
  // Compute Key Metrics
  const totalOpportunities = opportunities.length;

  const strongMatches = opportunities.filter(
    (o) => matches[o.id] && matches[o.id].overallScore >= 75
  );

  const eligibleCount = opportunities.filter(
    (o) => matches[o.id] && matches[o.id].eligibilityStatus === 'Eligible'
  ).length;

  // Recommended opportunities (Top 4 ranked by overallScore)
  const recommendedOpps = [...opportunities]
    .sort((a, b) => (matches[b.id]?.overallScore || 0) - (matches[a.id]?.overallScore || 0))
    .slice(0, 4);

  // Urgent upcoming deadlines (nearest 3 deadlines)
  const upcomingDeadlines = [...opportunities]
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3);

  // Skill Match Distribution
  // Let's compute average match score across categories
  const avgSkillScore = Math.round(
    Object.values(matches).reduce((acc, m) => acc + m.skillsScore, 0) / (totalOpportunities || 1)
  );
  const avgEducationScore = Math.round(
    Object.values(matches).reduce((acc, m) => acc + m.educationScore, 0) / (totalOpportunities || 1)
  );
  const avgExperienceScore = Math.round(
    Object.values(matches).reduce((acc, m) => acc + m.experienceScore, 0) / (totalOpportunities || 1)
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 1. WELCOME BANNER & PROFILE SUMMARY */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-teal-400/40 shadow-md shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30">
                  {profile.experienceLevel}
                </span>
                <span className="text-xs text-slate-300">CGPA: {profile.education.cgpa}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Welcome back, {profile.fullName}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                {profile.headline} · {profile.education.institution}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto shrink-0">
            <button
              onClick={() => onNavigate('profile')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors"
            >
              Edit Profile
            </button>
            <button
              onClick={() => onNavigate('explore')}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Explore All Opportunities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. STATS KPI GRID (Strict tabular numbers & anti-slop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Total Catalog</span>
              <Compass className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900">
                {totalOpportunities}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">Live vetted positions</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-teal-700">
                Strong Matches
              </span>
              <Sparkles className="w-4 h-4 text-teal-600" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold font-mono tabular-nums text-teal-700">
                {strongMatches.length}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">≥75% algorithmic synergy</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-emerald-700">
                Fully Eligible
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900">
                {eligibleCount}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">Pass all academic criteria</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-indigo-700">
                Saved & In Tracker
              </span>
              <Bookmark className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900">
                {savedIds.length}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">Bookmarked opportunities</p>
            </div>
          </div>
        </div>

        {/* 3. TWO-COLUMN SPLIT: SKILL MATCH OVERVIEW + URGENT DEADLINES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Skill Match Overview */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Profile Compatibility Index
                </h2>
                <p className="text-xs text-slate-500">
                  Average qualification affinity across active opportunities
                </p>
              </div>
              <button
                onClick={() => onNavigate('skillgap')}
                className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
              >
                <span>Skill-Gap Analysis</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Technical Skills Coverage</span>
                  <span className="font-mono font-bold text-teal-700">{avgSkillScore}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${avgSkillScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Degree & Coursework Alignment</span>
                  <span className="font-mono font-bold text-teal-700">{avgEducationScore}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${avgEducationScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Portfolio & Projects Fit</span>
                  <span className="font-mono font-bold text-teal-700">{avgExperienceScore}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${avgExperienceScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Skills Pills */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Your Primary Tagged Competencies ({profile.technicalSkills.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {profile.technicalSkills.map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Upcoming Application Deadlines */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    Approaching Deadlines
                  </h2>
                </div>
                <span className="text-xs text-amber-700 font-semibold">Priority</span>
              </div>

              <div className="space-y-3">
                {upcomingDeadlines.map((opp) => {
                  const match = matches[opp.id];
                  return (
                    <div
                      key={opp.id}
                      onClick={() => onViewDetails(opp)}
                      className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {opp.title}
                        </p>
                        <p className="text-[11px] text-slate-500">{opp.company} · {opp.type}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-amber-700 block">
                          {opp.deadline}
                        </span>
                        {match && (
                          <span className="text-[10px] font-mono text-teal-700 font-semibold">
                            {match.overallScore}% match
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Don't miss application windows</span>
              <button
                onClick={() => onNavigate('explore')}
                className="text-teal-700 font-semibold hover:underline"
              >
                View all deadlines →
              </button>
            </div>
          </div>
        </div>

        {/* 4. RECOMMENDED OPPORTUNITIES GRID */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
                Curated Recommendations
              </span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                Top Matches for Your Profile
              </h2>
            </div>
            <button
              onClick={() => onNavigate('explore')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>See all {opportunities.length} opportunities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedOpps.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                match={matches[opp.id]}
                isSaved={savedIds.includes(opp.id)}
                onViewDetails={onViewDetails}
                onToggleSave={onToggleSave}
                onOpenMatchModal={onOpenMatchModal}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
