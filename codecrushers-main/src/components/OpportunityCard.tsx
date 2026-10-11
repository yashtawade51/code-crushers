import React from 'react';
import { Bookmark, MapPin, Calendar, CheckCircle2, AlertTriangle, XCircle, ArrowUpRight } from 'lucide-react';
import { Opportunity, MatchAnalysis } from '../types';

interface OpportunityCardProps {
  opportunity: Opportunity;
  match: MatchAnalysis;
  isSaved: boolean;
  onViewDetails: (opp: Opportunity) => void;
  onToggleSave: (oppId: string) => void;
  onOpenMatchModal?: (opp: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  match,
  isSaved,
  onViewDetails,
  onToggleSave,
  onOpenMatchModal,
}) => {
  // Color scale for match score
  const getScoreBadgeClass = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-teal-700 bg-teal-50 border-teal-200';
    if (score >= 40) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-slate-700 bg-slate-100 border-slate-200';
  };

  const getEligibilityBadge = (status: 'Eligible' | 'Conditional' | 'Ineligible') => {
    switch (status) {
      case 'Eligible':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Eligible</span>
          </span>
        );
      case 'Conditional':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Conditional</span>
          </span>
        );
      case 'Ineligible':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700">
            <XCircle className="w-3.5 h-3.5" />
            <span>Ineligible</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      <div className="p-5 sm:p-6">
        {/* Top Header: Company initial + Save button + Match Score */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl ${opportunity.logoBg} flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0`}
            >
              {opportunity.company.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 truncate">{opportunity.company}</p>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                {opportunity.title}
              </h3>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(opportunity.id);
            }}
            aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
            className={`p-2 rounded-lg border transition-colors shrink-0 ${
              isSaved
                ? 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100'
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-teal-700' : ''}`} />
          </button>
        </div>

        {/* Opportunity Meta Info (Clean unboxed text with separators) */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-3.5">
          <span className="font-semibold text-teal-800">{opportunity.type}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1 text-slate-600">
            <MapPin className="w-3 h-3 text-slate-400" />
            {opportunity.workMode} ({opportunity.location})
          </span>
          <span aria-hidden="true">·</span>
          <span>{getEligibilityBadge(match.eligibilityStatus)}</span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {opportunity.description}
        </p>

        {/* Required Skills list */}
        <div className="mb-4">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Key Required Skills
          </p>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {opportunity.requiredSkills.map((skill) => {
              const hasSkill = match.matchedSkills.includes(skill);
              return (
                <span
                  key={skill}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    hasSkill
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                  title={hasSkill ? 'Matched with your profile' : 'Skill needed'}
                >
                  {hasSkill ? '✓ ' : ''}{skill}
                </span>
              );
            })}
          </div>
        </div>

        {/* Match breakdown preview button */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenMatchModal && onOpenMatchModal(opportunity)}
              className={`px-2 py-0.5 rounded-md border text-xs font-mono font-bold ${getScoreBadgeClass(
                match.overallScore
              )}`}
            >
              {match.overallScore}% Match
            </button>
            <span className="text-[11px] text-slate-500">
              {match.matchedSkills.length} of {opportunity.requiredSkills.length} skills
            </span>
          </div>
          {onOpenMatchModal && (
            <button
              onClick={() => onOpenMatchModal(opportunity)}
              className="text-[11px] font-semibold text-teal-700 hover:underline"
            >
              AI breakdown
            </button>
          )}
        </div>
      </div>

      {/* Card Footer: Stipend & View Details button */}
      <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Compensation</p>
          <p className="text-xs font-bold font-mono text-slate-900 truncate">
            {opportunity.stipendSalary}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <Calendar className="w-3 h-3" />
            {opportunity.deadline}
          </span>

          <button
            onClick={() => onViewDetails(opportunity)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-teal-700 transition-colors flex items-center gap-1 shadow-sm shrink-0"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
