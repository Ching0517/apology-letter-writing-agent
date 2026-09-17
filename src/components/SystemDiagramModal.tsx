import React, { useState } from 'react';
import {
  X,
  Network,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Layers,
  Code2,
  Cpu,
  Globe,
  Key,
  Copy,
  Check,
  Terminal,
  ArrowRight,
} from 'lucide-react';

interface SystemDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'architecture' | 'api-specs' | 'journey';

export const SystemDiagramModal: React.FC<SystemDiagramModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('architecture');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const ARCHITECTURE_ASCII = `┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                            Letter Ghostwriter Studio — Client SPA                           │
│                                   (Vercel / Static Hosting)                                 │
│                                                                                             │
│  ┌─────────────────────────────────┐           ┌─────────────────────────────────────────┐  │
│  │       React 19 Frontend         │           │    src/services/geminiService.ts        │  │
│  │                                 │           │                                         │  │
│  │ • ChatArea (Message Stream)     │ ────────> │ 1. Key Resolution                       │  │
│  │ • DraftsPanel (Side-by-Side)    │           │    (VITE_GEMINI_API_KEY / process.env)  │  │
│  │ • draftParser (Option A/B Regex)│ <──────── │ 2. Transcript Assembly & Context Format │  │
│  │ • State: messages, editedDrafts │  (Drafts) │ 3. Multi-tier API Dispatcher            │  │
│  └─────────────────────────────────┘           └────────────────────┬────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┼───────────────────────┘
                                                                      │
                               HTTPS Client-Direct Request (No Proxy) │
                                                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                             Google Gemini Cloud API Engine                                  │
│                                                                                             │
│   [Primary: Tier 1]  @google/genai Interactions API (Recommended)                           │
│   • Method: ai.interactions.create()                                                        │
│   • Model:  models/gemini-3.6-flash                                                         │
│   • Input:  Multi-turn transcript string + Interaction-scoped SYSTEM_INSTRUCTION            │
│                                                                                             │
│   [Fallback: Tier 2] @google/genai models.generateContent()                                 │
│   • Models: gemini-3.6-flash  →  gemini-3.8-flash  →  gemini-2.5-flash                      │
│                                                                                             │
│   [Fallback: Tier 3] Direct Gemini REST API (Zero-Dependency)                               │
│   • URL: POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent│
│   • Payload: { system_instruction, contents: [...], generationConfig }                     │
└─────────────────────────────────────────────────────────────────────────────────────────────┘`;

  const SEQUENCE_ASCII = `User                   React UI (App.tsx)              geminiService.ts               Google Gemini API
 │                             │                              │                               │
 │── 1. Enters Message ───────>│                              │                               │
 │   "I snapped at Dad..."     │                              │                               │
 │                             │── 2. sendChatMessageTo... ──>│                               │
 │                             │      (nextMessages)          │                               │
 │                             │                              │── 3. Read API Key ───────────┐│
 │                             │                              │   (VITE_GEMINI_API_KEY)      ││
 │                             │                              │<─────────────────────────────┘│
 │                             │                              │                               │
 │                             │                              │── 4. ai.interactions.create() │
 │                             │                              │   model: "gemini-3.6-flash"   │
 │                             │                              │   input: transcript           │
 │                             │                              │   system_instruction: ... ───>│
 │                             │                              │                               │
 │                             │                              │<── 5. Returns Interaction ────│
 │                             │                              │    (steps / output_text)      │
 │                             │                              │   [Or Fallback to REST API]   │
 │                             │                              │                               │
 │                             │<── 6. Return model reply ────│                               │
 │                             │                              │                               │
 │                             │── 7. parseDrafts(Option A/B)                                 │
 │<── 8. Render Chat & Drafts ─│                                                              │`;

  const INTERACTIONS_CODE = `import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

// 1. Interactions API Call (Recommended by Google)
const interaction = await ai.interactions.create({
  model: 'gemini-3.6-flash',
  input: formattedTranscript,
  system_instruction: SYSTEM_INSTRUCTION,
  generation_config: {
    temperature: 0.7,
  },
});

// Extract generated output from steps or convenience helper
let replyText = interaction.output_text || '';
if (!replyText && interaction.steps) {
  for (const step of interaction.steps) {
    if (step.type === 'model_output') {
      const textPart = step.content?.find(c => c.type === 'text');
      if (textPart?.text) replyText += textPart.text;
    }
  }
}`;

  const REST_CODE = `// 2. Direct REST API Call (Zero-dependency Fallback for Vercel/Static SPA)
const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=\${apiKey}\`;

const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    system_instruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    contents: [
      { role: 'model', parts: [{ text: 'Apologizing to a parent takes real vulnerability...' }] },
      { role: 'user', parts: [{ text: 'I snapped at him about credit card paperwork...' }] }
    ],
    generationConfig: {
      temperature: 0.7,
    },
  }),
});

const data = await response.json();
const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;`;

  return (
    <div
      id="system-diagram-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="system-diagram-modal-card"
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#FDFCF9] border border-stone-300 rounded-xl shadow-2xl p-5 sm:p-7 text-stone-800 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-200 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-stone-900 text-amber-100 flex items-center justify-center font-medium shadow-xs shrink-0">
              <Network className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-stone-900">
                  System Diagram & Architecture
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium">
                  gemini-3.6-flash
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-medium">
                  Interactions API
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Technical API calling topology, request lifecycle, and ghostwriter role card
              </p>
            </div>
          </div>
          <button
            id="close-system-diagram-btn"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 mt-4 gap-1 sm:gap-2 text-xs sm:text-sm font-medium shrink-0">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'architecture'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            System & API Architecture
          </button>
          <button
            onClick={() => setActiveTab('api-specs')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'api-specs'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            API Specs & Code
          </button>
          <button
            onClick={() => setActiveTab('journey')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'journey'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Agent Journey & Persona
          </button>
        </div>

        {/* Tab 1: System & API Architecture */}
        {activeTab === 'architecture' && (
          <div className="mt-5 space-y-6 animate-in fade-in duration-150">
            {/* Component Topology ASCII */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-stone-800" />
                  End-to-End System Topology
                </h3>
                <button
                  onClick={() => handleCopy('arch', ARCHITECTURE_ASCII)}
                  className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded"
                >
                  {copiedKey === 'arch' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'arch' ? 'Copied' : 'Copy Diagram'}
                </button>
              </div>

              <div className="p-4 bg-stone-950 text-amber-200 font-mono text-[11px] sm:text-xs rounded-lg border border-stone-800 overflow-x-auto shadow-inner leading-relaxed">
                <pre className="whitespace-pre">{ARCHITECTURE_ASCII}</pre>
              </div>
            </div>

            {/* Sequence Flow ASCII */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-stone-800" />
                  API Call Sequence Flow
                </h3>
                <button
                  onClick={() => handleCopy('seq', SEQUENCE_ASCII)}
                  className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded"
                >
                  {copiedKey === 'seq' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'seq' ? 'Copied' : 'Copy Sequence'}
                </button>
              </div>

              <div className="p-4 bg-stone-900 text-stone-200 font-mono text-[11px] sm:text-xs rounded-lg border border-stone-800 overflow-x-auto shadow-inner leading-relaxed">
                <pre className="whitespace-pre">{SEQUENCE_ASCII}</pre>
              </div>
            </div>

            {/* Architecture Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="font-semibold text-stone-900 flex items-center gap-1.5 mb-1">
                  <Globe className="w-4 h-4 text-amber-700" />
                  Client-Direct Architecture (No Server)
                </div>
                <p className="text-stone-600 leading-relaxed">
                  Eliminates dependency on a custom <code className="text-stone-800 font-mono">server.ts</code>. The client initiates encrypted HTTPS calls directly to Google endpoints, natively compatible with static hosting like Vercel.
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="font-semibold text-stone-900 flex items-center gap-1.5 mb-1">
                  <Key className="w-4 h-4 text-emerald-700" />
                  Dual Environment Variable Resolution
                </div>
                <p className="text-stone-600 leading-relaxed">
                  Automatically resolves <code className="text-stone-800 font-mono">VITE_GEMINI_API_KEY</code> and <code className="text-stone-800 font-mono">process.env.GEMINI_API_KEY</code>, supporting both Vercel and AI Studio environments.
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="font-semibold text-stone-900 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  Three-Tier Resilient Fallback Strategy
                </div>
                <p className="text-stone-600 leading-relaxed">
                  Sequentially attempts Interactions API → SDK generateContent → Direct REST API, gracefully degrading if rate limits or network constraints arise.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: API Call Specs & Code */}
        {activeTab === 'api-specs' && (
          <div className="mt-5 space-y-6 animate-in fade-in duration-150">
            {/* Method 1: Interactions API */}
            <div className="border border-stone-200 rounded-lg overflow-hidden bg-white shadow-xs">
              <div className="bg-stone-100/90 px-4 py-2.5 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-semibold text-xs sm:text-sm text-stone-800">
                    Primary Call: @google/genai Interactions API
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                    models/gemini-3.6-flash
                  </span>
                </div>
                <button
                  onClick={() => handleCopy('code1', INTERACTIONS_CODE)}
                  className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer bg-white px-2 py-1 rounded border border-stone-200"
                >
                  {copiedKey === 'code1' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'code1' ? 'Copied' : 'Copy Code'}
                </button>
              </div>
              <div className="p-3 sm:p-4 bg-stone-950 text-stone-200 font-mono text-xs overflow-x-auto">
                <pre className="whitespace-pre">{INTERACTIONS_CODE}</pre>
              </div>
            </div>

            {/* Method 2: REST API Fallback */}
            <div className="border border-stone-200 rounded-lg overflow-hidden bg-white shadow-xs">
              <div className="bg-stone-100/90 px-4 py-2.5 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="font-semibold text-xs sm:text-sm text-stone-800">
                    Fallback Call: Direct Gemini REST API (Zero-Dependency)
                  </span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono">
                    POST /v1beta/models/...
                  </span>
                </div>
                <button
                  onClick={() => handleCopy('code2', REST_CODE)}
                  className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer bg-white px-2 py-1 rounded border border-stone-200"
                >
                  {copiedKey === 'code2' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'code2' ? 'Copied' : 'Copy Code'}
                </button>
              </div>
              <div className="p-3 sm:p-4 bg-stone-950 text-stone-200 font-mono text-xs overflow-x-auto">
                <pre className="whitespace-pre">{REST_CODE}</pre>
              </div>
            </div>

            {/* Parameter & Model Spec Table */}
            <div className="border border-stone-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
                    <th className="p-2.5">Parameter</th>
                    <th className="p-2.5">Value</th>
                    <th className="p-2.5">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-stone-600">
                  <tr>
                    <td className="p-2.5 font-mono text-stone-800 font-medium">model</td>
                    <td className="p-2.5 font-mono text-emerald-700">"gemini-3.6-flash"</td>
                    <td className="p-2.5">Google-recommended modern Flash model featuring low latency and strong reasoning capabilities</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono text-stone-800 font-medium">system_instruction</td>
                    <td className="p-2.5 font-mono text-stone-700">SYSTEM_INSTRUCTION (String)</td>
                    <td className="p-2.5">Defines Ghostwriter counselor persona, discovery pacing, and strict dual-draft markdown output schemas</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono text-stone-800 font-medium">temperature</td>
                    <td className="p-2.5 font-mono text-stone-700">0.7</td>
                    <td className="p-2.5">Balances empathetic conversational nuance with grounded letter phrasing</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono text-stone-800 font-medium">fallback_chain</td>
                    <td className="p-2.5 font-mono text-stone-700">3.6-flash → 3.8-flash → 2.5-flash</td>
                    <td className="p-2.5">Automatically fails over if primary model encounters traffic spikes or unavailability</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Agent Journey & Role Card */}
        {activeTab === 'journey' && (
          <div className="mt-5 space-y-6 animate-in fade-in duration-150">
            {/* Five Pipeline Stages */}
            <div className="space-y-3">
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-stone-800" />
                Five-Stage Consultation Pipeline
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <div className="font-semibold text-stone-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 text-xs flex items-center justify-center font-bold">1</span>
                    [User Input] Emotional Expression
                  </div>
                  <p className="mt-1.5 text-stone-600 leading-relaxed">
                    The user freely shares friction points and emotional guilt regarding Dana without needing to structure polished prose immediately.
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <div className="font-semibold text-stone-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 text-xs flex items-center justify-center font-bold">2</span>
                    [Context Intake] Single-Question Discovery
                  </div>
                  <p className="mt-1.5 text-stone-600 leading-relaxed">
                    The AI strictly adheres to asking one focused question at a time, listening first to understand the context before drafting.
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <div className="font-semibold text-stone-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 text-xs flex items-center justify-center font-bold">3</span>
                    [Tone & Addressing] Salutation & Emotional Bridging
                  </div>
                  <p className="mt-1.5 text-stone-600 leading-relaxed">
                    Confirms preferred salutation ('Dad' vs 'Dana') and bridges mundane practical friction (credit card paperwork) with deep gratitude (study abroad support).
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <div className="font-semibold text-stone-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 text-xs flex items-center justify-center font-bold">4</span>
                    [Dual-Draft Generator] Dual-Variant Creation
                  </div>
                  <p className="mt-1.5 text-stone-600 leading-relaxed">
                    Once context is solidified, automatically generates Option A (Grounded & Understated) and Option B (Warm & Forward-Looking).
                  </p>
                </div>

                <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200 sm:col-span-2">
                  <div className="font-semibold text-stone-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-stone-800 text-xs flex items-center justify-center font-bold">5</span>
                    [Output Action Area] Side-by-Side Review & Export
                  </div>
                  <p className="mt-1.5 text-stone-700 leading-relaxed">
                    The action area immediately renders both drafts with word metrics, reading estimates, inline editing, and one-click clipboard copying.
                  </p>
                </div>
              </div>
            </div>

            {/* Embedded Persona */}
            <div className="p-4 bg-stone-100 rounded-lg border border-stone-200 text-xs text-stone-700 space-y-2 font-mono">
              <p className="font-semibold text-stone-900">
                "You are a warm, perceptive, and grounded Letter Ghostwriter. Your goal is to help me craft an authentic apology letter to my father ('Dana'), recognizing that apologizing to a parent is deeply vulnerable and rarely easy."
              </p>
              <ul className="list-disc pl-4 space-y-1 text-stone-600">
                <li><strong className="text-stone-800">Warmth Without Preachiness:</strong> Never lectures, judges, or analyzes past behavior; maintains respectful peer-to-peer adult empathy.</li>
                <li><strong className="text-stone-800">Adaptive Pacing (Discovery First):</strong> Strictly asks one thoughtful question at a time, waiting for full feedback before writing.</li>
                <li><strong className="text-stone-800">Address Confirmation:</strong> Confirms how to address the recipient ('Dad', 'Dana', etc.) prior to drafting.</li>
                <li><strong className="text-stone-800">Content Architecture:</strong> Apologizes honestly, connecting practical aid to long-term gratitude; avoids rehashing third-party group chat disputes.</li>
                <li><strong className="text-stone-800">Output Mode:</strong> Explicitly formats dual drafts under designated markdown headers for instantaneous studio parsing.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-stone-700">Client-Side Direct API Architecture</span>
            <span className="text-stone-300">•</span>
            <span>Gemini 3.6 Flash</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 font-medium rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
