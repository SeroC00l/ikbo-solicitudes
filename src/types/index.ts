export type UserRole = 'cliente' | 'proveedor' | 'ambos';

export interface User {
  id: string;
  email: string;
  full_name: string;
  rol: UserRole;
  empresa: string;
  created_at: string;
}

export type SolicitudEstado = 'pendiente' | 'en_proceso' | 'completada' | 'cancelada';

export interface Solicitud {
  id: string;
  cliente_id: string;
  titulo: string;
  descripcion: string;
  estado: SolicitudEstado;
  fecha_limite: string;
  created_at: string;
  cliente?: User;
  items?: SolicitudItem[];
}

export interface SolicitudItem {
  id: string;
  solicitud_id: string;
  producto_id: string;
  cantidad: number;
  especificaciones: string;
  created_at: string;
  producto?: Producto;
  ofertas?: Oferta[];
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  unidad: string;
  created_at: string;
}

export type OfertaEstado = 'pendiente' | 'aceptada' | 'rechazada' | 'contraoferta';

export interface Oferta {
  id: string;
  solicitud_item_id: string;
  proveedor_id: string;
  precio_unitario: number;
  precio_total: number;
  tiempo_entrega_dias: number;
  condiciones: string;
  estado: OfertaEstado;
  created_at: string;
  proveedor?: User;
  solicitud_item?: SolicitudItem;
  contraofertas?: Contraoferta[];
}

export type ContraofertaEstado = 'pendiente' | 'aceptada' | 'rechazada';

export interface Contraoferta {
  id: string;
  oferta_id: string;
  cliente_id: string;
  precio_unitario: number;
  mensaje: string;
  estado: ContraofertaEstado;
  created_at: string;
  cliente?: User;
  oferta?: Oferta;
}
