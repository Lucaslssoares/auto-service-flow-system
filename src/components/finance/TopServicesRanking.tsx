
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

interface TopServicesRankingProps {
  completedAppointments: any[];
}

export const TopServicesRanking = ({ completedAppointments }: TopServicesRankingProps) => {
  // Count services by frequency and revenue
  const serviceStats: Record<string, { count: number; revenue: number }> = {};
  
  completedAppointments.forEach(app => {
    app.serviceIds.forEach(serviceId => {
      const service = services.find(s => s.id === serviceId);
      if (!service) return;
      
      if (serviceStats[service.id]) {
        serviceStats[service.id].count += 1;
        serviceStats[service.id].revenue += service.price;
      } else {
        serviceStats[service.id] = {
          count: 1,
          revenue: service.price,
        };
      }
    });
  });
  
  // Create ranking by frequency
  const frequencyRanking = Object.keys(serviceStats)
    .map(serviceId => {
      const service = services.find(s => s.id === serviceId);
      if (!service) return null;
      
      return {
        id: serviceId,
        name: service.name,
        count: serviceStats[serviceId].count,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b!.count - a!.count)
    .slice(0, 5); // Top 5
  
  // Create ranking by revenue
  const revenueRanking = Object.keys(serviceStats)
    .map(serviceId => {
      const service = services.find(s => s.id === serviceId);
      if (!service) return null;
      
      return {
        id: serviceId,
        name: service.name,
        revenue: serviceStats[serviceId].revenue,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b!.revenue - a!.revenue)
    .slice(0, 5); // Top 5
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Serviços Mais Frequentes</CardTitle>
          <CardDescription>
            Os serviços mais solicitados no período
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completedAppointments.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Nenhum serviço no período selecionado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Posição</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {frequencyRanking.map((item, index) => (
                  <TableRow key={item!.id}>
                    <TableCell className="font-medium">{index + 1}º</TableCell>
                    <TableCell>{item!.name}</TableCell>
                    <TableCell className="text-right">{item!.count}</TableCell>
                  </TableRow>
                ))}
                {frequencyRanking.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                      Sem dados suficientes para ranking
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Serviços Mais Rentáveis</CardTitle>
          <CardDescription>
            Os serviços com maior faturamento no período
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completedAppointments.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Nenhum serviço no período selecionado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Posição</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead className="text-right">Faturamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueRanking.map((item, index) => (
                  <TableRow key={item!.id}>
                    <TableCell className="font-medium">{index + 1}º</TableCell>
                    <TableCell>{item!.name}</TableCell>
                    <TableCell className="text-right">
                      R$ {item!.revenue.toFixed(2).replace('.', ',')}
                    </TableCell>
                  </TableRow>
                ))}
                {revenueRanking.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                      Sem dados suficientes para ranking
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
