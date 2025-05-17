
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FlashcardDisplay } from '@/components/FlashcardDisplay';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useReviewStreak } from '@/hooks/useReviewStreak'; // Import the streak hook
import type { Flashcard, DeckInfo } from '@/lib/types';
import { ThumbsUp, ThumbsDown, CheckCircle, Zap, Loader2, Library, Info } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function ReviewPage() {
  const { getDueFlashcards, updateFlashcardReview, getDecksWithDueCards, isLoaded: flashcardsLoaded } = useFlashcards();
  const { recordReviewSession, isStreakLoaded } = useReviewStreak(); // Use the streak hook
  
  const [availableDecks, setAvailableDecks] = useState<DeckInfo[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<DeckInfo | null>(null);
  const [dueCards, setDueCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cardsReviewedThisSession, setCardsReviewedThisSession] = useState(0);

  useEffect(() => {
    if (flashcardsLoaded) {
      const decks = getDecksWithDueCards();
      setAvailableDecks(decks);
      setIsLoading(false);
    }
  }, [flashcardsLoaded, getDecksWithDueCards]);

  // Reset state when selectedDeck changes or when returning to deck selection
  useEffect(() => {
    if (selectedDeck) {
      setIsLoading(true);
      const currentDueCards = getDueFlashcards(selectedDeck.id);
      setDueCards(currentDueCards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setSessionCompleted(false);
      setCardsReviewedThisSession(0);
      setIsLoading(false);
    } else {
      // Refresh available decks when no deck is selected (e.g., after completing a session)
      if (flashcardsLoaded) {
         setAvailableDecks(getDecksWithDueCards());
      }
    }
  }, [selectedDeck, getDueFlashcards, flashcardsLoaded]);


  const currentCard = dueCards[currentCardIndex];

  const handleFlip = () => setIsFlipped(prev => !prev);

  const handleAnswer = useCallback((knewIt: boolean) => {
    if (!currentCard) return;

    const quality = knewIt ? 5 : 2; // SM-2 quality score (5 = perfect, 2 = incorrect, show soon)
    updateFlashcardReview(currentCard.id, quality);
    setCardsReviewedThisSession(prev => prev + 1);

    setIsFlipped(false); // Flip back to front for next card
    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setSessionCompleted(true);
      // Only record streak if at least one card was reviewed and streak hook is loaded
      if (dueCards.length > 0 && isStreakLoaded && cardsReviewedThisSession > 0) { 
        recordReviewSession();
      }
    }
  }, [currentCard, currentCardIndex, dueCards.length, updateFlashcardReview, recordReviewSession, isStreakLoaded, cardsReviewedThisSession]);

  const handleSelectDeck = (deck: DeckInfo) => {
    setSelectedDeck(deck);
  };
  
  const handleReviewAnotherDeck = () => {
    setSelectedDeck(null); // This will trigger the useEffect to reset state and show deck selection
    // The useEffect for selectedDeck being null will also refresh availableDecks
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
     if (availableDecks.length === 0 && !isLoading && flashcardsLoaded) {
      return (
        <div className="text-center max-w-lg mx-auto py-12">
          <Zap className="mx-auto h-20 w-20 text-primary mb-6" />
          <h2 className="text-4xl font-bold mb-4">All Caught Up!</h2>
          <p className="text-lg text-muted-foreground mb-8">
            You have no flashcards due for review in any deck right now. Nicely done!
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center">
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
      <div className="max-w-md mx-auto space-y-6 py-8">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center">
              <Library className="mr-3 h-8 w-8 text-primary" />
              Select Deck to Review
            </CardTitle>
            <CardDescription>Choose a deck that has cards due for review.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableDecks.length > 0 ? availableDecks.map(deck => (
              <Button 
                key={deck.id} 
                variant="outline" 
                className="w-full justify-between py-6 text-lg hover:bg-primary/10"
                onClick={() => handleSelectDeck(deck)}
                aria-label={`Review ${deck.name}, ${deck.dueCardCount} cards due`}
              >
                <span>{deck.name}</span>
                <span className="text-sm text-primary font-semibold bg-primary/20 px-3 py-1 rounded-full">
                  {deck.dueCardCount} due
                </span>
              </Button>
            )) : (
                <p className="text-muted-foreground text-center py-4">
                    {flashcardsLoaded ? "No decks have cards due for review currently." : "Loading available decks..."}
                </p>
            )}
          </CardContent>
          {availableDecks.length > 0 && (
            <CardFooter>
               <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Review Tip</AlertTitle>
                  <AlertDescription>
                   Only decks with cards due today will appear here. Keep creating and reviewing!
                  </AlertDescription>
              </Alert>
            </CardFooter>
          )}
        </Card>
         <div className="text-center">
            <Button variant="ghost" asChild>
                <Link href="/">Back to Dashboard</Link>
            </Button>
        </div>
      </div>
    );
  }

  if (sessionCompleted) {
    return (
      <div className="text-center max-w-lg mx-auto py-12">
        <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-6" />
        <h2 className="text-4xl font-bold mb-4">Deck Review Complete!</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Great job! You've reviewed all {cardsReviewedThisSession} due cards for "{selectedDeck?.name}".
          {isStreakLoaded && cardsReviewedThisSession > 0 ? " Your review streak has been updated!" : ""}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleReviewAnotherDeck}>Review Another Deck</Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/">Back to Dashboard</Link>
            </Button>
        </div>
      </div>
    );
  }

  // This case handles when a deck is selected, but it has no due cards (e.g., just added or all caught up)
  if (!currentCard && selectedDeck && dueCards.length === 0 && !isLoading && flashcardsLoaded) {
     return (
      <div className="text-center max-w-lg mx-auto py-12">
        <Zap className="mx-auto h-20 w-20 text-primary mb-6" />
        <h2 className="text-4xl font-bold mb-4">All Caught Up in "{selectedDeck.name}"!</h2>
        <p className="text-lg text-muted-foreground mb-8">
          You have no flashcards due for review in this deck right now.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={handleReviewAnotherDeck}>Review Another Deck</Button>
           <Button size="lg" variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col items-center space-y-6 max-w-xl mx-auto">
      <Card className="w-full shadow-none border-none bg-transparent">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-semibold">Review: {selectedDeck?.name}</CardTitle>
          {dueCards.length > 0 && (
            <CardDescription className="text-base">
                Card {currentCardIndex + 1} of {dueCards.length}. Focus and recall!
            </CardDescription>
          )}
        </CardHeader>
      </Card>

      {currentCard ? (
        <>
          <FlashcardDisplay
            flashcard={currentCard}
            isFlipped={isFlipped}
            onFlip={handleFlip}
          />

          {isFlipped && (
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6 w-full">
              <Button
                onClick={() => handleAnswer(false)}
                variant="destructive"
                className="text-lg py-6 px-8 flex-1 shadow-md hover:shadow-lg"
              >
                <ThumbsDown className="mr-2 h-5 w-5" /> I Didn't Know
              </Button>
              <Button
                onClick={() => handleAnswer(true)}
                className="text-lg py-6 px-8 flex-1 shadow-md hover:shadow-lg text-white"
                style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}
              >
                <ThumbsUp className="mr-2 h-5 w-5" /> I Knew It!
              </Button>
            </div>
          )}
        </>
      ) : (
         <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)]">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Loading card...</p>
         </div>
      )}
    </div>
  );
}

