import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 space-y-6">
        {step === 1 && (
          <>
            <div className="space-y-4">
              <h1>Welcome to Your Transformation System</h1>
              <p className="text-muted-foreground">
                This is a private, calm space designed to guide you from 114 kg to ~88 kg over the next 8–12 months.
              </p>
              <p className="text-muted-foreground">
                No distractions. No pressure. Just intelligent tracking and steady progress.
              </p>
            </div>
            <Button onClick={() => setStep(2)} className="w-full bg-accent hover:bg-accent/90">
              Review Your Profile
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="space-y-4">
              <h1>Your Profile</h1>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <div className="text-muted-foreground">Age</div>
                  <div>25 years</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Height</div>
                  <div>180 cm</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Starting Weight</div>
                  <div>114 kg</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Starting Body Fat</div>
                  <div>~34%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Final Goal</div>
                  <div>~88 kg</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Target Body Fat</div>
                  <div>~15%</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                All assumptions are editable in Settings.
              </p>
            </div>
            <Button onClick={() => setStep(3)} className="w-full bg-accent hover:bg-accent/90">
              Start Phase 1
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="space-y-4">
              <h1>Phase 1: Foundation</h1>
              <h3 className="text-muted-foreground">34% → 25% Body Fat</h3>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <div className="text-muted-foreground">Target</div>
                  <div>100 kg (14 kg to lose)</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Duration</div>
                  <div>14–28 weeks</div>
                </div>
                <div className="col-span-2">
                  <div className="text-muted-foreground">Pace</div>
                  <div>0.5–1.0 kg per week</div>
                </div>
              </div>

              <p className="text-muted-foreground">
                You'll weigh in every Sunday. Trends matter more than individual weigh-ins.
              </p>

              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-sm">
                <p className="text-accent-foreground">
                  <strong>Demo Mode:</strong> This application includes 8 weeks of sample data to showcase 
                  the tracking and analytics features. You can reset and start fresh in Settings.
                </p>
              </div>
            </div>
            <Button onClick={onComplete} className="w-full bg-accent hover:bg-accent/90">
              View Dashboard
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}