'use client'

import { useEffect, useState } from 'react'
import { ROLES, type Role } from '@/lib/constants'

interface TopbarProps {
  title:     string
  subtitle?: string
  actions?:  React.ReactNode
}

export default function Topbar({ title, subtitle, actions }: TopbarProps) {
 

 // ✅ Role via lazy init — no effect needed
const [userRole] = useState<Role>(() => {
  if (typeof window === 'undefined') return 'admin'
  return (localStorage.getItem('ceylo_role') as Role) ?? 'admin'
})

// ✅ Clock effect is fine — setState is in a callback (setInterval), not the effect body directly
const [time, setTime] = useState('')
useEffect(() => {
  const tick = () => setTime(new Date().toLocaleTimeString('en-LK', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }))
  tick()
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)
}, [])

  const rc = ROLES[userRole]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500&display=swap');
        .topbar {
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: rgba(4, 6, 13, 0.85);
          backdrop-filter: blur(20px);
          position: sticky; top: 0; z-index: 40;
          flex-shrink: 0;
        }
        .tb-left { display: flex; flex-direction: column; gap: 2px; }
        .tb-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 700; color: #e8eaf0;
        }
        .tb-sub { font-size: 11px; color: rgba(255,255,255,0.25); }
        .tb-right { display: flex; align-items: center; gap: 12px; }
        .tb-clock {
          font-size: 11px; color: rgba(255,255,255,0.25);
          letter-spacing: 1px; font-variant-numeric: tabular-nums;
          font-family: 'DM Sans', sans-serif;
        }
        .tb-badge {
          padding: 5px 14px; border-radius: 100px;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.5px; color: #fff;
          font-family: 'DM Sans', sans-serif;
        }
        .tb-notif {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer; font-size: 16px;
          transition: all 0.2s; color: rgba(255,255,255,0.4);
        }
        .tb-notif:hover {
          border-color: rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.8);
        }
      `}</style>

      <div className="topbar">
        <div className="tb-left">
          <div className="tb-title">{title}</div>
          {subtitle && <div className="tb-sub">{subtitle}</div>}
        </div>
        <div className="tb-right">
          {actions}
          <div className="tb-clock">{time}</div>
          <div
            className="tb-badge"
            style={{ background: rc.gradient, boxShadow: `0 4px 16px ${rc.glow}` }}
          >
            {rc.label}
          </div>
          <div className="tb-notif">🔔</div>
        </div>
      </div>
    </>
  )
}