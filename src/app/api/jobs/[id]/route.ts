import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        client: true,
        worker: { include: { user: true } },
        payment: true,
      },
    })
    if (!job) return Response.json({ error: 'Job not found' }, { status: 404 })
    return Response.json(job)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch job' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { status } = body
    const updateData: any = { status }

    if (status === 'COMPLETED') {
      updateData.completedAt = new Date()
      const job = await prisma.job.findUnique({
        where: { id },
        include: { worker: true },
      })
      if (job?.workerId) {
        await prisma.worker.update({
          where: { id: job.workerId },
          data: { completedJobs: { increment: 1 }, isAvailable: true },
        })
      }
    }

    if (status === 'IN_PROGRESS') {
      const job = await prisma.job.findUnique({
        where: { id },
        include: { worker: true },
      })
      if (job?.workerId) {
        await prisma.worker.update({
          where: { id: job.workerId },
          data: { isAvailable: false },
        })
      }
    }

    const job = await prisma.job.update({
      where: { id },
      data: updateData,
      include: {
        client: true,
        worker: { include: { user: true } },
      },
    })
    return Response.json(job)
  } catch (error) {
    return Response.json({ error: 'Failed to update job' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    await prisma.job.delete({ where: { id } })
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: 'Failed to delete job' }, { status: 500 })
  }
}