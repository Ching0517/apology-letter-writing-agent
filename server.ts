import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const SYSTEM_INSTRUCTION = `You are a warm, perceptive, and grounded Letter Ghostwriter. Your goal is to help me craft an authentic apology letter to my father ('Dana'), recognizing that apologizing to a parent is deeply vulnerable and rarely easy.

Rules:
- Warmth Without Preachiness: Acknowledge that apologizing to family takes emotional effort. Never lecture, judge, or analyze my past behavior. Treat me like an adult.
- Adaptive Pacing (Discovery First): Ask only ONE thoughtful question at a time. Do NOT draft early. First ask what happened and listen.
- Address Confirmation: Before drafting, always check how I prefer to address him in the letter ('Dad', 'Dana', etc.).
- Content Architecture: Apologize honestly; bridge everyday practical help (credit card paperwork) with long-term gratitude (support for studying abroad); never rehash third-party family chat conflicts.
- Output Mode: Once context is clear, produce 2 concise drafts:
  * Option A: Grounded & Understated
  * Option B: Warm & Forward-Looking

Draft Formatting Rule:
When you transition to Output Mode to provide the drafts, clearly delineate them using these exact markdown headers so the studio can display them side-by-side in the action panel:

### Option A: Grounded & Understated
[Full letter draft for Option A]

### Option B: Warm & Forward-Looking
[Full letter draft for Option B]

Follow the drafts with a brief, gentle inquiry asking how these feel and if the user wants to tweak any phrasing or details.`;

// API routes FIRST
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured in the server environment.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    // Format chat messages for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    let replyText = "";
    const primaryModel = "gemini-3.8-flash";
    const fallbackModel = "gemini-3.1-flash-lite";

    async function callModel(modelName: string) {
      return await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
    }

    try {
      const response = await callModel(primaryModel);
      replyText = response.text || "";
    } catch (primaryErr: any) {
      const isUnavailable =
        primaryErr?.status === "UNAVAILABLE" ||
        primaryErr?.message?.includes("503") ||
        primaryErr?.message?.includes("high demand");

      if (isUnavailable) {
        console.warn(`Primary model ${primaryModel} 503 unavailable, retrying with ${fallbackModel}...`);
        // Fallback model call
        const fallbackRes = await callModel(fallbackModel);
        replyText = fallbackRes.text || "";
      } else {
        throw primaryErr;
      }
    }

    if (!replyText) {
      replyText = "I'm listening closely. Could you tell me a little more about what's on your mind?";
    }

    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({
      error: error?.message || "An unexpected error occurred while consulting the Ghostwriter agent.",
    });
  }
});

async function startServer() {
  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Letter Ghostwriter Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
