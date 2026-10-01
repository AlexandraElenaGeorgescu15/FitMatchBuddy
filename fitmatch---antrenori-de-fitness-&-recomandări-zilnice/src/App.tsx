/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Coach, User, UserProfile, MatchScoreResult } from './types';
import { StorageService } from './services/storage';
import { getRankedCoaches } from './services/matching';
import { Navbar } from './components/Navbar';
import { HeroLanding } from './components/HeroLanding';
import { OnboardingWizard } from './components/OnboardingWizard';
import { MatchingResults } from './components/MatchingResults';
import { UserDashboard } from './components/UserDashboard';
import { CoachCatalog } from './components/CoachCatalog';
import { AdminPanel } from './components/AdminPanel';
import { CoachDetailModal } from './components/CoachDetailModal';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { Dumbbell, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'wizard' | 'dashboard' | 'admin' | 'coaches'>('home');
  const [coaches, setCoaches] = useState<Coach[]>(StorageService.getCoaches());
  const [currentUser, setCurrentUser] = useState<User | null>(StorageService.getCurrentUser());
  const [userProfile, setUserProfile] = useState<UserProfile | null>(
    currentUser ? StorageService.getUserProfile(currentUser.id) : null
  );

  // Matching results state
  const [topMatches, setTopMatches] = useState<MatchScoreResult[] | null>(null);

  // Modals
  const [selectedCoachForModal, setSelectedCoachForModal] = useState<Coach | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectionToast, setSelectionToast] = useState<string | null>(null);

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = StorageService.subscribe(() => {
      const updatedCoaches = StorageService.getCoaches();
      const updatedUser = StorageService.getCurrentUser();
      setCoaches(updatedCoaches);
      setCurrentUser(updatedUser);
      if (updatedUser) {
        setUserProfile(StorageService.getUserProfile(updatedUser.id));
      }
    });
    return unsubscribe;
  }, []);

  // When user finishes wizard
  const handleFinishWizard = (profile: UserProfile) => {
    setUserProfile(profile);
    const ranked = getRankedCoaches(coaches, {
      goal: profile.goal,
      preferred_style: profile.preferred_style,
      budget: profile.budget,
      workout_days: profile.workout_days
    });
    setTopMatches(ranked);
    // Stay in wizard tab, but topMatches is set so it displays results
  };

  // When user selects a coach
  const handleSelectCoach = (coach: Coach) => {
    const userId = currentUser ? currentUser.id : StorageService.getCurrentUserId();
    const updated = StorageService.updateUserProfilePartial(userId, {
      matched_coach_id: coach.id
    });
    setUserProfile(updated);
    setSelectionToast(`L-ai selectat pe antrenorul ${coach.name}!`);
    setTimeout(() => setSelectionToast(null), 3500);
    setCurrentTab('dashboard');
  };

  const handleRetakeWizard = () => {
    setTopMatches(null);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 font-sans">
      
      {/* Toast alert on coach selection */}
      {selectionToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-slate-900 px-4 py-3 text-xs font-semibold text-emerald-400 shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{selectionToast}</span>
        </div>
      )}

      {/* Top Bar Navigation Contract */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'wizard') {
            // keep current results if already generated or show form
          }
        }}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {/* VIEW 1: HOME LANDING */}
        {currentTab === 'home' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <HeroLanding
              coaches={coaches}
              onStartWizard={() => {
                setTopMatches(null);
                setCurrentTab('wizard');
              }}
              onExploreCoaches={() => setCurrentTab('coaches')}
              onOpenCoachDetail={(coach) => setSelectedCoachForModal(coach)}
            />
          </div>
        )}

        {/* VIEW 2: ONBOARDING WIZARD & MATCHING RESULTS */}
        {currentTab === 'wizard' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {topMatches && topMatches.length > 0 && userProfile ? (
              <MatchingResults
                topMatches={topMatches}
                userProfile={userProfile}
                currentUser={currentUser}
                onSelectCoach={handleSelectCoach}
                onRetakeWizard={handleRetakeWizard}
                onOpenCoachDetail={(coach) => setSelectedCoachForModal(coach)}
              />
            ) : (
              <OnboardingWizard
                currentUser={currentUser}
                onFinishWizard={handleFinishWizard}
                onCancel={() => setCurrentTab('home')}
              />
            )}
          </div>
        )}

        {/* VIEW 3: USER DASHBOARD */}
        {currentTab === 'dashboard' && (
          <UserDashboard
            currentUser={currentUser}
            onNavigateToWizard={() => {
              setTopMatches(null);
              setCurrentTab('wizard');
            }}
            onNavigateToCoaches={() => setCurrentTab('coaches')}
            onOpenCoachDetail={(coach) => setSelectedCoachForModal(coach)}
          />
        )}

        {/* VIEW 4: COACHES CATALOG */}
        {currentTab === 'coaches' && (
          <CoachCatalog
            coaches={coaches}
            userProfile={userProfile}
            onSelectCoach={handleSelectCoach}
            onOpenCoachDetail={(coach) => setSelectedCoachForModal(coach)}
            onStartWizard={() => {
              setTopMatches(null);
              setCurrentTab('wizard');
            }}
          />
        )}

        {/* VIEW 5: ADMIN PANEL & N8N INTEGRATIONS */}
        {currentTab === 'admin' && (
          <AdminPanel
            onOpenCoachDetail={(coach) => setSelectedCoachForModal(coach)}
          />
        )}
      </main>

      {/* Quiet, Clean Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-[#060910] py-8 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-300">FitMatch</span>
            <span>·</span>
            <span>Platformă de antrenori personali & automatizări zilnice n8n</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentTab('wizard')}
              className="hover:text-slate-300 cursor-pointer"
            >
              Chestionar Potrivire
            </button>
            <button
              onClick={() => setCurrentTab('coaches')}
              className="hover:text-slate-300 cursor-pointer"
            >
              Catalog Antrenori
            </button>
            <button
              onClick={() => setCurrentTab('admin')}
              className="hover:text-slate-300 cursor-pointer flex items-center gap-1"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Consolă n8n & Admin</span>
            </button>
          </div>

          <div>
            © {new Date().getFullYear()} FitMatch. Toate drepturile rezervate.
          </div>
        </div>
      </footer>

      {/* Coach Detail Modal */}
      <CoachDetailModal
        coach={selectedCoachForModal}
        onClose={() => setSelectedCoachForModal(null)}
        onSelectCoach={handleSelectCoach}
        isSelected={userProfile?.matched_coach_id === selectedCoachForModal?.id}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onUserChange={(user) => {
          setCurrentUser(user);
          setUserProfile(StorageService.getUserProfile(user.id));
        }}
      />

      {/* Database / Supabase Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

    </div>
  );
}
