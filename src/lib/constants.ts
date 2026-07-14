export const APP_NAME = 'IKBO Solicitudes';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/registro',
  DASHBOARD: '/dashboard',
  SOLICITUDES: '/dashboard/solicitudes',
  NUEVA_SOLICITUD: '/dashboard/solicitudes/nueva',
  SOLICITUD_DETAIL: '/dashboard/solicitudes/',
  OFERTAS: '/dashboard/ofertas',
  OFERTA_DETAIL: '/dashboard/ofertas/',
} as const;

export const ESTADO_COLORS: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  en_proceso: 'bg-blue-100 text-blue-800',
  completada: 'bg-green-100 text-green-800',
  cancelada: 'bg-red-100 text-red-800',
  aceptada: 'bg-green-100 text-green-800',
  rechazada: 'bg-red-100 text-red-800',
  contraoferta: 'bg-purple-100 text-purple-800',
};
