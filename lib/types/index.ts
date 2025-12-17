/**
 * Shared TypeScript types and interfaces for the IELTS Writing Scorer
 * Centralized type definitions for type safety across the application
 */

// ============================================
// IELTS Scoring Types
// ============================================

export type TaskType = 'task1' | 'task2';
export type Module = 'academic' | 'general';
export type ImpactLevel = 'high' | 'medium' | 'low';
export type HighlightType = 'grammar' | 'vocabulary' | 'cohesion' | 'task_response' | 'other';

// ============================================
// Score Interfaces
// ============================================

export interface BandScore {
  score: number;
  rounded_band: number;
}

export interface CriteriaScores {
  taskAchievement?: number;
  taskResponse?: number;
  coherenceCohesion: number;
  lexicalResource: number;
  grammaticalRangeAccuracy: number;
}

export interface RoundedCriteriaScores {
  task_achievement_or_response: BandScore;
  coherence_and_cohesion: BandScore;
  lexical_resource: BandScore;
  grammatical_range_and_accuracy: BandScore;
  overall: BandScore;
}

// ============================================
// Feedback Interfaces
// ============================================

export interface HighlightedIssue {
  type: HighlightType;
  text: string;
  explanation: string;
  suggestion: string;
}

export interface RevisionPlanItem {
  title: string;
  description: string;
  impact: ImpactLevel;
}

export interface CriteriaFeedback {
  taskAchievement: string;
  coherenceCohesion: string;
  lexicalResource: string;
  grammaticalRangeAccuracy: string;
}

// ============================================
// Scoring Request/Response Types
// ============================================

export interface ScoreEssayRequest {
  taskType: TaskType;
  module: Module;
  promptText: string;
  essayText: string;
}

export interface ScoringData {
  overallBand: number;
  criteriaScores: CriteriaScores;
  executiveSummary: string;
  criteriaFeedback: CriteriaFeedback;
  highlightedIssues: HighlightedIssue[];
  revisionPlan: RevisionPlanItem[];
  educatorNotes: string;
}

export interface ScoreEssayResponse {
  success: boolean;
  data?: ScoringData;
  error?: string;
  warnings?: string[];
  essayId?: string;
}

// ============================================
// Essay and Result Types (Database Models)
// ============================================

export interface Essay {
  id: string;
  userId: string;
  taskType: string;
  module: string;
  prompt: string;
  essay: string;
  wordCount: number;
  submittedAt: Date;
}

export interface Result {
  id: string;
  essayId: string;
  overallBand: number;
  taskAchievement: number;
  coherenceCohesion: number;
  lexicalResource: number;
  grammaticalRange: number;
  executiveSummary: string;
  criteriaFeedback: string; // JSON string
  highlightedIssues: string; // JSON string
  revisionPlan: string; // JSON string
  educatorNotes: string | null;
  createdAt: Date;
}

export interface EssayWithResult extends Essay {
  result: Result | null;
}

// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  name: string;
  email: string;
  image?: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  statusCode?: number;
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

// ============================================
// Validation Types
// ============================================

export interface ValidationResult {
  valid: boolean;
  warning?: string;
  error?: string;
}

export interface LanguageDetectionResult {
  isEnglish: boolean;
  confidence: number;
}

// ============================================
// AI Model Types
// ============================================

export interface AIModelConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// ============================================
// Form Types
// ============================================

export interface EssayFormData {
  taskType: TaskType;
  module: Module;
  prompt: string;
  essay: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ============================================
// Component Props Types
// ============================================

export interface EssayFormProps {
  onSubmit: (data: EssayFormData) => Promise<void>;
  isLoading?: boolean;
}

export interface ScoringResultsProps {
  data: ScoringData;
  essayId?: string;
}

// ============================================
// Utility Types
// ============================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

// ============================================
// Type Guards
// ============================================

export function isTaskType(value: unknown): value is TaskType {
  return value === 'task1' || value === 'task2';
}

export function isModule(value: unknown): value is Module {
  return value === 'academic' || value === 'general';
}

export function isHighlightType(value: unknown): value is HighlightType {
  const validTypes: HighlightType[] = ['grammar', 'vocabulary', 'cohesion', 'task_response', 'other'];
  return typeof value === 'string' && validTypes.includes(value as HighlightType);
}

export function isImpactLevel(value: unknown): value is ImpactLevel {
  return value === 'high' || value === 'medium' || value === 'low';
}
