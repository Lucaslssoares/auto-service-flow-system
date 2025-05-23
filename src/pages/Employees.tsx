
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
import { Plus, Users } from "lucide-react";
import { useEmployeeManagement } from "@/hooks/useEmployeeManagement";
import { EmployeeList } from "@/components/employees/EmployeeList";
import { EmployeeSearch } from "@/components/employees/EmployeeSearch";
import { EmployeeForm } from "@/components/employees/EmployeeForm";

const Employees = () => {
  const {
    filteredEmployees,
    searchTerm,
    dialogOpen,
    setDialogOpen,
    handleSearch,
    addEmployee
  } = useEmployeeManagement();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Funcionários</h2>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Novo Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Funcionário</DialogTitle>
              <DialogDescription>
                Preencha os dados do funcionário abaixo.
              </DialogDescription>
            </DialogHeader>
            <EmployeeForm 
              onSubmit={addEmployee}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <EmployeeSearch searchTerm={searchTerm} onSearch={handleSearch} />
      <EmployeeList employees={filteredEmployees} />
    </div>
  );
};

export default Employees;
