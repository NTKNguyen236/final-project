import React from 'react';
import { Bell, Settings, Search, Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  onSearchChange?: (val: string) => void;
  searchValue?: string;
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  onOpenSidebar?: () => void;
}

export default function Header({
  title,
  onSearchChange,
  searchValue = '',
  onNotificationClick,
  onSettingsClick,
  onProfileClick,
  onOpenSidebar
}: HeaderProps) {
  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between px-6 lg:px-8 py-6 bg-transparent z-10 gap-4">
      {/* Dynamic Title and Hamburger Menu Button */}
      <div className="flex items-center gap-4">
        {onOpenSidebar && (
          <button
            onClick={onOpenSidebar}
            className="p-2 text-[#7A7A7A] hover:text-[#FF5BAE] bg-white border border-[#FFE4D6] rounded-xl shadow-md lg:hidden hover:scale-105 active:scale-95 transition-all"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-2xl lg:text-3xl font-black text-[#2D2D2D] tracking-tight font-display">
          {title}
        </h1>
      </div>

      {/* Header Actions */}
      <div className="flex flex-wrap items-center gap-4 lg:gap-6">
        {/* Search Input */}
        {onSearchChange && (
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="w-5 h-5 text-[#7A7A7A]" />
            </span>
            <input
              id="header-search-input"
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search here..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-[#FFE4D6] rounded-full shadow-md text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5BAE] focus:bg-white text-[#2D2D2D] placeholder-[#7A7A7A] transition-all font-semibold"
            />
          </div>
        )}

        <div className="flex items-center gap-4 sm:gap-6 ml-auto lg:ml-0">
          {/* Notification Bell */}
          <button
            id="header-notification-btn"
            onClick={onNotificationClick}
            className="relative w-11 h-11 bg-white border border-[#FFE4D6] rounded-full flex items-center justify-center shadow-md text-[#7A7A7A] hover:text-[#FF5BAE] hover:scale-105 transition-all"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#FFD21E] border-2 border-white rounded-full"></span>
          </button>

          {/* Settings Icon */}
          <button
            id="header-settings-btn"
            onClick={onSettingsClick}
            className="w-11 h-11 bg-white border border-[#FFE4D6] rounded-full flex items-center justify-center shadow-md text-[#7A7A7A] hover:text-[#FF5BAE] hover:scale-105 transition-all"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* User Info & Avatar */}
          <div 
            onClick={onProfileClick}
            className="flex items-center gap-3 sm:gap-4 pl-3 sm:pl-4 border-l border-[#FFE4D6] cursor-pointer group"
          >
            <div className="text-right">
              <h4 className="text-sm font-black text-[#2D2D2D] group-hover:text-[#FF5BAE] transition-colors whitespace-nowrap">
                Nacrissister
              </h4>
              <span className="text-[11px] text-[#7A7A7A] font-bold block">Admin</span>
            </div>
            <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-[#FF5BAE] to-[#FF9B71] flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shadow-md flex-shrink-0">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[#FF5BAE] font-black text-xs">
                N
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
