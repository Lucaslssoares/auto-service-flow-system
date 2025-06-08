
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
import { Plus, Loader2, Edit, Trash2 } from "lucide-react";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { useAppointmentsOptimized } from "@/hooks/useAppointmentsOptimized";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const AppointmentsOptimized = () => {
  const { 
    appointments, 
    isLoading, 
    updateStatus, 
    deleteAppointment,
    isUpdating,
    isDeleting,
    getAppointmentsByStatus 
  } = useAppointmentsOptimized();
  
  const { hasPermission } = useSecureAuth();
  const [appointmentFormOpen, setAppointmentFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "scheduled":
        return "default" as const;
      case "in-progress":
        return "secondary" as const;
      case "completed":
        return "outline" as const;
      case "cancelled":
        return "destructive" as const;
      default:
        return "default" as const;
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

  const handleStatusUpdate = (id: string, status: string) => {
    if (!hasPermission('write')) {
      toast.error('Você não tem permissão para alterar status de agendamentos');
      return;
    }
    updateStatus({ id, status: status as any });
  };

  const handleDelete = (id: string) => {
    if (!hasPermission('delete')) {
      toast.error('Você não tem permissão para excluir agendamentos');
      return;
    }

    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      deleteAppointment(id);
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
        {hasPermission('write') && (
          <Button className="gap-2" onClick={() => setAppointmentFormOpen(true)}>
            <Plus className="h-4 w-4" /> Novo Agendamento
          </Button>
        )}
      </div>

      {/* Cards de resumo por status */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getAppointmentsByStatus('scheduled').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getAppointmentsByStatus('in-progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getAppointmentsByStatus('completed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getAppointmentsByStatus('cancelled').length}
            </div>
          </CardContent>
        </Card>
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
                      <div className="font-medium">
                        {appointment.customerName || 'Cliente não informado'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {appointment.vehicleInfo || 'Veículo não informado'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {appointment.date ? (
                          <>
                            <div>{format(appointment.date, "dd/MM/yyyy", { locale: ptBR })}</div>
                            <div className="text-muted-foreground">
                              {format(appointment.date, "HH:mm")}
                            </div>
                          </>
                        ) : (
                          'Data não informada'
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {appointment.services && appointment.services.length > 0 ? (
                          appointment.services.map((service) => (
                            <div key={service.id} className="text-sm">
                              {service.name || 'Serviço sem nome'}
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">Nenhum serviço</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(appointment.status)}>
                        {getStatusLabel(appointment.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {appointment.totalPrice ? 
                        `R$ ${appointment.totalPrice.toFixed(2).replace(".", ",")}` : 
                        'R$ 0,00'
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {appointment.status === "scheduled" && hasPermission('write') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusUpdate(appointment.id, "in-progress")}
                            disabled={isUpdating}
                          >
                            Iniciar
                          </Button>
                        )}
                        {appointment.status === "in-progress" && hasPermission('write') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusUpdate(appointment.id, "completed")}
                            disabled={isUpdating}
                          >
                            Finalizar
                          </Button>
                        )}
                        {hasPermission('write') && (
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {hasPermission('delete') && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(appointment.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
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

export default AppointmentsOptimized;
