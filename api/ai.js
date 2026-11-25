// api/ai.js
// Vercel Serverless Function to securely proxy AI completions without exposing API keys to the browser.

export default async function handler(req, res) {
  // CORS headers for cross-origin frontend requests
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Missing GROQ_API_KEY in Vercel environment variables. Add it in Vercel Project Settings > Environment Variables.' 
      });
    }

    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON body.' });
      }
    }

    const { model, messages, tools, tool_choice, temperature, max_tokens, response_format } = body || {};

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing required 'messages' array in request body." });
    }

    const payload = {
      model: model || process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
      messages,
      temperature: typeof temperature === 'number' ? temperature : 0.6,
    };

    if (tools && Array.isArray(tools) && tools.length > 0) {
      payload.tools = tools;
      if (tool_choice) payload.tool_choice = tool_choice;
    }

    if (max_tokens) payload.max_tokens = max_tokens;
    if (response_format) payload.response_format = response_format;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      return res.status(groqResponse.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Vercel AI Proxy Error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
