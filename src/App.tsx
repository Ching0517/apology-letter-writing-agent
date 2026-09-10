import React, { useState, useMemo, useEffect } from 'react';
import { ChatMessage, LetterDraft } from './types';
import { findLatestDrafts, analyzeDiscovery } from './utils/draftParser';
import { Header } from './components/Header';
import { ChatArea } from './components/ChatArea';
import { DraftsPanel } from './components/DraftsPanel';
import { SystemDiagramModal } from './components/SystemDiagramModal';

const INITIAL_AGENT_MESSAGE: ChatMessage = {
  id: 'msg-init-1',
  role: 'model',
  content:
    "Apologizing to a parent takes real vulnerability and emotional courage, and it’s rarely easy to take this first step.\n\nCould you tell me a little about what happened between you and your father, Dana?",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_AGENT_MESSAGE]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDiagramOpen, setIsDiagramOpen] = useState<boolean>(false);
  const [isDraftsPanelOpen, setIsDraftsPanelOpen] = useState<boolean>(true);
  const [editedDrafts, setEditedDrafts] = useState<{ optionA: LetterDraft; optionB: LetterDraft } | null>(null);

  // Discover latest drafts from conversation messages
  const parsedDrafts = useMemo(() => {
    return findLatestDrafts(messages);
  }, [messages]);

  // Keep active drafts in sync with parsed drafts unless manually customized
  useEffect(() => {
    if (parsedDrafts) {
      setEditedDrafts(parsedDrafts);
      // Auto-open drafts panel when drafts are first produced
      setIsDraftsPanelOpen(true);
    }
  }, [parsedDrafts]);

  // Calculate discovery anchors progress
  const discoveryProgress = useMemo(() => {
    return analyzeDiscovery(messages);
  }, [messages]);

  const hasDrafts = Boolean(editedDrafts !== null);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setErrorMessage(null);
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      const modelReply = data.reply;

      const modelMsg: ChatMessage = {
        id: `msg-model-${Date.now()}`,
        role: 'model',
        content: modelReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMessage(
        err?.message || 'Could not connect to the Ghostwriter Agent. Please check your network or API configuration.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryLast = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content);
    }
  };

  const handleResetSession = () => {
    if (
      messages.length > 1 &&
      !window.confirm('Start a fresh letter consultation? Your existing conversation will be cleared.')
    ) {
      return;
    }
    setMessages([
      {
        ...INITIAL_AGENT_MESSAGE,
        id: `msg-init-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setEditedDrafts(null);
    setErrorMessage(null);
  };

  const handleUpdateDraft = (id: 'option-a' | 'option-b', newContent: string) => {
    setEditedDrafts((prev) => {
      if (!prev) return null;
      if (id === 'option-a') {
        return {
          ...prev,
          optionA: {
            ...prev.optionA,
            content: newContent,
          },
        };
      } else {
        return {
          ...prev,
          optionB: {
            ...prev.optionB,
            content: newContent,
          },
        };
      }
    });
  };

  return (
    <div id="letter-ghostwriter-studio-app" className="h-screen flex flex-col bg-[#FBF9F5] overflow-hidden">
      {/* Header with Branding and System Diagram Trigger */}
      <Header
        onOpenDiagram={() => setIsDiagramOpen(true)}
        isDraftsPanelOpen={isDraftsPanelOpen}
        onToggleDraftsPanel={() => setIsDraftsPanelOpen(!isDraftsPanelOpen)}
        hasDrafts={hasDrafts}
        onResetSession={handleResetSession}
      />

      {/* Main Studio Body: Chat Interface + Collapsible Side/Lower Drafts Action Panel */}
      <main id="studio-main-workspace" className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Chat Interface */}
        <ChatArea
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onOpenDraftsPanel={() => setIsDraftsPanelOpen(true)}
          hasDrafts={hasDrafts}
          errorMessage={errorMessage}
          onRetry={handleRetryLast}
        />

        {/* Collapsible Action Area for Dual Drafts */}
        <DraftsPanel
          isOpen={isDraftsPanelOpen}
          onToggle={() => setIsDraftsPanelOpen(!isDraftsPanelOpen)}
          drafts={editedDrafts}
          discoveryProgress={discoveryProgress}
          onUpdateDraft={handleUpdateDraft}
        />
      </main>

      {/* Info / System Diagram Modal */}
      <SystemDiagramModal
        isOpen={isDiagramOpen}
        onClose={() => setIsDiagramOpen(false)}
      />
    </div>
  );
}
