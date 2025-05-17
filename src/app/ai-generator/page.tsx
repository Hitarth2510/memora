
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useToast } from '@/hooks/use-toast';
import { generateFlashcards, type GenerateFlashcardsOutput, type GenerateFlashcardsInput } from '@/ai/flows/generate-flashcards';
import type { AiGeneratedFlashcard } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { Sparkles, Loader2, PlusCircle, AlertTriangle, Info, BookMarked } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AiGeneratorPage() {
  const [notes, setNotes] = useState('');
  const [deckName, setDeckName] = useState('AI Generated Cards');
  const [generatedCards, setGeneratedCards] = useState<AiGeneratedFlashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addFlashcard } = useFlashcards();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!notes.trim()) {
      setError('Please enter some notes to generate flashcards.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedCards([]);

    try {
      const input: GenerateFlashcardsInput = { notes };
      const result: GenerateFlashcardsOutput = await generateFlashcards(input);
      if (result.flashcards && result.flashcards.length > 0) {
        setGeneratedCards(result.flashcards);
        toast({
          title: 'Flashcards Generated!',
          description: `${result.flashcards.length} cards created by AI. Review and add them below.`,
        });
      } else {
        setGeneratedCards([]); // Ensure it's empty
        toast({
          title: 'No Flashcards Generated',
          description: 'The AI could not generate flashcards from the provided notes. Try different or more detailed notes.',
          variant: 'default', // Changed from destructive to default as it's not strictly an error
        });
      }
    } catch (err) {
      console.error('AI generation failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate flashcards: ${errorMessage}`);
      toast({
        title: 'Generation Error',
        description: `Could not generate flashcards. ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCardToCollection = (card: AiGeneratedFlashcard) => {
    if (!deckName.trim()) {
      toast({ title: 'Deck Name Required', description: 'Please enter a name for the deck.', variant: 'destructive' });
      return;
    }
    const currentDeckId = slugify(deckName);
     if (!currentDeckId) {
       toast({
        title: 'Error',
        description: 'Deck name is invalid for creating an ID. Please use alphanumeric characters.',
        variant: 'destructive',
      });
      return;
    }
    addFlashcard(card.question, card.answer, currentDeckId, deckName.trim());
    toast({
      title: 'Card Added!',
      description: `"${card.question.substring(0, 30)}..." added to '${deckName.trim()}'.`,
    });
    setGeneratedCards(prev => prev.filter(c => c.question !== card.question || c.answer !== card.answer));
  };

  const handleAddAllCards = () => {
    if (generatedCards.length === 0) return;
    if (!deckName.trim()) {
      toast({ title: 'Deck Name Required', description: 'Please enter a name for the deck before adding all cards.', variant: 'destructive' });
      return;
    }
    const currentDeckId = slugify(deckName);
    if (!currentDeckId) {
       toast({
        title: 'Error',
        description: 'Deck name is invalid for creating an ID. Please use alphanumeric characters.',
        variant: 'destructive',
      });
      return;
    }
    generatedCards.forEach(card => addFlashcard(card.question, card.answer, currentDeckId, deckName.trim()));
    toast({
      title: `${generatedCards.length} Cards Added!`,
      description: `All AI-generated cards have been added to '${deckName.trim()}'.`,
    });
    setGeneratedCards([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Card className="shadow-xl bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center">
              <Sparkles className="mr-3 h-8 w-8 text-primary" />
              AI Flashcard Generator
            </CardTitle>
            <CardDescription>
              Paste your notes, specify a deck name, and let AI create flashcards for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="aiDeckName" className="text-lg font-medium flex items-center">
                <BookMarked className="mr-2 h-5 w-5 text-muted-foreground" /> Deck Name for Generated Cards
              </Label>
              <Input
                id="aiDeckName"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                placeholder="e.g., AI Study Session - History"
                className="text-base bg-input text-foreground border-border placeholder-muted-foreground"
              />
            </div>
            <div>
              <Label htmlFor="notes" className="text-lg font-medium">Your Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste your study notes, lecture transcripts, or text excerpts here..."
                className="min-h-[200px] text-base bg-input text-foreground border-border placeholder-muted-foreground"
                rows={10}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button onClick={handleGenerate} disabled={isLoading || !notes.trim()} className="w-full text-lg py-6">
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-5 w-5" />
              )}
              Generate with AI
            </Button>
          </CardContent>
        </Card>

        {generatedCards.length > 0 && (
          <Card className="shadow-xl bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="text-2xl">Generated Flashcards for '{deckName}'</CardTitle>
              <CardDescription>Review the cards and add them to your collection.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generatedCards.map((card, index) => (
                <Card key={index} className="bg-muted text-muted-foreground">
                  <CardContent className="p-4 space-y-2">
                    <div>
                      <p className="font-semibold text-sm text-card-foreground">Question (Front):</p>
                      <p>{card.question}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-card-foreground">Answer (Back):</p>
                      <p>{card.answer}</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddCardToCollection(card)}
                      disabled={!deckName.trim()}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Add to My Flashcards
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleAddAllCards} 
                className="w-full" 
                disabled={generatedCards.length === 0 || !deckName.trim()}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add All {generatedCards.length} Cards
              </Button>
            </CardFooter>
          </Card>
        )}
        { !isLoading && notes.length > 0 && generatedCards.length === 0 && !error && (
          <Alert className="bg-muted text-muted-foreground border-border">
            <Info className="h-4 w-4" />
            <AlertTitle>Tip</AlertTitle>
            <AlertDescription>
              If no cards were generated, try providing more detailed notes or rephrasing your input.
              The AI works best with clear statements and key facts.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
