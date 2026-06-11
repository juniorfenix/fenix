import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine, Label } from "recharts";

type Props = {
  data: Array<{ logged_date: string; weight: number }>;
  goal?: number | null;
};

export default function WeightChart({ data, goal }: Props) {
  // Garante que a linha de meta apareça no domínio mesmo se ainda longe do peso atual.
  const weights = data.map((d) => d.weight);
  const min = Math.min(...weights, goal ?? Infinity) - 1;
  const max = Math.max(...weights, goal ?? -Infinity) + 1;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="logged_date" tick={{ fontSize: 10, fill: "oklch(0.66 0.012 70)" }} tickFormatter={(d) => d.slice(5)} />
        <YAxis
          tick={{ fontSize: 10, fill: "oklch(0.66 0.012 70)" }}
          domain={goal != null ? [min, max] : ["dataMin - 1", "dataMax + 1"]}
        />
        <Tooltip contentStyle={{ background: "oklch(0.20 0.006 60)", border: "1px solid oklch(0.28 0.006 60)", borderRadius: 8, fontSize: 12 }} />
        {goal != null && (
          <ReferenceLine
            y={goal}
            stroke="oklch(0.82 0.15 65)"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            strokeOpacity={0.7}
          >
            <Label
              value={`Meta ${goal}kg`}
              position="insideTopRight"
              fill="oklch(0.82 0.15 65)"
              fontSize={10}
            />
          </ReferenceLine>
        )}
        <Line type="monotone" dataKey="weight" stroke="oklch(0.72 0.18 47)" strokeWidth={2.5} dot={{ r: 3, fill: "oklch(0.82 0.15 65)" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
