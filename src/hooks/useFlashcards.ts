
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Flashcard, DeckInfo } from '@/lib/types';

const FLASHCARDS_STORAGE_KEY = 'memoryForgeFlashcards';
const INITIAL_EASINESS_FACTOR = 2.5;
const MIN_EASINESS_FACTOR = 1.3;

export function useFlashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFlashcards = localStorage.getItem(FLASHCARDS_STORAGE_KEY);
      if (storedFlashcards) {
        try {
          const parsedFlashcards: Flashcard[] = JSON.parse(storedFlashcards).map((card: any) => ({
            ...card,
            // Ensure deckId and deckName have default values if missing from old storage
            deckId: card.deckId || 'user-created', 
            deckName: card.deckName || 'My Custom Cards',
            nextReviewDate: new Date(card.nextReviewDate),
            ...(card.lastReviewedDate && { lastReviewedDate: new Date(card.lastReviewedDate) }),
          }));
          setFlashcards(parsedFlashcards);
        } catch (error) {
          console.error("Failed to parse flashcards from localStorage", error);
          localStorage.removeItem(FLASHCARDS_STORAGE_KEY); 
        }
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(flashcards));
    }
  }, [flashcards, isLoaded]);

  const addFlashcard = useCallback((
    front: string, 
    back: string, 
    deckId: string,
    deckName: string,
    frontImageUrl?: string, 
    backImageUrl?: string
  ) => {
    const newFlashcard: Flashcard = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      front,
      back,
      frontImageUrl,
      backImageUrl,
      deckId,
      deckName,
      interval: 0,
      repetitions: 0,
      easinessFactor: INITIAL_EASINESS_FACTOR,
      nextReviewDate: new Date(), 
    };
    setFlashcards(prev => [...prev, newFlashcard]);
  }, []);

  const updateFlashcardReview = useCallback((cardId: string, quality: number) => { 
    setFlashcards(prev =>
      prev.map(card => {
        if (card.id === cardId) {
          let { repetitions, interval, easinessFactor } = card;
          const today = new Date();

          if (quality < 3) { 
            repetitions = 0;
            interval = 1; 
          } else { 
            repetitions += 1;
            if (repetitions === 1) {
              interval = 1;
            } else if (repetitions === 2) {
              interval = 6;
            } else {
              interval = Math.max(1, Math.round(card.interval * easinessFactor));
            }
          }
          
          easinessFactor = Math.max(MIN_EASINESS_FACTOR, easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
          
          const nextReviewDate = new Date(today);
          nextReviewDate.setDate(today.getDate() + interval);

          return { ...card, repetitions, interval, easinessFactor, nextReviewDate, lastReviewedDate: today };
        }
        return card;
      })
    );
  }, []);

  const getDueFlashcards = useCallback((deckId?: string): Flashcard[] => {
    if (!isLoaded) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    let due = flashcards
      .filter(card => {
          const nextReview = new Date(card.nextReviewDate);
          nextReview.setHours(0,0,0,0);
          return nextReview <= today;
      });

    if (deckId) {
      due = due.filter(card => card.deckId === deckId);
    }
    
    return due.sort((a, b) => new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime());
  }, [flashcards, isLoaded]);
  
  const getDecksWithDueCards = useCallback((): DeckInfo[] => {
    if (!isLoaded) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueCardsByDeck: Record<string, { name: string, count: number }> = {};

    flashcards.forEach(card => {
      const nextReview = new Date(card.nextReviewDate);
      nextReview.setHours(0,0,0,0);
      if (nextReview <= today) {
        if (!dueCardsByDeck[card.deckId]) {
          dueCardsByDeck[card.deckId] = { name: card.deckName, count: 0 };
        }
        dueCardsByDeck[card.deckId].count += 1;
      }
    });

    return Object.entries(dueCardsByDeck).map(([id, { name, count }]) => ({
      id,
      name,
      dueCardCount: count,
    })).sort((a,b) => a.name.localeCompare(b.name));
  }, [flashcards, isLoaded]);
  
  const deleteFlashcard = useCallback((cardId: string) => {
    setFlashcards(prev => prev.filter(card => card.id !== cardId));
  }, []);

  return { flashcards, addFlashcard, updateFlashcardReview, getDueFlashcards, getDecksWithDueCards, deleteFlashcard, isLoaded };
}
