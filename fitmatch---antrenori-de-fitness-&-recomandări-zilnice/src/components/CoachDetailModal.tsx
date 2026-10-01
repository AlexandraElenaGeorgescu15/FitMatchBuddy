import React from 'react';
import { Coach } from '../types';
import { X, Star, CheckCircle, Award, Calendar, DollarSign, Dumbbell } from 'lucide-react';

interface CoachDetailModalProps {
  coach: Coach | null;
  onClose: () => void;
  onSelectCoach: (coach: Coach) => void;
  isSelected?: boolean;
}

export const CoachDetailModal: React.FC<CoachDetailModalProps> = ({
  coach,
  onClose,
  onSelectCoach,
  isSelected
}) => {
  if (!coach) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl my-8 space-y-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Închide fereastra"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header with Photo & Meta */}
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="relative h-28 w-28 sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-2xl bg-slate-800 border border-slate-700">
            <img
              src={coach.image_url}
              alt={coach.name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <div className="absolute top-2 right-2 rounded bg-[#090d16]/90 px-1.5 py-0.5 text-[11px] font-bold text-emerald-400">
              ★ {coach.rating || 4.9}
            </div>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-emerald-400">{coach.specialty}</span>
              <span aria-hidden="true">·</span>
              <span>Stil {coach.style}</span>
              <span aria-hidden="true">·</span>
              <span>Tier {coach.price_tier}</span>
            </div>

            <h2 className="font-display text-2xl font-bold text-white">
              {coach.name}
            </h2>

            <div className="flex items-center gap-4 text-xs text-slate-300 font-mono pt-1">
              <span>Tarif lunar: <strong className="text-emerald-400 font-bold">{coach.monthly_rate_ron || 350} RON</strong></span>
              <span>Experiență: <strong>{coach.experience_years || 6} ani</strong></span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">
            Despre Antrenor & Filosofie
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {coach.bio}
          </p>
        </div>

        {/* Certifications */}
        {coach.certifications && coach.certifications.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">
              Certificări & Formare Profesională
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {coach.certifications.map((cert, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <Award className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Închide
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectCoach(coach);
              onClose();
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isSelected
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/10'
            }`}
          >
            {isSelected ? 'Antrenor Deja Selectat' : 'Alege Acest Antrenor'}
          </button>
        </div>

      </div>
    </div>
  );
};
