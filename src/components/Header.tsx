import React from 'react';
import { Feather, Network, PanelsRightBottom, Sparkles, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onOpenDiagram: () => void;
  isDraftsPanelOpen: boolean;
  onToggleDraftsPanel: () => void;
  hasDrafts: boolean;
  onResetSession: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDiagram,
  isDraftsPanelOpen,
  onToggleDraftsPanel,
  hasDrafts,
  onResetSession,
}) => {
  return (
    <header
      id="studio-header"
      className="sticky top-0 z-30 w-full bg-[#FDFCF9]/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 py-3.5 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand / Studio Identity */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-stone-900 text-amber-100 flex items-center justify-center shadow-xs">
            <Feather className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-stone-900">
                Letter Ghostwriter Studio
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Agent Ready
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              Thoughtful apology correspondence • Dana
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="reset-session-btn"
            onClick={onResetSession}
            title="Start new letter consultation"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors border border-transparent hover:border-stone-200 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Start Fresh</span>
          </button>

          {/* Action Area Toggle Button */}
          <button
            id="toggle-drafts-panel-btn"
            onClick={onToggleDraftsPanel}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-all border cursor-pointer ${
              hasDrafts
                ? 'bg-amber-100/80 text-stone-900 border-amber-300 hover:bg-amber-200/90 shadow-xs'
                : isDraftsPanelOpen
                ? 'bg-stone-200/70 text-stone-900 border-stone-300'
                : 'bg-stone-100 hover:bg-stone-200/70 text-stone-700 border-stone-200'
            }`}
          >
            <PanelsRightBottom className="w-4 h-4 text-stone-700" />
            <span className="font-semibold">
              {hasDrafts ? 'Dual Drafts (Ready)' : 'Action Panel'}
            </span>
            {hasDrafts && (
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
            )}
          </button>

          {/* Info / System Diagram Button */}
          <button
            id="open-system-diagram-btn"
            onClick={onOpenDiagram}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Network className="w-4 h-4 text-amber-200" />
            <span>Info / System Diagram</span>
          </button>
        </div>
      </div>
    </header>
  );
};
