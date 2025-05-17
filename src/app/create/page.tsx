"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'; // Added for consistency, but Textarea is better for front/back
import { useFlashcards } from '@/hooks/useFlashcards';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, CheckCircle } from 'lucide-react';

export default function CreateFlashcardPage() {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const { addFlashcard } = useFlashcards();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) {
      toast({
        title: 'Error',
        description: 'Both front and back of the flashcard must be filled.',
        variant: 'destructive',
      });
      return;
    }
    addFlashcard(front, back);
    toast({
      title: 'Flashcard Created!',
      description: 'Your new flashcard has been added to your collection.',
      action: <CheckCircle className="text-green-500" />,
    });
    setFront('');
    setBack('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <PlusCircle className="mr-3 h-8 w-8 text-primary" />
            Create a New Flashcard
          </CardTitle>
          <CardDescription>
            Fill in the front and back of your flashcard. Clear and concise cards work best!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="front" className="text-lg font-medium">Front</Label>
              <Textarea
                id="front"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="e.g., What is the capital of France?"
                className="min-h-[100px] text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="back" className="text-lg font-medium">Back</Label>
              <Textarea
                id="back"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder="e.g., Paris"
                className="min-h-[100px] text-base"
                required
              />
            </div>
            <Button type="submit" className="w-full text-lg py-6">
              <PlusCircle className="mr-2 h-5 w-5" /> Add Flashcard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
