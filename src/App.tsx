
/**
 * Componente principal da aplicação
 * Configurado com Error Boundary, providers e roteamento seguro
 */
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Customers from "./pages/Customers";
import Vehicles from "./pages/Vehicles";
import Services from "./pages/Services";
import Employees from "./pages/Employees";
import AppointmentsOptimized from "./pages/AppointmentsOptimized";
import ExecutionPage from "./pages/ExecutionPage";
import FinancePage from "./pages/FinancePage";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import ClientAppointment from "./pages/ClientAppointment";
import ProtectedRoute from "./components/ProtectedRoute";
import { SecureAuthProvider } from "./hooks/useSecureAuth";
import { getSecurityHeaders } from "./utils/security";

/**
 * Configuração do React Query com configurações otimizadas para produção
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: (failureCount, error) => {
        // Não tentar novamente em erros 4xx
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false, // Melhor performance
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * Aplicar headers de segurança
 */
if (typeof document !== 'undefined') {
  const headers = getSecurityHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    const meta = document.createElement('meta');
    meta.httpEquiv = key;
    meta.content = value;
    document.head.appendChild(meta);
  });
}

/**
 * Componente principal da aplicação com todos os providers necessários
 */
const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SecureAuthProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/agendar" element={<ClientAppointment />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Index />} />
                <Route path="/clientes" element={<Customers />} />
                <Route path="/veiculos" element={<Vehicles />} />
                <Route path="/servicos" element={<Services />} />
                <Route path="/funcionarios" element={<Employees />} />
                <Route path="/agendamentos" element={<AppointmentsOptimized />} />
                <Route path="/execucao" element={<ExecutionPage />} />
                <Route path="/financeiro" element={<FinancePage />} />
                <Route path="/configuracoes" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </SecureAuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
