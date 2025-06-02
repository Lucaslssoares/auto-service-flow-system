
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Car, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useServiceManagement } from '@/hooks/useServiceManagement';
import { useAppointments } from '@/hooks/useAppointments';
import { toast } from 'sonner';

const clientAppointmentSchema = z.object({
  customerName: z.string().min(1, 'Nome é obrigatório'),
  customerPhone: z.string().min(1, 'Telefone é obrigatório'),
  customerEmail: z.string().email('Email inválido'),
  vehiclePlate: z.string().min(1, 'Placa é obrigatória'),
  vehicleBrand: z.string().min(1, 'Marca é obrigatória'),
  vehicleModel: z.string().min(1, 'Modelo é obrigatório'),
  vehicleColor: z.string().min(1, 'Cor é obrigatória'),
  vehicleType: z.enum(['car', 'motorcycle', 'truck', 'other']),
  date: z.date({
    required_error: 'Selecione uma data',
  }),
  time: z.string().min(1, 'Selecione um horário'),
  notes: z.string().optional(),
});

type ClientAppointmentFormData = z.infer<typeof clientAppointmentSchema>;

const ClientAppointment = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [appointmentCreated, setAppointmentCreated] = useState(false);
  const { services } = useServiceManagement();
  const { createAppointment, isCreating } = useAppointments();

  const form = useForm<ClientAppointmentFormData>({
    resolver: zodResolver(clientAppointmentSchema),
    defaultValues: {
      notes: '',
      vehicleType: 'car',
    },
  });

  const onSubmit = async (data: ClientAppointmentFormData) => {
    if (selectedServices.length === 0) {
      toast.error('Selecione pelo menos um serviço');
      return;
    }

    try {
      const selectedServicesData = services.filter(service => selectedServices.includes(service.id));
      const totalPrice = selectedServicesData.reduce((sum, service) => sum + service.price, 0);

      // Combine date and time
      const [hours, minutes] = data.time.split(':');
      const appointmentDate = new Date(data.date);
      appointmentDate.setHours(parseInt(hours), parseInt(minutes));

      // For public appointments, we'll use a default employee and create customer/vehicle on the fly
      createAppointment({
        customerId: 'temp-customer', // This would need to be handled in the backend
        vehicleId: 'temp-vehicle', // This would need to be handled in the backend
        employeeId: 'temp-employee', // This would need to be handled in the backend
        services: selectedServicesData,
        date: appointmentDate,
        status: 'scheduled',
        notes: data.notes || '',
        totalPrice,
      });

      setAppointmentCreated(true);
      toast.success('Agendamento criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar agendamento');
    }
  };

  const addService = (serviceId: string) => {
    if (!selectedServices.includes(serviceId)) {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter(id => id !== serviceId));
  };

  const getTotalPrice = () => {
    return services
      .filter(service => selectedServices.includes(service.id))
      .reduce((sum, service) => sum + service.price, 0);
  };

  // Generate time slots from 7:00 to 18:00
  const timeSlots = [];
  for (let hour = 7; hour <= 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 18) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }

  if (appointmentCreated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-900">Agendamento Confirmado!</h2>
              <p className="text-gray-600">
                Seu agendamento foi criado com sucesso. Em breve entraremos em contato para confirmar os detalhes.
              </p>
              <Button onClick={() => window.location.reload()} className="w-full">
                Fazer Novo Agendamento
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Agende seu Serviço</h1>
          <p className="text-lg text-gray-600">
            Escolha os serviços desejados e agende seu horário
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Serviços Disponíveis
                </CardTitle>
                <CardDescription>
                  Selecione os serviços que deseja
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-colors",
                      selectedServices.includes(service.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => 
                      selectedServices.includes(service.id) 
                        ? removeService(service.id)
                        : addService(service.id)
                    }
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{service.name}</h3>
                        {service.description && (
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {service.duration}min
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            R$ {service.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {selectedServices.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center font-medium">
                      <span>Total:</span>
                      <span>R$ {getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Appointment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Dados do Agendamento</CardTitle>
                <CardDescription>
                  Preencha seus dados e escolha data e horário
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Customer Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Seus Dados</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="customerName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome Completo</FormLabel>
                              <FormControl>
                                <Input placeholder="Seu nome completo" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="customerPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefone</FormLabel>
                              <FormControl>
                                <Input placeholder="(11) 99999-9999" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="customerEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="seu@email.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Vehicle Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Dados do Veículo</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="vehiclePlate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Placa</FormLabel>
                              <FormControl>
                                <Input placeholder="ABC-1234" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="vehicleType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Tipo do veículo" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="car">Carro</SelectItem>
                                  <SelectItem value="motorcycle">Moto</SelectItem>
                                  <SelectItem value="truck">Caminhão</SelectItem>
                                  <SelectItem value="other">Outro</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="vehicleBrand"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Marca</FormLabel>
                              <FormControl>
                                <Input placeholder="Toyota, Honda, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="vehicleModel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Modelo</FormLabel>
                              <FormControl>
                                <Input placeholder="Corolla, Civic, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="vehicleColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cor</FormLabel>
                              <FormControl>
                                <Input placeholder="Branco, Preto, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Date and Time */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Data e Horário</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Data</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "dd/MM/yyyy", { locale: ptBR })
                                      ) : (
                                        <span>Selecione uma data</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Horário</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione um horário" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {timeSlots.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações (opcional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Alguma observação especial sobre o serviço..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={isCreating || selectedServices.length === 0} 
                      className="w-full"
                    >
                      {isCreating ? "Criando Agendamento..." : "Agendar Serviço"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientAppointment;
