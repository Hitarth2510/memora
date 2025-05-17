
"use client";

import Link from 'next/link';
import { GraduationCap, Home, PencilRuler, Sparkles, BookOpen, LibraryBig, BarChartHorizontalBig, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReviewStreak } from '@/hooks/useReviewStreak'; // Import the hook

export function Header() {
  const { streak, isStreakLoaded } = useReviewStreak(); // Use the hook

  return (
    <header className="bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
          <GraduationCap className="h-8 w-8" />
          <h1 className="text-2xl font-semibold">Memora</h1>
        </Link>
        <nav className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:bg-slate-800 hover:text-white">
            <Link href="/">
              <Home className="mr-0 md:mr-2 h-4 w-4" />
              <span className="hidden md:inline">Home</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:bg-slate-800 hover:text-white">
            <Link href="/create">
              <PencilRuler className="mr-0 md:mr-2 h-4 w-4" />
              <span className="hidden md:inline">Create</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:bg-slate-800 hover:text-white">
            <Link href="/review">
              <BookOpen className="mr-0 md:mr-2 h-4 w-4" />
              <span className="hidden md:inline">Review</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:bg-slate-800 hover:text-white">
            <Link href="/decks">
              <LibraryBig className="mr-0 md:mr-2 h-4 w-4" />
              <span className="hidden md:inline">Decks</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:bg-slate-800 hover:text-white">
            <Link href="/ai-generator">
              <Sparkles className="mr-0 md:mr-2 h-4 w-4" />
              <span className="hidden md:inline">AI Gen</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:bg-slate-800 hover:text-white">
            <Link href="/analytics">
              <BarChartHorizontalBig className="mr-0 md:mr-2 h-4 w-4" />
              <span className="hidden md:inline">Analytics</span>
            </Link>
          </Button>
          
          {isStreakLoaded && (
            <div className="flex items-center gap-1.5 ml-2 md:ml-4 pl-2 md:pl-3 pr-2 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700 text-sm">
              <Flame className="h-5 w-5 text-orange-400" />
              <span className="font-semibold text-white">{streak}</span>
              <span className="text-slate-400 text-xs hidden sm:inline">Days</span>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
