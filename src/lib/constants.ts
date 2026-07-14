export const APP_NAME = 'FlorFutures';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CONTRACTS: '/dashboard/contracts',
  NEW_CONTRACT: '/dashboard/contracts/new',
  CONTRACT_DETAIL: '/dashboard/contracts/',
  OFFERS: '/dashboard/offers',
  OFFER_DETAIL: '/dashboard/offers/',
} as const;

export const ESTADO_COLORS: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  aceptado: 'bg-blue-100 text-blue-800',
  aceptada: 'bg-green-100 text-green-800',
  en_proceso: 'bg-blue-100 text-blue-800',
  completado: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800',
  rechazada: 'bg-red-100 text-red-800',
  contraoferta: 'bg-purple-100 text-purple-800',
  vencido: 'bg-gray-100 text-gray-800',
};

export const TIPOS_FLORES = [
  { value: 'rosa', label: 'Rosa', color: 'text-pink-500' },
  { value: 'clavel', label: 'Clavel', color: 'text-red-500' },
  { value: 'lirio', label: 'Lirio', color: 'text-purple-500' },
  { value: 'gerbera', label: 'Gerbera', color: 'text-orange-500' },
  { value: 'crisantemo', label: 'Crisantemo', color: 'text-yellow-500' },
  { value: 'tulipán', label: 'Tulipán', color: 'text-red-400' },
  { value: 'orquídea', label: 'Orquídea', color: 'text-purple-400' },
  { value: 'girasol', label: 'Girasol', color: 'text-yellow-400' },
];
