import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  X, 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  Building2,
  Trash2,
  UserPlus2
} from 'lucide-react';
import { Teacher } from '../types';

interface TeachersViewProps {
  key?: React.Key;
  teachers: Teacher[];
  onAddTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
  selectedTeacherFromParent: Teacher | null;
  clearSelectedTeacher: () => void;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
}

export default function TeachersView({
  teachers,
  onAddTeacher,
  onDeleteTeacher,
  selectedTeacherFromParent,
  clearSelectedTeacher,
  searchTerm: parentSearchTerm,
  onSearchChange: parentOnSearchChange
}: TeachersViewProps) {
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
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    subject: 'Mathematics',
    email: '',
    phone: '',
    address: 'New York, NY, USA',
    dateOfBirth: '24 February 1990',
    placeOfBirth: 'New York, NY, USA',
    university: 'Columbia University',
    degree: 'Master of Education',
    startYear: '2018',
    endYear: '2022',
    city: 'New York',
    about: ''
  });

  // Handle selected teacher from parent view (dashboard)
  React.useEffect(() => {
    if (selectedTeacherFromParent) {
      setViewingTeacher(selectedTeacherFromParent);
      clearSelectedTeacher();
    }
  }, [selectedTeacherFromParent, clearSelectedTeacher]);

  const subjectsList = ['All', 'Mathematics', 'Science', 'Art', 'Biology', 'History', 'Physics', 'Algorithm', 'English', 'Programming'];

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.university.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = subjectFilter === 'All' || t.subject === subjectFilter;
    return matchesSearch && matchesFilter;
  });

  const suggestedTeachers = searchTerm.trim().length > 0
    ? teachers.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.university.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTeacher: Teacher = {
      id: `T-0${teachers.length + 1}`,
      name: formData.name,
      subject: formData.subject,
      email: formData.email || 'teacher@mail.com',
      phone: formData.phone || '+12 345 6789 0',
      address: formData.address,
      dateOfBirth: formData.dateOfBirth,
      placeOfBirth: formData.placeOfBirth,
      university: formData.university,
      degree: formData.degree,
      startYear: formData.startYear,
      endYear: formData.endYear,
      city: formData.city,
      about: formData.about || 'A dedicated Akademi professional.'
    };
    onAddTeacher(newTeacher);
    setIsAddModalOpen(false);
    // Reset form
    setFormData({
      name: '',
      subject: 'Mathematics',
      email: '',
      phone: '',
      address: 'New York, NY, USA',
      dateOfBirth: '24 February 1990',
      placeOfBirth: 'New York, NY, USA',
      university: 'Columbia University',
      degree: 'Master of Education',
      startYear: '2018',
      endYear: '2022',
      city: 'New York',
      about: ''
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="p-8 space-y-8"
    >
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="w-5 h-5 text-[#7A7A7A]" />
            </span>
            <input
              id="teacher-search"
              type="text"
              placeholder="Search teacher by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-transparent rounded-full shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5BAE] text-[#2D2D2D] placeholder-[#7A7A7A]"
            />
          </div>

          {/* Subject Filter */}
          <div className="flex flex-col gap-1.5 w-full sm:w-auto py-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#2D2D2D] whitespace-nowrap hidden sm:inline mr-1.5">Filter:</span>
              <div className="flex flex-wrap gap-1.5">
                {subjectsList.slice(0, 5).map(sub => (
                  <button
                    key={sub}
                    onClick={() => setSubjectFilter(sub)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      subjectFilter === sub 
                        ? 'bg-[#FF5BAE] text-white shadow-sm' 
                        : 'bg-white text-[#2D2D2D] hover:bg-slate-100'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:pl-12">
              {subjectsList.slice(5).map(sub => (
                <button
                  key={sub}
                  onClick={() => setSubjectFilter(sub)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    subjectFilter === sub 
                      ? 'bg-[#FF5BAE] text-white shadow-sm' 
                      : 'bg-white text-[#2D2D2D] hover:bg-slate-100'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#FF9B71] text-white rounded-full font-bold text-sm shadow-md hover:bg-[#FF9B71]/90 transition-all w-full lg:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          <span>New Teacher</span>
        </button>
      </div>

      {/* Teachers Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTeachers.map((teacher, idx) => {
          const initials = teacher.name.split(' ').map(n => n[0]).join('');
          
          return (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-[#FFE4D6]/50 text-center flex flex-col justify-between hover:shadow-md transition-shadow relative group"
            >
              {/* Trash icon overlay for deleting */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTeacher(teacher.id);
                }}
                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                title="Delete Teacher"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div 
                className="cursor-pointer"
                onClick={() => setViewingTeacher(teacher)}
              >
                {/* Avatar */}
                <div className="w-20 h-20 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-xl font-extrabold text-[#FF5BAE] font-display relative shadow-inner">
                  {initials}
                  <span className="absolute bottom-0 right-0 w-5 h-5 bg-[#70D6FF] border-4 border-white rounded-full"></span>
                </div>

                {/* Name */}
                <h4 className="text-[17px] font-bold text-[#2D2D2D] mt-4 hover:text-[#FF5BAE] transition-colors font-display line-clamp-1">
                  {teacher.name}
                </h4>

                {/* Subject tag */}
                <span className="text-xs text-[#7A7A7A] font-semibold block mt-1">
                  {teacher.subject}
                </span>
              </div>

              {/* Action Circle Links */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <a 
                  href={`tel:${teacher.phone}`}
                  className="w-9 h-9 bg-[#FFF5F1] hover:bg-[#FF5BAE] hover:text-white text-[#FF5BAE] rounded-full flex items-center justify-center transition-all shadow-sm"
                  title="Call Teacher"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a 
                  href={`mailto:${teacher.email}`}
                  className="w-9 h-9 bg-[#FFF5F1] hover:bg-[#FF5BAE] hover:text-white text-[#FF5BAE] rounded-full flex items-center justify-center transition-all shadow-sm"
                  title="Email Teacher"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Teachers Detail Modal */}
      <AnimatePresence>
        {viewingTeacher && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            {/* Backdrop close */}
            <div className="absolute inset-0" onClick={() => setViewingTeacher(null)}></div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden relative z-10 flex flex-col md:flex-row h-[90vh] md:h-auto"
            >
              {/* Left Color Banner Column */}
              <div className="md:w-1/3 bg-[#FF5BAE] text-white p-8 flex flex-col justify-between relative overflow-hidden">
                {/* Abstract graphic circle */}
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-white/5 rounded-full"></div>
                
                <div className="relative z-10 text-center md:text-left flex flex-col items-center md:items-start">
                  <div className="w-24 h-24 rounded-full bg-white text-[#FF5BAE] flex items-center justify-center text-3xl font-extrabold font-display shadow-lg mb-6">
                    {viewingTeacher.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-2xl font-bold font-display">{viewingTeacher.name}</h3>
                  <span className="text-xs px-3 py-1.5 bg-white/10 text-white rounded-full mt-2 inline-block font-bold">
                    {viewingTeacher.subject} Expert
                  </span>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 space-y-3 text-xs text-white/80 font-medium text-center md:text-left">
                  <p className="flex items-center gap-2 justify-center md:justify-start">
                    <Phone className="w-4 h-4 text-[#FF9B71]" /> {viewingTeacher.phone}
                  </p>
                  <p className="flex items-center gap-2 justify-center md:justify-start">
                    <Mail className="w-4 h-4 text-[#FF9B71]" /> {viewingTeacher.email}
                  </p>
                  <p className="flex items-center gap-2 justify-center md:justify-start">
                    <MapPin className="w-4 h-4 text-[#FF9B71]" /> {viewingTeacher.city}, USA
                  </p>
                </div>
              </div>

              {/* Right Details Column */}
              <div className="md:w-2/3 p-8 overflow-y-auto flex-1 flex flex-col justify-between">
                <button 
                  onClick={() => setViewingTeacher(null)}
                  className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 text-[#2D2D2D] rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-6">
                  {/* About section */}
                  <div>
                    <h4 className="text-xs font-extrabold text-[#7A7A7A] uppercase tracking-wider mb-2">About Teacher</h4>
                    <p className="text-sm text-[#2D2D2D] font-medium leading-relaxed">
                      {viewingTeacher.about || 'Dedicated educator striving to bring the best interactive learning models to students at Akademi. Focuses on project-based work, critical review, and structured tutoring sessions.'}
                    </p>
                  </div>

                  {/* General Profile Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#FFF5F1] p-4 rounded-2xl border border-[#FFE4D6]/50">
                      <span className="text-[10px] text-[#7A7A7A] font-extrabold block uppercase flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#FF9B71]" /> Date of Birth
                      </span>
                      <span className="text-xs font-bold text-[#2D2D2D] mt-1.5 block">{viewingTeacher.dateOfBirth}</span>
                    </div>

                    <div className="bg-[#FFF5F1] p-4 rounded-2xl border border-[#FFE4D6]/50">
                      <span className="text-[10px] text-[#7A7A7A] font-extrabold block uppercase flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#FF9B71]" /> Place of Birth
                      </span>
                      <span className="text-xs font-bold text-[#2D2D2D] mt-1.5 block">{viewingTeacher.placeOfBirth}</span>
                    </div>
                  </div>

                  {/* Education details matching biography card in screenshot */}
                  <div>
                    <h4 className="text-xs font-extrabold text-[#7A7A7A] uppercase tracking-wider mb-4">Education History</h4>
                    <div className="relative border-l-2 border-[#FF5BAE]/20 pl-6 ml-2 space-y-6">
                      {/* Item 1 */}
                      <div className="relative">
                        <span className="absolute -left-[31px] top-1 w-4 h-4 bg-[#70D6FF] border-4 border-white rounded-full"></span>
                        <h5 className="text-xs font-extrabold text-[#7A7A7A] uppercase tracking-wide">
                          {viewingTeacher.university} ({viewingTeacher.startYear} - {viewingTeacher.endYear})
                        </h5>
                        <p className="text-sm font-bold text-[#2D2D2D] mt-1">{viewingTeacher.degree}</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Completed rigorous thesis defenses, structured multiple pedagogical review panels, and hosted community academic development drives.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-[#FFE4D6]">
                  <button
                    onClick={() => setViewingTeacher(null)}
                    className="px-6 py-2.5 bg-[#FF5BAE] hover:bg-[#FF5BAE]/90 text-white rounded-full text-sm font-bold shadow-md transition-colors"
                  >
                    Close Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Teacher Modal Dialog */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="bg-[#FF9B71] text-white p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <UserPlus2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display">Add New Teacher</h3>
                    <p className="text-white/60 text-xs mt-0.5">Enter details to onboard a new instructor</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form fields */}
              <form onSubmit={handleAddSubmit} className="p-6 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wide block mb-1">Teacher Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Tom Housenburg"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9B71] text-sm text-[#2D2D2D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wide block mb-1">Subject / Specialty *</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9B71] text-sm text-[#2D2D2D] bg-white"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Science">Science</option>
                      <option value="Art">Art</option>
                      <option value="Biology">Biology</option>
                      <option value="History">History</option>
                      <option value="Physics">Physics</option>
                      <option value="Algorithm">Algorithm</option>
                      <option value="English">English</option>
                      <option value="Programming">Programming</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wide block mb-1">Email address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="teacher@mail.com"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9B71] text-sm text-[#2D2D2D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wide block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+12 345 6789 0"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9B71] text-sm text-[#2D2D2D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wide block mb-1">University Degree *</label>
                    <input
                      type="text"
                      required
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      placeholder="Master of Science Education"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9B71] text-sm text-[#2D2D2D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wide block mb-1">University Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      placeholder="Columbia University"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9B71] text-sm text-[#2D2D2D]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-[#2D2D2D] uppercase block mb-1">Start Year</label>
                      <input
                        type="text"
                        value={formData.startYear}
                        onChange={(e) => setFormData({ ...formData, startYear: e.target.value })}
                        placeholder="2016"
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs text-[#2D2D2D]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#2D2D2D] uppercase block mb-1">End Year</label>
                      <input
                        type="text"
                        value={formData.endYear}
                        onChange={(e) => setFormData({ ...formData, endYear: e.target.value })}
                        placeholder="2020"
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs text-[#2D2D2D]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wide block mb-1">Biography / About</label>
                    <textarea
                      value={formData.about}
                      onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                      rows={3}
                      placeholder="Write brief description..."
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9B71] text-sm text-[#2D2D2D]"
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
                    className="px-6 py-2.5 bg-[#FF9B71] hover:bg-[#FF9B71]/90 rounded-full text-sm font-bold text-white transition-colors shadow-md"
                  >
                    Save Teacher
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
