// Utility functions for scoring

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function clampScore(score: number): number {
  return Math.max(0, Math.min(9, score));
}

export function roundToHalfBand(score: number): number {
  // Round to nearest 0.5
  // 0.0–0.24 -> 0.0
  // 0.25–0.74 -> 0.5
  // 0.75–1.24 -> 1.0, etc.
  return Math.round(score * 2) / 2;
}

export function detectLanguage(text: string): { isEnglish: boolean; confidence: number } {
  // Simple heuristic: check for common English words
  const englishWords = ['the', 'is', 'are', 'was', 'were', 'have', 'has', 'been', 'to', 'of', 'and', 'in', 'on', 'at'];
  const words = text.toLowerCase().split(/\s+/);
  const englishWordCount = words.filter(word => englishWords.includes(word)).length;
  const confidence = words.length > 0 ? englishWordCount / words.length : 0;
  
  return {
    isEnglish: confidence > 0.05, // At least 5% common English words
    confidence
  };
}

export function validateEssayLength(
  wordCount: number,
  taskType: 'task1' | 'task2'
): { valid: boolean; warning?: string } {
  const minWords = taskType === 'task1' ? 80 : 150;
  const expectedMin = taskType === 'task1' ? 150 : 250;
  
  if (wordCount < minWords) {
    return {
      valid: false,
      warning: `Essay is too short (${wordCount} words). Minimum expected: ${expectedMin} words.`
    };
  }
  
  if (wordCount < expectedMin) {
    return {
      valid: true,
      warning: `Essay is below recommended length (${wordCount} words). Expected: ${expectedMin}+ words.`
    };
  }
  
  return { valid: true };
}

export function sanitizeEssayText(text: string): string {
  // Remove excessive whitespace and normalize
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
