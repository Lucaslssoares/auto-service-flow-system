
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ModuleStatus {
  customers: boolean;
  vehicles: boolean;
  services: boolean;
  employees: boolean;
  appointments: boolean;
}

export const useSystemHealth = () => {
  const [moduleStatus, setModuleStatus] = useState<ModuleStatus>({
    customers: false,
    vehicles: false,
    services: false,
    employees: false,
    appointments: false,
  });
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const checkModuleHealth = async () => {
    setIsChecking(true);
    const status: ModuleStatus = {
      customers: false,
      vehicles: false,
      services: false,
      employees: false,
      appointments: false,
    };

    try {
      // Verificar módulo de clientes
      const { error: customersError } = await supabase
        .from('customers')
        .select('id')
        .limit(1);
      status.customers = !customersError;

      // Verificar módulo de veículos
      const { error: vehiclesError } = await supabase
        .from('vehicles')
        .select(`
          id,
          customers!vehicles_customer_id_fkey(name)
        `)
        .limit(1);
      status.vehicles = !vehiclesError;

      // Verificar módulo de serviços
      const { error: servicesError } = await supabase
        .from('services')
        .select('id')
        .limit(1);
      status.services = !servicesError;

      // Verificar módulo de funcionários
      const { error: employeesError } = await supabase
        .from('employees')
        .select('id')
        .limit(1);
      status.employees = !employeesError;

      // Verificar módulo de agendamentos
      const { error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          id,
          customers(name),
          vehicles(plate),
          employees(name)
        `)
        .limit(1);
      status.appointments = !appointmentsError;

      setModuleStatus(status);

      const failedModules = Object.entries(status)
        .filter(([_, working]) => !working)
        .map(([module, _]) => module);

      if (failedModules.length > 0) {
        toast({
          title: "Alguns módulos apresentam problemas",
          description: `Módulos com problemas: ${failedModules.join(', ')}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sistema funcionando corretamente",
          description: "Todos os módulos estão operacionais",
        });
      }
    } catch (error) {
      console.error('Erro na verificação do sistema:', error);
      toast({
        title: "Erro na verificação do sistema",
        description: "Não foi possível verificar o status dos módulos",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkModuleHealth();
  }, []);

  return {
    moduleStatus,
    isChecking,
    checkModuleHealth,
  };
};
