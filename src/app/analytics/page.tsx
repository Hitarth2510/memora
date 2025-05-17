
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFlashcards } from '@/hooks/useFlashcards';
import type { Flashcard } from '@/lib/types';
import { BarChart as ChartIcon, Activity, CalendarDays, Brain, LineChart, Orbit, TrendingUp } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const prepareChartData = (flashcards: Flashcard[]): { date: string; created: number }[] => {
  const countsByMonth: { [month: string]: number } = {};
  flashcards.forEach(card => {
    const timestampStr = card.id.split('-')[0];
    const timestamp = parseInt(timestampStr, 10);
    if (!isNaN(timestamp)) {
      const date = new Date(timestamp);
      const monthYear = date.toLocaleDateString('default', { month: 'short', year: '2-digit' });
      countsByMonth[monthYear] = (countsByMonth[monthYear] || 0) + 1;
    }
  });

  const sortedData = Object.entries(countsByMonth)
    .map(([dateStr, created]) => {
        const parts = dateStr.split(' ');
        let year = parseInt(parts[1], 10);
        if (year < 100) year += 2000; 
        const monthIndex = new Date(Date.parse(parts[0] +" 1, 2000")).getMonth();
        return { originalDateStr: dateStr, dateObj: new Date(year, monthIndex), created };
    })
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
    .map(item => ({ date: item.originalDateStr, created: item.created }));
    
  return sortedData;
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
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8 text-foreground">
        <Card className="shadow-xl bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center">
              <Activity className="mr-3 h-8 w-8 text-primary" />
              Your Learning Analytics
            </CardTitle>
            <CardDescription>
              Track your progress, review habits, and memory strength over time. More insights coming soon!
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <ChartIcon className="mr-2 h-6 w-6 text-primary" />
                Flashcards Created Over Time
              </CardTitle>
              <CardDescription>Number of new flashcards added per month.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoaded && cardsCreatedData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={cardsCreatedData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted-foreground/30" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      className="text-xs fill-muted-foreground"
                    />
                    <YAxis 
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      allowDecimals={false} 
                      className="text-xs fill-muted-foreground"
                    />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--muted))', radius: 4 }}
                      contentStyle={{
                          backgroundColor: 'hsl(var(--card))', // Use card background for tooltip
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                          color: 'hsl(var(--card-foreground))' // Ensure text color matches
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                      itemStyle={{ color: 'hsl(var(--primary))' }}
                    />
                    <Bar dataKey="created" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-center py-10">
                  {isLoaded ? "No card creation data yet. Start creating flashcards!" : "Loading chart data..."}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <CalendarDays className="mr-2 h-6 w-6 text-primary" />
                Review Heatmap
              </CardTitle>
              <CardDescription>Your daily review activity visualized (Coming Soon).</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[250px] bg-muted/30 rounded-md">
              <p className="text-muted-foreground">Heatmap visualization will be available here.</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                  <LineChart className="mr-2 h-6 w-6 text-primary" />
                  Retention Curve
              </CardTitle>
              <CardDescription>Track how well you're retaining information over time (Coming Soon).</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[200px] bg-muted/30 rounded-md">
              <p className="text-muted-foreground">Retention curve graphs will appear here.</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Orbit className="mr-2 h-6 w-6 text-primary" />
                Deck-Specific Strength
              </CardTitle>
              <CardDescription>Memory strength for each of your decks (Coming Soon).</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[200px] bg-muted/30 rounded-md">
              <p className="text-muted-foreground">Deck-specific stats will be shown here.</p>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2 shadow-lg bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <TrendingUp className="mr-2 h-6 w-6 text-primary" />
                Overall Progress
              </CardTitle>
              <CardDescription>Your learning trajectory and achievements (Coming Soon).</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[200px] bg-muted/30 rounded-md">
              <p className="text-muted-foreground">Advanced progress metrics will be displayed here.</p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

    