
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface RevenueByServiceChartProps {
  chartData: Array<{
    name: string;
    valor: number;
  }>;
}

export const RevenueByServiceChart = ({ chartData }: RevenueByServiceChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita por Serviço</CardTitle>
        <CardDescription>
          Distribuição de receita por tipo de serviço
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 30,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
              <Legend />
              <Bar dataKey="valor" name="Valor (R$)" fill="#1e40af" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Sem dados para o período selecionado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
