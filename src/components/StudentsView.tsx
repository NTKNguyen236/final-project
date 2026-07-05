import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  UserPlus, 
  X,
  Check,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Student } from '../types';

interface StudentsViewProps {
  key?: React.Key;
  students: Student[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  selectedStudentFromParent: Student | null;
  clearSelectedStudent: () => void;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
}

export default function StudentsView({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  selectedStudentFromParent,
  clearSelectedStudent,
  searchTerm: parentSearchTerm,
  onSearchChange: parentOnSearchChange
}: StudentsViewProps) {
  // Search state
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTerm = parentSearchTerm !== undefined ? parentSearchTerm : localSearchTerm;
  const setSearchTerm = (val: string) => {
    if (parentOnSearchChange) {
      parentOnSearchChange(val);
    } else {
      setLocalSearchTerm(val);
    }
  };
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected checkbox states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Status dropdown toggle state
  const [activeStatusMenu, setActiveStatusMenu] = useState<string | null>(null);

  // Add form fields
  const [formData, setFormData] = useState({
    name: '',
    parentName: '',
    grade: 'VII A',
    city: 'New York',
    phone: '',
    email: '',
    status: 'Complete' as 'Complete' | 'Pending' | 'Canceled',
    tuitionFee: 50036
  });

  // Handle selected student from Dashboard click
  React.useEffect(() => {
    if (selectedStudentFromParent) {
      setViewingStudent(selectedStudentFromParent);
      clearSelectedStudent();
    }
  }, [selectedStudentFromParent, clearSelectedStudent]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const suggestedStudents = searchTerm.trim().length > 0 
    ? students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.parentName.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);

  const toggleSelectAll = () => {
    if (selectedIds.length === currentStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentStudents.map(s => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: `#123456${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      parentName: formData.parentName,
      grade: formData.grade,
      city: formData.city,
      phone: formData.phone || '+12 345 6789 0',
      email: formData.email || 'student@mail.com',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: formData.status,
      tuitionFee: formData.tuitionFee
    };
    onAddStudent(newStudent);
    setIsAddModalOpen(false);
    // Reset form
    setFormData({
      name: '',
      parentName: '',
      grade: 'VII A',
      city: 'New York',
      phone: '',
      email: '',
      status: 'Complete',
      tuitionFee: 50036
    });
  };

  const handleStatusChange = (student: Student, newStatus: 'Complete' | 'Pending' | 'Canceled') => {
    let updatedHistory = student.paymentHistory ? [...student.paymentHistory] : [];
    
    if (student.status === 'Canceled' && newStatus === 'Complete') {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const logMsg = `Status changed from Overdue to Paid on ${dateStr} at ${timeStr}`;
      updatedHistory.push(logMsg);
    }

    const updatedStudent: Student = {
      ...student,
      status: newStatus,
      paymentHistory: updatedHistory
    };

    onUpdateStudent(updatedStudent);
    if (viewingStudent && viewingStudent.id === student.id) {
      setViewingStudent(updatedStudent);
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
      {/* Search and action bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="w-5 h-5 text-[#7A7A7A]" />
          </span>
          <input
            id="student-search"
            type="text"
            placeholder="Search student by name, ID, parent..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // Delay to allow clicking on a suggestion
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            className="w-full pl-12 pr-4 py-3 bg-white border border-transparent rounded-full shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5BAE] text-[#2D2D2D] placeholder-[#7A7A7A]"
          />
          
          {showSuggestions && suggestedStudents.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white border border-[#FFE4D6] rounded-2xl shadow-xl z-50 max-h-64 overflow-y-auto divide-y divide-[#FFE4D6]/40">
              {suggestedStudents.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onMouseDown={() => {
                    setSearchTerm(s.name);
                    setCurrentPage(1);
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-[#FFF5F1] transition-colors flex flex-col gap-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#2D2D2D]">
                      {highlightText(s.name, searchTerm)}
                    </span>
                    <span className="text-xs font-black text-[#FF5BAE]">
                      {highlightText(s.id, searchTerm)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium">
                    <span>Parent: {s.parentName}</span>
                    <span className="bg-[#FF9B71]/10 text-[#FF9B71] px-2 py-0.5 rounded-full font-bold">
                      {s.grade}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Add Student Button */}
        <button
          id="add-student-btn"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#FF5BAE] text-white rounded-full font-bold text-sm shadow-md hover:bg-[#FF5BAE]/90 transition-all flex-shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>New Student</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#FFE4D6]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#FFE4D6] bg-[#FFF5F1]/20">
                <th className="py-5 px-6 w-12">
                  <input
                    type="checkbox"
                    checked={currentStudents.length > 0 && selectedIds.length === currentStudents.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-[#FF5BAE] focus:ring-[#FF5BAE] border-slate-300"
                  />
                </th>
                <th className="py-5 px-4 text-xs font-extrabold text-[#7A7A7A] tracking-wider uppercase">Name</th>
                <th className="py-5 px-4 text-xs font-extrabold text-[#7A7A7A] tracking-wider uppercase">ID</th>
                <th className="py-5 px-4 text-xs font-extrabold text-[#7A7A7A] tracking-wider uppercase">Date</th>
                <th className="py-5 px-4 text-xs font-extrabold text-[#7A7A7A] tracking-wider uppercase">Parent Name</th>
                <th className="py-5 px-4 text-xs font-extrabold text-[#7A7A7A] tracking-wider uppercase">City</th>
                <th className="py-5 px-4 text-xs font-extrabold text-[#7A7A7A] tracking-wider uppercase">Contact</th>
                <th className="py-5 px-4 text-xs font-extrabold text-[#7A7A7A] tracking-wider uppercase">Grade</th>
                <th className="py-5 px-4 text-xs font-extrabold text-[#7A7A7A] tracking-wider uppercase">Tuition Status</th>
                <th className="py-5 px-6 text-xs font-extrabold text-[#7A7A7A] tracking-wider uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFE4D6]/40">
              {currentStudents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 font-medium">
                    No students found matching search criteria.
                  </td>
                </tr>
              ) : (
                currentStudents.map((student) => {
                  const isChecked = selectedIds.includes(student.id);
                  const initials = student.name.split(' ').map(n => n[0]).join('');
                  return (
                    <tr key={student.id} className="hover:bg-[#FF5BAE]/5 transition-colors group">
                      {/* Checkbox */}
                      <td className="py-4 px-6">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectOne(student.id)}
                          className="w-4 h-4 rounded text-[#FF5BAE] focus:ring-[#FF5BAE] border-slate-300"
                        />
                      </td>

                      {/* Name with initials avatar */}
                      <td className="py-4 px-4 font-bold text-[#2D2D2D]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#FF5BAE]/10 text-[#FF5BAE] flex items-center justify-center text-xs font-bold font-display">
                            {initials}
                          </div>
                          <div>
                            <span 
                              onClick={() => setViewingStudent(student)}
                              className="hover:text-[#FF5BAE] cursor-pointer transition-colors block"
                            >
                              {student.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* ID */}
                      <td className="py-4 px-4 text-sm font-bold text-[#FF5BAE]">{student.id}</td>

                      {/* Date */}
                      <td className="py-4 px-4 text-xs font-medium text-[#7A7A7A]">{student.date}</td>

                      {/* Parent Name */}
                      <td className="py-4 px-4 text-sm text-[#2D2D2D] font-semibold">{student.parentName}</td>

                      {/* City */}
                      <td className="py-4 px-4 text-sm text-[#2D2D2D] font-semibold">{student.city}</td>

                      {/* Contact Actions */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <a href={`tel:${student.phone}`} className="p-2 bg-slate-100 hover:bg-[#FF5BAE] hover:text-white rounded-full text-slate-400 transition-colors">
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a href={`mailto:${student.email}`} className="p-2 bg-slate-100 hover:bg-[#FF5BAE] hover:text-white rounded-full text-slate-400 transition-colors">
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      {/* Grade tag */}
                      <td className="py-4 px-4">
                        <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full inline-block ${
                          student.grade.includes('A') 
                            ? 'bg-[#FF9B71]/10 text-[#FF9B71]' 
                            : student.grade.includes('B') 
                              ? 'bg-[#FFD21E]/10 text-[#FFD21E]' 
                              : 'bg-[#70D6FF]/10 text-[#70D6FF]'
                        }`}>
                          {student.grade}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveStatusMenu(activeStatusMenu === student.id ? null : student.id);
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold transition-all hover:scale-105 active:scale-95 cursor-pointer border select-none ${
                            student.status === 'Complete' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' 
                              : student.status === 'Pending' 
                                ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100' 
                                : 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                            student.status === 'Complete' 
                              ? 'bg-emerald-500' 
                              : student.status === 'Pending' 
                                ? 'bg-amber-500' 
                                : 'bg-rose-500'
                          }`}></span>
                          {student.status === 'Complete' ? 'Paid' : student.status === 'Pending' ? 'Unpaid' : 'Overdue'}
                        </button>

                        <AnimatePresence>
                          {activeStatusMenu === student.id && (
                            <>
                              {/* Backdrop */}
                              <div 
                                className="fixed inset-0 z-40 cursor-default" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveStatusMenu(null);
                                }}
                              />
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                className="absolute left-4 mt-1.5 w-32 bg-white rounded-2xl shadow-xl border border-[#FFE4D6] py-1.5 z-50 overflow-hidden"
                              >
                                {[
                                  { label: 'Paid', value: 'Complete', bg: 'hover:bg-emerald-50 text-emerald-600' },
                                  { label: 'Unpaid', value: 'Pending', bg: 'hover:bg-amber-50 text-amber-600' },
                                  { label: 'Overdue', value: 'Canceled', bg: 'hover:bg-rose-50 text-[#FF5BAE]' }
                                ].map((option) => (
                                  <button
                                    key={option.value}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(student, option.value as any);
                                      setActiveStatusMenu(null);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-xs font-extrabold transition-colors ${option.bg} cursor-pointer block`}
                                  >
                                    {option.label}
                                  </button>
                                ))}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </td>

                      {/* Row Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1 min-h-[32px]">
                          {isChecked && (
                            <button 
                              onClick={() => onDeleteStudent(student.id)}
                              title="Delete" 
                              className="p-1.5 hover:bg-[#ff5b5b]/10 hover:text-[#ff5b5b] text-[#7A7A7A] rounded transition-all active:scale-90"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[#FFE4D6] text-sm font-semibold text-[#7A7A7A]">
          <span>
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredStudents.length)} of {filteredStudents.length} Students
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-[#FFF5F1] text-[#2D2D2D] hover:bg-[#FF5BAE] hover:text-white disabled:opacity-50 disabled:hover:bg-[#FFF5F1] disabled:hover:text-[#2D2D2D] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-9 h-9 rounded-xl font-bold transition-all ${
                  currentPage === idx + 1 
                    ? 'bg-[#FF5BAE] text-white shadow-md' 
                    : 'bg-[#FFF5F1] hover:bg-slate-100 text-[#2D2D2D]'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-[#FFF5F1] text-[#2D2D2D] hover:bg-[#FF5BAE] hover:text-white disabled:opacity-50 disabled:hover:bg-[#FFF5F1] disabled:hover:text-[#2D2D2D] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Sliding Detail Panel / Modal */}
      <AnimatePresence>
        {viewingStudent && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs flex justify-end z-50">
            {/* Backdrop click */}
            <div className="absolute inset-0" onClick={() => setViewingStudent(null)}></div>
            
            {/* Sliding Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-screen shadow-2xl flex flex-col justify-between overflow-y-auto z-10"
            >
              <div>
                {/* Panel Header */}
                <div className="bg-[#FF5BAE] text-white p-6 pb-20 relative">
                  <button 
                    onClick={() => setViewingStudent(null)}
                    className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/25 text-white rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h3 className="text-xl font-bold font-display">Student Profile</h3>
                  <p className="text-white/60 text-xs mt-1">Academic Year 2025/2026</p>
                </div>

                {/* Avatar Offset Card */}
                <div className="px-6 -mt-14 relative z-20">
                  <div className="bg-white p-6 rounded-3xl shadow-lg border border-[#FFE4D6] flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-gradient-to-tr from-[#FF9B71] to-[#FFD21E] rounded-full p-1 shadow-inner">
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-extrabold text-3xl text-[#FF5BAE] font-display">
                        {viewingStudent.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-[#2D2D2D] mt-4 font-display">{viewingStudent.name}</h4>
                    <span className="text-sm font-semibold text-[#70D6FF] mt-1">Class {viewingStudent.grade}</span>

                    {/* Quick Call details */}
                    <div className="flex gap-3 mt-4">
                      <a href={`tel:${viewingStudent.phone}`} className="flex items-center gap-1.5 px-4 py-2 bg-[#FFF5F1] text-[#2D2D2D] text-xs font-bold rounded-full border border-[#FFE4D6] hover:bg-[#FF5BAE] hover:text-white transition-all">
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                      <a href={`mailto:${viewingStudent.email}`} className="flex items-center gap-1.5 px-4 py-2 bg-[#FFF5F1] text-[#2D2D2D] text-xs font-bold rounded-full border border-[#FFE4D6] hover:bg-[#FF5BAE] hover:text-white transition-all">
                        <Mail className="w-3.5 h-3.5" /> Mail
                      </a>
                    </div>
                  </div>
                </div>

                {/* Info List */}
                <div className="p-6 space-y-6">
                  <div>
                    <h5 className="text-xs font-extrabold text-[#7A7A7A] uppercase tracking-wider mb-3">Academic Information</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#FFF5F1] p-4 rounded-2xl border border-[#FFE4D6]/50">
                        <span className="text-[10px] text-[#7A7A7A] font-extrabold block uppercase">Student ID</span>
                        <span className="text-sm font-bold text-[#FF5BAE] mt-1 block">{viewingStudent.id}</span>
                      </div>
                      <div className="bg-[#FFF5F1] p-4 rounded-2xl border border-[#FFE4D6]/50">
                        <span className="text-[10px] text-[#7A7A7A] font-extrabold block uppercase">Enrollment Date</span>
                        <span className="text-sm font-bold text-[#2D2D2D] mt-1 block">{viewingStudent.date}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-extrabold text-[#7A7A7A] uppercase tracking-wider mb-3">Guardian Details</h5>
                    <div className="bg-[#FFF5F1] p-4 rounded-2xl border border-[#FFE4D6]/50 space-y-3">
                      <div>
                        <span className="text-[10px] text-[#7A7A7A] font-extrabold block uppercase">Parent Name</span>
                        <span className="text-sm font-bold text-[#2D2D2D] mt-0.5 block">{viewingStudent.parentName}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/50">
                        <div>
                          <span className="text-[10px] text-[#7A7A7A] font-extrabold block uppercase">City</span>
                          <span className="text-xs font-bold text-[#2D2D2D] mt-0.5 block">{viewingStudent.city}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#7A7A7A] font-extrabold block uppercase">Phone</span>
                          <span className="text-xs font-bold text-[#2D2D2D] mt-0.5 block">{viewingStudent.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                   <div>
                    <h5 className="text-xs font-extrabold text-[#7A7A7A] uppercase tracking-wider mb-3">Tuition Status</h5>
                    <div className="bg-[#FFF5F1] p-4 rounded-2xl border border-[#FFE4D6]/50 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#7A7A7A] font-extrabold block uppercase">Tuition Fee</span>
                          <span className="text-lg font-extrabold text-[#2D2D2D] mt-0.5 block">${viewingStudent.tuitionFee.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] text-[#7A7A7A] font-extrabold uppercase">Payment Status</span>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                            viewingStudent.status === 'Complete' 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' 
                              : viewingStudent.status === 'Pending' 
                                ? 'bg-amber-50 text-amber-600 border border-amber-200/60' 
                                : 'bg-rose-50 text-rose-600 border border-rose-200/60'
                          }`}>
                            {viewingStudent.status === 'Complete' ? 'Paid' : viewingStudent.status === 'Pending' ? 'Unpaid' : 'Overdue'}
                          </span>
                        </div>
                      </div>

                      {/* Payment History Audit Logs (Dấu vết thay đổi trạng thái) */}
                      {viewingStudent.paymentHistory && viewingStudent.paymentHistory.length > 0 && (
                        <div className="pt-3 border-t border-[#FFE4D6]/60">
                          <span className="text-[10px] text-[#7A7A7A] font-extrabold block uppercase mb-2">Audit History (Footprint)</span>
                          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                            {viewingStudent.paymentHistory.map((log, index) => (
                              <div key={index} className="flex gap-2 items-start text-xs text-[#2D2D2D] bg-white/70 p-2 rounded-xl border border-[#FFE4D6]/40 shadow-xs font-medium">
                                <span className="text-[#FF5BAE] font-bold text-[10px] mt-0.5">🐾</span>
                                <span className="leading-normal">{log}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Change Toolbar */}
              <div className="p-6 border-t border-[#FFE4D6] bg-[#FFF5F1]/50 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#2D2D2D]">Tuition Status:</span>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => handleStatusChange(viewingStudent, 'Complete')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                      viewingStudent.status === 'Complete' 
                        ? 'bg-emerald-500 text-white shadow-xs' 
                        : 'bg-white hover:bg-slate-50 text-emerald-600 border border-slate-200'
                    }`}
                  >
                    Paid
                  </button>
                  <button 
                    onClick={() => handleStatusChange(viewingStudent, 'Pending')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                      viewingStudent.status === 'Pending' 
                        ? 'bg-amber-500 text-white shadow-xs' 
                        : 'bg-white hover:bg-slate-50 text-amber-600 border border-slate-200'
                    }`}
                  >
                    Unpaid
                  </button>
                  <button 
                    onClick={() => handleStatusChange(viewingStudent, 'Canceled')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                      viewingStudent.status === 'Canceled' 
                        ? 'bg-rose-500 text-white shadow-xs' 
                        : 'bg-white hover:bg-slate-50 text-rose-600 border border-slate-200'
                    }`}
                  >
                    Overdue
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Add Student Modal Dialog */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-[#FF5BAE] text-white p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display">Add New Student</h3>
                    <p className="text-white/60 text-xs mt-0.5">Enter details to enroll student</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wide block mb-1">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Samantha William"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5BAE] text-sm text-[#2D2D2D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wide block mb-1">Parent Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      placeholder="e.g. Mana William"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5BAE] text-sm text-[#2D2D2D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wide block mb-1">Grade / Class *</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5BAE] text-sm text-[#2D2D2D] bg-white"
                    >
                      <option value="VII A">Class VII A</option>
                      <option value="VII B">Class VII B</option>
                      <option value="VII C">Class VII C</option>
                      <option value="VIII A">Class VIII A</option>
                      <option value="VIII B">Class VIII B</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wide block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5BAE] text-sm text-[#2D2D2D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wide block mb-1">Tuition Fee ($) *</label>
                    <input
                      type="number"
                      required
                      value={formData.tuitionFee}
                      onChange={(e) => setFormData({ ...formData, tuitionFee: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5BAE] text-sm text-[#2D2D2D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wide block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+12 345 6789 0"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5BAE] text-sm text-[#2D2D2D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wide block mb-1">Email address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@mail.com"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5BAE] text-sm text-[#2D2D2D]"
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#FFE4D6]">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-full text-sm font-bold text-[#2D2D2D] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#FF5BAE] hover:bg-[#FF5BAE]/90 rounded-full text-sm font-bold text-white transition-colors shadow-md"
                  >
                    Submit
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

const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const highlightText = (text: string, search: string) => {
  if (!search) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${escapeRegExp(search)})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === search.toLowerCase() ? (
          <mark key={i} className="bg-[#FFD21E]/30 text-[#2D2D2D] font-bold rounded-xs px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}
