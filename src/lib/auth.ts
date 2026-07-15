import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  rol: string;
  empresa: string;
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  let { data: profile } = await supabase
    .from('usuarios').select('*').eq('id', session.user.id).maybeSingle();

  if (!profile) {
    const email = session.user.email || '';
    await supabase.from('usuarios').insert({
      id: session.user.id,
      email,
      full_name: email.split('@')[0],
      empresa: 'My Company',
      rol: 'comprador',
    });
    const { data: p2 } = await supabase
      .from('usuarios').select('*').eq('id', session.user.id).maybeSingle();
    profile = p2;
  }

  if (profile) {
    localStorage.setItem('user', JSON.stringify(profile));
  }

  return profile;
}

export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
