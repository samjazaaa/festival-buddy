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
    start: number | undefined;
    end: number | undefined;
  }>({
    start: 14,
    end: 2,
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

    setBounds({
      start: new Date(start).getHours(),
      end: new Date(end).getHours(),
    });

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

  const getActsForStage = (acts: Act[], stage: Stage) => {
    // get the acts that start on the specified stage
    return acts.filter((act) => {
      return act.stageId === stage.id;
    });
  };

  // Calculates the required timeslots (quarter hours)
  const getSlots = (act: Act) => {
    const startDate = new Date(act.start);
    const endDate = new Date(act.end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const slots = Math.floor(Math.round(diffMs / 60000) / 15);
    return slots;
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
      <div
        className={cn(
          "grid grid-flow-row grid-cols-7 gap-2 bg-zinc-700 text-white text-xs rounded-b-lg"
        )}
        style={{
          gridTemplateRows: `repeat(${timeslots.length * 4}, 1rem)`,
        }}
      >
        {actsLoading ? (
          <div>Loading...</div>
        ) : (
          acts && (
            <>
              {timeslots.map((timeslot, index) => (
                <div
                  className="text-center bg-orange-500 col-start-1 flex items-center justify-center"
                  style={{
                    gridRowStart: index * 4 + 1,
                    gridRowEnd: index * 4 + 5,
                  }}
                  key={timeslot}
                >
                  {timeslot}:00 Uhr
                </div>
              ))}

              {stages!.map((stage, index) => {
                const foundActs = getActsForStage(acts, stage);
                console.log(`Placing acts for stage ${stage.name}`);
                console.log(foundActs);

                return foundActs.map((foundAct) => {
                  const actStartDate = new Date(foundAct.start);
                  const adjustedStartHour =
                    actStartDate.getHours() >= bounds.start!
                      ? actStartDate.getHours()
                      : actStartDate.getHours() + 24;
                  const diff =
                    (adjustedStartHour - bounds.start!) * 4 +
                    actStartDate.getMinutes() / 15 +
                    1;

                  console.log(`Diff for ${foundAct.start} is ${diff}`);

                  const colStart = index + 2;
                  const colEnd = index + 3;
                  const rowStart = diff;
                  const rowEnd = diff + getSlots(foundAct);

                  return (
                    <div
                      key={foundAct.id}
                      className="text-center flex items-center justify-center bg-violet-400"
                      style={{
                        gridColumnStart: colStart,
                        gridColumnEnd: colEnd,
                        gridRowStart: rowStart,
                        gridRowEnd: rowEnd,
                      }}
                    >
                      {foundAct.artist}
                    </div>
                  );
                });
              })}
            </>
          )
        )}
      </div>
    </div>
  );
};

export default Timetable;
