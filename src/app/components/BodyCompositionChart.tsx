import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WeighIn } from '../types';

interface BodyCompositionChartProps {
  weighIns: WeighIn[];
  leanMass: number;
}

export function BodyCompositionChart({ weighIns, leanMass }: BodyCompositionChartProps) {
  if (weighIns.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border border-border rounded-lg bg-card">
        <p className="text-muted-foreground">No data yet</p>
      </div>
    );
  }

  // Take first, middle, and last entries (or all if less than 3)
  let displayWeighIns: WeighIn[];
  if (weighIns.length <= 3) {
    displayWeighIns = weighIns;
  } else {
    const middle = Math.floor(weighIns.length / 2);
    displayWeighIns = [
      weighIns[0],
      weighIns[middle],
      weighIns[weighIns.length - 1]
    ];
  }

  const chartData = displayWeighIns.map((entry, _index) => {
    const fatMass = entry.estimated_fat_mass_kg;

    return {
      name: `Week ${weighIns.indexOf(entry) + 1}`,
      'Fat Mass': Number(fatMass.toFixed(1)),
      'Lean Mass': Number(leanMass.toFixed(1)),
      bodyFat: entry.estimated_bf_pct.toFixed(1),
    };
  });

  return (
    <div className="space-y-4">
      <h3>Body Composition Estimate</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="name" stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
          <YAxis
            label={{ value: 'Mass (kg)', angle: -90, position: 'insideLeft', fill: 'var(--color-muted-foreground)' }}
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
            cursor={{ fill: 'var(--color-accent)', opacity: 0.1 }}
            formatter={(value: number, name: string, props: any) => {
              const bfPct = props.payload.bodyFat;
              if (name === 'Fat Mass') {
                return [`${value} kg (${bfPct}% BF)`, name];
              }
              return [`${value} kg`, name];
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar
            dataKey="Lean Mass"
            stackId="a"
            fill="var(--color-success)"
            radius={[0, 0, 4, 4]}
          />
          <Bar
            dataKey="Fat Mass"
            stackId="a"
            fill="var(--color-chart-4)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <p className="text-xs text-muted-foreground text-center">
        Estimates based on BMI formula. Update assumptions in Settings for more accuracy.
      </p>
    </div>
  );
}
