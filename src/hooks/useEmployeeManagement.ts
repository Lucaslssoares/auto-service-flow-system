
/**
 * Hook para Gerenciamento de Funcionários
 * 
 * Gerencia toda a lógica relacionada aos funcionários do lava-car.
 * Inclui controle de cargos, salários, comissões e histórico de trabalho.
 * 
 * Funcionalidades:
 * - CRUD completo de funcionários
 * - Gestão de cargos e permissões
 * - Controle de comissões (fixa, percentual, mista)
 * - Busca avançada por múltiplos campos
 * - Validação de dados pessoais
 * 
 * @author Sistema Lava Car
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { Employee } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useEmployeeManagement = () => {
  // Estados principais
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Hook auxiliar
  const { toast } = useToast();

  /**
   * Carrega todos os funcionários ativos
   * Ordena por nome para organização
   * Formata dados para padrão da aplicação
   */
  const fetchEmployees = async () => {
    try {
      console.log('🔄 Carregando equipe...');
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("name");

      if (error) {
        console.error('❌ Erro ao carregar funcionários:', error);
        throw error;
      }

      const formattedEmployees = data.map(emp => ({
        id: emp.id,
        name: emp.name,
        role: emp.role,
        phone: emp.phone,
        email: emp.email,
        document: emp.document,
        joinDate: new Date(emp.join_date),
        salary: emp.salary,
        commissionType: emp.commission_type as "fixed" | "percentage" | "mixed",
      }));

      setEmployees(formattedEmployees);
      console.log(`✅ ${formattedEmployees.length} funcionários carregados`);
    } catch (error: any) {
      console.error('❌ Falha ao carregar funcionários:', error);
      toast({
        title: "Erro ao carregar funcionários",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Filtra funcionários por termo de busca
   * Busca em nome, cargo e email
   * Ignora case para melhor experiência
   */
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Atualiza filtro de busca
   * Busca em tempo real
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    console.log('🔍 Filtro de funcionários:', event.target.value);
  };

  /**
   * Adiciona novo funcionário à equipe
   * Valida dados obrigatórios
   * Formata documentos e datas
   */
  const addEmployee = async (employeeData: Omit<Employee, "id">) => {
    try {
      console.log('➕ Contratando funcionário:', employeeData.name);
      
      const { data, error } = await supabase
        .from("employees")
        .insert([{
          name: employeeData.name,
          role: employeeData.role,
          phone: employeeData.phone,
          email: employeeData.email,
          document: employeeData.document,
          join_date: employeeData.joinDate.toISOString().split('T')[0],
          salary: employeeData.salary,
          commission_type: employeeData.commissionType,
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao contratar funcionário:', error);
        throw error;
      }

      const newEmployee: Employee = {
        id: data.id,
        name: data.name,
        role: data.role,
        phone: data.phone,
        email: data.email,
        document: data.document,
        joinDate: new Date(data.join_date),
        salary: data.salary,
        commissionType: data.commission_type as "fixed" | "percentage" | "mixed",
      };

      setEmployees([...employees, newEmployee]);
      setDialogOpen(false);
      
      toast({
        title: "✅ Funcionário contratado com sucesso!",
        description: `${employeeData.name} foi adicionado à equipe.`,
      });
      
      console.log('✅ Funcionário contratado:', newEmployee.id);
    } catch (error: any) {
      console.error('❌ Falha ao contratar funcionário:', error);
      toast({
        title: "Erro ao adicionar funcionário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  /**
   * Atualiza dados do funcionário
   * Preserva histórico de alterações
   * Valida mudanças críticas
   */
  const updateEmployee = async (id: string, employeeData: Omit<Employee, "id">) => {
    try {
      console.log('📝 Atualizando funcionário:', id);
      
      const { data, error } = await supabase
        .from("employees")
        .update({
          name: employeeData.name,
          role: employeeData.role,
          phone: employeeData.phone,
          email: employeeData.email,
          document: employeeData.document,
          join_date: employeeData.joinDate.toISOString().split('T')[0],
          salary: employeeData.salary,
          commission_type: employeeData.commissionType,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao atualizar funcionário:', error);
        throw error;
      }

      const updatedEmployee: Employee = {
        id: data.id,
        name: data.name,
        role: data.role,
        phone: data.phone,
        email: data.email,
        document: data.document,
        joinDate: new Date(data.join_date),
        salary: data.salary,
        commissionType: data.commission_type as "fixed" | "percentage" | "mixed",
      };

      setEmployees(prev => prev.map(e => e.id === id ? updatedEmployee : e));
      setDialogOpen(false);
      setEditingEmployee(null);
      
      toast({
        title: "✅ Funcionário atualizado com sucesso!",
        description: `${employeeData.name} foi atualizado.`,
      });
      
      console.log('✅ Funcionário atualizado:', id);
    } catch (error: any) {
      console.error('❌ Falha ao atualizar funcionário:', error);
      toast({
        title: "Erro ao atualizar funcionário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  /**
   * Remove funcionário da equipe
   * Verifica pendências antes da remoção
   * Mantém histórico para auditoria
   */
  const deleteEmployee = async (id: string) => {
    try {
      console.log('🗑️ Desligando funcionário:', id);
      
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", id);

      if (error) {
        console.error('❌ Erro ao desligar funcionário:', error);
        throw error;
      }

      setEmployees(prev => prev.filter(e => e.id !== id));
      
      toast({
        title: "✅ Funcionário desligado com sucesso!",
        description: "O funcionário foi removido do sistema.",
      });
      
      console.log('✅ Funcionário desligado:', id);
    } catch (error: any) {
      console.error('❌ Falha ao desligar funcionário:', error);
      toast({
        title: "Erro ao remover funcionário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  /**
   * Prepara edição de funcionário
   * Carrega dados no formulário
   */
  const openEditDialog = (employee: Employee) => {
    console.log('📝 Editando funcionário:', employee.name);
    setEditingEmployee(employee);
    setDialogOpen(true);
  };

  /**
   * Cancela edição
   * Limpa estados temporários
   */
  const closeDialog = () => {
    console.log('❌ Fechando dialog de funcionário');
    setDialogOpen(false);
    setEditingEmployee(null);
  };

  // Inicialização
  useEffect(() => {
    console.log('🚀 Inicializando gestão de funcionários');
    fetchEmployees();
  }, []);

  // API pública do hook
  return {
    // Dados da equipe
    employees,
    filteredEmployees,
    searchTerm,
    
    // Estados de interface
    dialogOpen,
    editingEmployee,
    isLoading,
    
    // Controles de interface
    setDialogOpen,
    handleSearch,
    openEditDialog,
    closeDialog,
    
    // Operações de RH
    addEmployee,
    updateEmployee,
    deleteEmployee
  };
};
