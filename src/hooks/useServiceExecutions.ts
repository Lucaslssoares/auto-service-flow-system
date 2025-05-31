
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

  // Start service execution mutation - now supports multiple employees
  const startExecutionMutation = useMutation({
    mutationFn: async ({ appointmentId, serviceId, employees }: {
      appointmentId: string;
      serviceId: string;
      employees: Array<{ employeeId: string; profitPercentage: number }>;
    }) => {
      // Validate that profit percentages sum to 100
      const totalProfitPercentage = employees.reduce((sum, emp) => sum + emp.profitPercentage, 0);
      if (Math.abs(totalProfitPercentage - 100) > 0.01) {
        throw new Error('A soma das porcentagens de lucro deve ser 100%');
      }

      // Insert execution records for each employee
      const executions = employees.map(emp => ({
        appointment_id: appointmentId,
        service_id: serviceId,
        employee_id: emp.employeeId,
        start_time: new Date().toISOString(),
        status: 'in-progress',
        profit_percentage: emp.profitPercentage
      }));

      const { error } = await supabase
        .from('service_executions')
        .insert(executions);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_executions'] });
      toast.success('Execução do serviço iniciada com múltiplos funcionários!');
    },
    onError: (error) => {
      console.error('Erro ao iniciar execução:', error);
      toast.error(error.message || 'Erro ao iniciar execução do serviço');
    }
  });

  // Complete service execution mutation - completes all executions for a service
  const completeExecutionMutation = useMutation({
    mutationFn: async ({ appointmentId, serviceId, notes }: { 
      appointmentId: string; 
      serviceId: string; 
      notes?: string 
    }) => {
      const { error } = await supabase
        .from('service_executions')
        .update({
          end_time: new Date().toISOString(),
          status: 'completed',
          notes
        })
        .eq('appointment_id', appointmentId)
        .eq('service_id', serviceId)
        .eq('status', 'in-progress');

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

  // Calculate commissions for service execution
  const calculateCommissionMutation = useMutation({
    mutationFn: async ({ 
      serviceExecutionId, 
      employeeId, 
      appointmentId, 
      serviceId, 
      basePrice, 
      commissionPercentage, 
      profitPercentage 
    }: {
      serviceExecutionId: string;
      employeeId: string;
      appointmentId: string;
      serviceId: string;
      basePrice: number;
      commissionPercentage: number;
      profitPercentage: number;
    }) => {
      const { data, error } = await supabase
        .rpc('calculate_employee_commission', {
          p_service_execution_id: serviceExecutionId,
          p_employee_id: employeeId,
          p_appointment_id: appointmentId,
          p_service_id: serviceId,
          p_base_price: basePrice,
          p_commission_percentage: commissionPercentage,
          p_profit_percentage: profitPercentage
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_executions'] });
      queryClient.invalidateQueries({ queryKey: ['finance_appointments'] });
      toast.success('Comissão calculada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao calcular comissão:', error);
      toast.error('Erro ao calcular comissão');
    }
  });

  return {
    executions,
    isLoading,
    startExecution: startExecutionMutation.mutate,
    completeExecution: completeExecutionMutation.mutate,
    calculateCommission: calculateCommissionMutation.mutate,
    isStarting: startExecutionMutation.isPending,
    isCompleting: completeExecutionMutation.isPending,
    isCalculating: calculateCommissionMutation.isPending
  };
};
