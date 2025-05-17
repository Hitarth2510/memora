"use client";

import type { Flashcard } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlashcardDisplayProps {
  flashcard: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlashcardDisplay({ flashcard, isFlipped, onFlip }: FlashcardDisplayProps) {
  return (
    <div className="w-full max-w-xl mx-auto perspective">
      <Card 
        className={cn(
          "h-80 md:h-96 flex flex-col items-center justify-center p-6 text-center cursor-pointer shadow-xl transition-transform duration-700 preserve-3d relative",
          isFlipped ? "rotate-y-180" : ""
        )}
        onClick={onFlip}
        aria-live="polite"
      >
        <div className="absolute inset-0 backface-hidden">
          <CardContent className="flex flex-col items-center justify-center h-full">
            <p className="text-sm text-muted-foreground mb-2">Front</p>
            <p className="text-2xl md:text-3xl font-semibold">{flashcard.front}</p>
          </CardContent>
        </div>
        <div className="absolute inset-0 rotate-y-180 backface-hidden bg-card">
          <CardContent className="flex flex-col items-center justify-center h-full">
            <p className="text-sm text-muted-foreground mb-2">Back</p>
            <p className="text-2xl md:text-3xl font-semibold">{flashcard.back}</p>
          </CardContent>
        </div>
      </Card>
      <div className="mt-4 flex justify-center">
        <Button variant="outline" onClick={onFlip}>
          <RotateCcw className="mr-2 h-4 w-4" /> Flip Card
        </Button>
      </div>
      <style jsx global>{`
        .perspective {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
