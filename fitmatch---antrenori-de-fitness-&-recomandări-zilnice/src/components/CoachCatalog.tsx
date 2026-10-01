import React, { useState } from 'react';
import { Coach, Specialty, CoachingStyle, PriceTier, UserProfile } from '../types';
import { StorageService } from '../services/storage';
import { Search, Filter, Star, Check, ArrowRight } from 'lucide-react';

interface CoachCatalogProps {
  coaches: Coach[];
  userProfile: UserProfile | null;
  onSelectCoach: (coach: Coach) => void;
  onOpenCoachDetail: (coach: Coach) => void;
  onStartWizard: () => void;
}

export const CoachCatalog: React.FC<CoachCatalogProps> = ({
  coaches,
  userProfile,
  onSelectCoach,
  onOpenCoachDetail,
  onStartWizard
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch = 
      coach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coach.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || coach.specialty === selectedSpecialty;
    const matchesStyle = selectedStyle === 'all' || coach.style === selectedStyle;
    const matchesTier = selectedTier === 'all' || coach.price_tier.toString() === selectedTier;

    return matchesSearch && matchesSpecialty && matchesStyle && matchesTier;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Catalog Experți FitMatch
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
            Toți Antrenorii Certificați
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Filtrează după specializare, stil de comunicare sau nivel de tarifare.
          </p>
        </div>

        <button
          onClick={onStartWizard}
          className="rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm cursor-pointer whitespace-nowrap self-start md:self-auto"
        >
          Rulează Chestionarul de Potrivire
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Caută antrenor după nume..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Specialty filter */}
          <div>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Toate Specializările</option>
              <option value="Slăbire">Slăbire & Tonifiere</option>
              <option value="Hipertrofie">Hipertrofie & Masă</option>
              <option value="CrossFit">CrossFit & Condiționare</option>
              <option value="Recuperare">Recuperare & Mobilitate</option>
            </select>
          </div>

          {/* Style filter */}
          <div>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Toate Stilurile</option>
              <option value="Strict">Strict & Disciplinat</option>
              <option value="Empatic">Empatic & Încurajator</option>
              <option value="Tehnic">Tehnic & Științific</option>
            </select>
          </div>

          {/* Tier filter */}
          <div>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Toate Tarifele</option>
              <option value="1">Tier 1 (Buget / Accesibil)</option>
              <option value="2">Tier 2 (Standard / Mediu)</option>
              <option value="3">Tier 3 (Premium / Avansat)</option>
            </select>
          </div>

        </div>

        {/* Active counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span>Afișăm <strong>{filteredCoaches.length}</strong> din {coaches.length} antrenori</span>
          {(selectedSpecialty !== 'all' || selectedStyle !== 'all' || selectedTier !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedSpecialty('all');
                setSelectedStyle('all');
                setSelectedTier('all');
                setSearchQuery('');
              }}
              className="text-emerald-400 hover:underline cursor-pointer"
            >
              Resetează filtrele
            </button>
          )}
        </div>
      </div>

      {/* Coaches Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCoaches.map((coach) => {
          const isSelected = userProfile?.matched_coach_id === coach.id;

          return (
            <div
              key={coach.id}
              className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-950/20 shadow-md ring-1 ring-emerald-500/40'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
              }`}
            >
              <div className="p-4 space-y-3">
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-slate-800">
                  <img
                    src={coach.image_url}
                    alt={coach.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 right-2 rounded-md bg-[#090d16]/90 border border-slate-700 px-2 py-0.5 text-xs font-bold text-emerald-400">
                    {coach.monthly_rate_ron ? `${coach.monthly_rate_ron} RON/l` : `Tier ${coach.price_tier}`}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-emerald-400">{coach.specialty}</span>
                    <span className="flex items-center gap-1 text-amber-300">
                      <Star className="h-3 w-3 fill-amber-300" />
                      <span>{coach.rating || 4.9}</span>
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white mt-1">
                    {coach.name}
                  </h3>

                  <div className="text-xs text-slate-400 mt-0.5">
                    Stil: <strong className="text-slate-200">{coach.style}</strong> · {coach.experience_years || 5} ani exp.
                  </div>

                  <p className="mt-2 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {coach.bio}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 space-y-2">
                <button
                  type="button"
                  onClick={() => onSelectCoach(coach)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-3.5 w-3.5 stroke-3" />
                      <span>Antrenor Selectat</span>
                    </>
                  ) : (
                    <span>Alege Antrenorul</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onOpenCoachDetail(coach)}
                  className="w-full py-1.5 px-3 rounded-lg border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer text-center"
                >
                  Vezi Detalii
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
