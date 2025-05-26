
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { employees } from "@/data/mockData";
import { ExportButton } from "@/components/common/ExportButton";
import { formatCurrencyForExport } from "@/utils/exportUtils";

interface CommissionsTableProps {
  employeeCommissions: Record<string, number>;
  completedAppointments: any[];
}

export const CommissionsTable = ({ 
  employeeCommissions, 
  completedAppointments 
}: CommissionsTableProps) => {
  // Preparar dados para exportação
  const exportData = Object.keys(employeeCommissions).map(employeeId => {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return null;
    
    const servicesCount = completedAppointments
      .filter(app => app.employeeId === employeeId)
      .reduce((count, app) => count + app.serviceIds.length, 0);
    
    const commission = employeeCommissions[employeeId];
    const totalPay = employee.salary + commission;
    
    return {
      Funcionário: employee.name,
      'Serviços Realizados': servicesCount,
      Comissão: formatCurrencyForExport(commission),
      'Salário Base': formatCurrencyForExport(employee.salary),
      Total: formatCurrencyForExport(totalPay)
    };
  }).filter(Boolean);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comissões por Funcionário</CardTitle>
        <CardDescription>
          Valores a serem pagos a cada funcionário
        </CardDescription>
      </CardHeader>
      <CardContent>
        {Object.keys(employeeCommissions).length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Nenhuma comissão no período selecionado
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead className="text-right">Serviços Realizados</TableHead>
                <TableHead className="text-right">Comissão</TableHead>
                <TableHead className="text-right">Salário Base</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.keys(employeeCommissions).map(employeeId => {
                const employee = employees.find(e => e.id === employeeId);
                if (!employee) return null;
                
                // Count services by this employee
                const servicesCount = completedAppointments
                  .filter(app => app.employeeId === employeeId)
                  .reduce((count, app) => count + app.serviceIds.length, 0);
                
                const commission = employeeCommissions[employeeId];
                const totalPay = employee.salary + commission;
                
                return (
                  <TableRow key={employeeId}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell className="text-right">{servicesCount}</TableCell>
                    <TableCell className="text-right">
                      R$ {commission.toFixed(2).replace(".", ",")}
                    </TableCell>
                    <TableCell className="text-right">
                      R$ {employee.salary.toFixed(2).replace(".", ",")}
                    </TableCell>
                    <TableCell className="font-medium text-right">
                      R$ {totalPay.toFixed(2).replace(".", ",")}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        <ExportButton 
          data={exportData} 
          filename="comissoes" 
        />
        <Button>Gerar Relatório de Comissões</Button>
      </CardFooter>
    </Card>
  );
};
