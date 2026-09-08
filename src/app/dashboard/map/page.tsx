'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const SriLankaMap = dynamic(() => import('@/components/SriLankaMap'), { ssr: false })

type Worker = { id: string; latitude: number; longitude: number; location: string; rating: number; user: { name: string } }
type Job = { id: string; latitude: number; longitude: number; title: string; status: string }

export default function MapPage() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    fetch('/api/workers').then(r => r.json()).then(setWorkers).catch(() => {})
    fetch('/api/jobs').then(r => r.json()).then(setJobs).catch(() => {})
  }, [])

  return (
    <div style={{ fontFamily: 'Jost' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: '#6B6860' }}>
          Simulation mode · {workers.length} workers · {jobs.length} job sites
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 14, color: '#6B6860' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#B8964E' }} />
            Workers ({workers.length})
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 14, color: '#6B6860' }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: '#2E5D8E' }} />
            Job Sites ({jobs.length})
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: 12, overflow: 'hidden' }}>
        <SriLankaMap workers={workers} jobs={jobs} />
      </div>
    </div>
  )
}