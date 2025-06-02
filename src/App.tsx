
/**
 * Componente principal da aplicação
 * Configurado com Error Boundary, providers e roteamento
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
import Appointments from "./pages/Appointments";
import ExecutionPage from "./pages/ExecutionPage";
import FinancePage from "./pages/FinancePage";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import ClientAppointment from "./pages/ClientAppointment";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";

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
    },
    mutations: {
      retry: 1,
    },
  },
});

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
          <AuthProvider>
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
                <Route path="/agendamentos" element={<Appointments />} />
                <Route path="/execucao" element={<ExecutionPage />} />
                <Route path="/financeiro" element={<FinancePage />} />
                <Route path="/configuracoes" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
