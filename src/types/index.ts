export type UserRole = 'comprador' | 'vendedor' | 'ambos';

export interface User {
  id: string;
  email: string;
  full_name: string;
  rol: UserRole;
  empresa: string;
  created_at: string;
}

export type TipoFlor = 'rosa' | 'clavel' | 'lirio' | 'gerbera' | 'crisantemo' | 'tulipán' | 'orquídea' | 'girasol';

export interface Flor {
  id: string;
  nombre: string;
  tipo: TipoFlor;
  color: string;
  origen: string;
  vida_util_dias: number;
  created_at: string;
}

export type ContratoEstado = 'pendiente' | 'aceptado' | 'en_proceso' | 'completado' | 'cancelado' | 'vencido';

export interface Contrato {
  id: string;
  comprador_id: string;
  titulo: string;
  descripcion: string;
  estado: ContratoEstado;
  fecha_entrega: string;
  precio_total: number;
  created_at: string;
  comprador?: User;
  items?: ContratoItem[];
}

export interface ContratoItem {
  id: string;
  contrato_id: string;
  flor_id: string;
  toneladas: number;
  precio_por_tonelada: number;
  especificaciones: string;
  created_at: string;
  flor?: Flor;
  ofertas?: Oferta[];
}

export type OfertaEstado = 'pendiente' | 'aceptada' | 'rechazada' | 'contraoferta';

export interface Oferta {
  id: string;
  contrato_item_id: string;
  vendedor_id: string;
  precio_por_tonelada: number;
  precio_total: number;
  tiempo_entrega_dias: number;
  condiciones: string;
  estado: OfertaEstado;
  created_at: string;
  vendedor?: User;
  contrato_item?: ContratoItem;
  contraofertas?: Contraoferta[];
}

export type ContraofertaEstado = 'pendiente' | 'aceptada' | 'rechazada';

export interface Contraoferta {
  id: string;
  oferta_id: string;
  comprador_id: string;
  precio_por_tonelada: number;
  mensaje: string;
  estado: ContraofertaEstado;
  created_at: string;
  comprador?: User;
  oferta?: Oferta;
}
