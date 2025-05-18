
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useReviewStreak } from '@/hooks/useReviewStreak';
import type { Flashcard } from '@/lib/types';
import { BarChart as ChartIcon, Activity, Info, CalendarCheck2 } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ReviewHeatmapCalendar } from '@/components/ReviewHeatmapCalendar'; // Import the new component

const parseDateString = (dateStr: string): Date | null => {
  // Assuming dateStr is "Mon 'YY" e.g. "Jan '24" or "Dec '23"
  const parts = dateStr.split(' ');
  if (parts.length !== 2) return null;

  const monthStr = parts[0];
  const yearStr = parts[1].replace("'", "");
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthIndex = monthNames.indexOf(monthStr);
  if (monthIndex === -1) return null;

  let year = parseInt(yearStr, 10);
  if (isNaN(year)) return null;
  
  // Assuming years like '23', '24' are 2023, 2024
  if (year < 100) year += 2000; 

  return new Date(year, monthIndex, 1); // Day set to 1 for month sorting
};


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
        const dateObj = parseDateString(dateStr);
        return { originalDateStr: dateStr, dateObj, created };
    })
    .filter(item => item.dateObj !== null) // Filter out any unparseable dates
    .sort((a, b) => (a.dateObj as Date).getTime() - (b.dateObj as Date).getTime())
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
  const { flashcards, isLoaded: flashcardsLoaded } = useFlashcards();
  const { reviewHistory, isStreakLoaded } = useReviewStreak();
  const [cardsCreatedData, setCardsCreatedData] = useState<{ date: string; created: number }[]>([]);

  useEffect(() => {
    if (flashcardsLoaded) {
      setCardsCreatedData(prepareChartData(flashcards));
    }
  }, [flashcards, flashcardsLoaded]);

  const isFullyLoaded = flashcardsLoaded && isStreakLoaded;

  return (
    <div className="space-y-8 text-foreground">
        <Card className="shadow-xl bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center">
              <Activity className="mr-3 h-8 w-8 text-primary" />
              Your Learning Analytics
            </CardTitle>
            <CardDescription>
              Track your flashcard creation and review progress.
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
              {flashcardsLoaded && cardsCreatedData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
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
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                          color: 'hsl(var(--card-foreground))'
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                      itemStyle={{ color: 'hsl(var(--primary))' }}
                    />
                    <Bar dataKey="created" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-center py-10">
                  {flashcardsLoaded ? "No card creation data yet. Start creating flashcards!" : "Loading chart data..."}
                </p>
              )}
            </CardContent>
          </Card>
          
          {/* Review Heatmap Calendar */}
          {isFullyLoaded ? (
            <ReviewHeatmapCalendar reviewDates={reviewHistory} />
          ) : (
            <Card className="shadow-lg bg-card text-card-foreground">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <CalendarCheck2 className="mr-2 h-6 w-6 text-primary" />
                  Review Activity Heatmap
                </CardTitle>
                <CardDescription>Loading heatmap data...</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">Loading...</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        <Alert variant="default" className="bg-muted text-muted-foreground border-border">
          <Info className="h-4 w-4" />
          <AlertTitle>More Analytics Coming Soon!</AlertTitle>
          <AlertDescription>
            We're working on adding more detailed insights like retention curves and deck-specific performance. Stay tuned!
          </AlertDescription>
        </Alert>
      </div>
  );
}
