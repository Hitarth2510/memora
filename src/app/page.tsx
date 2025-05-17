
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, PlusCircle, Sparkles, Brain, BarChart3, Edit3, Zap } from 'lucide-react';

export default function HomePage() {

  const appFeatures = [
    {
      icon: <Sparkles className="h-10 w-10 text-primary mb-4" />,
      title: "AI Flashcard Generation",
      description: "Instantly create flashcards from your notes or any topic. Let AI do the heavy lifting so you can focus on learning. Describe a concept, and watch Memora build your study materials.",
      link: "/ai-generator",
      linkLabel: "Try AI Generator",
      imageSrc: "https://placehold.co/700x500.png",
      imageAlt: "Futuristic interface showing AI generating flashcards from text input",
      dataAiHint: "AI generation futuristic interface"
    },
    {
      icon: <Edit3 className="h-10 w-10 text-primary mb-4" />,
      title: "Custom Card Creation",
      description: "Craft your own flashcards with rich text formatting using Markdown, embed images, and include code snippets for technical topics. Tailor your learning experience to your exact needs.",
      link: "/create",
      linkLabel: "Create Your Cards",
      imageSrc: "https://placehold.co/700x500.png",
      imageAlt: "Sleek card creation interface with markdown preview and image upload option",
      dataAiHint: "markdown editor modern UI"
    },
    {
      icon: <Brain className="h-10 w-10 text-primary mb-4" />,
      title: "Spaced Repetition Learning",
      description: "Master concepts efficiently with the proven SM-2 algorithm. Memora schedules reviews at optimal intervals to maximize retention and ensure long-term memory.",
      link: "/review",
      linkLabel: "Start Reviewing",
      imageSrc: "https://placehold.co/700x500.png",
      imageAlt: "Abstract visualization of a brain with connected nodes representing spaced repetition intervals",
      dataAiHint: "spaced repetition abstract"
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-primary mb-4" />,
      title: "Learning Analytics",
      description: "Track your progress, visualize your study habits, and identify areas for improvement with our insightful analytics dashboard. See your learning journey unfold with data.",
      link: "/analytics",
      linkLabel: "View Analytics",
      imageSrc: "https://placehold.co/700x500.png",
      imageAlt: "Futuristic analytics dashboard with glowing charts and graphs",
      dataAiHint: "dashboard futuristic charts"
    }
  ];

  const subFeatures = [
    { icon: <Zap className="h-6 w-6 text-primary" />, label: "Easy to Use Interface" },
    { icon: <BookOpen className="h-6 w-6 text-primary" />, label: "Real-time Learning" },
    { icon: <PlusCircle className="h-6 w-6 text-primary" />, label: "PYQ-Inspired Decks" }, // Placeholder for "PYQ Practice"
    { icon: <BarChart3 className="h-6 w-6 text-primary" />, label: "Performance Tracking" },
  ];


  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4.5rem)] text-center px-4 py-16 bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] [background-image:radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:1.25rem_1.25rem] pointer-events-none"></div>
        
        <div 
          className="absolute -bottom-1/3 left-1/2 transform -translate-x-1/2 w-full max-w-5xl h-2/3 
                     bg-radial-gradient-blue opacity-15 pointer-events-none rounded-full blur-3xl"
        ></div>

        <p className="text-sm sm:text-base text-primary mb-4 font-medium z-10 uppercase tracking-wider">Memora Quiz Simulator</p>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-8 z-10 leading-tight">
          Practice and Improve <br className="hidden sm:block" /> in a <span className="text-primary">Real Quiz Environment</span>.
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto z-10">
          Our Quiz Simulator uses advanced learning algorithms for authentic practice, helping you familiarize yourself with patterns and concepts. The timed format improves retention and builds confidence.
        </p>
        <Button size="lg" asChild className="shadow-lg hover:shadow-primary/50 transition-shadow z-10 text-lg py-7 px-10 bg-primary hover:bg-primary/90">
          <Link href="/review">
            Take a Quiz Now <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>

      {/* Futuristic Features Section */}
      <section className="py-16 md:py-24 bg-slate-950 text-white">
        <div className="container mx-auto px-4 space-y-20 md:space-y-32">
          {appFeatures.map((feature, index) => (
            <div 
              key={feature.title} 
              className={`flex flex-col md:items-center gap-10 md:gap-16 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              <div className="md:w-1/2 relative">
                <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <Image 
                  src={feature.imageSrc} 
                  alt={feature.imageAlt} 
                  width={700} 
                  height={500} 
                  className="rounded-2xl shadow-2xl object-cover aspect-[7/5] relative z-10 border border-slate-700" 
                  data-ai-hint={feature.dataAiHint}
                />
              </div>
              <div className="md:w-1/2">
                <div className="flex items-start mb-5">
                  <div className="p-3 bg-slate-800 rounded-xl mr-4 border border-slate-700">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-3xl md:text-4xl font-bold mb-1">{feature.title}</h3>
                    <p className="text-sm text-primary uppercase tracking-wider">Core Functionality</p>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed mb-8 text-base md:text-lg">{feature.description}</p>
                <Button asChild variant="outline" className="text-base py-6 px-8 border-primary text-primary hover:bg-primary/10 hover:text-primary">
                  <Link href={feature.link}>
                    {feature.linkLabel} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Sub-features bar */}
      <section className="py-12 md:py-16 bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {subFeatures.map(sf => (
              <div key={sf.label} className="flex flex-col items-center">
                <div className="p-3 bg-slate-800 rounded-full mb-3 border border-slate-700">
                 {sf.icon}
                </div>
                <p className="text-sm text-slate-300">{sf.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
