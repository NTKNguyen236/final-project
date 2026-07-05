import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  CheckCircle,
  Briefcase,
  Award,
  Globe,
  Settings
} from 'lucide-react';

export default function UserProfileView() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Nacrissister',
    title: 'Senior Administrative Officer',
    email: 'nacrissister@akademi.edu',
    phone: '+1 (212) 555-0199',
    address: '120 W 45th St, New York, NY 10036, USA',
    bio: 'Administrative officer with 6+ years of operational coordination within premium school environments. Orchestrates enrollment databases, manages tuition verification metrics, and integrates cross-faculty curriculum calendars.',
    skills: ['Student Admissions', 'Crisis Resolution', 'Database Ingestion', 'Curriculum Audits', 'Budget Forecasting']
  });

  const [editForm, setEditForm] = useState({ ...profileData });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData({ ...editForm });
    setIsEditing(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="p-8 space-y-8"
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Card: Main details */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#FFE4D6]/50 text-center flex flex-col items-center justify-between">
          <div className="w-full flex flex-col items-center">
            {/* Elegant avatar */}
            <div className="relative">
              <div className="w-28 h-28 bg-gradient-to-tr from-[#FF5BAE] to-[#FF9B71] rounded-full p-1.5 shadow-xl">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-extrabold text-3xl text-[#FF5BAE] font-display">
                  N
                </div>
              </div>
              <span className="absolute bottom-1 right-1 bg-emerald-500 border-4 border-white p-1.5 rounded-full" title="Active Account"></span>
            </div>

            <h3 className="text-xl font-bold text-[#2D2D2D] mt-6 font-display">{profileData.name}</h3>
            <span className="text-xs font-bold text-[#FF5BAE] bg-[#FF5BAE]/10 px-3 py-1.5 rounded-full inline-block mt-2">
              {profileData.title}
            </span>

            <p className="text-xs text-[#7A7A7A] font-semibold mt-4 text-center leading-relaxed">
              Academic Registrar & Executive Staff Admin. Authoritative control of enrollment databases.
            </p>

            {/* Structured Contact lists */}
            <div className="w-full space-y-4 text-xs font-bold text-[#2D2D2D] text-left mt-8 pt-6 border-t border-[#FFE4D6]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#FFF5F1] border border-[#FFE4D6]/50 text-[#FF5BAE] rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-[#7A7A7A] uppercase tracking-wider block">Institutional Email</span>
                  <span className="truncate block font-semibold mt-0.5">{profileData.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#FFF5F1] border border-[#FFE4D6]/50 text-[#FF9B71] rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[#7A7A7A] uppercase tracking-wider block">Direct Office line</span>
                  <span className="block font-semibold mt-0.5">{profileData.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#FFF5F1] border border-[#FFE4D6]/50 text-[#FFD21E] rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[#7A7A7A] uppercase tracking-wider block">Office Placement</span>
                  <span className="block font-semibold mt-0.5 text-xs">{profileData.address}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setEditForm({ ...profileData });
              setIsEditing(!isEditing);
            }}
            className="w-full mt-8 py-3.5 bg-[#FF5BAE]/10 hover:bg-[#FF5BAE]/15 text-[#FF5BAE] text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5"
          >
            <Settings className="w-4 h-4 animate-spin-slow" />
            {isEditing ? 'Cancel Editing' : 'Edit Profile Parameters'}
          </button>
        </div>

        {/* Right Content Columns (span 2 on desktop) */}
        <div className="xl:col-span-2 space-y-8">
          
          {isEditing ? (
            /* Editing form panel */
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#FFE4D6]/50">
              <h3 className="text-lg font-bold text-[#2D2D2D] mb-6 font-display">Configure Registrar Profile</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF5BAE] text-sm text-[#2D2D2D]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase block mb-1">Official Role</label>
                    <input
                      type="text"
                      required
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF5BAE] text-sm text-[#2D2D2D]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase block mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF5BAE] text-sm text-[#2D2D2D]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase block mb-1">Phone</label>
                    <input
                      type="text"
                      required
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF5BAE] text-sm text-[#2D2D2D]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase block mb-1">Address Location</label>
                    <input
                      type="text"
                      required
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF5BAE] text-sm text-[#2D2D2D]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-[#2D2D2D] uppercase block mb-1">Biography Statement</label>
                    <textarea
                      required
                      rows={4}
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF5BAE] text-sm text-[#2D2D2D]"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-[#FFE4D6]">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2 bg-slate-100 text-xs font-bold rounded-full text-[#2D2D2D]"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#FF5BAE] text-white text-xs font-bold rounded-full shadow transition-all hover:bg-[#FF5BAE]/90"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Biography & Competencies Panel */
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#FFE4D6]/50 space-y-6">
              <div>
                <h4 className="text-xs font-extrabold text-[#7A7A7A] uppercase tracking-wider mb-2">Registrar Biography</h4>
                <p className="text-sm text-[#2D2D2D] font-semibold leading-relaxed">
                  {profileData.bio}
                </p>
              </div>

              {/* Competencies */}
              <div className="pt-4 border-t border-[#FFE4D6]">
                <h4 className="text-xs font-extrabold text-[#7A7A7A] uppercase tracking-wider mb-3">Core Administrative Competencies</h4>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map(sk => (
                    <span 
                      key={sk} 
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FF9B71]/10 text-[#FF9B71] text-xs font-bold rounded-full border border-[#FF9B71]/5"
                    >
                      <CheckCircle className="w-4 h-4 text-[#FF9B71]" /> {sk}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Institutional Agenda widget */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#FFE4D6]/50">
            <h3 className="text-lg font-bold text-[#2D2D2D] mb-4 font-display">Administrative Checklist</h3>
            <div className="space-y-3">
              {[
                { title: 'Ingest Class VII enrollment checklists', time: '09:00 AM', status: 'Completed' },
                { title: 'Review weekly student attendance reports', time: '11:00 AM', status: 'Completed' },
                { title: 'Execute school expense ledger balances review', time: '02:00 PM', status: 'Pending' },
                { title: 'Coordinate curriculum sync meeting with Lula Beatrice', time: '04:30 PM', status: 'Pending' }
              ].map((agenda, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl border border-[#FFE4D6] bg-[#FFF5F1]/30 hover:bg-[#FFF5F1] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${agenda.status === 'Completed' ? 'bg-[#70D6FF]' : 'bg-[#FFD21E]'}`}></span>
                    <div>
                      <span className="text-xs font-bold text-[#2D2D2D] block">{agenda.title}</span>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{agenda.time}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${agenda.status === 'Completed' ? 'bg-[#70D6FF]/10 text-[#70D6FF]' : 'bg-[#FFD21E]/10 text-[#FFD21E]'}`}>
                    {agenda.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
