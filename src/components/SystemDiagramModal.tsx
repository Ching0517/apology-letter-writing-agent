import React from 'react';
import { X, Network, HeartHandshake, HelpCircle, ShieldCheck, Sparkles, BookOpen, Layers } from 'lucide-react';

interface SystemDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemDiagramModal: React.FC<SystemDiagramModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="system-diagram-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="system-diagram-modal-card"
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#FDFCF9] border border-stone-300 rounded-xl shadow-2xl p-6 sm:p-8 text-stone-800"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-stone-900 text-amber-100 flex items-center justify-center font-medium shadow-xs">
              <Network className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-stone-900">
                System Diagram & Architecture
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Ghostwriter Agent workflow, data pipeline, and embedded role card
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

        {/* ASCII System Diagram */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-stone-700" /> User Journey & Data Flow
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-sm bg-stone-200 text-stone-700">ASCII Architecture</span>
          </div>

          <div
            id="ascii-system-diagram-box"
            className="p-4 bg-stone-900 text-amber-200 font-mono text-xs sm:text-sm rounded-lg border border-stone-800 overflow-x-auto shadow-inner leading-relaxed"
          >
            <pre className="whitespace-pre">
{`+----------------+      +---------------------------+      +--------------------------+
|  [User Input]  | ---> |  [Context Intake (1-by-1)] | ---> | [Tone & Addressing Hook] |
+----------------+      +---------------------------+      +--------------------------+
                                                                         |
                                                                         v
                              +--------------------+      +---------------------------+
                              |      [Output]      | <--- |   [Dual-Draft Generator]  |
                              |  Dual Side-by-Side |      |  Option A: Grounded       |
                              |  Clipboard Export  |      |  Option B: Forward-Looking|
                              +--------------------+      +---------------------------+`}
            </pre>
          </div>
        </div>

        {/* Pipeline Stage Breakdown */}
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-stone-700" /> Five Pipeline Stages
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <div className="font-semibold text-stone-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 text-xs flex items-center justify-center font-bold">1</span>
                [User Input]
              </div>
              <p className="mt-1.5 text-stone-600 leading-relaxed">
                The user shares candid feelings, hesitation, and fragments of what went wrong without feeling pressured to write cleanly or self-censor.
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <div className="font-semibold text-stone-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 text-xs flex items-center justify-center font-bold">2</span>
                [Context Intake (1-by-1)]
              </div>
              <p className="mt-1.5 text-stone-600 leading-relaxed">
                Adaptive pacing strictly asks ONE single thoughtful inquiry at a time. Discovery occurs first; no premature drafting before understanding.
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <div className="font-semibold text-stone-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 text-xs flex items-center justify-center font-bold">3</span>
                [Tone & Addressing Hook]
              </div>
              <p className="mt-1.5 text-stone-600 leading-relaxed">
                Confirms preference for addressing the father ('Dad', 'Dana', etc.), bridges practical help (credit card paperwork) with lasting gratitude (study abroad), and filters out third-party group chat noise.
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <div className="font-semibold text-stone-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 text-xs flex items-center justify-center font-bold">4</span>
                [Dual-Draft Generator]
              </div>
              <p className="mt-1.5 text-stone-600 leading-relaxed">
                Once clear context is established, generates two tailored options: Option A (Grounded & Understated) and Option B (Warm & Forward-Looking).
              </p>
            </div>

            <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200 sm:col-span-2">
              <div className="font-semibold text-stone-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-200 text-stone-800 text-xs flex items-center justify-center font-bold">5</span>
                [Output Action Area]
              </div>
              <p className="mt-1.5 text-stone-700 leading-relaxed">
                Drafts render in the collapsible Action Panel side-by-side with reading times, word counts, direct inline editing, and one-click copy to clipboard.
              </p>
            </div>
          </div>
        </div>

        {/* Embedded Persona & System Rules */}
        <div className="mt-6 pt-5 border-t border-stone-200">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5 mb-2">
            <BookOpen className="w-4 h-4 text-stone-700" /> Embedded Agent Role Card
          </h3>
          <div className="p-4 bg-stone-100 rounded-lg border border-stone-200 text-xs text-stone-700 space-y-2 font-mono">
            <p className="font-semibold text-stone-900">
              "You are a warm, perceptive, and grounded Letter Ghostwriter. Your goal is to help me craft an authentic apology letter to my father ('Dana'), recognizing that apologizing to a parent is deeply vulnerable and rarely easy."
            </p>
            <ul className="list-disc pl-4 space-y-1 text-stone-600">
              <li><strong className="text-stone-800">Warmth Without Preachiness:</strong> Never lecture or judge. Treat user like an adult.</li>
              <li><strong className="text-stone-800">Adaptive Pacing (Discovery First):</strong> Ask only ONE thoughtful question at a time. No early drafting.</li>
              <li><strong className="text-stone-800">Address Confirmation:</strong> Confirm preference ('Dad', 'Dana', etc.) prior to writing.</li>
              <li><strong className="text-stone-800">Content Architecture:</strong> Apologize honestly; bridge everyday paperwork help with study abroad gratitude; avoid 3rd-party chat conflicts.</li>
              <li><strong className="text-stone-800">Output Mode:</strong> Produce 2 concise drafts: Option A (Grounded) & Option B (Warm & Forward-Looking).</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Server-Side Gemini 3.8 Flash • Privacy Preserved</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 font-medium rounded-lg transition-colors cursor-pointer"
          >
            Close Diagram
          </button>
        </div>
      </div>
    </div>
  );
};
