'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Topbar  from '@/components/Topbar'
import {
  DASHBOARD_STATS, MOCK_JOBS,
  STATUS_STYLE, PRIORITY_STYLE,
  type JobStatus,
} from '@/lib/constants'

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'all' | JobStatus>('all')

  const filtered = activeTab === 'all'
    ? MOCK_JOBS
    : MOCK_JOBS.filter(j => j.status === activeTab)

  const counts = {
    all:           MOCK_JOBS.length,
    pending:       MOCK_JOBS.filter(j => j.status === 'pending').length,
    'in-progress': MOCK_JOBS.filter(j => j.status === 'in-progress').length,
    completed:     MOCK_JOBS.filter(j => j.status === 'completed').length,
    cancelled:     MOCK_JOBS.filter(j => j.status === 'cancelled').length,
  }

  return (
    <>
      <style>{`
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
        .main   { margin-left: 240px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
        .content { padding: 32px; flex: 1; }

        .stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 16px; margin-bottom: 28px;
        }
        .stat-card {
          position: relative; padding: 24px; border-radius: 20px;
          border: 1px solid var(--border); background: var(--surface);
          overflow: hidden; transition: all 0.3s var(--ease-out);
          animation: fadeSlide 0.5s var(--ease-out) both;
        }
        .stat-card:hover { transform: translateY(-3px); border-color: var(--border2); box-shadow: 0 20px 50px rgba(0,0,0,0.4); }
        .stat-orb {
          position: absolute; top: -30px; right: -20px;
          width: 100px; height: 100px; border-radius: 50%;
          filter: blur(30px); opacity: 0.25; pointer-events: none;
        }
        .stat-icon { font-size: 22px; margin-bottom: 16px; position: relative; z-index: 1; }
        .stat-value {
          font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 900;
          color: #fff; margin-bottom: 6px; position: relative; z-index: 1; line-height: 1;
        }
        .stat-label { font-size: 12px; color: var(--text2); margin-bottom: 12px; position: relative; z-index: 1; }
        .stat-change {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 600; padding: 3px 8px;
          border-radius: 100px; position: relative; z-index: 1;
        }
        .stat-change.up   { background: rgba(16,185,129,0.12); color: #34d399; }
        .stat-change.down { background: rgba(239,68,68,0.12);  color: #f87171; }

        .section-header {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;
        }
        .section-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; }
        .section-sub { font-size: 12px; color: var(--text3); margin-top: 2px; }

        .tabs { display: flex; gap: 4px; flex-wrap: wrap; }
        .tab-btn {
          padding: 6px 14px; border-radius: 8px; border: 1px solid transparent;
          background: transparent; color: var(--text2); font-size: 11px; font-weight: 500;
          font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s;
          letter-spacing: 0.5px; display: flex; align-items: center; gap: 5px;
        }
        .tab-btn:hover { color: var(--text); background: var(--surface); }
        .tab-btn.active { color: #fff; border-color: var(--border); background: var(--surface); }
        .tab-count {
          font-size: 9px; padding: 1px 5px; border-radius: 100px;
          background: rgba(255,255,255,0.08); color: var(--text2);
        }

        .table-wrap {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; overflow: hidden;
        }
        .table-head {
          display: grid;
          grid-template-columns: 0.6fr 1.4fr 1fr 1fr 0.9fr 0.8fr 0.8fr;
          padding: 12px 20px; border-bottom: 1px solid var(--border);
          background: rgba(255,255,255,0.02);
        }
        .th { font-size: 9px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--text3); }
        .t-row {
          display: grid;
          grid-template-columns: 0.6fr 1.4fr 1fr 1fr 0.9fr 0.8fr 0.8fr;
          padding: 14px 20px; border-bottom: 1px solid var(--border);
          align-items: center; cursor: pointer; transition: background 0.2s;
          animation: fadeSlide 0.4s var(--ease-out) both;
        }
        .t-row:last-child { border-bottom: none; }
        .t-row:hover { background: rgba(255,255,255,0.025); }
        .td { font-size: 12px; color: var(--text2); }
        .td.primary { color: var(--text); font-weight: 500; font-size: 13px; }
        .td.mono { font-family: monospace; font-size: 11px; color: var(--text3); }

        .status-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 100px; font-size: 10px; font-weight: 600;
          white-space: nowrap;
        }
        .s-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        .priority-chip {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 8px; border-radius: 8px;
          font-size: 10px; font-weight: 600; text-transform: capitalize;
        }
        .empty-state { padding: 48px; text-align: center; color: var(--text3); font-size: 13px; }

        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="layout">
        <Sidebar />
        <main className="main">
          <Topbar
            title="Dashboard Overview"
            subtitle="CeyloFieldOps / Dashboard"
          />
          <div className="content">

            <div className="stats-grid">
              {DASHBOARD_STATS.map((stat, i) => (
                <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="stat-orb" style={{ background: stat.gradient }} />
                  <div className="stat-icon" style={{
                    background: stat.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    {stat.icon}
                  </div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                  <span className={'stat-change ' + (stat.up ? 'up' : 'down')}>
                    {stat.up ? '↑' : '↓'} {stat.change}
                  </span>
                </div>
              ))}
            </div>

            <div className="section-header">
              <div>
                <div className="section-title">Recent Jobs</div>
                <div className="section-sub">{MOCK_JOBS.length} total assignments across Sri Lanka</div>
              </div>
              <div className="tabs">
                {(['all','pending','in-progress','completed','cancelled'] as const).map(tab => (
                  <button
                    key={tab}
                    className={'tab-btn' + (activeTab === tab ? ' active' : '')}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'all' ? 'All' : tab.replace('-',' ').replace(/\b\w/g, c => c.toUpperCase())}
                    <span className="tab-count">{counts[tab]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="table-wrap">
              <div className="table-head">
                {['ID','Title','Client','Worker','Status','Priority','Amount'].map(h => (
                  <div key={h} className="th">{h}</div>
                ))}
              </div>
              <div>
                {filtered.length === 0 ? (
                  <div className="empty-state">No jobs found for this status.</div>
                ) : filtered.map((job, i) => {
                  const s = STATUS_STYLE[job.status]
                  const p = PRIORITY_STYLE[job.priority]
                  return (
                    <div
                      key={job.id}
                      className="t-row"
                      style={{ animationDelay: `${i * 0.04}s` }}
                      onClick={() => router.push(`/jobs/${job.id}`)}
                    >
                      <div className="td mono">{job.id}</div>
                      <div className="td primary">{job.title}</div>
                      <div className="td">{job.client}</div>
                      <div className="td">{job.worker}</div>
                      <div className="td">
                        <span className="status-badge" style={{ background: s.bg, color: s.color }}>
                          <span className="s-dot" style={{ background: s.color }} />
                          {s.label}
                        </span>
                      </div>
                      <div className="td">
                        <span className="priority-chip" style={{ background: p.bg, color: p.color }}>
                          ● {job.priority}
                        </span>
                      </div>
                      <div className="td" style={{ color: '#e8eaf0', fontWeight: 500 }}>
                        {job.amount}
                      </div>
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