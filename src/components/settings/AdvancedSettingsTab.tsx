
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Database, RefreshCw } from "lucide-react";

export const AdvancedSettingsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Configurações Avançadas
        </CardTitle>
        <CardDescription>
          Configurações técnicas e de sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border p-4">
          <h4 className="font-medium mb-2">Status do Sistema</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Versão do sistema:</span>
              <Badge variant="outline">v1.0.0</Badge>
            </div>
            <div className="flex justify-between">
              <span>Banco de dados:</span>
              <Badge variant="outline">Conectado</Badge>
            </div>
            <div className="flex justify-between">
              <span>Último backup:</span>
              <span className="text-muted-foreground">Hoje às 03:00</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium">Ações do Sistema</h4>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start">
              <RefreshCw className="h-4 w-4 mr-2" />
              Limpar Cache
            </Button>
            <Button variant="outline" className="justify-start">
              <Database className="h-4 w-4 mr-2" />
              Backup Manual
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
