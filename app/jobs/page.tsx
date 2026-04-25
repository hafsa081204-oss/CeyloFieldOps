'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Topbar  from '@/components/Topbar'
import {
  MOCK_JOBS_DETAIL, STATUS_STYLE, PRIORITY_STYLE, JOB_CATEGORIES,
  type JobStatus, type JobPriority, type JobDetail,
} from '@/lib/constants'

const PRIORITY_ORDER: Record<JobPriority, number> = {
  critical: 4, high: 3, medium: 2, low: 1,
}

export default function JobsPage() {
  const router = useRouter()
  const [search,    setSearch]    = useState('')
  const [statusF,   setStatusF]   = useState<JobStatus | 'all'>('all')
  const [priorityF, setPriorityF] = useState<JobPriority | 'all'>('all')
  const [categoryF, setCategoryF] = useState('all')
  const [sortBy,    setSortBy]    = useState<'date' | 'amount' | 'priority'>('date')
  const [viewMode,  setViewMode]  = useState<'table' | 'card'>('table')

  const filtered: JobDetail[] = MOCK_JOBS_DETAIL
    .filter(j => {
      const q            = search.toLowerCase()
      const matchSearch  = !q
        || j.title.toLowerCase().includes(q)
        || j.client.toLowerCase().includes(q)
        || j.worker.toLowerCase().includes(q)
        || j.id.toLowerCase().includes(q)
      const matchStatus   = statusF   === 'all' || j.status   === statusF
      const matchPriority = priorityF === 'all' || j.priority === priorityF
      const matchCategory = categoryF === 'all' || j.category === categoryF
      return matchSearch && matchStatus && matchPriority && matchCategory
    })
    .sort((a, b) => {
      if (sortBy === 'date')     return new Date(b.date).getTime() - new Date(a.date).getTime()
      if (sortBy === 'amount')   return parseInt(b.amount.replace(/\D/g, '')) - parseInt(a.amount.replace(/\D/g, ''))
      return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]
    })

  const counts = {
    all:           MOCK_JOBS_DETAIL.length,
    pending:       MOCK_JOBS_DETAIL.filter(j => j.status === 'pending').length,
    'in-progress': MOCK_JOBS_DETAIL.filter(j => j.status === 'in-progress').length,
    completed:     MOCK_JOBS_DETAIL.filter(j => j.status === 'completed').length,
    cancelled:     MOCK_JOBS_DETAIL.filter(j => j.status === 'cancelled').length,
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #04060d; --surface: rgba(255,255,255,0.03);
          --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.12);
          --text: #e8eaf0; --text2: rgba(255,255,255,0.45); --text3: rgba(255,255,255,0.2);
          --ease-out: cubic-bezier(0.16,1,0.3,1); --ease-spring: cubic-bezier(0.34,1.56,0.64,1);
        }
        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 100px; }

        .layout { display: flex; min-height: 100vh; }
        .main   { margin-left: 240px; flex: 1; display: flex; flex-direction: column; }
        .content { padding: 28px 32px; flex: 1; }

        .status-tabs {
          display: flex; gap: 6px; margin-bottom: 24px;
          padding: 4px; background: var(--surface);
          border: 1px solid var(--border); border-radius: 14px; width: fit-content;
        }
        .st-tab {
          padding: 7px 16px; border-radius: 10px; border: none;
          background: transparent; color: var(--text2); font-size: 12px;
          font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer;
          transition: all 0.2s; display: flex; align-items: center; gap: 6px;
        }
        .st-tab:hover { color: var(--text); }
        .st-tab.active { background: rgba(255,255,255,0.07); color: #fff; }
        .st-count {
          font-size: 10px; padding: 1px 6px; border-radius: 100px;
          background: rgba(255,255,255,0.08); color: var(--text2);
        }
        .st-tab.active .st-count { background: rgba(255,255,255,0.15); color: #fff; }

        .controls { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
        .search-wrap { position: relative; flex: 1; min-width: 200px; }
        .search-icon {
          position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
          color: var(--text3); font-size: 14px; pointer-events: none;
        }
        .search-inp {
          width: 100%; padding: 10px 13px 10px 36px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 12px; color: var(--text); font-size: 13px;
          font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s;
        }
        .search-inp:focus { border-color: rgba(255,255,255,0.18); background: rgba(255,255,255,0.05); }
        .search-inp::placeholder { color: var(--text3); }
        .filter-sel {
          padding: 10px 14px; background: var(--surface); border: 1px solid var(--border);
          border-radius: 12px; color: var(--text2); font-size: 12px;
          font-family: 'DM Sans', sans-serif; outline: none; cursor: pointer;
          transition: all 0.2s; min-width: 120px;
        }
        .sort-btn {
          padding: 10px 14px; background: var(--surface); border: 1px solid var(--border);
          border-radius: 12px; color: var(--text2); font-size: 12px;
          font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; gap: 6px; white-space: nowrap;
        }
        .sort-btn:hover { border-color: var(--border2); color: var(--text); }
        .sort-btn.active { border-color: rgba(99,102,241,0.4); color: #818cf8; background: rgba(99,102,241,0.08); }
        .view-toggle {
          display: flex; gap: 2px; padding: 3px;
          background: var(--surface); border: 1px solid var(--border); border-radius: 10px;
        }
        .vt-btn {
          padding: 6px 10px; border-radius: 8px; border: none;
          background: transparent; color: var(--text3); cursor: pointer;
          font-size: 14px; transition: all 0.2s;
        }
        .vt-btn.active { background: rgba(255,255,255,0.08); color: var(--text); }
        .new-job-btn {
          padding: 10px 20px; border-radius: 12px; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          color: #fff; letter-spacing: 0.5px; transition: all 0.3s;
          white-space: nowrap; position: relative; overflow: hidden;
        }
        .new-job-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.15), transparent 60%);
        }
        .new-job-btn:hover { transform: translateY(-2px); }
        .results-info { font-size: 12px; color: var(--text3); margin-bottom: 16px; }
        .results-info span { color: var(--text2); font-weight: 500; }

        .table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; }
        .table-head {
          display: grid; grid-template-columns: 0.6fr 1.4fr 1fr 1fr 0.8fr 0.8fr 0.8fr 0.5fr;
          padding: 12px 20px; border-bottom: 1px solid var(--border); background: rgba(255,255,255,0.02);
        }
        .th { font-size: 9px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--text3); }
        .t-row {
          display: grid; grid-template-columns: 0.6fr 1.4fr 1fr 1fr 0.8fr 0.8fr 0.8fr 0.5fr;
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
          padding: 3px 10px; border-radius: 100px; font-size: 10px; font-weight: 600; white-space: nowrap;
        }
        .s-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        .priority-chip {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 8px; border-radius: 8px; font-size: 10px; font-weight: 600; text-transform: capitalize;
        }
        .action-btn {
          padding: 5px 10px; border-radius: 8px; border: 1px solid var(--border);
          background: transparent; color: var(--text2); font-size: 11px;
          cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .action-btn:hover { border-color: var(--border2); color: var(--text); }

        .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .job-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; padding: 24px; cursor: pointer;
          transition: all 0.3s var(--ease-out); position: relative; overflow: hidden;
          animation: fadeSlide 0.4s var(--ease-out) both;
        }
        .job-card:hover { transform: translateY(-4px); border-color: var(--border2); box-shadow: 0 20px 50px rgba(0,0,0,0.4); }
        .jc-accent { position: absolute; top: 0; left: 0; right: 0; height: 2px; border-radius: 20px 20px 0 0; }
        .jc-id { font-size: 10px; font-family: monospace; color: var(--text3); margin-bottom: 5px; }
        .jc-title { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: var(--text); line-height: 1.3; margin-bottom: 14px; }
        .jc-meta { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .jc-meta-row { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text2); }
        .jc-footer { display: flex; align-items: center; justify-content: space-between; }
        .jc-amount { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: var(--text); }

        .empty { padding: 64px 32px; text-align: center; color: var(--text3); }
        .empty-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.3; }
        .empty-title { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--text2); margin-bottom: 6px; }

        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="layout">
        <Sidebar />
        <main className="main">
          <Topbar
            title="Job Management"
            subtitle={`${MOCK_JOBS_DETAIL.length} total jobs across Sri Lanka`}
            actions={
              <button
                className="new-job-btn"
                onClick={() => router.push('/jobs/new')}
                style={{ background: 'linear-gradient(135deg,#1a6cf6,#7c3aed)', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}
              >
                + New Job
              </button>
            }
          />
          <div className="content">

            {/* Status Tabs */}
            <div className="status-tabs">
              {(['all','pending','in-progress','completed','cancelled'] as const).map(s => (
                <button
                  key={s}
                  className={'st-tab' + (statusF === s ? ' active' : '')}
                  onClick={() => setStatusF(s)}
                >
                  {s === 'all' ? 'All Jobs' : s.replace('-',' ').replace(/\b\w/g, c => c.toUpperCase())}
                  <span className="st-count">{counts[s]}</span>
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="controls">
              <div className="search-wrap">
                <span className="search-icon">🔍</span>
                <input
                  className="search-inp"
                  placeholder="Search by title, client, worker, ID..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select className="filter-sel" value={priorityF} onChange={e => setPriorityF(e.target.value as JobPriority | 'all')}>
                <option value="all">All Priorities</option>
                {(['critical','high','medium','low'] as JobPriority[]).map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
              <select className="filter-sel" value={categoryF} onChange={e => setCategoryF(e.target.value)}>
                <option value="all">All Categories</option>
                {JOB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div style={{ display:'flex', gap:'6px' }}>
                {(['date','amount','priority'] as const).map(s => (
                  <button
                    key={s}
                    className={'sort-btn' + (sortBy === s ? ' active' : '')}
                    onClick={() => setSortBy(s)}
                  >
                    {s === 'date' ? '📅' : s === 'amount' ? '💰' : '🔥'} {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <div className="view-toggle">
                <button className={'vt-btn' + (viewMode==='table' ? ' active' : '')} onClick={() => setViewMode('table')}>☰</button>
                <button className={'vt-btn' + (viewMode==='card'  ? ' active' : '')} onClick={() => setViewMode('card')}>⊞</button>
              </div>
            </div>

            <div className="results-info">
              Showing <span>{filtered.length}</span> of <span>{MOCK_JOBS_DETAIL.length}</span> jobs
              {search && <> matching <span>&quot;{search}&quot;</span></>}
            </div>

            {/* Table View */}
            {viewMode === 'table' && (
              <div className="table-wrap">
                <div className="table-head">
                  {['ID','Title','Client','Worker','Status','Priority','Amount',''].map(h => (
                    <div key={h} className="th">{h}</div>
                  ))}
                </div>
                <div>
                  {filtered.length === 0 ? (
                    <div className="empty">
                      <div className="empty-icon">◈</div>
                      <div className="empty-title">No jobs found</div>
                      <div>Try adjusting your search or filters</div>
                    </div>
                  ) : filtered.map((job, i) => {
                    const s = STATUS_STYLE[job.status]
                    const p = PRIORITY_STYLE[job.priority]
                    return (
                      <div
                        key={job.id} className="t-row"
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
                        <div className="td" style={{ color:'#e8eaf0', fontWeight: 500 }}>{job.amount}</div>
                        <div className="td">
                          <button
                            className="action-btn"
                            onClick={e => { e.stopPropagation(); router.push(`/jobs/${job.id}`) }}
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

            {/* Card View */}
            {viewMode === 'card' && (
              <div className="cards-grid">
                {filtered.length === 0 ? (
                  <div className="empty" style={{ gridColumn: '1/-1' }}>
                    <div className="empty-icon">◈</div>
                    <div className="empty-title">No jobs found</div>
                    <div>Try adjusting your search or filters</div>
                  </div>
                ) : filtered.map((job, i) => {
                  const s = STATUS_STYLE[job.status]
                  const p = PRIORITY_STYLE[job.priority]
                  return (
                    <div
                      key={job.id} className="job-card"
                      style={{ animationDelay: `${i * 0.05}s` }}
                      onClick={() => router.push(`/jobs/${job.id}`)}
                    >
                      <div className="jc-accent" style={{ background: s.color + '80' }} />
                      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'6px' }}>
                        <div className="jc-id">{job.id} · {job.category}</div>
                        <span className="priority-chip" style={{ background: p.bg, color: p.color }}>● {job.priority}</span>
                      </div>
                      <div className="jc-title">{job.title}</div>
                      <div className="jc-meta">
                        <div className="jc-meta-row">🏢 {job.client}</div>
                        <div className="jc-meta-row">👷 {job.worker}</div>
                        <div className="jc-meta-row">📍 {job.location}</div>
                        <div className="jc-meta-row">📅 {job.date}</div>
                      </div>
                      <div className="jc-footer">
                        <span className="status-badge" style={{ background: s.bg, color: s.color }}>
                          <span className="s-dot" style={{ background: s.color }} />
                          {s.label}
                        </span>
                        <div className="jc-amount">{job.amount}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
