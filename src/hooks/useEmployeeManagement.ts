
import { useState, useEffect } from "react";
import { Employee } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useEmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
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

  return {
    employees,
    filteredEmployees,
    searchTerm,
    dialogOpen,
    isLoading,
    setDialogOpen,
    handleSearch,
    addEmployee
  };
};
