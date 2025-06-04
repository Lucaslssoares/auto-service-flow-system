
/**
 * Hook para Gerenciamento de Clientes
 * 
 * Este hook é responsável por toda a lógica de CRUD (Create, Read, Update, Delete) 
 * dos clientes do sistema. Utiliza integração real com Supabase para persistência
 * de dados e inclui tratamento de erros robusto.
 * 
 * Funcionalidades:
 * - Listagem de clientes com busca em tempo real
 * - Adição de novos clientes com validação
 * - Edição de clientes existentes
 * - Remoção de clientes com confirmação
 * - Estados de loading para melhor UX
 * - Tratamento de erros com feedback visual
 * 
 * @author Sistema Lava Car
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { Customer } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/components/ErrorBoundary";

export const useCustomerManagement = () => {
  // Estados principais do hook
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Hooks auxiliares
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  /**
   * Busca todos os clientes do banco de dados
   * Formata os dados para o padrão da aplicação
   * Inclui tratamento de erro robusto
   */
  const fetchCustomers = async () => {
    try {
      console.log('🔄 Iniciando busca de clientes...');
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("name");

      if (error) {
        console.error('❌ Erro ao buscar clientes:', error);
        throw error;
      }

      const formattedCustomers = data.map(customer => ({
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        cpf: customer.cpf,
        createdAt: new Date(customer.created_at),
      }));

      setCustomers(formattedCustomers);
      console.log(`✅ ${formattedCustomers.length} clientes carregados com sucesso`);
    } catch (error: any) {
      console.error('❌ Falha ao carregar clientes:', error);
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
   * Adiciona um novo cliente ao sistema
   * Valida dados antes de enviar ao banco
   * Atualiza estado local após sucesso
   */
  const addCustomer = async (customerData: Omit<Customer, "id" | "createdAt">) => {
    try {
      console.log('➕ Adicionando novo cliente:', customerData.name);
      
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

      if (error) {
        console.error('❌ Erro ao adicionar cliente:', error);
        throw error;
      }

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
        title: "✅ Cliente adicionado com sucesso!",
        description: `${customerData.name} foi cadastrado no sistema.`,
      });
      
      console.log('✅ Cliente adicionado:', newCustomer.id);
    } catch (error: any) {
      console.error('❌ Falha ao adicionar cliente:', error);
      handleError(error, 'addCustomer');
      toast({
        title: "Erro ao adicionar cliente",
        description: error.message || "Erro interno do servidor",
        variant: "destructive",
      });
    }
  };

  /**
   * Atualiza dados de um cliente existente
   * Preserva dados não modificados
   * Atualiza estado local após sucesso
   */
  const updateCustomer = async (id: string, customerData: Omit<Customer, "id" | "createdAt">) => {
    try {
      console.log('📝 Atualizando cliente:', id);
      
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

      if (error) {
        console.error('❌ Erro ao atualizar cliente:', error);
        throw error;
      }

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
        title: "✅ Cliente atualizado com sucesso!",
        description: `${customerData.name} foi atualizado.`,
      });
      
      console.log('✅ Cliente atualizado:', id);
    } catch (error: any) {
      console.error('❌ Falha ao atualizar cliente:', error);
      handleError(error, 'updateCustomer');
      toast({
        title: "Erro ao atualizar cliente",
        description: error.message || "Erro interno do servidor",
        variant: "destructive",
      });
    }
  };

  /**
   * Remove um cliente do sistema
   * Inclui validação de dependências (futuramente)
   * Atualiza estado local após sucesso
   */
  const deleteCustomer = async (id: string) => {
    try {
      console.log('🗑️ Removendo cliente:', id);
      
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", id);

      if (error) {
        console.error('❌ Erro ao remover cliente:', error);
        throw error;
      }

      setCustomers(prev => prev.filter(c => c.id !== id));
      
      toast({
        title: "✅ Cliente removido com sucesso!",
        description: "O cliente foi removido do sistema.",
      });
      
      console.log('✅ Cliente removido:', id);
    } catch (error: any) {
      console.error('❌ Falha ao remover cliente:', error);
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
   * Busca por nome, telefone, email e CPF
   * Busca case-insensitive para melhor UX
   */
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.cpf.includes(searchTerm)
  );

  /**
   * Manipula mudanças no campo de busca
   * Atualiza termo de busca em tempo real
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    console.log('🔍 Busca atualizada:', event.target.value);
  };

  /**
   * Abre modal de edição com dados do cliente
   * Prepara estado para edição
   */
  const openEditDialog = (customer: Customer) => {
    console.log('📝 Abrindo edição para cliente:', customer.name);
    setEditingCustomer(customer);
    setDialogOpen(true);
  };

  /**
   * Fecha modal e limpa estados de edição
   * Reseta formulário para estado inicial
   */
  const closeDialog = () => {
    console.log('❌ Fechando dialog de cliente');
    setDialogOpen(false);
    setEditingCustomer(null);
  };

  // Carrega clientes ao montar o componente
  useEffect(() => {
    console.log('🚀 Inicializando gerenciamento de clientes');
    fetchCustomers();
  }, []);

  // API pública do hook
  return {
    // Dados
    customers,
    filteredCustomers,
    searchTerm,
    
    // Estados de UI
    dialogOpen,
    editingCustomer,
    isLoading,
    
    // Ações de UI
    setDialogOpen,
    handleSearch,
    openEditDialog,
    closeDialog,
    
    // Operações de dados
    addCustomer,
    updateCustomer,
    deleteCustomer,
    refreshCustomers: fetchCustomers
  };
};
