'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

type Job = {
  id: string
  title: string
  description: string
  location: string
  priority: string
  status: string
  client?: { name: string }
  worker?: { user: { name: string }; id: string }
  workerId?: string
}

type Suggestion = {
  worker: { id: string; user: { name: string }; rating: number }
  confidence: number
  distanceKm: string
  reasons: string[]
}

const statusStyle: Record<string, { bg: string; color: string }> = {
  PENDING: { bg: '#FEF3CD', color: '#92600A' },
  ASSIGNED: { bg: '#DBEAFE', color: '#1E40AF' },
  IN_PROGRESS: { bg: '#D1FAE5', color: '#065F46' },
  COMPLETED: { bg: '#F0FDF4', color: '#166534' },
  CANCELLED: { bg: '#FDECEA', color: '#C0392B' },
}

const priorityStyle: Record<string, { color: string; bg: string }> = {
  LOW: { color: '#166534', bg: '#F0FDF4' },
  MEDIUM: { color: '#92600A', bg: '#FEF3CD' },
  HIGH: { color: '#C0392B', bg: '#FDECEA' },
  URGENT: { color: '#6B21A8', bg: '#F3E8FF' },
}

const nextStatus: Record<string, string> = {
  ASSIGNED: 'IN_PROGRESS',
  IN_PROGRESS: 'COMPLETED',
}

const nextStatusLabel: Record<string, string> = {
  ASSIGNED: '▶ Start Job',
  IN_PROGRESS: '✓ Complete',
}

function AssignModal({ job, onClose, onDone }: {
  job: Job; onClose: () => void; onDone: () => void
}) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/jobs/${job.id}/assign`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setSuggestions(data)
        else setSuggestions([])
      })
      .finally(() => setLoading(false))
  }, [job.id])

  const assign = async (workerId: string) => {
    await fetch(`/api/jobs/${job.id}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workerId }),
    })
    onDone()
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#00000040',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 32,
        width: 500, maxHeight: '85vh', overflowY: 'auto',
        boxShadow: '0 20px 60px #00000018',
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#F5EDD8', color: '#B8964E', fontSize: 11,
          padding: '4px 12px', borderRadius: 20, fontWeight: 600,
          letterSpacing: '0.1em', marginBottom: 14,
        }}>
          ✨ AI POWERED
        </div>
        <div style={{
          fontFamily: 'Cormorant Garamond', fontSize: 26,
          fontWeight: 400, marginBottom: 4, color: '#1C1C1A',
        }}>
          Smart Worker Assignment
        </div>
        <div style={{ fontSize: 14, color: '#6B6860', marginBottom: 24 }}>
          Job: {job.title} · {job.priority} priority
        </div>

        {loading ? (
          <div style={{ fontSize: 14, color: '#6B6860', textAlign: 'center', padding: 40 }}>
            Analyzing workers...
          </div>
        ) : suggestions.length === 0 ? (
          <div style={{ fontSize: 14, color: '#6B6860', textAlign: 'center', padding: 40 }}>
            No available workers found.
          </div>
        ) : suggestions.map((s, i) => (
          <div key={s.worker.id} style={{
            border: `1px solid ${i === 0 ? '#B8964E' : '#E4E0D8'}`,
            borderRadius: 10, padding: 18, marginBottom: 12, position: 'relative',
          }}>
            {i === 0 && (
              <div style={{
                position: 'absolute', top: -1, right: 14,
                background: '#2C4A3E', color: '#fff', fontSize: 10,
                padding: '3px 12px', borderRadius: '0 0 8px 8px',
                fontWeight: 600, letterSpacing: '0.1em',
              }}>
                BEST MATCH
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#1C1C1A' }}>
                {s.worker.user.name}
              </div>
              <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 32, color: '#B8964E' }}>
                {s.confidence}%
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#6B6860', marginBottom: 8 }}>
              📍 {s.distanceKm}km away · ⭐ {s.worker.rating}/5 rating
            </div>
            <div style={{ fontSize: 12, color: '#A8A49C', marginBottom: 12, lineHeight: 1.6 }}>
              {s.reasons.join(' · ')}
            </div>
            <button onClick={() => assign(s.worker.id)} style={{
              background: i === 0 ? '#2C4A3E' : '#F6F4F0',
              color: i === 0 ? '#fff' : '#6B6860',
              border: 'none', padding: '10px 20px', borderRadius: 8,
              fontSize: 13, fontFamily: 'Jost', fontWeight: 500, cursor: 'pointer',
            }}>
              ✓ Assign {s.worker.user.name}
            </button>
          </div>
        ))}

        <button onClick={onClose} style={{
          background: 'none', border: '1px solid #E4E0D8', color: '#6B6860',
          padding: '10px 20px', borderRadius: 8, fontSize: 13,
          fontFamily: 'Jost', cursor: 'pointer', marginTop: 8, width: '100%',
        }}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [activeTab, setActiveTab] = useState('ALL')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '', description: '', location: '', priority: 'MEDIUM',
  })
  const { data: session } = useSession()

  const role = session?.user?.role || ''
  const isAdmin = role === 'ADMIN'
  const isHR = role === 'HR_MANAGER'
  const isClient = role === 'CLIENT'
  const isWorker = role === 'FIELD_WORKER'

  const load = () => {
    fetch('/api/jobs')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          if (isClient) {
            setJobs(data.filter((j: Job) => j.client?.name === session?.user?.name))
          } else {
            setJobs(data)
          }
        }
      })
      .catch(() => {})
  }

  useEffect(() => { load() }, [session])

  const create = async () => {
    if (!form.title || !form.location) {
      alert('Please fill in Job Title and Location!')
      return
    }
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setShowForm(false)
        setForm({ title: '', description: '', location: '', priority: 'MEDIUM' })
        load()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to create job')
      }
    } catch {
      alert('Something went wrong!')
    }
  }

  const updateStatus = async (jobId: string, status: string) => {
    setUpdatingId(jobId)
    await fetch(`/api/jobs/${jobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    load()
    setUpdatingId(null)
  }

  const tabs = ['ALL', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED']
  const filtered = activeTab === 'ALL' ? jobs : jobs.filter(j => j.status === activeTab)

  const pageSubtitle = isClient
    ? `${jobs.length} service requests submitted`
    : isWorker
    ? `${jobs.length} total jobs`
    : `${jobs.length} total jobs · ${jobs.filter(j => j.status === 'PENDING').length} pending`

  const inp: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #E4E0D8', borderRadius: 8,
    fontSize: 14, fontFamily: 'Jost', color: '#1C1C1A',
    outline: 'none', background: '#fff',
  }

  return (
    <div style={{ fontFamily: 'Jost' }}>
      {selectedJob && (
        <AssignModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onDone={load}
        />
      )}

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24,
      }}>
        <div style={{ fontSize: 14, color: '#6B6860' }}>{pageSubtitle}</div>
        {(isClient || isAdmin) && (
          <button onClick={() => setShowForm(!showForm)} style={{
            background: '#2C4A3E', color: '#fff', border: 'none',
            padding: '11px 22px', borderRadius: 8, fontSize: 14,
            fontFamily: 'Jost', fontWeight: 500, cursor: 'pointer',
          }}>
            {showForm ? 'Cancel' : isClient ? '+ New Request' : '+ Create New Job'}
          </button>
        )}
      </div>

      {/* Create Form — Client and Admin only */}
      {showForm && (isClient || isAdmin) && (
        <div style={{
          background: '#fff', border: '1px solid #E4E0D8',
          borderRadius: 12, padding: 28, marginBottom: 24,
        }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#1C1C1A', marginBottom: 20 }}>
            {isClient ? 'Submit New Service Request' : 'Create New Job'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div>
              <label style={{ fontSize: 12, color: '#6B6860', display: 'block', marginBottom: 6, fontWeight: 600, letterSpacing: '0.08em' }}>
                JOB TITLE *
              </label>
              <input style={inp} placeholder="e.g. Electrical Panel Repair"
                value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#6B6860', display: 'block', marginBottom: 6, fontWeight: 600, letterSpacing: '0.08em' }}>
                LOCATION *
              </label>
              <input style={inp} placeholder="e.g. Kandy"
                value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#6B6860', display: 'block', marginBottom: 6, fontWeight: 600, letterSpacing: '0.08em' }}>
                PRIORITY
              </label>
              <select style={{ ...inp, cursor: 'pointer' }}
                value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#6B6860', display: 'block', marginBottom: 6, fontWeight: 600, letterSpacing: '0.08em' }}>
                DESCRIPTION
              </label>
              <input style={inp} placeholder="Brief description..."
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button onClick={create} style={{
              background: '#2C4A3E', color: '#fff', border: 'none',
              padding: '11px 24px', borderRadius: 8, fontSize: 14,
              fontFamily: 'Jost', fontWeight: 500, cursor: 'pointer',
            }}>
              {isClient ? 'Submit Request' : 'Create Job'}
            </button>
            <button onClick={() => setShowForm(false)} style={{
              background: 'none', border: '1px solid #E4E0D8', color: '#6B6860',
              padding: '11px 24px', borderRadius: 8, fontSize: 14,
              fontFamily: 'Jost', cursor: 'pointer',
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E4E0D8', marginBottom: 20 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '11px 18px', fontSize: 13, fontFamily: 'Jost',
            color: activeTab === t ? '#2C4A3E' : '#A8A49C',
            background: 'none', border: 'none',
            borderBottom: activeTab === t ? '2px solid #2C4A3E' : '2px solid transparent',
            marginBottom: -1, cursor: 'pointer',
            fontWeight: activeTab === t ? 600 : 400,
          }}>
            {t.replace('_', ' ')} ({t === 'ALL' ? jobs.length : jobs.filter(j => j.status === t).length})
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2.5fr 1fr 0.8fr 1.2fr 1fr 130px',
          padding: '12px 22px',
          background: '#FAFAF7',
          borderBottom: '1px solid #E4E0D8',
          fontSize: 11, color: '#A8A49C',
          letterSpacing: '0.12em', fontWeight: 600,
        }}>
          <span>JOB TITLE</span>
          <span>LOCATION</span>
          <span>PRIORITY</span>
          <span>ASSIGNED TO</span>
          <span>STATUS</span>
          <span>ACTION</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#A8A49C', fontSize: 14 }}>
            No jobs found.
          </div>
        ) : filtered.map(job => {
          const s = statusStyle[job.status] || statusStyle.PENDING
          const p = priorityStyle[job.priority] || priorityStyle.MEDIUM
          return (
            <div key={job.id} style={{
              display: 'grid',
              gridTemplateColumns: '2.5fr 1fr 0.8fr 1.2fr 1fr 130px',
              padding: '16px 22px',
              borderBottom: '1px solid #F2EFE9',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1C1C1A', marginBottom: 2 }}>
                  {job.title}
                </div>
                <div style={{ fontSize: 12, color: '#A8A49C' }}>
                  {job.client?.name || 'N/A'}
                </div>
              </div>

              <div style={{ fontSize: 14, color: '#6B6860' }}>{job.location}</div>

              <div>
                <span style={{
                  background: p.bg, color: p.color,
                  fontSize: 11, fontWeight: 700,
                  padding: '3px 8px', borderRadius: 4,
                }}>
                  {job.priority}
                </span>
              </div>

              <div style={{ fontSize: 14, color: job.worker ? '#1C1C1A' : '#A8A49C' }}>
                {job.worker?.user.name || '— Unassigned'}
              </div>

              <div>
                <span style={{
                  background: s.bg, color: s.color,
                  fontSize: 12, fontWeight: 500,
                  padding: '4px 10px', borderRadius: 20,
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                  {job.status.replace('_', ' ')}
                </span>
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>

                {/* ADMIN ONLY — AI Assign on PENDING */}
                {isAdmin && job.status === 'PENDING' && (
                  <button onClick={() => setSelectedJob(job)} style={{
                    background: '#F5EDD8', color: '#B8964E', border: 'none',
                    padding: '6px 10px', borderRadius: 7, fontSize: 11,
                    fontFamily: 'Jost', fontWeight: 600, cursor: 'pointer',
                  }}>
                    AI Assign
                  </button>
                )}

                {/* ADMIN + HR — Start/Complete */}
                {(isAdmin || isHR) && nextStatus[job.status] && (
                  <button
                    onClick={() => updateStatus(job.id, nextStatus[job.status])}
                    disabled={updatingId === job.id}
                    style={{
                      background: '#2C4A3E', color: '#fff', border: 'none',
                      padding: '6px 10px', borderRadius: 7, fontSize: 11,
                      fontFamily: 'Jost', fontWeight: 600, cursor: 'pointer',
                      opacity: updatingId === job.id ? 0.6 : 1,
                    }}
                  >
                    {updatingId === job.id ? '...' : nextStatusLabel[job.status]}
                  </button>
                )}

                {/* FIELD WORKER — only on their assigned jobs */}
                {isWorker && job.workerId && nextStatus[job.status] && (
                  <button
                    onClick={() => updateStatus(job.id, nextStatus[job.status])}
                    disabled={updatingId === job.id}
                    style={{
                      background: '#2C4A3E', color: '#fff', border: 'none',
                      padding: '6px 10px', borderRadius: 7, fontSize: 11,
                      fontFamily: 'Jost', fontWeight: 600, cursor: 'pointer',
                      opacity: updatingId === job.id ? 0.6 : 1,
                    }}
                  >
                    {updatingId === job.id ? '...' : nextStatusLabel[job.status]}
                  </button>
                )}

                {/* View — everyone */}
                <a href={`/dashboard/jobs/${job.id}`} style={{
                  background: '#F6F4F0', color: '#6B6860', border: 'none',
                  padding: '6px 10px', borderRadius: 7, fontSize: 11,
                  fontFamily: 'Jost', cursor: 'pointer',
                  textDecoration: 'none', textAlign: 'center', display: 'block',
                }}>
                  View
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}