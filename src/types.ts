export interface MemoryItem {
  id: string;
  image: string;
  caption: string;
  location?: string;
  date?: string;
}

export interface AttireGuideline {
  id: string;
  title: string;
  emoji: string;
  subtitle: string;
  description: string;
  tips: string[];
  bgTint: string;
}

export interface InvitationConfig {
  recipientName: string;
  senderName: string;
  eventTitle: string;
  dateStr: string;
  timeStr: string;
  locationClue: string;
  loveLetterIntro: string;
  formalInviteText: string;
  sweetNotePrompt: string;
  partnerResponse: {
    selectedOptions: string[];
    note: string;
    signatureType: 'draw' | 'type';
    signatureData: string;
    isConfirmed: boolean;
    confirmedAt?: string;
  };
}
