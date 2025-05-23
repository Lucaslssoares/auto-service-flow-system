
import { useState } from "react";
import { Employee } from "@/types";
import { employees as mockEmployees } from "@/data/mockData";

export const useEmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addEmployee = (employeeData: Omit<Employee, "id">) => {
    const newEmployeeEntry: Employee = {
      id: (employees.length + 1).toString(),
      name: employeeData.name,
      role: employeeData.role,
      phone: employeeData.phone,
      email: employeeData.email,
      document: employeeData.document,
      joinDate: new Date(employeeData.joinDate),
      salary: employeeData.salary,
      commissionType: employeeData.commissionType as "fixed" | "percentage" | "mixed",
    };
    
    setEmployees([...employees, newEmployeeEntry]);
    setDialogOpen(false);
  };

  return {
    employees,
    filteredEmployees,
    searchTerm,
    dialogOpen,
    setDialogOpen,
    handleSearch,
    addEmployee
  };
};
