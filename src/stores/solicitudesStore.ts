import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Solicitud, SolicitudItem, Producto } from '@/types';

interface SolicitudesState {
  solicitudes: Solicitud[];
  solicitudActual: Solicitud | null;
  productos: Producto[];
  loading: boolean;
  error: string | null;
  fetchSolicitudes: (clienteId?: string) => Promise<void>;
  fetchSolicitudById: (id: string) => Promise<void>;
  createSolicitud: (solicitud: Omit<Solicitud, 'id' | 'created_at' | 'cliente'>, items: Omit<SolicitudItem, 'id' | 'created_at' | 'solicitud_id'>[]) => Promise<string>;
  updateEstado: (id: string, estado: Solicitud['estado']) => Promise<void>;
  fetchProductos: () => Promise<void>;
  clearError: () => void;
}

export const useSolicitudesStore = create<SolicitudesState>((set) => ({
  solicitudes: [],
  solicitudActual: null,
  productos: [],
  loading: false,
  error: null,

  fetchSolicitudes: async (clienteId) => {
    try {
      set({ loading: true, error: null });
      let query = supabase
        .from('solicitudes')
        .select('*, cliente:usuarios(*), items:solicitud_items(*, producto:productos(*))')
        .order('created_at', { ascending: false });

      if (clienteId) {
        query = query.eq('cliente_id', clienteId);
      }

      const { data, error } = await query;
      if (error) throw error;
      set({ solicitudes: data || [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchSolicitudById: async (id) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('solicitudes')
        .select('*, cliente:usuarios(*), items:solicitud_items(*, producto:productos(*), ofertas(*, proveedor:usuarios(*), contraofertas(*, cliente:usuarios(*))))')
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ solicitudActual: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createSolicitud: async (solicitud, items) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('solicitudes')
        .insert(solicitud)
        .select()
        .single();

      if (error) throw error;

      const itemsConSolicitudId = items.map(item => ({
        ...item,
        solicitud_id: data.id,
      }));

      const { error: itemsError } = await supabase
        .from('solicitud_items')
        .insert(itemsConSolicitudId);

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
        .from('solicitudes')
        .update({ estado })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        solicitudes: state.solicitudes.map(s =>
          s.id === id ? { ...s, estado } : s
        ),
        solicitudActual: state.solicitudActual?.id === id
          ? { ...state.solicitudActual, estado }
          : state.solicitudActual,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchProductos: async () => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('nombre');

      if (error) throw error;
      set({ productos: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  clearError: () => set({ error: null }),
}));
