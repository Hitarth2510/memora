export interface Flashcard {
  id: string;
  front: string;
  back: string;
  frontImageUrl?: string;
  backImageUrl?: string;
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
