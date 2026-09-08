'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ROLES, NAV_ITEMS, type Role } from '@/lib/constants'

export default function Sidebar() {
 
  const router   = useRouter()
  const pathname = usePathname()

  const [userRole, setUserRole] = useState<Role>(() => {
  if (typeof window === 'undefined') return 'admin'
  return (localStorage.getItem('ceylo_role') as Role) ?? 'admin'
})

const [userName, setUserName] = useState(() => {
  if (typeof window === 'undefined') return 'Administrator'
  return localStorage.getItem('ceylo_user') ?? 'Administrator'
})
  const rc = ROLES[userRole]

  function handleLogout() {
    localStorage.clear()
    router.push('/login')
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=DM+Sans:wght@400;500;600&display=swap');

        .sidebar {
          width: 240px;
          min-height: 100vh;
          background: rgba(4, 6, 13, 0.97);
          border-right: 1px solid rgba(255,255,255,0.07);
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0; top: 0; bottom: 0;
          z-index: 50;
          backdrop-filter: blur(20px);
        }
        .sb-logo {
          padding: 28px 24px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          flex-shrink: 0;
        }
        .sb-gem {
          width: 38px; height: 38px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0; position: relative;
        }
        .sb-gem::after {
          content: '';
          position: absolute; inset: 0;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(255,255,255,0.22), transparent 60%);
        }
        .sb-name {
          font-family: 'Playfair Display', serif;
          font-weight: 900; font-size: 16px;
          background: linear-gradient(135deg, #fff 20%, rgba(255,255,255,0.5));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .sb-tag {
          font-size: 8px; letter-spacing: 2px;
          text-transform: uppercase; margin-top: 2px;
        }
        .sb-nav {
          flex: 1; padding: 16px 12px;
          overflow-y: auto;
        }
        .sb-section {
          font-size: 8px; letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          padding: 0 12px;
          margin: 16px 0 8px;
        }
        .sb-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 12px;
          cursor: pointer; transition: all 0.2s;
          text-decoration: none;
          color: rgba(255,255,255,0.4);
          font-size: 13px; font-weight: 500;
          border: 1px solid transparent;
          margin-bottom: 2px;
          font-family: 'DM Sans', sans-serif;
        }
        .sb-item:hover {
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.04);
        }
        .sb-item.active { color: #fff; }
        .sb-icon {
          font-size: 14px; width: 18px;
          text-align: center; flex-shrink: 0;
        }
        .sb-footer {
          padding: 16px 12px;
          border-top: 1px solid rgba(255,255,255,0.07);
          flex-shrink: 0;
        }
        .sb-user {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.07);
          margin-bottom: 8px;
        }
        .sb-avatar {
          width: 32px; height: 32px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 14px; font-weight: 700;
          color: #fff; flex-shrink: 0;
        }
        .sb-uname {
          font-size: 12px; font-weight: 600;
          color: rgba(255,255,255,0.9);
        }
        .sb-urole { font-size: 10px; color: rgba(255,255,255,0.25); }
        .sb-logout {
          width: 100%; padding: 8px; border-radius: 10px;
          border: 1px solid rgba(239,68,68,0.2);
          background: rgba(239,68,68,0.06);
          color: rgba(239,68,68,0.6);
          font-size: 11px; font-family: 'DM Sans', sans-serif;
          letter-spacing: 1px; text-transform: uppercase;
          cursor: pointer; transition: all 0.2s; font-weight: 500;
        }
        .sb-logout:hover {
          background: rgba(239,68,68,0.12);
          color: #f87171;
          border-color: rgba(239,68,68,0.3);
        }
      `}</style>

      <aside className="sidebar">
        <div className="sb-logo">
          <div
            className="sb-gem"
            style={{ background: rc.gradient, boxShadow: `0 4px 16px ${rc.glow}` }}
          >
            ⚙️
          </div>
          <div>
            <div className="sb-name">CeyloFieldOps</div>
            <div className="sb-tag" style={{ color: rc.color }}>Field Service AI</div>
          </div>
        </div>

        <nav className="sb-nav">
          <div className="sb-section">Main Menu</div>
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <a
                key={item.href}
                className={'sb-item' + (isActive ? ' active' : '')}
                href={item.href}
                style={isActive ? {
                  background: rc.color + '18',
                  borderColor: rc.color + '44',
                  color: rc.color,
                } : {}}
              >
                <span className="sb-icon">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            )
          })}

          <div className="sb-section">Tools</div>
          {NAV_ITEMS.slice(5).map((item) => {
            const isActive = pathname === item.href
            return (
              <a
                key={item.href}
                className={'sb-item' + (isActive ? ' active' : '')}
                href={item.href}
                style={isActive ? {
                  background: rc.color + '18',
                  borderColor: rc.color + '44',
                  color: rc.color,
                } : {}}
              >
                <span className="sb-icon">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            )
          })}
        </nav>

        <div className="sb-footer">
          <div className="sb-user">
            <div
              className="sb-avatar"
              style={{ background: rc.gradient }}
            >
              {rc.glyph}
            </div>
            <div>
              <div className="sb-uname">{userName}</div>
              <div className="sb-urole">{rc.label}</div>
            </div>
          </div>
          <button className="sb-logout" onClick={handleLogout}>
            ← Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}