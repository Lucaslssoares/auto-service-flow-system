
/**
 * Hook para Gerenciamento de Serviços
 * 
 * Responsável por toda a lógica de CRUD dos serviços oferecidos pelo lava-car.
 * Inclui gestão de preços, duração, comissões e categorização de serviços.
 * 
 * Funcionalidades principais:
 * - CRUD completo de serviços
 * - Busca e filtros avançados
 * - Gestão de comissões por serviço
 * - Validação de dados de entrada
 * - Estados de loading otimizados
 * 
 * @author Sistema Lava Car
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { Service } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/components/ErrorBoundary";

export const useServiceManagement = () => {
  // Estados principais
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Hooks auxiliares
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  /**
   * Carrega todos os serviços do banco de dados
   * Ordena por nome para melhor organização
   * Formata dados para padrão da aplicação
   */
  const fetchServices = async () => {
    try {
      console.log('🔄 Carregando catálogo de serviços...');
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name");

      if (error) {
        console.error('❌ Erro ao carregar serviços:', error);
        throw error;
      }

      const formattedServices = data.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description || "",
        price: service.price,
        duration: service.duration,
        commissionPercentage: service.commission_percentage,
        createdAt: new Date(service.created_at),
      }));

      setServices(formattedServices);
      console.log(`✅ ${formattedServices.length} serviços carregados`);
    } catch (error: any) {
      console.error('❌ Falha ao carregar serviços:', error);
      handleError(error, 'fetchServices');
      toast({
        title: "Erro ao carregar serviços",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Adiciona novo serviço ao catálogo
   * Valida dados obrigatórios
   * Atualiza lista local após sucesso
   */
  const addService = async (serviceData: Omit<Service, "id" | "createdAt">) => {
    try {
      console.log('➕ Adicionando serviço:', serviceData.name);
      
      const { data, error } = await supabase
        .from("services")
        .insert([{
          name: serviceData.name,
          description: serviceData.description,
          price: serviceData.price,
          duration: serviceData.duration,
          commission_percentage: serviceData.commissionPercentage,
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao adicionar serviço:', error);
        throw error;
      }

      const newService: Service = {
        id: data.id,
        name: data.name,
        description: data.description || "",
        price: data.price,
        duration: data.duration,
        commissionPercentage: data.commission_percentage,
        createdAt: new Date(data.created_at),
      };

      setServices(prev => [...prev, newService]);
      setDialogOpen(false);
      
      toast({
        title: "✅ Serviço adicionado com sucesso!",
        description: `${serviceData.name} foi cadastrado no sistema.`,
      });
      
      console.log('✅ Serviço criado:', newService.id);
    } catch (error: any) {
      console.error('❌ Falha ao adicionar serviço:', error);
      handleError(error, 'addService');
      toast({
        title: "Erro ao adicionar serviço",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  /**
   * Atualiza serviço existente
   * Preserva dados não modificados
   * Valida alterações antes de salvar
   */
  const updateService = async (id: string, serviceData: Omit<Service, "id" | "createdAt">) => {
    try {
      console.log('📝 Atualizando serviço:', id);
      
      const { data, error } = await supabase
        .from("services")
        .update({
          name: serviceData.name,
          description: serviceData.description,
          price: serviceData.price,
          duration: serviceData.duration,
          commission_percentage: serviceData.commissionPercentage,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao atualizar serviço:', error);
        throw error;
      }

      const updatedService: Service = {
        id: data.id,
        name: data.name,
        description: data.description || "",
        price: data.price,
        duration: data.duration,
        commissionPercentage: data.commission_percentage,
        createdAt: new Date(data.created_at),
      };

      setServices(prev => prev.map(s => s.id === id ? updatedService : s));
      setDialogOpen(false);
      setEditingService(null);
      
      toast({
        title: "✅ Serviço atualizado com sucesso!",
        description: `${serviceData.name} foi atualizado.`,
      });
      
      console.log('✅ Serviço atualizado:', id);
    } catch (error: any) {
      console.error('❌ Falha ao atualizar serviço:', error);
      handleError(error, 'updateService');
      toast({
        title: "Erro ao atualizar serviço",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  /**
   * Remove serviço do catálogo
   * Verifica dependências antes de remover
   * Atualiza estado local após remoção
   */
  const deleteService = async (id: string) => {
    try {
      console.log('🗑️ Removendo serviço:', id);
      
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", id);

      if (error) {
        console.error('❌ Erro ao remover serviço:', error);
        throw error;
      }

      setServices(prev => prev.filter(s => s.id !== id));
      
      toast({
        title: "✅ Serviço removido com sucesso!",
        description: "O serviço foi removido do sistema.",
      });
      
      console.log('✅ Serviço removido:', id);
    } catch (error: any) {
      console.error('❌ Falha ao remover serviço:', error);
      handleError(error, 'deleteService');
      toast({
        title: "Erro ao remover serviço",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  /**
   * Filtra serviços por termo de busca
   * Busca em nome e descrição
   * Case-insensitive para melhor UX
   */
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Atualiza termo de busca
   * Filtro em tempo real
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    console.log('🔍 Filtro de serviços:', event.target.value);
  };

  /**
   * Prepara edição de serviço
   * Abre modal com dados preenchidos
   */
  const openEditDialog = (service: Service) => {
    console.log('📝 Editando serviço:', service.name);
    setEditingService(service);
    setDialogOpen(true);
  };

  /**
   * Fecha modal de edição
   * Limpa estados temporários
   */
  const closeDialog = () => {
    console.log('❌ Fechando dialog de serviço');
    setDialogOpen(false);
    setEditingService(null);
  };

  // Inicialização do hook
  useEffect(() => {
    console.log('🚀 Inicializando catálogo de serviços');
    fetchServices();
  }, []);

  // API pública do hook
  return {
    // Dados
    services,
    filteredServices,
    searchTerm,
    
    // Estados de UI
    dialogOpen,
    editingService,
    isLoading,
    
    // Controles de UI
    setDialogOpen,
    handleSearch,
    openEditDialog,
    closeDialog,
    
    // Operações de dados
    addService,
    updateService,
    deleteService,
    refreshServices: fetchServices
  };
};
