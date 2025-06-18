
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { addDays, startOfDay, endOfDay } from 'date-fns';

interface FinanceData {
  completedAppointments: Array<{
    id: string;
    customerName: string;
    vehicleInfo: string;
    services: Array<{ name: string; price: number }>;
    totalPrice: number;
    date: Date;
    employeeName: string;
  }>;
  totalRevenue: number;
  employeeCommissions: Array<{
    employeeId: string;
    employeeName: string;
    totalCommission: number;
    serviceCount: number;
  }>;
  chartData: Array<{
    date: string;
    revenue: number;
    appointments: number;
  }>;
}

const getPeriodDates = (period: string) => {
  const now = new Date();
  const today = startOfDay(now);
  
  switch (period) {
    case 'today':
      return { start: today, end: endOfDay(now) };
    case 'week':
      return { start: addDays(today, -7), end: endOfDay(now) };
    case 'month':
      return { start: addDays(today, -30), end: endOfDay(now) };
    case 'quarter':
      return { start: addDays(today, -90), end: endOfDay(now) };
    default:
      return { start: today, end: endOfDay(now) };
  }
};

export const useFinanceOptimized = (selectedPeriod: string) => {
  const periodDates = useMemo(() => getPeriodDates(selectedPeriod), [selectedPeriod]);

  const { data: financeData, isLoading } = useQuery({
    queryKey: ['finance_optimized', selectedPeriod, periodDates],
    queryFn: async (): Promise<FinanceData> => {
      console.log('Buscando dados financeiros para o período:', selectedPeriod);

      // Query otimizada para agendamentos completos com relacionamentos específicos
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
          id,
          date,
          total_price,
          customers!appointments_customer_id_fkey(name),
          vehicles!appointments_vehicle_id_fkey(plate, model, brand),
          employees!appointments_employee_id_fkey(name),
          appointment_services!appointment_services_appointment_id_fkey(
            services!appointment_services_service_id_fkey(name, price)
          )
        `)
        .eq('status', 'completed')
        .gte('date', periodDates.start.toISOString())
        .lte('date', periodDates.end.toISOString())
        .order('date', { ascending: false });

      if (error) {
        console.error('Erro ao buscar agendamentos financeiros:', error);
        throw error;
      }

      console.log('Agendamentos encontrados:', appointments?.length || 0);

      // Query para comissões de funcionários no mesmo período
      const { data: commissions, error: commissionsError } = await supabase
        .from('employee_commissions')
        .select(`
          employee_id,
          commission_amount,
          employees!employee_commissions_employee_id_fkey(name)
        `)
        .gte('created_at', periodDates.start.toISOString())
        .lte('created_at', periodDates.end.toISOString());

      if (commissionsError) {
        console.error('Erro ao buscar comissões:', commissionsError);
      }

      // Processar dados dos agendamentos
      const completedAppointments = (appointments || []).map(app => ({
        id: app.id,
        customerName: app.customers?.name || 'Cliente não encontrado',
        vehicleInfo: app.vehicles 
          ? `${app.vehicles.brand || ''} ${app.vehicles.model || ''} - ${app.vehicles.plate || ''}`.trim()
          : 'Veículo não encontrado',
        services: app.appointment_services
          ?.map(as => as.services)
          .filter(Boolean)
          .map(service => ({
            name: service!.name || '',
            price: Number(service!.price) || 0
          })) || [],
        totalPrice: Number(app.total_price) || 0,
        date: new Date(app.date),
        employeeName: app.employees?.name || 'Funcionário não encontrado'
      }));

      // Calcular receita total
      const totalRevenue = completedAppointments.reduce((sum, app) => sum + app.totalPrice, 0);

      // Processar comissões de funcionários
      const employeeCommissionMap = new Map<string, {
        employeeName: string;
        totalCommission: number;
        serviceCount: number;
      }>();

      (commissions || []).forEach(commission => {
        const employeeId = commission.employee_id;
        const employeeName = commission.employees?.name || '';
        const commissionAmount = Number(commission.commission_amount) || 0;

        if (employeeCommissionMap.has(employeeId)) {
          const existing = employeeCommissionMap.get(employeeId)!;
          existing.totalCommission += commissionAmount;
          existing.serviceCount += 1;
        } else {
          employeeCommissionMap.set(employeeId, {
            employeeName,
            totalCommission: commissionAmount,
            serviceCount: 1
          });
        }
      });

      const employeeCommissions = Array.from(employeeCommissionMap.entries()).map(([employeeId, data]) => ({
        employeeId,
        ...data
      }));

      // Gerar dados do gráfico (agregação diária)
      const dailyData = new Map<string, { revenue: number; appointments: number }>();
      
      completedAppointments.forEach(app => {
        const dateKey = app.date.toDateString();
        if (dailyData.has(dateKey)) {
          const existing = dailyData.get(dateKey)!;
          existing.revenue += app.totalPrice;
          existing.appointments += 1;
        } else {
          dailyData.set(dateKey, {
            revenue: app.totalPrice,
            appointments: 1
          });
        }
      });

      const chartData = Array.from(dailyData.entries())
        .map(([date, data]) => ({
          date,
          ...data
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      console.log('Dados financeiros processados:', {
        appointments: completedAppointments.length,
        totalRevenue,
        commissions: employeeCommissions.length
      });

      return {
        completedAppointments,
        totalRevenue,
        employeeCommissions,
        chartData
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2
  });

  return {
    completedAppointments: financeData?.completedAppointments || [],
    totalRevenue: financeData?.totalRevenue || 0,
    employeeCommissions: financeData?.employeeCommissions || [],
    chartData: financeData?.chartData || [],
    isLoading
  };
};
