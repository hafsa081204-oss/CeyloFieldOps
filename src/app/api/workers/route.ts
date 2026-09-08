import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

function canManage(role: string | undefined) {
  return role === 'ADMIN' || role === 'HR_MANAGER'
}

export async function GET() {
  try {
    const workers = await prisma.worker.findMany({
      include: { user: true },
      orderBy: { rating: 'desc' },
    })
    return NextResponse.json(workers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch workers' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!canManage(session?.user?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { name, email, password, location, skills, latitude, longitude } = body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'FIELD_WORKER',
      },
    })

    const worker = await prisma.worker.create({
      data: {
        userId: user.id,
        location,
        skills: skills.split(',').map((s: string) => s.trim()),
        latitude: parseFloat(latitude) || 7.8731,
        longitude: parseFloat(longitude) || 80.7718,
        isAvailable: true,
        rating: 0,
        completedJobs: 0,
      },
      include: { user: true },
    })

    return NextResponse.json(worker, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create worker' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!canManage(session?.user?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { id, location, skills, isAvailable, latitude, longitude } = body

    const worker = await prisma.worker.update({
      where: { id },
      data: {
        location,
        skills: typeof skills === 'string' ? skills.split(',').map((s: string) => s.trim()) : skills,
        isAvailable,
        latitude: parseFloat(latitude) || 7.8731,
        longitude: parseFloat(longitude) || 80.7718,
      },
      include: { user: true },
    })

    return NextResponse.json(worker)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update worker' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!canManage(session?.user?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const worker = await prisma.worker.findUnique({ where: { id } })
    if (!worker) return NextResponse.json({ error: 'Worker not found' }, { status: 404 })

    await prisma.worker.delete({ where: { id } })
    await prisma.user.delete({ where: { id: worker.userId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete worker' }, { status: 500 })
  }
}