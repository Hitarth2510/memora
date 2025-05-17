
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FlashcardDisplay } from '@/components/FlashcardDisplay';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useReviewStreak } from '@/hooks/useReviewStreak';
import type { Flashcard, DeckInfo } from '@/lib/types';
import { ThumbsUp, ThumbsDown, CheckCircle, Zap, Loader2, Library, Info } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function ReviewPage() {
  const { getDueFlashcards, updateFlashcardReview, getDecksWithDueCards, isLoaded: flashcardsLoaded } = useFlashcards();
  const { recordReviewSession, isStreakLoaded } = useReviewStreak();
  
  const [availableDecks, setAvailableDecks] = useState<DeckInfo[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<DeckInfo | null>(null);
  const [dueCards, setDueCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (flashcardsLoaded) {
      const decks = getDecksWithDueCards();
      setAvailableDecks(decks);
      setIsLoading(false);
      if (decks.length === 0) {
        // No decks with due cards, can set sessionCompleted or a specific message
      }
    }
  }, [flashcardsLoaded, getDecksWithDueCards]);

  useEffect(() => {
    if (selectedDeck) {
      setIsLoading(true);
      setDueCards(getDueFlashcards(selectedDeck.id));
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setSessionCompleted(false);
      setIsLoading(false);
    }
  }, [selectedDeck, getDueFlashcards]);

  const currentCard = dueCards[currentCardIndex];

  const handleFlip = () => setIsFlipped(prev => !prev);

  const handleAnswer = useCallback((knewIt: boolean) => {
    if (!currentCard) return;

    const quality = knewIt ? 5 : 2;
    updateFlashcardReview(currentCard.id, quality);

    setIsFlipped(false);
    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setSessionCompleted(true);
      if (dueCards.length > 0 && isStreakLoaded && selectedDeck) { 
        recordReviewSession(); // Assumes reviewing any number of cards counts
      }
    }
  }, [currentCard, currentCardIndex, dueCards.length, updateFlashcardReview, recordReviewSession, isStreakLoaded, selectedDeck]);

  const handleSelectDeck = (deck: DeckInfo) => {
    setSelectedDeck(deck);
  };

  if (isLoading && (!selectedDeck || (selectedDeck && dueCards.length === 0 && !sessionCompleted))) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Loading review session...</p>
      </div>
    );
  }

  if (!selectedDeck) {
    if (availableDecks.length === 0 && !isLoading) {
      return (
        <div className="text-center max-w-lg mx-auto py-12">
          <Zap className="mx-auto h-20 w-20 text-primary mb-6" />
          <h2 className="text-4xl font-bold mb-4">All Caught Up!</h2>
          <p className="text-lg text-muted-foreground mb-8">
            You have no flashcards due for review in any deck right now. Nicely done!
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
      <div className="max-w-md mx-auto space-y-6">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Library className="mr-3 h-7 w-7 text-primary" />
              Select a Deck to Review
            </CardTitle>
            <CardDescription>Choose a deck that has cards due for review.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableDecks.length > 0 ? availableDecks.map(deck => (
              <Button 
                key={deck.id} 
                variant="outline" 
                className="w-full justify-between py-6 text-lg"
                onClick={() => handleSelectDeck(deck)}
              >
                <span>{deck.name}</span>
                <span className="text-sm text-primary font-semibold bg-primary/10 px-2 py-1 rounded-md">
                  {deck.dueCardCount} due
                </span>
              </Button>
            )) : (
                <p className="text-muted-foreground text-center py-4">No decks have cards due for review currently.</p>
            )}
          </CardContent>
          <CardFooter>
             <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Tip</AlertTitle>
                <AlertDescription>
                 Only decks with cards due today will appear here. Create more cards or check back later!
                </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (sessionCompleted) {
    return (
      <div className="text-center max-w-lg mx-auto py-12">
        <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-6" />
        <h2 className="text-4xl font-bold mb-4">Deck Review Complete!</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Great job! You've reviewed all due cards for "{selectedDeck?.name}".
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setSelectedDeck(null)}>Review Another Deck</Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/">Back to Dashboard</Link>
            </Button>
        </div>
      </div>
    );
  }

  if (!currentCard && selectedDeck && !isLoading) { // No cards for selected deck, but deck was selected
     return (
      <div className="text-center max-w-lg mx-auto py-12">
        <Zap className="mx-auto h-20 w-20 text-primary mb-6" />
        <h2 className="text-4xl font-bold mb-4">All Caught Up in "{selectedDeck.name}"!</h2>
        <p className="text-lg text-muted-foreground mb-8">
          You have no more flashcards due for review in this deck right now.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => setSelectedDeck(null)}>Review Another Deck</Button>
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
          <CardTitle className="text-2xl">Review: {selectedDeck?.name}</CardTitle>
          <CardDescription>
            Card {currentCardIndex + 1} of {dueCards.length}. Focus and recall!
          </CardDescription>
        </CardHeader>
      </Card>

      {currentCard && (
        <FlashcardDisplay
          flashcard={currentCard}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />
      )}

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
