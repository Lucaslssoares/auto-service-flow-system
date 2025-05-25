
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
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
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
