
"use client";

import * as React from "react";
import { DayPicker, type DateFormatter, type DayProps } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarCheck2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewHeatmapCalendarProps {
  reviewDates: string[]; // Array of "YYYY-MM-DD" strings
  className?: string;
}

const formatDay: DateFormatter = (day) => day.getDate().toString();

function CustomDay(props: DayProps) {
  const { date, displayMonth, modifiers } = props;

  // Safeguard against modifiers or its properties being undefined
  const isSelected = modifiers?.selected ?? false;
  const isOutside = modifiers?.outside ?? false;
  const isToday = modifiers?.today ?? false;
  const isDisabled = modifiers?.disabled ?? isOutside; // A day is typically disabled if it's outside or explicitly marked disabled

  const cellClasses = "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20";

  const dayClasses = cn(
    "h-full w-full rounded-md flex items-center justify-center transition-colors", // Added transition-colors
    !isDisabled && !isSelected && !isToday && "hover:bg-accent/50", // Hover for regular days
    isSelected && "bg-primary/70 text-primary-foreground font-semibold ring-1 ring-primary hover:bg-primary", // Selected day style
    isToday && !isSelected && "bg-accent text-accent-foreground font-semibold hover:bg-accent/90", // Today's date, not selected
    isToday && isSelected && "ring-2 ring-offset-1 ring-offset-background ring-accent", // Additional indication if today is also selected
    isOutside && !isDisabled && "text-muted-foreground opacity-50", // Default styling for outside days if not forcefully disabled
    isDisabled && "text-muted-foreground opacity-40 cursor-not-allowed" // Styling for disabled days
  );

  return (
    <td className={cellClasses} role="gridcell" aria-selected={isSelected} aria-disabled={isDisabled}>
      <button
        type="button"
        className={dayClasses}
        disabled={isDisabled}
        aria-label={date.toDateString()} // For accessibility
      >
        {date.getDate()}
      </button>
    </td>
  );
}


export function ReviewHeatmapCalendar({ reviewDates, className }: ReviewHeatmapCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());

  const reviewedDays = React.useMemo(() => {
    return reviewDates.map(dateStr => {
      const [year, month, day] = dateStr.split('-').map(Number);
      // Ensure valid dates are created; otherwise, DayPicker might have issues.
      if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
      const d = new Date(year, month - 1, day);
      return isNaN(d.getTime()) ? null : d;
    }).filter(Boolean) as Date[]; // Filter out any nulls from invalid date strings
  }, [reviewDates]);

  const modifiers = {
    selected: reviewedDays,
    // You can add more custom modifiers here if needed
  };

  // Since CustomDay handles all styling, modifiersClassNames is less critical for day cells.
  // It can still be used by DayPicker for other elements or if not using a fully custom Day.
  const modifiersClassNames = {
     // 'selected' styling is now fully handled within CustomDay for better control.
     // 'today' styling is also fully handled within CustomDay.
  };
  
  const calendarContainerStyle: React.CSSProperties = {
    border: "1px solid hsl(var(--border))",
    borderRadius: "var(--radius)",
    padding: "1rem",
    backgroundColor: "hsl(var(--card))", 
    color: "hsl(var(--card-foreground))",
  };
  
  return (
    <Card className={cn("shadow-lg bg-card text-card-foreground", className)}>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <CalendarCheck2 className="mr-2 h-6 w-6 text-primary" />
          Review Activity Heatmap
        </CardTitle>
        <CardDescription>Days you completed review sessions.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <DayPicker
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          formatters={{ formatDay }}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames} 
          components={{ Day: CustomDay }}
          showOutsideDays
          className="p-0" 
          style={calendarContainerStyle} 
          captionLayout="dropdown-buttons"
          fromYear={new Date().getFullYear() -1}
          toYear={new Date().getFullYear() +1}
          classNames={{
            caption: cn("flex justify-between items-center px-2 py-2", "text-foreground"),
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: cn("h-7 w-7 p-0 opacity-80 hover:opacity-100", "bg-transparent hover:bg-accent", "border border-border rounded-md"),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1 mt-2", 
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            // cell styling is now fully controlled by CustomDay
          }}
        />
      </CardContent>
    </Card>
  );
}
