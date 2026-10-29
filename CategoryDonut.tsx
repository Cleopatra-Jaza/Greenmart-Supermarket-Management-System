import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatLKR } from '../../lib/format'
import type { CategoryShare } from '../../types'

interface CategoryDonutProps {
  data: CategoryShare[]
  height?: number
  totalLabel?: string
}

export function CategoryDonut({
  data,
  height = 280,
  totalLabel = 'Revenue',
}: CategoryDonutProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="donut" style={{ minHeight: height }}>
      <div className="donut__chart">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="58%"
              outerRadius="88%"
              paddingAngle={2}
              stroke="#ffffff"
              strokeWidth={3}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid rgba(6,78,59,0.12)',
                boxShadow: '0 12px 28px rgba(6,78,59,0.14)',
                fontSize: 13,
              }}
              formatter={(value) => formatLKR(Number(value))}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="donut__center">
          <span className="donut__total">{formatLKR(total)}</span>
          <span className="donut__caption">{totalLabel}</span>
        </div>
      </div>
      <ul className="donut__legend">
        {data.map((entry) => (
          <li key={entry.name} className="donut__legend-item">
            <span
              className="donut__swatch"
              style={{ backgroundColor: entry.color }}
              aria-hidden="true"
            />
            <span className="donut__legend-name">{entry.name}</span>
            <span className="donut__legend-value">
              {((entry.value / total) * 100).toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
