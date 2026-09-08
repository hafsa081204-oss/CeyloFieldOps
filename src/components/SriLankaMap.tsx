'use client'
import { useEffect, useRef } from 'react'

type Worker = {
  latitude: number
  longitude: number
  location: string
  rating: number
  user: { name: string }
}

type Job = {
  latitude: number
  longitude: number
  title: string
  status: string
}

export default function SriLankaMap({
  workers = [],
  jobs = [],
}: {
  workers: Worker[]
  jobs: Job[]
}) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!mapRef.current) return

    // If map already exists, destroy it first
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    import('leaflet').then(L => {
      // Safety check after async import
      if (!mapRef.current) return
      if (mapInstanceRef.current) return

      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current, {
        center: [7.8731, 80.7718],
        zoom: 8,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '©OpenStreetMap ©CartoDB',
        subdomains: 'abcd',
      }).addTo(map)

      workers.forEach(worker => {
        const icon = L.divIcon({
          html: `<div style="width:16px;height:16px;background:#B8964E;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px #00000030;"></div>`,
          iconSize: [16, 16],
          className: '',
        })
        L.marker([worker.latitude, worker.longitude], { icon })
          .bindPopup(`<b style="color:#2C4A3E">${worker.user?.name}</b><br>${worker.location}<br>⭐ ${worker.rating}/5`)
          .addTo(map)
      })

      jobs.forEach(job => {
        const icon = L.divIcon({
          html: `<div style="width:12px;height:12px;background:#2E5D8E;border-radius:3px;border:2px solid #fff;box-shadow:0 2px 6px #00000025;"></div>`,
          iconSize: [12, 12],
          className: '',
        })
        L.marker([job.latitude, job.longitude], { icon })
          .bindPopup(`<b>${job.title}</b><br>${job.status}`)
          .addTo(map)
      })

      mapInstanceRef.current = map
    })

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [workers, jobs])

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} style={{ width: '100%', height: '520px' }} />
    </>
  )
}