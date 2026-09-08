'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

type Worker = {
  id: string
  location: string
  skills: string[]
  rating: number
  completedJobs: number
  isAvailable: boolean
  latitude: number
  longitude: number
  user: { name: string; email: string }
}

const sriLankaLocations: Record<string, { lat: number; lng: number }> = {
  'Colombo': { lat: 6.9271, lng: 79.8612 },
  'Kandy': { lat: 7.2906, lng: 80.6337 },
  'Galle': { lat: 6.0535, lng: 80.2210 },
  'Jaffna': { lat: 9.6615, lng: 80.0255 },
  'Negombo': { lat: 7.2096, lng: 79.8378 },
  'Trincomalee': { lat: 8.5874, lng: 81.2152 },
  'Batticaloa': { lat: 7.7310, lng: 81.6747 },
  'Anuradhapura': { lat: 8.3114, lng: 80.4037 },
  'Matara': { lat: 5.9549, lng: 80.5550 },
  'Kurunegala': { lat: 7.4867, lng: 80.3647 },
}

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editWorker, setEditWorker] = useState<Worker | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    location: 'Kandy', skills: '', latitude: '', longitude: '',
  })
  const { data: session } = useSession()

  const canManage = session?.user?.role === 'ADMIN' || session?.user?.role === 'HR_MANAGER'

  const load = () => {
    fetch('/api/workers')
      .then(r => r.json())
      .then(setWorkers)
      .catch(() => {})
  }

  useEffect(() => { load() }, [])

  const handleLocationChange = (location: string) => {
    const coords = sriLankaLocations[location]
    if (coords) {
      setForm(f => ({ ...f, location, latitude: String(coords.lat), longitude: String(coords.lng) }))
    } else {
      setForm(f => ({ ...f, location }))
    }
  }

  const createWorker = async () => {
    if (!form.name || !form.email || !form.password || !form.skills) {
      alert('Please fill in all required fields!')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/workers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setShowForm(false)
        setForm({ name: '', email: '', password: '', location: 'Kandy', skills: '', latitude: '', longitude: '' })
        load()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to create worker')
      }
    } catch {
      alert('Something went wrong!')
    }
    setLoading(false)
  }

  const updateWorker = async () => {
    if (!editWorker) return
    setLoading(true)
    try {
      const res = await fetch('/api/workers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editWorker.id,
          location: form.location,
          skills: form.skills,
          isAvailable: editWorker.isAvailable,
          latitude: form.latitude || sriLankaLocations[form.location]?.lat,
          longitude: form.longitude || sriLankaLocations[form.location]?.lng,
        }),
      })
      if (res.ok) {
        setEditWorker(null)
        setShowForm(false)
        load()
      }
    } catch {
      alert('Something went wrong!')
    }
    setLoading(false)
  }

  const deleteWorker = async (id: string) => {
    if (!confirm('Are you sure you want to delete this worker?')) return
    await fetch(`/api/workers?id=${id}`, { method: 'DELETE' })
    load()
  }

  const openEdit = (w: Worker) => {
    setEditWorker(w)
    setForm({
      name: w.user.name,
      email: w.user.email,
      password: '',
      location: w.location,
      skills: w.skills.join(', '),
      latitude: String(w.latitude),
      longitude: String(w.longitude),
    })
    setShowForm(true)
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #E4E0D8', borderRadius: 8,
    fontSize: 14, fontFamily: 'Jost', color: '#1C1C1A',
    outline: 'none', background: '#fff',
  }

  return (
    <div style={{ fontFamily: 'Jost' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 14, color: '#6B6860' }}>
          {workers.length} workers · {workers.filter(w => w.isAvailable).length} available
        </div>
        {canManage && (
          <button
            onClick={() => { setEditWorker(null); setForm({ name: '', email: '', password: '', location: 'Kandy', skills: '', latitude: '', longitude: '' }); setShowForm(!showForm) }}
            style={{ background: '#2C4A3E', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: 8, fontSize: 14, fontFamily: 'Jost', fontWeight: 500, cursor: 'pointer' }}
          >
            {showForm ? 'Cancel' : '+ Add Worker'}
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {showForm && canManage && (
        <div style={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: 12, padding: 28, marginBottom: 28 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#1C1C1A', marginBottom: 20 }}>
            {editWorker ? 'Edit Worker' : 'Add New Worker'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {!editWorker && (
              <>
                <div>
                  <label style={{ fontSize: 12, color: '#6B6860', display: 'block', marginBottom: 6, fontWeight: 600, letterSpacing: '0.08em' }}>
                    FULL NAME *
                  </label>
                  <input style={inp} placeholder="e.g. Kasun Perera"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#6B6860', display: 'block', marginBottom: 6, fontWeight: 600, letterSpacing: '0.08em' }}>
                    EMAIL ADDRESS *
                  </label>
                  <input style={inp} type="email" placeholder="worker@email.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#6B6860', display: 'block', marginBottom: 6, fontWeight: 600, letterSpacing: '0.08em' }}>
                    PASSWORD *
                  </label>
                  <input style={inp} type="password" placeholder="Set login password"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                </div>
              </>
            )}

            <div>
              <label style={{ fontSize: 12, color: '#6B6860', display: 'block', marginBottom: 6, fontWeight: 600, letterSpacing: '0.08em' }}>
                LOCATION *
              </label>
              <select style={{ ...inp, cursor: 'pointer' }}
                value={form.location}
                onChange={e => handleLocationChange(e.target.value)}>
                {Object.keys(sriLankaLocations).map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 12, color: '#6B6860', display: 'block', marginBottom: 6, fontWeight: 600, letterSpacing: '0.08em' }}>
                SKILLS * (comma separated)
              </label>
              <input style={inp} placeholder="e.g. Electrical, Plumbing, Networking"
                value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
            <button
              onClick={editWorker ? updateWorker : createWorker}
              disabled={loading}
              style={{ background: '#2C4A3E', color: '#fff', border: 'none', padding: '11px 28px', borderRadius: 8, fontSize: 14, fontFamily: 'Jost', fontWeight: 500, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Saving...' : editWorker ? 'Update Worker' : 'Add Worker'}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditWorker(null) }}
              style={{ background: 'none', border: '1px solid #E4E0D8', color: '#6B6860', padding: '11px 28px', borderRadius: 8, fontSize: 14, fontFamily: 'Jost', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Workers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
        {workers.map(w => (
          <div key={w.id} style={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#2C4A3E', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond', fontSize: 24 }}>
                {w.user.name[0]}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: w.isAvailable ? '#27AE60' : '#E74C3C' }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: w.isAvailable ? '#27AE60' : '#E74C3C' }}>
                  {w.isAvailable ? 'Available' : 'Busy'}
                </span>
              </div>
            </div>

            <div style={{ fontSize: 17, fontWeight: 600, color: '#1C1C1A', marginBottom: 4 }}>{w.user.name}</div>
            <div style={{ fontSize: 13, color: '#A8A49C', marginBottom: 16 }}>📍 {w.location}</div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
              {w.skills.map(skill => (
                <span key={skill} style={{ background: '#F5EDD8', color: '#B8964E', fontSize: 12, padding: '4px 12px', borderRadius: 20, fontWeight: 500 }}>
                  {skill}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #E4E0D8', marginBottom: canManage ? 16 : 0 }}>
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 26, color: '#1C1C1A' }}>★ {w.rating.toFixed(1)}</div>
                <div style={{ fontSize: 12, color: '#A8A49C' }}>Rating</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 26, color: '#1C1C1A' }}>{w.completedJobs}</div>
                <div style={{ fontSize: 12, color: '#A8A49C' }}>Jobs Done</div>
              </div>
            </div>

            {canManage && (
              <div style={{ display: 'flex', gap: 10, borderTop: '1px solid #E4E0D8', paddingTop: 14 }}>
                <button
                  onClick={() => openEdit(w)}
                  style={{ flex: 1, padding: '9px', borderRadius: 7, border: '1.5px solid #2C4A3E', background: 'transparent', color: '#2C4A3E', cursor: 'pointer', fontSize: 13, fontFamily: 'Jost', fontWeight: 500 }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteWorker(w.id)}
                  style={{ flex: 1, padding: '9px', borderRadius: 7, border: '1.5px solid #E74C3C', background: 'transparent', color: '#E74C3C', cursor: 'pointer', fontSize: 13, fontFamily: 'Jost', fontWeight: 500 }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}

        {workers.length === 0 && (
          <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: 60, color: '#A8A49C', fontSize: 14 }}>
            No workers found. Add your first worker above.
          </div>
        )}
      </div>
    </div>
  )
}