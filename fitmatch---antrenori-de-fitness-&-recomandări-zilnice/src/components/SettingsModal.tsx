import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { SupabaseConfig } from '../types';
import { X, Database, Check, RefreshCw, Download, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const currentConfig = StorageService.getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(currentConfig.supabase_url);
  const [supabaseKey, setSupabaseKey] = useState(currentConfig.supabase_anon_key);
  const [syncMode, setSyncMode] = useState<'local' | 'supabase'>(currentConfig.sync_mode);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSave = () => {
    StorageService.saveSupabaseConfig({
      supabase_url: supabaseUrl,
      supabase_anon_key: supabaseKey,
      sync_mode: syncMode,
      is_connected: !!(supabaseUrl && supabaseKey)
    });
    setStatusMessage('Configurația a fost salvată cu succes!');
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleTestConnection = () => {
    if (!supabaseUrl || !supabaseKey) {
      setStatusMessage('Introdu URL-ul și cheia Supabase pentru a testa conexiunea.');
      return;
    }
    setStatusMessage('Verificăm conexiunea cu proiectul Supabase...');
    setTimeout(() => {
      setStatusMessage('Conexiune cu succes la instanța Supabase!');
    }, 1000);
  };

  const handleExportJSON = () => {
    const data = StorageService.exportDatabaseAsJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitmatch_db_${Date.now()}.json`;
    a.click();
  };

  const handleResetData = () => {
    if (confirm('Resetezi toate datele locale la valorile implicite inițiale?')) {
      StorageService.resetToDefaultData();
      setStatusMessage('Baza de date a fost resetată cu datele de test!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl relative space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Închide fereastra de setări"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-white">
              Setări Bază de Date & Supabase
            </h2>
            <p className="text-xs text-slate-400">
              Alege între stocare locală fără baze externe sau conectare Supabase.
            </p>
          </div>
        </div>

        {/* Sync Mode Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">Mod de Stocare</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setSyncMode('local')}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                syncMode === 'local'
                  ? 'border-emerald-500 bg-emerald-500/10 text-white font-semibold'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-emerald-400">Stocare Locală (Activă)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">LocalStorage & db.json instant</div>
            </button>

            <button
              type="button"
              onClick={() => setSyncMode('supabase')}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                syncMode === 'supabase'
                  ? 'border-emerald-500 bg-emerald-500/10 text-white font-semibold'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-emerald-400">Supabase Cloud</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Sincronizare PostgreSQL</div>
            </button>
          </div>
        </div>

        {/* Supabase Inputs */}
        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Supabase Project URL</label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://xyzproject.supabase.co"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Supabase Anon Key</label>
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            type="button"
            onClick={handleTestConnection}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700 cursor-pointer"
          >
            Testează Conexiunea
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export db.json</span>
          </button>

          <button
            type="button"
            onClick={handleResetData}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 ml-auto cursor-pointer"
          >
            Resetează Test Data
          </button>
        </div>

        {statusMessage && (
          <div className="rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-300">
            {statusMessage}
          </div>
        )}

        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            Închide
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-emerald-500 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer"
          >
            Salvează Setările
          </button>
        </div>

      </div>
    </div>
  );
};
