
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  frontImageUrl?: string;
  backImageUrl?: string;
  deckId: string; 
  deckName: string; 
  // SM-2 parameters
  interval: number; // in days
  repetitions: number;
  easeFactor: number; // EF - Renamed from easinessFactor
  nextReviewDate: Date;
  lastReviewDate?: Date; // Renamed from lastReviewedDate
}

// For AI Generated Flashcards
export interface AiGeneratedFlashcard {
  question: string;
  answer: string;
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
