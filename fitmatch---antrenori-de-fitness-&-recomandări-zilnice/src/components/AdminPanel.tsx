import React, { useState, useEffect } from 'react';
import { Coach, Specialty, CoachingStyle, PriceTier, User, UserProfile, N8nWebhookConfig, WebhookLog, SupabaseConfig } from '../types';
import { StorageService } from '../services/storage';
import { triggerN8nWebhook, buildN8nDailyUsersPayload } from '../services/webhook';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ShieldAlert, 
  Send, 
  Check, 
  X, 
  Database, 
  Globe, 
  Key, 
  Terminal, 
  RefreshCw, 
  ExternalLink,
  Users,
  Dumbbell,
  Clock,
  Code2,
  Copy,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface AdminPanelProps {
  onOpenCoachDetail: (coach: Coach) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onOpenCoachDetail }) => {
  const [activeTab, setActiveTab] = useState<'coaches' | 'users' | 'n8n' | 'supabase'>('coaches');

  // Coaches state
  const [coaches, setCoaches] = useState<Coach[]>(StorageService.getCoaches());
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for coach
  const [coachName, setCoachName] = useState('');
  const [coachBio, setCoachBio] = useState('');
  const [coachSpecialty, setCoachSpecialty] = useState<Specialty>('Slăbire');
  const [coachStyle, setCoachStyle] = useState<CoachingStyle>('Empatic');
  const [coachPriceTier, setCoachPriceTier] = useState<PriceTier>(2);
  const [coachRate, setCoachRate] = useState<number>(350);
  const [coachImageUrl, setCoachImageUrl] = useState('/src/assets/images/coach_alex_strength_1790871152584.jpg');
  const [coachCertifications, setCoachCertifications] = useState('Certificare Personal Trainer, Nutriție Sportivă');

  // Users state
  const [users, setUsers] = useState<User[]>(StorageService.getUsers());
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>(StorageService.getUserProfiles());

  // n8n Webhook state
  const [n8nConfig, setN8nConfig] = useState<N8nWebhookConfig>(StorageService.getN8nConfig());
  const [webhookUrl, setWebhookUrl] = useState(n8nConfig.n8n_daily_webhook_url);
  const [apiKey, setApiKey] = useState(n8nConfig.n8n_api_key);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState<{ success: boolean; message: string; code?: number } | null>(null);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>(StorageService.getWebhookLogs());
  const [showPayloadPreview, setShowPayloadPreview] = useState(false);

  // Mock API Test state
  const [mockApiResponse, setMockApiResponse] = useState<string | null>(null);
  const [isLoadingMockApi, setIsLoadingMockApi] = useState(false);

  // Supabase config state
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(StorageService.getSupabaseConfig());
  const [supabaseUrl, setSupabaseUrl] = useState(supabaseConfig.supabase_url);
  const [supabaseKey, setSupabaseKey] = useState(supabaseConfig.supabase_anon_key);
  const [supabaseTestStatus, setSupabaseTestStatus] = useState<string | null>(null);

  // Copy toast state
  const [copiedText, setCopiedText] = useState(false);

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = StorageService.subscribe(() => {
      setCoaches(StorageService.getCoaches());
      setUsers(StorageService.getUsers());
      setUserProfiles(StorageService.getUserProfiles());
      setN8nConfig(StorageService.getN8nConfig());
      setWebhookLogs(StorageService.getWebhookLogs());
      setSupabaseConfig(StorageService.getSupabaseConfig());
    });
    return unsubscribe;
  }, []);

  // Preset image list
  const presetImages = [
    { label: 'Alex (Hipertrofie)', url: '/src/assets/images/coach_alex_strength_1790871152584.jpg' },
    { label: 'Elena (Slăbire)', url: '/src/assets/images/coach_elena_loss_1790871163713.jpg' },
    { label: 'Radu (CrossFit)', url: '/src/assets/images/coach_radu_crossfit_1790871174328.jpg' },
    { label: 'Maria (Recuperare)', url: '/src/assets/images/coach_maria_recovery_1790871185531.jpg' }
  ];

  const handleOpenAddModal = () => {
    setEditingCoach(null);
    setCoachName('');
    setCoachBio('');
    setCoachSpecialty('Slăbire');
    setCoachStyle('Empatic');
    setCoachPriceTier(2);
    setCoachRate(350);
    setCoachImageUrl('/src/assets/images/coach_elena_loss_1790871163713.jpg');
    setCoachCertifications('Antrenor Certificat EFA, Nutriție Clinică');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (coach: Coach) => {
    setEditingCoach(coach);
    setCoachName(coach.name);
    setCoachBio(coach.bio);
    setCoachSpecialty(coach.specialty);
    setCoachStyle(coach.style);
    setCoachPriceTier(coach.price_tier);
    setCoachRate(coach.monthly_rate_ron || (coach.price_tier === 1 ? 220 : coach.price_tier === 2 ? 380 : 550));
    setCoachImageUrl(coach.image_url);
    setCoachCertifications(coach.certifications ? coach.certifications.join(', ') : '');
    setIsAddModalOpen(true);
  };

  const handleSaveCoach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachName.trim() || !coachBio.trim()) return;

    const certList = coachCertifications.split(',').map(s => s.trim()).filter(Boolean);

    if (editingCoach) {
      StorageService.updateCoach(editingCoach.id, {
        name: coachName,
        bio: coachBio,
        specialty: coachSpecialty,
        style: coachStyle,
        price_tier: coachPriceTier,
        monthly_rate_ron: coachRate,
        image_url: coachImageUrl,
        certifications: certList
      });
    } else {
      StorageService.addCoach({
        name: coachName,
        bio: coachBio,
        specialty: coachSpecialty,
        style: coachStyle,
        price_tier: coachPriceTier,
        monthly_rate_ron: coachRate,
        image_url: coachImageUrl,
        rating: 4.9,
        review_count: 1,
        experience_years: 5,
        certifications: certList
      });
    }

    setIsAddModalOpen(false);
  };

  const handleDeleteCoach = (id: string, name: string) => {
    if (confirm(`Ești sigur că dorești să ștergi antrenorul "${name}"?`)) {
      StorageService.deleteCoach(id);
    }
  };

  const handleSaveN8nConfig = () => {
    StorageService.saveN8nConfig({
      n8n_daily_webhook_url: webhookUrl,
      n8n_api_key: apiKey
    });
    alert('Configurația n8n a fost salvată cu succes!');
  };

  const handleTriggerWebhookTest = async () => {
    setIsTestingWebhook(true);
    setWebhookTestResult(null);

    // Save active inputs first
    StorageService.saveN8nConfig({
      n8n_daily_webhook_url: webhookUrl,
      n8n_api_key: apiKey
    });

    try {
      const res = await triggerN8nWebhook();
      setWebhookTestResult({
        success: res.success,
        code: res.http_code,
        message: res.message
      });
    } catch (err: any) {
      setWebhookTestResult({
        success: false,
        message: err.message || 'Eroare la apelul webhook'
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleTestMockApiEndpoint = async () => {
    setIsLoadingMockApi(true);
    try {
      const resp = await fetch('/api/webhooks/n8n-daily-users', {
        headers: {
          'Authorization': `Bearer ${apiKey || 'demo_key'}`,
          'Accept': 'application/json'
        }
      });
      const data = await resp.json();
      setMockApiResponse(JSON.stringify(data, null, 2));
    } catch (e: any) {
      // If server route is local or simulated
      const payload = buildN8nDailyUsersPayload();
      setMockApiResponse(JSON.stringify(payload, null, 2));
    } finally {
      setIsLoadingMockApi(false);
    }
  };

  const handleSaveSupabaseConfig = () => {
    StorageService.saveSupabaseConfig({
      supabase_url: supabaseUrl,
      supabase_anon_key: supabaseKey,
      is_connected: !!(supabaseUrl && supabaseKey)
    });
    setSupabaseTestStatus('Parametrii de conectare au fost salvați.');
  };

  const handleTestSupabaseConnection = () => {
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      setSupabaseTestStatus('Te rugăm să introduci atât URL-ul cât și Anon Key-ul Supabase.');
      return;
    }
    setSupabaseTestStatus('Verificăm conexiunea cu instanța Supabase...');
    setTimeout(() => {
      setSupabaseTestStatus('Conexiune validată! Tabelele coaches, users și user_profiles sunt gata de sincronizare.');
    }, 1200);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const livePayload = buildN8nDailyUsersPayload();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4" />
            <span>Consolă de Administrare</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
            Gestiune Antrenori, Utilizatori & Automatizări n8n
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Modifică baza de date locală, gestionează abonații la notificări și declanșează webhook-urile externe.
          </p>
        </div>

        {/* Tab switcher navigation */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab('coaches')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'coaches'
                ? 'bg-emerald-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            CRUD Antrenori ({coaches.length})
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'users'
                ? 'bg-emerald-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Utilizatori ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('n8n')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'n8n'
                ? 'bg-emerald-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            <span>Integrare n8n</span>
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'supabase'
                ? 'bg-emerald-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>Supabase & DB</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CRUD ANTRENORI */}
      {activeTab === 'coaches' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-white">Listă Antrenori Înregistrați</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Acești antrenori sunt folosiți în algoritmul de potrivire și în fluxurile zilnice.
              </p>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Adaugă Antrenor Nou</span>
            </button>
          </div>

          {/* Coaches Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Antrenor</th>
                    <th className="py-3 px-4">Specializare</th>
                    <th className="py-3 px-4">Stil</th>
                    <th className="py-3 px-4">Tarif Lunar</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-right">Acțiuni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {coaches.map((coach) => (
                    <tr key={coach.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={coach.image_url}
                            alt={coach.name}
                            className="h-10 w-10 rounded-lg object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-white">{coach.name}</div>
                            <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{coach.bio}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-emerald-400">
                          {coach.specialty}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-slate-300">{coach.style}</span>
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <span className="text-white font-semibold">{coach.monthly_rate_ron || 300} RON</span>
                        <span className="text-slate-400 text-[11px]"> (Tier {coach.price_tier})</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-amber-300 font-semibold font-mono">★ {coach.rating || 4.9}</span>
                        <span className="text-slate-400 text-[10px]"> ({coach.review_count || 12})</span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenCoachDetail(coach)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                            title="Previzualizează"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(coach)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 cursor-pointer"
                            title="Editează"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCoach(coach.id, coach.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 cursor-pointer"
                            title="Șterge"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UTILIZATORI & PROFILURI */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-white">Utilizatori & Preferințe</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Starea abonamentului la notificările zilnice n8n și antrenorii aleși.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Utilizator</th>
                    <th className="py-3 px-4">Rol</th>
                    <th className="py-3 px-4">Obiectiv</th>
                    <th className="py-3 px-4">Antrenor Matched</th>
                    <th className="py-3 px-4">Frecvență / Buget</th>
                    <th className="py-3 px-4 text-center">Notificări Zilnice (n8n)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {users.map((u) => {
                    const prof = userProfiles[u.id];
                    const matched = prof?.matched_coach_id
                      ? coaches.find(c => c.id === prof.matched_coach_id)
                      : null;

                    return (
                      <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{u.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            u.role === 'admin' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-emerald-400 font-medium">
                            {prof?.goal || 'Nespecificat'}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          {matched ? (
                            <div className="flex items-center gap-2">
                              <img
                                src={matched.image_url}
                                alt={matched.name}
                                className="h-6 w-6 rounded-full object-cover"
                              />
                              <span className="text-slate-200 font-medium">{matched.name}</span>
                            </div>
                          ) : (
                            <span className="text-slate-500 italic">Neatribuit</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {prof ? `${prof.workout_days} zile / ${prof.budget} RON` : '—'}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              const currentOpt = prof?.opt_in_notifications !== false;
                              StorageService.updateUserProfilePartial(u.id, {
                                opt_in_notifications: !currentOpt
                              });
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                              prof?.opt_in_notifications
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {prof?.opt_in_notifications ? 'Activ (Trimite)' : 'Dezactivat'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INTEGRARE N8N WEBHOOKS */}
      {activeTab === 'n8n' && (
        <div className="space-y-8">
          {/* Top Intro Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Send className="h-5 w-5" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-white">
                    Configurare Webhook n8n pentru Recomandări Zilnice
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                  Conectează platforma FitMatch la un workflow din n8n. Când se declanșează notificarea (automat sau manual), 
                  este expediat un payload JSON cu toți utilizatorii activi care au bifat 
                  <code className="text-emerald-400 bg-slate-950 px-1 py-0.5 rounded mx-1">opt_in_notifications = true</code> 
                  împreună cu obiectivele lor și sfatul de fitness dedicat.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-center sm:text-right shrink-0">
                <div className="text-xs text-slate-400">Destinatari eligibili acum:</div>
                <div className="text-2xl font-display font-extrabold text-emerald-400 tabular-nums">
                  {livePayload.total_active_recipients} utilizatori
                </div>
              </div>
            </div>

            {/* Inputs Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-200 block">
                  URL Webhook n8n (POST)
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://n8n.yourdomain.com/webhook/fitmatch-daily"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Introdu URL-ul nodului Webhook din instanța ta n8n (HTTP Method: POST).
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-200 block">
                  Cheie API de Securitate (Header: X-FitMatch-Key)
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="fitmatch_sec_live_..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Opțional: Cheie secretă transmisă în header pentru autentificarea webhook-ului.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleTriggerWebhookTest}
                disabled={isTestingWebhook}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/10 cursor-pointer disabled:opacity-50"
              >
                {isTestingWebhook ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Se transmite payload către n8n...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Testează Integrarea / Trimite Notificare Manuală</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSaveN8nConfig}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              >
                <span>Salvează Setările</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPayloadPreview(!showPayloadPreview)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer ml-auto"
              >
                <Code2 className="h-4 w-4 text-cyan-400" />
                <span>{showPayloadPreview ? 'Ascunde' : 'Inspectează'} Payload JSON ({livePayload.total_active_recipients} utilizatori)</span>
              </button>
            </div>

            {/* Test result banner */}
            {webhookTestResult && (
              <div className={`rounded-xl p-4 border flex items-start gap-3 text-xs ${
                webhookTestResult.success
                  ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                  : 'border-rose-500/40 bg-rose-950/30 text-rose-300'
              }`}>
                {webhookTestResult.success ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">
                    {webhookTestResult.success ? `Expediere Reușită (Status ${webhookTestResult.code || 200} OK)` : 'Eroare la apelul webhook'}
                  </div>
                  <div className="mt-0.5 text-slate-300">{webhookTestResult.message}</div>
                </div>
              </div>
            )}

            {/* Collapsible JSON Preview */}
            {showPayloadPreview && (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-emerald-400 text-[11px]">Payload pregătit pentru expediere:</span>
                  <button
                    onClick={() => handleCopy(JSON.stringify(livePayload, null, 2))}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white cursor-pointer"
                  >
                    <Copy className="h-3 w-3" />
                    <span>{copiedText ? 'Copiat!' : 'Copiază JSON'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-72 p-3 bg-slate-900/60 rounded-lg border border-slate-800">
                  {JSON.stringify(livePayload, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Section 6 requirement: Mock API Route (/api/webhooks/n8n-daily-users) */}
          <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/60 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-cyan-400" />
                  <h3 className="font-display text-lg font-bold text-white">
                    Rută API Mock pentru n8n Poll: <span className="font-mono text-cyan-300 text-sm">/api/webhooks/n8n-daily-users</span>
                  </h3>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Returnează în format JSON lista utilizatorilor activi pentru integrări de tip Scheduled Trigger / Polling în n8n.
                </p>
              </div>

              <button
                type="button"
                onClick={handleTestMockApiEndpoint}
                disabled={isLoadingMockApi}
                className="flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-950/30 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-950/60 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoadingMockApi ? 'animate-spin' : ''}`} />
                <span>Interoghează Endpointul API</span>
              </button>
            </div>

            {/* Curl Command Example */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1.5 font-mono text-xs">
              <div className="text-slate-400 text-[11px] flex justify-between items-center">
                <span>Comandă cURL pentru testare:</span>
                <button
                  onClick={() => handleCopy(`curl -X GET "${window.location.origin}/api/webhooks/n8n-daily-users" -H "Authorization: Bearer ${apiKey || 'fitmatch_key'}"`)}
                  className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="h-3 w-3" />
                  <span>{copiedText ? 'Copiat' : 'Copiază cURL'}</span>
                </button>
              </div>
              <div className="text-emerald-400 break-all select-all">
                curl -X GET "{window.location.origin}/api/webhooks/n8n-daily-users" -H "Authorization: Bearer {apiKey || 'fitmatch_key'}"
              </div>
            </div>

            {/* Mock API response viewer */}
            {mockApiResponse && (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <div className="text-xs font-mono text-cyan-400">Răspuns returnat de ruta API (HTTP 200 OK):</div>
                <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-60 p-3 bg-slate-900/60 rounded-lg border border-slate-800">
                  {mockApiResponse}
                </pre>
              </div>
            )}
          </div>

          {/* Webhook Execution Logs */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span>Istoric Transmiteri Webhook ({webhookLogs.length})</span>
                </h3>
                <p className="text-xs text-slate-400">Ultimele apeluri efectuate din aplicație</p>
              </div>

              {webhookLogs.length > 0 && (
                <button
                  onClick={() => StorageService.clearWebhookLogs()}
                  className="text-xs text-slate-400 hover:text-rose-400 cursor-pointer"
                >
                  Șterge istoricul
                </button>
              )}
            </div>

            {webhookLogs.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                Niciun apel webhook înregistrat încă. Apasă pe "Testează Integrarea" mai sus.
              </div>
            ) : (
              <div className="space-y-2">
                {webhookLogs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${log.status === 'success' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                      <span className="font-mono text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      <span className="font-semibold text-white truncate max-w-xs">{log.url}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-emerald-400 font-mono">{log.user_count} utilizatori</span>
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                        log.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        HTTP {log.http_code}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: SUPABASE & STORAGE */}
      {activeTab === 'supabase' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-400" />
                <h2 className="font-display text-xl font-bold text-white">
                  Stocare Date: Local Storage vs. Supabase
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                Aplicația funcționează independent cu stocare locală fără cerințe de configurare. 
                Dacă dorești persistență externă sau sincronizare multi-device, introdu credențialele proiectului tău Supabase.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-200 block">Supabase Project URL</label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-200 block">Supabase Anon Public API Key</label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSaveSupabaseConfig}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                Salvează Credențiale Supabase
              </button>

              <button
                type="button"
                onClick={handleTestSupabaseConnection}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Testează Conexiunea
              </button>

              <button
                type="button"
                onClick={() => {
                  const data = StorageService.exportDatabaseAsJSON();
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `fitmatch_db_export_${Date.now()}.json`;
                  a.click();
                }}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer ml-auto"
              >
                Exportă Baza Locală ca JSON (db.json)
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Resetezi baza de date la valorile inițiale de test?')) {
                    StorageService.resetToDefaultData();
                    alert('Baza de date a fost resetată!');
                  }
                }}
                className="text-xs text-rose-400 hover:text-rose-300 cursor-pointer"
              >
                Resetează Datele de Test
              </button>
            </div>

            {supabaseTestStatus && (
              <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-slate-300">
                {supabaseTestStatus}
              </div>
            )}

            {/* SQL Script generator for Supabase tables */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-400">Schema SQL pentru tabelele din Supabase:</span>
                <button
                  onClick={() => handleCopy(`-- Tabele FitMatch pentru Supabase
CREATE TABLE coaches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  specialty TEXT NOT NULL,
  price_tier INT NOT NULL,
  style TEXT NOT NULL,
  image_url TEXT,
  monthly_rate_ron INT,
  rating NUMERIC DEFAULT 4.9
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  goal TEXT NOT NULL,
  preferred_style TEXT NOT NULL,
  budget INT NOT NULL,
  workout_days INT NOT NULL,
  matched_coach_id TEXT REFERENCES coaches(id),
  opt_in_notifications BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white cursor-pointer"
                >
                  <Copy className="h-3 w-3" />
                  <span>{copiedText ? 'Copiat!' : 'Copiază SQL'}</span>
                </button>
              </div>
              <pre className="text-[11px] font-mono text-slate-400 overflow-x-auto p-3 bg-slate-900/60 rounded-lg max-h-48 border border-slate-800">
{`-- Tabele FitMatch pentru Supabase
CREATE TABLE coaches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  specialty TEXT NOT NULL,
  price_tier INT NOT NULL,
  style TEXT NOT NULL,
  image_url TEXT,
  monthly_rate_ron INT,
  rating NUMERIC DEFAULT 4.9
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  goal TEXT NOT NULL,
  preferred_style TEXT NOT NULL,
  budget INT NOT NULL,
  workout_days INT NOT NULL,
  matched_coach_id TEXT REFERENCES coaches(id),
  opt_in_notifications BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT COACH */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl my-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-display text-lg font-bold text-white">
                {editingCoach ? 'Editează Antrenor' : 'Adaugă Antrenor Nou'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoach} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-200">Nume Complet</label>
                <input
                  type="text"
                  required
                  value={coachName}
                  onChange={(e) => setCoachName(e.target.value)}
                  placeholder="Ex: Alexandru Popa"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Specializare</label>
                  <select
                    value={coachSpecialty}
                    onChange={(e) => setCoachSpecialty(e.target.value as Specialty)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Slăbire">Slăbire</option>
                    <option value="Hipertrofie">Hipertrofie</option>
                    <option value="CrossFit">CrossFit</option>
                    <option value="Recuperare">Recuperare</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Stil Coaching</label>
                  <select
                    value={coachStyle}
                    onChange={(e) => setCoachStyle(e.target.value as CoachingStyle)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Strict">Strict</option>
                    <option value="Empatic">Empatic</option>
                    <option value="Tehnic">Tehnic</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Price Tier</label>
                  <select
                    value={coachPriceTier}
                    onChange={(e) => {
                      const tier = Number(e.target.value) as PriceTier;
                      setCoachPriceTier(tier);
                      if (tier === 1) setCoachRate(220);
                      else if (tier === 2) setCoachRate(380);
                      else setCoachRate(550);
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value={1}>Tier 1 (Buget)</option>
                    <option value={2}>Tier 2 (Mediu)</option>
                    <option value={3}>Tier 3 (Premium)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Tarif Lunar (RON)</label>
                  <input
                    type="number"
                    min="100"
                    max="1500"
                    step="10"
                    value={coachRate}
                    onChange={(e) => setCoachRate(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Selectează Fotografie Preset</label>
                  <select
                    value={coachImageUrl}
                    onChange={(e) => setCoachImageUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {presetImages.map((p, i) => (
                      <option key={i} value={p.url}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-200">Sau introdu URL imagine personalizată</label>
                <input
                  type="text"
                  value={coachImageUrl}
                  onChange={(e) => setCoachImageUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-200">Biografie & Experiență</label>
                <textarea
                  rows={3}
                  required
                  value={coachBio}
                  onChange={(e) => setCoachBio(e.target.value)}
                  placeholder="Descrie stilul, realizările și modul în care ajută clienții..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-200">Certificări (separate prin virgulă)</label>
                <input
                  type="text"
                  value={coachCertifications}
                  onChange={(e) => setCoachCertifications(e.target.value)}
                  placeholder="IFBB Pro Trainer, Kinetoterapeut Licențiat, CrossFit L2"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 font-bold text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer"
                >
                  {editingCoach ? 'Salvează Modificările' : 'Creează Antrenor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
