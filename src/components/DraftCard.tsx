import React, { useState } from 'react';
import { LetterDraft } from '../types';
import { Copy, Check, Edit3, Eye, FileDown } from 'lucide-react';

interface DraftCardProps {
  draft: LetterDraft;
  onUpdateDraft?: (newContent: string) => void;
}

export const DraftCard: React.FC<DraftCardProps> = ({ draft, onUpdateDraft }) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(draft.content);

  // Sync if prop changes and not currently editing
  React.useEffect(() => {
    if (!isEditing) {
      setCurrentText(draft.content);
    }
  }, [draft.content, isEditing]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Failed to copy draft', err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([currentText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${draft.title.toLowerCase().replace(/\s+/g, '-')}-apology-letter.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const wordCount = currentText.trim().split(/\s+/).filter(Boolean).length;
  const readingTimeSec = Math.max(15, Math.round((wordCount / 180) * 60));

  const isOptionA = draft.id === 'option-a';

  return (
    <div
      id={`draft-card-${draft.id}`}
      className={`flex flex-col h-full bg-[#FCFBF7] rounded-xl border transition-all shadow-xs ${
        isOptionA
          ? 'border-stone-300 hover:border-stone-400'
          : 'border-amber-200/90 hover:border-amber-300 bg-amber-50/20'
      }`}
    >
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-stone-200/80 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                isOptionA
                  ? 'bg-stone-200 text-stone-800'
                  : 'bg-amber-200/70 text-amber-900'
              }`}
            >
              {draft.title}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              ~{readingTimeSec}s read • {wordCount} words
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-stone-900 mt-1">
            {draft.subtitle}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">{draft.toneTag}</p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id={`toggle-edit-${draft.id}`}
            onClick={() => {
              if (isEditing && onUpdateDraft) {
                onUpdateDraft(currentText);
              }
              setIsEditing(!isEditing);
            }}
            title={isEditing ? 'View formatted' : 'Personalize / Edit draft'}
            className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            {isEditing ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </button>

          <button
            id={`download-${draft.id}`}
            onClick={handleDownload}
            title="Download text file"
            className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
          </button>

          <button
            id={`copy-btn-${draft.id}`}
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-900 hover:bg-stone-800 text-stone-100 shadow-xs'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-100" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-200" />
                <span>Copy Draft</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Letter Content Body */}
      <div className="flex-1 p-5 sm:p-6 overflow-y-auto">
        {isEditing ? (
          <div className="h-full flex flex-col">
            <label className="text-xs font-semibold text-stone-500 mb-1">
              Direct Editing Mode
            </label>
            <textarea
              id={`edit-textarea-${draft.id}`}
              value={currentText}
              onChange={(e) => {
                setCurrentText(e.target.value);
                if (onUpdateDraft) onUpdateDraft(e.target.value);
              }}
              className="w-full h-72 sm:h-80 p-3.5 text-sm sm:text-base font-editorial text-stone-800 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 leading-relaxed resize-y"
              placeholder="Refine your letter..."
            />
            <p className="text-[11px] text-stone-400 mt-2">
              Edits will be preserved and copied when using the Copy button.
            </p>
          </div>
        ) : (
          <div
            id={`letter-display-${draft.id}`}
            className="font-editorial text-base sm:text-lg text-stone-800 leading-relaxed whitespace-pre-line selection:bg-amber-100"
          >
            {currentText}
          </div>
        )}
      </div>

      {/* Bottom bar advice note */}
      <div className="px-5 py-3 bg-stone-100/60 border-t border-stone-200/80 text-[11px] text-stone-500 flex items-center justify-between">
        <span>
          {isOptionA
            ? 'Quiet, non-defensive tone focusing on immediate grounding.'
            : 'Warm opening with long-term gratitude for studying abroad.'}
        </span>
        <span className="font-mono text-stone-400">Ready to deliver</span>
      </div>
    </div>
  );
};
