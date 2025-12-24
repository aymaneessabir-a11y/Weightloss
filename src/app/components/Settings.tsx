import { useState } from 'react';
import { UserProfile } from '../types';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft } from 'lucide-react';

interface SettingsProps {
  userProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onBack: () => void;
  onResetData: () => void;
}

export function Settings({ userProfile, onSave, onBack, onResetData }: SettingsProps) {
  const [age, setAge] = useState(userProfile.age.toString());
  const [height, setHeight] = useState(userProfile.height_cm.toString());
  const [startingWeight, setStartingWeight] = useState(userProfile.starting_weight_kg.toString());
  const [startingBF, setStartingBF] = useState(userProfile.starting_body_fat_pct.toString());
  const [goalBF, setGoalBF] = useState(userProfile.goal_body_fat_pct.toString());
  const [leanMass, setLeanMass] = useState(userProfile.lean_mass_kg.toString());

  const handleSave = () => {
    const updatedProfile: UserProfile = {
      ...userProfile,
      age: parseFloat(age),
      height_cm: parseFloat(height),
      starting_weight_kg: parseFloat(startingWeight),
      starting_body_fat_pct: parseFloat(startingBF),
      goal_body_fat_pct: parseFloat(goalBF),
      lean_mass_kg: parseFloat(leanMass),
      assumptions_last_updated: new Date(),
    };

    onSave(updatedProfile);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      onResetData();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={onBack} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1>Settings & Assumptions</h1>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4">Profile Information</h2>
            <p className="text-sm text-muted-foreground mb-6">
              All calculations are based on these values. Changes will recalculate all metrics.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age (years)</Label>
                  <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="bg-input-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="bg-input-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startingWeight">Starting Weight (kg)</Label>
                  <Input
                    id="startingWeight"
                    type="number"
                    step="0.1"
                    value={startingWeight}
                    onChange={(e) => setStartingWeight(e.target.value)}
                    className="bg-input-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startingBF">Starting Body Fat (%)</Label>
                  <Input
                    id="startingBF"
                    type="number"
                    step="0.1"
                    value={startingBF}
                    onChange={(e) => setStartingBF(e.target.value)}
                    className="bg-input-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goalBF">Goal Body Fat (%)</Label>
                  <Input
                    id="goalBF"
                    type="number"
                    step="0.1"
                    value={goalBF}
                    onChange={(e) => setGoalBF(e.target.value)}
                    className="bg-input-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leanMass">Lean Mass (kg)</Label>
                  <Input
                    id="leanMass"
                    type="number"
                    step="0.1"
                    value={leanMass}
                    onChange={(e) => setLeanMass(e.target.value)}
                    className="bg-input-background"
                  />
                  <p className="text-xs text-muted-foreground">
                    Update this if you have DEXA scan data
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-xs text-muted-foreground">
                  Last updated: {userProfile.assumptions_last_updated.toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4">Calculation Methods</h2>
            
            <div className="space-y-4 text-sm">
              <div>
                <h4>Body Fat Percentage</h4>
                <p className="text-muted-foreground mt-1">
                  Estimated using BMI-based formula: BF% ≈ (1.20 × BMI) + (0.23 × age) - 16.2
                </p>
              </div>

              <div>
                <h4>Lean Mass & Fat Mass</h4>
                <p className="text-muted-foreground mt-1">
                  Fat Mass = Weight × (Body Fat % / 100)<br />
                  Lean Mass = Weight - Fat Mass
                </p>
              </div>

              <div>
                <h4>4-Week Rolling Average</h4>
                <p className="text-muted-foreground mt-1">
                  Average of the last 4 weigh-ins, used to smooth short-term fluctuations
                </p>
              </div>

              <div>
                <h4>Plateau Detection</h4>
                <p className="text-muted-foreground mt-1">
                  Triggered when weight variance is less than 0.3 kg over 3 consecutive weeks
                </p>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1 bg-accent hover:bg-accent/90">
              Save Changes
            </Button>
            <Button onClick={onBack} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>

          <Card className="p-6 border-destructive/50 bg-destructive/5">
            <h3 className="text-destructive">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-4">
              Reset all data and start fresh. This action cannot be undone.
            </p>
            <Button onClick={handleReset} variant="destructive" size="sm">
              Reset All Data
            </Button>
          </Card>

          <Card className="p-6 bg-accent/5 border-accent/30">
            <h3 className="text-accent-foreground">Testing Features</h3>
            <p className="text-sm text-muted-foreground mt-2">
              This demo includes 8 weeks of sample data. The weigh-in feature is restricted to Sundays 
              to simulate the real behavior. To test adding a new weigh-in, return to the dashboard on a Sunday.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}