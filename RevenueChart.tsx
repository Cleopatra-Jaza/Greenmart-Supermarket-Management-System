import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCompact, formatLKR } from '../../lib/format'
import type { SalesPoint } from '../../types'

interface RevenueChartProps {
  data: SalesPoint[]
  height?: number
  showOrders?: boolean
}

export function RevenueChart({
  data,
  height = 300,
  showOrders = false,
}: RevenueChartProps) {
  return (
    <div className="chart" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.55} />
              <stop offset="55%" stopColor="#047857" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#064E3B" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            width={62}
            tick={{ fontSize: 12, fill: '#6B7F78' }}
            tickFormatter={(value: number) => `LKR ${formatCompact(value)}`}
          />
          <Tooltip
            cursor={{ stroke: '#10B981', strokeDasharray: '4 4' }}
            contentStyle={{
              borderRadius: 12,
              border: '1px solid rgba(6,78,59,0.12)',
              boxShadow: '0 12px 28px rgba(6,78,59,0.14)',
              fontSize: 13,
            }}
            formatter={(value) => formatLKR(Number(value))}
            labelStyle={{ color: '#064E3B', fontWeight: 600, marginBottom: 4 }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#047857"
            strokeWidth={2.5}
            fill="url(#revenueGradient)"
            activeDot={{ r: 5, fill: '#064E3B', stroke: '#fff', strokeWidth: 2 }}
          />
          {showOrders ? (
            <Area
              type="monotone"
              dataKey="orders"
              name="Orders"
              stroke="#10B981"
              strokeWidth={2}
              strokeDasharray="5 4"
              fill="none"
            />
          ) : null}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
