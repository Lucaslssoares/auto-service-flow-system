
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Employee {
  id: string;
  name: string;
}

interface EmployeeAssignment {
  employeeId: string;
  profitPercentage: number;
}

interface MultipleEmployeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  serviceId: string;
  serviceName: string;
  onStartExecution: (data: {
    appointmentId: string;
    serviceId: string;
    employees: EmployeeAssignment[];
  }) => void;
}

export const MultipleEmployeesModal = ({
  isOpen,
  onClose,
  appointmentId,
  serviceId,
  serviceName,
  onStartExecution
}: MultipleEmployeesModalProps) => {
  const [employees, setEmployees] = useState<EmployeeAssignment[]>([
    { employeeId: "", profitPercentage: 100 }
  ]);

  // Fetch available employees
  const { data: availableEmployees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('id, name')
        .order('name');

      if (error) throw error;
      return data as Employee[];
    }
  });

  const addEmployee = () => {
    setEmployees([...employees, { employeeId: "", profitPercentage: 0 }]);
  };

  const removeEmployee = (index: number) => {
    if (employees.length > 1) {
      setEmployees(employees.filter((_, i) => i !== index));
    }
  };

  const updateEmployee = (index: number, field: keyof EmployeeAssignment, value: string | number) => {
    const updated = [...employees];
    updated[index] = { ...updated[index], [field]: value };
    setEmployees(updated);
  };

  const getTotalPercentage = () => {
    return employees.reduce((sum, emp) => sum + (emp.profitPercentage || 0), 0);
  };

  const handleSubmit = () => {
    // Validations
    const totalPercentage = getTotalPercentage();
    if (Math.abs(totalPercentage - 100) > 0.01) {
      toast.error("A soma das porcentagens deve ser exatamente 100%");
      return;
    }

    const hasEmptyEmployees = employees.some(emp => !emp.employeeId);
    if (hasEmptyEmployees) {
      toast.error("Todos os funcionários devem ser selecionados");
      return;
    }

    const duplicateEmployees = employees.some((emp, index) => 
      employees.findIndex(e => e.employeeId === emp.employeeId) !== index
    );
    if (duplicateEmployees) {
      toast.error("Não é possível selecionar o mesmo funcionário mais de uma vez");
      return;
    }

    onStartExecution({
      appointmentId,
      serviceId,
      employees: employees.filter(emp => emp.employeeId && emp.profitPercentage > 0)
    });
    
    onClose();
    setEmployees([{ employeeId: "", profitPercentage: 100 }]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Equipe para {serviceName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {employees.map((employee, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1">
                <Label>Funcionário</Label>
                <Select
                  value={employee.employeeId}
                  onValueChange={(value) => updateEmployee(index, 'employeeId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar funcionário" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEmployees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-24">
                <Label>Lucro (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={employee.profitPercentage}
                  onChange={(e) => updateEmployee(index, 'profitPercentage', parseFloat(e.target.value) || 0)}
                />
              </div>
              
              {employees.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeEmployee(index)}
                  className="mb-1"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={addEmployee}>
              <Plus className="h-4 w-4 mr-1" />
              Adicionar funcionário
            </Button>
            
            <div className={`text-sm font-medium ${getTotalPercentage() === 100 ? 'text-green-600' : 'text-red-600'}`}>
              Total: {getTotalPercentage().toFixed(1)}%
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1"
              disabled={getTotalPercentage() !== 100}
            >
              Iniciar Serviço
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
