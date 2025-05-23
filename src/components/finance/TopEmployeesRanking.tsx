
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
import { employees } from "@/data/mockData";

interface TopEmployeesRankingProps {
  employeeCommissions: Record<string, number>;
  completedAppointments: any[];
}

export const TopEmployeesRanking = ({
  employeeCommissions,
  completedAppointments,
}: TopEmployeesRankingProps) => {
  // Count services per employee
  const employeeStats: Record<string, { count: number; revenue: number }> = {};
  
  completedAppointments.forEach(app => {
    const employeeId = app.employeeId;
    const serviceCount = app.serviceIds.length;
    
    if (employeeStats[employeeId]) {
      employeeStats[employeeId].count += serviceCount;
      employeeStats[employeeId].revenue += app.totalPrice;
    } else {
      employeeStats[employeeId] = {
        count: serviceCount,
        revenue: app.totalPrice,
      };
    }
  });
  
  // Create productivity ranking
  const productivityRanking = Object.keys(employeeStats)
    .map(employeeId => {
      const employee = employees.find(e => e.id === employeeId);
      if (!employee) return null;
      
      return {
        id: employeeId,
        name: employee.name,
        count: employeeStats[employeeId].count,
        revenue: employeeStats[employeeId].revenue,
        commission: employeeCommissions[employeeId] || 0,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b!.count - a!.count)
    .slice(0, 5); // Top 5
  
  // Create revenue ranking
  const revenueRanking = Object.keys(employeeStats)
    .map(employeeId => {
      const employee = employees.find(e => e.id === employeeId);
      if (!employee) return null;
      
      return {
        id: employeeId,
        name: employee.name,
        count: employeeStats[employeeId].count,
        revenue: employeeStats[employeeId].revenue,
        commission: employeeCommissions[employeeId] || 0,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b!.revenue - a!.revenue)
    .slice(0, 5); // Top 5
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Funcionários Mais Produtivos</CardTitle>
          <CardDescription>
            Ranking por número de serviços realizados
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
                  <TableHead>Funcionário</TableHead>
                  <TableHead className="text-right">Serviços</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productivityRanking.map((item, index) => (
                  <TableRow key={item!.id}>
                    <TableCell className="font-medium">{index + 1}º</TableCell>
                    <TableCell>{item!.name}</TableCell>
                    <TableCell className="text-right">{item!.count}</TableCell>
                  </TableRow>
                ))}
                {productivityRanking.length === 0 && (
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
          <CardTitle>Maior Faturamento</CardTitle>
          <CardDescription>
            Ranking por valor total de serviços
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
                  <TableHead>Funcionário</TableHead>
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
