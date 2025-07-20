"use client";

import type { $Enums, Day } from "@/generated/prisma";
import { Dispatch, FC, SetStateAction, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import { Button } from "./ui/Button";

interface DaySwitchProps {
  day: Day;
  setDay: Dispatch<SetStateAction<$Enums.Day>>;
  selectableDays?: Day[];
}

const DaySwitch: FC<DaySwitchProps> = ({ day, setDay, selectableDays }) => {
  const dayOptions = selectableDays ?? [
    "Mo",
    "Tu",
    "We",
    "Th",
    "Fr",
    "Sa",
    "Su",
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-40">
          {day}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {dayOptions.map((dayOption, index) => (
          <DropdownMenuItem
            key={index}
            className="flex items-center justify-center"
            onClick={() => setDay(dayOption)}
          >
            {dayOption === day && "> "}
            {dayOption}
            {dayOption === day && " <"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DaySwitch;
