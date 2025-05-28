
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ServiceExecution {
  id: string;
  appointmentId: string;
  serviceId: string;
  employeeId: string;
  startTime: Date;
  endTime?: Date;
  status: 'pending' | 'in-progress' | 'completed';
  notes?: string;
  profitPercentage: number;
}

export const useServiceExecutions = () => {
  const queryClient = useQueryClient();

  // Fetch service executions with related data
  const { data: executions = [], isLoading } = useQuery({
    queryKey: ['service_executions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_executions')
        .select(`
          *,
          appointments(
            customers(name),
            vehicles(plate, model, brand)
          ),
          services(name, price),
          employees(name)
        `)
        .order('start_time', { ascending: false });

      if (error) throw error;

      return data.map((execution: any) => ({
        id: execution.id,
        appointmentId: execution.appointment_id,
        serviceId: execution.service_id,
        employeeId: execution.employee_id,
        startTime: new Date(execution.start_time),
        endTime: execution.end_time ? new Date(execution.end_time) : undefined,
        status: execution.status,
        notes: execution.notes,
        profitPercentage: Number(execution.profit_percentage),
        // Related data
        customerName: execution.appointments?.customers?.name,
        vehicleInfo: execution.appointments?.vehicles 
          ? `${execution.appointments.vehicles.brand} ${execution.appointments.vehicles.model} - ${execution.appointments.vehicles.plate}`
          : '',
        serviceName: execution.services?.name,
        servicePrice: Number(execution.services?.price || 0),
        employeeName: execution.employees?.name
      })) as (ServiceExecution & {
        customerName?: string;
        vehicleInfo?: string;
        serviceName?: string;
        servicePrice?: number;
        employeeName?: string;
      })[];
    }
  });

  // Start service execution mutation
  const startExecutionMutation = useMutation({
    mutationFn: async ({ appointmentId, serviceId, employeeId }: {
      appointmentId: string;
      serviceId: string;
      employeeId: string;
    }) => {
      const { error } = await supabase
        .from('service_executions')
        .insert({
          appointment_id: appointmentId,
          service_id: serviceId,
          employee_id: employeeId,
          start_time: new Date().toISOString(),
          status: 'in-progress'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_executions'] });
      toast.success('Execução do serviço iniciada!');
    },
    onError: (error) => {
      console.error('Erro ao iniciar execução:', error);
      toast.error('Erro ao iniciar execução do serviço');
    }
  });

  // Complete service execution mutation
  const completeExecutionMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      const { error } = await supabase
        .from('service_executions')
        .update({
          end_time: new Date().toISOString(),
          status: 'completed',
          notes
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_executions'] });
      toast.success('Execução do serviço finalizada!');
    },
    onError: (error) => {
      console.error('Erro ao finalizar execução:', error);
      toast.error('Erro ao finalizar execução do serviço');
    }
  });

  return {
    executions,
    isLoading,
    startExecution: startExecutionMutation.mutate,
    completeExecution: completeExecutionMutation.mutate,
    isStarting: startExecutionMutation.isPending,
    isCompleting: completeExecutionMutation.isPending
  };
};
