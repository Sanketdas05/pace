// src/config/ai.js

export const isDev = import.meta.env.DEV;

export const GROQ_URL = isDev
  ? '/api/groq/openai/v1/chat/completions'
  : 'https://api.groq.com/openai/v1/chat/completions';

// Default model for task creation, theme building, and workflow planning
// Can be customized in .env with VITE_GROQ_MODEL
export const DEFAULT_AI_MODEL = import.meta.env.VITE_GROQ_MODEL || 'openai/gpt-oss-120b';

/**
 * Safely parses JSON responses from LLMs, handling markdown code fences
 * and embedded JSON strings.
 */
export function parseAIJsonResponse(rawText) {
  if (!rawText || typeof rawText !== 'string') return {};
  let cleaned = rawText.trim();
  
  // Strip markdown code fences if present (e.g. ```json ... ``` or ``` ...)
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/, '').trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    // Fallback: search for first { ... } or [ ... ] block
    const match = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (match) {
      return JSON.parse(match[1]);
    }
    throw new Error('Could not parse valid JSON from AI response.');
  }
}
