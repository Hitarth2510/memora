
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, PlusCircle, Sparkles, Brain, BarChart3, Edit3, Zap, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { generateFeatureImage, type GenerateFeatureImageInput } from '@/ai/flows/generate-feature-image';

interface AppFeature {
  icon: JSX.Element;
  title: string;
  description: string;
  link: string;
  linkLabel: string;
  baseImageSrc: string; 
  imageAlt: string;
  imagePrompt: string; 
}

const initialAppFeatures: AppFeature[] = [
  {
    icon: <Sparkles className="h-10 w-10 text-primary mb-4" />,
    title: "AI Flashcard Generation",
    description: "Instantly create flashcards from your notes or any topic. Let AI do the heavy lifting. Describe a concept, and watch Memora build your study materials efficiently.",
    link: "/ai-generator",
    linkLabel: "Try AI Generator",
    baseImageSrc: "https://placehold.co/700x500.png",
    imageAlt: "Futuristic AI flashcard generation feature node connected to a central hub.",
    imagePrompt: "Dark futuristic interface with a central glowing blue orb. A connected node labeled 'AI Flashcard Generation' features a subtle brain or spark icon, linked by light blue energy lines. Minimalist, high-tech, dark gray and blue tones."
  },
  {
    icon: <Edit3 className="h-10 w-10 text-primary mb-4" />,
    title: "Custom Card Creation",
    description: "Craft your own flashcards with rich text formatting using Markdown, embed images, and include code snippets for technical topics. Tailor your learning experience precisely.",
    link: "/create",
    linkLabel: "Create Your Cards",
    baseImageSrc: "https://placehold.co/700x500.png",
    imageAlt: "Futuristic custom card creation feature node connected to a central hub.",
    imagePrompt: "Dark futuristic interface with a central glowing blue orb. A connected node labeled 'Custom Card Creation' features an edit or pencil icon, linked by light blue energy lines. Abstract representation of a card interface near the node. Minimalist, high-tech, dark gray and blue tones."
  },
  {
    icon: <Brain className="h-10 w-10 text-primary mb-4" />,
    title: "Spaced Repetition Learning",
    description: "Master concepts effectively with the proven SM-2 algorithm. Memora intelligently schedules reviews at optimal intervals to maximize retention and build long-term memory.",
    link: "/review",
    linkLabel: "Start Reviewing",
    baseImageSrc: "https://placehold.co/700x500.png",
    imageAlt: "Futuristic spaced repetition learning feature node connected to a central hub.",
    imagePrompt: "Dark futuristic interface with a central glowing blue orb. A connected node labeled 'Spaced Repetition' features a calendar or upward graph icon, linked by light blue energy lines. Abstract representation of learning progression. Minimalist, high-tech, dark gray and blue tones."
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-primary mb-4" />,
    title: "Learning Analytics",
    description: "Track your progress, visualize study habits, and identify areas for improvement with our insightful analytics. See your learning journey unfold through data-driven insights.",
    link: "/analytics",
    linkLabel: "View Analytics",
    baseImageSrc: "https://placehold.co/700x500.png",
    imageAlt: "Futuristic learning analytics feature node connected to a central hub.",
    imagePrompt: "Dark futuristic interface with a central glowing blue orb. A connected node labeled 'Learning Analytics' features a bar chart or data points icon, linked by light blue energy lines. Mini glowing chart elements visible. Minimalist, high-tech, dark gray and blue tones."
  }
];

const subFeatures = [
  { icon: <Zap className="h-6 w-6 text-primary" />, label: "Intuitive Interface" },
  { icon: <BookOpen className="h-6 w-6 text-primary" />, label: "Efficient Study" },
  { icon: <PlusCircle className="h-6 w-6 text-primary" />, label: "Curated Decks" },
  { icon: <BarChart3 className="h-6 w-6 text-primary" />, label: "Progress Tracking" },
];

export default function HomePage() {
  const [featureImages, setFeatureImages] = useState<Record<string, string>>({});
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchImages = async () => {
      for (const feature of initialAppFeatures) {
        setLoadingImages(prev => ({ ...prev, [feature.title]: true }));
        try {
          const input: GenerateFeatureImageInput = { prompt: feature.imagePrompt };
          const result = await generateFeatureImage(input);
          if (result.imageUrl) {
            setFeatureImages(prev => ({ ...prev, [feature.title]: result.imageUrl }));
          } else {
            setFeatureImages(prev => ({ ...prev, [feature.title]: feature.baseImageSrc }));
          }
        } catch (error) {
          console.error(`Failed to generate image for ${feature.title}:`, error);
          setFeatureImages(prev => ({ ...prev, [feature.title]: feature.baseImageSrc })); 
        } finally {
          setLoadingImages(prev => ({ ...prev, [feature.title]: false }));
        }
      }
    };

    fetchImages();
  }, []);


  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4.5rem)] text-center px-4 py-16 bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950 text-white overflow-hidden">
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

      {/* Futuristic Features Section */}
      <section className="py-16 md:py-24 bg-slate-950 text-white">
        <div className="container mx-auto px-4 space-y-20 md:space-y-32">
          {initialAppFeatures.map((feature, index) => (
            <div 
              key={feature.title} 
              className={`flex flex-col md:items-center gap-10 md:gap-16 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              <div className="md:w-1/2 relative group">
                <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative w-full aspect-[7/5] rounded-2xl shadow-2xl border border-slate-700/50 group-hover:border-primary/30 transition-colors overflow-hidden bg-slate-800 flex items-center justify-center">
                  {loadingImages[feature.title] && (
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  )}
                  {!loadingImages[feature.title] && (
                    <Image 
                      src={featureImages[feature.title] || feature.baseImageSrc} 
                      alt={feature.imageAlt} 
                      width={700} 
                      height={500} 
                      className="object-cover w-full h-full"
                      unoptimized={featureImages[feature.title]?.startsWith('data:')} 
                    />
                  )}
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="flex items-start mb-5">
                  <div className="p-3 bg-slate-800/70 rounded-xl mr-4 border border-slate-700 backdrop-blur-sm">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-3xl md:text-4xl font-bold mb-1">{feature.title}</h3>
                    <p className="text-sm text-primary uppercase tracking-wider">Core Functionality</p>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed mb-8 text-base md:text-lg">{feature.description}</p>
                <Button asChild variant="outline" className="text-base py-6 px-8 border-primary text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 transform hover:scale-105">
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
