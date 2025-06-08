
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Appointment, AppointmentStatus } from '@/types';

export const useAppointmentMutations = () => {
  const queryClient = useQueryClient();

  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: Omit<Appointment, 'id' | 'customerName' | 'vehicleInfo'>) => {
      // Validate required data
      if (!appointmentData.customerId || !appointmentData.vehicleId) {
        throw new Error('Cliente e veículo são obrigatórios');
      }

      // Start transaction-like operation
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          customer_id: appointmentData.customerId,
          vehicle_id: appointmentData.vehicleId,
          employee_id: appointmentData.employeeId,
          date: appointmentData.date.toISOString(),
          status: appointmentData.status || 'scheduled',
          notes: appointmentData.notes || null,
          total_price: appointmentData.totalPrice || 0
        })
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      // Add services if provided
      if (appointmentData.services && appointmentData.services.length > 0) {
        const serviceInserts = appointmentData.services.map(service => ({
          appointment_id: appointment.id,
          service_id: service.id
        }));

        const { error: servicesError } = await supabase
          .from('appointment_services')
          .insert(serviceInserts);

        if (servicesError) {
          // Rollback appointment if services fail
          await supabase.from('appointments').delete().eq('id', appointment.id);
          throw servicesError;
        }
      }

      return appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments_optimized'] });
      queryClient.invalidateQueries({ queryKey: ['finance_appointments'] });
      toast.success('Agendamento criado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao criar agendamento:', error);
      toast.error(`Erro ao criar agendamento: ${error.message}`);
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: AppointmentStatus }) => {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      return { id, status };
    },
    onMutate: async ({ id, status }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['appointments_optimized'] });
      const previousAppointments = queryClient.getQueryData(['appointments_optimized']);
      
      queryClient.setQueryData(['appointments_optimized'], (old: Appointment[] | undefined) => {
        if (!old) return old;
        return old.map(app => app.id === id ? { ...app, status } : app);
      });

      return { previousAppointments };
    },
    onError: (error: any, variables, context) => {
      // Rollback optimistic update
      if (context?.previousAppointments) {
        queryClient.setQueryData(['appointments_optimized'], context.previousAppointments);
      }
      console.error('Erro ao atualizar status:', error);
      toast.error(`Erro ao atualizar status: ${error.message}`);
    },
    onSuccess: () => {
      toast.success('Status atualizado com sucesso!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments_optimized'] });
      queryClient.invalidateQueries({ queryKey: ['finance_appointments'] });
    }
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: string) => {
      // Delete services first (foreign key constraint)
      const { error: servicesError } = await supabase
        .from('appointment_services')
        .delete()
        .eq('appointment_id', id);

      if (servicesError) throw servicesError;

      // Delete appointment
      const { error: appointmentError } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (appointmentError) throw appointmentError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments_optimized'] });
      queryClient.invalidateQueries({ queryKey: ['finance_appointments'] });
      toast.success('Agendamento excluído com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao excluir agendamento:', error);
      toast.error(`Erro ao excluir agendamento: ${error.message}`);
    }
  });

  return {
    createAppointment: createAppointmentMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    deleteAppointment: deleteAppointmentMutation.mutate,
    isCreating: createAppointmentMutation.isPending,
    isUpdating: updateStatusMutation.isPending,
    isDeleting: deleteAppointmentMutation.isPending,
  };
};
