
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, isToday, startOfMonth, endOfMonth } from 'date-fns';

interface DashboardData {
  todayAppointments: number;
  inProgressAppointments: number;
  totalCustomers: number;
  totalVehicles: number;
  totalServices: number;
  monthlyRevenue: number;
  recentAppointments: Array<{
    id: string;
    customerName: string;
    serviceName: string;
    time: string;
  }>;
  recentActivities: Array<{
    id: string;
    message: string;
    time: string;
    type: 'success' | 'info' | 'warning';
  }>;
}

export const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboard_data'],
    queryFn: async (): Promise<DashboardData> => {
      console.log('Atualizando dados do dashboard...');
      
      const today = new Date();
      const startOfToday = new Date(today.setHours(0, 0, 0, 0));
      const endOfToday = new Date(today.setHours(23, 59, 59, 999));
      const monthStart = startOfMonth(new Date());
      const monthEnd = endOfMonth(new Date());

      // Buscar agendamentos de hoje
      const { data: todayApps, error: todayError } = await supabase
        .from('appointments')
        .select('id, status')
        .gte('date', startOfToday.toISOString())
        .lte('date', endOfToday.toISOString());

      if (todayError) {
        console.error('Erro ao buscar agendamentos de hoje:', todayError);
        throw todayError;
      }

      // Buscar total de clientes
      const { count: customersCount, error: customersError } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

      if (customersError) {
        console.error('Erro ao buscar clientes:', customersError);
        throw customersError;
      }

      // Buscar total de veículos
      const { count: vehiclesCount, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true });

      if (vehiclesError) {
        console.error('Erro ao buscar veículos:', vehiclesError);
        throw vehiclesError;
      }

      // Buscar total de serviços
      const { count: servicesCount, error: servicesError } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true });

      if (servicesError) {
        console.error('Erro ao buscar serviços:', servicesError);
        throw servicesError;
      }

      // Buscar receita mensal (agendamentos completos)
      const { data: completedApps, error: revenueError } = await supabase
        .from('appointments')
        .select('total_price')
        .eq('status', 'completed')
        .gte('date', monthStart.toISOString())
        .lte('date', monthEnd.toISOString());

      if (revenueError) {
        console.error('Erro ao buscar receita:', revenueError);
        throw revenueError;
      }

      // Buscar agendamentos recentes para hoje
      const { data: recentApps, error: recentError } = await supabase
        .from('appointments')
        .select(`
          id,
          date,
          customers!appointments_customer_id_fkey(name),
          appointment_services(
            services!appointment_services_service_id_fkey(name)
          )
        `)
        .gte('date', startOfToday.toISOString())
        .lte('date', endOfToday.toISOString())
        .order('date', { ascending: true })
        .limit(5);

      if (recentError) {
        console.error('Erro ao buscar agendamentos recentes:', recentError);
        throw recentError;
      }

      // Buscar atividades recentes (últimos agendamentos criados)
      const { data: activities, error: activitiesError } = await supabase
        .from('appointments')
        .select(`
          id,
          created_at,
          status,
          customers!appointments_customer_id_fkey(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (activitiesError) {
        console.error('Erro ao buscar atividades:', activitiesError);
        throw activitiesError;
      }

      // Calcular estatísticas
      const todayAppointments = todayApps?.length || 0;
      const inProgressAppointments = todayApps?.filter(app => app.status === 'in-progress').length || 0;
      const totalCustomers = customersCount || 0;
      const totalVehicles = vehiclesCount || 0;
      const totalServices = servicesCount || 0;
      const monthlyRevenue = completedApps?.reduce((sum, app) => sum + Number(app.total_price || 0), 0) || 0;

      // Processar agendamentos recentes
      const recentAppointments = (recentApps || []).map((app: any) => ({
        id: app.id,
        customerName: app.customers?.name || 'Cliente não encontrado',
        serviceName: app.appointment_services?.[0]?.services?.name || 'Serviço não encontrado',
        time: format(new Date(app.date), 'HH:mm')
      }));

      // Processar atividades recentes
      const recentActivities = (activities || []).map((activity: any) => {
        const timeAgo = Math.floor((Date.now() - new Date(activity.created_at).getTime()) / (1000 * 60));
        
        let message = '';
        let type: 'success' | 'info' | 'warning' = 'info';
        
        switch (activity.status) {
          case 'completed':
            message = `Serviço finalizado para ${activity.customers?.name || 'cliente'}`;
            type = 'success';
            break;
          case 'in-progress':
            message = `Serviço iniciado para ${activity.customers?.name || 'cliente'}`;
            type = 'warning';
            break;
          default:
            message = `Novo agendamento confirmado para ${activity.customers?.name || 'cliente'}`;
            type = 'info';
        }

        return {
          id: activity.id,
          message,
          time: timeAgo < 60 ? `há ${timeAgo} minutos` : `há ${Math.floor(timeAgo / 60)} hora(s)`,
          type
        };
      });

      console.log('Dashboard atualizado:', {
        todayAppointments,
        totalCustomers,
        totalVehicles,
        totalServices
      });

      return {
        todayAppointments,
        inProgressAppointments,
        totalCustomers,
        totalVehicles,
        totalServices,
        monthlyRevenue,
        recentAppointments,
        recentActivities
      };
    },
    staleTime: 1000 * 60 * 1, // 1 minuto
    retry: 2,
    retryDelay: 1000,
  });
};
