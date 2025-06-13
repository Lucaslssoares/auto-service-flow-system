
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface RevenueByServiceChartProps {
  chartData: Array<{ name: string; valor: number }>;
}

export const RevenueByServiceChart = ({ chartData }: RevenueByServiceChartProps) => {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Nenhum dado disponível para exibir o gráfico
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, "Receita"]}
          />
          <Bar dataKey="valor" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
