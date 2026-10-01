import { Coach, User, UserProfile, DailyTip, N8nWebhookConfig, SupabaseConfig } from '../types';

export const INITIAL_COACHES: Coach[] = [
  {
    id: 'coach-1',
    name: 'Alexandru Popa',
    bio: 'Antrenor certificat IFBB & specialist în hipertrofie și forță musculară. Peste 8 ani de experiență în transformări corporale, optimizare hormonală și mecanică de ridicare.',
    specialty: 'Hipertrofie',
    price_tier: 2,
    style: 'Tehnic',
    image_url: '/src/assets/images/coach_alex_strength_1790871152584.jpg',
    rating: 4.95,
    review_count: 64,
    certifications: ['IFBB Pro Trainer', 'Biomechanics Specialist Level 2', 'Precision Nutrition'],
    monthly_rate_ron: 380,
    experience_years: 8
  },
  {
    id: 'coach-2',
    name: 'Elena Dumitrescu',
    bio: 'Nutriționist sportiv și antrenor personal axat pe slăbire sustenabilă, compoziție corporală și redefinirea relației cu alimentația și mișcarea.',
    specialty: 'Slăbire',
    price_tier: 1,
    style: 'Empatic',
    image_url: '/src/assets/images/coach_elena_loss_1790871163713.jpg',
    rating: 4.92,
    review_count: 89,
    certifications: ['EFA Personal Trainer', 'Metabolic Conditioning Coach', 'Master Nutriție Clinică'],
    monthly_rate_ron: 220,
    experience_years: 6
  },
  {
    id: 'coach-3',
    name: 'Radu Ionescu',
    bio: 'Fost atlet de performanță, antrenor CrossFit Level 2 și specialist în condiționare metabolică de înaltă intensitate și anduranță anaerobă.',
    specialty: 'CrossFit',
    price_tier: 3,
    style: 'Strict',
    image_url: '/src/assets/images/coach_radu_crossfit_1790871174328.jpg',
    rating: 4.98,
    review_count: 112,
    certifications: ['CrossFit Level 2 Trainer', 'Weightlifting Coach USAW', 'Kettlebell Athletics'],
    monthly_rate_ron: 550,
    experience_years: 10
  },
  {
    id: 'coach-4',
    name: 'Maria Stănescu',
    bio: 'Kinetoterapeut și instructor de mobilitate funcțională, specializată în corectarea posturii, reabilitare post-traumatisme și eliminarea durerilor cronice de spate.',
    specialty: 'Recuperare',
    price_tier: 2,
    style: 'Empatic',
    image_url: '/src/assets/images/coach_maria_recovery_1790871185531.jpg',
    rating: 4.96,
    review_count: 73,
    certifications: ['Licențiat Kinetoterapie', 'FRK Instructor Mobilitate', 'DNS Dynamic Neuromuscular'],
    monthly_rate_ron: 400,
    experience_years: 7
  },
  {
    id: 'coach-5',
    name: 'Cristian Voinea',
    bio: 'Specialist în biomecanică și hipertrofie avansată pentru sportivi naturali. Focus pe periodizare științifică, curbe de rezistență și RPE disciplinat.',
    specialty: 'Hipertrofie',
    price_tier: 3,
    style: 'Strict',
    image_url: '/src/assets/images/coach_alex_strength_1790871152584.jpg',
    rating: 4.88,
    review_count: 45,
    certifications: ['NASM Certified Master Trainer', 'Scientific Hypertrophy Mentorship'],
    monthly_rate_ron: 600,
    experience_years: 9
  },
  {
    id: 'coach-6',
    name: 'Andreea Marinescu',
    bio: 'Antrenor dedicat femeilor și începătorilor care vor să piardă grăsime fără diete restrictive, combinând cardio inteligent cu exerciții compuse accesibile.',
    specialty: 'Slăbire',
    price_tier: 1,
    style: 'Tehnic',
    image_url: '/src/assets/images/coach_elena_loss_1790871163713.jpg',
    rating: 4.85,
    review_count: 52,
    certifications: ['ISSA Certified Fitness Trainer', 'Functional Training Specialist'],
    monthly_rate_ron: 250,
    experience_years: 5
  },
  {
    id: 'coach-7',
    name: 'Tudor Munteanu',
    bio: 'Preparator fizic pentru anduranță și CrossFit. Antrenamente construite pe baze solide de mobilitate articulară, forță explozivă și capacitate pulmonară.',
    specialty: 'CrossFit',
    price_tier: 2,
    style: 'Tehnic',
    image_url: '/src/assets/images/coach_radu_crossfit_1790871174328.jpg',
    rating: 4.91,
    review_count: 38,
    certifications: ['CrossFit Level 1', 'Endurance Specialist', 'Eleiko Strength Coach'],
    monthly_rate_ron: 390,
    experience_years: 6
  },
  {
    id: 'coach-8',
    name: 'Dr. Diana Enache',
    bio: 'Medic rezident recuperare medicală & kinetoterapeut. Planuri terapeutice bazate pe dovezi pentru coloană vertebrală, articulații și reintegrare sportivă.',
    specialty: 'Recuperare',
    price_tier: 3,
    style: 'Strict',
    image_url: '/src/assets/images/coach_maria_recovery_1790871185531.jpg',
    rating: 5.0,
    review_count: 31,
    certifications: ['Medic Rezident Recuperare', 'FDM Fascial Distortion Model', 'McKenzie Part A+B'],
    monthly_rate_ron: 650,
    experience_years: 8
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    email: 'alexandra@fitmatch.ro',
    name: 'Alexandra Georgescu',
    role: 'user',
    created_at: '2026-09-15T10:00:00Z'
  },
  {
    id: 'user-2',
    email: 'admin@fitmatch.ro',
    name: 'Admin FitMatch',
    role: 'admin',
    created_at: '2026-09-01T08:00:00Z'
  },
  {
    id: 'user-3',
    email: 'mihai.fitness@gmail.com',
    name: 'Mihai Vasilescu',
    role: 'user',
    created_at: '2026-09-20T14:30:00Z'
  },
  {
    id: 'user-4',
    email: 'ioana.rad@yahoo.com',
    name: 'Ioana Radu',
    role: 'user',
    created_at: '2026-09-25T11:15:00Z'
  }
];

export const INITIAL_USER_PROFILES: Record<string, UserProfile> = {
  'user-1': {
    user_id: 'user-1',
    goal: 'Slăbire',
    preferred_style: 'Empatic',
    budget: 300,
    workout_days: 4,
    matched_coach_id: 'coach-2',
    opt_in_notifications: true,
    notes: 'Vreau să slăbesc 7 kg într-un mod sustenabil, am program de birou.',
    updated_at: '2026-09-28T09:00:00Z'
  },
  'user-3': {
    user_id: 'user-3',
    goal: 'Masă musculară',
    preferred_style: 'Tehnic',
    budget: 450,
    workout_days: 5,
    matched_coach_id: 'coach-1',
    opt_in_notifications: true,
    notes: 'Focus pe hipertrofie piept și spate.',
    updated_at: '2026-09-26T16:20:00Z'
  },
  'user-4': {
    user_id: 'user-4',
    goal: 'Recuperare',
    preferred_style: 'Empatic',
    budget: 400,
    workout_days: 3,
    matched_coach_id: 'coach-4',
    opt_in_notifications: false,
    notes: 'Recuperare după dureri lombare.',
    updated_at: '2026-09-27T18:00:00Z'
  }
};

export const INITIAL_DAILY_TIPS: DailyTip[] = [
  {
    id: 'tip-1',
    category: 'Nutriție',
    title: 'Țintește 1.6g - 2.0g proteine per kilogram corp',
    content: 'Aportul proteic adecvat este fundația atât pentru conservarea masei musculare în deficit caloric (slăbire), cât și pentru sinteza proteică musculară.',
    actionableStep: 'Include o sursă principală de proteine (ouă, piept de pui/curcan, tofu, iaurt grecesc) la fiecare masă a zilei.',
    targetGoal: 'Toate'
  },
  {
    id: 'tip-2',
    category: 'Antrenament',
    title: 'Supraîncărcarea progresivă bate intensitatea oarbă',
    content: 'Nu este nevoie să ajungi la epuizare la fiecare serie. Adăugarea unei repetiții în plus sau cu 1-2 kg mai mult față de săptămâna trecută generează stimulul optim.',
    actionableStep: 'Notează greutățile și repetițiile din prima serie a exercițiului compus de azi și încearcă să adaugi o repetiție curată.',
    targetGoal: 'Masă musculară'
  },
  {
    id: 'tip-3',
    category: 'Hidratare',
    title: 'Deshidratarea de doar 2% scade performanța de forță cu 15%',
    content: 'Fibrele musculare sunt 75% apă. Fără volum intracelular adecvat, pomparea scade și riscul de crampe sau accidentări crește.',
    actionableStep: 'Bea 500ml de apă cu un praf de sare de mare neiodată cu 45 de minute înainte de sesiunea de antrenament.',
    targetGoal: 'Toate'
  },
  {
    id: 'tip-4',
    category: 'Recuperare',
    title: 'Fereastra de aur a somnului profund',
    content: 'Hormonul de creștere (GH) și refacerea țesuturilor musculare au loc preponderent în stadiul 3 de somn non-REM (primele 4 ore ale nopții).',
    actionableStep: 'Oprește ecranele luminoase cu 45 de minute înainte de culcare și menține dormitorul la 18-20°C.',
    targetGoal: 'Recuperare'
  },
  {
    id: 'tip-5',
    category: 'Nutriție',
    title: 'Volumul alimentelor: Secretul slăbirii fără senzație de foame',
    content: 'Legumele bogate în fibre și apă (castraveți, dovlecei, spanac, broccoli) oferă sațietate mecanică gastrică cu densitate calorică minimă.',
    actionableStep: 'Umple jumătate din farfurie la prânz și cină cu legume crude sau gătite la abur.',
    targetGoal: 'Slăbire'
  },
  {
    id: 'tip-6',
    category: 'Mindset',
    title: 'Constanța pe termen lung este superputerea reală',
    content: 'Un antrenament executat la 70% intensitate când nu ai motivație este infinit mai valoros decât o sesiune sărită.',
    actionableStep: 'Dacă ești obosit azi, fă măcar primele 10 minute de încălzire și mobilitate.',
    targetGoal: 'Rezistență'
  }
];

export const INITIAL_N8N_CONFIG: N8nWebhookConfig = {
  n8n_daily_webhook_url: 'https://primary-production.up.railway.app/webhook/fitmatch-daily-dispatch',
  n8n_api_key: 'fitmatch_sec_live_98f4c219',
  last_triggered_at: null,
  last_status: 'never',
  last_response_message: 'Niciun apel webhook efectuat încă. Configurează URL-ul și apasă Test.'
};

export const INITIAL_SUPABASE_CONFIG: SupabaseConfig = {
  supabase_url: '',
  supabase_anon_key: '',
  is_connected: false,
  sync_mode: 'local'
};
