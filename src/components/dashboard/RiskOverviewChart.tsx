import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { RiskOverviewCounts } from '@/types'
import { RISK_COLOR } from '@/utils/riskEngine'

export function RiskOverviewChart({ data }: { data: RiskOverviewCounts }) {
  const chartData = [
    { name: 'Critical', value: data.critical, color: RISK_COLOR.CRITICAL },
    { name: 'High', value: data.high, color: RISK_COLOR.HIGH },
    { name: 'Medium', value: data.medium, color: RISK_COLOR.MEDIUM },
    { name: 'Low', value: data.low, color: RISK_COLOR.LOW },
  ]

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1b212c" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#78829a', fontSize: 12 }} axisLine={{ stroke: '#252c39' }} tickLine={false} />
        <YAxis tick={{ fill: '#78829a', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{ background: '#10141b', border: '1px solid #252c39', borderRadius: 4, fontSize: 12 }}
          labelStyle={{ color: '#e7eaf0' }}
          cursor={{ fill: '#1b212c' }}
        />
        <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={56}>
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
