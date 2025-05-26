
/**
 * Configurações de ambiente da aplicação
 * Gerencia variáveis de ambiente de forma segura e tipada
 */

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

/**
 * Configuração para desenvolvimento
 * Em produção, essas variáveis devem ser definidas via environment variables
 */
const developmentConfig: EnvironmentConfig = {
  supabase: {
    url: "https://ppztpzbgbijpxcwgelcg.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwenRwemJnYmlqcHhjd2dlbGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NjExNjEsImV4cCI6MjA2MzUzNzE2MX0.kh8wbyiceqsZa36CcgFVldd-Mn-ZkDcpmALDO7v8Kis"
  },
  app: {
    name: "Lava Car System",
    version: "1.0.0",
    environment: "development"
  }
};

/**
 * Obtém a configuração baseada no ambiente
 * Prioriza variáveis de ambiente quando disponíveis
 */
export const getEnvironmentConfig = (): EnvironmentConfig => {
  // Em produção, usar variáveis de ambiente
  if (import.meta.env.PROD) {
    return {
      supabase: {
        url: import.meta.env.VITE_SUPABASE_URL || developmentConfig.supabase.url,
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || developmentConfig.supabase.anonKey,
      },
      app: {
        name: developmentConfig.app.name,
        version: developmentConfig.app.version,
        environment: "production"
      }
    };
  }

  return developmentConfig;
};

export const config = getEnvironmentConfig();
