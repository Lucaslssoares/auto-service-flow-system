
import React from "react";
import { CommissionsTable } from "./CommissionsTable";

interface CommissionsTabContentProps {
  employeeCommissions: Record<string, number>;
  completedAppointments: any[];
}

export const CommissionsTabContent = ({
  employeeCommissions,
  completedAppointments,
}: CommissionsTabContentProps) => {
  return (
    <div className="space-y-4">
      <CommissionsTable 
        employeeCommissions={employeeCommissions} 
        completedAppointments={completedAppointments} 
      />
    </div>
  );
};
