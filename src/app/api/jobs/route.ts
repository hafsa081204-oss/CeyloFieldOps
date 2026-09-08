import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { NextRequest } from 'next/server'

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        worker: { include: { user: true } },
        client: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return Response.json(jobs)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    if (!body.title || !body.location) {
      return Response.json({ error: 'Title and location are required' }, { status: 400 })
    }

    const job = await prisma.job.create({
      data: {
        title: body.title,
        description: body.description || '',
        location: body.location,
        latitude: parseFloat(body.latitude) || 7.8731,
        longitude: parseFloat(body.longitude) || 80.7718,
        priority: body.priority || 'MEDIUM',
        clientId: session.user.id,
      },
      include: {
        client: true,
        worker: { include: { user: true } },
      },
    })

    return Response.json(job, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to create job' }, { status: 500 })
  }
}