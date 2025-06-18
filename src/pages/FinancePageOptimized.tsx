
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useFinanceOptimized } from "@/hooks/useFinanceOptimized";
import { useFinancePermissions } from "@/hooks/useFinancePermissions";
import { DateRangeSelector } from "@/components/finance/DateRangeSelector";
import { OverviewTabContent } from "@/components/finance/OverviewTabContent";
import { ServicesTabContent } from "@/components/finance/ServicesTabContent";
import { CommissionsTabContent } from "@/components/finance/CommissionsTabContent";
import { Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FinancePageOptimized = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const { hasAccess, userRoles, reason, isLoading: permissionsLoading } = useFinancePermissions();
  
  // Get finance data using the optimized hook
  const { 
    completedAppointments, 
    totalRevenue, 
    employeeCommissions, 
    chartData, 
    isLoading: dataLoading 
  } = useFinanceOptimized(selectedPeriod);

  if (permissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Verificando permissões...</span>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-orange-500" />
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              {reason}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Suas permissões atuais:
              </p>
              <div className="flex flex-wrap gap-1">
                {userRoles.length > 0 ? (
                  userRoles.map((role, index) => (
                    <Badge key={index} variant="secondary">
                      {role}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline">Nenhum papel encontrado</Badge>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Para acessar o módulo financeiro, você precisa ter o papel de 'admin' ou 'manager'.
                Entre em contato com um administrador.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (dataLoading) {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Financeiro</h2>
        <div className="text-sm text-gray-500">
          Acesso: {userRoles.join(', ')}
        </div>
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
  );
};

export default FinancePageOptimized;
