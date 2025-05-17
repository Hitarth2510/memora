
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useToast } from '@/hooks/use-toast';
import { slugify } from '@/lib/utils';
import { PlusCircle, CheckCircle, Image as ImageIcon, Info, BookMarked } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CreateFlashcardPage() {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [frontImageUrl, setFrontImageUrl] = useState('');
  const [backImageUrl, setBackImageUrl] = useState('');
  const [deckName, setDeckName] = useState('');
  const { addFlashcard } = useFlashcards();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) {
      toast({
        title: 'Error',
        description: 'Both front and back (text content) of the flashcard must be filled.',
        variant: 'destructive',
      });
      return;
    }
    if (!deckName.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a name for your deck.',
        variant: 'destructive',
      });
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

    addFlashcard(
      front,
      back,
      currentDeckId,
      deckName.trim(),
      frontImageUrl.trim() || undefined,
      backImageUrl.trim() || undefined
    );
    toast({
      title: 'Flashcard Created!',
      description: `Your new flashcard has been added to '${deckName.trim()}'.`,
      action: <CheckCircle className="text-green-500" />,
    });
    setFront('');
    setBack('');
    setFrontImageUrl('');
    setBackImageUrl('');
    // Optionally reset deckName or keep it for the next card
    // setDeckName(''); 
  };

  const isValidHttpUrl = (string: string) => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center">
              <PlusCircle className="mr-3 h-8 w-8 text-primary" />
              Create a New Flashcard
            </CardTitle>
            <CardDescription>
              Fill in the front, back, and assign it to a deck. Markdown is supported for text. You can also add image URLs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="deckName" className="text-lg font-medium flex items-center">
                  <BookMarked className="mr-2 h-5 w-5 text-muted-foreground" /> Deck Name
                </Label>
                <Input
                  id="deckName"
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  placeholder="e.g., My Awesome Chemistry Deck"
                  className="text-base bg-input text-foreground border-border placeholder-muted-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="front" className="text-lg font-medium">Front (Supports Markdown)</Label>
                <Textarea
                  id="front"
                  value={front}
                  onChange={(e) => setFront(e.target.value)}
                  placeholder="e.g., What is the capital of **France**? Or `code` snippets."
                  className="min-h-[100px] text-base bg-input text-foreground border-border placeholder-muted-foreground"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frontImageUrl" className="text-lg font-medium flex items-center">
                  <ImageIcon className="mr-2 h-5 w-5 text-muted-foreground" /> Front Image URL (Optional)
                </Label>
                <Input
                  id="frontImageUrl"
                  type="url"
                  value={frontImageUrl}
                  onChange={(e) => setFrontImageUrl(e.target.value)}
                  placeholder="https://example.com/image.png"
                  className="text-base bg-input text-foreground border-border placeholder-muted-foreground"
                />
                {frontImageUrl && isValidHttpUrl(frontImageUrl) && (
                  <div className="mt-2 rounded-md overflow-hidden border border-border p-2">
                    <Image src={frontImageUrl} alt="Front image preview" width={100} height={100} className="object-cover rounded" data-ai-hint="user uploaded content" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="back" className="text-lg font-medium">Back (Supports Markdown)</Label>
                <Textarea
                  id="back"
                  value={back}
                  onChange={(e) => setBack(e.target.value)}
                  placeholder="e.g., Paris. You can include *italic* or **bold** text."
                  className="min-h-[100px] text-base bg-input text-foreground border-border placeholder-muted-foreground"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backImageUrl" className="text-lg font-medium flex items-center">
                  <ImageIcon className="mr-2 h-5 w-5 text-muted-foreground" /> Back Image URL (Optional)
                </Label>
                <Input
                  id="backImageUrl"
                  type="url"
                  value={backImageUrl}
                  onChange={(e) => setBackImageUrl(e.target.value)}
                  placeholder="https://example.com/another-image.jpg"
                  className="text-base bg-input text-foreground border-border placeholder-muted-foreground"
                />
                {backImageUrl && isValidHttpUrl(backImageUrl) && (
                  <div className="mt-2 rounded-md overflow-hidden border border-border p-2">
                    <Image src={backImageUrl} alt="Back image preview" width={100} height={100} className="object-cover rounded" data-ai-hint="user uploaded content"/>
                  </div>
                )}
              </div>
              <Alert variant="default" className="mt-4 bg-card text-card-foreground border-border">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  For Markdown, use standard syntax like `**bold**`, `*italic*`, `[link](url)`, ` ```code block``` ` etc.
                </AlertDescription>
              </Alert>
              <Button type="submit" className="w-full text-lg py-6">
                <PlusCircle className="mr-2 h-5 w-5" /> Add Flashcard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
