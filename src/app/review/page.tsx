"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FlashcardDisplay } from '@/components/FlashcardDisplay';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useReviewStreak } from '@/hooks/useReviewStreak';
import type { Flashcard } from '@/lib/types';
import { ThumbsUp, ThumbsDown, CheckCircle, Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ReviewPage() {
  const { getDueFlashcards, updateFlashcardReview, isLoaded: flashcardsLoaded } = useFlashcards();
  const { recordReviewSession, isStreakLoaded } = useReviewStreak();
  
  const [dueCards, setDueCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (flashcardsLoaded) {
      setDueCards(getDueFlashcards());
      setIsLoading(false);
    }
  }, [flashcardsLoaded, getDueFlashcards]);

  const currentCard = dueCards[currentCardIndex];

  const handleFlip = () => setIsFlipped(prev => !prev);

  const handleAnswer = useCallback((knewIt: boolean) => {
    if (!currentCard) return;

    const quality = knewIt ? 5 : 2; // Map to SM-2 quality scores (5 for knew, 2 for didn't know)
    updateFlashcardReview(currentCard.id, quality);

    setIsFlipped(false); // Flip back to front for next card
    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      // Session finished
      setSessionCompleted(true);
      if (dueCards.length > 0 && isStreakLoaded) { // Only record if there were cards and streak hook is loaded
        recordReviewSession();
      }
    }
  }, [currentCard, currentCardIndex, dueCards.length, updateFlashcardReview, recordReviewSession, isStreakLoaded]);


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Loading your review session...</p>
      </div>
    );
  }

  if (sessionCompleted) {
    return (
      <div className="text-center max-w-lg mx-auto py-12">
        <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-6" />
        <h2 className="text-4xl font-bold mb-4">Review Session Complete!</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Great job! You've reviewed all due cards for now. Keep up the consistent effort!
        </p>
        <Button size="lg" asChild>
          <Link href="/">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="text-center max-w-lg mx-auto py-12">
        <Zap className="mx-auto h-20 w-20 text-primary mb-6" />
        <h2 className="text-4xl font-bold mb-4">All Caught Up!</h2>
        <p className="text-lg text-muted-foreground mb-8">
          You have no flashcards due for review right now. Nicely done!
        </p>
        <div className="space-x-4">
          <Button size="lg" asChild>
            <Link href="/create">Create More Cards</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <Card className="w-full max-w-xl shadow-none border-none bg-transparent">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Review Session</CardTitle>
          <CardDescription>
            Card {currentCardIndex + 1} of {dueCards.length}. Focus and recall!
          </CardDescription>
        </CardHeader>
      </Card>

      <FlashcardDisplay
        flashcard={currentCard}
        isFlipped={isFlipped}
        onFlip={handleFlip}
      />

      {isFlipped && (
        <div className="flex space-x-4 mt-6">
          <Button
            onClick={() => handleAnswer(false)}
            variant="destructive"
            className="text-lg py-6 px-8 bg-red-500 hover:bg-red-600"
          >
            <ThumbsDown className="mr-2 h-5 w-5" /> I Didn't Know
          </Button>
          <Button
            onClick={() => handleAnswer(true)}
            className="text-lg py-6 px-8 bg-green-500 hover:bg-green-600 text-white"
            style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}
          >
            <ThumbsUp className="mr-2 h-5 w-5" /> I Knew It!
          </Button>
        </div>
      )}
    </div>
  );
}
