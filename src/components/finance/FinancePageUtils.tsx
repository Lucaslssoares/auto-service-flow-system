
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export const useFinanceData = (selectedPeriod: string) => {
  // Get date range based on selected period
  const getDateRange = (period: string) => {
    const now = new Date();
    
    switch (period) {
      case "today":
        return { start: startOfDay(now), end: endOfDay(now) };
      case "yesterday":
        const yesterday = subDays(now, 1);
        return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
      case "week":
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case "month":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "last7days":
        return { start: startOfDay(subDays(now, 6)), end: endOfDay(now) };
      case "last30days":
        return { start: startOfDay(subDays(now, 29)), end: endOfDay(now) };
      default:
        return { start: startOfDay(now), end: endOfDay(now) };
    }
  };

  const { start, end } = getDateRange(selectedPeriod);

  // Fetch completed appointments with financial data
  const { data: completedAppointments = [], isLoading } = useQuery({
    queryKey: ['finance_appointments', selectedPeriod, start, end],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          customers(name),
          vehicles(plate, model, brand),
          employees(name),
          appointment_services(
            services(id, name, price, commission_percentage)
          ),
          service_executions(
            employee_id,
            profit_percentage,
            employees(name)
          )
        `)
        .eq('status', 'completed')
        .gte('date', start.toISOString())
        .lte('date', end.toISOString())
        .order('date', { ascending: false });

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
        employeeName: appointment.employees?.name || 'Funcionário não encontrado',
        date: new Date(appointment.date),
        status: appointment.status,
        notes: appointment.notes || '',
        totalPrice: Number(appointment.total_price),
        serviceExecutions: appointment.service_executions || []
      }));
    }
  });

  // Calculate total revenue
  const totalRevenue = completedAppointments.reduce((sum, appointment) => sum + appointment.totalPrice, 0);

  // Calculate employee commissions based on service executions and profit sharing
  const employeeCommissions = completedAppointments.reduce((acc: any[], appointment) => {
    // Group service executions by employee
    const executionsByEmployee = appointment.serviceExecutions.reduce((empAcc: any, execution: any) => {
      const employeeId = execution.employee_id;
      const employeeName = execution.employees?.name || 'Funcionário não encontrado';
      
      if (!empAcc[employeeId]) {
        empAcc[employeeId] = {
          employeeId,
          employeeName,
          totalCommission: 0,
          serviceCount: 0
        };
      }
      
      // Find the service for this execution
      const service = appointment.services?.find((s: any) => 
        // Since services is already mapped from appointment_services, we can directly compare IDs
        s.id === execution.service_id
      );
      
      if (service) {
        // Calculate commission based on profit percentage
        const baseCommission = (service.price * service.commission_percentage) / 100;
        const actualCommission = (baseCommission * execution.profit_percentage) / 100;
        
        empAcc[employeeId].totalCommission += actualCommission;
        empAcc[employeeId].serviceCount += 1;
      }
      
      return empAcc;
    }, {});

    // Add to accumulator
    Object.values(executionsByEmployee).forEach((empData: any) => {
      const existingEmployee = acc.find(emp => emp.employeeId === empData.employeeId);
      
      if (existingEmployee) {
        existingEmployee.totalCommission += empData.totalCommission;
        existingEmployee.serviceCount += empData.serviceCount;
      } else {
        acc.push(empData);
      }
    });

    return acc;
  }, []);

  // Prepare chart data - revenue by day
  const chartData = completedAppointments.reduce((acc: any[], appointment) => {
    const dateKey = appointment.date.toISOString().split('T')[0];
    const existingDay = acc.find(day => day.date === dateKey);
    
    if (existingDay) {
      existingDay.revenue += appointment.totalPrice;
    } else {
      acc.push({
        date: dateKey,
        revenue: appointment.totalPrice,
        appointments: 1
      });
    }
    return acc;
  }, []);

  return {
    completedAppointments,
    totalRevenue,
    employeeCommissions,
    chartData,
    isLoading
  };
};

// Legacy functions for backward compatibility
export const getFilteredAppointments = (period: string, statuses: string[]) => {
  // This is now handled by the hook above
  return [];
};

export const calculateTotalRevenue = (appointments: any[]) => {
  return appointments.reduce((sum, appointment) => sum + appointment.totalPrice, 0);
};

export const calculateEmployeeCommissions = (appointments: any[]) => {
  return appointments.reduce((acc: any[], appointment) => {
    appointment.services?.forEach((service: any) => {
      const commission = (service.price * service.commission_percentage) / 100;
      const existingEmployee = acc.find((emp: any) => emp.employeeId === appointment.employeeId);
      
      if (existingEmployee) {
        existingEmployee.totalCommission += commission;
        existingEmployee.serviceCount += 1;
      } else {
        acc.push({
          employeeId: appointment.employeeId,
          employeeName: appointment.employeeName,
          totalCommission: commission,
          serviceCount: 1
        });
      }
    });
    return acc;
  }, []);
};

export const prepareChartData = (appointments: any[]) => {
  return appointments.reduce((acc: any[], appointment) => {
    const dateKey = appointment.date.toISOString().split('T')[0];
    const existingDay = acc.find((day: any) => day.date === dateKey);
    
    if (existingDay) {
      existingDay.revenue += appointment.totalPrice;
    } else {
      acc.push({
        date: dateKey,
        revenue: appointment.totalPrice,
        appointments: 1
      });
    }
    return acc;
  }, []);
};
