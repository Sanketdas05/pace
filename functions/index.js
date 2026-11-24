const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();

// Store the API Key securely in Cloud Secret Manager
const groqApiKey = defineSecret("GROQ_API_KEY");

/**
 * Cloud Function to proxy AI chat completions securely.
 * Protects GROQ_API_KEY from exposure in the client browser.
 */
exports.generateAI = onRequest(
  {
    secrets: [groqApiKey],
    cors: true,
    region: "us-central1",
    maxInstances: 10,
    timeoutSeconds: 60,
  },
  async (req, res) => {
    // Only accept POST requests
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed. Use POST." });
      return;
    }

    try {
      const apiKey = groqApiKey.value() || process.env.GROQ_API_KEY;
      if (!apiKey) {
        res.status(500).json({ error: "Server missing GROQ_API_KEY secret." });
        return;
      }

      const { model, messages, tools, tool_choice, temperature, max_tokens, response_format } = req.body;

      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "Missing required 'messages' array in request body." });
        return;
      }

      const groqPayload = {
        model: model || "openai/gpt-oss-120b",
        messages,
        temperature: typeof temperature === "number" ? temperature : 0.6,
      };

      if (tools && Array.isArray(tools) && tools.length > 0) {
        groqPayload.tools = tools;
        if (tool_choice) groqPayload.tool_choice = tool_choice;
      }

      if (max_tokens) groqPayload.max_tokens = max_tokens;
      if (response_format) groqPayload.response_format = response_format;

      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(groqPayload),
      });

      const data = await groqResponse.json();

      if (!groqResponse.ok) {
        res.status(groqResponse.status).json(data);
        return;
      }

      res.status(200).json(data);
    } catch (err) {
      console.error("AI Proxy Error:", err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  }
);
