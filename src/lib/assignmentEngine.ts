import { Worker, User, Job } from '@prisma/client'

type WorkerWithUser = Worker & { user: User }

type ScoredWorker = {
  worker: WorkerWithUser
  score: number
  confidence: number
  reasons: string[]
  distanceKm: string
}

function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function scoreWorkers(job: Job, workers: WorkerWithUser[]): ScoredWorker[] {
  return workers
    .filter(w => w.isAvailable)
    .map(worker => {
      let score = 0
      const reasons: string[] = []

      const dist = haversineDistance(
        job.latitude, job.longitude,
        worker.latitude, worker.longitude
      )
      const distScore = Math.max(0, 40 - dist * 0.5)
      score += distScore
      reasons.push(`Distance: ${dist.toFixed(1)}km (${distScore.toFixed(0)}pts)`)

      const ratingScore = (worker.rating / 5) * 30
      score += ratingScore
      reasons.push(`Rating: ${worker.rating}/5 (${ratingScore.toFixed(0)}pts)`)

      const workloadScore = Math.max(0, 20 - worker.completedJobs * 0.5)
      score += workloadScore
      reasons.push(`Workload: ${worker.completedJobs} jobs (${workloadScore.toFixed(0)}pts)`)

      const jobWords = (job.title + ' ' + job.description).toLowerCase()
      const skillMatches = worker.skills.filter(
        s => jobWords.includes(s.toLowerCase())
      ).length
      const skillScore = Math.min(10, skillMatches * 5)
      score += skillScore
      if (skillMatches > 0)
        reasons.push(`Skills matched: ${skillMatches} (${skillScore}pts)`)

      return {
        worker,
        score: Math.round(score),
        confidence: Math.min(100, Math.round(score)),
        reasons,
        distanceKm: dist.toFixed(1),
      }
    })
    .sort((a, b) => b.score - a.score)
}