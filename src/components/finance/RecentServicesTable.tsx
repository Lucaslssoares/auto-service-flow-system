
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface RecentServicesTableProps {
  completedAppointments: Array<{
    id: string;
    customerName: string;
    vehicleInfo: string;
    services: Array<{ name: string; price: number }>;
    totalPrice: number;
    date: Date;
    employeeName: string;
  }>;
}

export const RecentServicesTable = ({ completedAppointments }: RecentServicesTableProps) => {
  // Pegar apenas os 10 mais recentes
  const recentAppointments = completedAppointments.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços Recentes</CardTitle>
        <CardDescription>
          Últimos serviços concluídos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recentAppointments.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            Nenhum serviço concluído encontrado
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Serviços</TableHead>
                <TableHead>Funcionário</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    {format(appointment.date, "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell>{appointment.customerName}</TableCell>
                  <TableCell>{appointment.vehicleInfo}</TableCell>
                  <TableCell>
                    {appointment.services.map(service => service.name).join(", ")}
                  </TableCell>
                  <TableCell>{appointment.employeeName}</TableCell>
                  <TableCell className="text-right">
                    R$ {appointment.totalPrice.toFixed(2)}
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
