
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useFinanceData } from "@/components/finance/FinancePageUtils";
import { DateRangeSelector } from "@/components/finance/DateRangeSelector";
import { OverviewTabContent } from "@/components/finance/OverviewTabContent";
import { ServicesTabContent } from "@/components/finance/ServicesTabContent";
import { CommissionsTabContent } from "@/components/finance/CommissionsTabContent";
import { Loader2 } from "lucide-react";

const FinancePage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  
  // Get finance data using the new hook
  const { 
    completedAppointments, 
    totalRevenue, 
    employeeCommissions, 
    chartData, 
    isLoading 
  } = useFinanceData(selectedPeriod);

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
  
  return (
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
            chartData={chartData}
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
  );
};

export default FinancePage;
