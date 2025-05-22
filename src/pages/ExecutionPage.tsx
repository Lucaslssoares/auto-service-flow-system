
import { useState } from "react";
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
import {
  appointments,
  getCustomerName,
  getEmployeeName,
  getServicesByIds,
  getVehicleInfo,
} from "@/data/mockData";
import { AppointmentStatus } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const ExecutionPage = () => {
  const [appointmentList, setAppointmentList] = useState(appointments);

  // Filter appointments that are scheduled or in-progress
  const activeAppointments = appointmentList
    .filter(app => app.status === "scheduled" || app.status === "in-progress")
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Today's appointments
  const todayAppointments = activeAppointments.filter(
    app => format(app.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  );
  
  // Function to update appointment status
  const updateStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointmentList(
      appointmentList.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  // Function to get action buttons based on status
  const getActionButtons = (app: typeof appointments[0]) => {
    if (app.status === "scheduled") {
      return (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={() => updateStatus(app.id, "in-progress")}
          >
            Iniciar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => updateStatus(app.id, "cancelled")}
          >
            Cancelar
          </Button>
        </div>
      );
    } else if (app.status === "in-progress") {
      return (
        <Button 
          size="sm" 
          onClick={() => updateStatus(app.id, "completed")}
          className="bg-green-600 hover:bg-green-700"
        >
          Finalizar
        </Button>
      );
    }
    
    return null;
  };

  const getStatusBadgeClass = (status: AppointmentStatus) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStatusText = (status: AppointmentStatus) => {
    switch (status) {
      case "scheduled":
        return "Agendado";
      case "in-progress":
        return "Em andamento";
      case "completed":
        return "Concluído";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Execução de Serviços</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Em Execução</CardTitle>
            <CardDescription>
              Serviços que estão sendo realizados no momento
            </CardDescription>
          </CardHeader>
          <CardContent>
            {appointmentList.filter(app => app.status === "in-progress").length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                Nenhum serviço em execução
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Serviços</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointmentList
                    .filter(app => app.status === "in-progress")
                    .map(app => {
                      const services = getServicesByIds(app.serviceIds);
                      
                      return (
                        <TableRow key={app.id}>
                          <TableCell>{getCustomerName(app.customerId)}</TableCell>
                          <TableCell>{getVehicleInfo(app.vehicleId)}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {services.map(service => (
                                <span key={service.id} className="text-xs">
                                  {service.name}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{getEmployeeName(app.employeeId)}</TableCell>
                          <TableCell>{getActionButtons(app)}</TableCell>
                        </TableRow>
                      );
                    })
                  }
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Próximos Serviços</CardTitle>
            <CardDescription>
              Serviços agendados para hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayAppointments.filter(app => app.status === "scheduled").length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                Nenhum serviço agendado para hoje
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Horário</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Serviços</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayAppointments
                    .filter(app => app.status === "scheduled")
                    .map(app => {
                      const services = getServicesByIds(app.serviceIds);
                      
                      return (
                        <TableRow key={app.id}>
                          <TableCell>{format(app.date, "HH:mm")}</TableCell>
                          <TableCell>{getCustomerName(app.customerId)}</TableCell>
                          <TableCell>{getVehicleInfo(app.vehicleId)}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {services.map(service => (
                                <span key={service.id} className="text-xs">
                                  {service.name}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{getActionButtons(app)}</TableCell>
                        </TableRow>
                      );
                    })
                  }
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Todos os Agendamentos Ativos</CardTitle>
          <CardDescription>
            Agendamentos que precisam ser executados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeAppointments.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              Nenhum agendamento ativo
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Serviços</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeAppointments.map(app => {
                  const services = getServicesByIds(app.serviceIds);
                  
                  return (
                    <TableRow key={app.id}>
                      <TableCell>{format(app.date, "dd/MM/yyyy")}</TableCell>
                      <TableCell>{format(app.date, "HH:mm")}</TableCell>
                      <TableCell>{getCustomerName(app.customerId)}</TableCell>
                      <TableCell>{getVehicleInfo(app.vehicleId)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {services.map(service => (
                            <span key={service.id} className="text-xs">
                              {service.name}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{getEmployeeName(app.employeeId)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(app.status)}`}>
                          {getStatusText(app.status)}
                        </span>
                      </TableCell>
                      <TableCell>{getActionButtons(app)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutionPage;
