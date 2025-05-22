
import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface DateRangeSelectorProps {
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
}

export const DateRangeSelector = ({ 
  selectedPeriod, 
  setSelectedPeriod 
}: DateRangeSelectorProps) => {
  return (
    <div className="flex items-center justify-end mb-4">
      <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
        <TabsList>
          <TabsTrigger value="today">Hoje</TabsTrigger>
          <TabsTrigger value="yesterday">Ontem</TabsTrigger>
          <TabsTrigger value="week">Últimos 7 dias</TabsTrigger>
          <TabsTrigger value="month">Últimos 30 dias</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
