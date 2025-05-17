
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, PlusCircle, BookOpen, Sparkles, Flame, Brain, BarChart3, Edit3 } from 'lucide-react';
import { useReviewStreak } from '@/hooks/useReviewStreak';

export default function HomePage() {
  const { streak, isStreakLoaded } = useReviewStreak();

  const features = [
    {
      icon: <Sparkles className="h-10 w-10 text-primary mb-4" />,
      title: "AI Flashcard Generation",
      description: "Instantly create flashcards from your notes or topics using cutting-edge AI.",
      link: "/ai-generator",
      linkLabel: "Try AI Generator"
    },
    {
      icon: <Edit3 className="h-10 w-10 text-primary mb-4" />,
      title: "Custom Card Creation",
      description: "Craft your own cards with Markdown, images, and code snippets for personalized learning.",
      link: "/create",
      linkLabel: "Create Your Cards"
    },
    {
      icon: <Brain className="h-10 w-10 text-primary mb-4" />,
      title: "Spaced Repetition",
      description: "Learn efficiently with the SM-2 algorithm, reviewing cards at optimal intervals.",
      link: "/review",
      linkLabel: "Start Reviewing"
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-primary mb-4" />,
      title: "Learning Analytics",
      description: "Track your progress, identify weak spots, and visualize your learning journey.",
      link: "/analytics",
      linkLabel: "View Analytics"
    }
  ];

  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-card rounded-lg shadow-xl">
        <Rocket className="mx-auto h-16 w-16 text-primary mb-6" />
        <h1 className="text-5xl font-bold mb-3">Welcome to Memora!</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          The intelligent flashcard platform to supercharge your learning with AI and spaced repetition.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" asChild className="shadow-lg hover:shadow-primary/50 transition-shadow">
            <Link href="/review">
              <BookOpen className="mr-2 h-5 w-5" /> Start Review Session
            </Link>
          </Button>
          <Button size="lg" variant="secondary" asChild className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="/ai-generator">
              <Sparkles className="mr-2 h-5 w-5" /> AI Generate Cards
            </Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Unlock Your Learning Potential</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
              <CardHeader className="items-center text-center">
                {feature.icon}
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center flex-grow">
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
              <CardContent className="text-center">
                <Button asChild variant="outline">
                  <Link href={feature.link}>
                    {feature.linkLabel}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      <section className="grid md:grid-cols-2 gap-6">
         <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Flame className="mr-3 h-7 w-7 text-orange-400" />
              Daily Review Streak
            </CardTitle>
            <CardDescription>Keep your learning momentum going!</CardDescription>
          </CardHeader>
          <CardContent>
            {isStreakLoaded ? (
              <p className="text-6xl font-bold text-primary">{streak} <span className="text-3xl text-muted-foreground">days</span></p>
            ) : (
              <p className="text-lg text-muted-foreground">Loading streak...</p>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              Reviewing daily helps build strong memory traces. Complete a deck review to maintain your streak!
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <PlusCircle className="mr-3 h-7 w-7 text-green-500" />
              Ready to Learn Something New?
            </CardTitle>
            <CardDescription>Explore preloaded decks or create your own custom flashcards.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Button asChild className="w-full">
              <Link href="/decks">
                <BookOpen className="mr-2 h-5 w-5" /> Browse Preloaded Decks
              </Link>
            </Button>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/create">
                <PlusCircle className="mr-2 h-5 w-5" /> Create Your Own Cards
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
