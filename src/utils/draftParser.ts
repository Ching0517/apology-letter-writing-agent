import { LetterDraft, DiscoveryProgress, ChatMessage } from '../types';

/**
 * Extracts Option A and Option B drafts from an agent message if present.
 */
export function extractDraftsFromText(text: string): { optionA?: LetterDraft; optionB?: LetterDraft } | null {
  if (!text) return null;

  // Patterns to locate Option A and Option B
  const optionAPattern = /(?:###?\s*Option\s*A[^\n]*|\*\*Option\s*A[^\n]*\*\*|Option\s*A\s*[:\-])\s*\n+([\s\S]*?)(?=(?:###?\s*Option\s*B|\*\*Option\s*B|Option\s*B\s*[:\-]|$))/i;
  const optionBPattern = /(?:###?\s*Option\s*B[^\n]*|\*\*Option\s*B[^\n]*\*\*|Option\s*B\s*[:\-])\s*\n+([\s\S]*)/i;

  const matchA = text.match(optionAPattern);
  const matchB = text.match(optionBPattern);

  if (!matchA && !matchB) {
    return null;
  }

  let rawA = matchA ? matchA[1].trim() : '';
  let rawB = matchB ? matchB[1].trim() : '';

  // Clean trailing conversational inquiries from Option B (e.g., "Let me know how these feel...")
  if (rawB) {
    const closingSplit = rawB.split(/\n\s*\n(?=(?:Let me know|How do these|Do either of|Would you like|Tell me how|I hope these|Feel free to|What do you think))/i);
    if (closingSplit.length > 1) {
      rawB = closingSplit[0].trim();
    }
  }

  const optionA: LetterDraft = {
    id: 'option-a',
    title: 'Option A',
    subtitle: 'Grounded & Understated',
    toneTag: 'Quiet dignity • Direct honesty',
    content: rawA || 'Drafting in progress...',
  };

  const optionB: LetterDraft = {
    id: 'option-b',
    title: 'Option B',
    subtitle: 'Warm & Forward-Looking',
    toneTag: 'Heartfelt gratitude • Bridge-building',
    content: rawB || 'Drafting in progress...',
  };

  return { optionA, optionB };
}

/**
 * Finds the latest drafts across the entire conversation history.
 */
export function findLatestDrafts(messages: ChatMessage[]): { optionA: LetterDraft; optionB: LetterDraft } | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'model') {
      const extracted = extractDraftsFromText(messages[i].content);
      if (extracted && extracted.optionA && extracted.optionB && extracted.optionA.content && extracted.optionB.content) {
        return { optionA: extracted.optionA, optionB: extracted.optionB };
      }
    }
  }
  return null;
}

/**
 * Analyzes conversation context to track discovery progress signals
 */
export function analyzeDiscovery(messages: ChatMessage[]): DiscoveryProgress {
  const combinedText = messages.map(m => m.content.toLowerCase()).join(' ');

  const hasIncidentContext =
    combinedText.includes('happen') ||
    combinedText.includes('argument') ||
    combinedText.includes('fight') ||
    combinedText.includes('frustrat') ||
    combinedText.includes('apolog') ||
    combinedText.includes('late') ||
    combinedText.includes('paperwork') ||
    combinedText.includes('card') ||
    combinedText.includes('shout') ||
    combinedText.includes('snapped') ||
    combinedText.includes('distance') ||
    messages.length >= 3;

  const hasEverydayHelp =
    combinedText.includes('paperwork') ||
    combinedText.includes('credit card') ||
    combinedText.includes('errand') ||
    combinedText.includes('practical') ||
    combinedText.includes('help') ||
    combinedText.includes('taxes') ||
    combinedText.includes('admin') ||
    combinedText.includes('form') ||
    combinedText.includes('bills');

  const hasStudyAbroadGratitude =
    combinedText.includes('abroad') ||
    combinedText.includes('study') ||
    combinedText.includes('gratitude') ||
    combinedText.includes('thank') ||
    combinedText.includes('college') ||
    combinedText.includes('school') ||
    combinedText.includes('tuition') ||
    combinedText.includes('support') ||
    combinedText.includes('opportunity');

  const hasAddressingDad = combinedText.includes('call him dad') || combinedText.includes("'dad'") || combinedText.includes('"dad"') || combinedText.includes('address him as dad');
  const hasAddressingDana = combinedText.includes('call him dana') || combinedText.includes("'dana'") || combinedText.includes('"dana"') || combinedText.includes('address him as dana');
  
  let addressingPreference: string | undefined = undefined;
  if (hasAddressingDad) addressingPreference = 'Dad';
  else if (hasAddressingDana) addressingPreference = 'Dana';

  const hasAddressingConfirmed = Boolean(addressingPreference || combinedText.includes('address') || combinedText.includes('first name') || combinedText.includes('call him'));

  const latestDrafts = findLatestDrafts(messages);
  const isDraftingReady = Boolean(latestDrafts !== null);

  return {
    hasIncidentContext,
    hasEverydayHelp,
    hasStudyAbroadGratitude,
    hasAddressingConfirmed,
    addressingPreference,
    isDraftingReady,
  };
}
