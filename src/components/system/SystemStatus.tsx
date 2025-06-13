
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Activity } from "lucide-react";

export const SystemStatus = () => {
  const systemMetrics = [
    {
      name: "Banco de Dados",
      status: "online",
      description: "Conectado e funcionando",
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      name: "Sistema de Agendamentos",
      status: "online",
      description: "Funcionando normalmente",
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      name: "Processamento de Pagamentos",
      status: "online",
      description: "Ativo e processando",
      icon: Activity,
      color: "text-blue-500"
    },
    {
      name: "Backup Automático",
      status: "warning",
      description: "Último backup: há 2 horas",
      icon: AlertCircle,
      color: "text-yellow-500"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Online</Badge>;
      case "warning":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Atenção</Badge>;
      case "offline":
        return <Badge variant="destructive">Offline</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status do Sistema</CardTitle>
        <CardDescription>
          Monitoramento em tempo real dos componentes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {systemMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                  <div>
                    <p className="font-medium text-sm">{metric.name}</p>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </div>
                </div>
                {getStatusBadge(metric.status)}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4" />
            <span className="font-medium text-sm">Estatísticas do Sistema</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Uptime</p>
              <p className="font-medium">99.9%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Usuários Ativos</p>
              <p className="font-medium">5</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
