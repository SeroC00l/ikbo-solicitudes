import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Oferta, Contraoferta } from '@/types';

interface OfertasState {
  ofertas: Oferta[];
  ofertaActual: Oferta | null;
  loading: boolean;
  error: string | null;
  fetchOfertas: (vendedorId?: string) => Promise<void>;
  fetchOfertaById: (id: string) => Promise<void>;
  createOferta: (oferta: Omit<Oferta, 'id' | 'created_at' | 'vendedor'>) => Promise<void>;
  updateOfertaEstado: (id: string, estado: Oferta['estado']) => Promise<void>;
  createContraoferta: (contraoferta: Omit<Contraoferta, 'id' | 'created_at' | 'comprador'>) => Promise<void>;
  updateContraofertaEstado: (id: string, estado: Contraoferta['estado']) => Promise<void>;
  clearError: () => void;
}

export const useOfertasStore = create<OfertasState>((set) => ({
  ofertas: [],
  ofertaActual: null,
  loading: false,
  error: null,

  fetchOfertas: async (vendedorId) => {
    try {
      set({ loading: true, error: null });
      let query = supabase
        .from('ofertas')
        .select('*, vendedor:usuarios(*), contrato_item:contrato_items(*, contrato:contratos(*), flor:flores(*)), contraofertas(*, comprador:usuarios(*))')
        .order('created_at', { ascending: false });

      if (vendedorId) {
        query = query.eq('vendedor_id', vendedorId);
      }

      const { data, error } = await query;
      if (error) throw error;
      set({ ofertas: data || [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchOfertaById: async (id) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('ofertas')
        .select('*, vendedor:usuarios(*), contrato_item:contrato_items(*, contrato:contratos(*), flor:flores(*)), contraofertas(*, comprador:usuarios(*))')
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ ofertaActual: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createOferta: async (oferta) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('ofertas')
        .insert(oferta);

      if (error) throw error;
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateOfertaEstado: async (id, estado) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('ofertas')
        .update({ estado })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        ofertas: state.ofertas.map(o =>
          o.id === id ? { ...o, estado } : o
        ),
        ofertaActual: state.ofertaActual?.id === id
          ? { ...state.ofertaActual, estado }
          : state.ofertaActual,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createContraoferta: async (contraoferta) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('contraofertas')
        .insert(contraoferta);

      if (error) throw error;

      await supabase
        .from('ofertas')
        .update({ estado: 'contraoferta' })
        .eq('id', contraoferta.oferta_id);

      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateContraofertaEstado: async (id, estado) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('contraofertas')
        .update({ estado })
        .eq('id', id);

      if (error) throw error;
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
