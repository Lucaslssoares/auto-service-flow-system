
import { useState, useEffect } from "react";
import { Employee } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useEmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("name");

      if (error) throw error;

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
    } catch (error: any) {
      toast({
        title: "Erro ao carregar funcionários",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addEmployee = async (employeeData: Omit<Employee, "id">) => {
    try {
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

      if (error) throw error;

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
        title: "Funcionário adicionado com sucesso!",
        description: `${employeeData.name} foi cadastrado no sistema.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar funcionário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateEmployee = async (id: string, employeeData: Omit<Employee, "id">) => {
    try {
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

      if (error) throw error;

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
        title: "Funcionário atualizado com sucesso!",
        description: `${employeeData.name} foi atualizado.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar funcionário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setEmployees(prev => prev.filter(e => e.id !== id));
      
      toast({
        title: "Funcionário removido com sucesso!",
        description: "O funcionário foi removido do sistema.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao remover funcionário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (employee: Employee) => {
    setEditingEmployee(employee);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingEmployee(null);
  };

  return {
    employees,
    filteredEmployees,
    searchTerm,
    dialogOpen,
    editingEmployee,
    isLoading,
    setDialogOpen,
    handleSearch,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    openEditDialog,
    closeDialog
  };
};
