// src/config/ai.js

export const isDev = import.meta.env.DEV;

// In local dev, use the Vite dev proxy (/api/groq).
// In production:
// 1. If VITE_AI_PROXY_URL is set (e.g. https://your-project.vercel.app/api/ai), calls that proxy.
// 2. Defaults to relative '/api/ai' (when hosted on Vercel under the same domain).
// 3. If needed, can fall back to direct Groq API endpoint.
export const GROQ_URL = isDev
  ? '/api/groq/openai/v1/chat/completions'
  : (import.meta.env.VITE_AI_PROXY_URL || '/api/ai');

// Default model for task creation, theme building, and workflow planning
// Can be customized in .env with VITE_GROQ_MODEL
export const DEFAULT_AI_MODEL = import.meta.env.VITE_GROQ_MODEL || 'openai/gpt-oss-120b';

/**
 * Returns safe request headers.
 * When calling the Vercel serverless function or proxy, the API key is NEVER
 * sent from the browser, protecting your secret key completely.
 */
export function getAIHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  
  // Only attach client Authorization header if explicitly calling api.groq.com directly
  if (!isDev && GROQ_URL.includes('api.groq.com') && import.meta.env.VITE_GROQ_API_KEY) {
    headers['Authorization'] = `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`;
  }
  
  return headers;
}

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
