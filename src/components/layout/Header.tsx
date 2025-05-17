import Link from 'next/link';
import { GraduationCap, Home, PencilRuler, Sparkles, BookOpen, LibraryBig, BarChartHorizontalBig } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="bg-card/70 backdrop-blur-md border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <GraduationCap className="h-8 w-8" />
          <h1 className="text-2xl font-semibold">Memory Forge</h1>
        </Link>
        <nav className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" asChild>
            <Link href="/">
              <Home className="mr-0 md:mr-2 h-4 w-4" />
              <span className="hidden md:inline">Home</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/create">
              <PencilRuler className="mr-0 md:mr-2 h-4 w-4" />
              <span className="hidden md:inline">Create</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/review">
              <BookOpen className="mr-0 md:mr-2 h-4 w-4" />
              <span className="hidden md:inline">Review</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/decks">
              <LibraryBig className="mr-0 md:mr-2 h-4 w-4" />
              <span className="hidden md:inline">Decks</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/ai-generator">
              <Sparkles className="mr-0 md:mr-2 h-4 w-4" />
              <span className="hidden md:inline">AI Gen</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/analytics">
              <BarChartHorizontalBig className="mr-0 md:mr-2 h-4 w-4" />
              <span className="hidden md:inline">Analytics</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
