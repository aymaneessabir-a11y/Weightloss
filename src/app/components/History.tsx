import { useState, useEffect } from 'react';
import { WeighIn } from '../types';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft, ImageIcon, Trash2 } from 'lucide-react';
import { getSubscribedPhotoDates, getPhoto, deletePhoto } from '../utils/photoStorage';

interface HistoryProps {
  weighIns: WeighIn[];
  onBack: () => void;
}

export function History({ weighIns, onBack }: HistoryProps) {
  const [photoDates, setPhotoDates] = useState<string[]>([]);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    getSubscribedPhotoDates().then(setPhotoDates);
  }, []);

  const handleExport = () => {
    // Create CSV content
    const headers = ['Date', 'Weight (kg)', 'Weekly Change (kg)', 'Body Fat %', 'Notes'];
    const rows = weighIns.map(w => [
      w.date.toLocaleDateString(),
      w.weight_kg.toFixed(1),
      w.weekly_delta_kg.toFixed(1),
      w.estimated_bf_pct.toFixed(1),
      w.notes || ''
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weight-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold">History</h1>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowGallery(!showGallery)}
              variant="outline"
              size="sm"
              className={showGallery ? "bg-accent/20 border-accent/50 text-accent" : ""}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              {showGallery ? 'List View' : 'Gallery'}
            </Button>
            <Button onClick={handleExport} variant="outline" size="sm">
              Export CSV
            </Button>
          </div>
        </div>

        {showGallery ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photoDates.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No progress photos yet. Log one next Sunday!
              </div>
            ) : (
              photoDates.map(date => (
                <HistoryPhoto key={date} date={date} onDelete={() => setPhotoDates(prev => prev.filter(d => d !== date))} />
              ))
            )}
          </div>
        ) : (
          <WeighInList weighIns={weighIns} />
        )}
      </div>
    </div>
  );
}

function HistoryPhoto({ date, onDelete }: { date: string, onDelete: () => void }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    getPhoto(date).then(file => {
      if (file) {
        setImageUrl(URL.createObjectURL(file));
      }
    });
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [date]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this photo?')) {
      await deletePhoto(date);
      onDelete();
    }
  };

  if (!imageUrl) return <div className="aspect-[3/4] bg-white/5 animate-pulse rounded-xl" />;

  return (
    <div className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10 shadow-lg cursor-pointer">
      <img src={imageUrl} alt={date} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
        <div className="flex justify-between items-end">
          <span className="font-medium text-white">
            {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
          <button onClick={handleDelete} className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function WeighInList({ weighIns }: { weighIns: WeighIn[] }) {
  if (weighIns.length === 0) {
    return (
      <Card className="p-8 text-center bg-white/5 border-white/10">
        <p className="text-muted-foreground">No weigh-ins recorded yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {[...weighIns].reverse().map((weighIn) => (
        <Card key={weighIn.id} variant="glass" className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-baseline gap-4">
                <div>
                  <div className="text-muted-foreground">
                    {weighIn.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="text-3xl tabular-nums mt-1 font-semibold text-white">
                    {weighIn.weight_kg.toFixed(1)} kg
                  </div>
                </div>

                {weighIn.weekly_delta_kg !== 0 && (
                  <div className="text-xl tabular-nums">
                    <span className={weighIn.weekly_delta_kg < 0 ? 'text-emerald-400' : 'text-muted-foreground'}>
                      {weighIn.weekly_delta_kg > 0 ? '+' : ''}
                      {weighIn.weekly_delta_kg.toFixed(1)} kg
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                <div>
                  <span className="text-muted-foreground">Body Fat:</span>{' '}
                  <span className="tabular-nums text-white/80">{weighIn.estimated_bf_pct.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">4-Week Avg:</span>{' '}
                  <span className="tabular-nums text-white/80">{weighIn.four_week_avg_kg.toFixed(1)} kg</span>
                </div>
              </div>

              {weighIn.ai_insight && (
                <div className="mt-3 p-3 bg-white/5 border border-white/5 rounded-md">
                  <p className="text-sm text-muted-foreground">{weighIn.ai_insight}</p>
                </div>
              )}

              {weighIn.notes && (
                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground">Note:</span> {weighIn.notes}
                </div>
              )}
            </div>

            <div className="ml-4">
              <div className="text-xs text-muted-foreground px-2 py-1 bg-white/5 rounded-full">
                Phase {weighIn.phase_id}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
