import { StudentProfile, ApplicationTrackerItem } from '../types';
import { DEFAULT_STUDENT_PROFILE } from '../data/mockData';

const PROFILE_KEY = 'rozgarlink_student_profile_v1';
const TRACKER_KEY = 'rozgarlink_application_tracker_v1';
const COMPLETED_SKILLS_KEY = 'rozgarlink_completed_skills_v1';

export function getStoredProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to parse stored profile:', err);
  }
  return DEFAULT_STUDENT_PROFILE;
}

export function saveStoredProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile:', err);
  }
}

export function getStoredTracker(): Record<string, ApplicationTrackerItem> {
  try {
    const raw = localStorage.getItem(TRACKER_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to parse application tracker:', err);
  }
  // Initial seed with two saved items for demonstration
  return {
    'opp-01': {
      opportunityId: 'opp-01',
      status: 'Applied',
      savedDate: '2026-10-06',
      updatedDate: '2026-10-09',
      notes: 'Submitted resume and portfolio. Received automated confirmation email.',
    },
    'opp-05': {
      opportunityId: 'opp-05',
      status: 'Saved',
      savedDate: '2026-10-08',
      updatedDate: '2026-10-08',
      notes: 'Great match for Full-stack graduate role. Reviewing system design concepts before submitting.',
    },
    'opp-10': {
      opportunityId: 'opp-10',
      status: 'Interview',
      savedDate: '2026-10-07',
      updatedDate: '2026-10-10',
      notes: 'Enrolled in Cloud certification cohort. Assessment test scheduled for Saturday.',
    },
  };
}

export function saveStoredTracker(tracker: Record<string, ApplicationTrackerItem>): void {
  try {
    localStorage.setItem(TRACKER_KEY, JSON.stringify(tracker));
  } catch (err) {
    console.error('Failed to save tracker:', err);
  }
}

export function getCompletedSkills(): string[] {
  try {
    const raw = localStorage.getItem(COMPLETED_SKILLS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to parse completed skills:', err);
  }
  return ['Git & GitHub', 'HTML/CSS'];
}

export function saveCompletedSkills(skills: string[]): void {
  try {
    localStorage.setItem(COMPLETED_SKILLS_KEY, JSON.stringify(skills));
  } catch (err) {
    console.error('Failed to save completed skills:', err);
  }
}
