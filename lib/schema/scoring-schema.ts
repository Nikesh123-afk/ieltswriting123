import { z } from 'zod';

// Score schema with validation
const ScoreSchema = z.object({
  score: z.number().min(0).max(9),
  rounded_band: z.number().min(0).max(9),
});

// Highlight schema
const HighlightSchema = z.object({
  type: z.enum(['grammar', 'vocabulary', 'cohesion', 'task_response', 'other']),
  text_snippet: z.string(),
  issue_explanation: z.string(),
  suggested_correction: z.string(),
});

// Revision plan item schema
const RevisionPlanItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  estimated_impact: z.enum(['high', 'medium', 'low']),
});

// Criterion feedback schema
const CriterionFeedbackSchema = z.object({
  comment: z.string(),
});

// Main scoring response schema
export const ScoringResponseSchema = z.object({
  meta: z.object({
    task_type: z.enum(['task1', 'task2']),
    module: z.enum(['academic', 'general']),
    approx_word_count: z.number(),
  }),
  scores: z.object({
    task_achievement_or_response: ScoreSchema,
    coherence_and_cohesion: ScoreSchema,
    lexical_resource: ScoreSchema,
    grammatical_range_and_accuracy: ScoreSchema,
    overall: ScoreSchema,
  }),
  feedback: z.object({
    summary_comment: z.string(),
    criterion_feedback: z.object({
      task_achievement_or_response: CriterionFeedbackSchema,
      coherence_and_cohesion: CriterionFeedbackSchema,
      lexical_resource: CriterionFeedbackSchema,
      grammatical_range_and_accuracy: CriterionFeedbackSchema,
    }),
    highlights: z.array(HighlightSchema),
    revision_plan: z.array(RevisionPlanItemSchema),
  }),
  issues: z.array(z.string()),
  notes_for_teacher: z.string(),
});

// Type inference
export type ScoringResponse = z.infer<typeof ScoringResponseSchema>;
export type Highlight = z.infer<typeof HighlightSchema>;
export type RevisionPlanItem = z.infer<typeof RevisionPlanItemSchema>;

// Validation function with error handling
export function validateScoringResponse(data: unknown): ScoringResponse {
  return ScoringResponseSchema.parse(data);
}

// Safe validation that returns errors
export function safeValidateScoringResponse(data: unknown): {
  success: boolean;
  data?: ScoringResponse;
  error?: string;
} {
  const result = ScoringResponseSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { 
      success: false, 
      error: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')
    };
  }
}
