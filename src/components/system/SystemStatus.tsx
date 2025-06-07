
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { useSystemHealth } from "@/hooks/useSystemHealth";

export const SystemStatus = () => {
  const { moduleStatus, isChecking, checkModuleHealth } = useSystemHealth();

  const modules = [
    { key: 'customers', name: 'Clientes' },
    { key: 'vehicles', name: 'Veículos' },
    { key: 'services', name: 'Serviços' },
    { key: 'employees', name: 'Funcionários' },
    { key: 'appointments', name: 'Agendamentos' },
  ];

  const allModulesWorking = Object.values(moduleStatus).every(status => status);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {allModulesWorking ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
          Status do Sistema
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {modules.map(module => (
            <div key={module.key} className="flex items-center justify-between">
              <span className="text-sm">{module.name}</span>
              <Badge 
                variant={moduleStatus[module.key as keyof typeof moduleStatus] ? "default" : "destructive"}
                className="text-xs"
              >
                {moduleStatus[module.key as keyof typeof moduleStatus] ? "OK" : "Erro"}
              </Badge>
            </div>
          ))}
        </div>
        <Button
          onClick={checkModuleHealth}
          disabled={isChecking}
          className="w-full mt-4"
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
          Verificar Novamente
        </Button>
      </CardContent>
    </Card>
  );
};
