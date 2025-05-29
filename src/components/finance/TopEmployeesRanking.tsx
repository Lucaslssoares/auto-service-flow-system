
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award } from "lucide-react";

interface EmployeeCommission {
  employeeId: string;
  employeeName: string;
  totalCommission: number;
  serviceCount: number;
}

interface TopEmployeesRankingProps {
  employeeCommissions: EmployeeCommission[];
  completedAppointments: any[];
}

export const TopEmployeesRanking = ({ 
  employeeCommissions, 
  completedAppointments 
}: TopEmployeesRankingProps) => {
  // Sort employees by total commission (descending)
  const sortedEmployees = [...employeeCommissions].sort((a, b) => b.totalCommission - a.totalCommission);
  
  // Take top 3 employees
  const topEmployees = sortedEmployees.slice(0, 3);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Funcionários por Produtividade</CardTitle>
        <CardDescription>
          Ranking baseado no total de comissões geradas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {topEmployees.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Nenhum dado de produtividade disponível no período selecionado
          </div>
        ) : (
          <div className="space-y-4">
            {topEmployees.map((employee, index) => (
              <div key={employee.employeeId} className="flex items-center gap-4 p-4 rounded-lg border">
                <div className="flex items-center gap-2">
                  {getRankIcon(index)}
                  <span className="font-semibold text-lg">#{index + 1}</span>
                </div>
                
                <Avatar>
                  <AvatarFallback>{getInitials(employee.employeeName)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="font-semibold">{employee.employeeName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {employee.serviceCount} serviços realizados
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-lg">
                    R$ {employee.totalCommission.toFixed(2).replace(".", ",")}
                  </p>
                  <p className="text-sm text-muted-foreground">em comissões</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
