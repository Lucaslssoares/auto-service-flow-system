
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PublicAppointmentData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerCpf?: string;
  vehiclePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleColor: string;
  vehicleType: string;
  vehicleYear?: number;
  date: Date;
  services: string[];
  notes?: string;
  totalPrice: number;
}

export const usePublicAppointments = () => {
  const queryClient = useQueryClient();

  const createPublicAppointmentMutation = useMutation({
    mutationFn: async (data: PublicAppointmentData) => {
      console.log('Creating public appointment with data:', data);

      const customerData = {
        name: data.customerName,
        phone: data.customerPhone,
        email: data.customerEmail,
        cpf: data.customerCpf || ''
      };

      const vehicleData = {
        plate: data.vehiclePlate,
        brand: data.vehicleBrand,
        model: data.vehicleModel,
        color: data.vehicleColor,
        type: data.vehicleType,
        year: data.vehicleYear
      };

      const appointmentData = {
        date: data.date.toISOString(),
        services: data.services,
        notes: data.notes || '',
        totalPrice: data.totalPrice
      };

      // Use the secure database function to create the appointment
      const { data: result, error } = await supabase.rpc('create_public_appointment', {
        customer_data: customerData,
        vehicle_data: vehicleData,
        appointment_data: appointmentData
      });

      if (error) {
        console.error('Error creating public appointment:', error);
        throw error;
      }

      console.log('Public appointment created successfully:', result);
      return result;
    },
    onSuccess: () => {
      // Invalidar TODAS as queries relacionadas a agendamentos
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointments_unified'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_data'] });
      queryClient.invalidateQueries({ queryKey: ['appointments_optimized'] });
      
      toast.success('Agendamento criado com sucesso! Em breve entraremos em contato.');
    },
    onError: (error) => {
      console.error('Error creating public appointment:', error);
      toast.error('Erro ao criar agendamento. Tente novamente.');
    }
  });

  return {
    createPublicAppointment: createPublicAppointmentMutation.mutate,
    isCreating: createPublicAppointmentMutation.isPending
  };
};
