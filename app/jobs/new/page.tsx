'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Topbar  from '@/components/Topbar'
import { MOCK_WORKERS, JOB_CATEGORIES, type JobStatus, type JobPriority } from '@/lib/constants'

interface FormData {
  title:          string
  client:         string
  workerId:       string
  location:       string
  category:       string
  priority:       JobPriority
  status:         JobStatus
  date:           string
  amount:         string
  estimatedHours: string
  description:    string
  notes:          string
}

const EMPTY: FormData = {
  title:'', client:'', workerId:'', location:'',
  category:'Electrical', priority:'medium', status:'pending',
  date:'', amount:'', estimatedHours:'', description:'', notes:'',
}

const PRIORITY_COLORS: Record<JobPriority, string> = {
  low:'#6b7280', medium:'#f59e0b', high:'#f97316', critical:'#ef4444',
}

const STATUS_COLORS: Record<'pending' | 'in-progress', string> = {
  pending:'#f59e0b', 'in-progress':'#60a5fa',
}

export default function NewJobPage() {
  const router = useRouter()
  const [form,   setForm]   = useState<FormData>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  function update(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.title.trim())       e.title       = 'Job title is required'
    if (!form.client.trim())      e.client      = 'Client name is required'
    if (!form.location.trim())    e.location    = 'Location is required'
    if (!form.date)               e.date        = 'Date is required'
    if (!form.amount.trim())      e.amount      = 'Amount is required'
    if (!form.description.trim()) e.description = 'Description is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setSaving(true)
    await new Promise<void>(resolve => setTimeout(resolve, 1200))
    setSaving(false)
    setSaved(true)
    await new Promise<void>(resolve => setTimeout(resolve, 800))
    router.push('/jobs')
  }

  const selectedWorker = MOCK_WORKERS.find(w => w.id === form.workerId)

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
        .content { padding: 28px 32px; flex: 1; max-width: 900px; }

        .back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 10px; border: 1px solid var(--border);
          background: var(--surface); color: var(--text2); font-size: 12px;
          cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; margin-bottom: 24px;
        }
        .back-btn:hover { border-color: var(--border2); color: var(--text); }

        .form-header { margin-bottom: 32px; animation: fadeSlide 0.4s var(--ease-out) both; }
        .form-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 900; color: var(--text); margin-bottom: 6px; }
        .form-sub { font-size: 13px; color: var(--text3); }

        .form-section {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; padding: 28px; margin-bottom: 20px;
          animation: fadeSlide 0.4s var(--ease-out) both;
        }
        .fs-title {
          font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700;
          color: var(--text); margin-bottom: 20px; display: flex; align-items: center; gap: 8px;
          padding-bottom: 14px; border-bottom: 1px solid var(--border);
        }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-grid.three { grid-template-columns: 1fr 1fr 1fr; }
        .form-grid.one   { grid-template-columns: 1fr; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field.span2 { grid-column: 1 / -1; }
        .field-label {
          font-size: 9px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
          color: var(--text3); transition: color 0.2s;
        }
        .field.has-error .field-label { color: #f87171; }
        .field-inp, .field-sel, .field-ta {
          padding: 12px 16px; background: rgba(255,255,255,0.04);
          border: 1px solid var(--border); border-radius: 12px;
          color: var(--text); font-size: 13px; font-family: 'DM Sans', sans-serif;
          font-weight: 300; outline: none; transition: all 0.25s;
        }
        .field-inp:focus, .field-sel:focus, .field-ta:focus {
          border-color: rgba(99,102,241,0.4);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
          background: rgba(255,255,255,0.06);
        }
        .field.has-error .field-inp,
        .field.has-error .field-sel,
        .field.has-error .field-ta {
          border-color: rgba(239,68,68,0.4);
        }
        .field-inp::placeholder, .field-ta::placeholder { color: rgba(255,255,255,0.12); }
        .field-ta { resize: vertical; min-height: 100px; line-height: 1.6; }
        .field-error { font-size: 11px; color: #f87171; }

        .chip-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .chip {
          padding: 8px 16px; border-radius: 100px; border: 1px solid var(--border);
          background: transparent; color: var(--text2); font-size: 12px; font-weight: 500;
          font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s;
        }
        .chip:hover { border-color: var(--border2); color: var(--text); }

        .worker-preview {
          margin-top: 10px; padding: 12px 16px;
          background: rgba(255,255,255,0.02); border: 1px solid var(--border);
          border-radius: 12px; display: flex; align-items: center; gap: 12px;
        }
        .wp-avatar {
          width: 36px; height: 36px; border-radius: 10px; display: flex;
          align-items: center; justify-content: center; font-size: 14px;
          background: linear-gradient(135deg,#059669,#0d9488); color: #fff;
          font-weight: 700; font-family: 'Playfair Display', serif; flex-shrink: 0;
        }
        .wp-name  { font-size: 13px; font-weight: 600; color: var(--text); }
        .wp-role  { font-size: 11px; color: var(--text3); }
        .wp-status {
          margin-left: auto; padding: 3px 10px; border-radius: 100px;
          font-size: 10px; font-weight: 600;
        }

        .submit-bar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 28px; background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; animation: fadeSlide 0.4s 0.3s var(--ease-out) both;
        }
        .submit-info { font-size: 12px; color: var(--text3); }
        .submit-actions { display: flex; gap: 10px; }
        .btn-cancel {
          padding: 12px 24px; border-radius: 12px; border: 1px solid var(--border);
          background: transparent; color: var(--text2); font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .btn-cancel:hover { border-color: var(--border2); color: var(--text); }
        .btn-submit {
          padding: 12px 28px; border-radius: 12px; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          color: #fff; letter-spacing: 0.5px; transition: all 0.3s;
          position: relative; overflow: hidden; min-width: 140px;
          background: linear-gradient(135deg,#1a6cf6,#7c3aed);
          box-shadow: 0 4px 20px rgba(99,102,241,0.3);
        }
        .btn-submit::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(180deg,rgba(255,255,255,0.15),transparent 60%);
        }
        .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(99,102,241,0.4); }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

        .success-flash {
          position: fixed; top: 20px; right: 20px; z-index: 100;
          padding: 14px 20px; border-radius: 14px;
          background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3);
          color: #34d399; font-size: 13px; font-weight: 500;
          display: flex; align-items: center; gap: 10px;
          animation: slideInRight 0.4s var(--ease-out) both;
          font-family: 'DM Sans', sans-serif;
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .loading-dots { display: flex; align-items: center; justify-content: center; gap: 5px; }
        .ld { width: 4px; height: 4px; border-radius: 50%; background: #fff; animation: ldot 1s ease-in-out infinite; }
        .ld:nth-child(2) { animation-delay: 0.15s; }
        .ld:nth-child(3) { animation-delay: 0.30s; }
        @keyframes ldot { 0%,80%,100%{transform:scale(0.6);opacity:0.3;} 40%{transform:scale(1.1);opacity:1;} }

        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {saved && (
        <div className="success-flash">✓ Job created successfully! Redirecting...</div>
      )}

      <div className="layout">
        <Sidebar />
        <main className="main">
          <Topbar title="Create New Job" subtitle="CeyloFieldOps / Jobs / New" />
          <div className="content">
            <button className="back-btn" onClick={() => router.push('/jobs')}>← Back to Jobs</button>

            <div className="form-header">
              <div className="form-title">New Job Assignment</div>
              <div className="form-sub">Fill in the details to create a new field service job</div>
            </div>

            {/* Section 1 */}
            <div className="form-section" style={{ animationDelay:'0.05s' }}>
              <div className="fs-title">◈ Basic Information</div>
              <div className="form-grid">
                <div className={'field span2' + (errors.title ? ' has-error' : '')}>
                  <label className="field-label">Job Title *</label>
                  <input className="field-inp" placeholder="e.g. Electrical Panel Repair" value={form.title} onChange={e => update('title', e.target.value)} />
                  {errors.title && <span className="field-error">⚠ {errors.title}</span>}
                </div>
                <div className={'field' + (errors.client ? ' has-error' : '')}>
                  <label className="field-label">Client Name *</label>
                  <input className="field-inp" placeholder="e.g. CEB Kandy" value={form.client} onChange={e => update('client', e.target.value)} />
                  {errors.client && <span className="field-error">⚠ {errors.client}</span>}
                </div>
                <div className={'field' + (errors.location ? ' has-error' : '')}>
                  <label className="field-label">Location *</label>
                  <input className="field-inp" placeholder="e.g. Kandy, Central Province" value={form.location} onChange={e => update('location', e.target.value)} />
                  {errors.location && <span className="field-error">⚠ {errors.location}</span>}
                </div>
                <div className="field">
                  <label className="field-label">Category</label>
                  <select className="field-sel" value={form.category} onChange={e => update('category', e.target.value)}>
                    {JOB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className={'field' + (errors.date ? ' has-error' : '')}>
                  <label className="field-label">Due Date *</label>
                  <input className="field-inp" type="date" value={form.date} onChange={e => update('date', e.target.value)} style={{ colorScheme:'dark' }} />
                  {errors.date && <span className="field-error">⚠ {errors.date}</span>}
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="form-section" style={{ animationDelay:'0.1s' }}>
              <div className="fs-title">◉ Priority & Status</div>
              <div className="form-grid">
                <div className="field">
                  <label className="field-label">Priority Level</label>
                  <div className="chip-row">
                    {(['low','medium','high','critical'] as JobPriority[]).map(pri => (
                      <button
                        key={pri}
                        className="chip"
                        onClick={() => update('priority', pri)}
                        style={form.priority === pri ? {
                          background:  PRIORITY_COLORS[pri] + '20',
                          borderColor: PRIORITY_COLORS[pri],
                          color:       PRIORITY_COLORS[pri],
                        } : {}}
                      >
                        ● {pri}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">Initial Status</label>
                  <div className="chip-row">
                    {(['pending','in-progress'] as const).map(st => (
                      <button
                        key={st}
                        className="chip"
                        onClick={() => update('status', st)}
                        style={form.status === st ? {
                          background:  STATUS_COLORS[st] + '20',
                          borderColor: STATUS_COLORS[st],
                          color:       STATUS_COLORS[st],
                        } : {}}
                      >
                        {st === 'pending' ? 'Pending' : 'In Progress'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="form-section" style={{ animationDelay:'0.15s' }}>
              <div className="fs-title">◆ Assignment & Financials</div>
              <div className="form-grid three">
                <div className="field">
                  <label className="field-label">Assign Worker</label>
                  <select className="field-sel" value={form.workerId} onChange={e => update('workerId', e.target.value)}>
                    <option value="">— Select worker —</option>
                    {MOCK_WORKERS.map(w => (
                      <option key={w.id} value={w.id}>{w.name} ({w.status})</option>
                    ))}
                  </select>
                  {selectedWorker && (
                    <div className="worker-preview">
                      <div className="wp-avatar">{selectedWorker.name[0]}</div>
                      <div>
                        <div className="wp-name">{selectedWorker.name}</div>
                        <div className="wp-role">{selectedWorker.role} · ★ {selectedWorker.rating}</div>
                      </div>
                      <span
                        className="wp-status"
                        style={{
                          background: selectedWorker.status === 'active' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                          color:      selectedWorker.status === 'active' ? '#34d399' : '#f59e0b',
                        }}
                      >
                        {selectedWorker.status}
                      </span>
                    </div>
                  )}
                </div>
                <div className={'field' + (errors.amount ? ' has-error' : '')}>
                  <label className="field-label">Contract Amount (LKR) *</label>
                  <input className="field-inp" placeholder="e.g. 45000" value={form.amount} onChange={e => update('amount', e.target.value)} />
                  {errors.amount && <span className="field-error">⚠ {errors.amount}</span>}
                </div>
                <div className="field">
                  <label className="field-label">Estimated Hours</label>
                  <input className="field-inp" type="number" placeholder="e.g. 8" value={form.estimatedHours} onChange={e => update('estimatedHours', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="form-section" style={{ animationDelay:'0.2s' }}>
              <div className="fs-title">▣ Job Details</div>
              <div className="form-grid one">
                <div className={'field' + (errors.description ? ' has-error' : '')}>
                  <label className="field-label">Job Description *</label>
                  <textarea
                    className="field-ta"
                    placeholder="Describe the scope of work, tasks to be performed, and any specific requirements..."
                    value={form.description}
                    onChange={e => update('description', e.target.value)}
                    rows={4}
                  />
                  {errors.description && <span className="field-error">⚠ {errors.description}</span>}
                </div>
                <div className="field">
                  <label className="field-label">Internal Notes</label>
                  <textarea
                    className="field-ta"
                    placeholder="Any internal notes, special instructions, or reminders..."
                    value={form.notes}
                    onChange={e => update('notes', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="submit-bar">
              <div className="submit-info">
                Fields marked <span style={{ color:'rgba(255,255,255,0.6)' }}>*</span> are required ·{' '}
                {Object.keys(errors).length > 0
                  ? <span style={{ color:'#f87171' }}>{Object.keys(errors).length} error(s) found</span>
                  : <span style={{ color:'#34d399' }}>Form looks good</span>
                }
              </div>
              <div className="submit-actions">
                <button className="btn-cancel" onClick={() => router.push('/jobs')}>Cancel</button>
                <button className="btn-submit" onClick={handleSubmit} disabled={saving || saved}>
                  {saving ? (
                    <div className="loading-dots">
                      <div className="ld" /><div className="ld" /><div className="ld" />
                    </div>
                  ) : saved ? '✓ Saved!' : '+ Create Job'}
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  )
}