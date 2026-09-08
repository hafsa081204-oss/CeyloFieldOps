import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { NextRequest } from 'next/server'

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        job: {
          include: {
            client: true,
            worker: { include: { user: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return Response.json(payments)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch payments' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { jobId, amount } = body

    if (!jobId || !amount) {
      return Response.json({ error: 'Job and amount are required' }, { status: 400 })
    }

    const existing = await prisma.payment.findUnique({ where: { jobId } })
    if (existing) {
      return Response.json({ error: 'Invoice already exists for this job' }, { status: 400 })
    }

    const count = await prisma.payment.count()
    const invoiceNo = `INV-${String(count + 1).padStart(3, '0')}`

    const payment = await prisma.payment.create({
      data: {
        jobId,
        amount: parseFloat(amount),
        invoiceNo,
        status: 'PENDING',
      },
      include: {
        job: {
          include: {
            client: true,
            worker: { include: { user: true } },
          },
        },
      },
    })

    return Response.json(payment, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to create invoice' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { id, status } = body

    const payment = await prisma.payment.update({
      where: { id },
      data: { status },
      include: {
        job: {
          include: {
            client: true,
          },
        },
      },
    })

    return Response.json(payment)
  } catch (error) {
    return Response.json({ error: 'Failed to update payment' }, { status: 500 })
  }
}