import React, { useState } from 'react';
import {
  X,
  Bookmark,
  Building2,
  MapPin,
  Calendar,
  Clock,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
  ExternalLink,
} from 'lucide-react';
import { Opportunity, MatchAnalysis, StudentProfile } from '../types';

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  match: MatchAnalysis | null;
  isSaved: boolean;
  onClose: () => void;
  onToggleSave: (oppId: string) => void;
  onApply: (oppId: string, note: string) => void;
  isApplied: boolean;
  profile: StudentProfile;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  match,
  isSaved,
  onClose,
  onToggleSave,
  onApply,
  isApplied,
  profile,
}) => {
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [applyNote, setApplyNote] = useState('');

  if (!opportunity || !match) return null;

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(opportunity.id, applyNote);
    setShowApplyDialog(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-12 h-12 rounded-xl ${opportunity.logoBg} flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0`}
            >
              {opportunity.company.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-semibold text-teal-800">{opportunity.company}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-600 font-medium">{opportunity.type}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {opportunity.workMode}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {opportunity.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleSave(opportunity.id)}
              aria-label="Save opportunity"
              className={`p-2 rounded-lg border transition-colors ${
                isSaved
                  ? 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-teal-700' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-700">
          {/* AI MATCH HIGHLIGHT BOX */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-50 via-teal-50/50 to-sky-50 border border-teal-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-teal-200/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-sm shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                    AI Match Score Analysis
                  </p>
                  <p className="text-xs text-teal-700">
                    Calculated for {profile.fullName} ({profile.education.degree})
                  </p>
                </div>
              </div>

              {/* Progress gauge */}
              <div className="flex items-center gap-3">
                <div className="w-32 bg-teal-200/60 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-teal-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${match.overallScore}%` }}
                  />
                </div>
                <span className="text-lg font-bold font-mono text-teal-900">
                  {match.overallScore}%
                </span>
              </div>
            </div>

            {/* AI Explanation Paragraph */}
            <div className="mt-3.5">
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                {match.aiReasoning}
              </p>
            </div>

            {/* 4 Score Breakdown Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-teal-200/40 text-center">
              <div className="p-2 rounded-lg bg-white/70 border border-teal-100">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Skills</span>
                <span className="text-xs font-mono font-bold text-teal-800">{match.skillsScore}%</span>
              </div>
              <div className="p-2 rounded-lg bg-white/70 border border-teal-100">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Education</span>
                <span className="text-xs font-mono font-bold text-teal-800">{match.educationScore}%</span>
              </div>
              <div className="p-2 rounded-lg bg-white/70 border border-teal-100">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Projects</span>
                <span className="text-xs font-mono font-bold text-teal-800">{match.experienceScore}%</span>
              </div>
              <div className="p-2 rounded-lg bg-white/70 border border-teal-100">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Preferences</span>
                <span className="text-xs font-mono font-bold text-teal-800">{match.preferencesScore}%</span>
              </div>
            </div>
          </div>

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[10px] uppercase font-semibold text-slate-400">Stipend / Salary</p>
              <p className="font-bold font-mono text-slate-900 mt-0.5">{opportunity.stipendSalary}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[10px] uppercase font-semibold text-slate-400">Duration</p>
              <p className="font-bold text-slate-900 mt-0.5">{opportunity.duration}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[10px] uppercase font-semibold text-slate-400">Deadline</p>
              <p className="font-bold font-mono text-slate-900 mt-0.5">{opportunity.deadline}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[10px] uppercase font-semibold text-slate-400">Openings</p>
              <p className="font-bold font-mono text-slate-900 mt-0.5">{opportunity.openings} vacancies</p>
            </div>
          </div>

          {/* SKILLS COMPARISON: Matching (Green) vs Missing (Orange) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Skills Breakdown for Your Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Possessed / Matched */}
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Skills You Possess ({match.matchedSkills.length})</span>
                </div>
                {match.matchedSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {match.matchedSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-900 border border-emerald-200"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No exact skill matches detected yet.</p>
                )}
              </div>

              {/* Missing / Need improvement */}
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Skills To Acquire / Improve ({match.missingSkills.length})</span>
                </div>
                {match.missingSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {match.missingSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-900 border border-amber-200"
                      >
                        + {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-700 font-medium">
                    You have all required skills for this position!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Description & Responsibilities */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Opportunity Overview</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {opportunity.description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Key Responsibilities</h3>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2">
                {opportunity.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {opportunity.perks && opportunity.perks.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">Perks & Benefits</h3>
                <div className="flex flex-wrap gap-2">
                  {opportunity.perks.map((perk, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs border border-slate-200"
                    >
                      {perk}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Eligibility Audit Checklist */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Mandatory Eligibility Checklist
            </h3>
            <div className="space-y-2.5 text-xs">
              {match.eligibilityChecklist.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-white border border-slate-200/80"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    {item.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold text-slate-800">{item.criterion}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">{item.note}</p>
                    </div>
                  </div>
                  <span
                    className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded shrink-0 ${
                      item.passed
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-rose-700 bg-rose-50'
                    }`}
                  >
                    {item.passed ? 'PASSED' : 'SHORTFALL'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex items-center justify-between gap-3">
          <button
            onClick={() => onToggleSave(opportunity.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
              isSaved
                ? 'bg-teal-50 border-teal-200 text-teal-800'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-teal-800' : ''}`} />
            <span>{isSaved ? 'Saved in Tracker' : 'Save Opportunity'}</span>
          </button>

          <div className="flex items-center gap-2">
            {isApplied ? (
              <span className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Application Submitted</span>
              </span>
            ) : (
              <button
                onClick={() => setShowApplyDialog(true)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-teal-700 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Apply Now</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Apply Confirmation Dialog */}
      {showApplyDialog && (
        <div className="fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Apply to {opportunity.title}
              </h3>
              <button
                onClick={() => setShowApplyDialog(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Your profile (<strong className="text-slate-800">{profile.fullName}</strong>) and coursework will be submitted with this application. You can add a short candidate introduction note:
            </p>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Candidate Note / Cover Note (Optional)
                </label>
                <textarea
                  value={applyNote}
                  onChange={(e) => setApplyNote(e.target.value)}
                  placeholder="e.g. Excited to contribute my React and TypeScript skills to the CloudPulse product suite..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyDialog(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-teal-700 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <span>Confirm Application</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
