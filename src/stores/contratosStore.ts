import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Contrato, ContratoItem, Flor } from '@/types';

interface ContratosState {
  contratos: Contrato[];
  contratoActual: Contrato | null;
  flores: Flor[];
  loading: boolean;
  error: string | null;
  fetchContratos: (compradorId?: string) => Promise<void>;
  fetchContratoById: (id: string) => Promise<void>;
  createContrato: (contrato: Omit<Contrato, 'id' | 'created_at' | 'comprador' | 'items'>, items: Omit<ContratoItem, 'id' | 'created_at' | 'contrato_id'>[]) => Promise<string>;
  updateEstado: (id: string, estado: Contrato['estado']) => Promise<void>;
  fetchFlores: () => Promise<void>;
  clearError: () => void;
}

export const useContratosStore = create<ContratosState>((set) => ({
  contratos: [],
  contratoActual: null,
  flores: [],
  loading: false,
  error: null,

  fetchContratos: async (compradorId) => {
    try {
      set({ loading: true, error: null });
      let query = supabase
        .from('contratos')
        .select('*, comprador:usuarios(*), items:contrato_items(*, flor:flores(*))')
        .order('created_at', { ascending: false });

      if (compradorId) {
        query = query.eq('comprador_id', compradorId);
      }

      const { data, error } = await query;
      if (error) throw error;
      set({ contratos: data || [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchContratoById: async (id) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('contratos')
        .select('*, comprador:usuarios(*), items:contrato_items(*, flor:flores(*), ofertas(*, vendedor:usuarios(*), contraofertas(*, comprador:usuarios(*))))')
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ contratoActual: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createContrato: async (contrato, items) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('contratos')
        .insert(contrato)
        .select()
        .single();

      if (error) throw error;

      const itemsConContratoId = items.map(item => ({
        ...item,
        contrato_id: data.id,
      }));

      const { error: itemsError } = await supabase
        .from('contrato_items')
        .insert(itemsConContratoId);

      if (itemsError) throw itemsError;

      set({ loading: false });
      return data.id;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateEstado: async (id, estado) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('contratos')
        .update({ estado })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        contratos: state.contratos.map(c =>
          c.id === id ? { ...c, estado } : c
        ),
        contratoActual: state.contratoActual?.id === id
          ? { ...state.contratoActual, estado }
          : state.contratoActual,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchFlores: async () => {
    try {
      const { data, error } = await supabase
        .from('flores')
        .select('*')
        .order('nombre');

      if (error) throw error;
      set({ flores: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  clearError: () => set({ error: null }),
}));
