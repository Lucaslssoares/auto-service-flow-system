
import React from "react";
import { ServicesAnalysisTable } from "./ServicesAnalysisTable";

interface ServicesTabContentProps {
  completedAppointments: any[];
}

export const ServicesTabContent = ({
  completedAppointments,
}: ServicesTabContentProps) => {
  return (
    <div className="space-y-4">
      <ServicesAnalysisTable completedAppointments={completedAppointments} />
    </div>
  );
};
