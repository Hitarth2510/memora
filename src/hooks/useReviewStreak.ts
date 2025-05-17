"use client";

import { useState, useEffect, useCallback } from 'react';

const STREAK_STORAGE_KEY = 'memoryForgeStreak';
const LAST_REVIEW_DATE_KEY = 'memoryForgeLastReviewDate';

export function useReviewStreak() {
  const [streak, setStreak] = useState(0);
  const [lastReviewDate, setLastReviewDate] = useState<Date | null>(null);
  const [isStreakLoaded, setIsStreakLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedStreak = localStorage.getItem(STREAK_STORAGE_KEY);
      const storedLastReviewDate = localStorage.getItem(LAST_REVIEW_DATE_KEY);

      if (storedStreak) {
        setStreak(parseInt(storedStreak, 10));
      }
      if (storedLastReviewDate) {
        setLastReviewDate(new Date(storedLastReviewDate));
      }
      setIsStreakLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isStreakLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STREAK_STORAGE_KEY, streak.toString());
      if (lastReviewDate) {
        localStorage.setItem(LAST_REVIEW_DATE_KEY, lastReviewDate.toISOString());
      } else {
        localStorage.removeItem(LAST_REVIEW_DATE_KEY);
      }
    }
  }, [streak, lastReviewDate, isStreakLoaded]);

  const recordReviewSession = useCallback(() => {
    if(!isStreakLoaded) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (lastReviewDate) {
      const lastReviewDay = new Date(lastReviewDate);
      lastReviewDay.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - lastReviewDay.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        setStreak(s => s + 1);
      } else if (diffDays > 1) {
        setStreak(1); 
      } else if (diffDays === 0) {
        // Already reviewed today or multiple times, streak doesn't change for same day
        // If it's the very first session, streak should be 1.
        if (streak === 0) setStreak(1);
      }
    } else {
      setStreak(1); 
    }
    setLastReviewDate(today);
  }, [lastReviewDate, isStreakLoaded, streak]);
  
  useEffect(() => {
    if (!isStreakLoaded || !lastReviewDate) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastReviewDay = new Date(lastReviewDate);
    lastReviewDay.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - lastReviewDay.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      setStreak(0); 
    }
  }, [isStreakLoaded, lastReviewDate]);

  return { streak, recordReviewSession, isStreakLoaded };
}
