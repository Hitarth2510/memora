"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFlashcards } from '@/hooks/useFlashcards';
import type { Flashcard } from '@/lib/types';
import { BarChart as ChartIcon, Activity, CalendarDays, Brain } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"; // Using recharts directly for BarChart

const prepareChartData = (flashcards: Flashcard[]): { date: string; created: number }[] => {
  const countsByMonth: { [month: string]: number } = {};
  flashcards.forEach(card => {
    // ID format is assumed to be `${Date.now()}-randomstring`
    const timestampStr = card.id.split('-')[0];
    const timestamp = parseInt(timestampStr, 10);
    if (!isNaN(timestamp)) {
      const date = new Date(timestamp);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      countsByMonth[monthYear] = (countsByMonth[monthYear] || 0) + 1;
    }
  });
  return Object.entries(countsByMonth)
    .map(([date, created]) => ({ date, created }))
    .sort((a, b) => {
      const dateA = new Date(a.date + "-01"); // Ensure it's parsed as a date for sorting
      const dateB = new Date(b.date + "-01");
      return dateA.getTime() - dateB.getTime();
    });
};

const chartConfig = {
  created: {
    label: "Cards Created",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export default function AnalyticsPage() {
  const { flashcards, isLoaded } = useFlashcards();
  const [cardsCreatedData, setCardsCreatedData] = useState<{ date: string; created: number }[]>([]);

  useEffect(() => {
    if (isLoaded) {
      setCardsCreatedData(prepareChartData(flashcards));
    }
  }, [flashcards, isLoaded]);

  return (
    <div className="space-y-8">
      <Card className="shadow-xl bg-card/80 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <Activity className="mr-3 h-8 w-8 text-primary" />
            Your Learning Analytics
          </CardTitle>
          <CardDescription>
            Track your progress, review habits, and memory strength over time.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChartIcon className="mr-2 h-6 w-6 text-primary" />
              Flashcards Created Over Time
            </CardTitle>
            <CardDescription>Number of new flashcards added per month.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoaded && cardsCreatedData.length > 0 ? (
              <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                <BarChart accessibilityLayer data={cardsCreatedData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    // tickFormatter={(value) => new Date(value + "-01").toLocaleDateString('default', { month: 'short', year: '2-digit' })}
                  />
                  <YAxis 
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    allowDecimals={false} 
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="created" fill="var(--color-created)" radius={4} />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground text-center py-10">
                {isLoaded ? "No card creation data yet. Start creating flashcards!" : "Loading chart data..."}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarDays className="mr-2 h-6 w-6 text-primary" />
              Review Heatmap
            </CardTitle>
            <CardDescription>Your review activity visualized on a calendar (Coming Soon).</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">Heatmap visualization will be available here.</p>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-6 w-6 text-primary" />
              Memory Strength & Retention
            </CardTitle>
            <CardDescription>Insights into your learning effectiveness (Coming Soon).</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[200px] items-center justify-center">
            <p className="text-muted-foreground text-center md:text-left">Retention curve graphs will appear here.</p>
            <p className="text-muted-foreground text-center md:text-left">Deck-specific memory strength statistics will be shown here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
