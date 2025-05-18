
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FlashcardDisplay } from '@/components/FlashcardDisplay';
import { RecallRating } from '@/components/RecallRating';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useReviewStreak } from '@/hooks/useReviewStreak';
import type { Flashcard, DeckInfo } from '@/lib/types';
import { CheckCircle, Zap, Loader2, Library, Info, Trash2, CalendarClock, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNowStrict, isToday, isTomorrow, isValid } from 'date-fns';


export default function ReviewPage() {
  const { flashcards, getDueFlashcards, updateFlashcardReview, getDecksWithDueCards, deleteDeck, isLoaded: flashcardsLoaded } = useFlashcards();
  const { recordReviewSession, isStreakLoaded } = useReviewStreak();
  const { toast } = useToast();
  
  const [availableDecks, setAvailableDecks] = useState<DeckInfo[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<DeckInfo | null>(null);
  const [cardsForReviewSession, setCardsForReviewSession] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [cardsReviewedThisSession, setCardsReviewedThisSession] = useState(0);
  const [deckToDelete, setDeckToDelete] = useState<DeckInfo | null>(null);
  const [nextReviewMessage, setNextReviewMessage] = useState<string | null>(null);


  const loadAvailableDecks = useCallback(() => {
     if (flashcardsLoaded) {
      setIsLoading(true); // Set loading true when starting to load decks
      const decks = getDecksWithDueCards();
      setAvailableDecks(decks);
      setIsLoading(false); // Set loading false after decks are loaded
    }
  }, [flashcardsLoaded, getDecksWithDueCards]);

  useEffect(() => {
    // Initial load of available decks when component mounts and flashcards are loaded
    if (flashcardsLoaded) {
      loadAvailableDecks();
    }
  }, [flashcardsLoaded, loadAvailableDecks]); // Removed selectedDeck from dependency array

  const startReviewSession = useCallback((deck: DeckInfo, reviewAll: boolean = false) => {
    setIsLoading(true); // Set loading true at the start of the function
    // Reset states for the new session first
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
    setCardsReviewedThisSession(0);
    setNextReviewMessage(null);

    let cardsToReview: Flashcard[];
    const allFlashcardsCurrent = flashcards; // These are all flashcards from the hook

    if (reviewAll) {
      const currentDeckId = deck.id;
      console.log(`[ReviewPage] Re-reviewing deck ID: ${currentDeckId}, Name: ${deck.name}. Total flashcards in hook: ${allFlashcardsCurrent.length}`);
      console.log('[ReviewPage] All flashcards available in hook for re-review:', JSON.stringify(allFlashcardsCurrent.map(f => ({id: f.id, deckId: f.deckId, front: f.front.substring(0,10)}))));
      
      const filteredCards = allFlashcardsCurrent.filter(fc => fc.deckId === currentDeckId);
      console.log(`[ReviewPage] Filtered ${filteredCards.length} cards for re-review of deck '${deck.name}'.`);
      cardsToReview = filteredCards;
    } else {
      // Default behavior: get only due cards for the selected deck
      cardsToReview = getDueFlashcards(deck.id);
       console.log(`[ReviewPage] Reviewing due cards for deck ID: ${deck.id}, Name: ${deck.name}. Found ${cardsToReview.length} due cards.`);
    }
    
    // Sort cards: primarily by next review date, then by creation timestamp in ID, then by full ID
    cardsToReview.sort((a, b) => {
      const dateA = a.nextReviewDate && isValid(new Date(a.nextReviewDate)) ? new Date(a.nextReviewDate).getTime() : 0;
      const dateB = b.nextReviewDate && isValid(new Date(b.nextReviewDate)) ? new Date(b.nextReviewDate).getTime() : 0;
      
      if (dateA === dateB) { 
        const idPartA = a.id.split('-')[0];
        const idPartB = b.id.split('-')[0];
        const numA = parseInt(idPartA, 10);
        const numB = parseInt(idPartB, 10);

        if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
            return numA - numB;
        }
        return a.id.localeCompare(b.id); 
      }
      return dateA - dateB; 
    });

    setCardsForReviewSession(cardsToReview);
    setIsLoading(false); // Set loading false after cards are prepared
  }, [flashcards, getDueFlashcards]);


  useEffect(() => {
    // This effect handles starting a review session when a deck is selected
    if (selectedDeck && flashcardsLoaded) { // Ensure flashcards are loaded before starting
      startReviewSession(selectedDeck, false); 
    }
  }, [selectedDeck, flashcardsLoaded, startReviewSession]);


  const currentCard = cardsForReviewSession[currentCardIndex];

  const handleFlip = () => setIsFlipped(prev => !prev);

  const handleRateCard = useCallback((quality: number) => {
    if (!currentCard) return;

    updateFlashcardReview(currentCard.id, quality);
    setCardsReviewedThisSession(prev => prev + 1);

    setIsFlipped(false); 
    if (currentCardIndex < cardsForReviewSession.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setSessionCompleted(true);
      if (cardsForReviewSession.length > 0 && isStreakLoaded) { 
        recordReviewSession();
      }
    }
  }, [currentCard, currentCardIndex, cardsForReviewSession.length, updateFlashcardReview, recordReviewSession, isStreakLoaded]);

  useEffect(() => {
    if (sessionCompleted && selectedDeck && flashcards) {
      const cardsInReviewedDeck = flashcards.filter(fc => fc.deckId === selectedDeck.id);
      
      if (cardsInReviewedDeck.length > 0) {
        const validReviewTimestamps = cardsInReviewedDeck
          .map(fc => {
            // Ensure fc.nextReviewDate is a Date object or a string that can be parsed into one
            const dateValue = fc.nextReviewDate instanceof Date ? fc.nextReviewDate : new Date(fc.nextReviewDate);
            return isValid(dateValue) ? dateValue.getTime() : Infinity;
          })
          .filter(ts => ts !== Infinity);

        if (validReviewTimestamps.length === 0) {
           setNextReviewMessage("Could not determine the next review time for this deck. All cards might be new or have invalid dates.");
           return;
        }
        
        const earliestNextReviewTimestamp = Math.min(...validReviewTimestamps);
        const earliestNextReviewDate = new Date(earliestNextReviewTimestamp);
        
        let message = "";
        const today = new Date();
        today.setHours(0,0,0,0); 
        
        const reviewDayDateOnly = new Date(earliestNextReviewDate);
        reviewDayDateOnly.setHours(0,0,0,0);

        if (reviewDayDateOnly < today) { 
          message = `Some cards in this deck are overdue. The earliest is scheduled for ${format(earliestNextReviewDate, 'MMMM d, yyyy')}. Review soon!`;
        } else if (isToday(earliestNextReviewDate)) {
          message = `Next review for this deck is later today! (${format(earliestNextReviewDate, 'p, MMMM d')}). Great job!`;
        } else if (isTomorrow(earliestNextReviewDate)) {
          message = `Next review for this deck is tomorrow (${format(earliestNextReviewDate, 'MMMM d')}).`;
        } else {
          const distance = formatDistanceToNowStrict(earliestNextReviewDate, { addSuffix: true });
          message = `Next review for this deck: ${distance} (on ${format(earliestNextReviewDate, 'MMMM d, yyyy')}).`;
        }
        setNextReviewMessage(message);
      } else {
        setNextReviewMessage("No cards remaining in this deck for future review.");
      }
    }
  }, [sessionCompleted, selectedDeck, flashcards]);


  const handleSelectDeck = (deck: DeckInfo) => {
    setSelectedDeck(deck);
  };
  
  const handleReviewAnotherDeck = () => {
    setSelectedDeck(null); 
    setSessionCompleted(false); 
    setCardsForReviewSession([]); // Clear cards for review session explicitly
    setNextReviewMessage(null); 
    setIsLoading(true); // Set loading before calling loadAvailableDecks
    loadAvailableDecks();
  };

  const handleReviewThisDeckAgain = () => {
    if (selectedDeck) {
      // No need to set isLoading true here, startReviewSession will do it
      startReviewSession(selectedDeck, true); // reviewAll is true here
    }
  };

  const handleDeleteDeck = (deck: DeckInfo) => {
    setDeckToDelete(deck);
  };

  const confirmDeleteDeck = () => {
    if (deckToDelete) {
      deleteDeck(deckToDelete.id);
      toast({
        title: "Deck Deleted",
        description: `The deck "${deckToDelete.name}" has been removed.`,
      });
      setDeckToDelete(null);
      if (selectedDeck && selectedDeck.id === deckToDelete.id) {
        setSelectedDeck(null); 
        setCardsForReviewSession([]); // Clear cards for review session
      }
      setIsLoading(true); // Set loading before calling loadAvailableDecks
      loadAvailableDecks(); 
    }
  };


  if (isLoading && (!flashcardsLoaded || !selectedDeck)) { // Adjust loading condition
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Loading review session...</p>
      </div>
    );
  }

  if (!selectedDeck) {
     if (availableDecks.length === 0 && !isLoading && flashcardsLoaded) {
      return (
        <div className="container mx-auto px-4 py-8 text-center">
          <Card className="bg-card text-card-foreground shadow-xl p-6 sm:p-8 max-w-lg mx-auto">
            <Zap className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-primary mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">No Decks Available!</h2>
            <p className="text-md sm:text-lg text-muted-foreground mb-8">
              You don't have any flashcard decks yet, or no cards are due for review.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:flex sm:flex-row sm:justify-center sm:space-x-4">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/create">Create Your First Deck</Link>
              </Button>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/decks">Browse Preloaded Decks</Link>
              </Button>
            </div>
          </Card>
          <Button variant="ghost" asChild className="mt-8">
              <Link href="/">Go Home</Link>
            </Button>
        </div>
      );
    }
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="shadow-xl bg-card text-card-foreground max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center justify-center">
              <Library className="mr-3 h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              Select Deck to Review
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">Choose a deck. Decks with due cards are prioritized.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableDecks.length > 0 ? availableDecks.map(deck => (
              <div key={deck.id} className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-between py-4 sm:py-6 text-base sm:text-lg hover:bg-primary/10 flex-grow border-border hover:border-primary"
                  onClick={() => handleSelectDeck(deck)}
                  aria-label={`Review ${deck.name}, ${deck.dueCardCount} cards due`}
                >
                  <span>{deck.name}</span>
                  {deck.dueCardCount > 0 ? (
                    <span className="text-xs sm:text-sm text-primary font-semibold bg-primary/20 px-2 py-1 rounded-full">
                      {deck.dueCardCount} due
                    </span>
                  ) : (
                    <span className="text-xs sm:text-sm text-muted-foreground font-normal bg-muted/50 px-2 py-1 rounded-full">
                      No cards due
                    </span>
                  )}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={(e) => { e.stopPropagation(); handleDeleteDeck(deck);}}
                      aria-label={`Delete deck ${deck.name}`}
                      className="h-10 w-10 sm:h-auto sm:w-auto sm:px-3 sm:py-6 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  {deckToDelete && deckToDelete.id === deck.id && (
                    <AlertDialogContent className="bg-card border-border text-card-foreground">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this deck?</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          This action will permanently delete the deck "{deckToDelete?.name}" and all its flashcards. This cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeckToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteDeck} className="bg-destructive hover:bg-destructive/90">Delete Deck</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  )}
                </AlertDialog>
              </div>
            )) : (
                <p className="text-muted-foreground text-center py-4">
                    {flashcardsLoaded && !isLoading ? "No decks found. Create some or add preloaded ones!" : "Loading available decks..."}
                </p>
            )}
          </CardContent>
          {availableDecks.length > 0 && (
            <CardFooter>
               <Alert className="bg-muted text-muted-foreground border-border">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Review Tip</AlertTitle>
                  <AlertDescription>
                  Select a deck to start your review. You can also delete decks using the trash icon.
                  </AlertDescription>
              </Alert>
            </CardFooter>
          )}
        </Card>
        <div className="text-center mt-6">
            <Button variant="ghost" asChild>
                <Link href="/">Back to Dashboard</Link>
            </Button>
        </div>
      </div>
    );
  }

  if (sessionCompleted) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card className="bg-card text-card-foreground shadow-xl p-6 sm:p-8 max-w-lg mx-auto">
          <CheckCircle className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-green-500 mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Deck Review Complete!</h2>
          <p className="text-md sm:text-lg text-muted-foreground mb-6">
            Great job! You've reviewed {cardsReviewedThisSession} {cardsReviewedThisSession === 1 ? 'card' : 'cards'} for "{selectedDeck?.name}".
            {isStreakLoaded && cardsReviewedThisSession > 0 ? " Your review streak has been updated!" : ""}
          </p>
          {nextReviewMessage && (
              <Alert variant="default" className="mb-6 bg-muted text-muted-foreground border-border text-left">
                  <CalendarClock className="h-4 w-4" />
                  <AlertTitle>Next Steps</AlertTitle>
                  <AlertDescription>
                      {nextReviewMessage}
                  </AlertDescription>
              </Alert>
          )}
         <div className="flex flex-col items-center space-y-3 sm:flex-row sm:flex-wrap sm:justify-center sm:space-y-0 sm:gap-3">
              <Button onClick={handleReviewThisDeckAgain} variant="secondary" className="w-full sm:w-auto">
                <RotateCcw className="mr-2 h-5 w-5" /> Review This Deck Again
              </Button>
              <Button onClick={handleReviewAnotherDeck} className="w-full sm:w-auto">Review Another Deck</Button>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/">Back to Dashboard</Link>
              </Button>
          </div>
        </Card>
      </div>
    );
  }

  // If no current card, but a deck is selected and not loading, and cards for review are empty
  if (!currentCard && selectedDeck && cardsForReviewSession.length === 0 && !isLoading && flashcardsLoaded) {
     return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card className="bg-card text-card-foreground shadow-xl p-6 sm:p-8 max-w-lg mx-auto">
            <Zap className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-primary mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">All Caught Up in "{selectedDeck.name}"!</h2>
            <p className="text-md sm:text-lg text-muted-foreground mb-8">
              You have no flashcards due for review in this deck right now.
            </p>
            <div className="flex flex-col items-center space-y-3 sm:flex-row sm:flex-wrap sm:justify-center sm:space-y-0 sm:gap-3">
              <Button onClick={handleReviewThisDeckAgain} variant="secondary" className="w-full sm:w-auto">
                <RotateCcw className="mr-2 h-5 w-5" /> Review This Deck Again
              </Button>
              <Button onClick={handleReviewAnotherDeck} className="w-full sm:w-auto">Review Another Deck</Button>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/">Go Home</Link>
              </Button>
            </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center space-y-6 max-w-xl">
      <Card className="w-full shadow-none border-none bg-transparent text-center">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl sm:text-3xl font-semibold">Review: {selectedDeck?.name}</CardTitle>
          {cardsForReviewSession.length > 0 && (
            <CardDescription className="text-base text-muted-foreground">
                Card {currentCardIndex + 1} of {cardsForReviewSession.length}. Focus and recall!
            </CardDescription>
          )}
        </CardHeader>
      </Card>

      {isLoading || !currentCard ? ( // Added isLoading check here
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)]">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Loading card...</p>
        </div>
      ) : (
        <>
          <FlashcardDisplay
            flashcard={currentCard}
            isFlipped={isFlipped}
            onFlip={handleFlip}
          />

          {isFlipped && (
            <div className="mt-6 w-full">
              <RecallRating onRate={handleRateCard} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
