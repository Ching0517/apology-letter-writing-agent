import React from 'react';
import { LetterDraft, DiscoveryProgress } from '../types';
import { DraftCard } from './DraftCard';
import {
  ChevronRight,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Circle,
  FileText,
  Heart,
  Scale,
  Copy,
  Check
} from 'lucide-react';

interface DraftsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  drafts: { optionA: LetterDraft; optionB: LetterDraft } | null;
  discoveryProgress: DiscoveryProgress;
  onUpdateDraft?: (id: 'option-a' | 'option-b', newContent: string) => void;
}

export const DraftsPanel: React.FC<DraftsPanelProps> = ({
  isOpen,
  onToggle,
  drafts,
  discoveryProgress,
  onUpdateDraft,
}) => {
  const [copyAllStatus, setCopyAllStatus] = React.useState(false);

  const handleCopyBoth = async () => {
    if (!drafts) return;
    const combined = `=== OPTION A: ${drafts.optionA.subtitle} ===\n\n${drafts.optionA.content}\n\n\n=== OPTION B: ${drafts.optionB.subtitle} ===\n\n${drafts.optionB.content}`;
    try {
      await navigator.clipboard.writeText(combined);
      setCopyAllStatus(true);
      setTimeout(() => setCopyAllStatus(false), 2200);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <aside
      id="action-area-panel"
      className={`border-t lg:border-t-0 lg:border-l border-stone-200 bg-[#FDFCF9] flex flex-col transition-all duration-300 ease-in-out ${
        isOpen ? 'lg:w-[580px] xl:w-[680px] min-h-[420px] lg:min-h-0' : 'lg:w-14 h-12 lg:h-auto'
      }`}
    >
      {/* Panel Collapsible Header Bar */}
      <div
        onClick={onToggle}
        className="p-3.5 bg-stone-100/80 hover:bg-stone-200/60 border-b border-stone-200/80 flex items-center justify-between cursor-pointer select-none transition-colors"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <button
            id="collapse-action-panel-btn"
            aria-label={isOpen ? 'Collapse panel' : 'Expand panel'}
            className="p-1 text-stone-500 hover:text-stone-800 rounded-sm"
          >
            {isOpen ? (
              <ChevronRight className="w-4 h-4 hidden lg:block" />
            ) : (
              <ChevronRight className="w-4 h-4 hidden lg:block -rotate-180" />
            )}
            <ChevronDown
              className={`w-4 h-4 lg:hidden transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-stone-700" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800 truncate">
              Action Area • Dual Drafts
            </h2>
          </div>
          {drafts && (
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
              Drafts Active
            </span>
          )}
        </div>

        {isOpen && drafts && (
          <button
            id="copy-both-drafts-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyBoth();
            }}
            className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-300 px-2.5 py-1 rounded-md shadow-2xs font-medium cursor-pointer"
          >
            {copyAllStatus ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Both Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Both</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Main Panel Content (when open) */}
      {isOpen ? (
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col space-y-4">
          {drafts ? (
            /* Side-by-side Draft View */
            <div className="space-y-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between text-xs text-stone-600 pb-1 border-b border-stone-200">
                <span className="font-medium">
                  Review the 2 distinct drafts below. Click any draft to copy or edit.
                </span>
                <span className="font-mono text-[11px] text-stone-400">
                  Option A vs Option B
                </span>
              </div>

              {/* Side by side layout */}
              <div
                id="side-by-side-drafts-container"
                className="grid grid-cols-1 xl:grid-cols-2 gap-4 flex-1"
              >
                <div className="min-h-[380px]">
                  <DraftCard
                    draft={drafts.optionA}
                    onUpdateDraft={(newText) => {
                      if (onUpdateDraft) onUpdateDraft('option-a', newText);
                    }}
                  />
                </div>
                <div className="min-h-[380px]">
                  <DraftCard
                    draft={drafts.optionB}
                    onUpdateDraft={(newText) => {
                      if (onUpdateDraft) onUpdateDraft('option-b', newText);
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Discovery in Progress State */
            <div
              id="discovery-in-progress-state"
              className="flex-1 flex flex-col justify-between space-y-6"
            >
              <div>
                <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>Discovery Phase in Progress</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    The Ghostwriter is pacing the conversation to ask one thoughtful question at a time. Once context is clear and your preferred address is confirmed, two side-by-side drafts will generate right here.
                  </p>
                </div>

                {/* Progress Checklist */}
                <div className="mt-5 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Agent Context Anchors
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div
                      className={`p-3 rounded-lg border flex items-start gap-3 transition-colors ${
                        discoveryProgress.hasIncidentContext
                          ? 'bg-emerald-50/50 border-emerald-200 text-stone-800'
                          : 'bg-stone-50 border-stone-200 text-stone-500'
                      }`}
                    >
                      {discoveryProgress.hasIncidentContext ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-medium text-stone-800">
                          1. Discovery & What Happened
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Listening deeply to the recent situation without early judgment.
                        </p>
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-lg border flex items-start gap-3 transition-colors ${
                        discoveryProgress.hasEverydayHelp
                          ? 'bg-emerald-50/50 border-emerald-200 text-stone-800'
                          : 'bg-stone-50 border-stone-200 text-stone-500'
                      }`}
                    >
                      {discoveryProgress.hasEverydayHelp ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-medium text-stone-800">
                          2. Everyday Practical Help
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Acknowledging his practical effort (e.g. credit card paperwork).
                        </p>
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-lg border flex items-start gap-3 transition-colors ${
                        discoveryProgress.hasStudyAbroadGratitude
                          ? 'bg-emerald-50/50 border-emerald-200 text-stone-800'
                          : 'bg-stone-50 border-stone-200 text-stone-500'
                      }`}
                    >
                      {discoveryProgress.hasStudyAbroadGratitude ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-medium text-stone-800">
                          3. Long-Term Gratitude
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Bridging into gratitude for supporting your studies abroad.
                        </p>
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-lg border flex items-start gap-3 transition-colors ${
                        discoveryProgress.hasAddressingConfirmed
                          ? 'bg-emerald-50/50 border-emerald-200 text-stone-800'
                          : 'bg-stone-50 border-stone-200 text-stone-500'
                      }`}
                    >
                      {discoveryProgress.hasAddressingConfirmed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-medium text-stone-800">
                          4. Address Confirmation Hook
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Preference: {discoveryProgress.addressingPreference || "Confirming whether you prefer 'Dad' or 'Dana'"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview placeholders */}
              <div className="p-4 bg-stone-100/70 rounded-xl border border-dashed border-stone-300 text-center">
                <p className="text-xs font-medium text-stone-600">
                  Dual Drafts will render side-by-side:
                </p>
                <div className="grid grid-cols-2 gap-3 mt-3 text-left">
                  <div className="p-2.5 bg-white rounded-lg border border-stone-200 text-[11px] opacity-75">
                    <span className="font-semibold text-stone-800 block">Option A</span>
                    <span className="text-stone-500">Grounded & Understated</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-amber-200 text-[11px] opacity-75">
                    <span className="font-semibold text-stone-800 block">Option B</span>
                    <span className="text-stone-500">Warm & Forward-Looking</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Collapsed strip for desktop */
        <div className="hidden lg:flex flex-1 items-center justify-center py-6">
          <div className="[writing-mode:vertical-rl] text-xs font-semibold tracking-wider uppercase text-stone-400 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-stone-300"></span>
            Action Area • Dual Drafts
          </div>
        </div>
      )}
    </aside>
  );
};
