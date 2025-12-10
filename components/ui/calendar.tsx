"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-1", className)}
      classNames={{
        months: "flex flex-col space-y-4",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-semibold",
        nav: "space-x-1 flex items-center",
        nav_button:
          "h-7 w-7 bg-transparent hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-700",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-slate-400 rounded-md w-9 font-normal text-[0.7rem]",
        row: "flex w-full mt-2",
        cell:
          "relative h-9 w-9 text-center text-sm focus-within:relative focus-within:z-20",
        day: "h-9 w-9 rounded-full p-0 text-sm hover:bg-slate-100 aria-selected:opacity-100",
        day_selected:
          "bg-blue-600 text-white hover:bg-blue-600 hover:text-white",
        day_today:
          "bg-slate-100 text-slate-900",
        day_outside:
          "text-slate-300",
        day_disabled:
          "text-slate-300 opacity-50",
        ...classNames
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
