
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Employee } from "@/types";
import { ActionsDropdown } from "@/components/common/ActionsDropdown";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EmployeeListProps {
  employees: Employee[];
  onEdit?: (employee: Employee) => void;
  onDelete?: (id: string) => void;
}

export const EmployeeList = ({ employees, onEdit, onDelete }: EmployeeListProps) => {
  const getCommissionTypeLabel = (type: string) => {
    switch (type) {
      case "fixed":
        return "Fixo";
      case "percentage":
        return "Porcentagem";
      case "mixed":
        return "Misto";
      default:
        return type;
    }
  };

  const getCommissionTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "fixed":
        return "default";
      case "percentage":
        return "secondary";
      case "mixed":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Funcionários</CardTitle>
        <CardDescription>
          {employees.length} funcionário(s) encontrado(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {employees.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Nenhum funcionário encontrado
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Admissão</TableHead>
                <TableHead>Salário</TableHead>
                <TableHead>Comissão</TableHead>
                {(onEdit || onDelete) && <TableHead className="text-right">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {employee.document}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{employee.phone}</div>
                      <div className="text-muted-foreground">{employee.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(employee.joinDate, "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    R$ {employee.salary.toFixed(2).replace(".", ",")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getCommissionTypeBadgeVariant(employee.commissionType)}>
                      {getCommissionTypeLabel(employee.commissionType)}
                    </Badge>
                  </TableCell>
                  {(onEdit || onDelete) && (
                    <TableCell className="text-right">
                      <ActionsDropdown
                        onEdit={() => onEdit?.(employee)}
                        onDelete={() => onDelete?.(employee.id)}
                        itemName={employee.name}
                        deleteDescription="Esta ação removerá permanentemente o funcionário do sistema."
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
