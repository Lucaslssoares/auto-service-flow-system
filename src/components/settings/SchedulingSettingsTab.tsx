import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SettingsData } from "@/types/settings";
import { useBusinessConfig, useUpdateBusinessConfig } from "@/hooks/useCapacityConfig";

interface SchedulingSettingsTabProps {
  settings: SettingsData;
  updateSetting: (path: string, value: any) => void;
}

export const SchedulingSettingsTab = ({ settings, updateSetting }: SchedulingSettingsTabProps) => {
  const { data: config, isLoading } = useBusinessConfig();
  const updateConfig = useUpdateBusinessConfig();

  const [maxPerSlot, setMaxPerSlot] = useState(3);
  const [slotDuration, setSlotDuration] = useState(60);
  const [workingStart, setWorkingStart] = useState("08:00");
  const [workingEnd, setWorkingEnd] = useState("18:00");

  useEffect(() => {
    if (config) {
      setMaxPerSlot(config.max_per_slot);
      setSlotDuration(config.slot_duration_minutes);
      setWorkingStart(config.working_start);
      setWorkingEnd(config.working_end);
    }
  }, [config]);

  const handleSaveCapacity = () => {
    updateConfig.mutate({
      max_per_slot: maxPerSlot,
      slot_duration_minutes: slotDuration,
      working_start: workingStart,
      working_end: workingEnd,
    });
  };

  return (
    <div className="space-y-4">
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

      {/* Capacidade — persiste no Supabase */}
      <Card>
        <CardHeader>
          <CardTitle>Capacidade e Horários</CardTitle>
          <CardDescription>
            Define quantos atendimentos cabem por slot e o horário de funcionamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Horário de abertura</Label>
              <Input
                type="time"
                value={workingStart}
                onChange={(e) => setWorkingStart(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label>Horário de fechamento</Label>
              <Input
                type="time"
                value={workingEnd}
                onChange={(e) => setWorkingEnd(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duração do slot (minutos)</Label>
              <Select
                value={slotDuration.toString()}
                onValueChange={(v) => setSlotDuration(parseInt(v))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">60 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Vagas por slot</Label>
              <Input
                type="number"
                min={1}
                max={20}
                value={maxPerSlot}
                onChange={(e) => setMaxPerSlot(parseInt(e.target.value) || 1)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Máximo de agendamentos simultâneos no mesmo horário
              </p>
            </div>
          </div>

          <Button
            onClick={handleSaveCapacity}
            disabled={updateConfig.isPending || isLoading}
          >
            {updateConfig.isPending ? "Salvando..." : "Salvar configurações de capacidade"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
