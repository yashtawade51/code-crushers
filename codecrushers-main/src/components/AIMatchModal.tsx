import React from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Cpu,
  Layers,
  Award,
} from 'lucide-react';
import { Opportunity, MatchAnalysis, StudentProfile } from '../types';

interface AIMatchModalProps {
  opportunity: Opportunity | null;
  match: MatchAnalysis | null;
  profile: StudentProfile;
  onClose: () => void;
  onViewFullOpportunity: (opp: Opportunity) => void;
}

export const AIMatchModal: React.FC<AIMatchModalProps> = ({
  opportunity,
  match,
  profile,
  onClose,
  onViewFullOpportunity,
}) => {
  if (!opportunity || !match) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-wider uppercase text-teal-300 font-semibold">
                  RozgarLink Match Engine
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-900/80 text-teal-200 border border-teal-700/60">
                  Algorithmic Demo
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                AI Compatibility Breakdown
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-700 text-xs sm:text-sm">
          {/* Target Role & Profile Pill */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Evaluating Opportunity</p>
              <p className="font-bold text-slate-900 text-xs sm:text-sm">
                {opportunity.title} <span className="text-slate-500 font-normal">at {opportunity.company}</span>
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Candidate Profile</p>
              <p className="font-semibold text-teal-700 text-xs">{profile.fullName}</p>
            </div>
          </div>

          {/* Big Score Gauge */}
          <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 text-center space-y-2">
            <span className="text-[11px] font-bold text-teal-900 uppercase tracking-wider">
              Overall Weighted Compatibility Index
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold font-mono text-slate-900">
                {match.overallScore}%
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Synthesized using skill synonym affinity, degree matching rules, project alignment, and candidate preferences.
            </p>
          </div>

          {/* AI Explanation Box */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center gap-1.5 text-teal-800 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Algorithmic Reasoning Summary</span>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              "{match.aiReasoning}"
            </p>
          </div>

          {/* 4 Multi-Parameter Weighted Metrics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 uppercase tracking-wider">
                Multi-Factor Evaluation Weights
              </span>
              <span className="text-slate-400">100% Total Formula</span>
            </div>

            <div className="space-y-2.5">
              {/* Factor 1: Skills */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800">
                    1. Technical & Soft Skills Affinity (50% Weight)
                  </span>
                  <span className="font-mono font-bold text-teal-700">{match.skillsScore}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-teal-600 h-1.5 rounded-full"
                    style={{ width: `${match.skillsScore}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Matched {match.matchedSkills.length} required/preferred competencies via synonym dictionary.
                </p>
              </div>

              {/* Factor 2: Education */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800">
                    2. Education & Degree Compatibility (20% Weight)
                  </span>
                  <span className="font-mono font-bold text-teal-700">{match.educationScore}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-teal-600 h-1.5 rounded-full"
                    style={{ width: `${match.educationScore}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Evaluated {profile.education.degree} against {opportunity.educationRequirement} and CGPA cutoff.
                </p>
              </div>

              {/* Factor 3: Experience */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800">
                    3. Experience & Project Portfolio (15% Weight)
                  </span>
                  <span className="font-mono font-bold text-teal-700">{match.experienceScore}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-teal-600 h-1.5 rounded-full"
                    style={{ width: `${match.experienceScore}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Scanned {profile.projects.length} portfolio projects for practical framework usage.
                </p>
              </div>

              {/* Factor 4: Preferences */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800">
                    4. Work Mode & Role Preference (15% Weight)
                  </span>
                  <span className="font-mono font-bold text-teal-700">{match.preferencesScore}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-teal-600 h-1.5 rounded-full"
                    style={{ width: `${match.preferencesScore}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {profile.preferredWorkMode} preference compared with role's {opportunity.workMode} arrangement.
                </p>
              </div>
            </div>
          </div>

          {/* Actionable recommendations */}
          {match.learningRecommendations.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                <TrendingUp className="w-4 h-4 text-amber-700" />
                <span>Suggested Profile Optimization</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {match.learningRecommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-700 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Demo disclaimer */}
          <div className="p-3 rounded-lg bg-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              This calculation is produced by RozgarLink’s local simulated matching engine. It operates deterministically using student profile attributes and opportunity parameters without external API dependencies.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onViewFullOpportunity(opportunity);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-teal-700 rounded-lg transition-colors"
          >
            View Full Opportunity Details →
          </button>
        </div>
      </div>
    </div>
  );
};
