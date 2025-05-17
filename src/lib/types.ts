
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  frontImageUrl?: string;
  backImageUrl?: string;
  deckId: string; // Added to identify the deck the card belongs to
  deckName: string; // Added for displaying deck name easily
  // SM-2 parameters
  interval: number; // in days
  repetitions: number;
  easinessFactor: number; // EF
  nextReviewDate: Date;
  lastReviewedDate?: Date;
}

// For AI Generated Flashcards
export interface AiGeneratedFlashcard {
  question: string;
  answer: string;
  // deckId and deckName could be added here if AI generates for a specific deck context
}

// For Preloaded Decks
export interface PreloadedDeckEntry {
  front: string;
  back: string;
  frontImageUrl?: string;
  backImageUrl?: string;
}
export interface PreloadedDeck {
  id: string;
  name: string;
  description: string;
  category: string;
  cards: PreloadedDeckEntry[];
}

// For displaying deck selection
export interface DeckInfo {
  id: string;
  name: string;
  dueCardCount: number;
}
