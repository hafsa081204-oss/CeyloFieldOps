'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

type Stats = { jobs: number; workers: number; pending: number; completed: number }

function StatCard({ icon, label, value, change, changeUp, bg }: {
  icon: string; label: string; value: number; change: string; changeUp: boolean; bg: string
}) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: 12, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
          {icon}
        </div>
        <span style={{
          background: changeUp ? '#D1FAE5' : '#FDECEA',
          color: changeUp ? '#065F46' : '#C0392B',
          fontSize: 12, padding: '4px 10px', borderRadius: 20, fontFamily: 'Jost', fontWeight: 500,
        }}>
          {change}
        </span>
      </div>
      <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 48, fontWeight: 400, color: '#1C1C1A', lineHeight: 1, marginBottom: 6 }}>
        {value}
      </div>
      <div style={{ fontSize: 14, color: '#6B6860', fontFamily: 'Jost' }}>{label}</div>
    </div>
  )
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats>({ jobs: 0, workers: 0, pending: 0, completed: 0 })

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {})
  }, [])

  return (
    <div style={{ fontFamily: 'Jost' }}>
      {/* Welcome */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 14, color: '#A8A49C', marginBottom: 4 }}>Good day,</div>
        <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 36, fontWeight: 400, color: '#1C1C1A' }}>
          {session?.user?.name}
        </div>
        <div style={{ fontSize: 14, color: '#6B6860', marginTop: 4 }}>
          Here's what's happening with your field operations today.
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 28 }}>
        <StatCard icon="📋" label="Total Jobs" value={stats.jobs} change="+12%" changeUp={true} bg="#F0EDF6" />
        <StatCard icon="👷" label="Active Workers" value={stats.workers} change="All active" changeUp={true} bg="#D1FAE5" />
        <StatCard icon="⏳" label="Pending Assignment" value={stats.pending} change="Need action" changeUp={false} bg="#FEF3CD" />
        <StatCard icon="✅" label="Jobs Completed" value={stats.completed} change="Great work!" changeUp={true} bg="#D1FAE5" />
      </div>

      {/* System Status */}
      <div style={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: 12, padding: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1C1C1A', marginBottom: 16 }}>System Status</div>
        <div style={{ display: 'flex', gap: 32 }}>
          {[
            { label: 'Database', status: 'Online', ok: true },
            { label: 'Authentication', status: 'Online', ok: true },
            { label: 'Map Engine', status: 'Active', ok: true },
            { label: 'AI Assignment', status: 'Ready', ok: true },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.ok ? '#27AE60' : '#E74C3C' }} />
              <span style={{ fontSize: 14, color: '#6B6860' }}>{s.label}</span>
              <span style={{ fontSize: 13, color: '#27AE60', fontWeight: 500 }}>{s.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}