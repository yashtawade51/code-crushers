import React, { useState } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Plus,
  Sparkles,
  CheckSquare,
  Square,
} from 'lucide-react';
import { StudentProfile, CareerTrack } from '../types';
import { CAREER_TRACKS, SKILL_RESOURCES } from '../data/mockData';

interface SkillGapViewProps {
  profile: StudentProfile;
  onAddSkillToProfile: (skill: string) => void;
  completedChecklistSkills: string[];
  onToggleChecklistSkill: (skill: string) => void;
  onNavigateToProfile: () => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({
  profile,
  onAddSkillToProfile,
  completedChecklistSkills,
  onToggleChecklistSkill,
  onNavigateToProfile,
}) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>('track-frontend');

  const selectedTrack = CAREER_TRACKS.find((t) => t.id === selectedTrackId) || CAREER_TRACKS[0];

  const userSkillsNorm = profile.technicalSkills.map((s) => s.toLowerCase());

  // Split track core skills into matching and missing
  const matchingSkills = selectedTrack.coreSkills.filter((s) =>
    userSkillsNorm.some((us) => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us))
  );

  const missingCoreSkills = selectedTrack.coreSkills.filter(
    (s) => !matchingSkills.includes(s)
  );

  const missingSupplementarySkills = selectedTrack.supplementarySkills.filter(
    (s) => !userSkillsNorm.some((us) => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us))
  );

  const totalRequired = selectedTrack.coreSkills.length;
  const matchPercentage = Math.round((matchingSkills.length / (totalRequired || 1)) * 100);

  // Relevant learning resources for missing skills
  const allMissing = [...missingCoreSkills, ...missingSupplementarySkills];
  const relevantResources = SKILL_RESOURCES.filter((res) =>
    allMissing.some((ms) => ms.toLowerCase().includes(res.skill.toLowerCase()) || res.skill.toLowerCase().includes(ms.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
                Career Readiness
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-mono">Industry Benchmark</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Skill-Gap Analysis Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Compare your current competencies against standard industry job profiles and get actionable learning recommendations.
            </p>
          </div>

          <button
            onClick={onNavigateToProfile}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
          >
            Manage Profile Skills
          </button>
        </div>

        {/* 1. CAREER TRACK SELECTOR */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Select Your Target Career Path:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {CAREER_TRACKS.map((track) => {
              const isSelected = track.id === selectedTrackId;
              return (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrackId(track.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-teal-50/70 border-teal-500 text-teal-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold leading-tight line-clamp-1">{track.title}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Demand: {track.demandLevel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. GAP SUMMARY CARD */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-teal-500/20 text-teal-300 text-xs font-mono font-semibold border border-teal-500/30">
                <span>Target: {selectedTrack.title}</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Readiness Score: {matchPercentage}%
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                {selectedTrack.description} Average entry package: <strong className="text-white font-mono">{selectedTrack.averageEntrySalary}</strong>.
              </p>

              <div className="pt-2 flex items-center gap-4 text-xs text-slate-300">
                <span>
                  <strong className="text-emerald-400 font-mono">{matchingSkills.length}</strong> Skills Possessed
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  <strong className="text-amber-400 font-mono">{missingCoreSkills.length}</strong> Core Gaps
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  <strong className="text-teal-400 font-mono">{missingSupplementarySkills.length}</strong> Recommended Next
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/10 p-5 rounded-xl border border-white/15 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-300 mb-2">
                Core Skill Benchmark
              </p>
              <div className="w-full bg-slate-700/60 rounded-full h-3 overflow-hidden mb-2">
                <div
                  className="bg-teal-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${matchPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-300">
                {matchingSkills.length} of {totalRequired} essential stack tools mastered
              </p>
            </div>
          </div>
        </div>

        {/* 3. SIDE-BY-SIDE SKILLS MATRIX (Green vs Orange Indicators) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Green Column: Matching / Possessed Skills */}
          <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Skills You Have (Matching)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                {matchingSkills.length} Verified
              </span>
            </div>

            <p className="text-xs text-slate-500">
              These competencies in your profile directly satisfy employer criteria for this role.
            </p>

            <div className="space-y-2">
              {matchingSkills.map((skill) => (
                <div
                  key={skill}
                  className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold text-slate-800">{skill}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    MATCHED
                  </span>
                </div>
              ))}
            </div>

            {matchingSkills.length === 0 && (
              <p className="text-xs text-slate-400 italic py-4 text-center">
                No matching skills found for this track. Add skills to your profile to see alignment.
              </p>
            )}
          </div>

          {/* Orange Column: Missing / High-Priority Gaps */}
          <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Skill Gaps (Need Improvement)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                {missingCoreSkills.length + missingSupplementarySkills.length} Missing
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Learning these tools will raise your candidacy match rate significantly.
            </p>

            <div className="space-y-2">
              {missingCoreSkills.map((skill) => (
                <div
                  key={skill}
                  className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block truncate">
                        {skill}
                      </span>
                      <span className="text-[10px] text-amber-800">Essential Core Requirement</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onAddSkillToProfile(skill)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 transition-colors flex items-center gap-1 shrink-0"
                    title="Already learned this? Add directly to your profile"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add to Profile</span>
                  </button>
                </div>
              ))}

              {missingSupplementarySkills.map((skill) => (
                <div
                  key={skill}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block truncate">
                        {skill}
                      </span>
                      <span className="text-[10px] text-slate-500">Recommended Differentiator</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onAddSkillToProfile(skill)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add to Profile</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. INTERACTIVE SKILL IMPROVEMENT CHECKLIST */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Skill-Improvement Action Checklist
              </h3>
              <p className="text-xs text-slate-500">
                Tick skills as you study them to monitor your self-paced progress.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Completed: {completedChecklistSkills.length} tasks
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[...selectedTrack.coreSkills, ...selectedTrack.supplementarySkills].map((skill) => {
              const isChecked = completedChecklistSkills.includes(skill);
              return (
                <div
                  key={skill}
                  onClick={() => onToggleChecklistSkill(skill)}
                  className={`p-3 rounded-xl border cursor-pointer transition-colors flex items-center justify-between ${
                    isChecked
                      ? 'bg-teal-50/60 border-teal-300 text-teal-900'
                      : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-teal-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <div>
                      <p className={`text-xs font-bold ${isChecked ? 'line-through text-slate-500' : ''}`}>
                        Complete {skill} Fundamentals & Mini-Project
                      </p>
                      <span className="text-[10px] text-slate-500">
                        Target role: {selectedTrack.title}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {isChecked ? 'Done' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. SUGGESTED LEARNING RESOURCES */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Recommended Free Learning Resources
              </h3>
              <p className="text-xs text-slate-500">
                Verified, high-quality documentation, interactive playgrounds, and video courses.
              </p>
            </div>
            <BookOpen className="w-5 h-5 text-teal-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relevantResources.length > 0 ? (
              relevantResources.map((res, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-teal-700">{res.skill}</span>
                      <span className="font-mono">{res.duration}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {res.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Platform: {res.provider} · Level: {res.level}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      100% Free
                    </span>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
                    >
                      <span>Access Material</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-6 text-center text-xs text-slate-500">
                All top resources currently matched or explore the comprehensive learning catalogue.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
