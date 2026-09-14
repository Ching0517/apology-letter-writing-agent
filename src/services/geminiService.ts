/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Client-Side Gemini Service for Letter Ghostwriter Studio.
 * Integrates directly into the client-side SPA bundle for seamless Vercel static deployment.
 * Reads API key from import.meta.env.VITE_GEMINI_API_KEY or process.env.GEMINI_API_KEY.
 */

import { GoogleGenAI } from '@google/genai';
import { ChatMessage } from '../types';

export const SYSTEM_INSTRUCTION = `You are a warm, perceptive, and grounded Letter Ghostwriter. Your goal is to help me craft an authentic apology letter to my father ('Dana'), recognizing that apologizing to a parent is deeply vulnerable and rarely easy.

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

// WARNING: Client-side Gemini API invocation directly from the browser as explicitly requested
// by the user for standalone static deployment (e.g. Vercel SPA) without a custom Node.js server.
// In high-security multi-tenant production architectures, a backend proxy is generally recommended.

export function getGeminiApiKey(): string {
  // Check VITE_ prefixed env, then process.env
  const metaEnv = (import.meta as any)?.env || {};
  const procEnv = (typeof process !== 'undefined' && process?.env) || {};

  const key =
    metaEnv.VITE_GEMINI_API_KEY ||
    metaEnv.GEMINI_API_KEY ||
    procEnv.VITE_GEMINI_API_KEY ||
    procEnv.GEMINI_API_KEY ||
    '';
  return typeof key === 'string' ? key.trim() : '';
}

/**
 * Call Gemini using the Interactions API with models/gemini-3.6-flash,
 * with graceful fallback to models.generateContent and REST API.
 */
export async function sendChatMessageToGemini(messages: ChatMessage[]): Promise<string> {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error(
      'Gemini API Key is missing. Please configure VITE_GEMINI_API_KEY in your Vercel Environment Variables (or .env file).'
    );
  }

  const formattedContents = messages.map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));

  // Primary model requested: gemini-3.6-flash (gemini-2.0-flash is discontinued)
  const modelsToTry = ['gemini-3.6-flash', 'gemini-3.8-flash', 'gemini-2.5-flash'];

  let lastError: any = null;

  // 1. Try @google/genai Interactions API (recommended)
  try {
    const ai = new GoogleGenAI({ apiKey });

    if (typeof (ai as any).interactions?.create === 'function') {
      try {
        const transcript =
          messages
            .map((m) => `${m.role === 'user' ? 'User' : 'Assistant (Ghostwriter)'}: ${m.content}`)
            .join('\n\n') + '\n\nAssistant (Ghostwriter):';

        const interaction = await (ai as any).interactions.create({
          model: 'gemini-3.6-flash',
          input: transcript,
          system_instruction: SYSTEM_INSTRUCTION,
          generation_config: {
            temperature: 0.7,
          },
        });

        let textOutput = interaction.output_text || '';
        if (!textOutput && interaction.steps) {
          for (const step of interaction.steps) {
            if (step.type === 'model_output') {
              const textContent = step.content?.find((c: any) => c.type === 'text');
              if (textContent?.text) {
                textOutput += textContent.text;
              }
            }
          }
        }

        if (textOutput.trim()) {
          return textOutput.trim();
        }
      } catch (interactionErr: any) {
        lastError = interactionErr;
        console.warn('Interactions API attempt failed, proceeding to generateContent...', interactionErr);
      }
    }

    // 2. Try @google/genai models.generateContent
    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: formattedContents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });

        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`SDK attempt with model ${model} failed, checking next model...`, err);
        continue;
      }
    }
  } catch (sdkInitErr) {
    console.warn('@google/genai SDK initialization error, falling back to direct REST:', sdkInitErr);
  }

  // 3. Fallback to direct Gemini REST API if SDK encountered issues
  for (const model of modelsToTry) {
    try {
      const restUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(restUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
          contents: formattedContents,
          generationConfig: {
            temperature: 0.7,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          return candidateText;
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        lastError = new Error(errJson?.error?.message || `HTTP ${res.status}`);
      }
    } catch (restErr) {
      lastError = restErr;
    }
  }

  throw lastError || new Error('Failed to generate response from Gemini. Please verify your API key.');
}
