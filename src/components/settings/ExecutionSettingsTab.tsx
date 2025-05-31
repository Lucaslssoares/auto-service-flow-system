
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Users } from "lucide-react";
import { SettingsData } from "@/types/settings";

interface ExecutionSettingsTabProps {
  settings: SettingsData;
  updateSetting: (path: string, value: any) => void;
}

export const ExecutionSettingsTab = ({ settings, updateSetting }: ExecutionSettingsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Configurações de Execução
        </CardTitle>
        <CardDescription>
          Configure como os serviços são executados e a divisão de lucros
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Permitir múltiplos funcionários</Label>
            <p className="text-sm text-muted-foreground">
              Permite que mais de um funcionário trabalhe no mesmo serviço
            </p>
          </div>
          <Switch
            checked={settings.executionSettings.allowMultipleEmployees}
            onCheckedChange={(checked) => updateSetting('executionSettings.allowMultipleEmployees', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Exigir distribuição de lucro</Label>
            <p className="text-sm text-muted-foreground">
              Exige que a soma das porcentagens seja sempre 100%
            </p>
          </div>
          <Switch
            checked={settings.executionSettings.requireProfitDistribution}
            onCheckedChange={(checked) => updateSetting('executionSettings.requireProfitDistribution', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Calcular comissões automaticamente</Label>
            <p className="text-sm text-muted-foreground">
              Calcula as comissões automaticamente ao finalizar o serviço
            </p>
          </div>
          <Switch
            checked={settings.executionSettings.autoCalculateCommissions}
            onCheckedChange={(checked) => updateSetting('executionSettings.autoCalculateCommissions', checked)}
          />
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minProfitPercentage">Porcentagem mínima de lucro (%)</Label>
            <Input
              id="minProfitPercentage"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={settings.executionSettings.minProfitPercentage}
              onChange={(e) => updateSetting('executionSettings.minProfitPercentage', parseFloat(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxEmployeesPerService">Máximo de funcionários por serviço</Label>
            <Input
              id="maxEmployeesPerService"
              type="number"
              min="1"
              max="10"
              value={settings.executionSettings.maxEmployeesPerService}
              onChange={(e) => updateSetting('executionSettings.maxEmployeesPerService', parseInt(e.target.value))}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
