
import React from "react";
import { SummaryCards } from "./SummaryCards";
import { RevenueByServiceChart } from "./RevenueByServiceChart";
import { RecentServicesTable } from "./RecentServicesTable";

interface EmployeeCommission {
  employeeId: string;
  employeeName: string;
  totalCommission: number;
  serviceCount: number;
}

interface OverviewTabContentProps {
  completedAppointments: any[];
  totalRevenue: number;
  employeeCommissions: EmployeeCommission[];
  chartData: Array<{ name: string; valor: number }>;
}

export const OverviewTabContent = ({
  completedAppointments,
  totalRevenue,
  employeeCommissions,
  chartData,
}: OverviewTabContentProps) => {
  return (
    <div className="space-y-4">
      <SummaryCards 
        totalRevenue={totalRevenue}
        completedAppointments={completedAppointments}
        employeeCommissions={employeeCommissions}
      />
      <RevenueByServiceChart chartData={chartData} />
      <RecentServicesTable completedAppointments={completedAppointments} />
    </div>
  );
};
