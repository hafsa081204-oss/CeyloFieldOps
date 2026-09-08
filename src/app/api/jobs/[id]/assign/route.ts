import { prisma } from '@/lib/prisma'
import { scoreWorkers } from '@/lib/assignmentEngine'
import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const job = await prisma.job.findUnique({ where: { id } })
    if (!job) return Response.json({ error: 'Job not found' }, { status: 404 })

    const workers = await prisma.worker.findMany({
      include: { user: true },
      where: { isAvailable: true },
    })

    if (workers.length === 0) return Response.json([])

    const ranked = scoreWorkers(job, workers)
    return Response.json(ranked.slice(0, 3))
  } catch (error) {
    return Response.json({ error: 'Failed to get suggestions' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { workerId } = await req.json()
    const job = await prisma.job.update({
      where: { id },
      data: { workerId, status: 'ASSIGNED', assignedAt: new Date() },
    })
    return Response.json(job)
  } catch (error) {
    return Response.json({ error: 'Failed to assign worker' }, { status: 500 })
  }
}