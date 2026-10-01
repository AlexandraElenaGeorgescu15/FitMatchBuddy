import React from 'react';
import { Coach } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Activity, CheckCircle2, Star } from 'lucide-react';

interface HeroLandingProps {
  coaches: Coach[];
  onStartWizard: () => void;
  onExploreCoaches: () => void;
  onOpenCoachDetail: (coach: Coach) => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  coaches,
  onStartWizard,
  onExploreCoaches,
  onOpenCoachDetail
}) => {
  const featuredCoaches = coaches.slice(0, 4);

  return (
    <div className="space-y-16 py-6 md:py-12">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Platformă Inteligentă de Fitness Coaching
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Găsește Antrenorul Potrivit Obiectivelor Tale Reale.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Algoritm de potrivire bazat pe specializare, stil de comunicare și buget. 
              Fără ghicit, fără abonamente irosite — plus recomandări de antrenament și nutriție transmise zilnic prin automatizări n8n.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartWizard}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
              >
                <span>Începe Chestionarul (2 min)</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onExploreCoaches}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              >
                <span>Vezi Toți Antrenorii</span>
              </button>
            </div>

            {/* Adjacent Proof Metrics */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-left">
              <div>
                <div className="font-display text-xl sm:text-2xl font-bold text-white tabular-nums">98.4%</div>
                <div className="text-xs text-slate-400">Compatibilitate match</div>
              </div>
              <div>
                <div className="font-display text-xl sm:text-2xl font-bold text-white tabular-nums">100%</div>
                <div className="text-xs text-slate-400">Certificări verificate</div>
              </div>
              <div>
                <div className="font-display text-xl sm:text-2xl font-bold text-white tabular-nums">Zilnic</div>
                <div className="text-xs text-slate-400">Digest automat n8n</div>
              </div>
            </div>
          </div>

          {/* Hero Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 w-full overflow-hidden rounded-xl border border-slate-700/60 shadow-2xl">
              <img
                src="/src/assets/images/hero_fitness_coaching_1790871141283.jpg"
                alt="Studio modern de antrenament și coaching personalizat"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent opacity-60"></div>
              
              <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-slate-700/70 bg-[#090d16]/85 p-3.5 backdrop-blur-md">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-200">
                    <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="font-medium">Matching automat activ</span>
                  </div>
                  <span className="text-emerald-400 font-mono text-[11px]">8 Antrenori disponibili</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Core Capabilities & How It Works (Bento Layout) */}
      <section className="space-y-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            01. Cum Funcționează Algoritmul FitMatch
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            Un sistem în trei etape proiectat pentru a elimina nepotrivirile dintre stilul tău de viață și modul de lucru al antrenorului.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3 hover:border-slate-700 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">1. Chestionar de Calibrare</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Completezi în 2 minute obiectivul tău (Slăbire, Hipertrofie, CrossFit sau Recuperare), frecvența săptămânală și stilul de comunicare preferat (Strict, Empatic sau Tehnic).
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3 hover:border-slate-700 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">2. Scor Multi-Criterial de Match</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Algoritmul calculează afinitatea pe 4 dimensiuni ponderate și îți prezintă Top 3 Antrenori Recomandați, cu explicații clare de compatibilitate și tarife transparente.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3 hover:border-slate-700 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">3. Recomandări Zilnice n8n</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Primești automat sfaturi zilnice acționabile de nutriție și recuperare, cu posibilitatea integrării directe în propriul tău flux de lucru automatizat prin Webhook n8n.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Featured Coaches Spotlight */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              02. Antrenori de Elită Verificați
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Specialiști certificați cu experiență dovedită în transformări reale.
            </p>
          </div>

          <button
            onClick={onExploreCoaches}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Vezi toți cei {coaches.length} antrenori</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredCoaches.map((coach) => (
            <div
              key={coach.id}
              onClick={() => onOpenCoachDetail(coach)}
              className="group rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-800">
                  <img
                    src={coach.image_url}
                    alt={coach.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 rounded-md bg-[#090d16]/80 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-slate-700 backdrop-blur-xs">
                    {coach.monthly_rate_ron ? `${coach.monthly_rate_ron} RON/l` : `Tier ${coach.price_tier}`}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{coach.specialty}</span>
                    <span className="flex items-center gap-1 text-amber-300">
                      <Star className="h-3 w-3 fill-amber-300" />
                      <span>{coach.rating || 4.9}</span>
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-white group-hover:text-emerald-400 transition-colors mt-0.5">
                    {coach.name}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                    {coach.bio}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Stil: <strong className="text-slate-200">{coach.style}</strong></span>
                <span className="text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  Detalii →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Ready to match CTA bar */}
      <section className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 p-8 sm:p-10 text-center space-y-4">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
          Ești gata să descoperi antrenorul potrivit pentru tine?
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          Completează chestionarul rapid în 3 pași și primești instant Top 3 recomandări calculate pe baza obiectivului tău.
        </p>
        <div className="pt-2">
          <button
            onClick={onStartWizard}
            className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            Lansează Chestionarul de Potrivire
          </button>
        </div>
      </section>
    </div>
  );
};
