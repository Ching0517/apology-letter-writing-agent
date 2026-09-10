import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Send, Feather, User, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';

interface ChatAreaProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onOpenDraftsPanel: () => void;
  hasDrafts: boolean;
  errorMessage: string | null;
  onRetry: () => void;
}

const CONTEXT_NUDGES = [
  'I lost my temper over the credit card paperwork',
  'I really want to thank him for supporting my study abroad',
  "I'd like to address him as 'Dad'",
  "I'd prefer to address him as 'Dana'",
];

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onOpenDraftsPanel,
  hasDrafts,
  errorMessage,
  onRetry,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    // Auto-adjust height
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  };

  return (
    <div
      id="chat-area-container"
      className="flex-1 flex flex-col h-full bg-[#FBF9F5] relative overflow-hidden"
    >
      {/* Supportive Notice Banner if drafts are ready */}
      {hasDrafts && (
        <div
          id="drafts-ready-notification"
          className="bg-amber-100/90 border-b border-amber-200 px-4 py-2.5 text-xs text-stone-800 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span className="font-medium">
              Dual drafts ready: Option A (Grounded) & Option B (Warm & Forward-Looking).
            </span>
          </div>
          <button
            onClick={onOpenDraftsPanel}
            className="inline-flex items-center gap-1 font-semibold text-stone-900 hover:text-stone-700 underline underline-offset-2 cursor-pointer"
          >
            <span>View Side-by-Side in Action Panel</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div
        id="chat-messages-scroll"
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6"
      >
        {messages.map((message) => {
          const isModel = message.role === 'model';
          return (
            <div
              key={message.id}
              id={`chat-message-${message.id}`}
              className={`flex gap-3 sm:gap-4 max-w-3xl ${
                isModel ? 'mr-auto' : 'ml-auto flex-row-reverse'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                  isModel
                    ? 'bg-stone-900 text-amber-100 border border-stone-800'
                    : 'bg-amber-700 text-amber-50'
                }`}
              >
                {isModel ? (
                  <Feather className="w-4 h-4 text-amber-200" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`flex flex-col space-y-1 text-sm sm:text-base leading-relaxed rounded-2xl p-4 sm:p-5 shadow-xs transition-all ${
                  isModel
                    ? 'bg-white text-stone-800 border border-stone-200/90 rounded-tl-sm'
                    : 'bg-stone-900 text-stone-100 rounded-tr-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span
                    className={`text-[11px] font-semibold tracking-wider uppercase ${
                      isModel ? 'text-amber-800' : 'text-stone-400'
                    }`}
                  >
                    {isModel ? 'Ghostwriter Agent' : 'You'}
                  </span>
                  <span
                    className={`text-[10px] ${
                      isModel ? 'text-stone-400' : 'text-stone-400'
                    }`}
                  >
                    {message.timestamp}
                  </span>
                </div>

                <div className="whitespace-pre-line font-normal space-y-2">
                  {message.content}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading / Thinking Indicator */}
        {isLoading && (
          <div
            id="chat-loading-indicator"
            className="flex gap-3 sm:gap-4 max-w-3xl mr-auto animate-in fade-in duration-200"
          >
            <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-100 flex items-center justify-center shrink-0 shadow-2xs">
              <Feather className="w-4 h-4 text-amber-200 animate-pulse" />
            </div>
            <div className="bg-white border border-stone-200/90 rounded-2xl rounded-tl-sm p-4 text-sm text-stone-600 shadow-xs flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-xs text-stone-500 ml-2 font-medium">
                Ghostwriter is considering your words...
              </span>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div
            id="chat-error-banner"
            className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={onRetry}
              className="px-2.5 py-1 bg-white border border-red-300 hover:bg-red-50 font-medium rounded-md text-red-800 transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer Area */}
      <div
        id="chat-composer-section"
        className="p-4 sm:p-5 bg-white border-t border-stone-200/80 shadow-xs"
      >
        <div className="max-w-3xl mx-auto space-y-2.5">
          {/* Quick thought inspiration chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs text-stone-600 no-scrollbar">
            <span className="text-[11px] text-stone-400 shrink-0 font-medium mr-1">
              Suggestions:
            </span>
            {CONTEXT_NUDGES.map((nudge, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputText(nudge)}
                className="shrink-0 px-2.5 py-1 bg-stone-100 hover:bg-stone-200/70 border border-stone-200 text-stone-700 rounded-full transition-colors cursor-pointer text-xs"
              >
                {nudge}
              </button>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="relative flex items-end gap-2 bg-[#FBF9F5] border border-stone-300 rounded-xl p-2 focus-within:ring-2 focus-within:ring-stone-400/20 focus-within:border-stone-500 transition-all"
          >
            <textarea
              ref={textareaRef}
              id="chat-message-input"
              value={inputText}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
              placeholder="Speak candidly with the Ghostwriter..."
              className="flex-1 max-h-40 min-h-[44px] p-2 bg-transparent text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none resize-none leading-relaxed"
            />

            <button
              type="submit"
              id="send-message-btn"
              disabled={!inputText.trim() || isLoading}
              aria-label="Send message"
              className={`p-2.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                inputText.trim() && !isLoading
                  ? 'bg-stone-900 text-stone-100 hover:bg-stone-800 shadow-2xs'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Footnote instruction */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 px-1">
            <span>
              Press <kbd className="font-mono bg-stone-100 px-1 py-0.5 rounded border border-stone-200 text-stone-600">Enter</kbd> to send, <kbd className="font-mono bg-stone-100 px-1 py-0.5 rounded border border-stone-200 text-stone-600">Shift + Enter</kbd> for new line
            </span>
            <span className="hidden sm:inline">Pacing: 1 question at a time</span>
          </div>
        </div>
      </div>
    </div>
  );
};
