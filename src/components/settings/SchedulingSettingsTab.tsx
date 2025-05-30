
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SettingsData } from "@/types/settings";

interface SchedulingSettingsTabProps {
  settings: SettingsData;
  updateSetting: (path: string, value: any) => void;
}

export const SchedulingSettingsTab = ({ settings, updateSetting }: SchedulingSettingsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Agendamento</CardTitle>
        <CardDescription>
          Configure como os agendamentos funcionam no sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Permitir agendamentos no mesmo dia</Label>
            <p className="text-sm text-muted-foreground">
              Permite que clientes agendem serviços para o mesmo dia
            </p>
          </div>
          <Switch
            checked={settings.appointmentSettings.allowSameDayBooking}
            onCheckedChange={(checked) => updateSetting('appointmentSettings.allowSameDayBooking', checked)}
          />
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="maxAdvanceDays">Máximo de dias para agendamento</Label>
            <Input
              id="maxAdvanceDays"
              type="number"
              value={settings.appointmentSettings.maxAdvanceDays}
              onChange={(e) => updateSetting('appointmentSettings.maxAdvanceDays', parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slotDuration">Duração do slot (minutos)</Label>
            <Select
              value={settings.appointmentSettings.slotDuration.toString()}
              onValueChange={(value) => updateSetting('appointmentSettings.slotDuration', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutos</SelectItem>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="60">60 minutos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Confirmar agendamentos automaticamente</Label>
            <p className="text-sm text-muted-foreground">
              Agendamentos são confirmados automaticamente sem revisão manual
            </p>
          </div>
          <Switch
            checked={settings.appointmentSettings.autoConfirm}
            onCheckedChange={(checked) => updateSetting('appointmentSettings.autoConfirm', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
