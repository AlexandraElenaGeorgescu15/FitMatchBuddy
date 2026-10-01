import React, { useState } from 'react';
import { Coach, User, UserProfile, DailyTip } from '../types';
import { StorageService } from '../services/storage';
import { INITIAL_DAILY_TIPS } from '../data/initialData';
import { 
  Dumbbell, 
  Calendar, 
  Sparkles, 
  Bell, 
  BellOff, 
  MessageSquare, 
  RefreshCw, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight, 
  Flame, 
  Target,
  Send,
  X
} from 'lucide-react';

interface UserDashboardProps {
  currentUser: User | null;
  onNavigateToWizard: () => void;
  onNavigateToCoaches: () => void;
  onOpenCoachDetail: (coach: Coach) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  onNavigateToWizard,
  onNavigateToCoaches,
  onOpenCoachDetail
}) => {
  const userId = currentUser ? currentUser.id : StorageService.getCurrentUserId();
  const profile = StorageService.getUserProfile(userId) || {
    user_id: userId,
    goal: 'Slăbire',
    preferred_style: 'Empatic',
    budget: 300,
    workout_days: 4,
    matched_coach_id: 'coach-2',
    opt_in_notifications: true
  };

  const coaches = StorageService.getCoaches();
  const matchedCoach = profile.matched_coach_id
    ? coaches.find(c => c.id === profile.matched_coach_id) || null
    : null;

  // Local state for notification toggle
  const [optIn, setOptIn] = useState<boolean>(profile.opt_in_notifications);
  const [toggleSuccessToast, setToggleSuccessToast] = useState(false);

  // Daily tip cycling
  const relevantTips = INITIAL_DAILY_TIPS.filter(
    t => t.targetGoal === profile.goal || t.targetGoal === 'Toate'
  );
  const [tipIndex, setTipIndex] = useState(0);
  const currentTip = relevantTips[tipIndex % relevantTips.length] || INITIAL_DAILY_TIPS[0];

  // Quick simulated chat modal
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'coach'; text: string; time: string }>>([
    {
      sender: 'coach',
      text: `Salut ${currentUser?.name.split(' ')[0] || 'sportivule'}! Sunt gata să te ghidez către obiectivul tău de ${profile.goal}. Ai întrebări despre planul săptămânal?`,
      time: '09:00'
    }
  ]);

  const handleToggleNotifications = (newValue: boolean) => {
    setOptIn(newValue);
    StorageService.updateUserProfilePartial(userId, { opt_in_notifications: newValue });
    setToggleSuccessToast(true);
    setTimeout(() => setToggleSuccessToast(false), 3000);
  };

  const handleNextTip = () => {
    setTipIndex(prev => prev + 1);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage;
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: userText, time: 'Acum' }
    ]);
    setChatMessage('');

    // Automatic coach response after 1s
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'coach',
          text: `Mulțumesc pentru mesaj! Am notat detaliile și voi include ajustările în următorul check-in. Continuă cu consecvență!`,
          time: 'Acum'
        }
      ]);
    }, 1200);
  };

  // Generate workout days split based on workout_days & goal
  const generateWorkoutSplit = (days: number, goal: string) => {
    if (days === 2) {
      return [
        { day: 'Ziua 1', title: 'Full Body A (Forță & Exerciții Compuse)', duration: '60 min', focus: 'Piept, Picioare, Spate' },
        { day: 'Ziua 2', title: 'Full Body B (Condiționare & Core)', duration: '55 min', focus: 'Umeri, Ischiogambieri, Abdomen' }
      ];
    }
    if (days === 3) {
      return [
        { day: 'Ziua 1', title: 'Push (Piept, Umeri, Triceps)', duration: '60 min', focus: 'Împins cu haltera, Fluturări, Extensii' },
        { day: 'Ziua 2', title: 'Pull (Spate, Biceps, Deltoid posterior)', duration: '60 min', focus: 'Tracțiuni, Ramat, Flexii' },
        { day: 'Ziua 3', title: 'Legs & Core (Picioare complet & Trunchi)', duration: '65 min', focus: 'Genuflexiuni, Îndreptări românești' }
      ];
    }
    if (days === 4) {
      return [
        { day: 'Ziua 1', title: 'Upper Body (Forță Trunchi)', duration: '60 min', focus: 'Supraîncărcare piept & spate' },
        { day: 'Ziua 2', title: 'Lower Body (Picioare Quad-focus & Gambe)', duration: '60 min', focus: 'Presă, Genuflexiuni bulgărești' },
        { day: 'Ziua 3', title: 'Upper Body (Hipertrofie & Izolare)', duration: '55 min', focus: 'Umeri laterali, Brațe, Spate' },
        { day: 'Ziua 4', title: 'Lower Body & Conditioning / HIIT', duration: '50 min', focus: 'Fesieri, Core & Cardio Zone 2' }
      ];
    }
    return [
      { day: 'Ziua 1', title: 'Piept & Triceps', duration: '55 min', focus: 'Dezvoltare pectoral și brațe' },
      { day: 'Ziua 2', title: 'Spate & Biceps', duration: '60 min', focus: 'Lățime dorsală și tracțiuni' },
      { day: 'Ziua 3', title: 'Picioare (Quads & Gambe)', duration: '65 min', focus: 'Forță membre inferioare' },
      { day: 'Ziua 4', title: 'Umeri & Abdomen', duration: '50 min', focus: 'Deltoizi și stabilitate core' },
      { day: 'Ziua 5', title: 'Ischiogambieri, Fesieri & Cardio', duration: '50 min', focus: 'Lanț posterior și capacitate aerobă' }
    ];
  };

  const workoutSchedule = generateWorkoutSplit(profile.workout_days, profile.goal);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Toast feedback when notifications are toggled */}
      {toggleSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-slate-900 px-4 py-3 text-xs font-semibold text-emerald-400 shadow-2xl">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Preferința de notificare a fost salvată în profil!</span>
        </div>
      )}

      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Dashboard Personal
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
            Bine ai revenit, {currentUser?.name || 'Sportivule'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Obiectiv curent: <strong className="text-slate-200">{profile.goal}</strong> · Stil:{' '}
            <strong className="text-slate-200">{profile.preferred_style}</strong> · Frecvență:{' '}
            <strong className="text-slate-200">{profile.workout_days} zile/săptămână</strong>
          </p>
        </div>

        {/* Quick notification toggle */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3 self-start md:self-auto">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            {optIn ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4 text-slate-400" />}
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-white">Notificări Zilnice n8n</div>
            <div className="text-[11px] text-slate-400">
              {optIn ? 'Active (Primești sfaturi la 08:00)' : 'Dezactivate'}
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer ml-2">
            <input
              type="checkbox"
              checked={optIn}
              onChange={(e) => handleToggleNotifications(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>
      </div>

      {/* Main Grid: Coach Section + Daily Tip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column (7 cols): Selected Coach Profile & Quick Actions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-400" />
                <span>Antrenorul Tău Desemnat</span>
              </h2>
              <button
                onClick={onNavigateToWizard}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 cursor-pointer"
              >
                Schimbă / Recalibrează →
              </button>
            </div>

            {matchedCoach ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-xl bg-slate-800 border border-slate-700">
                    <img
                      src={matchedCoach.image_url}
                      alt={matchedCoach.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-1.5 right-1.5 rounded bg-[#090d16]/90 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                      ★ {matchedCoach.rating || 4.9}
                    </div>
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="font-semibold text-emerald-400">{matchedCoach.specialty}</span>
                      <span aria-hidden="true">·</span>
                      <span>Stil {matchedCoach.style}</span>
                      <span aria-hidden="true">·</span>
                      <span>Tier {matchedCoach.price_tier}</span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-white">
                      {matchedCoach.name}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {matchedCoach.bio}
                    </p>

                    <div className="pt-1 flex items-center gap-3 text-xs text-slate-300 font-mono">
                      <span>Tarif lunar: <strong className="text-emerald-400">{matchedCoach.monthly_rate_ron || 300} RON</strong></span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Scrie-i Antrenorului</span>
                  </button>

                  <button
                    onClick={() => onOpenCoachDetail(matchedCoach)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Certificări & CV</span>
                  </button>

                  <button
                    onClick={onNavigateToCoaches}
                    className="text-xs text-slate-400 hover:text-slate-200 ml-auto cursor-pointer"
                  >
                    Explorează alți antrenori
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <p className="text-sm text-slate-300">
                  Nu ai selectat încă un antrenor dedicat profilului tău.
                </p>
                <button
                  onClick={onNavigateToWizard}
                  className="rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer"
                >
                  Lansează Chestionarul de Potrivire
                </button>
              </div>
            )}
          </div>

          {/* Weekly Training Split Plan */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                  <span>Structură Plan Săptămânal ({profile.workout_days} Zile)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calibrat pentru obiectivul de <strong>{profile.goal}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {workoutSchedule.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                      {item.day}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">{item.title}</div>
                      <div className="text-xs text-slate-400">{item.focus}</div>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-slate-400 sm:text-right shrink-0">
                    {item.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column (5 cols): Daily Automated Recommendation & Webhook preview */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Daily Automated Tip Card */}
          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 via-slate-900/80 to-slate-900 p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Sfatul Zilei · {currentTip.category}
                </span>
              </div>
              <button
                onClick={handleNextTip}
                title="Generează alt sfat"
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Alt sfat</span>
              </button>
            </div>

            <h3 className="font-display text-lg font-bold text-white leading-snug">
              {currentTip.title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentTip.content}
            </p>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-1.5">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                Acțiune Concretă de Azi:
              </div>
              <p className="text-xs text-slate-200 font-medium">
                {currentTip.actionableStep}
              </p>
            </div>
          </div>

          {/* n8n Automation Status Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                <Bell className="h-4 w-4 text-cyan-400" />
                <span>Sincronizare Automată n8n</span>
              </h3>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                optIn ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
              }`}>
                {optIn ? 'Subscris' : 'Inactiv'}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {optIn 
                ? 'Profilul tău este inclus în lista de expediere zilnică la endpoint-ul webhook n8n configurat de administrator.'
                : 'Notificările sunt oprite. Activează comutatorul de sus dacă dorești să primești recomandarea zilnică.'
              }
            </p>

            {optIn && (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-[11px] font-mono text-slate-300 space-y-1 overflow-x-auto">
                <div className="text-slate-400">// Exemplu payload trimis pentru tine:</div>
                <div className="text-emerald-400">user: "{currentUser?.email || 'alexandra@fitmatch.ro'}"</div>
                <div className="text-cyan-400">goal: "{profile.goal}"</div>
                <div className="text-slate-300">coach: "{matchedCoach?.name || 'Neselectat'}"</div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Simulated Coach Chat Modal */}
      {isChatOpen && matchedCoach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl flex flex-col h-[500px]">
            
            {/* Chat header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={matchedCoach.image_url}
                  alt={matchedCoach.name}
                  className="h-10 w-10 rounded-full object-cover border border-emerald-500/40"
                />
                <div>
                  <h4 className="font-display text-sm font-bold text-white">{matchedCoach.name}</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                    <span>Disponibil pentru feedback</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat message history */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none'
                        : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                    }`}
                  >
                    <div>{msg.text}</div>
                    <div className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-slate-900/70' : 'text-slate-400'}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat input box */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Scrie o întrebare despre antrenament..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="rounded-xl bg-emerald-500 p-2.5 text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
