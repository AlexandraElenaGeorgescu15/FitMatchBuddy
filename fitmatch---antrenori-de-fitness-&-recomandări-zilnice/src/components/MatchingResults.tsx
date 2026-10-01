import React from 'react';
import { Coach, MatchScoreResult, UserProfile, User } from '../types';
import { StorageService } from '../services/storage';
import { CheckCircle, Award, Star, ArrowRight, RotateCcw, Check } from 'lucide-react';

interface MatchingResultsProps {
  topMatches: MatchScoreResult[];
  userProfile: UserProfile;
  currentUser: User | null;
  onSelectCoach: (coach: Coach) => void;
  onRetakeWizard: () => void;
  onOpenCoachDetail: (coach: Coach) => void;
}

export const MatchingResults: React.FC<MatchingResultsProps> = ({
  topMatches,
  userProfile,
  currentUser,
  onSelectCoach,
  onRetakeWizard,
  onOpenCoachDetail
}) => {
  const selectedCoachId = userProfile.matched_coach_id;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400">
          <Award className="h-3.5 w-3.5" />
          <span>Rezultate Calibrate pe Obiectivul Tău ({userProfile.goal})</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
          Top 3 Antrenori Recomandați
        </h1>
        
        <p className="text-sm text-slate-300">
          Pe baza preferinței tale pentru stilul <strong className="text-emerald-400">{userProfile.preferred_style}</strong>, 
          frecvența de <strong className="text-emerald-400">{userProfile.workout_days} zile/săpt</strong> și 
          bugetul de <strong className="text-emerald-400">{userProfile.budget} RON</strong>, am identificat specialiștii cu cea mai mare rată de compatibilitate.
        </p>
      </div>

      {/* Top 3 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {topMatches.slice(0, 3).map((match, index) => {
          const coach = match.coach;
          const isSelected = selectedCoachId === coach.id;
          const isTopMatch = index === 0;

          return (
            <div
              key={coach.id}
              className={`relative rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-950/20 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                  : isTopMatch
                  ? 'border-emerald-500/60 bg-slate-900/80 shadow-lg'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
              }`}
            >
              {/* Top Match Ribbon */}
              {isTopMatch && (
                <div className="bg-emerald-500 text-slate-950 text-[11px] font-extrabold uppercase tracking-wider py-1 px-3 text-center">
                  ★ Cea Mai Bună Potrivire ({match.overallScore}% Scor)
                </div>
              )}

              <div className="p-5 space-y-4">
                {/* Photo & Main Meta */}
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-slate-800">
                  <img
                    src={coach.image_url}
                    alt={coach.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 rounded-lg bg-[#090d16]/90 border border-slate-700 px-2.5 py-1 text-xs font-bold text-emerald-400 backdrop-blur-xs">
                    {coach.monthly_rate_ron ? `${coach.monthly_rate_ron} RON / lună` : `Tier ${coach.price_tier}`}
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 rounded-lg bg-[#090d16]/90 border border-slate-700 px-2 py-0.5 text-[11px] font-semibold text-slate-200">
                    {match.overallScore}% Compatibilitate
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-medium text-emerald-400">{coach.specialty}</span>
                    <span className="flex items-center gap-1 text-amber-300 font-semibold">
                      <Star className="h-3.5 w-3.5 fill-amber-300" />
                      <span>{coach.rating || 4.9}</span>
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-white mt-1">
                    {coach.name}
                  </h3>

                  <div className="mt-1 text-xs text-slate-400">
                    Stil: <strong className="text-slate-200">{coach.style}</strong> · {coach.experience_years || 6} ani exp.
                  </div>

                  <p className="mt-2.5 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {coach.bio}
                  </p>
                </div>

                {/* Score Breakdown Points */}
                <div className="space-y-1.5 pt-3 border-t border-slate-800/80">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    De ce este potrivit pentru tine:
                  </div>
                  {match.reasons.map((reason, rIdx) => (
                    <div key={rIdx} className="flex items-start gap-1.5 text-xs text-slate-300">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 space-y-2 mt-4">
                <button
                  type="button"
                  onClick={() => onSelectCoach(coach)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs'
                      : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/10'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-4 w-4 stroke-3" />
                      <span>Antrenor Selectat</span>
                    </>
                  ) : (
                    <>
                      <span>Selectează Antrenorul</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onOpenCoachDetail(coach)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-700/80 bg-slate-800/60 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer text-center"
                >
                  Vezi Profil Complet & Certificări
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Footer controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
        <button
          onClick={onRetakeWizard}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Refă Chestionarul de Potrivire</span>
        </button>

        <p className="text-xs text-slate-400 text-center sm:text-right">
          Poți schimba oricând antrenorul selectat direct din Dashboard sau din catalog.
        </p>
      </div>

    </div>
  );
};
