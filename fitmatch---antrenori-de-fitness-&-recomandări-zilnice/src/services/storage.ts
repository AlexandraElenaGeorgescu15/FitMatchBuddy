import { Coach, User, UserProfile, N8nWebhookConfig, WebhookLog, SupabaseConfig } from '../types';
import { INITIAL_COACHES, INITIAL_USERS, INITIAL_USER_PROFILES, INITIAL_N8N_CONFIG, INITIAL_SUPABASE_CONFIG } from '../data/initialData';

const STORAGE_KEYS = {
  COACHES: 'fitmatch_coaches_v1',
  USERS: 'fitmatch_users_v1',
  USER_PROFILES: 'fitmatch_user_profiles_v1',
  CURRENT_USER_ID: 'fitmatch_current_user_id_v1',
  N8N_CONFIG: 'fitmatch_n8n_config_v1',
  WEBHOOK_LOGS: 'fitmatch_webhook_logs_v1',
  SUPABASE_CONFIG: 'fitmatch_supabase_config_v1',
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Error notifying storage listener:', e);
    }
  });
}

export const StorageService = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  // COACHES
  getCoaches(): Coach[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COACHES);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.COACHES, JSON.stringify(INITIAL_COACHES));
        return INITIAL_COACHES;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_COACHES;
    }
  },

  saveCoaches(coaches: Coach[]): void {
    localStorage.setItem(STORAGE_KEYS.COACHES, JSON.stringify(coaches));
    notifyListeners();
  },

  addCoach(coachData: Omit<Coach, 'id'>): Coach {
    const coaches = this.getCoaches();
    const newCoach: Coach = {
      ...coachData,
      id: `coach-${Date.now()}`
    };
    coaches.unshift(newCoach);
    this.saveCoaches(coaches);
    return newCoach;
  },

  updateCoach(id: string, updates: Partial<Coach>): Coach | null {
    const coaches = this.getCoaches();
    const index = coaches.findIndex(c => c.id === id);
    if (index === -1) return null;
    coaches[index] = { ...coaches[index], ...updates };
    this.saveCoaches(coaches);
    return coaches[index];
  },

  deleteCoach(id: string): boolean {
    const coaches = this.getCoaches();
    const filtered = coaches.filter(c => c.id !== id);
    if (filtered.length === coaches.length) return false;
    this.saveCoaches(filtered);
    return true;
  },

  // USERS & AUTH
  getUsers(): User[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
        return INITIAL_USERS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_USERS;
    }
  },

  saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    notifyListeners();
  },

  getCurrentUserId(): string {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user-1';
  },

  setCurrentUserId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
    notifyListeners();
  },

  getCurrentUser(): User | null {
    const currentId = this.getCurrentUserId();
    const users = this.getUsers();
    return users.find(u => u.id === currentId) || users[0] || null;
  },

  registerUser(email: string, name: string, role: 'user' | 'admin' = 'user'): User {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      this.setCurrentUserId(existing.id);
      return existing;
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role,
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUserId(newUser.id);
    return newUser;
  },

  // USER PROFILES
  getUserProfiles(): Record<string, UserProfile> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILES);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(INITIAL_USER_PROFILES));
        return INITIAL_USER_PROFILES;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_USER_PROFILES;
    }
  },

  getUserProfile(userId: string): UserProfile | null {
    const profiles = this.getUserProfiles();
    return profiles[userId] || null;
  },

  saveUserProfile(profile: UserProfile): void {
    const profiles = this.getUserProfiles();
    profiles[profile.user_id] = {
      ...profile,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(profiles));
    notifyListeners();
  },

  updateUserProfilePartial(userId: string, partial: Partial<UserProfile>): UserProfile {
    const profiles = this.getUserProfiles();
    const current = profiles[userId] || {
      user_id: userId,
      goal: 'Slăbire',
      preferred_style: 'Empatic',
      budget: 300,
      workout_days: 3,
      matched_coach_id: null,
      opt_in_notifications: true
    };
    const updated: UserProfile = {
      ...current,
      ...partial,
      updated_at: new Date().toISOString()
    };
    profiles[userId] = updated;
    localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(profiles));
    notifyListeners();
    return updated;
  },

  // N8N WEBHOOK CONFIG & LOGS
  getN8nConfig(): N8nWebhookConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.N8N_CONFIG);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.N8N_CONFIG, JSON.stringify(INITIAL_N8N_CONFIG));
        return INITIAL_N8N_CONFIG;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_N8N_CONFIG;
    }
  },

  saveN8nConfig(config: Partial<N8nWebhookConfig>): N8nWebhookConfig {
    const current = this.getN8nConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(STORAGE_KEYS.N8N_CONFIG, JSON.stringify(updated));
    notifyListeners();
    return updated;
  },

  getWebhookLogs(): WebhookLog[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WEBHOOK_LOGS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  addWebhookLog(log: Omit<WebhookLog, 'id' | 'timestamp'>): void {
    const logs = this.getWebhookLogs();
    const newLog: WebhookLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    // Keep last 30 logs
    const trimmed = logs.slice(0, 30);
    localStorage.setItem(STORAGE_KEYS.WEBHOOK_LOGS, JSON.stringify(trimmed));
    notifyListeners();
  },

  clearWebhookLogs(): void {
    localStorage.setItem(STORAGE_KEYS.WEBHOOK_LOGS, JSON.stringify([]));
    notifyListeners();
  },

  // SUPABASE CONFIG
  getSupabaseConfig(): SupabaseConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(INITIAL_SUPABASE_CONFIG));
        return INITIAL_SUPABASE_CONFIG;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_SUPABASE_CONFIG;
    }
  },

  saveSupabaseConfig(config: Partial<SupabaseConfig>): SupabaseConfig {
    const current = this.getSupabaseConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(updated));
    notifyListeners();
    return updated;
  },

  // BACKUP & RESET
  exportDatabaseAsJSON(): string {
    const payload = {
      meta: {
        app: 'FitMatch',
        exported_at: new Date().toISOString(),
        version: '1.0.0'
      },
      coaches: this.getCoaches(),
      users: this.getUsers(),
      user_profiles: this.getUserProfiles(),
      n8n_config: this.getN8nConfig()
    };
    return JSON.stringify(payload, null, 2);
  },

  resetToDefaultData(): void {
    localStorage.setItem(STORAGE_KEYS.COACHES, JSON.stringify(INITIAL_COACHES));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(INITIAL_USER_PROFILES));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user-1');
    localStorage.setItem(STORAGE_KEYS.N8N_CONFIG, JSON.stringify(INITIAL_N8N_CONFIG));
    localStorage.setItem(STORAGE_KEYS.WEBHOOK_LOGS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(INITIAL_SUPABASE_CONFIG));
    notifyListeners();
  }
};
