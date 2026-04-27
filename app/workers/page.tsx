'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Topbar  from '@/components/Topbar'
import {
  MOCK_WORKERS_DETAIL, WORKER_AVAILABILITY_STYLE, WORKER_STATS,
  type WorkerDetail, type WorkerAvailability,
} from '@/lib/constants'

export default function WorkersPage() {
  const router = useRouter()
  const [search,  setSearch]  = useState('')
  const [availF,  setAvailF]  = useState<WorkerAvailability | 'all'>('all')
  const [roleF,   setRoleF]   = useState('all')
  const [viewMode,setViewMode]= useState<'card' | 'table'>('card')
  const [sortBy,  setSortBy]  = useState<'rating' | 'jobs' | 'name'>('rating')

  // Unique roles for filter
  const allRoles = Array.from(new Set(MOCK_WORKERS_DETAIL.map(w => w.role)))

  const filtered: WorkerDetail[] = MOCK_WORKERS_DETAIL
    .filter(w => {
      const q           = search.toLowerCase()
      const matchSearch = !q
        || w.name.toLowerCase().includes(q)
        || w.role.toLowerCase().includes(q)
        || w.location.toLowerCase().includes(q)
        || w.id.toLowerCase().includes(q)
      const matchAvail  = availF  === 'all' || w.availability === availF
      const matchRole   = roleF   === 'all' || w.role         === roleF
      return matchSearch && matchAvail && matchRole
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating        - a.rating
      if (sortBy === 'jobs')   return b.completedJobs - a.completedJobs
      return a.name.localeCompare(b.name)
    })

  const counts = {
    all:       MOCK_WORKERS_DETAIL.length,
    available: MOCK_WORKERS_DETAIL.filter(w => w.availability === 'available').length,
    busy:      MOCK_WORKERS_DETAIL.filter(w => w.availability === 'busy').length,
    leave:     MOCK_WORKERS_DETAIL.filter(w => w.availability === 'leave').length,
    'off-duty':MOCK_WORKERS_DETAIL.filter(w => w.availability === 'off-duty').length,
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --bg:#04060d; --surface:rgba(255,255,255,0.03);
          --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.12);
          --text:#e8eaf0; --text2:rgba(255,255,255,0.45); --text3:rgba(255,255,255,0.2);
          --ease-out:cubic-bezier(0.16,1,0.3,1); --ease-spring:cubic-bezier(0.34,1.56,0.64,1);
        }
        body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:100px;}

        .layout{display:flex;min-height:100vh;}
        .main{margin-left:240px;flex:1;display:flex;flex-direction:column;}
        .content{padding:28px 32px;flex:1;}

        /* Stats */
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px;}
        .stat-card{
          position:relative;padding:22px 24px;border-radius:20px;
          border:1px solid var(--border);background:var(--surface);overflow:hidden;
          transition:all 0.3s var(--ease-out);animation:fadeSlide 0.5s var(--ease-out) both;
        }
        .stat-card:hover{transform:translateY(-3px);border-color:var(--border2);box-shadow:0 20px 50px rgba(0,0,0,0.4);}
        .stat-orb{
          position:absolute;top:-20px;right:-20px;width:90px;height:90px;
          border-radius:50%;filter:blur(28px);opacity:0.22;pointer-events:none;
        }
        .stat-value{
          font-family:'Playfair Display',serif;font-size:30px;font-weight:900;
          color:#fff;margin-bottom:4px;position:relative;z-index:1;line-height:1;
        }
        .stat-label{font-size:12px;color:var(--text2);margin-bottom:8px;position:relative;z-index:1;}
        .stat-change{font-size:11px;color:var(--text3);position:relative;z-index:1;}

        /* Availability tabs */
        .avail-tabs{
          display:flex;gap:6px;margin-bottom:24px;padding:4px;
          background:var(--surface);border:1px solid var(--border);
          border-radius:14px;width:fit-content;
        }
        .av-tab{
          padding:7px 16px;border-radius:10px;border:none;background:transparent;
          color:var(--text2);font-size:12px;font-weight:500;font-family:'DM Sans',sans-serif;
          cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:6px;
        }
        .av-tab:hover{color:var(--text);}
        .av-tab.active{background:rgba(255,255,255,0.07);color:#fff;}
        .av-count{
          font-size:10px;padding:1px 6px;border-radius:100px;
          background:rgba(255,255,255,0.08);color:var(--text2);
        }
        .av-tab.active .av-count{background:rgba(255,255,255,0.15);color:#fff;}

        /* Controls */
        .controls{display:flex;align-items:center;gap:10px;margin-bottom:20px;flex-wrap:wrap;}
        .search-wrap{position:relative;flex:1;min-width:200px;}
        .search-icon{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--text3);pointer-events:none;}
        .search-inp{
          width:100%;padding:10px 13px 10px 36px;background:var(--surface);
          border:1px solid var(--border);border-radius:12px;color:var(--text);
          font-size:13px;font-family:'DM Sans',sans-serif;outline:none;transition:all 0.2s;
        }
        .search-inp:focus{border-color:rgba(255,255,255,0.18);background:rgba(255,255,255,0.05);}
        .search-inp::placeholder{color:var(--text3);}
        .filter-sel{
          padding:10px 14px;background:var(--surface);border:1px solid var(--border);
          border-radius:12px;color:var(--text2);font-size:12px;font-family:'DM Sans',sans-serif;
          outline:none;cursor:pointer;min-width:140px;
        }
        .sort-btn{
          padding:10px 14px;background:var(--surface);border:1px solid var(--border);
          border-radius:12px;color:var(--text2);font-size:12px;font-family:'DM Sans',sans-serif;
          cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:6px;white-space:nowrap;
        }
        .sort-btn:hover{border-color:var(--border2);color:var(--text);}
        .sort-btn.active{border-color:rgba(99,102,241,0.4);color:#818cf8;background:rgba(99,102,241,0.08);}
        .view-toggle{
          display:flex;gap:2px;padding:3px;background:var(--surface);
          border:1px solid var(--border);border-radius:10px;
        }
        .vt-btn{
          padding:6px 10px;border-radius:8px;border:none;background:transparent;
          color:var(--text3);cursor:pointer;font-size:14px;transition:all 0.2s;
        }
        .vt-btn.active{background:rgba(255,255,255,0.08);color:var(--text);}
        .add-worker-btn{
          padding:10px 20px;border-radius:12px;border:none;cursor:pointer;
          font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:#fff;
          letter-spacing:0.5px;transition:all 0.3s;white-space:nowrap;position:relative;overflow:hidden;
        }
        .add-worker-btn::after{
          content:'';position:absolute;inset:0;
          background:linear-gradient(180deg,rgba(255,255,255,0.15),transparent 60%);
        }
        .add-worker-btn:hover{transform:translateY(-2px);}

        .results-info{font-size:12px;color:var(--text3);margin-bottom:16px;}
        .results-info span{color:var(--text2);font-weight:500;}

        /* ── CARD VIEW ── */
        .cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;}
        .worker-card{
          background:var(--surface);border:1px solid var(--border);
          border-radius:22px;padding:0;cursor:pointer;overflow:hidden;
          transition:all 0.3s var(--ease-out);
          animation:fadeSlide 0.4s var(--ease-out) both;
          position:relative;
        }
        .worker-card:hover{transform:translateY(-4px);border-color:var(--border2);box-shadow:0 24px 60px rgba(0,0,0,0.45);}

        .wc-header{
          padding:24px 24px 20px;position:relative;overflow:hidden;
        }
        .wc-bg{
          position:absolute;inset:0;opacity:0.08;pointer-events:none;
        }
        .wc-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;position:relative;z-index:1;}
        .wc-avatar{
          width:52px;height:52px;border-radius:16px;display:flex;
          align-items:center;justify-content:center;font-family:'Playfair Display',serif;
          font-size:20px;font-weight:900;color:#fff;flex-shrink:0;position:relative;
        }
        .wc-avatar::after{
          content:'';position:absolute;inset:0;border-radius:16px;
          background:linear-gradient(135deg,rgba(255,255,255,0.22),transparent 60%);
        }
        .wc-avail-badge{
          padding:4px 10px;border-radius:100px;font-size:10px;font-weight:600;
          display:flex;align-items:center;gap:5px;
        }
        .avail-pulse{width:5px;height:5px;border-radius:50%;animation:pulse 2s ease-in-out infinite;}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.3;}}

        .wc-name{
          font-family:'Playfair Display',serif;font-size:17px;font-weight:700;
          color:var(--text);margin-bottom:3px;position:relative;z-index:1;
        }
        .wc-role{font-size:12px;color:var(--text2);position:relative;z-index:1;}

        .wc-body{padding:0 24px 20px;}
        .wc-stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;}
        .wc-stat{}
        .wc-stat-val{
          font-family:'Playfair Display',serif;font-size:18px;font-weight:700;
          color:var(--text);line-height:1;margin-bottom:2px;
        }
        .wc-stat-lbl{font-size:10px;color:var(--text3);letter-spacing:0.5px;}

        .wc-divider{height:1px;background:var(--border);margin-bottom:16px;}

        .wc-location{
          display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text2);
          margin-bottom:12px;
        }
        .wc-skills{display:flex;gap:6px;flex-wrap:wrap;}
        .skill-tag{
          padding:3px 10px;border-radius:100px;font-size:10px;font-weight:500;
          background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--text2);
        }
        .skill-more{
          padding:3px 10px;border-radius:100px;font-size:10px;font-weight:500;
          background:rgba(255,255,255,0.03);border:1px solid var(--border);color:var(--text3);
        }

        .wc-footer{
          padding:14px 24px;border-top:1px solid var(--border);
          display:flex;align-items:center;justify-content:space-between;
          background:rgba(255,255,255,0.015);
        }
        .wc-id{font-size:10px;font-family:monospace;color:var(--text3);}
        .view-btn{
          padding:6px 14px;border-radius:8px;border:1px solid var(--border);
          background:transparent;color:var(--text2);font-size:11px;font-weight:500;
          cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif;
        }
        .view-btn:hover{border-color:var(--border2);color:var(--text);}

        /* ── TABLE VIEW ── */
        .table-wrap{background:var(--surface);border:1px solid var(--border);border-radius:20px;overflow:hidden;}
        .table-head{
          display:grid;grid-template-columns:0.4fr 1.2fr 1fr 0.8fr 0.7fr 0.7fr 0.7fr 0.5fr;
          padding:12px 20px;border-bottom:1px solid var(--border);background:rgba(255,255,255,0.02);
        }
        .th{font-size:9px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--text3);}
        .t-row{
          display:grid;grid-template-columns:0.4fr 1.2fr 1fr 0.8fr 0.7fr 0.7fr 0.7fr 0.5fr;
          padding:14px 20px;border-bottom:1px solid var(--border);align-items:center;
          cursor:pointer;transition:background 0.2s;animation:fadeSlide 0.4s var(--ease-out) both;
        }
        .t-row:last-child{border-bottom:none;}
        .t-row:hover{background:rgba(255,255,255,0.025);}
        .td{font-size:12px;color:var(--text2);}
        .td.primary{color:var(--text);font-weight:500;font-size:13px;}
        .td.mono{font-family:monospace;font-size:11px;color:var(--text3);}
        .avail-badge{
          display:inline-flex;align-items:center;gap:5px;
          padding:3px 10px;border-radius:100px;font-size:10px;font-weight:600;white-space:nowrap;
        }
        .a-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;}
        .rating-stars{font-size:11px;color:#f59e0b;font-weight:600;}
        .action-btn{
          padding:5px 10px;border-radius:8px;border:1px solid var(--border);
          background:transparent;color:var(--text2);font-size:11px;
          cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif;
        }
        .action-btn:hover{border-color:var(--border2);color:var(--text);}

        /* Empty */
        .empty{padding:64px 32px;text-align:center;color:var(--text3);}
        .empty-icon{font-size:40px;margin-bottom:12px;opacity:0.3;}
        .empty-title{font-family:'Playfair Display',serif;font-size:20px;color:var(--text2);margin-bottom:6px;}

        @keyframes fadeSlide{
          from{opacity:0;transform:translateY(8px);}
          to{opacity:1;transform:translateY(0);}
        }
      `}</style>

      <div className="layout">
        <Sidebar />
        <main className="main">
          <Topbar
            title="Worker Management"
            subtitle={`${MOCK_WORKERS_DETAIL.length} field workers across Sri Lanka`}
            actions={
              <button
                className="add-worker-btn"
                style={{ background:'linear-gradient(135deg,#059669,#0d9488)', boxShadow:'0 4px 20px rgba(16,185,129,0.3)' }}
              >
                + Add Worker
              </button>
            }
          />

          <div className="content">

            {/* Stats */}
            <div className="stats-grid">
              {WORKER_STATS.map((stat, i) => (
                <div key={i} className="stat-card" style={{ animationDelay:`${i*0.07}s` }}>
                  <div className="stat-orb" style={{ background: stat.gradient }} />
                  <div
                    className="stat-value"
                    style={{
                      background: stat.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-change">
                    {stat.up ? '↑' : '↓'} {stat.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Availability tabs */}
            <div className="avail-tabs">
              {(['all','available','busy','leave','off-duty'] as const).map(av => (
                <button
                  key={av}
                  className={'av-tab' + (availF === av ? ' active' : '')}
                  onClick={() => setAvailF(av)}
                >
                  {av === 'all' ? 'All Workers' : WORKER_AVAILABILITY_STYLE[av]?.label ?? av}
                  <span className="av-count">{counts[av]}</span>
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="controls">
              <div className="search-wrap">
                <span className="search-icon">🔍</span>
                <input
                  className="search-inp"
                  placeholder="Search by name, role, location, ID..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select className="filter-sel" value={roleF} onChange={e => setRoleF(e.target.value)}>
                <option value="all">All Roles</option>
                {allRoles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <div style={{ display:'flex', gap:'6px' }}>
                {(['rating','jobs','name'] as const).map(s => (
                  <button
                    key={s}
                    className={'sort-btn' + (sortBy === s ? ' active' : '')}
                    onClick={() => setSortBy(s)}
                  >
                    {s === 'rating' ? '★' : s === 'jobs' ? '◉' : '⬡'} {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <div className="view-toggle">
                <button className={'vt-btn' + (viewMode==='card'  ? ' active' : '')} onClick={() => setViewMode('card')}>⊞</button>
                <button className={'vt-btn' + (viewMode==='table' ? ' active' : '')} onClick={() => setViewMode('table')}>☰</button>
              </div>
            </div>

            <div className="results-info">
              Showing <span>{filtered.length}</span> of <span>{MOCK_WORKERS_DETAIL.length}</span> workers
            </div>

            {/* ── CARD VIEW ── */}
            {viewMode === 'card' && (
              <div className="cards-grid">
                {filtered.length === 0 ? (
                  <div className="empty" style={{ gridColumn:'1/-1' }}>
                    <div className="empty-icon">◐</div>
                    <div className="empty-title">No workers found</div>
                    <div>Try adjusting your search or filters</div>
                  </div>
                ) : filtered.map((worker, i) => {
                  const av = WORKER_AVAILABILITY_STYLE[worker.availability]
                  // pick gradient per availability
                  const avatarGrad =
                    worker.availability === 'available' ? 'linear-gradient(135deg,#059669,#0d9488)' :
                    worker.availability === 'busy'      ? 'linear-gradient(135deg,#1a6cf6,#7c3aed)' :
                    worker.availability === 'leave'     ? 'linear-gradient(135deg,#d97706,#ea580c)' :
                                                          'linear-gradient(135deg,#4b5563,#6b7280)'
                  return (
                    <div
                      key={worker.id}
                      className="worker-card"
                      style={{ animationDelay:`${i*0.06}s` }}
                      onClick={() => router.push(`/workers/${worker.id}`)}
                    >
                      <div className="wc-header">
                        <div
                          className="wc-bg"
                          style={{ background: avatarGrad }}
                        />
                        <div className="wc-top">
                          <div
                            className="wc-avatar"
                            style={{ background: avatarGrad, boxShadow:`0 6px 20px ${av.color}40` }}
                          >
                            {worker.avatar}
                          </div>
                          <span
                            className="wc-avail-badge"
                            style={{ background: av.bg, color: av.color }}
                          >
                            <span className="avail-pulse" style={{ background: av.color }} />
                            {av.label}
                          </span>
                        </div>
                        <div className="wc-name">{worker.name}</div>
                        <div className="wc-role">{worker.role}</div>
                      </div>

                      <div className="wc-body">
                        <div className="wc-stats">
                          <div className="wc-stat">
                            <div className="wc-stat-val"
                              style={{
                                background: avatarGrad,
                                WebkitBackgroundClip:'text',
                                WebkitTextFillColor:'transparent',
                              }}
                            >
                              {worker.completedJobs}
                            </div>
                            <div className="wc-stat-lbl">Jobs Done</div>
                          </div>
                          <div className="wc-stat">
                            <div className="wc-stat-val">★ {worker.rating}</div>
                            <div className="wc-stat-lbl">Rating</div>
                          </div>
                          <div className="wc-stat">
                            <div className="wc-stat-val" style={{ fontSize:'14px' }}>{worker.location}</div>
                            <div className="wc-stat-lbl">Location</div>
                          </div>
                        </div>

                        <div className="wc-divider" />

                        <div className="wc-skills">
                          {worker.skills.slice(0,3).map(skill => (
                            <span key={skill} className="skill-tag">{skill}</span>
                          ))}
                          {worker.skills.length > 3 && (
                            <span className="skill-more">+{worker.skills.length - 3}</span>
                          )}
                        </div>
                      </div>

                      <div className="wc-footer">
                        <div className="wc-id">{worker.id}</div>
                        <button
                          className="view-btn"
                          onClick={e => { e.stopPropagation(); router.push(`/workers/${worker.id}`) }}
                        >
                          View Profile →
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ── TABLE VIEW ── */}
            {viewMode === 'table' && (
              <div className="table-wrap">
                <div className="table-head">
                  {['ID','Name','Role','Location','Availability','Rating','Jobs Done',''].map(h => (
                    <div key={h} className="th">{h}</div>
                  ))}
                </div>
                <div>
                  {filtered.length === 0 ? (
                    <div className="empty">
                      <div className="empty-icon">◐</div>
                      <div className="empty-title">No workers found</div>
                    </div>
                  ) : filtered.map((worker, i) => {
                    const av = WORKER_AVAILABILITY_STYLE[worker.availability]
                    return (
                      <div
                        key={worker.id}
                        className="t-row"
                        style={{ animationDelay:`${i*0.04}s` }}
                        onClick={() => router.push(`/workers/${worker.id}`)}
                      >
                        <div className="td mono">{worker.id}</div>
                        <div className="td primary">{worker.name}</div>
                        <div className="td">{worker.role}</div>
                        <div className="td">{worker.location}</div>
                        <div className="td">
                          <span className="avail-badge" style={{ background: av.bg, color: av.color }}>
                            <span className="a-dot" style={{ background: av.color }} />
                            {av.label}
                          </span>
                        </div>
                        <div className="td">
                          <span className="rating-stars">★</span>{' '}
                          <span style={{ color:'var(--text)', fontWeight:600 }}>{worker.rating}</span>
                        </div>
                        <div className="td" style={{ color:'var(--text)', fontWeight:500 }}>{worker.completedJobs}</div>
                        <div className="td">
                          <button
                            className="action-btn"
                            onClick={e => { e.stopPropagation(); router.push(`/workers/${worker.id}`) }}
                          >
                            View →
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  )
}