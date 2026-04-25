'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ROLES, type Role, type RoleConfig } from '@/lib/constants'

interface Particle {
  x:       number
  y:       number
  size:    number
  speed:   number
  opacity: number
}

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role>('admin')
  const [email,        setEmail]        = useState('admin@ceylofield.lk')
  const [password,     setPassword]     = useState('')
  const [loading,      setLoading]      = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const router = useRouter()
  const role   = ROLES[selectedRole]

  // ✅ Particles via lazy init — no effect needed
const [particles] = useState<Particle[]>(() =>
  Array.from({ length: 28 }, () => ({
    x:       Math.random() * 100,
    y:       Math.random() * 100,
    size:    Math.random() * 3 + 1,
    speed:   Math.random() * 20 + 15,
    opacity: Math.random() * 0.4 + 0.1,
  }))
)
// Remove the useEffect entirely
  function handleRoleSelect(r: Role) {
    setSelectedRole(r)
    setEmail(ROLES[r].email)
  }

  async function handleLogin() {
    if (!email) return
    setLoading(true)
    await new Promise<void>(resolve => setTimeout(resolve, 1000))
    localStorage.setItem('ceylo_role', selectedRole)
    localStorage.setItem('ceylo_user', ROLES[selectedRole].label)
    router.push('/dashboard')
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --ease-spring: cubic-bezier(0.34,1.56,0.64,1);
          --ease-out:    cubic-bezier(0.16,1,0.3,1);
        }
        body { background: #04060d; font-family: 'DM Sans', sans-serif; overflow: hidden; }

        .root {
          min-height: 100vh; display: flex; align-items: center;
          justify-content: center; position: relative; overflow: hidden; padding: 20px;
        }
        .bg-orb-main {
          position: fixed; width: 900px; height: 900px; border-radius: 50%;
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          filter: blur(80px); opacity: 0.18; pointer-events: none;
          transition: background 1s var(--ease-out);
          animation: orbPulse 8s ease-in-out infinite;
        }
        @keyframes orbPulse {
          0%,100% { transform: translate(-50%,-50%) scale(1);    opacity: 0.18; }
          50%      { transform: translate(-50%,-50%) scale(1.15); opacity: 0.24; }
        }
        .bg-orb-tl {
          position: fixed; top: -200px; left: -200px;
          width: 500px; height: 500px; border-radius: 50%;
          filter: blur(60px); opacity: 0.12; pointer-events: none;
          transition: background 1s;
          animation: orbDrift1 12s ease-in-out infinite alternate;
        }
        .bg-orb-br {
          position: fixed; bottom: -200px; right: -200px;
          width: 500px; height: 500px; border-radius: 50%;
          filter: blur(60px); opacity: 0.1; pointer-events: none;
          transition: background 1s;
          animation: orbDrift2 14s ease-in-out infinite alternate;
        }
        @keyframes orbDrift1 {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(60px,40px) scale(1.2); }
        }
        @keyframes orbDrift2 {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(-50px,-60px) scale(1.15); }
        }
        .particle {
          position: fixed; border-radius: 50%; pointer-events: none;
          animation: floatUp linear infinite;
        }
        @keyframes floatUp {
          from { transform: translateY(110vh) rotate(0deg); }
          to   { transform: translateY(-10vh)  rotate(360deg); }
        }
        .grain {
          position: fixed; inset: 0; pointer-events: none; opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px;
        }
        .card {
          position: relative; width: 480px; max-width: 100%;
          border-radius: 32px; overflow: hidden; z-index: 10;
          animation: cardIn 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .card::before {
          content: ''; position: absolute; inset: -1px; border-radius: 33px; padding: 1px;
          background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.12) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          pointer-events: none; z-index: 2;
        }
        .card-inner {
          position: relative; background: rgba(6,8,18,0.82);
          backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px);
          border-radius: 32px; padding: 52px 44px 44px; z-index: 1;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.04), 0 40px 100px rgba(0,0,0,0.8);
        }
        .shimmer-line {
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 60%; height: 1px; border-radius: 100px;
          transition: background 1s; z-index: 3;
        }
        .logo-row { display: flex; align-items: center; gap: 14px; margin-bottom: 42px; }
        .logo-gem {
          width: 50px; height: 50px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; flex-shrink: 0; position: relative;
          transition: background 0.8s, box-shadow 0.8s;
        }
        .logo-gem::after {
          content: ''; position: absolute; inset: 0; border-radius: 16px;
          background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%);
        }
        .logo-name {
          font-family: 'Playfair Display', serif; font-weight: 900; font-size: 22px;
          letter-spacing: -0.3px;
          background: linear-gradient(135deg, #ffffff 20%, rgba(255,255,255,0.55));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .logo-tag {
          font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase;
          margin-top: 3px; transition: color 0.8s;
        }
        .heading-area { margin-bottom: 38px; }
        .heading-eyebrow {
          font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
          margin-bottom: 10px; font-weight: 500; transition: color 0.8s;
        }
        .heading-main {
          font-family: 'Playfair Display', serif; font-size: 38px; font-weight: 900;
          line-height: 1.1; letter-spacing: -1px; color: #ffffff;
        }
        .heading-italic { font-style: italic; font-weight: 400; transition: color 0.8s; }
        .heading-sub {
          font-size: 13px; color: rgba(255,255,255,0.35);
          margin-top: 10px; font-weight: 300; line-height: 1.6;
        }
        .role-label-row {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;
        }
        .section-label {
          font-size: 9px; letter-spacing: 3px; text-transform: uppercase;
          color: rgba(255,255,255,0.25); font-weight: 500;
        }
        .roles-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; margin-bottom: 32px; }
        .role-pill {
          padding: 14px 8px 12px; border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03); cursor: pointer;
          transition: all 0.35s var(--ease-spring);
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          overflow: hidden;
        }
        .role-pill:hover { border-color: rgba(255,255,255,0.15); transform: translateY(-2px); }
        .role-pill.active { border-color: transparent; transform: translateY(-3px); }
        .role-pill-glyph {
          width: 32px; height: 32px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700;
          color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.08); transition: all 0.35s;
        }
        .role-pill.active .role-pill-glyph { background: rgba(255,255,255,0.18); color: #fff; }
        .role-pill-name {
          font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.45);
          letter-spacing: 0.3px; text-align: center; transition: color 0.3s; line-height: 1.3;
        }
        .role-pill.active .role-pill-name { color: rgba(255,255,255,0.9); }
        .fields { display: flex; flex-direction: column; gap: 14px; margin-bottom: 28px; }
        .field-block { position: relative; }
        .field-lbl {
          font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase;
          color: rgba(255,255,255,0.25); margin-bottom: 8px; font-weight: 500; transition: color 0.3s;
        }
        .field-block.focused .field-lbl { color: rgba(255,255,255,0.6); }
        .field-inp {
          width: 100%; padding: 14px 18px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; color: rgba(255,255,255,0.9);
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          font-weight: 300; outline: none; transition: all 0.3s; letter-spacing: 0.3px;
        }
        .field-inp::placeholder { color: rgba(255,255,255,0.12); }
        .submit-wrap { position: relative; margin-bottom: 24px; }
        .submit-glow {
          position: absolute; inset: -8px; border-radius: 22px; filter: blur(16px);
          opacity: 0.5; transition: opacity 0.3s, background 0.8s; pointer-events: none;
        }
        .submit-btn {
          position: relative; width: 100%; padding: 16px 24px; border: none;
          border-radius: 16px; font-family: 'DM Sans', sans-serif; font-size: 14px;
          font-weight: 600; letter-spacing: 1px; text-transform: uppercase;
          cursor: pointer; color: #fff; transition: all 0.35s var(--ease-spring);
          overflow: hidden; z-index: 1;
        }
        .submit-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 60%);
          border-radius: 16px;
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-3px) scale(1.01); }
        .submit-btn:active:not(:disabled) { transform: translateY(-1px) scale(0.99); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .loading-shimmer { display: flex; align-items: center; justify-content: center; gap: 6px; }
        .shimmer-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(255,255,255,0.8);
          animation: shimmerDot 1.2s ease-in-out infinite;
        }
        .shimmer-dot:nth-child(2) { animation-delay: 0.2s; }
        .shimmer-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes shimmerDot {
          0%,80%,100% { transform: scale(0.6); opacity: 0.3; }
          40%          { transform: scale(1.1); opacity: 1;   }
        }
        .divider-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
          margin-bottom: 20px;
        }
        .bottom-row { display: flex; align-items: center; justify-content: space-between; }
        .demo-badge {
          display: flex; align-items: center; gap: 7px; padding: 7px 12px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 100px;
        }
        .live-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #4ade80; box-shadow: 0 0 8px #4ade80;
          animation: livePulse 2s ease-in-out infinite;
        }
        @keyframes livePulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .demo-text { font-size: 10px; color: rgba(255,255,255,0.3); font-weight: 400; }
        .trust-logos { display: flex; gap: 10px; }
        .trust-chip { font-size: 9px; color: rgba(255,255,255,0.18); letter-spacing: 1px; font-weight: 500; }
        .s1 { animation: fadeSlide 0.6s 0.10s var(--ease-out) both; }
        .s2 { animation: fadeSlide 0.6s 0.18s var(--ease-out) both; }
        .s3 { animation: fadeSlide 0.6s 0.26s var(--ease-out) both; }
        .s4 { animation: fadeSlide 0.6s 0.34s var(--ease-out) both; }
        .s5 { animation: fadeSlide 0.6s 0.42s var(--ease-out) both; }
        .s6 { animation: fadeSlide 0.6s 0.50s var(--ease-out) both; }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      <div className="root">
        <div className="bg-orb-main" style={{ background: role.orb }} />
        <div className="bg-orb-tl"   style={{ background: role.gradient }} />
        <div className="bg-orb-br"   style={{ background: role.gradient }} />

        {particles.map((p, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left:            `${p.x}%`,
              bottom:          '-10px',
              width:           `${p.size}px`,
              height:          `${p.size}px`,
              background:       role.glow,
              opacity:          p.opacity,
              animationDuration:`${p.speed}s`,
              animationDelay:  `-${(p.speed * p.y) / 100}s`,
            }}
          />
        ))}

        <div className="grain" />

        <div className="card">
          <div
            className="shimmer-line"
            style={{ background: `linear-gradient(90deg, transparent, ${role.glow}, transparent)` }}
          />
          <div className="card-inner">

            {/* Logo */}
            <div className="logo-row s1">
              <div
                className="logo-gem"
                style={{ background: role.gradient, boxShadow: `0 8px 24px ${role.glow}` }}
              >
                ⚙️
              </div>
              <div>
                <div className="logo-name">CeyloFieldOps</div>
                <div className="logo-tag" style={{ color: role.color }}>AI Field Service Platform</div>
              </div>
            </div>

            {/* Heading */}
            <div className="heading-area s2">
              <div className="heading-eyebrow" style={{ color: role.color }}>
                Secure Portal Access
              </div>
              <div className="heading-main">
                Welcome<br />
                <span className="heading-italic" style={{ color: role.color }}>
                  {role.label}
                </span>
              </div>
              <div className="heading-sub">
                {role.description} — Sign in to your personalized portal
              </div>
            </div>

            {/* Role selector */}
            <div className="s3">
              <div className="role-label-row">
                <span className="section-label">Select Portal</span>
                <span className="section-label" style={{ color: role.color }}>{role.label}</span>
              </div>
              <div className="roles-grid">
                {(Object.entries(ROLES) as [Role, RoleConfig][]).map(([r, cfg]) => (
                  <button
                    key={r}
                    className={'role-pill' + (selectedRole === r ? ' active' : '')}
                    onClick={() => handleRoleSelect(r)}
                    style={selectedRole === r ? {
                      background:  cfg.gradient,
                      borderColor: 'transparent',
                      boxShadow:   `0 8px 28px ${cfg.glow}`,
                    } : {}}
                  >
                    <div className="role-pill-glyph">{cfg.glyph}</div>
                    <span className="role-pill-name">
                      {cfg.label.split(' ')[0]}<br />
                      {cfg.label.split(' ')[1] ?? ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fields */}
            <div className="fields s4">
              {(
                [
                  { key: 'email',    type: 'email',    value: email,    onChange: setEmail,    placeholder: '' },
                  { key: 'password', type: 'password', value: password, onChange: setPassword, placeholder: '••••••••' },
                ] as const
              ).map(f => (
                <div
                  key={f.key}
                  className={'field-block' + (focusedField === f.key ? ' focused' : '')}
                >
                  <div className="field-lbl">
                    {f.key === 'email' ? 'Email Address' : 'Password'}
                  </div>
                  <input
                    className="field-inp"
                    type={f.type}
                    value={f.value}
                    placeholder={f.placeholder}
                    onChange={e => f.onChange(e.target.value)}
                    onFocus={() => setFocusedField(f.key)}
                    onBlur={()  => setFocusedField(null)}
                    style={focusedField === f.key ? {
                      borderColor: role.color + '55',
                      boxShadow:   `0 0 0 3px ${role.color}18`,
                    } : {}}
                  />
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="submit-wrap s5">
              <div
                className="submit-glow"
                style={{ background: role.gradient, opacity: loading ? 0.3 : 0.5 }}
              />
              <button
                className="submit-btn"
                onClick={handleLogin}
                disabled={loading}
                style={{ background: role.gradient }}
              >
                {loading ? (
                  <div className="loading-shimmer">
                    <div className="shimmer-dot" />
                    <div className="shimmer-dot" />
                    <div className="shimmer-dot" />
                  </div>
                ) : (
                  `Access ${role.label} →`
                )}
              </button>
            </div>

            <div className="divider-line" />
            <div className="bottom-row s6">
              <div className="demo-badge">
                <div className="live-dot" />
                <span className="demo-text">Demo — any password works</span>
              </div>
              <div className="trust-logos">
                {['CEB', 'Dialog', 'SLIATE'].map(org => (
                  <span key={org} className="trust-chip">{org}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}