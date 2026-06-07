
interface EnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  app: {
    name: string;
    version: string;
    environment: 'development' | 'production' | 'staging';
  };
}

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !anonKey) {
  throw new Error(
    'Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY são obrigatórias. ' +
    'Copie .env.example para .env e preencha com suas credenciais Supabase.'
  );
}

export const config: EnvironmentConfig = {
  supabase: { url, anonKey },
  app: {
    name: 'Lava Car System',
    version: '1.0.0',
    environment: import.meta.env.PROD ? 'production' : 'development',
  },
};

export const getEnvironmentConfig = () => config;
