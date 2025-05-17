"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Flashcard } from '@/lib/types';

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
            nextReviewDate: new Date(card.nextReviewDate),
            ...(card.lastReviewedDate && { lastReviewedDate: new Date(card.lastReviewedDate) }),
          }));
          setFlashcards(parsedFlashcards);
        } catch (error) {
          console.error("Failed to parse flashcards from localStorage", error);
          localStorage.removeItem(FLASHCARDS_STORAGE_KEY); // Clear corrupted data
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

  const addFlashcard = useCallback((front: string, back: string) => {
    const newFlashcard: Flashcard = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // More unique ID
      front,
      back,
      interval: 0,
      repetitions: 0,
      easinessFactor: INITIAL_EASINESS_FACTOR,
      nextReviewDate: new Date(), // Due immediately
    };
    setFlashcards(prev => [...prev, newFlashcard]);
  }, []);

  const updateFlashcardReview = useCallback((cardId: string, quality: number) => { // quality 0-5
    setFlashcards(prev =>
      prev.map(card => {
        if (card.id === cardId) {
          let { repetitions, interval, easinessFactor } = card;
          const today = new Date();

          if (quality < 3) { // Failed (e.g., "Don't Know", map to quality 0-2)
            repetitions = 0;
            interval = 1; // Reset interval to 1 day
          } else { // Passed (e.g., "Know", map to quality 3-5)
            repetitions += 1;
            if (repetitions === 1) {
              interval = 1;
            } else if (repetitions === 2) {
              interval = 6;
            } else {
              interval = Math.max(1, Math.round(card.interval * easinessFactor)); // Ensure interval is at least 1
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

  const getDueFlashcards = useCallback(() => {
    if (!isLoaded) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    return flashcards
      .filter(card => {
          const nextReview = new Date(card.nextReviewDate);
          nextReview.setHours(0,0,0,0);
          return nextReview <= today;
      })
      .sort((a, b) => new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime());
  }, [flashcards, isLoaded]);
  
  const deleteFlashcard = useCallback((cardId: string) => {
    setFlashcards(prev => prev.filter(card => card.id !== cardId));
  }, []);


  return { flashcards, addFlashcard, updateFlashcardReview, getDueFlashcards, deleteFlashcard, isLoaded };
}
