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
  tipo: string;
  color: string;
  origen: string;
  vida_util_dias: number;
  created_at: string;
}

export type ContractEstado = 'pendiente' | 'aceptado' | 'en_proceso' | 'completado' | 'cancelado' | 'vencido';

export interface Contract {
  id: string;
  comprador_id: string;
  titulo: string;
  descripcion: string;
  estado: ContractEstado;
  fecha_entrega: string;
  precio_total: number | null;
  created_at: string;
  comprador?: User;
  items?: ContractItem[];
}

export interface ContractItem {
  id: string;
  contrato_id: string;
  flor_id: string;
  toneladas: number;
  precio_por_tonelada: number;
  especificaciones: string | null;
  created_at: string;
  flor?: Flor;
  offers?: Offer[];
}

export type OfferEstado = 'pendiente' | 'aceptada' | 'rechazada' | 'contraoferta';

export interface Offer {
  id: string;
  contrato_item_id: string;
  vendedor_id: string;
  precio_por_tonelada: number;
  precio_total: number;
  tiempo_entrega_dias: number;
  condiciones: string | null;
  estado: OfferEstado;
  created_at: string;
  vendedor?: User;
  contrato_item?: ContractItem;
  contraofertas?: Counteroffer[];
}

export type CounterofferEstado = 'pendiente' | 'aceptada' | 'rechazada';

export interface Counteroffer {
  id: string;
  oferta_id: string;
  comprador_id: string;
  precio_por_tonelada: number;
  mensaje: string | null;
  estado: CounterofferEstado;
  created_at: string;
  comprador?: User;
  oferta?: Offer;
}
