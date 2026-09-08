'use client'

import { useParams, useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Topbar  from '@/components/Topbar'
import { MOCK_JOBS_DETAIL, STATUS_STYLE, PRIORITY_STYLE } from '@/lib/constants'

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()
  const job     = MOCK_JOBS_DETAIL.find(j => j.id === id)

  if (!job) {
    return (
      <div style={{
        display:'flex', minHeight:'100vh', background:'#04060d', color:'#e8eaf0',
        alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'16px',
        fontFamily:'DM Sans, sans-serif',
      }}>
        <div style={{ fontSize:'48px' }}>◈</div>
        <div style={{ fontFamily:'Playfair Display, serif', fontSize:'24px' }}>Job not found</div>
        <button
          onClick={() => router.push('/jobs')}
          style={{
            padding:'10px 24px', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.1)',
            background:'transparent', color:'rgba(255,255,255,0.6)', cursor:'pointer',
            fontFamily:'DM Sans, sans-serif', fontSize:'13px',
          }}
        >
          ← Back to Jobs
        </button>
      </div>
    )
  }

  const s        = STATUS_STYLE[job.status]
  const p        = PRIORITY_STYLE[job.priority]
  const progress = job.actualHours && job.estimatedHours
    ? Math.min(100, Math.round((job.actualHours / job.estimatedHours) * 100))
    : 0

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #04060d; --surface: rgba(255,255,255,0.03);
          --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.12);
          --text: #e8eaf0; --text2: rgba(255,255,255,0.45); --text3: rgba(255,255,255,0.2);
          --ease-out: cubic-bezier(0.16,1,0.3,1);
        }
        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 100px; }

        .layout { display: flex; min-height: 100vh; }
        .main   { margin-left: 240px; flex: 1; display: flex; flex-direction: column; }
        .content { padding: 28px 32px; flex: 1; }

        .back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 10px; border: 1px solid var(--border);
          background: var(--surface); color: var(--text2); font-size: 12px;
          cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
          margin-bottom: 24px;
        }
        .back-btn:hover { border-color: var(--border2); color: var(--text); }

        .hero {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 24px; padding: 36px; margin-bottom: 24px;
          position: relative; overflow: hidden;
          animation: fadeSlide 0.5s var(--ease-out) both;
        }
        .hero-accent {
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px; border-radius: 24px 24px 0 0;
        }
        .hero-glow {
          position: absolute; top: -60px; right: -60px;
          width: 300px; height: 300px; border-radius: 50%;
          filter: blur(60px); opacity: 0.08; pointer-events: none;
        }
        .hero-top {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 24px; flex-wrap: wrap; gap: 16px;
        }
        .hero-id { font-size: 11px; font-family: monospace; color: var(--text3); margin-bottom: 8px; }
        .hero-title {
          font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 900;
          color: var(--text); line-height: 1.2; margin-bottom: 8px;
        }
        .hero-category {
          display: inline-flex; align-items: center; gap: 6px; font-size: 11px;
          color: var(--text2); background: rgba(255,255,255,0.06);
          padding: 4px 12px; border-radius: 100px; border: 1px solid var(--border);
        }
        .hero-amount { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 900; color: var(--text); text-align: right; }
        .hero-amount-label { font-size: 11px; color: var(--text3); letter-spacing: 1px; text-transform: uppercase; text-align: right; margin-bottom: 4px; }
        .hero-badges { display: flex; gap: 8px; align-items: center; justify-content: flex-end; margin-top: 12px; }
        .status-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 16px; border-radius: 100px; font-size: 12px; font-weight: 600;
        }
        .s-dot { width: 6px; height: 6px; border-radius: 50%; animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        .priority-chip {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 600; text-transform: capitalize;
        }
        .info-grid {
          display: grid; grid-template-columns: repeat(4,1fr); gap: 12px;
          padding-top: 24px; border-top: 1px solid var(--border);
        }
        .info-lbl { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--text3); margin-bottom: 5px; }
        .info-val { font-size: 13px; color: var(--text); font-weight: 500; }

        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; padding: 28px;
          animation: fadeSlide 0.5s var(--ease-out) both;
        }
        .card-title {
          font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700;
          color: var(--text); margin-bottom: 18px; display: flex; align-items: center; gap: 8px;
        }
        .desc-text { font-size: 13px; color: var(--text2); line-height: 1.7; font-weight: 300; }
        .notes-text {
          font-size: 13px; color: var(--text2); line-height: 1.7; font-weight: 300;
          padding: 14px; background: rgba(255,255,255,0.02);
          border-radius: 12px; border-left: 3px solid;
        }
        .progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .progress-label { font-size: 12px; color: var(--text2); }
        .progress-pct { font-size: 18px; font-family: 'Playfair Display', serif; font-weight: 700; }
        .progress-track { height: 6px; background: rgba(255,255,255,0.06); border-radius: 100px; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 100px; animation: growWidth 1s var(--ease-out) both; }
        @keyframes growWidth { from { width: 0; } }
        .hours-row { display: flex; justify-content: space-between; margin-top: 8px; }
        .hours-val { font-size: 13px; font-weight: 600; color: var(--text2); }
        .hours-item { font-size: 11px; color: var(--text3); }

        .timeline { display: flex; flex-direction: column; }
        .tl-item { display: flex; gap: 14px; padding-bottom: 20px; }
        .tl-item:last-child { padding-bottom: 0; }
        .tl-left { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
        .tl-dot { width: 10px; height: 10px; border-radius: 50%; margin-top: 3px; border: 2px solid; flex-shrink: 0; }
        .tl-line { width: 1px; flex: 1; background: var(--border); margin-top: 4px; }
        .tl-item:last-child .tl-line { display: none; }
        .tl-time { font-size: 10px; color: var(--text3); margin-bottom: 3px; font-family: monospace; }
        .tl-text { font-size: 12px; color: var(--text2); line-height: 1.5; }

        .actions-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .action-primary {
          padding: 12px 24px; border-radius: 12px; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          color: #fff; letter-spacing: 0.5px; transition: all 0.3s;
          position: relative; overflow: hidden;
        }
        .action-primary::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.15), transparent 60%);
        }
        .action-primary:hover { transform: translateY(-2px); }
        .action-secondary {
          padding: 12px 24px; border-radius: 12px; border: 1px solid var(--border);
          background: var(--surface); color: var(--text2); font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .action-secondary:hover { border-color: var(--border2); color: var(--text); }
        .action-danger {
          padding: 12px 24px; border-radius: 12px; border: 1px solid rgba(239,68,68,0.2);
          background: rgba(239,68,68,0.06); color: rgba(239,68,68,0.7); font-size: 13px;
          font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .action-danger:hover { background: rgba(239,68,68,0.12); color: #f87171; }

        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="layout">
        <Sidebar />
        <main className="main">
          <Topbar title="Job Details" subtitle={`CeyloFieldOps / Jobs / ${job.id}`} />
          <div className="content">
            <button className="back-btn" onClick={() => router.push('/jobs')}>← Back to Jobs</button>

            {/* Hero */}
            <div className="hero">
              <div className="hero-accent" style={{ background: `linear-gradient(90deg, ${s.color}80, transparent)` }} />
              <div className="hero-glow" style={{ background: s.color }} />
              <div className="hero-top">
                <div>
                  <div className="hero-id">{job.id} · Created {new Date(job.createdAt).toLocaleDateString('en-LK')}</div>
                  <div className="hero-title">{job.title}</div>
                  <div className="hero-category">◈ {job.category}</div>
                </div>
                <div>
                  <div className="hero-amount-label">Contract Value</div>
                  <div className="hero-amount">{job.amount}</div>
                  <div className="hero-badges">
                    <span className="status-badge" style={{ background: s.bg, color: s.color }}>
                      <span className="s-dot" style={{ background: s.color, borderColor: s.color }} />
                      {s.label}
                    </span>
                    <span className="priority-chip" style={{ background: p.bg, color: p.color }}>
                      ● {job.priority}
                    </span>
                  </div>
                </div>
              </div>
              <div className="info-grid">
                {[
                  { label:'Client',   value: job.client   },
                  { label:'Worker',   value: job.worker   },
                  { label:'Location', value: job.location },
                  { label:'Due Date', value: job.date     },
                ].map(item => (
                  <div key={item.label}>
                    <div className="info-lbl">{item.label}</div>
                    <div className="info-val">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Two col */}
            <div className="two-col">
              <div className="card" style={{ animationDelay:'0.1s' }}>
                <div className="card-title">◈ Job Description</div>
                <div className="desc-text">{job.description}</div>
                <div style={{ marginTop:'20px', paddingTop:'20px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                  <div className="card-title">📝 Notes</div>
                  <div className="notes-text" style={{ borderColor: s.color + '60' }}>{job.notes}</div>
                </div>
                {job.actualHours && (
                  <div style={{ marginTop:'20px', paddingTop:'20px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                    <div className="card-title">⏱ Time Progress</div>
                    <div className="progress-header">
                      <div className="progress-label">Hours Logged</div>
                      <div className="progress-pct" style={{ color: s.color }}>{progress}%</div>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width:`${progress}%`, background: s.color }} />
                    </div>
                    <div className="hours-row">
                      <div>
                        <div className="hours-val" style={{ color: s.color }}>{job.actualHours}h</div>
                        <div className="hours-item">Actual</div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div className="hours-val">{job.estimatedHours}h</div>
                        <div className="hours-item">Estimated</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                <div className="card" style={{ animationDelay:'0.15s' }}>
                  <div className="card-title">📋 Activity Timeline</div>
                  <div className="timeline">
                    {[
                      { time: new Date(job.createdAt).toLocaleString('en-LK'), text: `Job created and assigned to ${job.worker}`, color:'#6366f1' },
                      { time: new Date(job.updatedAt).toLocaleString('en-LK'), text: `Status updated to ${s.label}`,              color: s.color  },
                      job.actualHours ? { time:'In progress', text:`${job.actualHours}h logged of ${job.estimatedHours}h estimated`, color:'#f59e0b' } : null,
                      job.status === 'completed' ? { time: job.date, text:'Job completed and signed off by client', color:'#34d399' } : null,
                    ].filter((x): x is { time: string; text: string; color: string } => x !== null)
                     .map((item, i) => (
                      <div key={i} className="tl-item">
                        <div className="tl-left">
                          <div className="tl-dot" style={{ background: item.color + '30', borderColor: item.color }} />
                          <div className="tl-line" />
                        </div>
                        <div>
                          <div className="tl-time">{item.time}</div>
                          <div className="tl-text">{item.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ animationDelay:'0.2s' }}>
                  <div className="card-title">⚡ Actions</div>
                  <div className="actions-row">
                    <button
                      className="action-primary"
                      style={{ background:'linear-gradient(135deg,#1a6cf6,#7c3aed)', boxShadow:'0 4px 20px rgba(99,102,241,0.25)' }}
                      onClick={() => router.push('/jobs/new')}
                    >
                      ✎ Edit Job
                    </button>
                    {job.status === 'pending' && (
                      <button className="action-primary" style={{ background:'linear-gradient(135deg,#059669,#0d9488)', boxShadow:'0 4px 20px rgba(16,185,129,0.25)' }}>
                        ▶ Start Job
                      </button>
                    )}
                    {job.status === 'in-progress' && (
                      <button className="action-primary" style={{ background:'linear-gradient(135deg,#059669,#0d9488)', boxShadow:'0 4px 20px rgba(16,185,129,0.25)' }}>
                        ✓ Complete
                      </button>
                    )}
                    <button className="action-secondary" onClick={() => window.print()}>⎙ Print</button>
                    <button className="action-danger">✕ Cancel Job</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}