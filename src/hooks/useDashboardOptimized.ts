
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardOptimized = () => {
  return useQuery({
    queryKey: ['dashboard_optimized'],
    queryFn: async () => {
      console.log('🚀 Carregando dados do dashboard otimizado...');

      // Executar queries em paralelo para melhor performance
      const [appointmentsResult, customersResult, servicesResult] = await Promise.all([
        // Query simplificada para appointments - apenas dados essenciais
        supabase
          .from('appointments')
          .select(`
            id,
            date,
            status,
            total_price,
            customers!appointments_customer_id_fkey(name)
          `)
          .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .order('date', { ascending: false })
          .limit(100),

        // Query para contagem de clientes
        supabase
          .from('customers')
          .select('id', { count: 'exact', head: true }),

        // Query para serviços mais populares
        supabase
          .from('appointment_services')
          .select(`
            service_id,
            services!appointment_services_service_id_fkey(name, price)
          `)
          .limit(50)
      ]);

      if (appointmentsResult.error) throw appointmentsResult.error;
      if (customersResult.error) throw customersResult.error;
      if (servicesResult.error) throw servicesResult.error;

      const appointments = appointmentsResult.data || [];
      const totalCustomers = customersResult.count || 0;
      
      // Calcular estatísticas rapidamente
      const today = new Date();
      const todayStart = new Date(today.setHours(0, 0, 0, 0));
      
      const todayAppointments = appointments.filter(
        app => new Date(app.date) >= todayStart
      );

      const totalRevenue = appointments
        .filter(app => app.status === 'completed')
        .reduce((sum, app) => sum + (Number(app.total_price) || 0), 0);

      console.log('✅ Dashboard otimizado carregado');

      return {
        totalAppointments: appointments.length,
        todayAppointments: todayAppointments.length,
        totalRevenue,
        totalCustomers,
        recentAppointments: appointments.slice(0, 5).map(app => ({
          id: app.id,
          customerName: app.customers?.name || 'Cliente não encontrado',
          date: new Date(app.date),
          status: app.status,
          totalPrice: Number(app.total_price) || 0
        }))
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos (renamed from cacheTime)
    retry: 1,
    retryDelay: 500,
  });
};
