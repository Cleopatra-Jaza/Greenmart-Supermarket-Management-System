import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatNumber } from '../../lib/format'
import type { SalesPoint } from '../../types'

interface SalesChartProps {
  data: SalesPoint[]
  height?: number
}

export function SalesChart({ data, height = 260 }: SalesChartProps) {
  return (
    <div className="chart" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="4 6"
            vertical={false}
            stroke="rgba(6,78,59,0.12)"
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: '#6B7F78' }}
            interval="preserveStartEnd"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={42}
            tick={{ fontSize: 12, fill: '#6B7F78' }}
            tickFormatter={(value: number) => formatNumber(value)}
          />
          <Tooltip
            cursor={{ fill: 'rgba(16,185,129,0.12)' }}
            contentStyle={{
              borderRadius: 12,
              border: '1px solid rgba(6,78,59,0.12)',
              boxShadow: '0 12px 28px rgba(6,78,59,0.14)',
              fontSize: 13,
            }}
            formatter={(value) => `${formatNumber(Number(value))} orders`}
            labelStyle={{ color: '#064E3B', fontWeight: 600, marginBottom: 4 }}
          />
          <Bar dataKey="orders" name="Orders" radius={[8, 8, 0, 0]} maxBarSize={38}>
            {data.map((entry, index) => (
              <Cell
                key={`${entry.label}-${index}`}
                fill={index === data.length - 1 ? '#064E3B' : '#10B981'}
                fillOpacity={index === data.length - 1 ? 1 : 0.75}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
