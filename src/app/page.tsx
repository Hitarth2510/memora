
"use client";

import Link from 'next/link';
import Image from 'next/image'; // Keep for logo if needed, but not for features
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, PlusCircle, Sparkles, Brain, BarChart3, Edit3, Zap, Cpu, Layers, Palette, Users, TrendingUp } from 'lucide-react';

interface CoreFeature {
  icon: JSX.Element;
  title: string;
  description: string;
  link: string;
  linkLabel: string;
}

const coreFeaturesList: CoreFeature[] = [
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: "AI Flashcard Generation",
    description: "Instantly create flashcards from your notes or any topic. Let AI do the heavy lifting and build your study materials efficiently.",
    link: "/ai-generator",
    linkLabel: "Try AI Generator",
  },
  {
    icon: <Brain className="h-8 w-8 text-primary" />,
    title: "Spaced Repetition Learning",
    description: "Master concepts effectively with the proven SM-2 algorithm. Memora intelligently schedules reviews for optimal retention.",
    link: "/review",
    linkLabel: "Start Reviewing",
  },
  {
    icon: <Edit3 className="h-8 w-8 text-primary" />,
    title: "Custom Card Creation",
    description: "Craft your own flashcards with rich text Markdown, embed image URLs, and tailor your learning experience precisely.",
    link: "/create",
    linkLabel: "Create Your Cards",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    title: "Learning Analytics",
    description: "Track your progress, visualize study habits, and identify areas for improvement with insightful analytics.",
    link: "/analytics",
    linkLabel: "View Analytics",
  },
  {
    icon: <Layers className="h-8 w-8 text-primary" />,
    title: "Preloaded Decks",
    description: "Kickstart your learning with a variety of curated flashcard decks covering popular subjects and fundamental knowledge.",
    link: "/decks",
    linkLabel: "Browse Decks",
  },
  {
    icon: <Cpu className="h-8 w-8 text-primary" />,
    title: "Intuitive & Responsive",
    description: "Enjoy a seamless experience on any device, with a clean interface designed for focused study sessions.",
    link: "/", // General link or specific to a tour/feature page
    linkLabel: "Learn More",
  },
];

const subFeaturesBar = [
  { icon: <Zap className="h-6 w-6 text-primary" />, label: "Efficient Study" },
  { icon: <BookOpen className="h-6 w-6 text-primary" />, label: "Markdown Support" },
  { icon: <Palette className="h-6 w-6 text-primary" />, label: "Sleek Dark UI" },
  { icon: <TrendingUp className="h-6 w-6 text-primary" />, label: "Progress Tracking" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col w-full"> {/* Ensure this parent takes full width */}
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4.5rem)] text-center px-4 py-16 bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950 text-white overflow-hidden w-full">
        <div className="absolute inset-0 opacity-[0.02] [background-image:radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:1.25rem_1.25rem] pointer-events-none"></div>
        
        <div 
          className="absolute -bottom-1/3 left-1/2 transform -translate-x-1/2 w-full max-w-5xl h-2/3 
                     bg-radial-gradient-blue opacity-15 pointer-events-none rounded-full blur-3xl"
        ></div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-8 z-10 leading-tight">
          Unlock Your Learning <br className="hidden sm:block" /> Potential with <span className="text-primary">Memora</span>.
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto z-10">
          Master any subject with AI-powered flashcards and intelligent spaced repetition. Learn smarter, remember longer, and achieve your goals.
        </p>
        <Button size="lg" asChild className="shadow-lg hover:shadow-primary/50 transition-shadow z-10 text-lg py-7 px-10 bg-primary hover:bg-primary/90">
          <Link href="/review">
            Start Learning Now <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>

      {/* New Features Section - Grid Layout */}
      <section className="py-16 md:py-24 bg-slate-950 text-white w-full">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Explore Memora's Core</h2>
            <p className="text-slate-400 mt-3 text-lg">Powerful tools designed for effective and engaging learning.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {coreFeaturesList.map((feature) => (
              <div 
                key={feature.title} 
                className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 shadow-xl hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 flex flex-col group"
              >
                <div className="flex items-center mb-5">
                  <div className="p-3 bg-slate-800 rounded-lg mr-4 border border-slate-700 group-hover:border-primary/50 transition-colors">
                     {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-100">{feature.title}</h3>
                </div>
                <p className="text-slate-400 leading-relaxed text-sm mb-6 flex-grow">{feature.description}</p>
                <Button asChild variant="outline" size="sm" className="mt-auto border-primary/70 text-primary/90 hover:bg-primary/10 hover:text-primary group-hover:border-primary group-hover:text-primary transition-all duration-300 w-full sm:w-auto">
                  <Link href={feature.link}>
                    {feature.linkLabel} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Sub-features bar */}
      <section className="py-12 md:py-16 bg-slate-900 border-t border-slate-800 w-full">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {subFeaturesBar.map(sf => (
              <div key={sf.label} className="flex flex-col items-center">
                <div className="p-3 bg-slate-800/70 rounded-full mb-3 border border-slate-700 backdrop-blur-sm">
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

    