
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDashboardOptimized = () => {
  return useQuery({
    queryKey: ['dashboard_optimized'],
    queryFn: async () => {
      try {
        console.log('🚀 Carregando dados do dashboard otimizado...');

        // Executar queries em paralelo para melhor performance
        const [appointmentsResult, customersResult, servicesResult] = await Promise.all([
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

          supabase
            .from('customers')
            .select('id', { count: 'exact', head: true }),

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
        
        const today = new Date();
        const todayStart = new Date(today.setHours(0, 0, 0, 0));
        
        const todayAppointments = appointments.filter(
          app => new Date(app.date) >= todayStart
        );

        const totalRevenue = appointments
          .filter(app => app.status === 'completed')
          .reduce((sum, app) => sum + (Number(app.total_price) || 0), 0);

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
      } catch (err: any) {
        console.error('Erro ao carregar dados do dashboard:', err);
        toast.error('Erro ao carregar dados do dashboard!');
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5, // Dados considerados frescos por 5 minutos
    gcTime: 1000 * 60 * 15, // Lixeira aumenta pra evitar recarregamentos excessivos
    retry: 2,
    retryDelay: attemptIndex => Math.min(2000, 500 + attemptIndex * 500), // backoff progressivo
    refetchOnWindowFocus: false, // Não buscar novamente ao trocar de aba
  });
};
