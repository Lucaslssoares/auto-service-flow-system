
import React from "react";
import { CommissionsTable } from "./CommissionsTable";
import { TopEmployeesRanking } from "./TopEmployeesRanking";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmployeeCommission {
  employeeId: string;
  employeeName: string;
  totalCommission: number;
  serviceCount: number;
}

interface CommissionsTabContentProps {
  employeeCommissions: EmployeeCommission[];
  completedAppointments: any[];
}

export const CommissionsTabContent = ({
  employeeCommissions,
  completedAppointments,
}: CommissionsTabContentProps) => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="commissions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="commissions">Comissões</TabsTrigger>
          <TabsTrigger value="productivity">Produtividade</TabsTrigger>
        </TabsList>
        
        <TabsContent value="commissions">
          <CommissionsTable 
            employeeCommissions={employeeCommissions} 
            completedAppointments={completedAppointments} 
          />
        </TabsContent>
        
        <TabsContent value="productivity">
          <TopEmployeesRanking 
            employeeCommissions={employeeCommissions}
            completedAppointments={completedAppointments} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
