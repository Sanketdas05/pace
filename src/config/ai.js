// src/config/ai.js

export const isDev = import.meta.env.DEV;

// In local dev, use the Vite dev proxy (/api/groq).
// In production:
// 1. If VITE_AI_PROXY_URL is set (e.g. https://your-project.vercel.app/api/ai), calls that secure serverless proxy.
// 2. Otherwise calls Groq directly with client key.
export const GROQ_URL = isDev
  ? '/api/groq/openai/v1/chat/completions'
  : (import.meta.env.VITE_AI_PROXY_URL || 'https://api.groq.com/openai/v1/chat/completions');

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
