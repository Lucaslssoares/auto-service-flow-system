
import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Employee } from "@/types";

interface EmployeeListProps {
  employees: Employee[];
}

// Map to translate commission types to Portuguese
const commissionTypeNames: Record<string, string> = {
  fixed: "Fixo",
  percentage: "Porcentagem",
  mixed: "Misto",
};

export const EmployeeList = ({ employees }: EmployeeListProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Data de Entrada</TableHead>
            <TableHead className="text-right">Salário Base</TableHead>
            <TableHead>Tipo de Comissão</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                Nenhum funcionário encontrado.
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <TableRow key={employee.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">{employee.phone}</span>
                    <span className="text-xs text-muted-foreground">{employee.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {format(employee.joinDate, "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  R$ {employee.salary.toFixed(2).replace('.', ',')}
                </TableCell>
                <TableCell>
                  {commissionTypeNames[employee.commissionType]}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
