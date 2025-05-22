
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  appointments as mockAppointments,
  customers,
  employees,
  getCustomerName,
  getEmployeeName,
  getServicesByIds,
  getVehicleInfo,
  services,
  vehicles,
} from "@/data/mockData";
import { Appointment, AppointmentStatus, Service } from "@/types";
import { format, addDays, startOfWeek, startOfDay } from "date-fns";
import { Calendar, Check, Clock, Plus } from "lucide-react";
import { ptBR } from "date-fns/locale";

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [activeTab, setActiveTab] = useState("today");
  const [open, setOpen] = useState(false);

  // New appointment form state
  const [newAppointment, setNewAppointment] = useState({
    customerId: "",
    vehicleId: "",
    serviceIds: [] as string[],
    employeeId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "10:00",
    notes: "",
  });

  // State for selected services
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  
  // For customer's vehicles filtering
  const [customerVehicles, setCustomerVehicles] = useState<typeof vehicles>([]);
  
  // Helper to get the right filtered list based on the active tab
  const getFilteredAppointments = () => {
    const today = startOfDay(new Date());
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 0 });
    
    return appointments.filter((app) => {
      const appDate = startOfDay(app.date);
      
      if (activeTab === "today") {
        return format(appDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
      } else if (activeTab === "week") {
        return appDate >= startOfCurrentWeek && appDate < addDays(startOfCurrentWeek, 7);
      } else if (activeTab === "scheduled") {
        return app.status === "scheduled";
      } else if (activeTab === "in-progress") {
        return app.status === "in-progress";
      } else if (activeTab === "completed") {
        return app.status === "completed";
      }
      
      return true;
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const filteredAppointments = getFilteredAppointments();

  const handleCustomerChange = (customerId: string) => {
    setNewAppointment({ ...newAppointment, customerId, vehicleId: "" });
    
    // Filter vehicles for the selected customer
    const filteredVehicles = vehicles.filter(v => v.customerId === customerId);
    setCustomerVehicles(filteredVehicles);
  };
  
  const handleServiceChange = (serviceId: string) => {
    let newServiceIds;
    
    if (newAppointment.serviceIds.includes(serviceId)) {
      // Remove service if already selected
      newServiceIds = newAppointment.serviceIds.filter(id => id !== serviceId);
    } else {
      // Add service
      newServiceIds = [...newAppointment.serviceIds, serviceId];
    }
    
    setNewAppointment({ ...newAppointment, serviceIds: newServiceIds });
    
    // Update selected services array for display
    const selectedServicesList = services.filter(s => 
      newServiceIds.includes(s.id)
    );
    setSelectedServices(selectedServicesList);
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewAppointment({
      ...newAppointment,
      [name]: value,
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewAppointment({
      ...newAppointment,
      [name]: value,
    });
  };

  const calculateTotalPrice = () => {
    return selectedServices.reduce((total, service) => total + service.price, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verify if all required fields are filled
    if (
      !newAppointment.customerId || 
      !newAppointment.vehicleId || 
      newAppointment.serviceIds.length === 0 || 
      !newAppointment.employeeId || 
      !newAppointment.date || 
      !newAppointment.time
    ) {
      return;
    }
    
    // Create datetime from date and time
    const [hours, minutes] = newAppointment.time.split(":");
    const appointmentDate = new Date(newAppointment.date);
    appointmentDate.setHours(parseInt(hours), parseInt(minutes));
    
    // Calculate total price
    const totalPrice = calculateTotalPrice();
    
    // Create new appointment
    const newAppointmentEntry: Appointment = {
      id: (appointments.length + 1).toString(),
      customerId: newAppointment.customerId,
      vehicleId: newAppointment.vehicleId,
      serviceIds: newAppointment.serviceIds,
      employeeId: newAppointment.employeeId,
      date: appointmentDate,
      status: "scheduled",
      notes: newAppointment.notes,
      totalPrice: totalPrice,
    };
    
    // Add to appointment list
    setAppointments([...appointments, newAppointmentEntry]);
    
    // Reset form
    setNewAppointment({
      customerId: "",
      vehicleId: "",
      serviceIds: [],
      employeeId: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "10:00",
      notes: "",
    });
    setSelectedServices([]);
    setCustomerVehicles([]);
    
    // Close dialog
    setOpen(false);
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
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Agendamentos</h2>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Agendar Novo Atendimento</DialogTitle>
                <DialogDescription>
                  Preencha os dados do agendamento abaixo.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customerId" className="text-right">
                    Cliente
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      name="customerId"
                      value={newAppointment.customerId} 
                      onValueChange={(value) => handleCustomerChange(value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Clientes</SelectLabel>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vehicleId" className="text-right">
                    Veículo
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      name="vehicleId"
                      value={newAppointment.vehicleId} 
                      onValueChange={(value) => handleSelectChange("vehicleId", value)}
                      disabled={!newAppointment.customerId || customerVehicles.length === 0}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          !newAppointment.customerId 
                            ? "Selecione um cliente primeiro"
                            : customerVehicles.length === 0
                              ? "Cliente sem veículos cadastrados"
                              : "Selecione o veículo"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Veículos do Cliente</SelectLabel>
                          {customerVehicles.map((vehicle) => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              {vehicle.brand} {vehicle.model} ({vehicle.plate})
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right mt-2">
                    Serviços
                  </Label>
                  <div className="col-span-3 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {services.map((service) => (
                        <div 
                          key={service.id} 
                          className={`border rounded-md p-2 cursor-pointer transition-colors ${
                            newAppointment.serviceIds.includes(service.id)
                              ? "border-primary bg-primary/10" 
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handleServiceChange(service.id)}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">{service.name}</span>
                            <span className="text-xs text-muted-foreground">
                              R$ {service.price.toFixed(2).replace(".", ",")}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {service.duration} min
                            </span>
                            {newAppointment.serviceIds.includes(service.id) && (
                              <Check className="h-3 w-3 text-primary" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {selectedServices.length > 0 && (
                      <div className="border rounded-md p-2 mt-2">
                        <div className="flex justify-between font-medium">
                          <span>Total:</span>
                          <span>R$ {calculateTotalPrice().toFixed(2).replace(".", ",")}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employeeId" className="text-right">
                    Responsável
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      name="employeeId"
                      value={newAppointment.employeeId} 
                      onValueChange={(value) => handleSelectChange("employeeId", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o funcionário" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Funcionários</SelectLabel>
                          {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name} - {employee.role}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">
                    Data e Hora
                  </Label>
                  <div className="col-span-3 flex gap-2">
                    <Input
                      name="date"
                      type="date"
                      value={newAppointment.date}
                      onChange={handleInputChange}
                      className="flex-1"
                      min={format(new Date(), "yyyy-MM-dd")}
                      required
                    />
                    <Input
                      name="time"
                      type="time"
                      value={newAppointment.time}
                      onChange={handleInputChange}
                      className="flex-1"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Observações
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={newAppointment.notes}
                    onChange={handleInputChange}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={
                    !newAppointment.customerId || 
                    !newAppointment.vehicleId || 
                    newAppointment.serviceIds.length === 0 || 
                    !newAppointment.employeeId
                  }
                >
                  Agendar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="today" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="today">Hoje</TabsTrigger>
          <TabsTrigger value="week">Esta Semana</TabsTrigger>
          <TabsTrigger value="scheduled">Agendados</TabsTrigger>
          <TabsTrigger value="in-progress">Em Andamento</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Agendamentos de Hoje</CardTitle>
              <CardDescription>
                {format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderAppointmentsTable(filteredAppointments)}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="week" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Agendamentos da Semana</CardTitle>
              <CardDescription>
                Visualize os agendamentos para esta semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderAppointmentsTable(filteredAppointments)}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Agendados</CardTitle>
              <CardDescription>
                Todos os agendamentos futuros
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderAppointmentsTable(filteredAppointments)}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="in-progress" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Em Andamento</CardTitle>
              <CardDescription>
                Serviços que estão sendo executados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderAppointmentsTable(filteredAppointments)}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Concluídos</CardTitle>
              <CardDescription>
                Serviços finalizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderAppointmentsTable(filteredAppointments)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
  
  function renderAppointmentsTable(appointments: Appointment[]) {
    if (appointments.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Nenhum agendamento encontrado</h3>
          <p className="text-muted-foreground mt-2">
            Não há agendamentos para o período selecionado.
          </p>
        </div>
      );
    }
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Veículo</TableHead>
            <TableHead>Serviços</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => {
            const services = getServicesByIds(appointment.serviceIds);
            
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
                <TableCell className="text-right">
                  R$ {appointment.totalPrice.toFixed(2).replace(".", ",")}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
};

export default Appointments;
