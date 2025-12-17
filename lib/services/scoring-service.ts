import Groq from 'groq-sdk';
import { SYSTEM_PROMPT } from '@/lib/prompts/system-prompt';
import { buildUserPrompt } from '@/lib/prompts/user-prompt';
import { 
  safeValidateScoringResponse, 
  type ScoringResponse 
} from '@/lib/schema/scoring-schema';
import {
  countWords,
  detectLanguage,
  validateEssayLength,
  sanitizeEssayText,
} from '@/lib/utils/scoring-utils';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'demo-key',
});

export interface ScoreEssayRequest {
  taskType: 'task1' | 'task2';
  module: 'academic' | 'general';
  promptText: string;
  essayText: string;
}

export interface TransformedScoringData {
  overallBand: number;
  criteriaScores: {
    taskAchievement?: number;
    taskResponse?: number;
    coherenceCohesion: number;
    lexicalResource: number;
    grammaticalRangeAccuracy: number;
  };
  executiveSummary: string;
  criteriaFeedback: {
    taskAchievement: string;
    coherenceCohesion: string;
    lexicalResource: string;
    grammaticalRangeAccuracy: string;
  };
  highlightedIssues: Array<{
    type: string;
    text: string;
    explanation: string;
    suggestion: string;
  }>;
  revisionPlan: Array<{
    title: string;
    description: string;
    impact: string;
  }>;
  educatorNotes: string;
}

export interface ScoreEssayResponse {
  success: boolean;
  data?: TransformedScoringData;
  error?: string;
  warnings?: string[];
}

// Transform the AI response to match database schema
function transformScoringData(validated: ScoringResponse): TransformedScoringData {
  return {
    ...validated, // Keep all original data
    overallBand: validated.scores.overall.rounded_band,
    criteriaScores: {
      taskAchievement: validated.scores.task_achievement_or_response.rounded_band,
      taskResponse: validated.scores.task_achievement_or_response.rounded_band,
      coherenceCohesion: validated.scores.coherence_and_cohesion.rounded_band,
      lexicalResource: validated.scores.lexical_resource.rounded_band,
      grammaticalRangeAccuracy: validated.scores.grammatical_range_and_accuracy.rounded_band,
    },
    executiveSummary: validated.feedback.summary_comment,
    criteriaFeedback: {
      taskAchievement: validated.feedback.criterion_feedback.task_achievement_or_response.comment,
      coherenceCohesion: validated.feedback.criterion_feedback.coherence_and_cohesion.comment,
      lexicalResource: validated.feedback.criterion_feedback.lexical_resource.comment,
      grammaticalRangeAccuracy: validated.feedback.criterion_feedback.grammatical_range_and_accuracy.comment,
    },
    highlightedIssues: validated.feedback.highlights.map(h => ({
      type: h.type,
      text: h.text_snippet,
      explanation: h.issue_explanation,
      suggestion: h.suggested_correction,
    })),
    revisionPlan: validated.feedback.revision_plan.map(r => ({
      title: r.title,
      description: r.description,
      impact: r.estimated_impact,
    })),
    educatorNotes: validated.notes_for_teacher,
  } as any; // Cast to maintain compatibility
}

export async function scoreEssay(
  request: ScoreEssayRequest
): Promise<ScoreEssayResponse> {
  const { taskType, module, promptText, essayText } = request;
  
  // Pre-validation
  const warnings: string[] = [];
  
  // Sanitize essay text
  const cleanEssay = sanitizeEssayText(essayText);
  
  // Count words
  const wordCount = countWords(cleanEssay);
  
  // Check essay length
  const lengthCheck = validateEssayLength(wordCount, taskType);
  if (!lengthCheck.valid) {
    return {
      success: false,
      error: lengthCheck.warning,
    };
  }
  if (lengthCheck.warning) {
    warnings.push(lengthCheck.warning);
  }
  
  // Check language
  const langCheck = detectLanguage(cleanEssay);
  if (!langCheck.isEnglish) {
    return {
      success: false,
      error: 'Essay does not appear to be in English.',
    };
  }
  
  try {
    // Build prompt
    const userPrompt = buildUserPrompt(taskType, module, promptText, cleanEssay);
    
    // Call Groq API with optimized parameters for accuracy
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2, // Lower temperature for more consistent scoring
      max_tokens: 4000, // Ensure detailed feedback
      top_p: 0.95,
      response_format: { type: 'json_object' },
    });
    
    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      return {
        success: false,
        error: 'No response from AI model.',
      };
    }
    
    // Parse JSON
    let parsedData: unknown;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      return {
        success: false,
        error: 'Failed to parse AI response as JSON.',
      };
    }
    
    // Validate against schema
    const validation = safeValidateScoringResponse(parsedData);
    
    if (!validation.success) {
      // Retry once with correction prompt
      try {
        const correctionCompletion = await groq.chat.completions.create({
          model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
            { role: 'assistant', content: responseText },
            { 
              role: 'user', 
              content: `Your last response had validation errors: ${validation.error}. Please provide a corrected JSON response that matches the schema exactly.` 
            },
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' },
        });
        
        const correctedText = correctionCompletion.choices[0]?.message?.content;
        if (correctedText) {
          const correctedData = JSON.parse(correctedText);
          const secondValidation = safeValidateScoringResponse(correctedData);
          
          if (secondValidation.success && secondValidation.data) {
            return {
              success: true,
              data: transformScoringData(secondValidation.data),
              warnings,
            };
          }
        }
      } catch (retryError) {
        // Fall through to return original error
      }
      
      return {
        success: false,
        error: `AI response validation failed: ${validation.error}`,
      };
    }
    
    if (!validation.data) {
      return {
        success: false,
        error: 'Validation succeeded but no data was returned',
      };
    }
    
    return {
      success: true,
      data: transformScoringData(validation.data),
      warnings,
    };
    
  } catch (error) {
    console.error('Error scoring essay:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
