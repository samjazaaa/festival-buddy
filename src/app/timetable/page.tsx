"use client";

import DaySwitch from "@/components/DaySwitch";
import Timetable from "@/components/Timetable";
import { $Enums } from "@/generated/prisma";
import { useState } from "react";

export default function TimetablePage() {
  // TODO get current day
  const [day, setDay] = useState<$Enums.Day>("Fr");

  // TODO get selectable days from DB
  return (
    <main className="flex flex-col items-center w-full">
      <div className="mb-6">
        <DaySwitch
          day={day}
          setDay={setDay}
          selectableDays={["Fr", "Sa", "Su"]}
        />
      </div>
      <div className="bg-amber-300 w-full flex flex-col items-center py-3">
        <Timetable day={day} />
      </div>
    </main>
  );
}
