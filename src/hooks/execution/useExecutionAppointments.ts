
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '@/types';

export const useExecutionAppointments = () => {
  return useQuery({
    queryKey: ['execution_appointments'],
    queryFn: async (): Promise<Appointment[]> => {
      console.log('🔄 Carregando agendamentos para execução...');

      // Query otimizada - apenas agendamentos ativos dos próximos 7 dias
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

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
          vehicles!appointments_vehicle_id_fkey(plate, model, brand),
          employees!appointments_employee_id_fkey(name),
          appointment_services!appointment_services_appointment_id_fkey(
            services!appointment_services_service_id_fkey(id, name, price, duration)
          )
        `)
        .in('status', ['scheduled', 'in-progress'])
        .gte('date', new Date().toISOString())
        .lte('date', nextWeek.toISOString())
        .order('date', { ascending: true })
        .limit(50);

      if (error) throw error;

      console.log('✅ Agendamentos de execução carregados:', data?.length || 0);

      return (data || []).map((appointment: any) => ({
        id: appointment.id,
        customerId: appointment.customer_id,
        customerName: appointment.customers?.name || '',
        vehicleId: appointment.vehicle_id,
        vehicleInfo: appointment.vehicles 
          ? `${appointment.vehicles.brand || ''} ${appointment.vehicles.model || ''} - ${appointment.vehicles.plate || ''}`.trim()
          : '',
        services: appointment.appointment_services
          ?.map((as: any) => as.services)
          .filter(Boolean)
          .map((service: any) => ({
            id: service.id,
            name: service.name || '',
            price: Number(service.price) || 0,
            duration: Number(service.duration) || 0,
            commissionPercentage: 0,
            description: '',
            createdAt: new Date()
          })) || [],
        employeeId: appointment.employee_id,
        date: new Date(appointment.date),
        status: appointment.status as any,
        notes: appointment.notes || '',
        totalPrice: Number(appointment.total_price) || 0
      }));
    },
    staleTime: 1000 * 60 * 2, // 2 minutos
    cacheTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
    retryDelay: 500,
  });
};
