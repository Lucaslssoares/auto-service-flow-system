
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Appointment, AppointmentStatus, Service } from '@/types';

interface AppointmentWithRelations {
  id: string;
  customer_id: string;
  vehicle_id: string;
  employee_id: string;
  date: string;
  status: string;
  notes: string | null;
  total_price: number;
  customers: { name: string } | null;
  vehicles: { 
    plate: string; 
    model: string; 
    brand: string; 
    color: string;
  } | null;
  employees: { name: string } | null;
  appointment_services: Array<{
    services: {
      id: string;
      name: string;
      price: number;
      duration: number;
      commission_percentage: number;
    } | null;
  }> | null;
}

export const useAppointmentsUnified = () => {
  const queryClient = useQueryClient();

  // Query principal para buscar todos os agendamentos
  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey: ['appointments_unified'],
    queryFn: async (): Promise<Appointment[]> => {
      console.log('Buscando agendamentos...');
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          customer_id,
          vehicle_id,
          employee_id,
          date,
          status,
          notes,
          total_price,
          customers!appointments_customer_id_fkey(name),
          vehicles!appointments_vehicle_id_fkey(plate, model, brand, color),
          employees!appointments_employee_id_fkey(name),
          appointment_services(
            services!appointment_services_service_id_fkey(id, name, price, duration, commission_percentage)
          )
        `)
        .order('date', { ascending: true });

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        throw error;
      }

      console.log('Agendamentos encontrados:', data?.length || 0);

      return (data as AppointmentWithRelations[]).map((appointment) => ({
        id: appointment.id,
        customerId: appointment.customer_id,
        customerName: appointment.customers?.name || 'Cliente não encontrado',
        vehicleId: appointment.vehicle_id,
        vehicleInfo: appointment.vehicles 
          ? `${appointment.vehicles.brand || ''} ${appointment.vehicles.model || ''} - ${appointment.vehicles.plate || ''}`.trim()
          : 'Veículo não encontrado',
        services: appointment.appointment_services
          ?.map(as => as.services)
          .filter(Boolean)
          .map(service => ({
            id: service!.id,
            name: service!.name || '',
            price: Number(service!.price) || 0,
            duration: Number(service!.duration) || 0,
            commissionPercentage: Number(service!.commission_percentage) || 0,
            description: '',
            createdAt: new Date()
          })) || [] as Service[],
        employeeId: appointment.employee_id,
        date: new Date(appointment.date),
        status: appointment.status as AppointmentStatus,
        notes: appointment.notes || '',
        totalPrice: Number(appointment.total_price) || 0
      }));
    },
    staleTime: 1000 * 30, // 30 segundos
    retry: 3,
    retryDelay: 1000,
  });

  // Mutation para criar agendamento
  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: Omit<Appointment, 'id' | 'customerName' | 'vehicleInfo'>) => {
      console.log('Criando agendamento:', appointmentData);

      if (!appointmentData.customerId || !appointmentData.vehicleId) {
        throw new Error('Cliente e veículo são obrigatórios');
      }

      // Criar o agendamento
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          customer_id: appointmentData.customerId,
          vehicle_id: appointmentData.vehicleId,
          employee_id: appointmentData.employeeId,
          date: appointmentData.date.toISOString(),
          status: appointmentData.status || 'scheduled',
          notes: appointmentData.notes || '',
          total_price: appointmentData.totalPrice || 0
        })
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      // Adicionar serviços se fornecidos
      if (appointmentData.services && appointmentData.services.length > 0) {
        const serviceInserts = appointmentData.services.map(service => ({
          appointment_id: appointment.id,
          service_id: service.id
        }));

        const { error: servicesError } = await supabase
          .from('appointment_services')
          .insert(serviceInserts);

        if (servicesError) {
          // Rollback do agendamento se os serviços falharem
          await supabase.from('appointments').delete().eq('id', appointment.id);
          throw servicesError;
        }
      }

      console.log('Agendamento criado com sucesso:', appointment.id);
      return appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments_unified'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_data'] });
      toast.success('Agendamento criado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao criar agendamento:', error);
      toast.error(`Erro ao criar agendamento: ${error.message}`);
    }
  });

  // Mutation para atualizar status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: AppointmentStatus }) => {
      console.log('Atualizando status do agendamento:', id, status);

      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      return { id, status };
    },
    onMutate: async ({ id, status }) => {
      // Update otimista
      await queryClient.cancelQueries({ queryKey: ['appointments_unified'] });
      const previousAppointments = queryClient.getQueryData(['appointments_unified']);
      
      queryClient.setQueryData(['appointments_unified'], (old: Appointment[] | undefined) => {
        if (!old) return old;
        return old.map(app => app.id === id ? { ...app, status } : app);
      });

      return { previousAppointments };
    },
    onError: (error: any, variables, context) => {
      // Rollback do update otimista
      if (context?.previousAppointments) {
        queryClient.setQueryData(['appointments_unified'], context.previousAppointments);
      }
      console.error('Erro ao atualizar status:', error);
      toast.error(`Erro ao atualizar status: ${error.message}`);
    },
    onSuccess: () => {
      toast.success('Status atualizado com sucesso!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments_unified'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_data'] });
    }
  });

  // Mutation para deletar agendamento
  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deletando agendamento:', id);

      // Deletar serviços primeiro (restrição de chave estrangeira)
      const { error: servicesError } = await supabase
        .from('appointment_services')
        .delete()
        .eq('appointment_id', id);

      if (servicesError) throw servicesError;

      // Deletar agendamento
      const { error: appointmentError } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (appointmentError) throw appointmentError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments_unified'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_data'] });
      toast.success('Agendamento excluído com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao excluir agendamento:', error);
      toast.error(`Erro ao excluir agendamento: ${error.message}`);
    }
  });

  // Funções helper para filtros
  const getAppointmentsByStatus = (status: AppointmentStatus) => {
    return appointments.filter(app => app.status === status);
  };

  const getTodayAppointments = () => {
    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const todayEnd = new Date(today.setHours(23, 59, 59, 999));
    
    return appointments.filter(app => 
      app.date >= todayStart && app.date <= todayEnd
    );
  };

  return {
    appointments,
    isLoading,
    error,
    createAppointment: createAppointmentMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    deleteAppointment: deleteAppointmentMutation.mutate,
    isCreating: createAppointmentMutation.isPending,
    isUpdating: updateStatusMutation.isPending,
    isDeleting: deleteAppointmentMutation.isPending,
    getAppointmentsByStatus,
    getTodayAppointments
  };
};
