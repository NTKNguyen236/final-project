import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  BookOpen,
  MapPin,
  CalendarDays
} from 'lucide-react';
import { CalendarEvent } from '../types';

interface EventCalendarViewProps {
  key?: React.Key;
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
}

export default function EventCalendarView({ events, onAddEvent }: EventCalendarViewProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDateStr, setSelectedDateStr] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  ); // default selection today
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add Event Form States
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Programming',
    startTime: '09.00',
    endTime: '10.00 AM',
    color: 'purple' as 'purple' | 'orange' | 'yellow' | 'green' | 'red',
    teacherName: ''
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOffset = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Filter events scheduled for the currently selected date
  const selectedDayEvents = events.filter(e => e.date === selectedDateStr);

  // Form Submission
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: CalendarEvent = {
      id: `ev-${Date.now()}`,
      title: formData.title,
      subject: formData.subject,
      date: selectedDateStr,
      startTime: formData.startTime,
      endTime: formData.endTime,
      color: formData.color,
      teacherName: formData.teacherName || 'Academy Instructor'
    };
    onAddEvent(newEvent);
    setIsAddModalOpen(false);
    // Reset Form
    setFormData({
      title: '',
      subject: 'Programming',
      startTime: '09.00',
      endTime: '10.00 AM',
      color: 'purple',
      teacherName: ''
    });
  };

  const colorClasses = {
    purple: { bg: 'bg-[#FF5BAE]/10', text: 'text-[#FF5BAE]', border: 'border-[#FF5BAE]', fill: 'bg-[#FF5BAE]' },
    orange: { bg: 'bg-[#FF9B71]/10', text: 'text-[#FF9B71]', border: 'border-[#FF9B71]', fill: 'bg-[#FF9B71]' },
    yellow: { bg: 'bg-[#FFD21E]/10', text: 'text-[#FFD21E]', border: 'border-[#FFD21E]', fill: 'bg-[#FFD21E]' },
    green: { bg: 'bg-[#70D6FF]/10', text: 'text-[#70D6FF]', border: 'border-[#70D6FF]', fill: 'bg-[#70D6FF]' },
    red: { bg: 'bg-[#ff5b5b]/10', text: 'text-[#ff5b5b]', border: 'border-[#ff5b5b]', fill: 'bg-[#ff5b5b]' },
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-8"
    >
      
      {/* 1. Left Calendar Grid panel (span 2 on desktop) */}
      <div className="xl:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-[#FFE4D6]/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-bold text-[#2D2D2D] font-display">Calendar Schedule</h3>
            <p className="text-xs text-[#7A7A7A] font-semibold mt-1">Click a day to view or schedule events</p>
          </div>
          
          {/* Month control */}
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-xl text-[#2D2D2D] transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h4 className="text-[#FF5BAE]ase font-extrabold text-[#2D2D2D] font-display w-36 text-center">
              {monthNames[currentMonth]} {currentYear}
            </h4>
            <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-xl text-[#2D2D2D] transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 7-column Calendar Header */}
        <div className="grid grid-cols-7 gap-y-4 text-center border-b border-[#FFE4D6] pb-4 mb-4">
          {daysOfWeek.map(d => (
            <span key={d} className="text-sm font-bold text-[#7A7A7A]">{d}</span>
          ))}
        </div>

        {/* Calendar Day Grid Cells */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day offset empty elements */}
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={`empty-cell-${i}`} className="aspect-square p-2 border border-[#FFE4D6]/50/20 bg-[#FFF5F1]/10 rounded-2xl"></div>
          ))}

          {/* Actual day grids */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            // Format date string to check events
            const monthStr = String(currentMonth + 1).padStart(2, '0');
            const dayStr = String(dayNum).padStart(2, '0');
            const dateKey = `${currentYear}-${monthStr}-${dayStr}`;

            const isSelected = selectedDateStr === dateKey;
            
            // Collect events on this day
            const dayEvents = events.filter(ev => ev.date === dateKey);

            return (
              <button
                key={`day-btn-${dayNum}`}
                onClick={() => setSelectedDateStr(dateKey)}
                className={`aspect-square p-3 rounded-2xl border flex flex-col justify-between items-start transition-all relative ${
                  isSelected 
                    ? 'border-[#FF5BAE] bg-[#FF5BAE]/5 shadow-sm font-bold' 
                    : 'border-[#FFE4D6] hover:border-[#FF5BAE]/30 bg-white hover:bg-[#FF5BAE]/2 font-semibold'
                }`}
              >
                {/* Day label */}
                <span className={`text-sm ${isSelected ? 'text-[#FF5BAE] font-extrabold' : 'text-[#2D2D2D]'}`}>
                  {dayNum}
                </span>

                {/* Day events tiny blocks or labels */}
                <div className="w-full space-y-1 overflow-hidden mt-1 max-h-12">
                  {dayEvents.slice(0, 2).map(ev => (
                    <div 
                      key={ev.id} 
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate ${colorClasses[ev.color].bg} ${colorClasses[ev.color].text}`}
                    >
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[8px] font-bold text-[#7A7A7A] pl-1">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Right Scheduled Events list panel */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#FFE4D6]/50 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-[#FFE4D6] pb-5 mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#2D2D2D] font-display">Schedule Details</h3>
              <span className="text-xs text-[#7A7A7A] font-semibold mt-1 block">
                {new Date(selectedDateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            {/* Quick Add Event action */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-10 h-10 bg-[#FF9B71] hover:bg-[#FF9B71]/90 text-white rounded-full flex items-center justify-center transition-all shadow-md flex-shrink-0"
              title="Add Event to Day"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* List of events on this selected date */}
          <div className="space-y-4">
            {selectedDayEvents.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-medium">
                <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm">No classes scheduled on this day.</p>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-3 text-xs font-bold text-[#FF9B71] hover:underline"
                >
                  Create first class
                </button>
              </div>
            ) : (
              selectedDayEvents.map((ev) => {
                const colors = colorClasses[ev.color];
                return (
                  <motion.div
                    key={ev.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-5 border-l-4 ${colors.border} rounded-r-2xl bg-[#FFF5F1] border border-[#FFE4D6] flex flex-col gap-3 relative hover:shadow-sm transition-all`}
                  >
                    <div>
                      {/* Subject tag */}
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                        {ev.subject}
                      </span>
                      {/* Title */}
                      <h4 className="text-[#FF5BAE]ase font-bold text-[#2D2D2D] mt-2.5 font-display">{ev.title}</h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 border-t border-slate-200/50 text-xs font-semibold text-[#7A7A7A]">
                      {/* Time */}
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {ev.startTime} - {ev.endTime}
                      </span>
                      {/* Teacher */}
                      <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-slate-400" />
                        {ev.teacherName}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Informative tips box */}
        <div className="mt-8 p-4 bg-[#FF5BAE]/5 rounded-2xl border border-[#FF5BAE]/10 text-[#FF5BAE] text-xs font-medium leading-relaxed">
          <strong>Tip:</strong> Schedule classes by selecting any calendar date cell on the left grid, then click the orange (+) button. Classes will be displayed in the live curriculum track.
        </div>
      </div>

      {/* 3. Add Event Popup Modal Dialog */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-[#FF5BAE] text-white p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[#FF5BAE]ase font-bold font-display">Schedule Class</h3>
                    <p className="text-white/60 text-[10px] mt-0.5">Date: {selectedDateStr}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wide block mb-1">Class / Event Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Basic Algorithm"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5BAE] text-sm text-[#2D2D2D]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wide block mb-1">Subject *</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5BAE] text-sm text-[#2D2D2D] bg-white"
                    >
                      <option value="Programming">Programming</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Science">Science</option>
                      <option value="Art">Art</option>
                      <option value="Biology">Biology</option>
                      <option value="History">History</option>
                      <option value="English">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wide block mb-1">Color Accent *</label>
                    <select
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value as any })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5BAE] text-sm text-[#2D2D2D] bg-white font-bold"
                    >
                      <option value="purple" className="text-[#FF5BAE] font-bold">Purple</option>
                      <option value="orange" className="text-[#FF9B71] font-bold">Orange</option>
                      <option value="yellow" className="text-[#FFD21E] font-bold">Yellow</option>
                      <option value="green" className="text-[#70D6FF] font-bold">Green</option>
                      <option value="red" className="text-[#ff5b5b] font-bold">Red</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wide block mb-1">Start Time *</label>
                    <input
                      type="text"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      placeholder="e.g. 09.00"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-[#2D2D2D]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wide block mb-1">End Time *</label>
                    <input
                      type="text"
                      required
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      placeholder="e.g. 10.00 AM"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-[#2D2D2D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wide block mb-1">Teacher *</label>
                  <input
                    type="text"
                    required
                    value={formData.teacherName}
                    onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                    placeholder="e.g. Lula Beatrice"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-[#2D2D2D]"
                  />
                </div>

                {/* Footer buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#FFE4D6]">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-bold text-[#2D2D2D]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#FF5BAE] hover:bg-[#FF5BAE]/90 text-white rounded-full text-xs font-bold shadow-md transition-all"
                  >
                    Save Event
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
