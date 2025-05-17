
"use client";

import { useState, useEffect, useCallback } from 'react';

const STREAK_STORAGE_KEY = 'memoraReviewStreak';
const LAST_REVIEW_DATE_KEY = 'memoraLastReviewDate';

export function useReviewStreak() {
  const [streak, setStreak] = useState(0);
  const [lastReviewDate, setLastReviewDate] = useState<Date | null>(null);
  const [isStreakLoaded, setIsStreakLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedStreak = localStorage.getItem(STREAK_STORAGE_KEY);
      const storedLastReviewDate = localStorage.getItem(LAST_REVIEW_DATE_KEY);

      let currentStreak = 0;
      let lastDate: Date | null = null;

      if (storedStreak) {
        currentStreak = parseInt(storedStreak, 10);
      }
      if (storedLastReviewDate) {
        lastDate = new Date(storedLastReviewDate);
      }

      // Check if streak should be reset due to missed days
      if (lastDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastReviewDay = new Date(lastDate);
        lastReviewDay.setHours(0, 0, 0, 0);

        const diffTime = today.getTime() - lastReviewDay.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 1) {
          currentStreak = 0; // Reset streak if more than one day has passed
        }
      }
      
      setStreak(currentStreak);
      setLastReviewDate(lastDate);
      setIsStreakLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isStreakLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STREAK_STORAGE_KEY, streak.toString());
      if (lastReviewDate) {
        localStorage.setItem(LAST_REVIEW_DATE_KEY, lastReviewDate.toISOString());
      } else {
        // If streak is 0 and no last review date, ensure it's cleared
        if (streak === 0) {
          localStorage.removeItem(LAST_REVIEW_DATE_KEY);
        }
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

      if (diffDays === 0) {
        // Reviewed today already, or multiple times on the same day after a break.
        // If streak was 0 (meaning it was reset or first time), set to 1.
        if (streak === 0) {
          setStreak(1);
        }
        // Otherwise, streak doesn't change for same-day reviews.
      } else if (diffDays === 1) {
        setStreak(s => s + 1);
      } else { // diffDays > 1 (missed days) or diffDays < 0 (should not happen)
        setStreak(1); // Reset to 1 for the new review day
      }
    } else {
      // No last review date, so this is the first review or first after a long break
      setStreak(1); 
    }
    setLastReviewDate(today);
  }, [lastReviewDate, isStreakLoaded, streak]);
  
  // Effect to check and reset streak if needed on component mount / load
  // This was partially handled in the first useEffect, this ensures consistency.
  useEffect(() => {
    if (!isStreakLoaded) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (lastReviewDate) {
      const lastReviewDay = new Date(lastReviewDate);
      lastReviewDay.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - lastReviewDay.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 1) {
        if (streak !== 0) { // Only update if streak is not already 0
             setStreak(0); 
        }
      }
    } else if (streak !== 0) { // No last review date, but streak is not 0 (e.g. manual clear of date but not streak)
        setStreak(0);
    }
  }, [isStreakLoaded, lastReviewDate, streak]);

  return { streak, recordReviewSession, isStreakLoaded };
}
