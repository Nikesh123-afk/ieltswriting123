import { NextRequest, NextResponse } from 'next/server';
import { scoreEssay, type ScoreEssayRequest } from '@/lib/services/scoring-service';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds timeout

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: ScoreEssayRequest = await request.json();
    
    // Validate required fields
    if (!body.taskType || !body.module || !body.promptText || !body.essayText) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: taskType, module, promptText, essayText' 
        },
        { status: 400 }
      );
    }
    
    // Validate field values
    if (!['task1', 'task2'].includes(body.taskType)) {
      return NextResponse.json(
        { success: false, error: 'taskType must be "task1" or "task2"' },
        { status: 400 }
      );
    }
    
    if (!['academic', 'general'].includes(body.module)) {
      return NextResponse.json(
        { success: false, error: 'module must be "academic" or "general"' },
        { status: 400 }
      );
    }
    
    // Check Groq API key
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Groq API key not configured' },
        { status: 500 }
      );
    }
    
    // Score the essay
    const result = await scoreEssay(body);
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    // Save essay and results to database
    const wordCount = body.essayText.trim().split(/\s+/).length;
    
    const essay = await prisma.essay.create({
      data: {
        userId: session.user.id,
        taskType: body.taskType,
        module: body.module,
        prompt: body.promptText,
        essay: body.essayText,
        wordCount,
        result: {
          create: {
            overallBand: result.data!.overallBand,
            taskAchievement: result.data!.criteriaScores.taskAchievement ?? result.data!.criteriaScores.taskResponse ?? 0,
            coherenceCohesion: result.data!.criteriaScores.coherenceCohesion,
            lexicalResource: result.data!.criteriaScores.lexicalResource,
            grammaticalRange: result.data!.criteriaScores.grammaticalRangeAccuracy,
            executiveSummary: result.data!.executiveSummary,
            criteriaFeedback: JSON.stringify(result.data!.criteriaFeedback),
            highlightedIssues: JSON.stringify(result.data!.highlightedIssues),
            revisionPlan: JSON.stringify(result.data!.revisionPlan),
            educatorNotes: result.data!.educatorNotes,
          },
        },
      },
      include: {
        result: true,
      },
    });
    
    return NextResponse.json({
      ...result,
      essayId: essay.id,
    }, { status: 200 });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET endpoint to check API health
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'IELTS Writing Scorer API',
    apiKeyConfigured: !!process.env.OPENAI_API_KEY,
  });
}
