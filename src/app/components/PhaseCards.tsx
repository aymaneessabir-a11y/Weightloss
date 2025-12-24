import { Phase } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Lock } from 'lucide-react';

interface PhaseCardsProps {
  phases: Phase[];
  currentPhaseId: number;
  onPhaseSelect: (phase: Phase) => void;
}

export function PhaseCards({ phases, currentPhaseId, onPhaseSelect }: PhaseCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {phases.map((phase) => {
        const isActive = phase.id === currentPhaseId;
        const isLocked = !phase.is_unlocked;
        const isCompleted = !!phase.completed_at;

        return (
          <Card
            key={phase.id}
            className={`p-6 transition-all ${
              isActive
                ? 'border-accent bg-accent/5'
                : isLocked
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:border-accent/50'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3>Phase {phase.id}</h3>
                  <p className="text-muted-foreground">{phase.name}</p>
                </div>
                {isLocked && <Lock className="w-5 h-5 text-muted-foreground" />}
                {isCompleted && !isActive && (
                  <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                    <svg className="w-4 h-4 text-success-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Body Fat</span>
                  <span>{phase.start_bf_pct}% → {phase.end_bf_pct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target</span>
                  <span>{phase.target_weight_kg} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{phase.estimated_duration_weeks_min}–{phase.estimated_duration_weeks_max} weeks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pace</span>
                  <span>{phase.weekly_loss_min_kg}–{phase.weekly_loss_max_kg} kg/week</span>
                </div>
              </div>

              {isActive && (
                <div className="pt-2">
                  <div className="text-sm bg-accent/20 text-accent-foreground px-3 py-1 rounded-md text-center">
                    Active Phase
                  </div>
                </div>
              )}

              {isLocked && (
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground text-center">
                    Unlocks at {phase.target_weight_kg} kg
                  </p>
                </div>
              )}

              {!isActive && !isLocked && (
                <Button
                  onClick={() => onPhaseSelect(phase)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  View Details
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
