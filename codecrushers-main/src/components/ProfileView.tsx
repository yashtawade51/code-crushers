import React, { useState } from 'react';
import {
  Save,
  User,
  GraduationCap,
  Briefcase,
  Code,
  Sparkles,
  Plus,
  X,
  FolderGit2,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  UploadCloud,
  FileCheck,
  Check,
  Upload,
  Trash2,
  Camera,
  AlertCircle,
  FileText,
  Award,
} from 'lucide-react';
import { StudentProfile, Project, WorkMode, VerificationDocument } from '../types';
import { DocumentVerificationModal } from './DocumentVerificationModal';
import { PRESET_PROFILES } from '../data/mockData';

interface ProfileViewProps {
  profile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
  onLoadPreset: (profile: StudentProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onSaveProfile,
  onLoadPreset,
}) => {
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [newTechSkill, setNewTechSkill] = useState('');
  const [newSoftSkill, setNewSoftSkill] = useState('');
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectTech, setNewProjectTech] = useState('');
  const [showAddProject, setShowAddProject] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);

  // Profile Picture Upload Ref
  const avatarInputRef = React.useRef<HTMLInputElement | null>(null);

  // Marksheet verification states
  const marksheetInputRef = React.useRef<HTMLInputElement | null>(null);
  const [cgpaWarning, setCgpaWarning] = useState(false);

  // Technical Language / Skill Certificate verification states
  const certFileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [activeCertSkill, setActiveCertSkill] = useState<string | null>(null);

  // Handlers for avatar
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('avatarUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    handleInputChange('avatarUrl', '');
  };

  // Handlers for marksheet
  const handleMarksheetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const today = new Date().toISOString().split('T')[0];
      const marksheetInfo = {
        docName: file.name,
        verified: true,
        uploadedAt: today,
      };
      const updatedDocs = [
        ...(formData.verificationDocuments || []),
        {
          id: `doc-ms-${Date.now()}`,
          name: file.name,
          type: 'Official Marksheet / Degree Transcript' as any,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadedAt: today,
          status: 'Verified' as const,
          verificationScore: 99,
          notes: 'Official academic marksheet validated.',
        },
      ];
      setFormData((prev) => ({
        ...prev,
        marksheetDoc: marksheetInfo,
        verificationDocuments: updatedDocs,
      }));
      setCgpaWarning(false);
    }
  };

  // Handlers for technical language / skill certificates
  const triggerCertUpload = (skill: string) => {
    setActiveCertSkill(skill);
    if (certFileInputRef.current) {
      certFileInputRef.current.value = '';
      certFileInputRef.current.click();
    }
  };

  const handleCertFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeCertSkill) {
      const today = new Date().toISOString().split('T')[0];
      const newSkillCerts = {
        ...(formData.skillCertificates || {}),
        [activeCertSkill]: {
          docName: file.name,
          verified: true,
          uploadedAt: today,
        },
      };

      const updatedDocs = [
        ...(formData.verificationDocuments || []),
        {
          id: `doc-cert-${Date.now()}`,
          name: file.name,
          type: 'Language Certificate / Skill Certificate' as any,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadedAt: today,
          status: 'Verified' as const,
          verificationScore: 98,
          notes: `Verified course completion certificate for ${activeCertSkill}.`,
        },
      ];

      setFormData((prev) => ({
        ...prev,
        skillCertificates: newSkillCerts,
        verificationDocuments: updatedDocs,
      }));
      setActiveCertSkill(null);
    }
  };

  const handleRemoveSkillCert = (skill: string) => {
    setFormData((prev) => {
      const nextCerts = { ...(prev.skillCertificates || {}) };
      delete nextCerts[skill];
      return {
        ...prev,
        skillCertificates: nextCerts,
      };
    });
  };

  // Sync if outer profile updates
  React.useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleUpdateDocs = (docs: VerificationDocument[]) => {
    setFormData(prev => ({ ...prev, verificationDocuments: docs }));
    onSaveProfile({ ...formData, verificationDocuments: docs });
  };

  const handleInputChange = (field: keyof StudentProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEducationChange = (field: keyof StudentProfile['education'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      education: { ...prev.education, [field]: value },
    }));
  };

  // Add Tech Skill
  const handleAddTechSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTechSkill.trim()) return;
    if (!formData.technicalSkills.includes(newTechSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        technicalSkills: [...prev.technicalSkills, newTechSkill.trim()],
      }));
    }
    setNewTechSkill('');
  };

  const handleRemoveTechSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      technicalSkills: prev.technicalSkills.filter((s) => s !== skill),
    }));
  };

  // Add Soft Skill
  const handleAddSoftSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newSoftSkill.trim()) return;
    if (!formData.softSkills.includes(newSoftSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        softSkills: [...prev.softSkills, newSoftSkill.trim()],
      }));
    }
    setNewSoftSkill('');
  };

  const handleRemoveSoftSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      softSkills: prev.softSkills.filter((s) => s !== skill),
    }));
  };

  // Add Project
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim() || !newProjectDesc.trim()) return;

    const techs = newProjectTech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: newProjectTitle.trim(),
      description: newProjectDesc.trim(),
      technologies: techs.length > 0 ? techs : ['React', 'TypeScript'],
    };

    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProj],
    }));

    setNewProjectTitle('');
    setNewProjectDesc('');
    setNewProjectTech('');
    setShowAddProject(false);
  };

  const handleRemoveProject = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header & Preset Switcher */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
                Candidate Portfolio
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Student Profile & Preferences
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                The RozgarLink matching engine recalibrates match percentages immediately as you update this data.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-teal-700 text-white text-xs font-semibold transition-all shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>

          {/* Quick preset profile testing switcher */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 shrink-0">
              Test with Preset Candidate Profiles:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_PROFILES.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => onLoadPreset(preset.profile)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors"
                >
                  {preset.name} ({preset.tag})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: PERSONAL & ACADEMIC INFO */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <User className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-bold text-slate-900">
                Personal Information & Headline
              </h2>
            </div>

            {/* Profile Picture Upload Section */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Profile Picture
              </label>
              <input
                type="file"
                ref={avatarInputRef}
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                {formData.avatarUrl ? (
                  <div className="relative group shrink-0">
                    <img
                      src={formData.avatarUrl}
                      alt={formData.fullName}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-500/40 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      title="Remove profile picture"
                      className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white rounded-full p-1 shadow-md hover:bg-rose-700 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-700 flex flex-col items-center justify-center text-white shadow-sm border-2 border-teal-400/30 shrink-0">
                    <span className="text-2xl font-black">
                      {formData.fullName
                        .split(' ')
                        .filter(Boolean)
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase() || 'U'}
                    </span>
                    <span className="text-[9px] font-medium opacity-80 mt-0.5">No Photo</span>
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <div className="text-xs text-slate-700 font-medium">
                    {formData.avatarUrl
                      ? 'Custom profile picture uploaded.'
                      : 'No profile picture set. Upload an official photo to enhance recruiter trust.'}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{formData.avatarUrl ? 'Change Picture' : 'Upload Profile Picture'}</span>
                    </button>
                    {formData.avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Picture</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Supports JPG, PNG or WEBP formats. Recommended size 400x400px.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Professional Headline / Summary
                </label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => handleInputChange('headline', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: EDUCATION DETAILS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <GraduationCap className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-bold text-slate-900">
                Education & Degree
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Degree Name
                </label>
                <input
                  type="text"
                  value={formData.education.degree}
                  onChange={(e) => handleEducationChange('degree', e.target.value)}
                  placeholder="e.g. Bachelor of Technology (B.Tech)"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Field of Study / Major
                </label>
                <input
                  type="text"
                  value={formData.education.fieldOfStudy}
                  onChange={(e) => handleEducationChange('fieldOfStudy', e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  University / College Institution
                </label>
                <input
                  type="text"
                  value={formData.education.institution}
                  onChange={(e) => handleEducationChange('institution', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Current Academic Status / Level
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => handleInputChange('experienceLevel', e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                >
                  <option value="Pre-final Year">Pre-final Year Student</option>
                  <option value="Final Year Student">Final Year Student</option>
                  <option value="Fresh Graduate">Fresh Graduate</option>
                  <option value="1-2 Years Experience">1-2 Years Experience</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Graduation Year
                </label>
                <input
                  type="text"
                  value={formData.education.graduationYear}
                  onChange={(e) => handleEducationChange('graduationYear', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    CGPA / Score
                  </label>
                  {formData.marksheetDoc?.verified ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Marksheet Verified
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-600" /> Marksheet Required First
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.education.cgpa}
                  onChange={(e) => {
                    if (!formData.marksheetDoc?.verified) {
                      setCgpaWarning(true);
                    }
                    handleEducationChange('cgpa', e.target.value);
                  }}
                  onFocus={() => {
                    if (!formData.marksheetDoc?.verified) {
                      setCgpaWarning(true);
                    }
                  }}
                  placeholder={
                    formData.marksheetDoc?.verified
                      ? 'e.g. 8.4'
                      : 'Upload marksheet first to enter CGPA'
                  }
                  className={`w-full text-xs p-2.5 rounded-xl border font-mono transition-all focus:outline-none focus:ring-2 ${
                    formData.marksheetDoc?.verified
                      ? 'border-emerald-300 bg-white focus:ring-emerald-500/20 focus:border-emerald-500'
                      : 'border-amber-300 bg-amber-50/40 focus:ring-amber-500/20 focus:border-amber-500'
                  }`}
                  required
                />
              </div>

              {/* Marksheet Requirement Callout & File Input */}
              <div className="sm:col-span-2">
                <input
                  type="file"
                  ref={marksheetInputRef}
                  accept=".pdf,image/*"
                  onChange={handleMarksheetUpload}
                  className="hidden"
                />

                {formData.marksheetDoc?.verified ? (
                  <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-emerald-900 flex items-center gap-2">
                          <span>Official Marksheet / Transcript Submitted</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-emerald-200 text-emerald-800 rounded-full font-extrabold uppercase">
                            Verified
                          </span>
                        </div>
                        <div className="text-[11px] text-emerald-700 mt-0.5">
                          {formData.marksheetDoc.docName} · Verified on {formData.marksheetDoc.uploadedAt}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => marksheetInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors shrink-0 flex items-center justify-center gap-1.5"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Update Marksheet</span>
                    </button>
                  </div>
                ) : (
                  <div
                    className={`p-4 rounded-xl border transition-all ${
                      cgpaWarning
                        ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/30'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                          <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span>Official Marksheet Required Before Entering CGPA</span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-semibold">
                              Mandatory Verification
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                            To ensure academic integrity, please upload your official semester or degree marksheet/transcript before entering your CGPA.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => marksheetInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>Upload Marksheet</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: SKILLS PORTFOLIO */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Code className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-bold text-slate-900">
                Skills Portfolio (Technical & Soft)
              </h2>
            </div>

            {/* Technical Skills & Completion Certificates */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block">
                    Technical Skills & Programming Languages ({formData.technicalSkills.length})
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Skills are officially marked <strong>Verified</strong> only when completion certificates are submitted.
                  </p>
                </div>
                {/* Stats badge */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {(() => {
                    const verifiedCount = formData.technicalSkills.filter(
                      (s) => formData.skillCertificates?.[s]?.verified
                    ).length;
                    return (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-teal-600" />
                        <span>
                          {verifiedCount} of {formData.technicalSkills.length} Certified
                        </span>
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Hidden file input for skill certificate */}
              <input
                type="file"
                ref={certFileInputRef}
                accept=".pdf,image/*"
                onChange={handleCertFileUpload}
                className="hidden"
              />

              {/* List of skills with certificate status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                {formData.technicalSkills.map((skill) => {
                  const cert = formData.skillCertificates?.[skill];
                  const isVerified = Boolean(cert?.verified);

                  return (
                    <div
                      key={skill}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                        isVerified
                          ? 'bg-emerald-50/70 border-emerald-200'
                          : 'bg-slate-50 border-slate-200 hover:border-amber-200'
                      }`}
                    >
                      <div className="min-w-0 flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isVerified
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {isVerified ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <AlertCircle className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {skill}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase tracking-wide shrink-0 ${
                                isVerified
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {isVerified ? 'Verified' : 'Unverified'}
                            </span>
                          </div>
                          <div className="text-[10px] truncate mt-0.5">
                            {isVerified ? (
                              <span className="text-emerald-700 font-medium truncate block">
                                Cert: {cert?.docName}
                              </span>
                            ) : (
                              <span className="text-amber-700">
                                Requires completion certificate
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {isVerified ? (
                          <button
                            type="button"
                            onClick={() => triggerCertUpload(skill)}
                            className="px-2 py-1 rounded text-[10px] font-semibold bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors"
                            title="Update certificate"
                          >
                            Update
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => triggerCertUpload(skill)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors flex items-center gap-1"
                            title="Upload Certificate"
                          >
                            <UploadCloud className="w-3 h-3" />
                            <span>Upload Cert</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            handleRemoveTechSkill(skill);
                            handleRemoveSkillCert(skill);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                          title="Remove skill"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add technical skill input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTechSkill}
                  onChange={(e) => setNewTechSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTechSkill();
                    }
                  }}
                  placeholder="Type a skill (e.g. Next.js, Docker, PyTorch) and press Enter"
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddTechSkill()}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Quick suggestions */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                <span>Quick suggestions:</span>
                {['Next.js', 'Docker', 'AWS', 'PostgreSQL', 'FastAPI', 'Figma', 'PyTorch'].map(
                  (sug) =>
                    !formData.technicalSkills.includes(sug) && (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            technicalSkills: [...prev.technicalSkills, sug],
                          }));
                        }}
                        className="text-teal-700 hover:underline"
                      >
                        + {sug}
                      </button>
                    )
                )}
              </div>
            </div>

            {/* Soft Skills */}
            <div className="pt-3 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Soft Skills ({formData.softSkills.length})
              </label>

              <div className="flex flex-wrap gap-2 mb-3">
                {formData.softSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSoftSkill(skill)}
                      className="text-slate-400 hover:text-slate-700 focus:outline-none"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSoftSkill}
                  onChange={(e) => setNewSoftSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSoftSkill();
                    }
                  }}
                  placeholder="e.g. Critical Thinking, Public Speaking"
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddSoftSkill()}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 4: PROJECTS & PORTFOLIO */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-teal-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Projects & Portfolio ({formData.projects.length})
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowAddProject(!showAddProject)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddProject ? 'Cancel' : 'Add Project'}</span>
              </button>
            </div>

            {/* List of current projects */}
            <div className="space-y-3">
              {formData.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{proj.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveProject(proj.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {proj.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-white border border-slate-200 text-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Add project form box */}
            {showAddProject && (
              <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 space-y-3">
                <p className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                  New Project Entry
                </p>
                <input
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="Project title (e.g. Distributed Task Queue)"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                />
                <textarea
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Brief description of architecture and outcomes..."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  value={newProjectTech}
                  onChange={(e) => setNewProjectTech(e.target.value)}
                  placeholder="Technologies used (comma separated, e.g. React, Node.js, Redis)"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddProject(false)}
                    className="px-3 py-1.5 text-xs text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
                  >
                    Save Project
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 5: CAREER GOALS & PREFERENCES */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Briefcase className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-bold text-slate-900">
                Career Goals & Work Preferences
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Career Goals & Aspirations
                </label>
                <textarea
                  value={formData.careerGoals}
                  onChange={(e) => handleInputChange('careerGoals', e.target.value)}
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Preferred Work Mode
                  </label>
                  <select
                    value={formData.preferredWorkMode}
                    onChange={(e) =>
                      handleInputChange('preferredWorkMode', e.target.value as WorkMode | 'Any')
                    }
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="Any">Any Mode (Open to all)</option>
                    <option value="Remote">Remote Only</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Minimum Expected Monthly Stipend (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.minimumExpectedStipend}
                    onChange={(e) =>
                      handleInputChange('minimumExpectedStipend', Number(e.target.value))
                    }
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6: VERIFIED DOCUMENTS & KYC CREDENTIALS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Document Verification & KYC
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowDocModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold border border-teal-200 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload & Manage Documents</span>
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Verified documents grant you a <strong>Verified Candidate Badge</strong> and boost recruiter response rates by up to 3.5x.
            </p>

            {/* Documents preview grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(formData.verificationDocuments || [
                {
                  id: 'doc-001',
                  name: `${formData.fullName.replace(/\s+/g, '_')}_Resume_2026.pdf`,
                  type: 'Resume / CV',
                  fileSize: '1.2 MB',
                  uploadedAt: '2026-10-08',
                  status: 'Verified',
                  verificationScore: 98,
                  notes: 'Verified candidate curriculum vitae.',
                },
                {
                  id: 'doc-002',
                  name: `${formData.education.institution.replace(/\s+/g, '_')}_ID.png`,
                  type: 'College ID',
                  fileSize: '2.4 MB',
                  uploadedAt: '2026-10-07',
                  status: 'Verified',
                  verificationScore: 95,
                  notes: 'Student identification roll verified.',
                },
              ] as VerificationDocument[]).map(doc => (
                <div key={doc.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">{doc.name}</div>
                      <div className="text-[11px] text-slate-500">{doc.type} · {doc.fileSize}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 flex-shrink-0">
                    <Check className="w-3 h-3" /> {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Save Action */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Profile</span>
            </button>
          </div>
        </form>

        {/* Document Verification Modal */}
        <DocumentVerificationModal
          isOpen={showDocModal}
          onClose={() => setShowDocModal(false)}
          documents={formData.verificationDocuments || [
            {
              id: 'doc-001',
              name: `${formData.fullName.replace(/\s+/g, '_')}_Resume_2026.pdf`,
              type: 'Resume / CV',
              fileSize: '1.2 MB',
              uploadedAt: '2026-10-08',
              status: 'Verified',
              verificationScore: 98,
              notes: 'Verified candidate curriculum vitae.',
            },
            {
              id: 'doc-002',
              name: `${formData.education.institution.replace(/\s+/g, '_')}_ID.png`,
              type: 'College ID',
              fileSize: '2.4 MB',
              uploadedAt: '2026-10-07',
              status: 'Verified',
              verificationScore: 95,
              notes: 'Student identification roll verified.',
            },
          ]}
          onUpdateDocuments={handleUpdateDocs}
          candidateName={formData.fullName}
        />
      </div>
    </div>
  );
};
