
import React from "react";
import { format } from "date-fns";
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

interface RecentServicesTableProps {
  completedAppointments: any[];
}

export const RecentServicesTable = ({ completedAppointments }: RecentServicesTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços Recentes</CardTitle>
        <CardDescription>
          Últimos serviços concluídos
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
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedAppointments
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .slice(0, 5)
                .map(app => (
                  <TableRow key={app.id}>
                    <TableCell>{format(app.date, "dd/MM/yyyy HH:mm")}</TableCell>
                    <TableCell>{app.customerName || 'Cliente não informado'}</TableCell>
                    <TableCell>{app.employeeName || 'Funcionário não informado'}</TableCell>
                    <TableCell className="text-right font-medium">
                      R$ {app.totalPrice.toFixed(2).replace(".", ",")}
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
