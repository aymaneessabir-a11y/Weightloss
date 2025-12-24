import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppleMeshBackground } from './components/ui/AppleMeshBackground';
import { Navbar } from './components/ui/Navbar';
import { View, UserProfile, Phase, WeighIn, AppState } from './types';
import {
  getUserProfile,
  getPhases,
  getWeighIns,
  getAppState,
  saveUserProfile,
  savePhases,
  saveWeighIns,
  saveAppState,
  clearAllData
} from './utils/storage';
import {
  createDefaultUserProfile,
  createDefaultPhases,
  createDefaultAppState,
  createSampleWeighIns
} from './utils/mockData';
import {
  calculateRollingAverage,
  detectPlateau,
  getNextSunday
} from './utils/calculations';
import confetti from 'canvas-confetti';

// Components
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { WeighInInput } from './components/WeighInInput';
import { History } from './components/History';
import { Settings } from './components/Settings';


export default function App() {
  // State
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [weighIns, setWeighIns] = useState<WeighIn[]>([]);
  const [appState, setAppState] = useState<AppState | null>(null);

  // Initialize data from localStorage or create defaults
  useEffect(() => {
    const storedProfile = getUserProfile();
    const storedPhases = getPhases();
    const storedWeighIns = getWeighIns();
    const storedAppState = getAppState();

    if (storedProfile && storedPhases && storedAppState) {
      setUserProfile(storedProfile);
      setPhases(storedPhases);
      setWeighIns(storedWeighIns || []);
      setAppState(storedAppState);

      if (storedAppState.has_completed_onboarding) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('onboarding');
      }
    } else {
      // First time user - initialize with defaults
      const defaultProfile = createDefaultUserProfile();
      const defaultPhases = createDefaultPhases();
      const sampleData = createSampleWeighIns(defaultProfile);
      const defaultAppState = createDefaultAppState();

      // Update app state with latest sample data
      const latestWeight = sampleData.length > 0
        ? sampleData[sampleData.length - 1].weight_kg
        : defaultProfile.starting_weight_kg;
      const latestDate = sampleData.length > 0
        ? sampleData[sampleData.length - 1].date
        : new Date();
      defaultAppState.current_weight_kg = latestWeight;
      defaultAppState.last_weigh_in_date = latestDate;
      defaultAppState.has_completed_onboarding = true; // Skip onboarding for demo

      setUserProfile(defaultProfile);
      setPhases(defaultPhases);
      setWeighIns(sampleData);
      setAppState(defaultAppState);

      saveUserProfile(defaultProfile);
      savePhases(defaultPhases);
      saveWeighIns(sampleData);
      saveAppState(defaultAppState);

      setCurrentView('dashboard'); // Go straight to dashboard with sample data
    }
  }, []);

  // Auto-save on changes
  useEffect(() => {
    if (userProfile) saveUserProfile(userProfile);
  }, [userProfile]);

  useEffect(() => {
    if (phases.length > 0) savePhases(phases);
  }, [phases]);

  useEffect(() => {
    if (weighIns.length >= 0) saveWeighIns(weighIns);
  }, [weighIns]);

  useEffect(() => {
    if (appState) saveAppState(appState);
  }, [appState]);

  // Handlers
  const handleOnboardingComplete = () => {
    if (appState) {
      const updatedState = { ...appState, has_completed_onboarding: true };
      setAppState(updatedState);
      setCurrentView('weigh-in');
    }
  };

  const handleSaveWeighIn = (newWeighIn: WeighIn) => {
    const updatedWeighIns = [...weighIns, newWeighIn];
    setWeighIns(updatedWeighIns);

    // Recalculate rolling averages for all entries
    const recalculated = updatedWeighIns.map((entry, index) => {
      const previousEntries = updatedWeighIns.slice(0, index + 1);
      const avg = calculateRollingAverage(previousEntries, 4);
      return { ...entry, four_week_avg_kg: avg };
    });
    setWeighIns(recalculated);

    // Check for plateau
    const plateauDetected = detectPlateau(recalculated, 3);

    // Update app state
    if (appState && userProfile) {
      const currentPhase = phases.find(p => p.id === appState.current_phase);

      // Check if phase is complete
      let updatedPhases = [...phases];
      let nextPhaseId = appState.current_phase;

      if (currentPhase && newWeighIn.weight_kg <= currentPhase.target_weight_kg) {
        // Phase completed!
        updatedPhases = phases.map(p =>
          p.id === currentPhase.id
            ? { ...p, completed_at: new Date() }
            : p.id === currentPhase.id + 1
              ? { ...p, is_unlocked: true }
              : p
        );
        setPhases(updatedPhases);

        if (currentPhase.id < 3) {
          nextPhaseId = (currentPhase.id + 1) as 1 | 2 | 3;
        }

        // Celebrate Phase Completion
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22d3ee', '#34d399', '#f472b6']
        });
      }

      // Celebrate new lowest weight (simple check against last lowest)
      if (appState.current_weight_kg > newWeighIn.weight_kg) {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#22d3ee', '#ffffff']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#22d3ee', '#ffffff']
        });
      }

      setAppState({
        ...appState,
        current_weight_kg: newWeighIn.weight_kg,
        current_phase: nextPhaseId,
        plateau_mode: plateauDetected,
        plateau_detected_at: plateauDetected ? new Date() : undefined,
        last_weigh_in_date: newWeighIn.date,
        next_weigh_in_date: getNextSunday(newWeighIn.date),
      });
    }

    setCurrentView('dashboard');
  };

  const handleSaveSettings = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    setCurrentView('dashboard');
  };

  const handleResetData = () => {
    clearAllData();

    const defaultProfile = createDefaultUserProfile();
    const defaultPhases = createDefaultPhases();
    const defaultAppState = createDefaultAppState();

    setUserProfile(defaultProfile);
    setPhases(defaultPhases);
    setWeighIns([]);
    setAppState(defaultAppState);

    saveUserProfile(defaultProfile);
    savePhases(defaultPhases);
    saveWeighIns([]);
    saveAppState(defaultAppState);

    setCurrentView('onboarding');
  };

  // Loading state
  if (!userProfile || !appState) {
    return (
      <div className="size-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const currentPhase = phases.find(p => p.id === appState.current_phase);
  if (!currentPhase) {
    return (
      <div className="size-full flex items-center justify-center">
        <div className="text-muted-foreground">Error loading phase data</div>
      </div>
    );
  }

  const lastWeighIn = weighIns.length > 0 ? weighIns[weighIns.length - 1] : null;
  const currentPhaseWeighIns = weighIns.filter(w => w.phase_id === currentPhase.id);
  const weekNumber = currentPhaseWeighIns.length + 1;

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.02 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  } as const;

  // Render current view
  return (
    <div className="size-full bg-black text-[#f5f5f7] overflow-x-hidden relative font-['Inter'] antialiased">
      <AppleMeshBackground />
      {/* Only show Navbar if onboarding is complete */}
      {currentView !== 'onboarding' && (
        <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      )}
      <AnimatePresence mode="wait">
        {currentView === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="size-full"
          >
            <Onboarding onComplete={handleOnboardingComplete} />
          </motion.div>
        )}

        {currentView === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="size-full"
          >
            <Dashboard
              weighIns={weighIns}
              currentPhase={currentPhase}
              phases={phases}
              userProfile={userProfile}
              appState={appState}
              onWeighIn={() => setCurrentView('weigh-in')}
              onViewHistory={() => setCurrentView('history')}
              onViewSettings={() => setCurrentView('settings')}
            />
          </motion.div>
        )}

        {currentView === 'weigh-in' && (
          <motion.div
            key="weigh-in"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="size-full"
          >
            <WeighInInput
              lastWeighIn={lastWeighIn}
              currentPhase={currentPhase}
              userProfile={userProfile}
              weekNumber={weekNumber}
              onSave={handleSaveWeighIn}
              onCancel={() => setCurrentView('dashboard')}
            />
          </motion.div>
        )}

        {currentView === 'history' && (
          <motion.div
            key="history"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="size-full"
          >
            <History
              weighIns={weighIns}
              onBack={() => setCurrentView('dashboard')}
            />
          </motion.div>
        )}

        {currentView === 'settings' && (
          <motion.div
            key="settings"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="size-full"
          >
            <Settings
              userProfile={userProfile}
              onSave={handleSaveSettings}
              onBack={() => setCurrentView('dashboard')}
              onResetData={handleResetData}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}