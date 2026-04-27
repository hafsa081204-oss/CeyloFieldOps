'use client'

import { useParams, useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Topbar  from '@/components/Topbar'
import {
  MOCK_WORKERS_DETAIL, WORKER_AVAILABILITY_STYLE,
  MOCK_JOBS_DETAIL, STATUS_STYLE, PRIORITY_STYLE,
} from '@/lib/constants'

export default function WorkerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()
  const worker  = MOCK_WORKERS_DETAIL.find(w => w.id === id)

  if (!worker) {
    return (
      <div style={{
        display:'flex', minHeight:'100vh', background:'#04060d', color:'#e8eaf0',
        alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'16px',
        fontFamily:'DM Sans, sans-serif',
      }}>
        <div style={{ fontSize:'48px' }}>◐</div>
        <div style={{ fontFamily:'Playfair Display, serif', fontSize:'24px' }}>Worker not found</div>
        <button
          onClick={() => router.push('/workers')}
          style={{
            padding:'10px 24px', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.1)',
            background:'transparent', color:'rgba(255,255,255,0.6)', cursor:'pointer',
            fontFamily:'DM Sans, sans-serif', fontSize:'13px',
          }}
        >← Back to Workers</button>
      </div>
    )
  }

  const av = WORKER_AVAILABILITY_STYLE[worker.availability]

  const avatarGrad =
    worker.availability === 'available' ? 'linear-gradient(135deg,#059669,#0d9488)' :
    worker.availability === 'busy'      ? 'linear-gradient(135deg,#1a6cf6,#7c3aed)' :
    worker.availability === 'leave'     ? 'linear-gradient(135deg,#d97706,#ea580c)' :
                                          'linear-gradient(135deg,#4b5563,#6b7280)'

  // Jobs this worker has done
  const workerJobs = MOCK_JOBS_DETAIL.filter(j => j.worker === worker.name)

  // Performance metrics
  const completionRate = Math.round((worker.completedJobs / (worker.completedJobs + 3)) * 100)
  const onTimeRate     = 91

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --bg:#04060d; --surface:rgba(255,255,255,0.03);
          --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.12);
          --text:#e8eaf0; --text2:rgba(255,255,255,0.45); --text3:rgba(255,255,255,0.2);
          --ease-out:cubic-bezier(0.16,1,0.3,1);
        }
        body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:100px;}

        .layout{display:flex;min-height:100vh;}
        .main{margin-left:240px;flex:1;display:flex;flex-direction:column;}
        .content{padding:28px 32px;flex:1;}

        .back-btn{
          display:inline-flex;align-items:center;gap:8px;padding:8px 16px;
          border-radius:10px;border:1px solid var(--border);background:var(--surface);
          color:var(--text2);font-size:12px;cursor:pointer;transition:all 0.2s;
          font-family:'DM Sans',sans-serif;margin-bottom:24px;
        }
        .back-btn:hover{border-color:var(--border2);color:var(--text);}

        /* Hero */
        .hero{
          background:var(--surface);border:1px solid var(--border);border-radius:24px;
          padding:36px;margin-bottom:24px;position:relative;overflow:hidden;
          animation:fadeSlide 0.5s var(--ease-out) both;
        }
        .hero-bg{position:absolute;inset:0;opacity:0.05;pointer-events:none;}
        .hero-accent{position:absolute;top:0;left:0;right:0;height:3px;border-radius:24px 24px 0 0;}
        .hero-inner{display:flex;align-items:flex-start;gap:28px;position:relative;z-index:1;flex-wrap:wrap;}
        .hero-avatar{
          width:90px;height:90px;border-radius:24px;display:flex;
          align-items:center;justify-content:center;font-family:'Playfair Display',serif;
          font-size:36px;font-weight:900;color:#fff;flex-shrink:0;position:relative;
        }
        .hero-avatar::after{
          content:'';position:absolute;inset:0;border-radius:24px;
          background:linear-gradient(135deg,rgba(255,255,255,0.22),transparent 60%);
        }
        .hero-info{flex:1;min-width:200px;}
        .hero-id{font-size:11px;font-family:monospace;color:var(--text3);margin-bottom:6px;}
        .hero-name{
          font-family:'Playfair Display',serif;font-size:30px;font-weight:900;
          color:var(--text);margin-bottom:4px;line-height:1.2;
        }
        .hero-role{font-size:14px;color:var(--text2);margin-bottom:12px;}
        .hero-badges{display:flex;gap:8px;flex-wrap:wrap;}
        .avail-badge{
          display:inline-flex;align-items:center;gap:5px;
          padding:6px 14px;border-radius:100px;font-size:12px;font-weight:600;
        }
        .avail-pulse{width:6px;height:6px;border-radius:50%;animation:pulse 2s ease-in-out infinite;}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
        .hero-metrics{display:flex;gap:32px;flex-wrap:wrap;}
        .metric{}
        .metric-val{
          font-family:'Playfair Display',serif;font-size:26px;font-weight:900;
          line-height:1;margin-bottom:3px;
        }
        .metric-lbl{font-size:11px;color:var(--text3);}

        /* Info grid */
        .info-grid{
          display:grid;grid-template-columns:repeat(4,1fr);gap:16px;
          margin-top:24px;padding-top:24px;border-top:1px solid var(--border);
          position:relative;z-index:1;
        }
        .info-lbl{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--text3);margin-bottom:4px;}
        .info-val{font-size:13px;color:var(--text);font-weight:500;}

        /* Three col layout */
        .three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-bottom:20px;}
        .two-col  {display:grid;grid-template-columns:1.4fr 1fr;gap:20px;margin-bottom:20px;}

        .card{
          background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px;
          animation:fadeSlide 0.5s var(--ease-out) both;
        }
        .card-title{
          font-family:'Playfair Display',serif;font-size:16px;font-weight:700;
          color:var(--text);margin-bottom:18px;display:flex;align-items:center;gap:8px;
        }

        /* Skills */
        .skills-wrap{display:flex;flex-wrap:wrap;gap:8px;}
        .skill-chip{
          padding:6px 14px;border-radius:100px;font-size:11px;font-weight:500;
          background:rgba(255,255,255,0.05);border:1px solid var(--border);
          color:var(--text2);transition:all 0.2s;
        }
        .skill-chip:hover{border-color:var(--border2);color:var(--text);}

        /* Certifications */
        .cert-list{display:flex;flex-direction:column;gap:10px;}
        .cert-item{
          display:flex;align-items:center;gap:10px;padding:10px 14px;
          background:rgba(255,255,255,0.02);border-radius:10px;
          border:1px solid var(--border);
        }
        .cert-icon{
          width:28px;height:28px;border-radius:8px;display:flex;
          align-items:center;justify-content:center;font-size:14px;flex-shrink:0;
          background:rgba(16,185,129,0.12);
        }
        .cert-name{font-size:12px;color:var(--text);font-weight:500;}

        /* Performance bars */
        .perf-list{display:flex;flex-direction:column;gap:16px;}
        .perf-item{}
        .perf-header{display:flex;justify-content:space-between;margin-bottom:7px;}
        .perf-label{font-size:12px;color:var(--text2);}
        .perf-pct{font-size:13px;font-weight:600;color:var(--text);}
        .perf-track{height:5px;background:rgba(255,255,255,0.06);border-radius:100px;overflow:hidden;}
        .perf-fill{height:100%;border-radius:100px;animation:growWidth 1s var(--ease-out) both;}
        @keyframes growWidth{from{width:0;}}

        /* Job history table */
        .job-table{background:var(--surface);border:1px solid var(--border);border-radius:20px;overflow:hidden;}
        .jt-head{
          display:grid;grid-template-columns:0.6fr 1.4fr 1fr 0.8fr 0.7fr;
          padding:10px 20px;border-bottom:1px solid var(--border);background:rgba(255,255,255,0.02);
        }
        .jt-row{
          display:grid;grid-template-columns:0.6fr 1.4fr 1fr 0.8fr 0.7fr;
          padding:12px 20px;border-bottom:1px solid var(--border);
          align-items:center;transition:background 0.2s;cursor:pointer;
          animation:fadeSlide 0.4s var(--ease-out) both;
        }
        .jt-row:last-child{border-bottom:none;}
        .jt-row:hover{background:rgba(255,255,255,0.02);}
        .th{font-size:9px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--text3);}
        .td{font-size:12px;color:var(--text2);}
        .td.primary{color:var(--text);font-weight:500;font-size:13px;}
        .td.mono{font-family:monospace;font-size:11px;color:var(--text3);}
        .status-badge{
          display:inline-flex;align-items:center;gap:5px;
          padding:3px 10px;border-radius:100px;font-size:10px;font-weight:600;
        }
        .s-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;}
        .no-jobs{padding:32px;text-align:center;color:var(--text3);font-size:13px;}

        /* Action buttons */
        .actions-row{display:flex;gap:10px;flex-wrap:wrap;}
        .action-primary{
          padding:12px 24px;border-radius:12px;border:none;cursor:pointer;
          font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;
          color:#fff;letter-spacing:0.5px;transition:all 0.3s;position:relative;overflow:hidden;
        }
        .action-primary::after{
          content:'';position:absolute;inset:0;
          background:linear-gradient(180deg,rgba(255,255,255,0.15),transparent 60%);
        }
        .action-primary:hover{transform:translateY(-2px);}
        .action-secondary{
          padding:12px 24px;border-radius:12px;border:1px solid var(--border);
          background:var(--surface);color:var(--text2);font-size:13px;font-weight:500;
          cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif;
        }
        .action-secondary:hover{border-color:var(--border2);color:var(--text);}
        .action-danger{
          padding:12px 24px;border-radius:12px;border:1px solid rgba(239,68,68,0.2);
          background:rgba(239,68,68,0.06);color:rgba(239,68,68,0.7);font-size:13px;
          font-weight:500;cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif;
        }
        .action-danger:hover{background:rgba(239,68,68,0.12);color:#f87171;}

        @keyframes fadeSlide{
          from{opacity:0;transform:translateY(10px);}
          to{opacity:1;transform:translateY(0);}
        }
      `}</style>

      <div className="layout">
        <Sidebar />
        <main className="main">
          <Topbar title="Worker Profile" subtitle={`CeyloFieldOps / Workers / ${worker.id}`} />
          <div className="content">
            <button className="back-btn" onClick={() => router.push('/workers')}>← Back to Workers</button>

            {/* Hero */}
            <div className="hero">
              <div className="hero-bg" style={{ background: avatarGrad }} />
              <div className="hero-accent" style={{ background:`linear-gradient(90deg,${av.color}80,transparent)` }} />

              <div className="hero-inner">
                <div
                  className="hero-avatar"
                  style={{ background: avatarGrad, boxShadow:`0 12px 40px ${av.color}40`, minWidth:'90px' }}
                >
                  {worker.avatar}
                </div>

                <div style={{ flex:1 }}>
                  <div className="hero-id">{worker.id} · Joined {new Date(worker.joinedDate).toLocaleDateString('en-LK', { year:'numeric', month:'long' })}</div>
                  <div className="hero-name">{worker.name}</div>
                  <div className="hero-role">{worker.role}</div>
                  <div className="hero-badges">
                    <span className="avail-badge" style={{ background: av.bg, color: av.color }}>
                      <span className="avail-pulse" style={{ background: av.color }} />
                      {av.label}
                    </span>
                    {worker.currentJob && (
                      <span
                        className="avail-badge"
                        style={{ background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.4)', border:'1px solid rgba(255,255,255,0.07)' }}
                      >
                        ◈ {worker.currentJob}
                      </span>
                    )}
                  </div>
                </div>

                <div className="hero-metrics">
                  {[
                    { val: worker.completedJobs.toString(), lbl:'Jobs Completed', color: av.color },
                    { val: `★ ${worker.rating}`,            lbl:'Rating',         color:'#f59e0b'  },
                    { val: worker.totalEarnings,            lbl:'Total Earnings', color:'#34d399'  },
                  ].map(m => (
                    <div key={m.lbl} className="metric">
                      <div className="metric-val" style={{ color: m.color }}>{m.val}</div>
                      <div className="metric-lbl">{m.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="info-grid">
                {[
                  { label:'Phone',   value: worker.phone     },
                  { label:'Email',   value: worker.email     },
                  { label:'NIC',     value: worker.nic       },
                  { label:'Address', value: worker.address   },
                ].map(item => (
                  <div key={item.label}>
                    <div className="info-lbl">{item.label}</div>
                    <div className="info-val">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Three col — Skills, Certs, Performance */}
            <div className="three-col">
              <div className="card" style={{ animationDelay:'0.1s' }}>
                <div className="card-title">◈ Skills</div>
                <div className="skills-wrap">
                  {worker.skills.map(skill => (
                    <span key={skill} className="skill-chip">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="card" style={{ animationDelay:'0.15s' }}>
                <div className="card-title">✦ Certifications</div>
                <div className="cert-list">
                  {worker.certifications.map(cert => (
                    <div key={cert} className="cert-item">
                      <div className="cert-icon">✓</div>
                      <div className="cert-name">{cert}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ animationDelay:'0.2s' }}>
                <div className="card-title">◆ Performance</div>
                <div className="perf-list">
                  {[
                    { label:'Job Completion Rate', pct: completionRate, color: av.color      },
                    { label:'On-Time Delivery',    pct: onTimeRate,     color: '#f59e0b'     },
                    { label:'Client Satisfaction', pct: Math.round(worker.rating / 5 * 100), color:'#a855f7' },
                  ].map(perf => (
                    <div key={perf.label} className="perf-item">
                      <div className="perf-header">
                        <span className="perf-label">{perf.label}</span>
                        <span className="perf-pct" style={{ color: perf.color }}>{perf.pct}%</span>
                      </div>
                      <div className="perf-track">
                        <div
                          className="perf-fill"
                          style={{ width:`${perf.pct}%`, background: perf.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop:'20px', paddingTop:'20px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                  <div className="card-title">⚡ Actions</div>
                  <div className="actions-row">
                    <button
                      className="action-primary"
                      style={{ background: avatarGrad, boxShadow:`0 4px 20px ${av.color}30` }}
                    >
                      ✎ Edit Profile
                    </button>
                    <button className="action-secondary">📋 Assign Job</button>
                    {worker.availability !== 'off-duty' && (
                      <button className="action-danger">✕ Deactivate</button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Job History */}
            <div style={{ marginBottom:'8px' }}>
              <div style={{ fontFamily:'Playfair Display,serif', fontSize:'20px', fontWeight:700, marginBottom:'4px' }}>
                Job History
              </div>
              <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.2)', marginBottom:'16px' }}>
                {workerJobs.length} jobs assigned to {worker.name}
              </div>
            </div>

            <div className="job-table">
              <div className="jt-head">
                {['ID','Title','Client','Status','Amount'].map(h => (
                  <div key={h} className="th">{h}</div>
                ))}
              </div>
              <div>
                {workerJobs.length === 0 ? (
                  <div className="no-jobs">No jobs found for this worker.</div>
                ) : workerJobs.map((job, i) => {
                  const s = STATUS_STYLE[job.status]
                  const p = PRIORITY_STYLE[job.priority]
                  return (
                    <div
                      key={job.id}
                      className="jt-row"
                      style={{ animationDelay:`${i*0.05}s` }}
                      onClick={() => router.push(`/jobs/${job.id}`)}
                    >
                      <div className="td mono">{job.id}</div>
                      <div className="td primary">{job.title}</div>
                      <div className="td">{job.client}</div>
                      <div className="td">
                        <span className="status-badge" style={{ background: s.bg, color: s.color }}>
                          <span className="s-dot" style={{ background: s.color }} />
                          {s.label}
                        </span>
                      </div>
                      <div className="td" style={{ color:'#e8eaf0', fontWeight:500 }}>{job.amount}</div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  )
}