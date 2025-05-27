import React, { useState } from "react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Employee } from "@/types";

interface EmployeeFormProps {
  onSubmit: (employee: Omit<Employee, "id">) => void;
  onCancel: () => void;
  initialData?: Employee | null; // Add support for initial data
}

/**
 * Formulário para cadastro e edição de funcionários
 * Permite inserir dados pessoais, profissionais e configurações de comissão
 */
export const EmployeeForm = ({ onSubmit, onCancel, initialData }: EmployeeFormProps) => {
  const [newEmployee, setNewEmployee] = useState<{
    name: string;
    role: string;
    phone: string;
    email: string;
    document: string;
    joinDate: string;
    salary: number;
    commissionType: "fixed" | "percentage" | "mixed";
  }>({
    name: initialData?.name || "",
    role: initialData?.role || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    document: initialData?.document || "",
    joinDate: initialData ? format(initialData.joinDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    salary: initialData?.salary || 0,
    commissionType: initialData?.commissionType || "percentage",
  });

  /**
   * Manipula mudanças nos campos de input do formulário
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee({
      ...newEmployee,
      [name]: name === "salary" ? Number(value) : value,
    });
  };

  /**
   * Manipula mudanças nos campos de seleção (select) do formulário
   */
  const handleSelectChange = (name: string, value: string) => {
    setNewEmployee({
      ...newEmployee,
      [name]: name === "commissionType" ? value as "fixed" | "percentage" | "mixed" : value,
    });
  };

  /**
   * Processa o envio do formulário, convertendo os dados para o formato correto
   */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Converte a data de string para objeto Date antes de enviar
    const employeeData = {
      ...newEmployee,
      joinDate: new Date(newEmployee.joinDate),
    };
    onSubmit(employeeData);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Nome
          </Label>
          <Input
            id="name"
            name="name"
            value={newEmployee.name}
            onChange={handleInputChange}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="role" className="text-right">
            Cargo
          </Label>
          <Input
            id="role"
            name="role"
            value={newEmployee.role}
            onChange={handleInputChange}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="phone" className="text-right">
            Telefone
          </Label>
          <Input
            id="phone"
            name="phone"
            value={newEmployee.phone}
            onChange={handleInputChange}
            className="col-span-3"
            placeholder="(00) 00000-0000"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            E-mail
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={newEmployee.email}
            onChange={handleInputChange}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="document" className="text-right">
            Documento
          </Label>
          <Input
            id="document"
            name="document"
            value={newEmployee.document}
            onChange={handleInputChange}
            className="col-span-3"
            placeholder="000.000.000-00"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="joinDate" className="text-right">
            Data de Entrada
          </Label>
          <Input
            id="joinDate"
            name="joinDate"
            type="date"
            value={newEmployee.joinDate}
            onChange={handleInputChange}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="salary" className="text-right">
            Salário Base
          </Label>
          <Input
            id="salary"
            name="salary"
            type="number"
            value={newEmployee.salary}
            onChange={handleInputChange}
            className="col-span-3"
            min="0"
            step="0.01"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="commissionType" className="text-right">
            Tipo de Comissão
          </Label>
          <div className="col-span-3">
            <Select 
              name="commissionType"
              value={newEmployee.commissionType} 
              onValueChange={(value) => handleSelectChange("commissionType", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tipo de Comissão</SelectLabel>
                  <SelectItem value="fixed">Fixo</SelectItem>
                  <SelectItem value="percentage">Porcentagem</SelectItem>
                  <SelectItem value="mixed">Misto</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
};
