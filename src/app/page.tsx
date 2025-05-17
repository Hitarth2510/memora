
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, PlusCircle, Sparkles, Brain, BarChart3, Edit3, Flame, Zap } from 'lucide-react';
import { useReviewStreak } from '@/hooks/useReviewStreak';

export default function HomePage() {
  const { streak, isStreakLoaded } = useReviewStreak();

  const appFeatures = [
    {
      icon: <Sparkles className="h-8 w-8 text-primary mb-3" />,
      title: "AI Flashcard Generation",
      description: "Instantly create flashcards from your notes or any topic. Let AI do the heavy lifting so you can focus on learning.",
      link: "/ai-generator",
      linkLabel: "Try AI Generator",
      imageSrc: "https://placehold.co/600x400.png",
      imageAlt: "AI Flashcard Generation Interface",
      dataAiHint: "AI generation app interface"
    },
    {
      icon: <Edit3 className="h-8 w-8 text-primary mb-3" />,
      title: "Custom Card Creation",
      description: "Craft your own flashcards with rich text formatting using Markdown, embed images, and include code snippets for technical topics.",
      link: "/create",
      linkLabel: "Create Your Cards",
      imageSrc: "https://placehold.co/600x400.png",
      imageAlt: "Custom card creation with markdown and image preview",
      dataAiHint: "markdown editor card creation"
    },
    {
      icon: <Brain className="h-8 w-8 text-primary mb-3" />,
      title: "Spaced Repetition Learning",
      description: "Master concepts efficiently with the proven SM-2 algorithm. Memora schedules reviews at optimal intervals to maximize retention.",
      link: "/review",
      linkLabel: "Start Reviewing",
      imageSrc: "https://placehold.co/600x400.png",
      imageAlt: "Illustration of learning curve with spaced repetition",
      dataAiHint: "learning curve graph"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary mb-3" />,
      title: "Learning Analytics",
      description: "Track your progress, visualize your study habits, and identify areas for improvement with our insightful analytics dashboard.",
      link: "/analytics",
      linkLabel: "View Analytics",
      imageSrc: "https://placehold.co/600x400.png",
      imageAlt: "Analytics dashboard with charts and graphs",
      dataAiHint: "dashboard charts"
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4.5rem)] text-center px-4 py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white overflow-hidden">
        {/* Subtle Dotted Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:1.25rem_1.25rem] pointer-events-none"></div>
        
        {/* Radial Shine Effect at bottom */}
        <div 
          className="absolute -bottom-1/4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-1/2 
                     bg-radial-gradient-blue opacity-20 pointer-events-none rounded-full blur-3xl"
        ></div>

        <p className="text-sm sm:text-base text-primary mb-3 font-medium z-10">Over 10,000+ Learners Supercharging Their Studies</p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 z-10 leading-tight">
          Learn Smarter, Not Harder <br className="hidden sm:block" /> with <span className="text-primary">Memora</span>.
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto z-10">
          Your intelligent flashcard companion, powered by AI and proven learning science. 
          Create, review, and master any subject effortlessly.
        </p>
        <Button size="lg" asChild className="shadow-lg hover:shadow-primary/50 transition-shadow z-10 text-lg py-7 px-10">
          <Link href="/review">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-slate-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 md:mb-20">
            Unlock Your Full Learning Potential
          </h2>
          {appFeatures.map((feature, index) => (
            <div 
              key={feature.title} 
              className={`flex flex-col md:items-center gap-8 md:gap-16 mb-20 md:mb-28 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              <div className="md:w-1/2">
                <Image 
                  src={feature.imageSrc} 
                  alt={feature.imageAlt} 
                  width={600} 
                  height={400} 
                  className="rounded-xl shadow-2xl object-cover aspect-video" 
                  data-ai-hint={feature.dataAiHint}
                />
              </div>
              <div className="md:w-1/2">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-2xl md:text-3xl font-semibold ml-3">{feature.title}</h3>
                </div>
                <p className="text-slate-300 leading-relaxed mb-6 text-base md:text-lg">{feature.description}</p>
                <Button asChild variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                  <Link href={feature.link}>
                    {feature.linkLabel} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Existing content: Streak and Call to Actions */}
      <section className="py-12 md:py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-xl hover:shadow-2xl transition-shadow bg-slate-800 border-slate-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl md:text-3xl">
                  <Flame className="mr-3 h-8 w-8 text-orange-400" />
                  Daily Review Streak
                </CardTitle>
                <CardDescription className="text-slate-400">Keep your learning momentum burning bright!</CardDescription>
              </CardHeader>
              <CardContent>
                {isStreakLoaded ? (
                  <p className="text-7xl font-bold text-primary">{streak} <span className="text-4xl text-slate-300">days</span></p>
                ) : (
                  <p className="text-2xl text-slate-400">Loading streak...</p>
                )}
                <p className="mt-3 text-sm text-slate-400">
                  Reviewing daily builds strong memory traces. Complete a deck review to maintain your streak!
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-xl hover:shadow-2xl transition-shadow bg-slate-800 border-slate-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl md:text-3xl">
                  <Zap className="mr-3 h-8 w-8 text-green-400" />
                  Ready to Dive In?
                </CardTitle>
                <CardDescription className="text-slate-400">Explore curated decks or create your own custom flashcards.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild size="lg" className="w-full">
                  <Link href="/decks">
                    <BookOpen className="mr-2 h-5 w-5" /> Browse Preloaded Decks
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="w-full bg-slate-700 hover:bg-slate-600 text-white">
                  <Link href="/create">
                    <PlusCircle className="mr-2 h-5 w-5" /> Create Your Own Cards
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
