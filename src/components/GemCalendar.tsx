import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Save } from "lucide-react";

export default function GemCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  const [noteText, setNoteText] = useState("");
  const [savedNotes, setSavedNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const saved = localStorage.getItem("gemstoneOS_calendar_notes");
    if (saved) {
      try {
        setSavedNotes(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const getMonthYearKey = () => {
    return `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
  };

  const getSelectedDateKey = () => {
    return `${getMonthYearKey()}-${selectedDay}`;
  };

  useEffect(() => {
    if (selectedDay !== null) {
      const key = getSelectedDateKey();
      setNoteText(savedNotes[key] || "");
    } else {
      setNoteText("");
    }
  }, [selectedDay, currentDate, savedNotes]);

  const handleSaveNote = () => {
    if (selectedDay === null) return;
    const key = getSelectedDateKey();
    const updated = { ...savedNotes, [key]: noteText };
    localStorage.setItem("gemstoneOS_calendar_notes", JSON.stringify(updated));
    setSavedNotes(updated);
  };

  // Helper date builders
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(1);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(1);
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysGrid = [];
  // Fill blanks from previous month
  for (let i = 0; i < firstDayIndex; i++) {
    daysGrid.push(null);
  }
  // Fill current days
  for (let i = 1; i <= daysInMonth; i++) {
    daysGrid.push(i);
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden text-black font-sans bg-[#c0c0c0]" id="app-gem-calendar">
      {/* Left Pane: Calendar Grid */}
      <div className="flex-1 p-3 flex flex-col min-w-0 border-b md:border-b-0 md:border-r border-[#808080]">
        <div className="flex items-center justify-between mb-3 bg-[#dfdfdf] p-1.5 retro-border-inset shrink-0 select-none">
          <button onClick={prevMonth} className="retro-button !p-1 active:scale-[0.98]">
            <ChevronLeft size={13} />
          </button>
          
          <span className="text-xs font-bold font-sans text-stone-900 tracking-wider">
            {monthNames[month].toUpperCase()} {year}
          </span>
          
          <button onClick={nextMonth} className="retro-button !p-1 active:scale-[0.98]">
            <ChevronRight size={13} />
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 font-sans text-center text-[10px] font-bold text-gray-700 mb-1 select-none">
          <div>SUN</div>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
        </div>

        {/* Grid Days */}
        <div className="flex-1 grid grid-cols-7 gap-1 bg-white retro-border-inset p-1.5 select-none min-h-[140px]">
          {daysGrid.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="bg-gray-50/50" />;
            }

            const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
            const isSelected = selectedDay === day;
            const dKey = `${getMonthYearKey()}-${day}`;
            const hasNote = !!savedNotes[dKey];

            return (
              <button
                key={`day-${day}`}
                onClick={() => setSelectedDay(day)}
                className={`text-[11px] font-mono hover:bg-yellow-100 flex flex-col items-center justify-between p-1 rounded-sm relative ${
                  isSelected
                    ? "bg-[#000080] text-white hover:bg-[#000080]/90 font-bold"
                    : isToday
                    ? "border border-red-500 font-extrabold bg-[#dfdfdf]"
                    : "bg-[#dfdfdf] font-medium"
                }`}
              >
                <span>{day}</span>
                {hasNote && (
                  <span className={`w-1.5 h-1.5 rounded-full absolute bottom-1 right-1 ${isSelected ? "bg-yellow-300" : "bg-blue-800 animate-pulse"}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Pane: Day Diary Editor */}
      <div className="w-full md:w-52 p-3 flex flex-col min-h-[100px] md:min-h-0 select-none shrink-0">
        <div className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
          <Calendar size={12} className="text-blue-900" />
          <span>NOTES: {selectedDay ? `${monthNames[month]} ${selectedDay}` : "Select Day"}</span>
        </div>

        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          disabled={selectedDay === null}
          className="flex-1 w-full retro-input resize-none p-2 text-xs md:text-[11px] font-mono leading-tight bg-white select-text"
          placeholder={selectedDay !== null ? "Draft calendar logs or reminders here..." : "Choose a date to add notes."}
        />

        <button
          onClick={handleSaveNote}
          disabled={selectedDay === null}
          className="retro-button w-full mt-2.5 py-1.5 font-bold text-blue-950 flex items-center justify-center gap-1.5"
        >
          <Save size={12} />
          <span>Save Logs</span>
        </button>
      </div>
    </div>
  );
}
