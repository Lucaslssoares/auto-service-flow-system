
import React from "react";
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
import { Plus, Users } from "lucide-react";
import { TeamWorkModal } from "@/components/employees/TeamWorkModal";
import { useState } from "react";

// Dados mockados para demonstração
const appointments = [
  {
    id: "1",
    customerId: "customer-1",
    customerName: "João Silva",
    vehicleId: "vehicle-1",
    vehicleInfo: "Honda Civic 2020 - ABC-1234",
    services: [
      { id: "service-1", name: "Lavagem Completa", price: 25.00 },
      { id: "service-2", name: "Enceramento", price: 35.00 }
    ],
    date: new Date(2024, 11, 15, 14, 0),
    status: "scheduled" as const,
    totalPrice: 60.00,
    notes: "Cliente preferencial"
  },
  {
    id: "2",
    customerId: "customer-2", 
    customerName: "Maria Santos",
    vehicleId: "vehicle-2",
    vehicleInfo: "Toyota Corolla 2019 - XYZ-5678",
    services: [
      { id: "service-1", name: "Lavagem Completa", price: 25.00 }
    ],
    date: new Date(2024, 11, 15, 16, 30),
    status: "scheduled" as const,
    totalPrice: 25.00,
    notes: ""
  }
];

const Appointments = () => {
  const [teamWorkModal, setTeamWorkModal] = useState<{
    isOpen: boolean;
    appointmentId: string;
    serviceId: string;
    serviceName: string;
  }>({
    isOpen: false,
    appointmentId: "",
    serviceId: "",
    serviceName: ""
  });

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

  const openTeamWorkModal = (appointmentId: string, serviceId: string, serviceName: string) => {
    setTeamWorkModal({
      isOpen: true,
      appointmentId,
      serviceId,
      serviceName
    });
  };

  const closeTeamWorkModal = () => {
    setTeamWorkModal({
      isOpen: false,
      appointmentId: "",
      serviceId: "",
      serviceName: ""
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Agendamentos</h2>
        <Button className="gap-2">
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
                      <div>{appointment.date.toLocaleDateString('pt-BR')}</div>
                      <div className="text-muted-foreground">
                        {appointment.date.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {appointment.services.map((service) => (
                        <div key={service.id} className="flex items-center gap-2">
                          <span className="text-sm">{service.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openTeamWorkModal(
                              appointment.id, 
                              service.id, 
                              service.name
                            )}
                            className="h-6 px-2"
                          >
                            <Users className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
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
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TeamWorkModal
        isOpen={teamWorkModal.isOpen}
        onClose={closeTeamWorkModal}
        appointmentId={teamWorkModal.appointmentId}
        serviceId={teamWorkModal.serviceId}
        serviceName={teamWorkModal.serviceName}
      />
    </div>
  );
};

export default Appointments;
