
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { services } from "@/data/mockData";
import { calculateTotalRevenue } from "./FinancePageUtils";

interface ServicesAnalysisTableProps {
  completedAppointments: any[];
}

export const ServicesAnalysisTable = ({ completedAppointments }: ServicesAnalysisTableProps) => {
  // Count service occurrences and revenue
  const serviceCounts: Record<string, { count: number; revenue: number }> = {};
  const totalRevenue = calculateTotalRevenue(completedAppointments);
  
  completedAppointments.forEach(app => {
    app.serviceIds.forEach(serviceId => {
      const service = services.find(s => s.id === serviceId);
      if (!service) return;
      
      if (serviceCounts[service.id]) {
        serviceCounts[service.id].count += 1;
        serviceCounts[service.id].revenue += service.price;
      } else {
        serviceCounts[service.id] = {
          count: 1,
          revenue: service.price,
        };
      }
    });
  });
  
  const tableData = Object.keys(serviceCounts)
    .map(serviceId => {
      const service = services.find(s => s.id === serviceId);
      if (!service) return null;
      
      const data = serviceCounts[serviceId];
      const percentRevenue = (data.revenue / totalRevenue) * 100;
      
      return {
        id: serviceId,
        name: service.name,
        count: data.count,
        revenue: data.revenue,
        percentRevenue,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b!.revenue - a!.revenue);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Serviços</CardTitle>
        <CardDescription>
          Desempenho dos serviços no período
        </CardDescription>
      </CardHeader>
      <CardContent>
        {completedAppointments.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Nenhum serviço concluído no período selecionado
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serviço</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead className="text-right">% da Receita</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map(item => (
                <TableRow key={item!.id}>
                  <TableCell>{item!.name}</TableCell>
                  <TableCell className="text-right">{item!.count}</TableCell>
                  <TableCell className="text-right">
                    R$ {item!.revenue.toFixed(2).replace(".", ",")}
                  </TableCell>
                  <TableCell className="text-right">
                    {item!.percentRevenue.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
