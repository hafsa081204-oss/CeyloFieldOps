'use client'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import Link from 'next/link'

const allNav = [
  { label: 'Overview', path: '/dashboard', icon: '📊', roles: ['ADMIN', 'HR_MANAGER', 'CLIENT', 'FIELD_WORKER'] },
  { label: 'Jobs', path: '/dashboard/jobs', icon: '📋', roles: ['ADMIN', 'HR_MANAGER', 'CLIENT', 'FIELD_WORKER'] },
  { label: 'Workers', path: '/dashboard/workers', icon: '👷', roles: ['ADMIN', 'HR_MANAGER'] },
  { label: 'Live Map', path: '/dashboard/map', icon: '🗺️', roles: ['ADMIN', 'HR_MANAGER'] },
  { label: 'Reports', path: '/dashboard/reports', icon: '📈', roles: ['ADMIN', 'HR_MANAGER'] },
  { label: 'Payments', path: '/dashboard/payments', icon: '💳', roles: ['ADMIN', 'HR_MANAGER', 'CLIENT'] },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const role = session?.user?.role || ''
  const nav = allNav.filter(item => item.roles.includes(role))

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  if (status === 'loading') return (
    <div style={{ minHeight: '100vh', background: '#F6F4F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#2C4A3E', fontFamily: 'Jost', fontSize: 16 }}>Loading...</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F6F4F0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Jost:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .navlink {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          color: #ffffff77;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          border-left: 3px solid transparent;
          font-family: Jost;
          font-weight: 400;
          width: 100%;
        }
        .navlink:hover { color: #fff; background: #ffffff10; text-decoration: none; }
        .navlink.active { color: #fff; background: #ffffff15; border-left-color: #B8964E; text-decoration: none; }
        .nav-icon {
          width: 32px; height: 32px; background: #ffffff12;
          border-radius: 8px; display: flex; align-items: center;
          justify-content: center; font-size: 14px; flex-shrink: 0;
        }
        .navlink.active .nav-icon { background: #B8964E; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #E4E0D8; border-radius: 2px; }
      `}</style>

      {/* Sidebar */}
      <aside style={{
        width: 260, background: '#2C4A3E',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', height: '100vh', zIndex: 10, top: 0, left: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px 22px', borderBottom: '1px solid #ffffff12' }}>
          <div style={{ color: '#fff', fontFamily: 'Cormorant Garamond', fontSize: 26, fontWeight: 400 }}>
            Ceylo<span style={{ color: '#B8964E' }}>Field</span>Ops
          </div>
          <div style={{ color: '#ffffff44', fontSize: 10, letterSpacing: '0.25em', marginTop: 4, fontFamily: 'Jost' }}>
            FIELD SERVICE MANAGEMENT
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, paddingTop: 16, overflowY: 'auto' }}>
          <div style={{ color: '#ffffff33', fontSize: 10, letterSpacing: '0.25em', padding: '14px 24px 6px', fontFamily: 'Jost', fontWeight: 600 }}>
            MAIN MENU
          </div>
          {nav.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`navlink ${pathname === item.path ? 'active' : ''}`}
            >
              <div className="nav-icon">{item.icon}</div>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid #ffffff12' }}>
          <div style={{ color: '#B8964E', fontSize: 11, letterSpacing: '0.15em', marginBottom: 4, fontFamily: 'Jost', fontWeight: 600 }}>
            {session?.user?.role?.replace(/_/g, ' ')}
          </div>
          <div style={{ color: '#fff', fontSize: 14, marginBottom: 14, fontFamily: 'Jost' }}>
            {session?.user?.name}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{
              background: 'none', border: '1px solid #ffffff22',
              color: '#ffffff77', padding: '9px 16px', fontSize: 13,
              letterSpacing: '0.08em', cursor: 'pointer', width: '100%',
              fontFamily: 'Jost', borderRadius: 6, transition: 'all 0.2s',
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Topbar */}
        <div style={{
          background: '#fff', borderBottom: '1px solid #E4E0D8',
          padding: '0 40px', height: 68,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div>
            <div style={{ color: '#A8A49C', fontSize: 11, letterSpacing: '0.2em', fontFamily: 'Jost', fontWeight: 600 }}>
              {nav.find(n => n.path === pathname)?.label?.toUpperCase() || 'OVERVIEW'}
            </div>
            <div style={{ color: '#1C1C1A', fontFamily: 'Cormorant Garamond', fontSize: 24, fontWeight: 400 }}>
              {nav.find(n => n.path === pathname)?.label || 'Dashboard'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ background: '#D1FAE5', color: '#065F46', fontSize: 13, padding: '6px 16px', borderRadius: 20, fontFamily: 'Jost', fontWeight: 500 }}>
              🟢 System Online
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: '#2C4A3E', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Cormorant Garamond', fontSize: 18,
            }}>
              {session?.user?.name?.[0]}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}