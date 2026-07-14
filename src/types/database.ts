import type { UserRole, SolicitudEstado, OfertaEstado, ContraofertaEstado } from './index';

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
      productos: {
        Row: {
          id: string;
          nombre: string;
          descripcion: string;
          unidad: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          descripcion: string;
          unidad: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          descripcion?: string;
          unidad?: string;
          created_at?: string;
        };
      };
      solicitudes: {
        Row: {
          id: string;
          cliente_id: string;
          titulo: string;
          descripcion: string;
          estado: SolicitudEstado;
          fecha_limite: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          cliente_id: string;
          titulo: string;
          descripcion: string;
          estado?: SolicitudEstado;
          fecha_limite: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          cliente_id?: string;
          titulo?: string;
          descripcion?: string;
          estado?: SolicitudEstado;
          fecha_limite?: string;
          created_at?: string;
        };
      };
      solicitud_items: {
        Row: {
          id: string;
          solicitud_id: string;
          producto_id: string;
          cantidad: number;
          especificaciones: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          solicitud_id: string;
          producto_id: string;
          cantidad: number;
          especificaciones: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          solicitud_id?: string;
          producto_id?: string;
          cantidad?: number;
          especificaciones?: string;
          created_at?: string;
        };
      };
      ofertas: {
        Row: {
          id: string;
          solicitud_item_id: string;
          proveedor_id: string;
          precio_unitario: number;
          precio_total: number;
          tiempo_entrega_dias: number;
          condiciones: string;
          estado: OfertaEstado;
          created_at: string;
        };
        Insert: {
          id?: string;
          solicitud_item_id: string;
          proveedor_id: string;
          precio_unitario: number;
          precio_total: number;
          tiempo_entrega_dias: number;
          condiciones: string;
          estado?: OfertaEstado;
          created_at?: string;
        };
        Update: {
          id?: string;
          solicitud_item_id?: string;
          proveedor_id?: string;
          precio_unitario?: number;
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
          cliente_id: string;
          precio_unitario: number;
          mensaje: string;
          estado: ContraofertaEstado;
          created_at: string;
        };
        Insert: {
          id?: string;
          oferta_id: string;
          cliente_id: string;
          precio_unitario: number;
          mensaje: string;
          estado?: ContraofertaEstado;
          created_at?: string;
        };
        Update: {
          id?: string;
          oferta_id?: string;
          cliente_id?: string;
          precio_unitario?: number;
          mensaje?: string;
          estado?: ContraofertaEstado;
          created_at?: string;
        };
      };
    };
    Enums: {
      user_role: UserRole;
      solicitud_estado: SolicitudEstado;
      oferta_estado: OfertaEstado;
      contraoferta_estado: ContraofertaEstado;
    };
  };
}
