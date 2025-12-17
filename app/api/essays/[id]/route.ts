import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const essay = await prisma.essay.findUnique({
      where: {
        id: params.id,
      },
      include: {
        result: true,
      },
    })

    if (!essay) {
      return NextResponse.json(
        { error: 'Essay not found' },
        { status: 404 }
      )
    }

    // Check if essay belongs to the user
    if (essay.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Parse JSON strings back to objects
    if (essay.result) {
      return NextResponse.json({
        essay: {
          ...essay,
          result: {
            ...essay.result,
            criteriaFeedback: JSON.parse(essay.result.criteriaFeedback),
            highlightedIssues: JSON.parse(essay.result.highlightedIssues),
            revisionPlan: JSON.parse(essay.result.revisionPlan),
          },
        },
      })
    }

    return NextResponse.json({ essay })
  } catch (error) {
    console.error('Failed to fetch essay:', error)
    return NextResponse.json(
      { error: 'Failed to fetch essay' },
      { status: 500 }
    )
  }
}
