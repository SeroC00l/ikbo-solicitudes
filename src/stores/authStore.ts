import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, empresa: string, rol: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const { data: profile, error: profileError } = await supabase
        .from('usuarios').select('*').eq('id', data.user.id).maybeSingle();
      if (profileError) throw profileError;
      if (!profile) throw new Error('User profile not found');

      set({ user: profile, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  signUp: async (email, password, fullName, empresa, rol) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      const { error: profileError } = await supabase.from('usuarios').insert({
        id: data.user!.id,
        email,
        full_name: fullName,
        empresa,
        rol,
      });
      if (profileError) throw profileError;

      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.removeItem('user');
      set({ user: null, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  loadUser: async () => {
    try {
      set({ loading: true, error: null });
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        set({ user: null, loading: false });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('usuarios').select('*').eq('id', session.user.id).maybeSingle();
      if (profileError) throw profileError;
      if (!profile) {
        set({ user: null, loading: false });
        return;
      }

      localStorage.setItem('user', JSON.stringify(profile));
      set({ user: profile, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
