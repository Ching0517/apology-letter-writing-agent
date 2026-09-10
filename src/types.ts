export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface LetterDraft {
  id: 'option-a' | 'option-b';
  title: string;
  subtitle: string;
  content: string;
  toneTag: string;
}

export interface DiscoveryProgress {
  hasIncidentContext: boolean;
  hasEverydayHelp: boolean;
  hasStudyAbroadGratitude: boolean;
  hasAddressingConfirmed: boolean;
  addressingPreference?: string;
  isDraftingReady: boolean;
}
