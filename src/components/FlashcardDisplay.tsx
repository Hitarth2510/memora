
"use client";

import type { Flashcard } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

interface FlashcardDisplayProps {
  flashcard: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlashcardDisplay({ flashcard, isFlipped, onFlip }: FlashcardDisplayProps) {
  const isValidHttpUrl = (string?: string) => {
    if (!string) return false;
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;  
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto perspective group"> {/* Added group for group-hover */}
      <Card 
        className={cn(
          "h-96 md:h-112 flex flex-col items-center justify-center p-2 text-center cursor-pointer shadow-xl transition-all duration-700 preserve-3d relative",
          "prose dark:prose-invert prose-sm md:prose-base max-w-none", 
          "hover:shadow-primary/30 hover:shadow-2xl", // Glowing effect on hover
          "group-hover:[transform:rotateY(var(--tw-rotate-y))_rotateX(var(--tw-rotate-x))_scale(1.05)]", // 3D tilt, adjusted for existing flip
          isFlipped ? "rotate-y-180" : ""
        )}
        onClick={onFlip}
        aria-live="polite"
        style={{
          // Default rotations, will be overridden by hover if not flipped
          // @ts-ignore
          "--tw-rotate-x": isFlipped ? "0deg" : "0deg", // Keep X flat unless hovered
          "--tw-rotate-y": isFlipped ? "180deg" : "0deg",
        }}
        onMouseMove={(e) => {
          if (isFlipped) return; // Don't apply hover tilt if card is flipped
          const card = e.currentTarget;
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          const rotateX = (-y / rect.height) * 10; // Max rotation 5deg
          const rotateY = (x / rect.width) * 10;  // Max rotation 5deg
          card.style.setProperty('--tw-rotate-x', `${rotateX}deg`);
          card.style.setProperty('--tw-rotate-y', `${rotateY}deg`);
        }}
        onMouseLeave={(e) => {
           if (isFlipped) return;
          const card = e.currentTarget;
          card.style.setProperty('--tw-rotate-x', `0deg`);
          card.style.setProperty('--tw-rotate-y', `0deg`);
        }}
      >
        {/* Front of the Card */}
        <div className="absolute inset-0 backface-hidden flex flex-col">
          <CardContent className="flex flex-col items-center justify-center h-full p-4 space-y-3">
            <p className="text-xs text-muted-foreground mb-1 self-start">Front</p>
            {flashcard.frontImageUrl && isValidHttpUrl(flashcard.frontImageUrl) && (
              <div className="my-2 max-h-32 overflow-hidden">
                <Image 
                  src={flashcard.frontImageUrl} 
                  alt="Front image" 
                  width={200} 
                  height={120} 
                  className="object-contain rounded max-h-32" 
                  data-ai-hint="user provided content"
                />
              </div>
            )}
            <div className="markdown-content text-lg md:text-xl font-semibold">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{flashcard.front}</ReactMarkdown>
            </div>
          </CardContent>
        </div>

        {/* Back of the Card */}
        <div className="absolute inset-0 rotate-y-180 backface-hidden bg-card flex flex-col">
          <CardContent className="flex flex-col items-center justify-center h-full p-4 space-y-3">
            <p className="text-xs text-muted-foreground mb-1 self-start">Back</p>
             {flashcard.backImageUrl && isValidHttpUrl(flashcard.backImageUrl) && (
              <div className="my-2 max-h-32 overflow-hidden">
                <Image 
                  src={flashcard.backImageUrl} 
                  alt="Back image" 
                  width={200} 
                  height={120} 
                  className="object-contain rounded max-h-32" 
                  data-ai-hint="user provided content"
                />
              </div>
            )}
            <div className="markdown-content text-lg md:text-xl font-semibold">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{flashcard.back}</ReactMarkdown>
            </div>
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
        /* Ensure hover transformations apply correctly with existing flip */
        .group:hover .preserve-3d:not(.rotate-y-180) {
           transform: rotateY(var(--tw-rotate-y)) rotateX(var(--tw-rotate-x)) scale(1.05);
        }
        .group:hover .preserve-3d.rotate-y-180 {
           /* Keep it flipped but allow other transforms like scale if desired */
           transform: rotateY(180deg) scale(1.05);
        }

        .markdown-content img {
          max-width: 100%;
          max-height: 100px; /* Adjust as needed for images within markdown */
          margin: 0.5rem auto;
          border-radius: 0.25rem;
        }
        .markdown-content p {
          margin-bottom: 0.5em; /* Adjust spacing for paragraphs in markdown */
        }
         .markdown-content pre {
          background-color: hsl(var(--muted) / 0.5);
          padding: 0.5rem;
          border-radius: 0.25rem;
          overflow-x: auto;
        }
        .markdown-content code:not(pre code) {
          background-color: hsl(var(--muted) / 0.5);
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.9em;
        }
      `}</style>
    </div>
  );
}
