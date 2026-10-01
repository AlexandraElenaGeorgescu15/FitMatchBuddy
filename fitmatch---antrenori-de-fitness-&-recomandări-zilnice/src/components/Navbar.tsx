import React from 'react';
import { User, UserRole } from '../types';
import { StorageService } from '../services/storage';
import { ShieldCheck, Dumbbell, Bell, UserCheck, Settings, LogOut, ArrowRightLeft } from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'wizard' | 'dashboard' | 'admin' | 'coaches';
  onSelectTab: (tab: 'home' | 'wizard' | 'dashboard' | 'admin' | 'coaches') => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onOpenAuth,
  onOpenSettings
}) => {
  const handleQuickSwitchRole = () => {
    const users = StorageService.getUsers();
    if (!currentUser) return;
    
    if (currentUser.role === 'admin') {
      const regularUser = users.find(u => u.role === 'user') || users[0];
      StorageService.setCurrentUserId(regularUser.id);
      onSelectTab('dashboard');
    } else {
      const adminUser = users.find(u => u.role === 'admin');
      if (adminUser) {
        StorageService.setCurrentUserId(adminUser.id);
        onSelectTab('admin');
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2 text-left focus:outline-none group cursor-pointer"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:border-emerald-500/50 transition-colors">
            <Dumbbell className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-display text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              FitMatch
            </span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Clean unboxed typography) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => onSelectTab('home')}
            className={`transition-colors hover:text-emerald-400 cursor-pointer ${
              currentTab === 'home' ? 'text-emerald-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Descoperă
          </button>

          <button
            onClick={() => onSelectTab('coaches')}
            className={`transition-colors hover:text-emerald-400 cursor-pointer ${
              currentTab === 'coaches' ? 'text-emerald-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Antrenori
          </button>

          <button
            onClick={() => onSelectTab('wizard')}
            className={`transition-colors hover:text-emerald-400 cursor-pointer ${
              currentTab === 'wizard' ? 'text-emerald-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Chestionar Match
          </button>

          <button
            onClick={() => onSelectTab('dashboard')}
            className={`transition-colors hover:text-emerald-400 cursor-pointer ${
              currentTab === 'dashboard' ? 'text-emerald-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => onSelectTab('admin')}
            className={`flex items-center gap-1.5 transition-colors hover:text-emerald-400 cursor-pointer ${
              currentTab === 'admin' ? 'text-emerald-400 font-semibold' : 'text-slate-300'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Panou Admin & n8n</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Quick Tester */}
        <div className="flex items-center gap-3">
          {/* Quick Role Switcher Button */}
          <button
            onClick={handleQuickSwitchRole}
            title={`Comută la rolul de ${currentUser?.role === 'admin' ? 'Utilizator' : 'Admin'}`}
            className="flex items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900/90 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-600 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowRightLeft className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Rol:</span>
            <span className={`font-semibold ${currentUser?.role === 'admin' ? 'text-amber-400' : 'text-emerald-400'}`}>
              {currentUser?.role === 'admin' ? 'Admin' : 'Utilizator'}
            </span>
          </button>

          {/* Settings modal trigger */}
          <button
            onClick={onOpenSettings}
            title="Setări Supabase & Bază de Date"
            aria-label="Setări Bază de Date"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors cursor-pointer"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* User profile / Auth button */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectTab(currentUser.role === 'admin' ? 'admin' : 'dashboard')}
                className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 transition-colors cursor-pointer"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span className="max-w-[120px] truncate">{currentUser.name.split(' ')[0]}</span>
              </button>
              <button
                onClick={onOpenAuth}
                title="Schimbă contul"
                aria-label="Schimbă contul"
                className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              Autentificare
            </button>
          )}
        </div>

      </div>

      {/* Mobile subnavigation bar */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-800/60 bg-[#090d16] px-2 py-2 text-xs">
        <button
          onClick={() => onSelectTab('home')}
          className={`py-1 px-2 ${currentTab === 'home' ? 'text-emerald-400 font-medium' : 'text-slate-400'}`}
        >
          Acasă
        </button>
        <button
          onClick={() => onSelectTab('coaches')}
          className={`py-1 px-2 ${currentTab === 'coaches' ? 'text-emerald-400 font-medium' : 'text-slate-400'}`}
        >
          Antrenori
        </button>
        <button
          onClick={() => onSelectTab('wizard')}
          className={`py-1 px-2 ${currentTab === 'wizard' ? 'text-emerald-400 font-medium' : 'text-slate-400'}`}
        >
          Chestionar
        </button>
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`py-1 px-2 ${currentTab === 'dashboard' ? 'text-emerald-400 font-medium' : 'text-slate-400'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => onSelectTab('admin')}
          className={`py-1 px-2 ${currentTab === 'admin' ? 'text-emerald-400 font-medium' : 'text-slate-400'}`}
        >
          Admin & n8n
        </button>
      </div>
    </header>
  );
};
