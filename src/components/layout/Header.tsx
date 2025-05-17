
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Home, PencilRuler, Sparkles, BookOpen, LibraryBig, BarChartHorizontalBig, Flame, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReviewStreak } from '@/hooks/useReviewStreak';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/create", label: "Create", icon: PencilRuler },
  { href: "/review", label: "Review", icon: BookOpen },
  { href: "/decks", label: "Decks", icon: LibraryBig },
  { href: "/ai-generator", label: "AI Gen", icon: Sparkles },
  { href: "/analytics", label: "Analytics", icon: BarChartHorizontalBig },
];

export function Header() {
  const { streak, isStreakLoaded } = useReviewStreak();

  return (
    <header className="bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
          <Image
            src="/memora-logo.png"
            alt="Memora Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <h1 className="text-2xl font-semibold">Memora</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 md:gap-2">
          {navLinks.map((link) => (
            <Button key={link.href} variant="ghost" size="sm" asChild className="text-slate-300 hover:bg-slate-800 hover:text-white">
              <Link href={link.href}>
                <link.icon className="mr-2 h-4 w-4" />
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {isStreakLoaded && (
            <div className="flex items-center gap-1.5 pl-2 md:pl-3 pr-2 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700 text-sm">
              <Flame className="h-5 w-5 text-orange-400" />
              <span className="font-semibold text-white">{streak}</span>
              <span className="text-slate-400 text-xs hidden sm:inline">Days</span>
            </div>
          )}

          {/* Mobile Navigation Trigger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-300 hover:bg-slate-800 hover:text-white">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-slate-900 border-slate-800 p-0 pt-10">
                <nav className="flex flex-col space-y-2 p-4">
                  {navLinks.map((link) => (
                    <SheetClose key={link.href} asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2.5 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                        )}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
