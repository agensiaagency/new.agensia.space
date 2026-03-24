import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Mock events
  const events = [
    { id: 1, title: 'Kickoff Meeting', date: new Date().getDate(), type: 'meeting' },
    { id: 2, title: 'Design Review', date: new Date().getDate() + 2, type: 'deadline' },
    { id: 3, title: 'Launch', date: new Date().getDate() + 5, type: 'milestone' }
  ];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 }, (_, i) => i);

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-serif text-[#e8e4df] mb-2 flex items-center gap-3">
            <CalendarIcon className="text-[#c4a850]" /> Kalender
          </h1>
          <p className="text-[#a8b0c5] font-sans text-sm">Projektmeilensteine und Termine.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#c4a850] text-[#0a0f0d] rounded-md hover:brightness-110 transition-colors text-sm font-medium">
          <Plus size={16} /> Neuer Termin
        </button>
      </div>

      <div className="bg-[#141210] border border-[rgba(196,168,80,0.12)] rounded-xl overflow-hidden">
        {/* Calendar Header */}
        <div className="p-6 border-b border-[rgba(196,168,80,0.12)] flex justify-between items-center">
          <h2 className="text-2xl font-serif text-[#e8e4df]">
            {currentDate.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 border border-[rgba(196,168,80,0.2)] rounded-md text-[#e8e4df] hover:bg-[rgba(196,168,80,0.1)]">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextMonth} className="p-2 border border-[rgba(196,168,80,0.2)] rounded-md text-[#e8e4df] hover:bg-[rgba(196,168,80,0.1)]">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 border-b border-[rgba(196,168,80,0.12)] bg-[rgba(255,255,255,0.02)]">
          {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
            <div key={day} className="p-4 text-center text-sm font-medium text-[#888888]">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 auto-rows-fr">
          {blanks.map(b => (
            <div key={`blank-${b}`} className="min-h-[120px] p-2 border-r border-b border-[rgba(196,168,80,0.05)] bg-[#0a0f0d]/50" />
          ))}
          {days.map(day => {
            const dayEvents = events.filter(e => e.date === day);
            const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
            
            return (
              <div key={day} className={`min-h-[120px] p-2 border-r border-b border-[rgba(196,168,80,0.05)] hover:bg-[rgba(196,168,80,0.02)] transition-colors ${isToday ? 'bg-[rgba(196,168,80,0.05)]' : ''}`}>
                <div className={`text-sm font-medium mb-2 w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-[#c4a850] text-[#0a0f0d]' : 'text-[#a8b0c5]'}`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <div key={event.id} className="text-xs px-2 py-1 rounded bg-[rgba(196,168,80,0.1)] border border-[rgba(196,168,80,0.2)] text-[#c4a850] truncate cursor-pointer hover:bg-[#c4a850] hover:text-[#0a0f0d] transition-colors">
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}