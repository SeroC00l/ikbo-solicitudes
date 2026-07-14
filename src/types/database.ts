import type { UserRole, ContratoEstado, OfertaEstado, ContraofertaEstado } from './index';

export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          rol: UserRole;
          empresa: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          rol: UserRole;
          empresa: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          rol?: UserRole;
          empresa?: string;
          created_at?: string;
        };
      };
      flores: {
        Row: {
          id: string;
          nombre: string;
          tipo: string;
          color: string;
          origen: string;
          vida_util_dias: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          tipo: string;
          color: string;
          origen: string;
          vida_util_dias: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          tipo?: string;
          color?: string;
          origen?: string;
          vida_util_dias?: number;
          created_at?: string;
        };
      };
      contratos: {
        Row: {
          id: string;
          comprador_id: string;
          titulo: string;
          descripcion: string;
          estado: ContratoEstado;
          fecha_entrega: string;
          precio_total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          comprador_id: string;
          titulo: string;
          descripcion: string;
          estado?: ContratoEstado;
          fecha_entrega: string;
          precio_total?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          comprador_id?: string;
          titulo?: string;
          descripcion?: string;
          estado?: ContratoEstado;
          fecha_entrega?: string;
          precio_total?: number;
          created_at?: string;
        };
      };
      contrato_items: {
        Row: {
          id: string;
          contrato_id: string;
          flor_id: string;
          toneladas: number;
          precio_por_tonelada: number;
          especificaciones: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          contrato_id: string;
          flor_id: string;
          toneladas: number;
          precio_por_tonelada: number;
          especificaciones: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          contrato_id?: string;
          flor_id?: string;
          toneladas?: number;
          precio_por_tonelada?: number;
          especificaciones?: string;
          created_at?: string;
        };
      };
      ofertas: {
        Row: {
          id: string;
          contrato_item_id: string;
          vendedor_id: string;
          precio_por_tonelada: number;
          precio_total: number;
          tiempo_entrega_dias: number;
          condiciones: string;
          estado: OfertaEstado;
          created_at: string;
        };
        Insert: {
          id?: string;
          contrato_item_id: string;
          vendedor_id: string;
          precio_por_tonelada: number;
          precio_total: number;
          tiempo_entrega_dias: number;
          condiciones: string;
          estado?: OfertaEstado;
          created_at?: string;
        };
        Update: {
          id?: string;
          contrato_item_id?: string;
          vendedor_id?: string;
          precio_por_tonelada?: number;
          precio_total?: number;
          tiempo_entrega_dias?: number;
          condiciones?: string;
          estado?: OfertaEstado;
          created_at?: string;
        };
      };
      contraofertas: {
        Row: {
          id: string;
          oferta_id: string;
          comprador_id: string;
          precio_por_tonelada: number;
          mensaje: string;
          estado: ContraofertaEstado;
          created_at: string;
        };
        Insert: {
          id?: string;
          oferta_id: string;
          comprador_id: string;
          precio_por_tonelada: number;
          mensaje: string;
          estado?: ContraofertaEstado;
          created_at?: string;
        };
        Update: {
          id?: string;
          oferta_id?: string;
          comprador_id?: string;
          precio_por_tonelada?: number;
          mensaje?: string;
          estado?: ContraofertaEstado;
          created_at?: string;
        };
      };
    };
    Enums: {
      user_role: UserRole;
      contrato_estado: ContratoEstado;
      oferta_estado: OfertaEstado;
      contraoferta_estado: ContraofertaEstado;
    };
  };
}
