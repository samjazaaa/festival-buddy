import DaySwitch from "@/components/DaySwitch";
import Timetable from "@/components/Timetable";

export default function TimetablePage() {
  const day = "Fr";

  return (
    <main className="flex flex-col items-center w-full">
      <div className="mb-6">
        <DaySwitch />
      </div>
      <div className="bg-amber-300 w-full flex flex-col items-center py-3">
        <Timetable />
      </div>
    </main>
  );
}
