'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const roleCredentials: Record<string, { email: string; password: string }> = {
  ADMIN: { email: 'admin@ceylo.lk', password: 'admin123' },
  HR_MANAGER: { email: 'hr@ceylo.lk', password: 'hr123456' },
  CLIENT: { email: 'client@ceylo.lk', password: 'client123' },
  FIELD_WORKER: { email: 'worker@ceylo.lk', password: 'worker123' },
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role)
    if (role && roleCredentials[role]) {
      setEmail(roleCredentials[role].email)
      setPassword(roleCredentials[role].password)
    } else {
      setEmail('')
      setPassword('')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.error) return setError('Invalid email or password. Please try again.')
    router.push('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F6F4F0', display: 'flex', fontFamily: 'Jost, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Jost:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .inp {
          width: 100%; padding: 13px 16px;
          background: #fff; border: 1.5px solid #E4E0D8;
          border-radius: 8px; color: #1C1C1A; font-size: 15px;
          font-family: 'Jost', sans-serif; font-weight: 400;
          outline: none; transition: border-color 0.2s;
        }
        .inp:focus { border-color: #2C4A3E; }
        .inp::placeholder { color: #C0BCB4; }
        .sel {
          width: 100%; padding: 13px 16px;
          background: #fff; border: 1.5px solid #E4E0D8;
          border-radius: 8px; color: #1C1C1A; font-size: 15px;
          font-family: 'Jost', sans-serif; font-weight: 400;
          outline: none; transition: border-color 0.2s; cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B6860' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
        }
        .sel:focus { border-color: #2C4A3E; }
        .btn {
          width: 100%; padding: 15px;
          background: #2C4A3E; color: #fff;
          font-family: 'Jost', sans-serif; font-weight: 600;
          font-size: 15px; letter-spacing: 0.05em;
          border: none; cursor: pointer; border-radius: 8px;
          transition: background 0.2s; margin-top: 8px;
        }
        .btn:hover { background: #B8964E; }
        .btn:disabled { background: #C0BCB4; cursor: not-allowed; }
        .lbl {
          font-size: 13px; color: #6B6860; font-weight: 600;
          letter-spacing: 0.08em; display: block; margin-bottom: 8px;
        }
        .show-btn {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%); background: none;
          border: none; cursor: pointer; color: #A8A49C;
          font-size: 13px; font-family: 'Jost'; font-weight: 500;
          transition: color 0.2s; padding: 4px;
        }
        .show-btn:hover { color: #2C4A3E; }
        .forgot { 
          font-size: 13px; color: #B8964E; cursor: pointer;
          text-decoration: none; font-weight: 500;
          transition: color 0.2s;
        }
        .forgot:hover { color: #2C4A3E; }
      `}</style>

      {/* Left Panel */}
      <div style={{
        width: '45%', background: '#2C4A3E',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '56px 52px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', bottom: -80, right: -80,
          width: 320, height: 320, borderRadius: '50%',
          background: '#ffffff08',
        }} />
        <div style={{
          position: 'absolute', top: -40, left: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: '#ffffff05',
        }} />

        {/* Top */}
        <div style={{ position: 'relative' }}>
          <div style={{
            color: '#B8964E', fontSize: 11,
            letterSpacing: '0.35em', fontFamily: 'Jost',
            fontWeight: 600, marginBottom: 20,
          }}>
            SLIATE · ATI KANDY · 2026
          </div>
          <div style={{
            color: '#fff', fontFamily: 'Cormorant Garamond',
            fontSize: 52, fontWeight: 400, lineHeight: 1.15,
            marginBottom: 20,
          }}>
            Ceylo<span style={{ color: '#B8964E' }}>Field</span>Ops
          </div>
          <div style={{
            width: 48, height: 2,
            background: '#B8964E', marginBottom: 20,
          }} />
          <div style={{
            color: '#ffffff99', fontSize: 16,
            fontFamily: 'Jost', fontWeight: 300,
            lineHeight: 1.7,
          }}>
            AI-Powered Field Service<br />Management for Modern Sri Lanka
          </div>
        </div>

        {/* Bottom features */}
        <div style={{ position: 'relative' }}>
          <div style={{ color: '#ffffff55', fontSize: 11, letterSpacing: '0.2em', marginBottom: 16, fontWeight: 600 }}>
            SYSTEM FEATURES
          </div>
          {[
            '🤖 AI-Powered Job Assignment',
            '🗺️ Live Map Tracking',
            '👥 Multi-Role Access Control',
            '📊 Performance Analytics',
          ].map(f => (
            <div key={f} style={{
              color: '#ffffff88', fontSize: 14,
              fontFamily: 'Jost', fontWeight: 400,
              marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '56px 72px',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <div style={{
              color: '#B8964E', fontSize: 11,
              letterSpacing: '0.3em', fontFamily: 'Jost',
              fontWeight: 600, marginBottom: 12,
            }}>
              WELCOME BACK
            </div>
            <h1 style={{
              color: '#1C1C1A', fontFamily: 'Cormorant Garamond',
              fontSize: 42, fontWeight: 400, lineHeight: 1.2,
              marginBottom: 8,
            }}>
              Sign in to your account
            </h1>
            <p style={{ color: '#A8A49C', fontSize: 15, fontFamily: 'Jost', fontWeight: 400 }}>
              Select your role and enter your credentials
            </p>
          </div>

          <form onSubmit={handleLogin}>

            {/* Role Selector */}
            <div style={{ marginBottom: 22 }}>
              <label className="lbl">SELECT YOUR ROLE</label>
              <div style={{ position: 'relative' }}>
                <select
                  className="sel"
                  value={selectedRole}
                  onChange={e => handleRoleSelect(e.target.value)}
                >
                  <option value="">Choose your role...</option>
                  <option value="ADMIN">Administrator</option>
                  <option value="HR_MANAGER">HR Manager</option>
                  <option value="CLIENT">Client</option>
                  <option value="FIELD_WORKER">Field Worker</option>
                </select>
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 22 }}>
              <label className="lbl">EMAIL ADDRESS</label>
              <input
                className="inp"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 12 }}>
              <label className="lbl">PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="inp"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: 70 }}
                />
                <button
                  type="button"
                  className="show-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div style={{ textAlign: 'right', marginBottom: 28 }}>
              <a className="forgot" onClick={e => e.preventDefault()}>
                Forgot password?
              </a>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: '#FDECEA', border: '1px solid #FBBFB5',
                color: '#C0392B', fontSize: 14, padding: '12px 16px',
                borderRadius: 8, marginBottom: 20, fontFamily: 'Jost',
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>

          </form>

          {/* Footer */}
          <div style={{
            marginTop: 32, paddingTop: 24,
            borderTop: '1px solid #E4E0D8',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ fontSize: 13, color: '#A8A49C', fontFamily: 'Jost' }}>
              © 2026 CeyloFieldOps
            </div>
            <div style={{ fontSize: 13, color: '#A8A49C', fontFamily: 'Jost' }}>
              SLIATE ATI Kandy
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}