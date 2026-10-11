import React, { useState, useMemo, useEffect } from 'react';
import { LoginPage, AuthUser, UserRole } from './components/LoginPage';
import { RecruiterDashboard } from './components/RecruiterDashboard';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { OpportunityExplorer } from './components/OpportunityExplorer';
import { SkillGapView } from './components/SkillGapView';
import { SavedTrackerView } from './components/SavedTrackerView';
import { ProfileView } from './components/ProfileView';
import { OpportunityDetailModal } from './components/OpportunityDetailModal';
import { AIMatchModal } from './components/AIMatchModal';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { AIChatbot } from './components/AIChatbot';

import {
  Opportunity,
  StudentProfile,
  MatchAnalysis,
  ApplicationTrackerItem,
  ApplicationStatus,
} from './types';
import { MOCK_OPPORTUNITIES, DEFAULT_STUDENT_PROFILE } from './data/mockData';
import { evaluateOpportunityMatch } from './services/matchingEngine';
import {
  getStoredProfile,
  saveStoredProfile,
  getStoredTracker,
  saveStoredTracker,
  getCompletedSkills,
  saveCompletedSkills,
} from './services/storageService';

export default function App() {
  // Auth State
  const [authUser, setAuthUser] = useState<AuthUser | null>({
    id: 'CAND-28471',
    name: 'Ananya Sharma',
    email: 'ananya@campus.edu',
    role: 'candidate',
  });
  const [loginRole, setLoginRole] = useState<UserRole | undefined>(undefined);
  const isLoggedIn = authUser !== null;

  const handleOpenLogin = (role?: UserRole) => {
    setLoginRole(role);
    setCurrentTab('login');
  };

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('landing');

  // Core Data States with LocalStorage Initialization
  const [profile, setProfile] = useState<StudentProfile>(() => getStoredProfile());
  const [opportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [trackerItems, setTrackerItems] = useState<Record<string, ApplicationTrackerItem>>(() =>
    getStoredTracker()
  );
  const [completedSkills, setCompletedSkills] = useState<string[]>(() => getCompletedSkills());

  // Modals
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [aiMatchModalOpp, setAiMatchModalOpp] = useState<Opportunity | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'info' | 'error', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Live Matching Engine Computation
  // Recalculates dynamically whenever profile changes
  const matches = useMemo<Record<string, MatchAnalysis>>(() => {
    const res: Record<string, MatchAnalysis> = {};
    for (const opp of opportunities) {
      res[opp.id] = evaluateOpportunityMatch(opp, profile);
    }
    return res;
  }, [opportunities, profile]);

  // Saved IDs from tracker
  const savedIds = useMemo(() => {
    return Object.keys(trackerItems);
  }, [trackerItems]);

  // Save changes to LocalStorage
  const handleSaveProfile = (updatedProfile: StudentProfile) => {
    setProfile(updatedProfile);
    saveStoredProfile(updatedProfile);
    addToast('success', 'Profile Saved', 'Matching scores have been recalibrated.');
  };

  const handleLoadPreset = (presetProfile: StudentProfile) => {
    setProfile(presetProfile);
    saveStoredProfile(presetProfile);
    addToast('info', 'Loaded Preset Profile', `Switched candidate to ${presetProfile.fullName}.`);
  };

  // Toggle Save/Bookmark Opportunity
  const handleToggleSave = (oppId: string) => {
    const opp = opportunities.find((o) => o.id === oppId);
    if (!opp) return;

    setTrackerItems((prev) => {
      const next = { ...prev };
      if (next[oppId]) {
        delete next[oppId];
        saveStoredTracker(next);
        addToast('info', 'Removed from Tracker', `${opp.title} has been unbookmarked.`);
      } else {
        const today = new Date().toISOString().split('T')[0];
        next[oppId] = {
          opportunityId: oppId,
          status: 'Saved',
          savedDate: today,
          updatedDate: today,
          notes: 'Saved for review.',
        };
        saveStoredTracker(next);
        addToast('success', 'Opportunity Saved', `${opp.title} bookmarked to your Tracker.`);
      }
      return next;
    });
  };

  // Apply to Opportunity
  const handleApply = (oppId: string, note: string) => {
    const opp = opportunities.find((o) => o.id === oppId);
    if (!opp) return;

    const today = new Date().toISOString().split('T')[0];
    setTrackerItems((prev) => {
      const next = { ...prev };
      next[oppId] = {
        opportunityId: oppId,
        status: 'Applied',
        savedDate: next[oppId]?.savedDate || today,
        updatedDate: today,
        notes: note || 'Application submitted via RozgarLink platform.',
      };
      saveStoredTracker(next);
      return next;
    });

    addToast('success', 'Application Submitted!', `Successfully applied to ${opp.title} at ${opp.company}.`);
  };

  // Tracker Status Changes
  const handleUpdateTrackerStatus = (oppId: string, newStatus: ApplicationStatus) => {
    const opp = opportunities.find((o) => o.id === oppId);
    const today = new Date().toISOString().split('T')[0];

    setTrackerItems((prev) => {
      const next = { ...prev };
      if (next[oppId]) {
        next[oppId] = {
          ...next[oppId],
          status: newStatus,
          updatedDate: today,
        };
        saveStoredTracker(next);
        addToast('info', 'Status Updated', `Moved ${opp?.title || 'opportunity'} to "${newStatus}".`);
      }
      return next;
    });
  };

  // Tracker Notes Changes
  const handleUpdateTrackerNotes = (oppId: string, notes: string) => {
    setTrackerItems((prev) => {
      const next = { ...prev };
      if (next[oppId]) {
        next[oppId] = {
          ...next[oppId],
          notes,
          updatedDate: new Date().toISOString().split('T')[0],
        };
        saveStoredTracker(next);
        addToast('success', 'Note Saved', 'Application note updated.');
      }
      return next;
    });
  };

  // Remove from Tracker
  const handleRemoveFromTracker = (oppId: string) => {
    setTrackerItems((prev) => {
      const next = { ...prev };
      delete next[oppId];
      saveStoredTracker(next);
      addToast('info', 'Record Removed', 'Item removed from your tracker.');
      return next;
    });
  };

  // Add Skill directly to Profile from SkillGap
  const handleAddSkillToProfile = (skill: string) => {
    if (profile.technicalSkills.includes(skill)) {
      addToast('info', 'Skill Already Added', `${skill} is already listed in your profile.`);
      return;
    }
    const updated = {
      ...profile,
      technicalSkills: [...profile.technicalSkills, skill],
    };
    setProfile(updated);
    saveStoredProfile(updated);
    addToast('success', 'Skill Added to Profile', `Added ${skill}. Matching scores recalculated!`);
  };

  // Toggle checklist item
  const handleToggleChecklistSkill = (skill: string) => {
    setCompletedSkills((prev) => {
      const next = prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill];
      saveCompletedSkills(next);
      return next;
    });
  };

  // Scroll to top on navigation change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  if (authUser?.role === 'recruiter') {
    return (
      <RecruiterDashboard
        user={authUser}
        onLogout={() => {
          setAuthUser(null);
          setCurrentTab('landing');
          addToast('info', 'Logged Out', 'Signed out of recruiter portal.');
        }}
      />
    );
  }

  if (currentTab === 'login') {
    return (
      <LoginPage
        initialRole={loginRole}
        onLogin={(user) => {
          setAuthUser(user);
          if (user.role === 'candidate') {
            setProfile((prev) => ({
              ...prev,
              id: user.id,
              fullName: user.name || prev.fullName,
              email: user.email || prev.email,
            }));
            setCurrentTab('dashboard');
            addToast('success', `Welcome, ${user.name}!`, `Signed in as Candidate (${user.id})`);
          } else {
            addToast('success', `Welcome, ${user.name}!`, `Recruiter portal activated (${user.id})`);
          }
        }}
        onCancel={() => setCurrentTab('landing')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* 1. TOP NAVBAR */}
      <Navbar
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        savedCount={savedIds.length}
        authUser={authUser}
        onOpenLogin={handleOpenLogin}
        onLogout={() => {
          setAuthUser(null);
          addToast('info', 'Signed Out', 'You are now browsing as guest.');
        }}
      />

      {/* 2. MAIN ACTIVE VIEW ROUTING */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onNavigate={setCurrentTab}
            opportunities={opportunities}
            profile={profile}
            onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
            onOpenLogin={handleOpenLogin}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            opportunities={opportunities}
            matches={matches}
            savedIds={savedIds}
            onNavigate={setCurrentTab}
            onViewDetails={(opp) => setSelectedOpportunity(opp)}
            onToggleSave={handleToggleSave}
            onOpenMatchModal={(opp) => setAiMatchModalOpp(opp)}
          />
        )}

        {currentTab === 'explore' && (
          <OpportunityExplorer
            opportunities={opportunities}
            matches={matches}
            savedIds={savedIds}
            profile={profile}
            onViewDetails={(opp) => setSelectedOpportunity(opp)}
            onToggleSave={handleToggleSave}
            onOpenMatchModal={(opp) => setAiMatchModalOpp(opp)}
            onNavigateToProfile={() => setCurrentTab('profile')}
          />
        )}

        {currentTab === 'skillgap' && (
          <SkillGapView
            profile={profile}
            onAddSkillToProfile={handleAddSkillToProfile}
            completedChecklistSkills={completedSkills}
            onToggleChecklistSkill={handleToggleChecklistSkill}
            onNavigateToProfile={() => setCurrentTab('profile')}
          />
        )}

        {currentTab === 'tracker' && (
          <SavedTrackerView
            opportunities={opportunities}
            trackerItems={trackerItems}
            onUpdateStatus={handleUpdateTrackerStatus}
            onUpdateNotes={handleUpdateTrackerNotes}
            onRemoveFromTracker={handleRemoveFromTracker}
            onViewDetails={(opp) => setSelectedOpportunity(opp)}
            onNavigateToExplore={() => setCurrentTab('explore')}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            profile={profile}
            onSaveProfile={handleSaveProfile}
            onLoadPreset={handleLoadPreset}
          />
        )}
      </main>

      {/* 3. MODALS */}
      {/* Opportunity Detail Modal */}
      {selectedOpportunity && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          match={matches[selectedOpportunity.id] || null}
          isSaved={savedIds.includes(selectedOpportunity.id)}
          onClose={() => setSelectedOpportunity(null)}
          onToggleSave={handleToggleSave}
          onApply={handleApply}
          isApplied={trackerItems[selectedOpportunity.id]?.status === 'Applied'}
          profile={profile}
        />
      )}

      {/* AI Match Breakdown Modal */}
      {aiMatchModalOpp && (
        <AIMatchModal
          opportunity={aiMatchModalOpp}
          match={matches[aiMatchModalOpp.id] || null}
          profile={profile}
          onClose={() => setAiMatchModalOpp(null)}
          onViewFullOpportunity={(opp) => {
            setAiMatchModalOpp(null);
            setSelectedOpportunity(opp);
          }}
        />
      )}

      {/* 4. TOAST FEEDBACK NOTIFICATIONS */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* 5. FOOTER */}
      <Footer onNavigate={setCurrentTab} />

      {/* 6. CANDIDATE AI ASSISTANT (CareerBot) */}
      <AIChatbot
        role="candidate"
        contextData={{
          candidateName: profile.fullName,
          skills: profile.technicalSkills,
          interests: profile.interests,
          opportunitiesCount: opportunities.length,
          opportunities: opportunities.map(o => ({
            id: o.id,
            title: o.title,
            company: o.company,
            type: o.type,
            location: o.location,
            stipendSalary: o.stipendSalary,
            requiredSkills: o.requiredSkills,
          })),
        }}
      />
    </div>
  );
}
