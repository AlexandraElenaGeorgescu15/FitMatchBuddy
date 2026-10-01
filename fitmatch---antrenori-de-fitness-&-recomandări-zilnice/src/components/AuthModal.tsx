import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { StorageService } from '../services/storage';
import { X, UserCheck, ShieldCheck, Mail, Lock, User as UserIcon } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserChange: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('user');

  const allUsers = StorageService.getUsers();

  const handleQuickLoginAs = (targetUser: User) => {
    StorageService.setCurrentUserId(targetUser.id);
    onUserChange(targetUser);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    if (mode === 'signup') {
      const newUser = StorageService.registerUser(email, name || email.split('@')[0], role);
      onUserChange(newUser);
    } else {
      // Login
      const existing = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        StorageService.setCurrentUserId(existing.id);
        onUserChange(existing);
      } else {
        const newUser = StorageService.registerUser(email, name || email.split('@')[0], role);
        onUserChange(newUser);
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl relative space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Închide formularul de autentificare"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div>
          <h2 className="font-display text-xl font-bold text-white">
            {mode === 'login' ? 'Autentificare FitMatch' : 'Creează Cont Nou'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestionează antrenorul ales și setările notificărilor zilnice.
          </p>
        </div>

        {/* One-Click Quick Demo Switcher */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Conturi Demo Rapide (Testare cu 1 click):
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                const u = allUsers.find(x => x.role === 'user') || allUsers[0];
                handleQuickLoginAs(u);
              }}
              className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-left hover:bg-emerald-500/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                <UserCheck className="h-3.5 w-3.5" />
                <span>Utilizator</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">alexandra@fitmatch.ro</div>
            </button>

            <button
              type="button"
              onClick={() => {
                const a = allUsers.find(x => x.role === 'admin') || allUsers[1];
                handleQuickLoginAs(a);
              }}
              className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-left hover:bg-amber-500/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Administrator</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">admin@fitmatch.ro</div>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Nume & Prenume</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ion Popescu"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Adresă de Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nume@exemplu.ro"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Parolă</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="password"
                defaultValue="••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Rol Cont</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="user">Utilizator (Căutare Antrenor & Dashboard)</option>
                <option value="admin">Administrator (CRUD Antrenori & n8n)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-500 font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/10 cursor-pointer mt-2"
          >
            {mode === 'login' ? 'Conectează-te' : 'Înregistrează Contul'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          {mode === 'login' ? (
            <>
              Nu ai cont încă?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-emerald-400 font-semibold hover:underline cursor-pointer"
              >
                Creează cont
              </button>
            </>
          ) : (
            <>
              Ai deja un cont?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-emerald-400 font-semibold hover:underline cursor-pointer"
              >
                Autentifică-te
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
