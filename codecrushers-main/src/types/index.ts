export type OpportunityType = 'Internship' | 'Full-time' | 'Training' | 'Certification';

export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';

export type ApplicationStatus = 'Saved' | 'Applied' | 'Interview' | 'Offered' | 'Rejected';

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface EducationInfo {
  degree: string;
  fieldOfStudy: string;
  institution: string;
  graduationYear: string;
  cgpa: string;
}

export type DocumentType = 'Resume / CV' | 'College ID' | 'Degree Certificate' | 'Marksheet / Transcript' | 'Government ID';
export type DocVerificationStatus = 'Pending' | 'Verified' | 'Rejected';

export interface VerificationDocument {
  id: string;
  name: string;
  type: DocumentType;
  fileSize: string;
  uploadedAt: string;
  status: DocVerificationStatus;
  verificationScore?: number;
  notes?: string;
  fileUrl?: string;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  headline: string;
  education: EducationInfo;
  technicalSkills: string[];
  softSkills: string[];
  experienceLevel: 'Pre-final Year' | 'Final Year Student' | 'Fresh Graduate' | '1-2 Years Experience';
  projects: Project[];
  interests: string[];
  careerGoals: string;
  preferredRoles: string[];
  preferredWorkMode: WorkMode | 'Any';
  preferredLocations: string[];
  minimumExpectedStipend: number;
  verificationDocuments?: VerificationDocument[];
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  companyTagline: string;
  logoBg: string;
  type: OpportunityType;
  workMode: WorkMode;
  location: string;
  stipendSalary: string;
  stipendAmountMonthly: number; // For sorting and numeric logic
  duration: string;
  deadline: string; // ISO date format YYYY-MM-DD
  postedDate: string;
  requiredSkills: string[];
  preferredSkills: string[];
  educationRequirement: string;
  allowedDegrees: string[];
  minCgpa: number;
  experienceRequirement: string;
  description: string;
  responsibilities: string[];
  perks: string[];
  openings: number;
  featured?: boolean;
}

export interface EligibilityCheckItem {
  criterion: string;
  passed: boolean;
  userValue: string;
  requiredValue: string;
  note: string;
}

export interface MatchAnalysis {
  opportunityId: string;
  overallScore: number; // 0 - 100
  skillsScore: number; // 0 - 100
  educationScore: number; // 0 - 100
  experienceScore: number; // 0 - 100
  preferencesScore: number; // 0 - 100
  matchedSkills: string[];
  missingSkills: string[];
  matchingPercentage: number;
  isEligible: boolean;
  eligibilityStatus: 'Eligible' | 'Conditional' | 'Ineligible';
  eligibilityChecklist: EligibilityCheckItem[];
  aiReasoning: string;
  learningRecommendations: string[];
}

export interface ApplicationTrackerItem {
  opportunityId: string;
  status: ApplicationStatus;
  savedDate: string;
  updatedDate: string;
  notes: string;
}

export interface SkillResource {
  skill: string;
  title: string;
  provider: string;
  type: 'Course' | 'Interactive' | 'Documentation' | 'Video Guide';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  url: string;
  free: boolean;
}

export interface CareerTrack {
  id: string;
  title: string;
  description: string;
  demandLevel: 'Very High' | 'High' | 'Growing';
  coreSkills: string[];
  supplementarySkills: string[];
  averageEntrySalary: string;
}
