
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useEmployeeManagement } from "@/hooks/useEmployeeManagement";
import { EmployeeList } from "@/components/employees/EmployeeList";
import { EmployeeSearch } from "@/components/employees/EmployeeSearch";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { ExportButton } from "@/components/common/ExportButton";
import { formatDateForExport, formatCurrencyForExport } from "@/utils/exportUtils";

/**
 * Página principal de gerenciamento de funcionários
 * Permite visualizar, buscar, adicionar, editar e excluir funcionários
 */
const Employees = () => {
  const {
    filteredEmployees,
    searchTerm,
    dialogOpen,
    editingEmployee,
    setDialogOpen,
    handleSearch,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    openEditDialog,
    closeDialog
  } = useEmployeeManagement();

  const handleSubmit = async (employeeData: any) => {
    if (editingEmployee) {
      await updateEmployee(editingEmployee.id, employeeData);
    } else {
      await addEmployee(employeeData);
    }
  };

  // Preparar dados para exportação
  const exportData = filteredEmployees.map(emp => ({
    Nome: emp.name,
    Cargo: emp.role,
    Telefone: emp.phone,
    Email: emp.email,
    Documento: emp.document,
    'Data de Admissão': formatDateForExport(emp.joinDate),
    Salário: formatCurrencyForExport(emp.salary),
    'Tipo de Comissão': emp.commissionType === 'fixed' ? 'Fixo' : 
                       emp.commissionType === 'percentage' ? 'Porcentagem' : 'Misto'
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Funcionários</h2>
        
        <div className="flex gap-2">
          <ExportButton 
            data={exportData} 
            filename="funcionarios" 
          />
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Novo Funcionário
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingEmployee ? "Editar Funcionário" : "Adicionar Novo Funcionário"}
                </DialogTitle>
                <DialogDescription>
                  {editingEmployee 
                    ? "Atualize os dados do funcionário abaixo." 
                    : "Preencha os dados do funcionário abaixo."
                  }
                </DialogDescription>
              </DialogHeader>
              <EmployeeForm 
                onSubmit={handleSubmit}
                onCancel={closeDialog}
                initialData={editingEmployee}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <EmployeeSearch searchTerm={searchTerm} onSearch={handleSearch} />
      <EmployeeList 
        employees={filteredEmployees} 
        onEdit={openEditDialog}
        onDelete={deleteEmployee}
      />
    </div>
  );
};

export default Employees;
