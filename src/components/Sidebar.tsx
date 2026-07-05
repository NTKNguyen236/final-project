import React from 'react';
import { 
  Home, 
  Users, 
  GraduationCap, 
  Calendar, 
  CircleDollarSign, 
  User, 
  Activity,
  X
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ currentTab, setCurrentTab, isOpen = false, onClose }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'teachers', label: 'Teachers', icon: GraduationCap },
    { id: 'event', label: 'Event', icon: Calendar },
    { id: 'finance', label: 'Finance', icon: CircleDollarSign },
    { id: 'user', label: 'User', icon: User },
    { id: 'activity', label: 'Latest Activity', icon: Activity },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden cursor-default" 
          onClick={onClose}
        />
      )}

      <aside className={`w-64 bg-[#2D2D2D] text-white flex flex-col justify-between h-screen fixed top-0 left-0 z-50 shadow-2xl overflow-y-auto border-r border-[#FFE4D6]/10 transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          {/* Logo and Mobile Close Button */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-[#FF5BAE] rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 flex-shrink-0">
                <div className="w-5 h-5 border-4 border-white rounded-full"></div>
              </div>
              <span className="text-2xl font-black tracking-tight font-display text-white">
                Akademi<span className="text-[#FF5BAE]">.</span>
              </span>
            </div>
            {onClose && (
              <button 
                onClick={onClose} 
                className="p-2 text-white/70 hover:text-white lg:hidden rounded-full hover:bg-white/10 transition-colors"
                title="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation List */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-item-${item.id}`}
                  onClick={() => {
                    setCurrentTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-l-full transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-[#FFF5F1] text-[#FF5BAE] font-black translate-x-2 shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/5 font-bold'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'text-[#FF5BAE] scale-110' : 'text-white/60'}`} />
                  <span className="text-[14px] font-sans tracking-wide">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer credits matching screenshot */}
      </aside>
    </>
  );
}
