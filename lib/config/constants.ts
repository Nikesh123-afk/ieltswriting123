/**
 * Application-wide constants and configuration
 * Centralized configuration for easy maintenance
 */

// ============================================
// IELTS Scoring Configuration
// ============================================

export const IELTS_CONFIG = {
  // Band score range
  MIN_BAND: 0.0,
  MAX_BAND: 9.0,
  BAND_INCREMENT: 0.5,
  
  // Word count requirements
  WORD_COUNT: {
    TASK1: {
      MIN_ACCEPTABLE: 80,
      RECOMMENDED_MIN: 150,
      RECOMMENDED_MAX: 250,
    },
    TASK2: {
      MIN_ACCEPTABLE: 150,
      RECOMMENDED_MIN: 250,
      RECOMMENDED_MAX: 350,
    },
  },
  
  // Scoring criteria weights (equal weighting)
  CRITERIA_WEIGHTS: {
    taskAchievement: 0.25,
    coherenceCohesion: 0.25,
    lexicalResource: 0.25,
    grammaticalRange: 0.25,
  },
} as const;

// ============================================
// AI Model Configuration
// ============================================

export const AI_CONFIG = {
  // Model parameters
  DEFAULT_MODEL: 'llama-3.3-70b-versatile',
  TEMPERATURE: 0.2, // Lower = more consistent
  MAX_TOKENS: 4000,
  TOP_P: 0.95,
  
  // Retry configuration
  MAX_RETRIES: 1,
  RETRY_DELAY_MS: 1000,
  
  // Timeout
  REQUEST_TIMEOUT_MS: 60000, // 60 seconds
} as const;

// ============================================
// Task Types and Modules
// ============================================

export const TASK_TYPES = {
  TASK1: 'task1',
  TASK2: 'task2',
} as const;

export const MODULES = {
  ACADEMIC: 'academic',
  GENERAL: 'general',
} as const;

export type TaskType = typeof TASK_TYPES[keyof typeof TASK_TYPES];
export type Module = typeof MODULES[keyof typeof MODULES];

// ============================================
// Feedback Configuration
// ============================================

export const FEEDBACK_CONFIG = {
  // Number of highlighted issues to show
  MIN_HIGHLIGHTS: 5,
  MAX_HIGHLIGHTS: 15,
  
  // Revision plan items
  MIN_REVISION_ITEMS: 2,
  MAX_REVISION_ITEMS: 4,
  
  // Highlight types
  HIGHLIGHT_TYPES: [
    'grammar',
    'vocabulary',
    'cohesion',
    'task_response',
    'other',
  ] as const,
  
  // Impact levels
  IMPACT_LEVELS: ['high', 'medium', 'low'] as const,
} as const;

// ============================================
// Language Detection
// ============================================

export const LANGUAGE_CONFIG = {
  // Common English words for basic detection
  COMMON_ENGLISH_WORDS: [
    'the', 'is', 'are', 'was', 'were',
    'have', 'has', 'been', 'to', 'of',
    'and', 'in', 'on', 'at', 'for',
  ],
  
  // Minimum confidence threshold
  MIN_CONFIDENCE: 0.05, // 5% common English words
} as const;

// ============================================
// API Routes
// ============================================

export const API_ROUTES = {
  SCORE: '/api/score',
  ESSAYS: '/api/essays',
  USER_UPDATE: '/api/user/update',
  AUTH_SIGNUP: '/api/auth/signup',
} as const;

// ============================================
// Page Routes
// ============================================

export const PAGE_ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  ESSAY: (id: string) => `/essay/${id}`,
} as const;

// ============================================
// Error Messages
// ============================================

export const ERROR_MESSAGES = {
  AUTH_REQUIRED: 'Authentication required',
  INVALID_TASK_TYPE: 'taskType must be "task1" or "task2"',
  INVALID_MODULE: 'module must be "academic" or "general"',
  MISSING_FIELDS: 'Missing required fields',
  API_KEY_MISSING: 'API key not configured',
  ESSAY_TOO_SHORT: 'Essay is too short',
  NOT_ENGLISH: 'Essay does not appear to be in English',
  AI_NO_RESPONSE: 'No response from AI model',
  PARSE_ERROR: 'Failed to parse AI response',
  VALIDATION_ERROR: 'Response validation failed',
  UNKNOWN_ERROR: 'An unknown error occurred',
} as const;

// ============================================
// Success Messages
// ============================================

export const SUCCESS_MESSAGES = {
  ESSAY_SCORED: 'Essay scored successfully',
  ESSAY_SAVED: 'Essay saved to history',
  PROFILE_UPDATED: 'Profile updated successfully',
  ACCOUNT_CREATED: 'Account created successfully',
} as const;

// ============================================
// Environment Variables Helper
// ============================================

export const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value || defaultValue || '';
};

// ============================================
// Validation Helpers
// ============================================

export const isValidTaskType = (type: string): type is TaskType => {
  return Object.values(TASK_TYPES).includes(type as TaskType);
};

export const isValidModule = (module: string): module is Module => {
  return Object.values(MODULES).includes(module as Module);
};

export const isValidBandScore = (score: number): boolean => {
  return score >= IELTS_CONFIG.MIN_BAND && 
         score <= IELTS_CONFIG.MAX_BAND;
};
