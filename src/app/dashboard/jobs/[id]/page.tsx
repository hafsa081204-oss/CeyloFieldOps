'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

type Job = {
  id: string
  title: string
  description: string
  location: string
  priority: string
  status: string
  createdAt: string
  assignedAt: string | null
  completedAt: string | null
  notes: string | null
  client: { name: string; email: string }
  worker: { user: { name: string; email: string }; location: string; rating: number } | null
  payment: { amount: number; status: string; invoiceNo: string } | null
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
  ASSIGNED: 'Mark as In Progress',
  IN_PROGRESS: 'Mark as Completed',
}

export default function JobDetailPage() {
  const { id } = useParams()
  const [job, setJob] = useState<Job | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const load = () => {
  fetch(`/api/jobs/${id}`)
    .then(r => r.json())
    .then(data => {
      if (data.error) setError(true)
      else setJob(data)
    })
    .catch(() => setError(true))
    .finally(() => setLoading(false))
}

  useEffect(() => { load() }, [id])

  const updateStatus = async (status: string) => {
    setUpdating(true)
    await fetch(`/api/jobs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    load()
    setUpdating(false)
  }

  const cancelJob = async () => {
    if (!confirm('Are you sure you want to cancel this job?')) return
    setUpdating(true)
    await fetch(`/api/jobs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CANCELLED' }),
    })
    load()
    setUpdating(false)
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, fontFamily: 'Jost', color: '#A8A49C', fontSize: 14 }}>
      Loading job details...
    </div>
  )

  if (loading) return (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, fontFamily: 'Jost', color: '#A8A49C', fontSize: 14 }}>
    Loading job details...
  </div>
)

if (!job || !job.status) return (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, fontFamily: 'Jost', color: '#A8A49C', fontSize: 14 }}>
    Job not found.
  </div>
)

  const s = statusStyle[job.status] || statusStyle.PENDING
  const p = priorityStyle[job.priority] || priorityStyle.MEDIUM

  return (
    <div style={{ fontFamily: 'Jost', maxWidth: 900, margin: '0 auto' }}>

      {/* Back Button */}
      <Link href="/dashboard/jobs" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        color: '#6B6860', fontSize: 13, textDecoration: 'none',
        marginBottom: 24, fontWeight: 500,
      }}>
        ← Back to Jobs
      </Link>

      {/* Header */}
      <div style={{
        background: '#fff', border: '1px solid #E4E0D8',
        borderRadius: 12, padding: 28, marginBottom: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{ background: s.bg, color: s.color, fontSize: 12, fontWeight: 600, padding: '5px 14px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                {job.status.replace('_', ' ')}
              </span>
              <span style={{ background: p.bg, color: p.color, fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 20 }}>
                {job.priority}
              </span>
            </div>
            <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: 34, fontWeight: 400, color: '#1C1C1A', marginBottom: 6 }}>
              {job.title}
            </h1>
            <div style={{ fontSize: 14, color: '#A8A49C' }}>
              📍 {job.location}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
            {nextStatus[job.status] && (
              <button
                onClick={() => updateStatus(nextStatus[job.status])}
                disabled={updating}
                style={{
                  background: '#2C4A3E', color: '#fff', border: 'none',
                  padding: '11px 22px', borderRadius: 8, fontSize: 14,
                  fontFamily: 'Jost', fontWeight: 500, cursor: 'pointer',
                  opacity: updating ? 0.7 : 1, whiteSpace: 'nowrap',
                }}
              >
                {updating ? 'Updating...' : nextStatusLabel[job.status]}
              </button>
            )}
            {job.status === 'COMPLETED' && (
              <div style={{ background: '#D1FAE5', color: '#065F46', padding: '11px 22px', borderRadius: 8, fontSize: 14, fontWeight: 600 }}>
                ✅ Job Completed
              </div>
            )}
            {job.status !== 'CANCELLED' && job.status !== 'COMPLETED' && (
              <button
                onClick={cancelJob}
                disabled={updating}
                style={{
                  background: 'none', border: '1.5px solid #E74C3C',
                  color: '#E74C3C', padding: '9px 18px', borderRadius: 8,
                  fontSize: 13, fontFamily: 'Jost', cursor: 'pointer',
                  opacity: updating ? 0.7 : 1,
                }}
              >
                Cancel Job
              </button>
            )}
          </div>
        </div>

        {/* Status Progress Bar */}
        <div style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', gap: 0, marginBottom: 8 }}>
            {['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].map((st, i) => {
              const statuses = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED']
              const currentIndex = statuses.indexOf(job.status)
              const stepIndex = statuses.indexOf(st)
              const isActive = stepIndex <= currentIndex
              const isCurrent = st === job.status
              return (
                <div key={st} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {i > 0 && <div style={{ flex: 1, height: 2, background: isActive ? '#2C4A3E' : '#E4E0D8' }} />}
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: isActive ? '#2C4A3E' : '#E4E0D8',
                      color: isActive ? '#fff' : '#A8A49C',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 600, flexShrink: 0,
                      border: isCurrent ? '2px solid #B8964E' : 'none',
                    }}>
                      {stepIndex < currentIndex ? '✓' : i + 1}
                    </div>
                    {i < 3 && <div style={{ flex: 1, height: 2, background: stepIndex < currentIndex ? '#2C4A3E' : '#E4E0D8' }} />}
                  </div>
                  <div style={{ fontSize: 10, color: isActive ? '#2C4A3E' : '#A8A49C', fontWeight: isCurrent ? 600 : 400, letterSpacing: '0.05em', textAlign: 'center' }}>
                    {st.replace('_', ' ')}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* Job Details */}
        <div style={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#1C1C1A', marginBottom: 18 }}>Job Details</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: 11, color: '#A8A49C', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4 }}>DESCRIPTION</div>
              <div style={{ fontSize: 14, color: '#1C1C1A', lineHeight: 1.6 }}>{job.description || 'No description provided'}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#A8A49C', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4 }}>LOCATION</div>
              <div style={{ fontSize: 14, color: '#1C1C1A' }}>📍 {job.location}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#A8A49C', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4 }}>CREATED</div>
              <div style={{ fontSize: 14, color: '#1C1C1A' }}>{new Date(job.createdAt).toLocaleDateString('en-LK', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            {job.assignedAt && (
              <div>
                <div style={{ fontSize: 11, color: '#A8A49C', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4 }}>ASSIGNED</div>
                <div style={{ fontSize: 14, color: '#1C1C1A' }}>{new Date(job.assignedAt).toLocaleDateString('en-LK', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
            )}
            {job.completedAt && (
              <div>
                <div style={{ fontSize: 11, color: '#A8A49C', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4 }}>COMPLETED</div>
                <div style={{ fontSize: 14, color: '#1C1C1A' }}>{new Date(job.completedAt).toLocaleDateString('en-LK', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
            )}
          </div>
        </div>

        {/* People */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Client */}
          <div style={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1C1C1A', marginBottom: 16 }}>Client</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#F5EDD8', color: '#B8964E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond', fontSize: 20, fontWeight: 600 }}>
                {job.client?.name?.[0]}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1C1C1A' }}>{job.client?.name}</div>
                <div style={{ fontSize: 13, color: '#A8A49C' }}>{job.client?.email}</div>
              </div>
            </div>
          </div>

          {/* Worker */}
          <div style={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1C1C1A', marginBottom: 16 }}>Assigned Worker</div>
            {job.worker ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#2C4A3E', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond', fontSize: 20 }}>
                  {job.worker.user.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1C1C1A' }}>{job.worker.user.name}</div>
                  <div style={{ fontSize: 13, color: '#A8A49C' }}>📍 {job.worker.location} · ⭐ {job.worker.rating}/5</div>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 14, color: '#A8A49C', textAlign: 'center', padding: '20px 0' }}>
                No worker assigned yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment */}
      {job.payment && (
        <div style={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#1C1C1A', marginBottom: 16 }}>Payment</div>
          <div style={{ display: 'flex', gap: 40 }}>
            <div>
              <div style={{ fontSize: 11, color: '#A8A49C', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4 }}>AMOUNT</div>
              <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 28, color: '#1C1C1A' }}>LKR {job.payment.amount.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#A8A49C', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4 }}>STATUS</div>
              <div style={{ fontSize: 14, color: '#27AE60', fontWeight: 600 }}>{job.payment.status}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#A8A49C', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4 }}>INVOICE</div>
              <div style={{ fontSize: 14, color: '#1C1C1A', fontFamily: 'monospace' }}>{job.payment.invoiceNo}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}