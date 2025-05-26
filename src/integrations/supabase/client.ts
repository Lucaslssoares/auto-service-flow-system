
/**
 * Cliente Supabase configurado de forma segura
 * Utiliza configurações de ambiente para credenciais
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { config } from '@/config/environment';

/**
 * Cliente Supabase configurado com:
 * - Credenciais via variáveis de ambiente
 * - Persistência de sessão
 * - Auto-refresh de tokens
 */
export const supabase = createClient<Database>(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
