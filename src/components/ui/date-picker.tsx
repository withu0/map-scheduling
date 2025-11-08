"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
  datesWithJobs?: string[]; // Array of date strings in YYYY-MM-DD format
}

export function DatePicker({
  date,
  onDateChange,
  disabled,
  className,
  datesWithJobs = [],
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onDateChange(selectedDate);
      setIsOpen(false);
    }
  };

  // Simple month view calendar
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(date);
    if (direction === "prev") {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    onDateChange(newDate);
  };

  const isDateDisabled = (day: number) => {
    const checkDate = new Date(currentYear, currentMonth, day);
    return disabled ? disabled(checkDate) : false;
  };

  const isDateSelected = (day: number) => {
    return (
      day === date.getDate() &&
      currentMonth === date.getMonth() &&
      currentYear === date.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const hasJobs = (day: number) => {
    const checkDate = new Date(currentYear, currentMonth, day);
    const dateStr = format(checkDate, "yyyy-MM-dd");
    return datesWithJobs.includes(dateStr);
  };

  const handleDayClick = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    if (!isDateDisabled(day)) {
      handleDateSelect(selectedDate);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigateMonth("prev")}
            >
              ←
            </Button>
            <div className="font-semibold">
              {monthNames[currentMonth]} {currentYear}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigateMonth("next")}
            >
              →
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground p-2"
              >
                {day}
              </div>
            ))}
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="p-2" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const isDisabled = isDateDisabled(day);
              const isSelected = isDateSelected(day);
              const isTodayDate = isToday(day);
              const hasJobsForDate = hasJobs(day);

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  disabled={isDisabled}
                  className={cn(
                    "p-2 text-sm rounded-md hover:bg-accent transition-colors relative",
                    isDisabled && "opacity-50 cursor-not-allowed",
                    isSelected &&
                      "bg-primary text-primary-foreground hover:bg-primary",
                    isTodayDate && !isSelected && "bg-accent font-semibold",
                    hasJobsForDate && !isSelected && "font-semibold"
                  )}
                >
                  {day}
                  {hasJobsForDate && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
