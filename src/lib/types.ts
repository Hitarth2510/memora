export interface Flashcard {
  id: string;
  front: string;
  back: string;
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
