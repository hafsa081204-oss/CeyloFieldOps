'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

type Payment = {
  id: string
  amount: number
  status: string
  invoiceNo: string
  createdAt: string
  job: {
    id: string
    title: string
    location: string
    client: { name: string }
    worker: { user: { name: string } } | null
  }
}

type CompletedJob = {
  id: string
  title: string
  location: string
  client: { name: string }
}

const statusStyle: Record<string, { bg: string; color: string }> = {
  PENDING: { bg: '#FEF3CD', color: '#92600A' },
  PAID: { bg: '#D1FAE5', color: '#065F46' },
  OVERDUE: { bg: '#FDECEA', color: '#C0392B' },
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [completedJobs, setCompletedJobs] = useState<CompletedJob[]>([])
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState('ALL')
  const [form, setForm] = useState({ jobId: '', amount: '' })
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()

  const canCreate = session?.user?.role === 'ADMIN'

  const loadPayments = () => {
    fetch('/api/payments')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setPayments(data)
      })
      .catch(() => {})
  }

  const loadCompletedJobs = () => {
  fetch('/api/jobs')
    .then(r => r.json())
    .then(data => {
      if (Array.isArray(data)) {
        const completed = data.filter((j: any) => 
          j.status === 'COMPLETED' && !j.payment
        )
        setCompletedJobs(completed)
      }
    })
    .catch(() => {})
}

  useEffect(() => {
    loadPayments()
    loadCompletedJobs()
  }, [])

  const createInvoice = async () => {
    if (!form.jobId || !form.amount) {
      alert('Please select a job and enter amount!')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setShowForm(false)
        setForm({ jobId: '', amount: '' })
        loadPayments()
      } else {
        alert(data.error || 'Failed to create invoice')
      }
    } catch {
      alert('Something went wrong!')
    }
    setLoading(false)
  }

  const markAsPaid = async (id: string) => {
    await fetch('/api/payments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'PAID' }),
    })
    loadPayments()
  }

  const markAsOverdue = async (id: string) => {
    await fetch('/api/payments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'OVERDUE' }),
    })
    loadPayments()
  }

  const tabs = ['ALL', 'PENDING', 'PAID', 'OVERDUE']
  const filtered = activeTab === 'ALL'
    ? payments
    : payments.filter(p => p.status === activeTab)

  const total = payments.reduce((s, p) => s + p.amount, 0)
  const paid = payments.filter(p => p.status === 'PAID').reduce((s, p) => s + p.amount, 0)
  const outstanding = payments.filter(p => p.status !== 'PAID').reduce((s, p) => s + p.amount, 0)

  const inp: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #E4E0D8', borderRadius: 8,
    fontSize: 14, fontFamily: 'Jost', color: '#1C1C1A',
    outline: 'none', background: '#fff',
  }

  return (
    <div style={{ fontFamily: 'Jost' }}>

      {/* Completed Jobs Ready for Invoice */}
{canCreate && completedJobs.length > 0 && (
  <div style={{ background: '#fff', border: '1.5px solid #B8964E', borderRadius: 12, padding: 24, marginBottom: 24 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1C1C1A' }}>
          ✅ Jobs Ready for Invoice
        </div>
        <div style={{ fontSize: 13, color: '#A8A49C', marginTop: 2 }}>
          {completedJobs.length} completed job{completedJobs.length > 1 ? 's' : ''} without invoice
        </div>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {completedJobs.map(job => (
        <div key={job.id} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 16px', background: '#FAFAF7',
          border: '1px solid #E4E0D8', borderRadius: 8,
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1C1C1A' }}>{job.title}</div>
            <div style={{ fontSize: 12, color: '#A8A49C' }}>{job.client.name} · {job.location}</div>
          </div>
          <button
            onClick={() => {
              setForm({ jobId: job.id, amount: '' })
              setShowForm(true)
              window.scrollTo({ top: 300, behavior: 'smooth' })
            }}
            style={{
              background: '#B8964E', color: '#fff', border: 'none',
              padding: '8px 18px', borderRadius: 7, fontSize: 12,
              fontFamily: 'Jost', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Generate Invoice
          </button>
        </div>
      ))}
    </div>
  </div>
)}

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 28 }}>
        <div style={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 11, color: '#A8A49C', fontWeight: 600, letterSpacing: '0.12em', marginBottom: 10 }}>
            TOTAL INVOICED
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 32, color: '#1C1C1A', marginBottom: 4 }}>
            LKR {total.toLocaleString()}
          </div>
          <div style={{ fontSize: 13, color: '#A8A49C' }}>{payments.length} invoices total</div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 11, color: '#A8A49C', fontWeight: 600, letterSpacing: '0.12em', marginBottom: 10 }}>
            COLLECTED
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 32, color: '#27AE60', marginBottom: 4 }}>
            LKR {paid.toLocaleString()}
          </div>
          <div style={{ fontSize: 13, color: '#A8A49C' }}>
            {total > 0 ? Math.round((paid / total) * 100) : 0}% collection rate
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 11, color: '#A8A49C', fontWeight: 600, letterSpacing: '0.12em', marginBottom: 10 }}>
            OUTSTANDING
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 32, color: '#C0392B', marginBottom: 4 }}>
            LKR {outstanding.toLocaleString()}
          </div>
          <div style={{ fontSize: 13, color: '#A8A49C' }}>
            {payments.filter(p => p.status !== 'PAID').length} unpaid invoices
          </div>
        </div>
      </div>

      {/* Create Invoice Form */}
     {canCreate && showForm && (
  <div style={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: 12, padding: 28, marginBottom: 24 }}>
    <div style={{ fontSize: 18, fontWeight: 600, color: '#1C1C1A', marginBottom: 6 }}>
      Create New Invoice
    </div>
    <div style={{ fontSize: 13, color: '#A8A49C', marginBottom: 20 }}>
      Only completed jobs without an existing invoice are shown
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      <div>
        <label style={{ fontSize: 12, color: '#6B6860', display: 'block', marginBottom: 6, fontWeight: 600, letterSpacing: '0.08em' }}>
          SELECT COMPLETED JOB *
        </label>
        <select
          style={{ ...inp, cursor: 'pointer' }}
          value={form.jobId}
          onChange={e => setForm({ ...form, jobId: e.target.value })}
        >
          <option value="">Choose a completed job...</option>
          {completedJobs.map(job => (
            <option key={job.id} value={job.id}>
              {job.title} — {job.client.name} · {job.location}
            </option>
          ))}
        </select>
        {completedJobs.length === 0 && (
          <div style={{ fontSize: 12, color: '#C0392B', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            ⚠️ No completed jobs available. Complete a job first!
          </div>
        )}
      </div>
      <div>
        <label style={{ fontSize: 12, color: '#6B6860', display: 'block', marginBottom: 6, fontWeight: 600, letterSpacing: '0.08em' }}>
          INVOICE AMOUNT (LKR) *
        </label>
        <input
          style={inp}
          type="number"
          placeholder="e.g. 45000"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: e.target.value })}
        />
      </div>
    </div>
    <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
      <button
        onClick={createInvoice}
        disabled={loading || completedJobs.length === 0}
        style={{
          background: '#2C4A3E', color: '#fff', border: 'none',
          padding: '11px 24px', borderRadius: 8, fontSize: 14,
          fontFamily: 'Jost', fontWeight: 500, cursor: 'pointer',
          opacity: loading || completedJobs.length === 0 ? 0.5 : 1,
        }}
      >
        {loading ? 'Creating...' : '+ Create Invoice'}
      </button>
      <button
        onClick={() => setShowForm(false)}
        style={{
          background: 'none', border: '1px solid #E4E0D8', color: '#6B6860',
          padding: '11px 24px', borderRadius: 8, fontSize: 14,
          fontFamily: 'Jost', cursor: 'pointer',
        }}
      >
        Cancel
      </button>
    </div>
  </div>
)}

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{
          padding: '18px 22px', borderBottom: '1px solid #E4E0D8',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1C1C1A' }}>Invoice Records</div>
            <div style={{ fontSize: 13, color: '#A8A49C', marginTop: 2 }}>All payment transactions</div>
          </div>
          {canCreate && (
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                background: '#2C4A3E', color: '#fff', border: 'none',
                padding: '11px 22px', borderRadius: 8, fontSize: 14,
                fontFamily: 'Jost', fontWeight: 500, cursor: 'pointer',
              }}
            >
              {showForm ? 'Cancel' : '+ Create Invoice'}
            </button>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E4E0D8', padding: '0 22px' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: '11px 16px', fontSize: 13, fontFamily: 'Jost',
              color: activeTab === t ? '#2C4A3E' : '#A8A49C',
              background: 'none', border: 'none',
              borderBottom: activeTab === t ? '2px solid #2C4A3E' : '2px solid transparent',
              marginBottom: -1, cursor: 'pointer',
              fontWeight: activeTab === t ? 600 : 400,
            }}>
              {t} ({t === 'ALL' ? payments.length : payments.filter(p => p.status === t).length})
            </button>
          ))}
        </div>

        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 140px',
          padding: '12px 22px',
          background: '#FAFAF7',
          borderBottom: '1px solid #E4E0D8',
          fontSize: 11, color: '#A8A49C',
          letterSpacing: '0.12em', fontWeight: 600,
        }}>
          <span>JOB / CLIENT</span>
          <span>WORKER</span>
          <span>AMOUNT</span>
          <span>STATUS</span>
          <span>INVOICE NO</span>
          <span>ACTIONS</span>
        </div>

        {/* Table Rows */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#A8A49C', fontSize: 14 }}>
            {activeTab === 'ALL'
              ? 'No invoices yet. Complete a job and create an invoice!'
              : `No ${activeTab.toLowerCase()} invoices.`}
          </div>
        ) : filtered.map(p => {
          const s = statusStyle[p.status] || statusStyle.PENDING
          return (
            <div key={p.id} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 140px',
              padding: '16px 22px',
              borderBottom: '1px solid #F2EFE9',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1C1C1A', marginBottom: 2 }}>
                  {p.job.title}
                </div>
                <div style={{ fontSize: 12, color: '#A8A49C' }}>
                  {p.job.client.name} · {p.job.location}
                </div>
              </div>

              <div style={{ fontSize: 13, color: '#6B6860' }}>
                {p.job.worker?.user.name || '—'}
              </div>

              <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 18, color: '#1C1C1A', fontWeight: 500 }}>
                LKR {p.amount.toLocaleString()}
              </div>

              <div>
                <span style={{
                  background: s.bg, color: s.color,
                  fontSize: 12, fontWeight: 500,
                  padding: '4px 10px', borderRadius: 20,
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                  {p.status}
                </span>
              </div>

              <div style={{ fontSize: 13, color: '#6B6860', fontFamily: 'monospace' }}>
                {p.invoiceNo}
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                {p.status === 'PENDING' && canCreate && (
                  <>
                    <button
                      onClick={() => markAsPaid(p.id)}
                      style={{
                        background: '#D1FAE5', color: '#065F46',
                        border: 'none', padding: '6px 10px', borderRadius: 6,
                        fontSize: 11, fontFamily: 'Jost', fontWeight: 600,
                        cursor: 'pointer', whiteSpace: 'nowrap',
                      }}
                    >
                      ✓ Paid
                    </button>
                    <button
                      onClick={() => markAsOverdue(p.id)}
                      style={{
                        background: '#FDECEA', color: '#C0392B',
                        border: 'none', padding: '6px 10px', borderRadius: 6,
                        fontSize: 11, fontFamily: 'Jost', fontWeight: 600,
                        cursor: 'pointer', whiteSpace: 'nowrap',
                      }}
                    >
                      Overdue
                    </button>
                  </>
                )}
                {p.status === 'OVERDUE' && canCreate && (
                  <button
                    onClick={() => markAsPaid(p.id)}
                    style={{
                      background: '#D1FAE5', color: '#065F46',
                      border: 'none', padding: '6px 10px', borderRadius: 6,
                      fontSize: 11, fontFamily: 'Jost', fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    ✓ Mark Paid
                  </button>
                )}
                {p.status === 'PAID' && (
  <a href={`/dashboard/payments/invoice/${p.id}`}
    style={{
      background: '#F5EDD8', color: '#B8964E',
      border: 'none', padding: '6px 10px', borderRadius: 6,
      fontSize: 11, fontFamily: 'Jost', fontWeight: 600,
      cursor: 'pointer', textDecoration: 'none', display: 'inline-block',
    }}>
    🖨️ Print
  </a>
)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}