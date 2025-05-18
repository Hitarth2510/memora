
"use client";

import { useState, useEffect, useCallback } from 'react';

const STREAK_STORAGE_KEY = 'memoraReviewStreak';
const LAST_REVIEW_DATE_KEY = 'memoraLastReviewDate';
const REVIEW_HISTORY_KEY = 'memoraReviewHistory'; // For heatmap

// Helper to get today's date as YYYY-MM-DD string
const getTodayDateString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

export function useReviewStreak() {
  const [streak, setStreak] = useState(0);
  const [lastReviewDate, setLastReviewDate] = useState<Date | null>(null);
  const [reviewHistory, setReviewHistory] = useState<string[]>([]); // Store YYYY-MM-DD strings
  const [isStreakLoaded, setIsStreakLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedStreak = localStorage.getItem(STREAK_STORAGE_KEY);
      const storedLastReviewDate = localStorage.getItem(LAST_REVIEW_DATE_KEY);
      const storedReviewHistory = localStorage.getItem(REVIEW_HISTORY_KEY);

      let currentStreak = 0;
      let lastDate: Date | null = null;
      let currentHistory: string[] = [];

      if (storedStreak) {
        currentStreak = parseInt(storedStreak, 10);
      }
      if (storedLastReviewDate) {
        lastDate = new Date(storedLastReviewDate);
      }
      if (storedReviewHistory) {
        try {
          currentHistory = JSON.parse(storedReviewHistory);
        } catch (e) {
          console.error("Failed to parse review history:", e);
          currentHistory = [];
        }
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
      setReviewHistory(currentHistory);
      setIsStreakLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isStreakLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STREAK_STORAGE_KEY, streak.toString());
      if (lastReviewDate) {
        localStorage.setItem(LAST_REVIEW_DATE_KEY, lastReviewDate.toISOString());
      } else {
        if (streak === 0) {
          localStorage.removeItem(LAST_REVIEW_DATE_KEY);
        }
      }
      localStorage.setItem(REVIEW_HISTORY_KEY, JSON.stringify(reviewHistory));
    }
  }, [streak, lastReviewDate, reviewHistory, isStreakLoaded]);

  const recordReviewSession = useCallback(() => {
    if(!isStreakLoaded) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayDateString = getTodayDateString();

    setReviewHistory(prevHistory => {
      const newHistory = new Set(prevHistory);
      newHistory.add(todayDateString);
      return Array.from(newHistory);
    });

    if (lastReviewDate) {
      const lastReviewDay = new Date(lastReviewDate);
      lastReviewDay.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - lastReviewDay.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        if (streak === 0) {
          setStreak(1);
        }
      } else if (diffDays === 1) {
        setStreak(s => s + 1);
      } else { 
        setStreak(1); 
      }
    } else {
      setStreak(1); 
    }
    setLastReviewDate(today);
  }, [lastReviewDate, isStreakLoaded, streak]);
  
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
        if (streak !== 0) { 
             setStreak(0); 
        }
      }
    } else if (streak !== 0) { 
        setStreak(0);
    }
  }, [isStreakLoaded, lastReviewDate, streak]);

  return { streak, recordReviewSession, isStreakLoaded, reviewHistory };
}
