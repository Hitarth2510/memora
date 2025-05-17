
"use client";

import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle2, ThumbsUp, Brain, AlertTriangle, HelpCircle, XCircle } from 'lucide-react';

interface RatingOption {
  value: number;
  label: string;
  icon: LucideIcon;
  colorClass: string; // Tailwind class for text, icon, border
  glowClass: string; // Tailwind class for hover glow
  bgColorClass: string; // Tailwind class for button background
}

const ratingOptions: RatingOption[] = [
  {
    value: 0,
    label: 'No idea',
    icon: XCircle,
    colorClass: 'text-red-400 border-red-500/70',
    glowClass: 'hover:shadow-[0_0_15px_2px_rgba(248,113,113,0.7)]', // red-400
    bgColorClass: 'bg-red-900/30 hover:bg-red-800/40',
  },
  {
    value: 1,
    label: 'Almost forgot',
    icon: HelpCircle,
    colorClass: 'text-orange-400 border-orange-500/70',
    glowClass: 'hover:shadow-[0_0_15px_2px_rgba(251,146,60,0.7)]', // orange-400
    bgColorClass: 'bg-orange-900/30 hover:bg-orange-800/40',
  },
  {
    value: 2,
    label: 'Familiar mistake',
    icon: AlertTriangle,
    colorClass: 'text-amber-400 border-amber-500/70',
    glowClass: 'hover:shadow-[0_0_15px_2px_rgba(252,180,60,0.7)]', // amber-400 (custom yellow-orange)
    bgColorClass: 'bg-amber-900/30 hover:bg-amber-800/40',
  },
  {
    value: 3,
    label: 'Hard recall',
    icon: Brain,
    colorClass: 'text-yellow-400 border-yellow-500/70',
    glowClass: 'hover:shadow-[0_0_15px_2px_rgba(250,204,21,0.7)]', // yellow-400
    bgColorClass: 'bg-yellow-900/30 hover:bg-yellow-800/40',
  },
  {
    value: 4,
    label: 'Slight hesitation',
    icon: ThumbsUp,
    colorClass: 'text-lime-400 border-lime-500/70',
    glowClass: 'hover:shadow-[0_0_15px_2px_rgba(163,230,53,0.7)]', // lime-400
    bgColorClass: 'bg-lime-900/30 hover:bg-lime-800/40',
  },
  {
    value: 5,
    label: 'Perfect recall',
    icon: CheckCircle2,
    colorClass: 'text-green-400 border-green-500/70',
    glowClass: 'hover:shadow-[0_0_15px_2px_rgba(74,222,128,0.7)]', // green-400
    bgColorClass: 'bg-green-900/30 hover:bg-green-800/40',
  },
];

interface RecallRatingProps {
  onRate: (rating: number) => void;
  currentCardFront?: string; // Optional: to display context, not implemented in this version
}

export function RecallRating({ onRate }: RecallRatingProps) {
  return (
    <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700/80 rounded-xl p-6 md:p-8 shadow-2xl w-full max-w-2xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
        How well did you remember this card?
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
        {ratingOptions.map((option) => (
          <Button
            key={option.value}
            variant="outline"
            onClick={() => onRate(option.value)}
            className={cn(
              "flex flex-col items-center justify-center h-auto p-3 md:p-4 space-y-2 rounded-lg transition-all duration-300 transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900",
              option.colorClass,
              option.glowClass,
              option.bgColorClass,
              "border-2 shadow-md hover:shadow-lg" // Added 3D shadow effect
            )}
          >
            <option.icon className={cn("h-7 w-7 md:h-8 md:w-8 mb-1", option.colorClass.split(' ')[0])} />
            <span className={cn("text-xl md:text-2xl font-bold", option.colorClass.split(' ')[0])}>{option.value}</span>
            <span className="text-xs md:text-sm text-center text-slate-300 font-medium">{option.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
