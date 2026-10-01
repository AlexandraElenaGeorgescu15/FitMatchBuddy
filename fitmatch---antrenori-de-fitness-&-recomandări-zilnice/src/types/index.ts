export type Specialty = 'Slăbire' | 'Hipertrofie' | 'CrossFit' | 'Recuperare';
export type CoachingStyle = 'Strict' | 'Empatic' | 'Tehnic';
export type PriceTier = 1 | 2 | 3; // 1: Buget (150-250 RON), 2: Mediu (300-450 RON), 3: Premium (500-800+ RON)

export interface Coach {
  id: string;
  name: string;
  bio: string;
  specialty: Specialty;
  price_tier: PriceTier;
  style: CoachingStyle;
  image_url: string;
  rating?: number;
  review_count?: number;
  certifications?: string[];
  monthly_rate_ron?: number;
  experience_years?: number;
}

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export type FitnessGoal = 'Slăbire' | 'Masă musculară' | 'Recuperare' | 'Rezistență';

export interface UserProfile {
  user_id: string;
  goal: FitnessGoal;
  preferred_style: CoachingStyle;
  budget: number; // in RON monthly
  workout_days: number; // 2, 3, 4, 5, 6
  matched_coach_id: string | null;
  opt_in_notifications: boolean;
  notes?: string;
  updated_at?: string;
}

export interface MatchScoreResult {
  coach: Coach;
  overallScore: number; // 0 - 100
  breakdown: {
    specialtyScore: number;
    styleScore: number;
    budgetScore: number;
    frequencyScore: number;
  };
  reasons: string[];
}

export interface DailyTip {
  id: string;
  category: 'Nutriție' | 'Antrenament' | 'Recuperare' | 'Mindset' | 'Hidratare';
  title: string;
  content: string;
  actionableStep: string;
  targetGoal?: FitnessGoal | 'Toate';
}

export interface N8nWebhookConfig {
  n8n_daily_webhook_url: string;
  n8n_api_key: string;
  last_triggered_at: string | null;
  last_status: 'never' | 'success' | 'failed';
  last_response_message?: string;
}

export interface WebhookLog {
  id: string;
  timestamp: string;
  url: string;
  user_count: number;
  status: 'success' | 'error';
  http_code: number;
  response_summary: string;
  payload_preview: any;
}

export interface SupabaseConfig {
  supabase_url: string;
  supabase_anon_key: string;
  is_connected: boolean;
  sync_mode: 'local' | 'supabase';
  last_sync_at?: string;
}
