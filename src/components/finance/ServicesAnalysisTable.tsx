
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

interface ServicesAnalysisTableProps {
  completedAppointments: any[];
}

export const ServicesAnalysisTable = ({ completedAppointments }: ServicesAnalysisTableProps) => {
  // Count service occurrences and revenue from actual appointment data
  const serviceCounts: Record<string, { count: number; revenue: number; name: string }> = {};
  let totalRevenue = 0;
  
  completedAppointments.forEach(app => {
    totalRevenue += app.totalPrice || 0;
    
    if (app.services && Array.isArray(app.services)) {
      app.services.forEach(service => {
        const serviceId = service.id;
        const serviceName = service.name || 'Serviço sem nome';
        const servicePrice = service.price || 0;
        
        if (serviceCounts[serviceId]) {
          serviceCounts[serviceId].count += 1;
          serviceCounts[serviceId].revenue += servicePrice;
        } else {
          serviceCounts[serviceId] = {
            count: 1,
            revenue: servicePrice,
            name: serviceName,
          };
        }
      });
    }
  });
  
  const tableData = Object.keys(serviceCounts)
    .map(serviceId => {
      const data = serviceCounts[serviceId];
      const percentRevenue = totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0;
      
      return {
        id: serviceId,
        name: data.name,
        count: data.count,
        revenue: data.revenue,
        percentRevenue,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

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
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">{item.count}</TableCell>
                  <TableCell className="text-right">
                    R$ {item.revenue.toFixed(2).replace(".", ",")}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.percentRevenue.toFixed(1)}%
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
