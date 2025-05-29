
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

interface EmployeeCommission {
  employeeId: string;
  employeeName: string;
  totalCommission: number;
  serviceCount: number;
}

interface CommissionsTableProps {
  employeeCommissions: EmployeeCommission[];
  completedAppointments: any[];
}

export const CommissionsTable = ({ 
  employeeCommissions, 
  completedAppointments 
}: CommissionsTableProps) => {
  // Preparar dados para exportação
  const exportData = employeeCommissions.map(emp => {
    const employee = employees.find(e => e.id === emp.employeeId);
    if (!employee) return null;
    
    const totalPay = employee.salary + emp.totalCommission;
    
    return {
      Funcionário: emp.employeeName,
      'Serviços Realizados': emp.serviceCount,
      Comissão: formatCurrencyForExport(emp.totalCommission),
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
        {employeeCommissions.length === 0 ? (
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
              {employeeCommissions.map(emp => {
                const employee = employees.find(e => e.id === emp.employeeId);
                if (!employee) return null;
                
                const totalPay = employee.salary + emp.totalCommission;
                
                return (
                  <TableRow key={emp.employeeId}>
                    <TableCell>{emp.employeeName}</TableCell>
                    <TableCell className="text-right">{emp.serviceCount}</TableCell>
                    <TableCell className="text-right">
                      R$ {emp.totalCommission.toFixed(2).replace(".", ",")}
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
