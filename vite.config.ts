
/**
 * Configuração do Vite otimizada para desenvolvimento e produção
 * Inclui otimizações de performance e segurança
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Usar minificação padrão do Vite (esbuild) em vez do Terser
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        // Code splitting para otimizar carregamento
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-toast'],
          utils: ['date-fns', 'clsx'],
        },
      },
    },
    // Otimizar tamanho do bundle
    chunkSizeWarningLimit: 1000,
  },
  // Otimizações de performance
  optimizeDeps: {
    include: ['react', 'react-dom', '@supabase/supabase-js'],
  },
}));
