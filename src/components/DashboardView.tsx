import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  MoreHorizontal, 
  Plus
} from 'lucide-react';
import { Student, Teacher, CalendarEvent } from '../types';

interface DashboardViewProps {
  key?: React.Key;
  students: Student[];
  teachers: Teacher[];
  events: CalendarEvent[];
  onNavigateToTab: (tabId: string) => void;
  onSelectStudent: (student: Student) => void;
  onSelectTeacher: (teacher: Teacher) => void;
}

export default function DashboardView({
  students,
  teachers,
  events,
  onNavigateToTab,
  onSelectStudent,
  onSelectTeacher
}: DashboardViewProps) {
  // Month navigation for mini calendar widget
  const today = new Date();
  const [currentCalendarYear, setCurrentCalendarYear] = useState(today.getFullYear());
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(today.getMonth()); // (0-indexed)

  // Calendar dates matching March 2021 or July 2026
  // July 2026 starts on Wednesday
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentCalendarYear, currentCalendarMonth);
  const firstDay = getFirstDayOfMonth(currentCalendarYear, currentCalendarMonth);

  const prevMonth = () => {
    if (currentCalendarMonth === 0) {
      setCurrentCalendarMonth(11);
      setCurrentCalendarYear(currentCalendarYear - 1);
    } else {
      setCurrentCalendarMonth(currentCalendarMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentCalendarMonth === 11) {
      setCurrentCalendarMonth(0);
      setCurrentCalendarYear(currentCalendarYear + 1);
    } else {
      setCurrentCalendarMonth(currentCalendarMonth + 1);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="p-8 space-y-8"
    >
      {/* 1. Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat 1 */}
        <div id="stat-students" className="bg-white rounded-[2rem] p-6 shadow-xl border-b-8 border-[#70D6FF] flex items-center gap-6 hover:scale-[1.02] transition-transform duration-200">
          <div className="w-14 h-14 bg-[#70D6FF]/20 rounded-2xl flex items-center justify-center text-[#70D6FF] flex-shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <span className="text-3xl font-black text-[#2D2D2D] tracking-tight block">{students.length}</span>
            <span className="text-xs font-black text-gray-400 uppercase tracking-tighter">Students</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div id="stat-teachers" className="bg-white rounded-[2rem] p-6 shadow-xl border-b-8 border-[#FF5BAE] flex items-center gap-6 hover:scale-[1.02] transition-transform duration-200">
          <div className="w-14 h-14 bg-[#FF5BAE]/20 rounded-2xl flex items-center justify-center text-[#FF5BAE] flex-shrink-0">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <span className="text-3xl font-black text-[#2D2D2D] tracking-tight block">{teachers.length}</span>
            <span className="text-xs font-black text-gray-400 uppercase tracking-tighter">Teachers</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div id="stat-events" className="bg-white rounded-[2rem] p-6 shadow-xl border-b-8 border-[#FFD21E] flex items-center gap-6 hover:scale-[1.02] transition-transform duration-200">
          <div className="w-14 h-14 bg-[#FFD21E]/20 rounded-2xl flex items-center justify-center text-[#FFD21E] flex-shrink-0">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <span className="text-3xl font-black text-[#2D2D2D] tracking-tight block">{events.length}</span>
            <span className="text-xs font-black text-gray-400 uppercase tracking-tighter">Events</span>
          </div>
        </div>
      </div>

      {/* 2. Grid Dashboard Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Performance, mini widgets, list of unpaid tuition */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* B. Two Column Widget (Mini Calendar + Mini Finance bar chart) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* School Calendar widget */}
            <div className="bg-white p-6 rounded-[2rem] shadow-xl border-2 border-[#FFE4D6]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-[#2D2D2D] font-display">School Calendar</h3>
                <div className="flex items-center gap-1 text-[#2D2D2D]">
                  <button onClick={prevMonth} className="p-1 hover:bg-[#FFE4D6]/50 rounded-full transition-colors">
                    <ChevronLeft className="w-5 h-5 text-[#FF5BAE]" />
                  </button>
                  <span className="text-xs font-black font-display px-2 uppercase tracking-wide">
                    {monthNames[currentCalendarMonth]} {currentCalendarYear}
                  </span>
                  <button onClick={nextMonth} className="p-1 hover:bg-[#FFE4D6]/50 rounded-full transition-colors">
                    <ChevronRight className="w-5 h-5 text-[#FF5BAE]" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-y-1 text-center">
                {daysOfWeek.map(d => (
                  <span key={d} className="text-xs font-black text-gray-400 py-2 uppercase tracking-tighter">{d}</span>
                ))}
                
                {/* Empty slots for starting offset */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2"></div>
                ))}

                {/* Day numbers */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  // Hardcode some active event dots on days matching our events dataset or random
                  const hasPurpleEvent = dayNum === 6 || dayNum === 9;
                  const hasOrangeEvent = dayNum === 6 || dayNum === 15;
                  const hasYellowEvent = dayNum === 8 || dayNum === 20;
                  const hasGreenEvent = dayNum === 10 || dayNum === 24;
                  
                  const isDayToday = dayNum === today.getDate() && currentCalendarMonth === today.getMonth() && currentCalendarYear === today.getFullYear();
                  
                  return (
                    <button 
                      key={`day-${dayNum}`}
                      className={`p-2 relative hover:bg-[#FF5BAE]/5 rounded-xl text-xs font-black text-[#2D2D2D] flex flex-col items-center justify-center h-10 w-10 mx-auto transition-colors ${
                        isDayToday ? 'bg-[#FF5BAE] text-white hover:bg-[#FF5BAE]/90 shadow-md scale-105' : ''
                      }`}
                      onClick={() => onNavigateToTab('event')}
                    >
                      <span>{dayNum}</span>
                      {/* Dots */}
                      <div className="flex gap-0.5 justify-center mt-0.5 absolute bottom-1">
                        {hasPurpleEvent && <span className="w-1 h-1 bg-[#FF5BAE] rounded-full"></span>}
                        {hasOrangeEvent && <span className="w-1 h-1 bg-[#FF9B71] rounded-full"></span>}
                        {hasYellowEvent && <span className="w-1 h-1 bg-[#FFD21E] rounded-full"></span>}
                        {hasGreenEvent && <span className="w-1 h-1 bg-[#70D6FF] rounded-full"></span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* School Finance Bar Chart */}
            <div className="bg-white p-6 rounded-[2rem] shadow-xl border-2 border-[#FFE4D6] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-[#2D2D2D] font-display">School Finance</h3>
                <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-wider">
                  <span className="flex items-center gap-1 text-[#FF5BAE]">
                    <span className="w-2.5 h-2.5 bg-[#FF5BAE] rounded-full"></span> This Week
                  </span>
                  <span className="flex items-center gap-1 text-[#FFD21E]">
                    <span className="w-2.5 h-2.5 bg-[#FFD21E] rounded-full"></span> Last Week
                  </span>
                </div>
              </div>

              {/* Custom SVG Bar Chart */}
              <div className="h-40 w-full relative mt-2 flex items-end justify-between px-2">
                {/* 100% 75% 50% lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[8px] text-slate-200">
                  <div className="border-b border-[#FFE4D6] w-full h-0"></div>
                  <div className="border-b border-[#FFE4D6] w-full h-0"></div>
                  <div className="border-b border-[#FFE4D6] w-full h-0"></div>
                  <div className="border-b border-[#FFE4D6] w-full h-0"></div>
                </div>

                {/* Days bars */}
                {[
                  { day: 'Mon', line1: 60, line2: 40 },
                  { day: 'Tue', line1: 85, line2: 60 },
                  { day: 'Wed', line1: 75, line2: 95 },
                  { day: 'Thu', line1: 90, line2: 70 },
                  { day: 'Fri', line1: 55, line2: 45 },
                  { day: 'Sat', line1: 40, line2: 30 },
                  { day: 'Sun', line1: 70, line2: 80 },
                ].map((item, idx) => (
                  <div key={item.day} className="flex flex-col items-center gap-2 z-10 w-full">
                    {/* The double bar */}
                    <div className="flex items-end gap-1.5 h-28 w-full justify-center">
                      {/* Bar 1: Pink */}
                      <div 
                        className="w-2.5 rounded-t-full bg-[#FF5BAE] transition-all duration-500 hover:scale-x-110 cursor-pointer relative group" 
                        style={{ height: `${item.line1}%` }}
                      >
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#2D2D2D] text-[#FFD21E] text-[9px] px-1.5 py-0.5 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-black">
                          ${item.line1 * 100}
                        </span>
                      </div>
                      {/* Bar 2: Yellow */}
                      <div 
                        className="w-2.5 rounded-t-full bg-[#FFD21E] transition-all duration-500 hover:scale-x-110 cursor-pointer relative group" 
                        style={{ height: `${item.line2}%` }}
                      >
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#2D2D2D] text-white text-[9px] px-1.5 py-0.5 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-black">
                          ${item.line2 * 100}
                        </span>
                      </div>
                    </div>
                    {/* Day text */}
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* C. Unpaid Student Tuition Table */}
          <div className="bg-white p-7 rounded-[2rem] shadow-xl border-2 border-[#FFE4D6]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-[#2D2D2D] font-display">Unpaid Student Tuition</h3>
              <button 
                onClick={() => onNavigateToTab('finance')}
                className="text-xs font-black text-[#FF5BAE] uppercase tracking-wider hover:underline"
              >
                View Analytics
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#FFE4D6]">
                    <th className="pb-4 text-xs font-black text-gray-400 tracking-wider uppercase">Name</th>
                    <th className="pb-4 text-xs font-black text-gray-400 tracking-wider uppercase">ID</th>
                    <th className="pb-4 text-xs font-black text-gray-400 tracking-wider uppercase">Class</th>
                    <th className="pb-4 text-xs font-black text-gray-400 tracking-wider uppercase">Amount</th>
                    <th className="pb-4 text-xs font-black text-gray-400 tracking-wider uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FFE4D6]/40">
                  {students.filter(student => student.status !== 'Complete').slice(0, 5).map((student) => (
                    <tr key={student.id} className="hover:bg-[#FFF5F1]/30 transition-colors group">
                      {/* Name with initials avatar */}
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#FF5BAE]/10 text-[#FF5BAE] flex items-center justify-center font-black text-xs">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 
                              onClick={() => onSelectStudent(student)}
                              className="text-sm font-black text-[#2D2D2D] hover:text-[#FF5BAE] cursor-pointer transition-colors"
                            >
                              {student.name}
                            </h4>
                          </div>
                        </div>
                      </td>
                      {/* ID */}
                      <td className="py-4 text-sm font-black text-[#FF5BAE]">{student.id}</td>
                      {/* Class */}
                      <td className="py-4">
                        <span className="text-xs font-black px-3 py-1.5 bg-[#FF9B71]/10 text-[#FF9B71] border border-[#FF9B71]/20 rounded-full">
                          Class {student.grade}
                        </span>
                      </td>
                      {/* Amount */}
                      <td className="py-4 font-black text-[#2D2D2D]">${student.tuitionFee.toLocaleString()}</td>
                      {/* Action buttons */}
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-[#7A7A7A] hover:text-[#FF5BAE] hover:bg-[#FF5BAE]/5 rounded-full transition-colors">
                            <Printer className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-[#7A7A7A] hover:text-[#FF5BAE] hover:bg-[#FF5BAE]/5 rounded-full transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Recent Students, Chat snippets, Foods */}
        <div className="space-y-8">
          
          {/* A. Recent Students */}
          <div className="bg-white p-6 rounded-[2rem] shadow-xl border-2 border-[#FFE4D6]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-[#2D2D2D] font-display">Recent Students</h3>
              <button 
                onClick={() => onNavigateToTab('students')}
                className="w-8 h-8 bg-[#FF5BAE] text-white rounded-full flex items-center justify-center hover:bg-[#FF5BAE]/90 transition-colors shadow-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {students.slice(0, 5).map((student) => (
                <div 
                  key={student.id} 
                  className="flex items-center justify-between p-2 rounded-2xl hover:bg-[#FFF5F1]/50 transition-colors cursor-pointer group"
                  onClick={() => onSelectStudent(student)}
                >
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-xs text-[#2D2D2D] border border-slate-200">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#2D2D2D] group-hover:text-[#FF5BAE] transition-colors">{student.name}</h4>
                      <span className="text-xs text-[#7A7A7A] font-bold">Class {student.grade}</span>
                    </div>
                  </div>
                  <button className="p-2 bg-[#FFE4D6]/50 text-[#FF5BAE] group-hover:bg-[#FF5BAE] group-hover:text-white rounded-full transition-all border border-[#FFE4D6]/40">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={() => onNavigateToTab('students')}
              className="w-full mt-6 py-3.5 bg-[#FF5BAE]/10 text-[#FF5BAE] font-black text-xs uppercase tracking-wider rounded-full hover:bg-[#FF5BAE]/20 transition-colors"
            >
              View More
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
