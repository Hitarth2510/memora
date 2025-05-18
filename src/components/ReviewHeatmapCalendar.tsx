
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
  const { date, displayMonth } = props;
  const isSelected = props.modifiers.selected;
  const isOutside = props.modifiers.outside;

  let cellClasses = "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20";
  let dayClasses = cn(
    "h-full w-full rounded-md flex items-center justify-center",
    !isSelected && "hover:bg-accent/50",
    isSelected && "bg-primary/30 text-primary-foreground font-semibold ring-1 ring-primary",
    isOutside && "text-muted-foreground opacity-50"
  );

  return (
    <td className={cellClasses} role="gridcell">
      <button
        type="button"
        className={dayClasses}
        disabled={isOutside}
        aria-selected={isSelected}
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
      return new Date(year, month - 1, day); // Month is 0-indexed
    });
  }, [reviewDates]);

  const modifiers = {
    selected: reviewedDays,
  };

  const modifiersClassNames = {
    selected: 'bg-primary/30 text-primary-foreground', // Handled by CustomDay for more control
    today: 'bg-accent text-accent-foreground font-bold',
  };
  
  // Simple styling for the calendar wrapper, can be enhanced
  const calendarContainerStyle: React.CSSProperties = {
    border: "1px solid hsl(var(--border))",
    borderRadius: "var(--radius)",
    padding: "1rem",
    backgroundColor: "hsl(var(--card))", // Use card background
    color: "hsl(var(--card-foreground))",
  };
  
  const captionStyle: React.CSSProperties = {
    color: 'hsl(var(--foreground))', // Ensure caption text is visible
    marginBottom: '1rem',
  };

  const navButtonStyle: React.CSSProperties = {
    color: 'hsl(var(--primary))',
    border: '1px solid hsl(var(--primary))',
    borderRadius: 'var(--radius)',
    padding: '0.25rem 0.5rem'
  };
  
  const headRowStyle: React.CSSProperties = { color: 'hsl(var(--muted-foreground))'};
  const headCellStyle: React.CSSProperties = { width: '2.25rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'normal'};


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
          className="p-0" // Remove default padding from DayPicker itself
          style={calendarContainerStyle} // Apply custom style to the root
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
            table: "w-full border-collapse space-y-1 mt-2", // Added mt-2
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            // cell styling is handled by CustomDay now
            day_today: cn("bg-accent text-accent-foreground font-bold rounded-md"), // Ensure today is visible
            day_outside: "text-muted-foreground opacity-50", // Ensure outside days are styled
          }}
        />
      </CardContent>
    </Card>
  );
}

