import { WeighIn, Phase, UserProfile, AppState } from '../types';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { TiltCard } from './ui/TiltCard';
import { Progress } from './ui/progress';
import { WeightGraph } from './WeightGraph';
import { BodyCompositionChart } from './BodyCompositionChart';

import { calculatePhaseProgress, calculateProjection, formatDateRange } from '../utils/calculations';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Activity, Target, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

interface DashboardProps {
  weighIns: WeighIn[];
  currentPhase: Phase;
  phases: Phase[];
  userProfile: UserProfile;
  appState: AppState;
  onWeighIn: () => void;
  onViewHistory: () => void;
  onViewSettings: () => void;
}

export function Dashboard({
  weighIns,
  currentPhase,
  phases,
  userProfile,
  appState,
  onWeighIn,
  onViewHistory,
  onViewSettings,
}: DashboardProps) {
  const [showDetailedGraph, setShowDetailedGraph] = useState(true);

  const lastWeighIn = weighIns.length > 0 ? weighIns[weighIns.length - 1] : null;
  const currentWeight = lastWeighIn?.weight_kg || userProfile.starting_weight_kg;
  const weekNumber = weighIns.filter(w => w.phase_id === currentPhase.id).length + 1;

  const phaseStartWeight = currentPhase.id === 1
    ? userProfile.starting_weight_kg
    : phases[currentPhase.id - 2].target_weight_kg;

  const progress = calculatePhaseProgress(
    currentWeight,
    phaseStartWeight,
    currentPhase.target_weight_kg
  );

  const projection = calculateProjection(
    currentWeight,
    currentPhase.target_weight_kg,
    currentPhase,
    weighIns.filter(w => w.phase_id === currentPhase.id)
  );

  const remaining = Math.max(0, currentWeight - currentPhase.target_weight_kg);
  const weeklyChange = lastWeighIn?.weekly_delta_kg || 0;

  // Calculate 4-week trend
  const recentWeighIns = weighIns.slice(-4);
  const fourWeekTrend = recentWeighIns.length >= 2
    ? recentWeighIns[0].weight_kg - recentWeighIns[recentWeighIns.length - 1].weight_kg
    : 0;

  // Get next Sunday
  const nextSunday = appState.next_weigh_in_date;
  const canWeighIn = new Date().getDay() === 0; // Sunday

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with Glass Effect */}
      <div className="sticky top-0 z-10 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Phase {currentPhase.id}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-accent font-medium">{currentPhase.name}</span>
                <span className="text-muted-foreground text-sm">•</span>
                <span className="text-muted-foreground text-sm">Week {weekNumber}</span>
              </div>
            </div>
            <Button onClick={onViewSettings} variant="ghost" size="sm" className="hover:bg-white/5">
              Settings
            </Button>
          </div>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8"
      >
        {/* Hero Section: Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={item} className="col-span-1 md:col-span-2 lg:col-span-2">
            <div className="h-full perspective-1000">
              <TiltCard variant="neo" className="h-full p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors duration-500" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <Activity className="w-4 h-4" />
                    <span>Current Weight</span>
                  </div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-6xl font-bold tracking-tighter text-foreground">
                      <CountUp
                        end={currentWeight}
                        decimals={1}
                        duration={2.5}
                        useEasing={true}
                      />
                    </span>
                    <span className="text-xl text-muted-foreground">kg</span>
                  </div>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-accent">{progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={progress} className="h-2 bg-muted/50" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Target</div>
                      <div className="font-medium">{currentPhase.target_weight_kg} kg</div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <TiltCard variant="glass" className="h-full p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Target className="w-4 h-4" />
                  <span>Remaining</span>
                </div>
                <div className="text-3xl font-bold">
                  <CountUp end={remaining} decimals={1} duration={2} /> kg
                </div>
              </div>
              <div className="text-sm text-muted-foreground mt-4">
                to reach Phase {currentPhase.id} goal
              </div>
            </TiltCard>
          </motion.div>

          <motion.div variants={item}>
            <TiltCard variant="glass" className="h-full p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Next Weigh-In</span>
                </div>
                <div className="text-3xl font-bold">
                  {nextSunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <Button
                onClick={onWeighIn}
                className={`w-full ${canWeighIn ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : 'opacity-50'}`}
                disabled={!canWeighIn}
              >
                {canWeighIn ? 'Log Weight' : 'Sunday Only'}
              </Button>
            </TiltCard>
          </motion.div>
        </div>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Main Chart - Spans 4 columns */}
          <motion.div variants={item} className="col-span-1 md:col-span-4 min-h-[400px]">
            <TiltCard variant="glass" className="h-full p-6">
              <button
                onClick={() => setShowDetailedGraph(!showDetailedGraph)}
                className="w-full flex items-center justify-between mb-6 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg text-accent group-hover:bg-accent/20 transition-colors">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-semibold">Weight Trajectory</h2>
                </div>
                {showDetailedGraph ? <ChevronUp className="text-muted-foreground" /> : <ChevronDown className="text-muted-foreground" />}
              </button>

              {showDetailedGraph && (
                <div className="h-[350px]">
                  <WeightGraph
                    weighIns={weighIns}
                    currentPhase={currentPhase}
                    startingWeight={phaseStartWeight}
                  />
                </div>
              )}
            </TiltCard>
          </motion.div>

          {/* Side Stats - Column of 2 items spanning 2 columns */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <motion.div variants={item}>
              <Card variant="glass" className="p-6">
                <div className="text-muted-foreground mb-1">This Week</div>
                <div className={`text-2xl font-bold flex items-center gap-2 ${weeklyChange < 0 ? 'text-success' : weeklyChange > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {weeklyChange !== 0 && (weeklyChange > 0 ? '+' : '')}
                  {weeklyChange.toFixed(1)} kg
                  {weeklyChange < 0 && <span className="text-xs bg-success/10 px-2 py-0.5 rounded-full text-success">Great!</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  vs last week ({lastWeighIn?.weight_kg.toFixed(1)} kg)
                </p>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card variant="glass" className="p-6">
                <div className="text-muted-foreground mb-1">4-Week Trend</div>
                <div className="text-2xl font-bold mb-1">
                  {fourWeekTrend > 0 ? '-' : fourWeekTrend < 0 ? '+' : ''}
                  {Math.abs(fourWeekTrend).toFixed(1)} kg
                </div>
                <p className="text-xs text-muted-foreground">
                  Total change over last 4 weeks
                </p>
              </Card>
            </motion.div>

            <motion.div variants={item} className="flex-1">
              <Card variant="glass" className="p-6 h-full flex flex-col justify-center">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Composition</h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Est.</span>
                </div>
                <BodyCompositionChart
                  weighIns={weighIns}
                  leanMass={userProfile.lean_mass_kg}
                />
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section: Projections & Plateau */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div variants={item} className="col-span-1 md:col-span-2">
            <Card variant="glass" className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-accent" />
                AI Projections
              </h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Estimated Completion</div>
                  <div className="text-xl font-medium text-foreground">
                    {formatDateRange(projection.completion_date_min, projection.completion_date_max)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Time Remaining</div>
                  <div className="text-xl font-medium text-foreground">
                    {projection.weeks_min}–{projection.weeks_max} weeks
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
                Based on your current average loss rate. Adjusts automatically as you log data.
              </div>
            </Card>
          </motion.div>

          {appState.plateau_mode && (
            <motion.div variants={item} className="col-span-1">
              <Card variant="default" className="p-6 bg-accent/10 border-accent/20 h-full">
                <h3 className="font-semibold text-accent mb-2">Weight Stabilized?</h3>
                <p className="text-sm text-muted-foreground">
                  Don't worry. Trends &gt; Daily fluctuation. Your 4-week average is the source of truth.
                </p>
              </Card>
            </motion.div>
          )}
        </div>

        <motion.div variants={item} className="text-center pt-8">
          <Button onClick={onViewHistory} variant="ghost" className="text-muted-foreground hover:text-foreground">
            View Full History →
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}