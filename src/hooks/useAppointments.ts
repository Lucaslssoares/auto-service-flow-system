
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Appointment, AppointmentStatus } from '@/types';

export const useAppointments = () => {
  const queryClient = useQueryClient();

  // Fetch all appointments with related data
  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          customers(name),
          vehicles(plate, model, brand, color),
          employees(name),
          appointment_services(
            services(id, name, price)
          )
        `)
        .order('date', { ascending: true });

      if (error) throw error;

      return data.map((appointment: any) => ({
        id: appointment.id,
        customerId: appointment.customer_id,
        customerName: appointment.customers?.name || 'Cliente não encontrado',
        vehicleId: appointment.vehicle_id,
        vehicleInfo: appointment.vehicles 
          ? `${appointment.vehicles.brand} ${appointment.vehicles.model} - ${appointment.vehicles.plate}`
          : 'Veículo não encontrado',
        services: appointment.appointment_services?.map((as: any) => as.services) || [],
        employeeId: appointment.employee_id,
        date: new Date(appointment.date),
        status: appointment.status as AppointmentStatus,
        notes: appointment.notes || '',
        totalPrice: Number(appointment.total_price)
      })) as Appointment[];
    }
  });

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: Omit<Appointment, 'id' | 'customerName' | 'vehicleInfo'>) => {
      // First create the appointment
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          customer_id: appointmentData.customerId,
          vehicle_id: appointmentData.vehicleId,
          employee_id: appointmentData.employeeId,
          date: appointmentData.date.toISOString(),
          status: appointmentData.status,
          notes: appointmentData.notes,
          total_price: appointmentData.totalPrice
        })
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      // Then create the appointment services relationships
      if (appointmentData.services && appointmentData.services.length > 0) {
        const serviceInserts = appointmentData.services.map(service => ({
          appointment_id: appointment.id,
          service_id: service.id
        }));

        const { error: servicesError } = await supabase
          .from('appointment_services')
          .insert(serviceInserts);

        if (servicesError) throw servicesError;
      }

      return appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Agendamento criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar agendamento:', error);
      toast.error('Erro ao criar agendamento');
    }
  });

  // Update appointment status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: AppointmentStatus }) => {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Status atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  });

  // Delete appointment mutation
  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: string) => {
      // First delete appointment services
      await supabase
        .from('appointment_services')
        .delete()
        .eq('appointment_id', id);

      // Then delete the appointment
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Agendamento excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir agendamento:', error);
      toast.error('Erro ao excluir agendamento');
    }
  });

  return {
    appointments,
    isLoading,
    error,
    createAppointment: createAppointmentMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    deleteAppointment: deleteAppointmentMutation.mutate,
    isCreating: createAppointmentMutation.isPending,
    isUpdating: updateStatusMutation.isPending,
    isDeleting: deleteAppointmentMutation.isPending
  };
};
