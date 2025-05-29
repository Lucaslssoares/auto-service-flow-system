
import React from "react";
import { DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EmployeeCommission {
  employeeId: string;
  employeeName: string;
  totalCommission: number;
  serviceCount: number;
}

interface SummaryCardsProps {
  totalRevenue: number;
  completedAppointments: any[];
  employeeCommissions: EmployeeCommission[];
}

export const SummaryCards = ({
  totalRevenue,
  completedAppointments,
  employeeCommissions,
}: SummaryCardsProps) => {
  const totalCommissions = employeeCommissions.reduce((sum, emp) => sum + emp.totalCommission, 0);
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Faturamento Total
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {totalRevenue.toFixed(2).replace(".", ",")}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {completedAppointments.length} serviços concluídos
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Ticket Médio
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {completedAppointments.length > 0
              ? `R$ ${(totalRevenue / completedAppointments.length).toFixed(2).replace(".", ",")}`
              : "R$ 0,00"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Valor médio por atendimento
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Comissões
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {totalCommissions.toFixed(2).replace(".", ",")}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total de comissões a pagar
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Lucro Estimado
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {(totalRevenue - totalCommissions).toFixed(2).replace(".", ",")}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Receita - Comissões
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
