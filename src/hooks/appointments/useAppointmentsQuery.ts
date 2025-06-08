
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Appointment, Service } from '@/types';

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

export const useAppointmentsQuery = () => {
  return useQuery({
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
            description: '',
            createdAt: new Date()
          })) || [] as Service[],
        employeeId: appointment.employee_id,
        date: new Date(appointment.date),
        status: appointment.status as any,
        notes: appointment.notes || '',
        totalPrice: Number(appointment.total_price) || 0
      }));
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 2,
    retryDelay: 1000,
  });
};
