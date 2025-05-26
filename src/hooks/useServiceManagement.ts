
import { useState, useEffect } from "react";
import { Service } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/components/ErrorBoundary";

export const useServiceManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name");

      if (error) throw error;

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
    } catch (error: any) {
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

  const addService = async (serviceData: Omit<Service, "id" | "createdAt">) => {
    try {
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

      if (error) throw error;

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
        title: "Serviço adicionado com sucesso!",
        description: `${serviceData.name} foi cadastrado no sistema.`,
      });
    } catch (error: any) {
      handleError(error, 'addService');
      toast({
        title: "Erro ao adicionar serviço",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateService = async (id: string, serviceData: Omit<Service, "id" | "createdAt">) => {
    try {
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

      if (error) throw error;

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
        title: "Serviço atualizado com sucesso!",
        description: `${serviceData.name} foi atualizado.`,
      });
    } catch (error: any) {
      handleError(error, 'updateService');
      toast({
        title: "Erro ao atualizar serviço",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setServices(prev => prev.filter(s => s.id !== id));
      
      toast({
        title: "Serviço removido com sucesso!",
        description: "O serviço foi removido do sistema.",
      });
    } catch (error: any) {
      handleError(error, 'deleteService');
      toast({
        title: "Erro ao remover serviço",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingService(null);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    filteredServices,
    searchTerm,
    dialogOpen,
    editingService,
    isLoading,
    setDialogOpen,
    handleSearch,
    addService,
    updateService,
    deleteService,
    openEditDialog,
    closeDialog,
    refreshServices: fetchServices
  };
};
