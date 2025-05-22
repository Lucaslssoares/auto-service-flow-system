
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
