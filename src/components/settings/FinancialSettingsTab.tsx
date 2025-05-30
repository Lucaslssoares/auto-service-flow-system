
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign } from "lucide-react";
import { SettingsData } from "@/types/settings";

interface FinancialSettingsTabProps {
  settings: SettingsData;
  updateSetting: (path: string, value: any) => void;
}

export const FinancialSettingsTab = ({ settings, updateSetting }: FinancialSettingsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Configurações Financeiras
        </CardTitle>
        <CardDescription>
          Configure as opções financeiras e de comissão
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currency">Moeda</Label>
            <Select
              value={settings.financialSettings.currency}
              onValueChange={(value) => updateSetting('financialSettings.currency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRL">Real (R$)</SelectItem>
                <SelectItem value="USD">Dólar ($)</SelectItem>
                <SelectItem value="EUR">Euro (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="defaultCommission">Comissão padrão (%)</Label>
            <Input
              id="defaultCommission"
              type="number"
              min="0"
              max="100"
              value={settings.financialSettings.defaultCommissionRate}
              onChange={(e) => updateSetting('financialSettings.defaultCommissionRate', parseFloat(e.target.value))}
            />
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Permitir descontos</Label>
            <p className="text-sm text-muted-foreground">
              Permite aplicar descontos nos serviços
            </p>
          </div>
          <Switch
            checked={settings.financialSettings.allowDiscounts}
            onCheckedChange={(checked) => updateSetting('financialSettings.allowDiscounts', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Requer confirmação de pagamento</Label>
            <p className="text-sm text-muted-foreground">
              Exige confirmação manual dos pagamentos
            </p>
          </div>
          <Switch
            checked={settings.financialSettings.requirePaymentConfirmation}
            onCheckedChange={(checked) => updateSetting('financialSettings.requirePaymentConfirmation', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
