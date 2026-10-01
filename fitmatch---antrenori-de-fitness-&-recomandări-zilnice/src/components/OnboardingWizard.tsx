import React, { useState } from 'react';
import { FitnessGoal, CoachingStyle, UserProfile, User } from '../types';
import { StorageService } from '../services/storage';
import { 
  Flame, 
  Dumbbell, 
  HeartPulse, 
  Gauge, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  Shield,
  Smile,
  Binary
} from 'lucide-react';

interface OnboardingWizardProps {
  currentUser: User | null;
  onFinishWizard: (profile: UserProfile) => void;
  onCancel?: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  currentUser,
  onFinishWizard,
  onCancel
}) => {
  const currentProfile = currentUser ? StorageService.getUserProfile(currentUser.id) : null;

  // Step state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationMessage, setCalculationMessage] = useState('Analizăm profilul tău fitness...');

  // Form states
  const [goal, setGoal] = useState<FitnessGoal>(currentProfile?.goal || 'Slăbire');
  const [workoutDays, setWorkoutDays] = useState<number>(currentProfile?.workout_days || 3);
  const [preferredStyle, setPreferredStyle] = useState<CoachingStyle>(currentProfile?.preferred_style || 'Empatic');
  const [budget, setBudget] = useState<number>(currentProfile?.budget || 300);
  const [optInNotifications, setOptInNotifications] = useState<boolean>(
    currentProfile?.opt_in_notifications !== undefined ? currentProfile.opt_in_notifications : true
  );

  const goalOptions: Array<{
    id: FitnessGoal;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      id: 'Slăbire',
      title: 'Slăbire & Tonifiere',
      description: 'Deficit caloric sustenabil, arderea grăsimii și accelerarea metabolismului bazal.',
      icon: <Flame className="h-6 w-6 text-amber-400" />,
      color: 'hover:border-amber-500/50'
    },
    {
      id: 'Masă musculară',
      title: 'Hipertrofie & Forță',
      description: 'Construire musculară structurată, supraîncărcare progresivă și forță funcțională.',
      icon: <Dumbbell className="h-6 w-6 text-emerald-400" />,
      color: 'hover:border-emerald-500/50'
    },
    {
      id: 'Recuperare',
      title: 'Recuperare & Mobilitate',
      description: 'Corectarea posturii, eliminarea durerilor de spate și reabilitare funcțională.',
      icon: <HeartPulse className="h-6 w-6 text-cyan-400" />,
      color: 'hover:border-cyan-500/50'
    },
    {
      id: 'Rezistență',
      title: 'Rezistență & CrossFit',
      description: 'Condiționare cardiovasculară, capacitate de anduranță și circuite de intensitate.',
      icon: <Gauge className="h-6 w-6 text-indigo-400" />,
      color: 'hover:border-indigo-500/50'
    }
  ];

  const styleOptions: Array<{
    id: CoachingStyle;
    title: string;
    tagline: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'Strict',
      title: 'Strict & Disciplinat',
      tagline: 'Fără scuze, responsabilitate maximă',
      description: 'Ideal dacă ai nevoie de un impuls puternic, un standard ridicat de disciplină și monitorizare zilnică.',
      icon: <Shield className="h-5 w-5 text-amber-400" />
    },
    {
      id: 'Empatic',
      title: 'Empatic & Încurajator',
      tagline: 'Răbdare, suport moral și adaptare',
      description: 'Potrivit pentru începători sau persoane cu stil de viață aglomerat; adaptare la nivelul tău de stres și energie.',
      icon: <Smile className="h-5 w-5 text-emerald-400" />
    },
    {
      id: 'Tehnic',
      title: 'Tehnic & Științific',
      tagline: 'Biomecanică, cifre și eficiență',
      description: 'Exerciții explicate la nivel de pârghie musculară, periodizare matematică a volumului și optimizare fără riscuri.',
      icon: <Binary className="h-5 w-5 text-cyan-400" />
    }
  ];

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      // Final step -> trigger calculation simulation & save
      setIsCalculating(true);
      setCalculationMessage('Analizăm profilul și cerințele tale...');

      setTimeout(() => {
        setCalculationMessage('Comparăm compatibilitatea cu cei 8 antrenori din bază...');
      }, 700);

      setTimeout(() => {
        setCalculationMessage('Generăm Top 3 potriviri optime...');
      }, 1400);

      setTimeout(() => {
        const userId = currentUser ? currentUser.id : StorageService.getCurrentUserId();
        const updatedProfile = StorageService.updateUserProfilePartial(userId, {
          goal,
          workout_days: workoutDays,
          preferred_style: preferredStyle,
          budget,
          opt_in_notifications: optInNotifications
        });

        setIsCalculating(false);
        onFinishWizard(updatedProfile);
      }, 2100);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2);
    } else if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* Loading overlay during calculation */}
      {isCalculating && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090d16]/95 backdrop-blur-md p-6">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
            <Sparkles className="h-8 w-8 text-emerald-400 animate-pulse" />
          </div>
          <h3 className="mt-6 font-display text-xl font-bold text-white text-center">
            Calculăm Potrivirea Ideală
          </h3>
          <p className="mt-2 text-sm text-emerald-400 font-mono text-center">
            {calculationMessage}
          </p>
          <div className="mt-6 w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full animate-[pulse_1.5s_infinite]"></div>
          </div>
        </div>
      )}

      {/* Wizard Header & Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Pasul {step} din 3</span>
          <span className="text-emerald-400 font-semibold">
            {step === 1 ? 'Obiectiv Principal' : step === 2 ? 'Frecvență & Stil' : 'Buget & Finalizare'}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xs">
        
        {/* STEP 1: OBIECTIVUL PRINCIPAL */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">
                Care este obiectivul tău principal de fitness?
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Vom filtra antrenorii cu specializare directă și rezultate dovedite în această direcție.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {goalOptions.map((opt) => {
                const isSelected = goal === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setGoal(opt.id)}
                    className={`text-left p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-md shadow-emerald-500/5'
                        : 'border-slate-800 bg-slate-900/40 hover:bg-slate-800/40 ' + opt.color
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/50">
                        {opt.icon}
                      </div>
                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-emerald-500 bg-emerald-500 text-slate-950' : 'border-slate-700'
                      }`}>
                        {isSelected && <Check className="h-3 w-3 stroke-3" />}
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="font-display font-bold text-base text-white">
                        {opt.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: FRECVENȚA ȘI STILUL DORIT */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">
                Frecvență săptămânală & Stil de coaching preferat
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Cum îți dorești să se desfășoare relația de colaborare și cât timp poți aloca antrenamentelor.
              </p>
            </div>

            {/* Subsection A: Workout frequency */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-200 block">
                Câte zile pe săptămână dorești să te antrenezi?
              </label>
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {[2, 3, 4, 5, 6].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setWorkoutDays(days)}
                    className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      workoutDays === days
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400 font-bold shadow-xs'
                        : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-lg font-display tabular-nums">{days}</div>
                    <div className="text-[11px] text-slate-400">zile / săpt</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 italic">
                {workoutDays <= 3 && 'Recomandat pentru menținere, începători sau programe Full Body.'}
                {workoutDays === 4 && 'Echilibru ideal între stimul muscular și refacere completă (ex: Upper / Lower split).'}
                {workoutDays >= 5 && 'Intensiv pentru sportivi cu experiență sau împărțire pe grupe specifice de mușchi.'}
              </p>
            </div>

            {/* Subsection B: Coaching Style */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <label className="text-sm font-semibold text-slate-200 block">
                Ce stil de comunicare și abordare preferi de la antrenor?
              </label>

              <div className="space-y-3">
                {styleOptions.map((st) => {
                  const isSelected = preferredStyle === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setPreferredStyle(st.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-slate-800 bg-slate-900/40 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 shrink-0 mt-0.5">
                          {st.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-sm text-white">
                              {st.title}
                            </span>
                            <span className="text-xs text-slate-400">· {st.tagline}</span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1">
                            {st.description}
                          </p>
                        </div>
                      </div>

                      <div className={`h-5 w-5 rounded-full border shrink-0 flex items-center justify-center ${
                        isSelected ? 'border-emerald-500 bg-emerald-500 text-slate-950' : 'border-slate-700'
                      }`}>
                        {isSelected && <Check className="h-3 w-3 stroke-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: BUGETUL LUNAR ȘI NOTIFICĂRILE */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">
                Bugetul lunar disponibil pentru coaching
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Alege un prag confortabil. Algoritmul va prioritizează antrenorii care se încadrează în intervalul tău.
              </p>
            </div>

            {/* Budget Presets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { tier: 1, label: 'Accesibil / Buget', range: '150 - 250 RON', val: 220, desc: 'Plan de antrenament + ghid alimentar' },
                { tier: 2, label: 'Standard / Mediu', range: '300 - 450 RON', val: 380, desc: 'Check-in săptămânal & feedback video' },
                { tier: 3, label: 'Premium / Dedicat', range: '500 - 700+ RON', val: 580, desc: 'Monitorizare zilnică & adaptare continuă' }
              ].map((p) => {
                const isSelected = (p.tier === 1 && budget <= 250) || (p.tier === 2 && budget > 250 && budget <= 450) || (p.tier === 3 && budget > 450);
                return (
                  <button
                    key={p.tier}
                    type="button"
                    onClick={() => setBudget(p.val)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/15'
                        : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                      Tier {p.tier}
                    </div>
                    <div className="font-display font-bold text-white mt-1">
                      {p.range}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {p.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Fine-tuning Budget Slider */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-300">Sumă exactă planificată:</span>
                <span className="font-display text-xl font-bold text-emerald-400 tabular-nums">
                  {budget} RON / lună
                </span>
              </div>
              <input
                type="range"
                min="150"
                max="800"
                step="25"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>150 RON (Buget)</span>
                <span>400 RON (Mediu)</span>
                <span>800 RON (Premium)</span>
              </div>
            </div>

            {/* Daily Notifications Opt-in Toggle */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-sm text-white">
                    Activează recomandările zilnice automate (n8n Webhook)
                  </h3>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Primește în fiecare dimineață sfaturi acționabile personalizate în funcție de obiectivul tău ({goal}) și sincronizează-te cu fluxurile automate.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={optInNotifications}
                  onChange={(e) => setOptInNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>
        )}

        {/* Wizard Navigation Action Controls */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevStep}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{step === 1 ? 'Înapoi' : 'Pasul anterior'}</span>
          </button>

          <button
            type="button"
            onClick={handleNextStep}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/10 cursor-pointer"
          >
            <span>{step === 3 ? 'Calculează Potrivirile (Top 3)' : 'Continuă'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
