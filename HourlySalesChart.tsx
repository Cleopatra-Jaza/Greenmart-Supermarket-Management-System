import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface HourlyPoint {
  label: string
  value: number
}

interface HourlySalesChartProps {
  data: HourlyPoint[]
  height?: number
}

export function HourlySalesChart({
  data,
  height = 240,
}: HourlySalesChartProps) {
  const peak = Math.max(...data.map((point) => point.value))

  return (
    <div className="chart" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: '#6B7F78' }}
            interval={1}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={36}
            tick={{ fontSize: 11, fill: '#6B7F78' }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(16,185,129,0.12)' }}
            contentStyle={{
              borderRadius: 12,
              border: '1px solid rgba(6,78,59,0.12)',
              boxShadow: '0 12px 28px rgba(6,78,59,0.14)',
              fontSize: 13,
            }}
            formatter={(value) => `${value} transactions`}
          />
          <Bar dataKey="value" name="Transactions" radius={[6, 6, 0, 0]} maxBarSize={26}>
            {data.map((entry) => (
              <Cell
                key={entry.label}
                fill={entry.value === peak ? '#064E3B' : '#34D399'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
