
/**
 * Hook para gerenciamento de clientes com integração real ao Supabase
 * Substitui o uso de dados mockados por dados reais do banco
 */
import { useState, useEffect } from "react";
import { Customer } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/components/ErrorBoundary";

export const useCustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  /**
   * Busca todos os clientes do banco de dados
   */
  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("name");

      if (error) throw error;

      const formattedCustomers = data.map(customer => ({
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        cpf: customer.cpf,
        createdAt: new Date(customer.created_at),
      }));

      setCustomers(formattedCustomers);
    } catch (error: any) {
      handleError(error, 'fetchCustomers');
      toast({
        title: "Erro ao carregar clientes",
        description: error.message || "Erro interno do servidor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Adiciona um novo cliente ao banco de dados
   */
  const addCustomer = async (customerData: Omit<Customer, "id" | "createdAt">) => {
    try {
      const { data, error } = await supabase
        .from("customers")
        .insert([{
          name: customerData.name,
          phone: customerData.phone,
          email: customerData.email,
          cpf: customerData.cpf,
        }])
        .select()
        .single();

      if (error) throw error;

      const newCustomer: Customer = {
        id: data.id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        cpf: data.cpf,
        createdAt: new Date(data.created_at),
      };

      setCustomers(prev => [...prev, newCustomer]);
      setDialogOpen(false);
      
      toast({
        title: "Cliente adicionado com sucesso!",
        description: `${customerData.name} foi cadastrado no sistema.`,
      });
    } catch (error: any) {
      handleError(error, 'addCustomer');
      toast({
        title: "Erro ao adicionar cliente",
        description: error.message || "Erro interno do servidor",
        variant: "destructive",
      });
    }
  };

  /**
   * Atualiza um cliente existente
   */
  const updateCustomer = async (id: string, customerData: Omit<Customer, "id" | "createdAt">) => {
    try {
      const { data, error } = await supabase
        .from("customers")
        .update({
          name: customerData.name,
          phone: customerData.phone,
          email: customerData.email,
          cpf: customerData.cpf,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      const updatedCustomer: Customer = {
        id: data.id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        cpf: data.cpf,
        createdAt: new Date(data.created_at),
      };

      setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c));
      setDialogOpen(false);
      setEditingCustomer(null);
      
      toast({
        title: "Cliente atualizado com sucesso!",
        description: `${customerData.name} foi atualizado.`,
      });
    } catch (error: any) {
      handleError(error, 'updateCustomer');
      toast({
        title: "Erro ao atualizar cliente",
        description: error.message || "Erro interno do servidor",
        variant: "destructive",
      });
    }
  };

  /**
   * Remove um cliente do banco de dados
   */
  const deleteCustomer = async (id: string) => {
    try {
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setCustomers(prev => prev.filter(c => c.id !== id));
      
      toast({
        title: "Cliente removido com sucesso!",
        description: "O cliente foi removido do sistema.",
      });
    } catch (error: any) {
      handleError(error, 'deleteCustomer');
      toast({
        title: "Erro ao remover cliente",
        description: error.message || "Erro interno do servidor",
        variant: "destructive",
      });
    }
  };

  /**
   * Filtra clientes baseado no termo de busca
   */
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.cpf.includes(searchTerm)
  );

  /**
   * Manipula mudanças no campo de busca
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  /**
   * Abre o dialog para edição
   */
  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer);
    setDialogOpen(true);
  };

  /**
   * Fecha o dialog
   */
  const closeDialog = () => {
    setDialogOpen(false);
    setEditingCustomer(null);
  };

  // Carrega clientes ao montar o componente
  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    filteredCustomers,
    searchTerm,
    dialogOpen,
    editingCustomer,
    isLoading,
    setDialogOpen,
    handleSearch,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    openEditDialog,
    closeDialog,
    refreshCustomers: fetchCustomers
  };
};
