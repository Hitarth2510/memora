import Link from 'next/link';
import { GraduationCap, Home, PencilRuler, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="bg-card border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <GraduationCap className="h-8 w-8" />
          <h1 className="text-2xl font-semibold">Memory Forge</h1>
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/create">
              <PencilRuler className="mr-2 h-4 w-4" />
              Create Cards
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/review">
              <BookOpen className="mr-2 h-4 w-4" />
              Review
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/ai-generator">
              <Sparkles className="mr-2 h-4 w-4" />
              AI Generator
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
