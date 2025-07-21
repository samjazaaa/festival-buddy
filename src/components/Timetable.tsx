"use client";

import { $Enums, Act, Stage } from "@/generated/prisma";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { act, FC, useEffect, useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";

interface TimetableProps {
  day: $Enums.Day;
}

const Timetable: FC<TimetableProps> = ({ day }) => {
  const queryClient = useQueryClient();

  const [bounds, setBounds] = useState<{
    start: Date | undefined;
    end: Date | undefined;
  }>({
    start: new Date("2025-07-25T14:00:00+02:00"),
    end: new Date("2025-07-26T02:00:00+02:00"),
  });

  const [timeslots, setTimeslots] = useState<number[]>([]);

  const { data: stages } = useQuery({
    queryKey: ["stages"],
    queryFn: async () => {
      const { data } = await axios.get("/api/stages");
      return data as Stage[];
    },
    enabled: true,
  });

  const { data: acts, isLoading: actsLoading } = useQuery({
    queryKey: ["acts"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/acts?day=${day}`);
      return data as Act[];
    },
    enabled: true,
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["acts"] });
  }, [day]);

  useEffect(() => {
    if (!acts || acts.length === 0) {
      setBounds({ start: undefined, end: undefined });
      return;
    }

    let start: Date = acts[0].start;
    let end: Date = acts[0].end;

    for (const act of acts) {
      if (act.start < start) {
        start = act.start;
      }
      if (act.end > end) {
        end = act.end;
      }
    }

    setBounds({ start: start, end: end });

    const startingHourInTimeZone: number = new Date(start).getHours();
    const endHourInTimeZone: number = new Date(end).getHours();

    const timeslots: number[] = [];
    let currentHour = startingHourInTimeZone;
    while (currentHour !== endHourInTimeZone) {
      timeslots.push(currentHour);
      if (currentHour === 23) {
        currentHour = 0;
      } else {
        currentHour += 1;
      }
    }

    setTimeslots(timeslots);
  }, [acts]);

  const getActs = (acts: Act[], hour: number, stage: Stage) => {
    // get the act that starts in the specified hour on the specified stage if such an act exists
    return acts.filter((act) => {
      return (
        new Date(act.start).getHours() === hour && act.stageId === stage.id
      );
    });
  };

  // Calculates the required timeslots (quarter hours) and returns the fitting row span class
  const getRowSpanClass = (act: Act) => {
    const startDate = new Date(act.start);
    const endDate = new Date(act.end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const slots = Math.floor(Math.round(diffMs / 60000) / 15);
    return `row-span-${slots}`;
  };

  return (
    <div className="bg-teal-400 w-full">
      {/* Header */}
      <div className="grid grid-cols-7 gap-px bg-zinc-800 text-white text-xs rounded-t-lg">
        <div className="flex items-center justify-center text-center p-2">
          Uhrzeit
        </div>
        {stages &&
          stages.map((stage) => (
            <div
              className="flex items-center justify-center text-center font-bold p-2"
              key={stage.id}
            >
              {stage.name}
            </div>
          ))}
      </div>
      {/* Acts */}
      <div className="grid grid-cols-7 gap-3 bg-zinc-700 text-white text-xs rounded-b-lg">
        {actsLoading ? (
          <div>Loading...</div>
        ) : (
          acts &&
          timeslots.map((timeslot) => (
            <>
              <div
                className="row-span-4 text-center bg-orange-500"
                key={timeslot}
              >
                {timeslot}:00 Uhr
              </div>
              {stages!.map((stage) => {
                const foundActs = getActs(acts, timeslot, stage);
                console.log(foundActs);
                return foundActs.length >= 1 ? (
                  foundActs.map((foundAct) => (
                    <div
                      key={foundAct.id}
                      className={cn("text-center", getRowSpanClass(foundAct))}
                    >
                      {foundAct.artist}
                    </div>
                  ))
                ) : (
                  <div
                    className="row-span-4 text-center"
                    key={`${stage.name}-${timeslot}`}
                  >
                    None
                  </div>
                );
              })}
            </>
          ))
        )}
      </div>
    </div>
  );
};

export default Timetable;
