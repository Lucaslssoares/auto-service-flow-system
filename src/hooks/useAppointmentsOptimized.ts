import { useState, useEffect, useCallback } from 'react';
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
  status: AppointmentStatus;
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

export const useAppointmentsOptimized = () => {
  const queryClient = useQueryClient();

  // Optimized query with specific field selection and proper joins
  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey: ['appointments_optimized'],
    queryFn: async (): Promise<Appointment[]> => {
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

      return (data as AppointmentWithRelations[]).map((appointment) => ({
        id: appointment.id,
        customerId: appointment.customer_id,
        customerName: appointment.customers?.name || '',
        vehicleId: appointment.vehicle_id,
        vehicleInfo: appointment.vehicles 
          ? `${appointment.vehicles.brand || ''} ${appointment.vehicles.model || ''} - ${appointment.vehicles.plate || ''}`.trim()
          : '',
        services: appointment.appointment_services
          ?.map(as => as.services)
          .filter(Boolean)
          .map(service => ({
            id: service!.id,
            name: service!.name || '',
            price: Number(service!.price) || 0,
            duration: Number(service!.duration) || 0,
            commissionPercentage: Number(service!.commission_percentage) || 0,
            description: '', // Add default values for missing Service properties
            createdAt: new Date() // Add default createdAt
          })) || [] as Service[],
        employeeId: appointment.employee_id,
        date: new Date(appointment.date),
        status: appointment.status,
        notes: appointment.notes || '',
        totalPrice: Number(appointment.total_price) || 0
      }));
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 2,
    retryDelay: 1000,
  });

  // Optimized create mutation with proper error handling
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

  // Optimized status update with optimistic updates
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

  // Optimized delete with proper cleanup
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

  // Memoized filter functions for better performance
  const getAppointmentsByStatus = useCallback((status: AppointmentStatus) => {
    return appointments.filter(app => app.status === status);
  }, [appointments]);

  const getTodayAppointments = useCallback(() => {
    const today = new Date().toDateString();
    return appointments.filter(app => app.date.toDateString() === today);
  }, [appointments]);

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
