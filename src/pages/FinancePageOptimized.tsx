
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useFinanceOptimized } from "@/hooks/useFinanceOptimized";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { DateRangeSelector } from "@/components/finance/DateRangeSelector";
import { OverviewTabContent } from "@/components/finance/OverviewTabContent";
import { ServicesTabContent } from "@/components/finance/ServicesTabContent";
import { CommissionsTabContent } from "@/components/finance/CommissionsTabContent";
import { Loader2 } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

const FinancePageOptimized = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const { hasPermission } = useSecureAuth();
  
  // Get finance data using the optimized hook
  const { 
    completedAppointments, 
    totalRevenue, 
    employeeCommissions, 
    chartData, 
    isLoading 
  } = useFinanceOptimized(selectedPeriod);

  if (!hasPermission('view_finance')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h1>
          <p className="text-gray-600">
            Você não tem permissão para visualizar dados financeiros.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando dados financeiros...</span>
        </div>
      </div>
    );
  }

  // Transform chart data to match expected format
  const transformedChartData = chartData.map(item => ({
    name: item.date,
    valor: item.revenue
  }));
  
  return (
    <ProtectedRoute requiredPermission="view_finance">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Financeiro</h2>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="commissions">Comissões</TabsTrigger>
          </TabsList>
          
          <DateRangeSelector 
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
          />
          
          <TabsContent value="overview">
            <OverviewTabContent
              completedAppointments={completedAppointments}
              totalRevenue={totalRevenue}
              employeeCommissions={employeeCommissions}
              chartData={transformedChartData}
            />
          </TabsContent>
          
          <TabsContent value="services">
            <ServicesTabContent completedAppointments={completedAppointments} />
          </TabsContent>
          
          <TabsContent value="commissions">
            <CommissionsTabContent
              employeeCommissions={employeeCommissions}
              completedAppointments={completedAppointments}
            />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default FinancePageOptimized;
