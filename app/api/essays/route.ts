import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const essays = await prisma.essay.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        result: {
          select: {
            overallBand: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    })

    return NextResponse.json({ essays })
  } catch (error) {
    console.error('Failed to fetch essays:', error)
    return NextResponse.json(
      { error: 'Failed to fetch essays' },
      { status: 500 }
    )
  }
}
