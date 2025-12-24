import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import { WeighIn, Phase } from '../types';
import { calculateExpectedTrajectory } from '../utils/calculations';

interface WeightGraphProps {
  weighIns: WeighIn[];
  currentPhase: Phase;
  startingWeight: number;
}

export function WeightGraph({ weighIns, currentPhase, startingWeight }: WeightGraphProps) {
  if (weighIns.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center border border-border rounded-lg bg-card">
        <p className="text-muted-foreground">No weigh-in data yet</p>
      </div>
    );
  }

  // Prepare data for the chart
  const chartData = weighIns.map((entry, index) => {
    const weekNumber = index + 1;
    const expected = calculateExpectedTrajectory(
      startingWeight,
      currentPhase.target_weight_kg,
      currentPhase.estimated_duration_weeks_max,
      weekNumber
    );

    return {
      week: weekNumber,
      actual: entry.weight_kg,
      expected: expected,
      average: entry.four_week_avg_kg,
      upperBound: expected + 0.5,
      lowerBound: expected - 0.5,
    };
  });

  // Calculate Y-axis domain with some padding
  const allWeights = weighIns.map(w => w.weight_kg);
  const minWeight = Math.min(...allWeights, currentPhase.target_weight_kg);
  const maxWeight = Math.max(...allWeights, startingWeight);
  const yMin = Math.floor(minWeight - 2);
  const yMax = Math.ceil(maxWeight + 2);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3>Weight Progress</h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-1"></div>
            <span className="text-muted-foreground">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-2"></div>
            <span className="text-muted-foreground">4-Week Avg</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-muted"></div>
            <span className="text-muted-foreground">Expected</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey="week"
            label={{ value: 'Week', position: 'insideBottom', offset: -5, fill: 'var(--color-muted-foreground)' }}
            stroke="var(--color-muted-foreground)"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[yMin, yMax]}
            label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft', fill: 'var(--color-muted-foreground)' }}
            stroke="var(--color-muted-foreground)"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            itemStyle={{ color: 'var(--color-foreground)' }}
            formatter={(value: number) => [`${Number(value).toFixed(1)} kg`, '']}
          />

          {/* Confidence band */}
          <Area
            type="monotone"
            dataKey="upperBound"
            stroke="none"
            fill="var(--color-muted)"
            fillOpacity={0.1}
          />
          <Area
            type="monotone"
            dataKey="lowerBound"
            stroke="none"
            fill="var(--color-muted)"
            fillOpacity={0.1}
          />

          {/* Expected trajectory */}
          <Line
            type="monotone"
            dataKey="expected"
            stroke="var(--color-muted-foreground)"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
            name="Expected"
            opacity={0.5}
          />

          {/* 4-week rolling average */}
          <Line
            type="monotone"
            dataKey="average"
            stroke="var(--color-chart-2)"
            strokeWidth={2}
            dot={false}
            name="4-Week Average"
          />

          {/* Actual weight with glow */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="var(--color-chart-1)"
            strokeWidth={3}
            dot={{ fill: 'var(--color-background)', stroke: 'var(--color-chart-1)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--color-chart-1)' }}
            name="Actual Weight"
            style={{ filter: 'drop-shadow(0 0 6px var(--color-chart-1))' }}
          />

          {/* Target line */}
          <ReferenceLine
            y={currentPhase.target_weight_kg}
            stroke="var(--color-success)"
            strokeDasharray="3 3"
            label={{ value: 'Target', position: 'right', fill: 'var(--color-success)', fontSize: 12 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
