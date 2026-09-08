import { prisma } from '@/lib/prisma'

export async function GET() {
  const [jobs, workers, pending, completed] = await Promise.all([
    prisma.job.count(),
    prisma.worker.count({ where: { isAvailable: true } }),
    prisma.job.count({ where: { status: 'PENDING' } }),
    prisma.job.count({ where: { status: 'COMPLETED' } }),
  ])
  return Response.json({ jobs, workers, pending, completed })
}