
import React from "react";
import { ServicesAnalysisTable } from "./ServicesAnalysisTable";
import { TopServicesRanking } from "./TopServicesRanking";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ServicesTabContentProps {
  completedAppointments: any[];
}

export const ServicesTabContent = ({
  completedAppointments,
}: ServicesTabContentProps) => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="analysis" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analysis">Análise de Serviços</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analysis">
          <ServicesAnalysisTable completedAppointments={completedAppointments} />
        </TabsContent>
        
        <TabsContent value="rankings">
          <TopServicesRanking completedAppointments={completedAppointments} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
