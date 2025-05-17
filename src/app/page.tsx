"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, PlusCircle, BookOpen, Sparkles, Flame } from 'lucide-react';
import { useReviewStreak } from '@/hooks/useReviewStreak';

export default function HomePage() {
  const { streak, isStreakLoaded } = useReviewStreak();

  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-card rounded-lg shadow">
        <Rocket className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-5xl font-bold mb-2">Welcome to Memory Forge!</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Supercharge your learning with intelligent flashcards and spaced repetition.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/create">
              <PlusCircle className="mr-2 h-5 w-5" /> Create New Cards
            </Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/review">
              <BookOpen className="mr-2 h-5 w-5" /> Start Review Session
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Flame className="mr-3 h-7 w-7 text-primary" />
              Daily Review Streak
            </CardTitle>
            <CardDescription>Keep your learning momentum going!</CardDescription>
          </CardHeader>
          <CardContent>
            {isStreakLoaded ? (
              <p className="text-5xl font-bold text-primary">{streak} <span className="text-2xl text-muted-foreground">days</span></p>
            ) : (
              <p className="text-lg text-muted-foreground">Loading streak...</p>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              Reviewing daily helps build strong memory traces.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Sparkles className="mr-3 h-7 w-7 text-primary" />
              AI-Powered Flashcards
            </CardTitle>
            <CardDescription>Let AI help you create flashcards from your notes.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Paste your study material and watch Memory Forge instantly generate relevant question-answer pairs.
            </p>
            <Button asChild>
              <Link href="/ai-generator">
                <Sparkles className="mr-2 h-5 w-5" /> Go to AI Generator
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
