interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  stroke?: string
  fill?: string
}

export function Sparkline({
  data,
  width = 120,
  height = 36,
  stroke = '#10B981',
  fill = 'rgba(16,185,129,0.18)',
}: SparklineProps) {
  if (data.length < 2) return null

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const step = width / (data.length - 1)

  const points = data.map((value, index) => {
    const x = index * step
    const y = height - ((value - min) / range) * (height - 6) - 3
    return [x, y] as const
  })

  const line = points
    .map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(' ')

  const area = `${line} L${width},${height} L0,${height} Z`

  return (
    <svg
      className="sparkline"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={area} fill={fill} />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={points[points.length - 1][0]}
        cy={points[points.length - 1][1]}
        r={2.6}
        fill={stroke}
      />
    </svg>
  )
}
