import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Briefcase,
  Compass,
} from 'lucide-react';
import { Opportunity, MatchAnalysis, StudentProfile } from '../types';
import { OpportunityCard } from './OpportunityCard';

interface OpportunityExplorerProps {
  opportunities: Opportunity[];
  matches: Record<string, MatchAnalysis>;
  savedIds: string[];
  profile: StudentProfile;
  onViewDetails: (opp: Opportunity) => void;
  onToggleSave: (oppId: string) => void;
  onOpenMatchModal: (opp: Opportunity) => void;
  onNavigateToProfile: () => void;
}

export const OpportunityExplorer: React.FC<OpportunityExplorerProps> = ({
  opportunities,
  matches,
  savedIds,
  profile,
  onViewDetails,
  onToggleSave,
  onOpenMatchModal,
  onNavigateToProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [selectedEligibility, setSelectedEligibility] = useState<string>('All');
  const [minMatchThreshold, setMinMatchThreshold] = useState<number>(0);
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'deadline' | 'stipend' | 'newest'>('match');

  // Collect all unique required skills across all opportunities
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    opportunities.forEach((o) => {
      o.requiredSkills.forEach((s) => set.add(s));
    });
    return Array.from(set).sort();
  }, [opportunities]);

  // Filter and sort opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter((opp) => {
        const match = matches[opp.id];
        if (!match) return true;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = opp.title.toLowerCase().includes(q);
          const matchCompany = opp.company.toLowerCase().includes(q);
          const matchDesc = opp.description.toLowerCase().includes(q);
          const matchSkills = opp.requiredSkills.some((s) => s.toLowerCase().includes(q));
          if (!matchTitle && !matchCompany && !matchDesc && !matchSkills) {
            return false;
          }
        }

        // Type filter
        if (selectedType !== 'All' && opp.type !== selectedType) {
          return false;
        }

        // Work mode filter
        if (selectedWorkMode !== 'All' && opp.workMode !== selectedWorkMode) {
          return false;
        }

        // Eligibility filter
        if (selectedEligibility === 'Eligible' && match.eligibilityStatus !== 'Eligible') {
          return false;
        }

        // Min Match %
        if (match.overallScore < minMatchThreshold) {
          return false;
        }

        // Skill filter
        if (selectedSkillFilter !== 'All') {
          const hasSkill = opp.requiredSkills.includes(selectedSkillFilter) || opp.preferredSkills.includes(selectedSkillFilter);
          if (!hasSkill) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const matchA = matches[a.id]?.overallScore || 0;
        const matchB = matches[b.id]?.overallScore || 0;

        if (sortBy === 'match') {
          return matchB - matchA;
        }
        if (sortBy === 'stipend') {
          return b.stipendAmountMonthly - a.stipendAmountMonthly;
        }
        if (sortBy === 'deadline') {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        if (sortBy === 'newest') {
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        }
        return 0;
      });
  }, [
    opportunities,
    matches,
    searchQuery,
    selectedType,
    selectedWorkMode,
    selectedEligibility,
    minMatchThreshold,
    selectedSkillFilter,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedWorkMode('All');
    setSelectedEligibility('All');
    setMinMatchThreshold(0);
    setSelectedSkillFilter('All');
    setSortBy('match');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedType !== 'All' ||
    selectedWorkMode !== 'All' ||
    selectedEligibility !== 'All' ||
    minMatchThreshold > 0 ||
    selectedSkillFilter !== 'All';

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Title & Active Profile Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
                Career Catalog
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-mono">
                {filteredOpportunities.length} of {opportunities.length} Results
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Opportunity Explorer
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Live matching against <strong className="text-slate-800">{profile.fullName}</strong>'s current skills ({profile.technicalSkills.length} skills listed).
            </p>
          </div>

          <button
            onClick={onNavigateToProfile}
            className="self-start md:self-auto px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-sm"
          >
            <span>Update Profile Skills</span>
            <span className="w-2 h-2 rounded-full bg-teal-500" />
          </button>
        </div>

        {/* Search & Main Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
          {/* Top Search & Sort Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by job title, company name, skill (e.g. React, Python, Cloud)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-slate-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-4 flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 shrink-0">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="match">Highest Match %</option>
                <option value="deadline">Application Deadline (Nearest)</option>
                <option value="stipend">Highest Stipend / Salary</option>
                <option value="newest">Recently Posted</option>
              </select>
            </div>
          </div>

          {/* Opportunity Type Tabs (Interactive Segmented Control) */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs font-semibold text-slate-500 mr-2">Type:</span>
            {['All', 'Internship', 'Full-time', 'Training', 'Certification'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Secondary Filter Row: Work Mode, Eligibility, Min Match %, Skill Filter */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
            {/* Work Mode */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Work Mode
              </label>
              <select
                value={selectedWorkMode}
                onChange={(e) => setSelectedWorkMode(e.target.value)}
                className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none"
              >
                <option value="All">All Modes</option>
                <option value="Remote">Remote Only</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            {/* Eligibility */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Eligibility
              </label>
              <select
                value={selectedEligibility}
                onChange={(e) => setSelectedEligibility(e.target.value)}
                className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none"
              >
                <option value="All">All Opportunities</option>
                <option value="Eligible">Eligible Only (100% Pass)</option>
              </select>
            </div>

            {/* Min Match % */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Match Threshold
              </label>
              <select
                value={minMatchThreshold}
                onChange={(e) => setMinMatchThreshold(Number(e.target.value))}
                className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none"
              >
                <option value={0}>Any Match %</option>
                <option value={60}>60%+ Moderate</option>
                <option value={75}>75%+ Strong Match</option>
                <option value={85}>85%+ Top Match</option>
              </select>
            </div>

            {/* Skill Filter */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Filter by Skill
              </label>
              <select
                value={selectedSkillFilter}
                onChange={(e) => setSelectedSkillFilter(e.target.value)}
                className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none"
              >
                <option value="All">All Skills</option>
                {allSkills.map((sk) => (
                  <option key={sk} value={sk}>
                    {sk}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset Filters Prompt if active */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500">
                Filtered view showing {filteredOpportunities.length} matches.
              </span>
              <button
                onClick={resetFilters}
                className="text-teal-700 font-semibold hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset all filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Opportunity Card Grid */}
        {filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opp) => (
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
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No matching opportunities found
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No openings match the current search query or filter thresholds. Try broadening your criteria or reset filters.
            </p>
            <div className="pt-2">
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-teal-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
