
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Car, DollarSign, Users } from "lucide-react";
import { appointments, customers, getCustomerName, getEmployeeName, getServicesByIds, getVehicleInfo, vehicles } from "@/data/mockData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Index = () => {
  // Calculate statistics
  const totalCustomers = customers.length;
  const totalVehicles = vehicles.length;
  const todayAppointments = appointments.filter(
    (app) => format(app.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  ).length;
  
  // Calculate today's expected revenue
  const todayRevenue = appointments
    .filter(
      (app) => 
        format(app.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") &&
        app.status !== "cancelled"
    )
    .reduce((sum, app) => sum + app.totalPrice, 0);

  // Get today's appointments for the schedule table
  const todaySchedule = appointments
    .filter(
      (app) => format(app.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veículos Cadastrados</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVehicles}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Prevista (Hoje)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {todayRevenue.toFixed(2).replace(".", ",")}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Agenda de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            {todaySchedule.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">Sem agendamentos para hoje</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Horário</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todaySchedule.map((appointment) => {
                    const statusColors: Record<string, string> = {
                      scheduled: "text-blue-600",
                      "in-progress": "text-amber-600",
                      completed: "text-green-600",
                      cancelled: "text-red-600",
                    };

                    return (
                      <TableRow key={appointment.id}>
                        <TableCell>{format(appointment.date, "HH:mm")}</TableCell>
                        <TableCell>{getCustomerName(appointment.customerId)}</TableCell>
                        <TableCell>{getVehicleInfo(appointment.vehicleId)}</TableCell>
                        <TableCell className={statusColors[appointment.status]}>
                          {appointment.status === "scheduled" && "Agendado"}
                          {appointment.status === "in-progress" && "Em andamento"}
                          {appointment.status === "completed" && "Concluído"}
                          {appointment.status === "cancelled" && "Cancelado"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Serviços Mais Solicitados</CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">Sem dados disponíveis</p>
            ) : (
              <div className="space-y-8">
                {/* Calculate service popularity */}
                {(() => {
                  const serviceCount: Record<string, number> = {};
                  
                  // Count occurrences of each service
                  appointments.forEach(app => {
                    app.serviceIds.forEach(serviceId => {
                      if (serviceCount[serviceId]) {
                        serviceCount[serviceId]++;
                      } else {
                        serviceCount[serviceId] = 1;
                      }
                    });
                  });
                  
                  // Get top 5 services
                  const topServices = Object.keys(serviceCount)
                    .map(serviceId => ({
                      id: serviceId,
                      count: serviceCount[serviceId],
                    }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5);
                  
                  return topServices.map((item, index) => {
                    const service = getServicesByIds([item.id])[0];
                    const percentage = (item.count / appointments.length) * 100;
                    
                    return (
                      <div key={service.id} className="flex items-center">
                        <div className="space-y-1 flex-1">
                          <p className="text-sm font-medium leading-none">{service.name}</p>
                          <div className="flex items-center pt-1">
                            <div className="h-2 w-full rounded-full bg-secondary">
                              <div
                                className="h-2 rounded-full bg-primary"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="ml-2 text-sm text-muted-foreground">{item.count}</span>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Próximos Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">Sem agendamentos</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Serviços</TableHead>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments
                  .filter(app => app.status === "scheduled")
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 5)
                  .map((appointment) => {
                    const services = getServicesByIds(appointment.serviceIds);
                    const statusColors: Record<string, string> = {
                      scheduled: "text-blue-600",
                      "in-progress": "text-amber-600",
                      completed: "text-green-600",
                      cancelled: "text-red-600",
                    };

                    return (
                      <TableRow key={appointment.id}>
                        <TableCell>{format(appointment.date, "dd/MM/yyyy")}</TableCell>
                        <TableCell>{format(appointment.date, "HH:mm")}</TableCell>
                        <TableCell>{getCustomerName(appointment.customerId)}</TableCell>
                        <TableCell>{getVehicleInfo(appointment.vehicleId)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {services.map(service => (
                              <span key={service.id} className="text-xs">
                                {service.name}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{getEmployeeName(appointment.employeeId)}</TableCell>
                        <TableCell className={statusColors[appointment.status]}>
                          {appointment.status === "scheduled" && "Agendado"}
                          {appointment.status === "in-progress" && "Em andamento"}
                          {appointment.status === "completed" && "Concluído"}
                          {appointment.status === "cancelled" && "Cancelado"}
                        </TableCell>
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

export default Index;
