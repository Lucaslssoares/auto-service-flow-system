
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { useAppointments } from "@/hooks/useAppointments";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Appointments = () => {
  const { appointments, isLoading, updateStatus } = useAppointments();
  const [appointmentFormOpen, setAppointmentFormOpen] = useState(false);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "scheduled":
        return "default";
      case "in-progress":
        return "secondary";
      case "completed":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Agendado";
      case "in-progress":
        return "Em Andamento";
      case "completed":
        return "Concluído";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando agendamentos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Agendamentos</h2>
        <Button className="gap-2" onClick={() => setAppointmentFormOpen(true)}>
          <Plus className="h-4 w-4" /> Novo Agendamento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Agendamentos</CardTitle>
          <CardDescription>
            Gerencie os agendamentos de serviços
          </CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum agendamento encontrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Serviços</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="font-medium">{appointment.customerName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{appointment.vehicleInfo}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{format(appointment.date, "dd/MM/yyyy", { locale: ptBR })}</div>
                        <div className="text-muted-foreground">
                          {format(appointment.date, "HH:mm")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {appointment.services?.map((service) => (
                          <div key={service.id} className="text-sm">
                            {service.name}
                          </div>
                        )) || <span className="text-sm text-muted-foreground">Nenhum serviço</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(appointment.status)}>
                        {getStatusLabel(appointment.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      R$ {appointment.totalPrice.toFixed(2).replace(".", ",")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {appointment.status === "scheduled" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus({ id: appointment.id, status: "in-progress" })}
                          >
                            Iniciar
                          </Button>
                        )}
                        {appointment.status === "in-progress" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus({ id: appointment.id, status: "completed" })}
                          >
                            Finalizar
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={appointmentFormOpen} onOpenChange={setAppointmentFormOpen}>
        <AppointmentForm onClose={() => setAppointmentFormOpen(false)} />
      </Dialog>
    </div>
  );
};

export default Appointments;
