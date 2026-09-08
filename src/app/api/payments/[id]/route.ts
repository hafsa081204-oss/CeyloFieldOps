import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            client: true,
            worker: { include: { user: true } },
          },
        },
      },
    })
    if (!payment) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(payment)
  } catch (error) {
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}