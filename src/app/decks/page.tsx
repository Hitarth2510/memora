
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useToast } from '@/hooks/use-toast';
import { preloadedDecks, type PreloadedDeck } from '@/lib/preloaded-decks';
import { CheckCircle, PlusCircle, LibraryBig } from 'lucide-react';
import Link from 'next/link';

export default function PreloadedDecksPage() {
  const { addFlashcard, flashcards } = useFlashcards();
  const { toast } = useToast();

  const handleAddDeck = (deck: PreloadedDeck) => {
    let addedCount = 0;
    deck.cards.forEach(card => {
      const cardExists = flashcards.some(fc => 
        fc.deckId === deck.id && 
        fc.front === card.front && 
        fc.back === card.back
      );
      if (!cardExists) {
        addFlashcard(card.front, card.back, deck.id, deck.name, card.frontImageUrl, card.backImageUrl);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      toast({
        title: 'Deck Added!',
        description: `${addedCount} new cards from "${deck.name}" have been added to your collection.`,
        action: <CheckCircle className="text-green-500" />,
      });
    } else {
       toast({
        title: 'Deck Already Added',
        description: `All cards from "${deck.name}" seem to be in your collection already or no new cards found.`,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <Card className="shadow-xl bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center">
              <LibraryBig className="mr-3 h-8 w-8 text-primary" />
              Preloaded Flashcard Decks
            </CardTitle>
            <CardDescription>
              Browse available decks and add them to your study collection.
            </CardDescription>
          </CardHeader>
        </Card>

        {preloadedDecks.length === 0 && (
          <Card className="bg-card text-card-foreground">
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                No preloaded decks are available at the moment.
                <Link href="/create" className="text-primary hover:underline ml-1">Create your own cards!</Link>
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {preloadedDecks.map((deck) => (
            <Card key={deck.id} className="flex flex-col bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>{deck.name}</CardTitle>
                <CardDescription>{deck.description}</CardDescription>
                <span className="text-xs text-muted-foreground pt-1">Category: {deck.category} | Cards: {deck.cards.length}</span>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">Example cards:</p>
                <ul className="list-disc list-inside text-sm space-y-1 mt-1 max-h-24 overflow-y-auto">
                  {deck.cards.slice(0, 3).map((card, index) => (
                    <li key={index} className="truncate">{card.front}</li>
                  ))}
                  {deck.cards.length > 3 && <li className="text-xs">...and more</li>}
                </ul>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleAddDeck(deck)} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Deck to My Collection
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
    
