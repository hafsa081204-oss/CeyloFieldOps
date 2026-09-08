'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'

type Stats = { jobs: number; workers: number; pending: number; completed: number }

export default function ReportsPage() {
  const [stats, setStats] = useState<Stats>({ jobs: 0, workers: 0, pending: 0, completed: 0 })

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {})
  }, [])

  const barData = [
    { name: 'Jan', jobs: 8, completed: 6 },
    { name: 'Feb', jobs: 12, completed: 10 },
    { name: 'Mar', jobs: 9, completed: 7 },
    { name: 'Apr', jobs: 15, completed: 13 },
    { name: 'May', jobs: stats.jobs, completed: stats.completed },
  ]

  const Tip = ({ active, payload, label }: any) =>
    active && payload?.length ? (
      <div style={{ background: '#fff', border: '1px solid #E4E0D8', padding: '10px 14px', borderRadius: 8, fontSize: 13, fontFamily: 'Jost' }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</div>
        ))}
      </div>
    ) : null

  const metrics = [
    { label: 'Completion Rate', value: stats.jobs > 0 ? Math.round((stats.completed / stats.jobs) * 100) + '%' : '0%', icon: '📊', bg: '#D1FAE5' },
    { label: 'Avg Response Time', value: '2.4h', icon: '⚡', bg: '#FEF3CD' },
    { label: 'Worker Utilization', value: '78%', icon: '👷', bg: '#DBEAFE' },
    { label: 'Client Satisfaction', value: '4.5/5', icon: '⭐', bg: '#F3E8FF' },
  ]

  return (
    <div style={{ fontFamily: 'Jost' }}>
      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 28 }}>
        {metrics.map(m => (
          <div key={m.label} style={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: 12, padding: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14 }}>
              {m.icon}
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 36, fontWeight: 400, color: '#1C1C1A', marginBottom: 4 }}>
              {m.value}
            </div>
            <div style={{ fontSize: 14, color: '#6B6860' }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Bar Chart */}
        <div style={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#1C1C1A', marginBottom: 4 }}>Monthly Performance</div>
          <div style={{ fontSize: 13, color: '#A8A49C', marginBottom: 20 }}>Jobs created vs completed — 2026</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F2EFE9" />
              <XAxis dataKey="name" tick={{ fill: '#A8A49C', fontSize: 12, fontFamily: 'Jost' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#A8A49C', fontSize: 12, fontFamily: 'Jost' }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="jobs" fill="#2C4A3E" radius={[4, 4, 0, 0]} name="Jobs Created" />
              <Bar dataKey="completed" fill="#B8964E" radius={[4, 4, 0, 0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Worker Performance */}
        <div style={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#1C1C1A', marginBottom: 4 }}>Worker Performance</div>
          <div style={{ fontSize: 13, color: '#A8A49C', marginBottom: 20 }}>Top rated this month</div>
          {[
            { name: 'Priya Fernando', rating: 4.8, pct: 96, color: '#B8964E' },
            { name: 'Kasun Perera', rating: 4.5, pct: 90, color: '#2C4A3E' },
            { name: 'Nuwan Silva', rating: 4.2, pct: 84, color: '#2E5D8E' },
          ].map(w => (
            <div key={w.name} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#1C1C1A' }}>{w.name}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: w.color }}>★ {w.rating}</span>
              </div>
              <div style={{ background: '#F2EFE9', borderRadius: 4, height: 8 }}>
                <div style={{ background: w.color, width: `${w.pct}%`, height: '100%', borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Line Chart */}
      <div style={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: 12, padding: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1C1C1A', marginBottom: 4 }}>Job Completion Trend</div>
        <div style={{ fontSize: 13, color: '#A8A49C', marginBottom: 20 }}>Weekly overview</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F2EFE9" />
            <XAxis dataKey="name" tick={{ fill: '#A8A49C', fontSize: 12, fontFamily: 'Jost' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#A8A49C', fontSize: 12, fontFamily: 'Jost' }} axisLine={false} tickLine={false} />
            <Tooltip content={<Tip />} />
            <Line type="monotone" dataKey="jobs" stroke="#2C4A3E" strokeWidth={2.5} dot={{ fill: '#2C4A3E', r: 4 }} name="Jobs Created" />
            <Line type="monotone" dataKey="completed" stroke="#B8964E" strokeWidth={2.5} dot={{ fill: '#B8964E', r: 4 }} name="Completed" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}