import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, X } from 'lucide-react';

// Import Types
import { Student, Teacher, CalendarEvent, Expense } from './types';

// Import API (thay cho mockData)
import * as api from './api';

// Import Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import StudentsView from './components/StudentsView';
import TeachersView from './components/TeachersView';
import EventCalendarView from './components/EventCalendarView';
import FinanceView from './components/FinanceView';
import UserProfileView from './components/UserProfileView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Top level school records state (bắt đầu rỗng, fetch từ API khi mount)
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Loading / error state cho lần tải dữ liệu đầu tiên
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Sorted records alphabetically by name
  const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name));
  const sortedTeachers = [...teachers].sort((a, b) => a.name.localeCompare(b.name));

  // Cross-navigation selection overrides
  const [selectedStudentForView, setSelectedStudentForView] = useState<Student | null>(null);
  const [selectedTeacherForView, setSelectedTeacherForView] = useState<Teacher | null>(null);

  // Search input bound to specific views
  const [globalSearch, setGlobalSearch] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Undo deletion state
  const [undoToast, setUndoToast] = useState<{
    type: 'student' | 'teacher';
    item: Student | Teacher;
    originalIndex: number;
  } | null>(null);
  const [countdown, setCountdown] = useState<number>(5);

  // ===== Tải dữ liệu ban đầu từ API =====
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadError(null);
        const [studentsData, teachersData, eventsData, expensesData] = await Promise.all([
          api.getStudents(),
          api.getTeachers(),
          api.getEvents(),
          api.getExpenses(),
        ]);
        setStudents(studentsData);
        setTeachers(teachersData);
        setEvents(eventsData);
        setExpenses(expensesData);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu từ server:', err);
        setLoadError('Không thể kết nối tới server. Vui lòng kiểm tra lại API và thử tải lại trang.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!undoToast) return;
    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setUndoToast(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [undoToast]);

  // Reset search when tab changes
  useEffect(() => {
    setGlobalSearch('');
  }, [currentTab]);

  // ===== Undo xóa: tạo lại record thật trên server =====
  const handleUndo = async () => {
    if (!undoToast) return;
    const { type, item, originalIndex } = undoToast;
    setUndoToast(null);

    try {
      if (type === 'student') {
        const restored = item as Student;
        const saved = await api.createStudent(restored);
        setStudents(prev => {
          const copy = [...prev];
          copy.splice(originalIndex, 0, saved);
          return copy;
        });
      } else if (type === 'teacher') {
        const restored = item as Teacher;
        const saved = await api.createTeacher(restored);
        setTeachers(prev => {
          const copy = [...prev];
          copy.splice(originalIndex, 0, saved);
          return copy;
        });
      }
    } catch (err) {
      console.error('Lỗi khi khôi phục:', err);
    }
  };

  // ============ 1. Student Handlers ============
  const handleAddStudent = async (newStudent: Student) => {
    try {
      const saved = await api.createStudent(newStudent);
      setStudents(prev => [saved, ...prev]);
    } catch (err) {
      console.error('Lỗi khi thêm học sinh:', err);
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    // Optimistic update trước để UI phản hồi nhanh
    setStudents(prev => prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s)));
    try {
      const saved = await api.updateStudent(updatedStudent.id, updatedStudent);
      setStudents(prev => prev.map(s => (s.id === saved.id ? saved : s)));
    } catch (err) {
      console.error('Lỗi khi cập nhật học sinh:', err);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    const studentToDelete = students.find(s => s.id === id);
    if (!studentToDelete) return;
    const originalIndex = students.findIndex(s => s.id === id);

    // Xóa optimistic trên UI trước
    setStudents(prev => prev.filter(s => s.id !== id));
    setUndoToast({ type: 'student', item: studentToDelete, originalIndex });

    try {
      await api.deleteStudent(id);
    } catch (err) {
      console.error('Lỗi khi xóa học sinh:', err);
      // Rollback nếu API lỗi
      setStudents(prev => {
        const copy = [...prev];
        copy.splice(originalIndex, 0, studentToDelete);
        return copy;
      });
      setUndoToast(null);
    }
  };

  const handleDashboardStudentSelect = (student: Student) => {
    setSelectedStudentForView(student);
    setCurrentTab('students');
  };

  // ============ 2. Teacher Handlers ============
  const handleAddTeacher = async (newTeacher: Teacher) => {
    try {
      const saved = await api.createTeacher(newTeacher);
      setTeachers(prev => [saved, ...prev]);
    } catch (err) {
      console.error('Lỗi khi thêm giáo viên:', err);
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    const teacherToDelete = teachers.find(t => t.id === id);
    if (!teacherToDelete) return;
    const originalIndex = teachers.findIndex(t => t.id === id);

    setTeachers(prev => prev.filter(t => t.id !== id));
    setUndoToast({ type: 'teacher', item: teacherToDelete, originalIndex });

    try {
      await api.deleteTeacher(id);
    } catch (err) {
      console.error('Lỗi khi xóa giáo viên:', err);
      setTeachers(prev => {
        const copy = [...prev];
        copy.splice(originalIndex, 0, teacherToDelete);
        return copy;
      });
      setUndoToast(null);
    }
  };

  const handleDashboardTeacherSelect = (teacher: Teacher) => {
    setSelectedTeacherForView(teacher);
    setCurrentTab('teachers');
  };

  // ============ 3. Event Handlers ============
  const handleAddEvent = async (newEvent: CalendarEvent) => {
    try {
      const saved = await api.createEvent(newEvent);
      setEvents(prev => [saved, ...prev]);
    } catch (err) {
      console.error('Lỗi khi thêm sự kiện:', err);
    }
  };

  // ============ 4. Expense Handlers ============
  const handleAddExpense = async (newExpense: Expense) => {
    try {
      const saved = await api.createExpense(newExpense);
      setExpenses(prev => [saved, ...prev]);
    } catch (err) {
      console.error('Lỗi khi thêm chi tiêu:', err);
    }
  };

  // Map view titles
  const getHeaderTitle = () => {
    switch (currentTab) {
      case 'dashboard': return 'Dashboard';
      case 'students': return 'Students';
      case 'teachers': return 'Teachers';
      case 'event': return 'Events & Calendar';
      case 'finance': return 'School Finance';
      case 'user': return 'User Dashboard';
      case 'activity': return 'Recent Activities';
      default: return 'School Portal';
    }
  };

  // ===== Màn hình loading khi đang tải dữ liệu lần đầu =====
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFF5F1]">
        <span className="text-[#FF5BAE] font-bold text-sm">Đang tải dữ liệu...</span>
      </div>
    );
  }

  // ===== Màn hình báo lỗi nếu không kết nối được API =====
  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF5F1] gap-4 p-8 text-center">
        <span className="text-[#2D2D2D] font-bold">{loadError}</span>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-[#FF5BAE] hover:bg-[#FF5BAE]/90 rounded-full text-sm font-bold text-white transition-colors shadow-md"
        >
          Tải lại trang
        </button>
      </div>
    );
  }

  return (
    <div className="flex bg-[#FFF5F1] min-h-screen text-[#2D2D2D] font-sans relative">
      
      {/* Sidebar navigation */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content scrollable container offset by sidebar */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen w-full overflow-x-hidden">
        
        {/* Page Top Header */}
        <Header 
          title={getHeaderTitle()} 
          searchValue={globalSearch}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onSearchChange={(val) => {
            setGlobalSearch(val);
            // Propagate search internally depending on active tab
          }}
          onNotificationClick={() => setCurrentTab('activity')}
          onProfileClick={() => setCurrentTab('user')}
          onSettingsClick={() => setCurrentTab('user')}
        />

        {/* Primary Views Content with motion transitions */}
        <main className="flex-1 pb-12">
          <AnimatePresence mode="wait">
            {currentTab === 'dashboard' && (
              <DashboardView 
                key="dashboard"
                students={sortedStudents}
                teachers={sortedTeachers}
                events={events}
                onNavigateToTab={setCurrentTab}
                onSelectStudent={handleDashboardStudentSelect}
                onSelectTeacher={handleDashboardTeacherSelect}
              />
            )}

            {currentTab === 'students' && (
              <StudentsView 
                key="students"
                students={sortedStudents}
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
                selectedStudentFromParent={selectedStudentForView}
                clearSelectedStudent={() => setSelectedStudentForView(null)}
                searchTerm={globalSearch}
                onSearchChange={setGlobalSearch}
              />
            )}

            {currentTab === 'teachers' && (
              <TeachersView 
                key="teachers"
                teachers={sortedTeachers}
                onAddTeacher={handleAddTeacher}
                onDeleteTeacher={handleDeleteTeacher}
                selectedTeacherFromParent={selectedTeacherForView}
                clearSelectedTeacher={() => setSelectedTeacherForView(null)}
                searchTerm={globalSearch}
                onSearchChange={setGlobalSearch}
              />
            )}

            {currentTab === 'event' && (
              <EventCalendarView 
                key="event"
                events={events}
                onAddEvent={handleAddEvent}
              />
            )}

            {currentTab === 'finance' && (
              <FinanceView 
                key="finance"
                expenses={expenses}
                students={sortedStudents}
                onAddExpense={handleAddExpense}
                searchTerm={globalSearch}
                onSearchChange={setGlobalSearch}
              />
            )}

            {currentTab === 'user' && (
              <UserProfileView key="user" />
            )}

            {currentTab === 'activity' && (
              <motion.div 
                key="activity"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-8 space-y-6 max-w-4xl"
              >
                <div className="bg-white p-7 rounded-3xl shadow-sm border border-[#FFE4D6]/50">
                  <h3 className="text-xl font-bold text-[#2D2D2D] mb-6 font-display">Institution Live Logs</h3>
                  <div className="relative border-l-2 border-[#FF5BAE]/20 pl-6 ml-2 space-y-8">
                    {[
                      { actor: 'Karen Hope', desc: 'has enrolled and paid first tuition fees on', target: 'Admission Desk', date: 'July 03, 2026', time: '10:15 AM', type: 'admit' },
                      { actor: 'Lucy Bradley', desc: 'scheduled a new class session for', target: 'Basic Algorithm', date: 'July 03, 2026', time: '09:00 AM', type: 'schedule' },
                      { actor: 'Diana Bennett', desc: 'updated curriculum bio documents for', target: 'Art Class Department', date: 'July 02, 2026', time: '04:45 PM', type: 'update' },
                      { actor: 'Thomas House', desc: 'recorded scientific supplies bill of $1,200 inside', target: 'Finance Ledger', date: 'July 02, 2026', time: '02:30 PM', type: 'finance' },
                      { actor: 'Samantha William', desc: 'sent an instant coordinate request regarding', target: 'Mathematics Homework', date: 'July 02, 2026', time: '11:00 AM', type: 'chat' }
                    ].map((act, idx) => (
                      <div key={idx} className="relative">
                        <span className="absolute -left-[31px] top-1 w-4.5 h-4.5 bg-[#70D6FF] border-4 border-white rounded-full"></span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#2D2D2D]">{act.actor}</span>
                          <span className="text-xs text-[#7A7A7A] font-medium">{act.desc}</span>
                          <span className="text-xs font-bold text-[#FF5BAE] bg-[#FF5BAE]/10 px-2.5 py-1 rounded-full">{act.target}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold mt-1.5 block">
                          {act.date} at {act.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {undoToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[9999] bg-[#2D2D2D] text-white p-4 rounded-2xl shadow-xl flex items-center justify-between gap-5 border border-white/10 w-[360px]"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-white/60 uppercase font-extrabold tracking-wider">
                {undoToast.type === 'student' ? 'Student Deleted' : 'Teacher Deleted'}
              </span>
              <span className="text-sm font-bold truncate max-w-[200px]">
                {undoToast.item.name}
              </span>
            </div>
            
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleUndo}
                className="flex items-center gap-1.5 bg-[#FF5BAE] hover:bg-[#FF5BAE]/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Undo ({countdown}s)
              </button>
              <button
                onClick={() => setUndoToast(null)}
                className="text-white/40 hover:text-white/80 p-1.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}