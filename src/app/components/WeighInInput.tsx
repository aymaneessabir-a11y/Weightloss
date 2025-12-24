import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { PhotoUpload } from './ui/PhotoUpload';
import { savePhoto, getPhoto } from '../utils/photoStorage';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { WeighIn, Phase, UserProfile } from '../types';
import { calculateBodyFatPct, calculateComposition, calculateWeeklyDelta } from '../utils/calculations';
import { generateMockInsight } from '../utils/mockData';

interface WeighInInputProps {
  lastWeighIn: WeighIn | null;
  currentPhase: Phase;
  userProfile: UserProfile;
  weekNumber: number;
  onSave: (weighIn: WeighIn) => void;
  onCancel: () => void;
}

export function WeighInInput({
  lastWeighIn,
  currentPhase,
  userProfile,
  weekNumber,
  onSave,
  onCancel
}: WeighInInputProps) {
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [showInsight, setShowInsight] = useState(false);
  const [currentInsight, setCurrentInsight] = useState('');

  const isSunday = new Date().getDay() === 0;

  const handleSave = async () => {
    const weightKg = parseFloat(weight);
    if (isNaN(weightKg) || weightKg <= 0) {
      alert('Please enter a valid weight');
      return;
    }

    if (isSunday && photo) {
      const todayString = new Date().toISOString().split('T')[0];
      await savePhoto(todayString, photo);
    }

    const weeklyDelta = calculateWeeklyDelta(weightKg, lastWeighIn?.weight_kg || null);
    const estimatedBfPct = calculateBodyFatPct(weightKg, userProfile.height_cm, userProfile.age);
    const { fat_mass_kg } = calculateComposition(weightKg, estimatedBfPct);

    // Mock 4-week average (simplified for first entry)
    const fourWeekAvg = lastWeighIn?.four_week_avg_kg || weightKg;

    // Calculate trend for insight
    const fourWeekTrend = lastWeighIn ? (lastWeighIn.weight_kg - weightKg) : 0;

    const aiInsight = generateMockInsight(weeklyDelta, fourWeekTrend, currentPhase, weightKg);

    const newWeighIn: WeighIn = {
      id: `weighin-${Date.now()}`,
      date: new Date(),
      weight_kg: weightKg,
      phase_id: currentPhase.id,
      weekly_delta_kg: weeklyDelta,
      four_week_avg_kg: fourWeekAvg,
      estimated_bf_pct: estimatedBfPct,
      estimated_fat_mass_kg: fat_mass_kg,
      notes,
      ai_insight: aiInsight,
      is_edited: false,
      created_at: new Date(),
    };

    setCurrentInsight(aiInsight);
    setShowInsight(true);

    // Save after showing insight
    setTimeout(() => {
      onSave(newWeighIn);
    }, 100);
  };

  if (showInsight) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success flex items-center justify-center">
              <svg className="w-8 h-8 text-success-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2>Logged: {weight} kg</h2>
          </div>

          <div className="space-y-4">
            <h3>This Week's Insight</h3>
            <p className="text-muted-foreground leading-relaxed">
              {currentInsight}
            </p>
          </div>

          <Button onClick={() => onCancel()} className="w-full bg-accent hover:bg-accent/90">
            View Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 space-y-6">
        <div className="space-y-2">
          <h1>Week {weekNumber} Weigh-In</h1>
          {lastWeighIn && (
            <p className="text-muted-foreground">
              Last week: {lastWeighIn.weight_kg.toFixed(1)} kg
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="Enter your weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="text-3xl h-16 text-center bg-input-background"
              autoFocus
            />
          </div>

          {isSunday && (
            <div className="space-y-2">
              <PhotoUpload
                onPhotoSelected={setPhoto}
                currentPhoto={photo}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Optional: Add a note</Label>
            <Textarea
              id="notes"
              placeholder="Sleep quality, stress levels, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-input-background"
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={onCancel} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={() => void handleSave()} className="flex-1 bg-accent hover:bg-accent/90">
            Save Weigh-In
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          You have 24 hours to edit this entry
        </p>
      </Card>
    </div>
  );
}
