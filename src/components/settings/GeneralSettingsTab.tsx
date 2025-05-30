
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { SettingsData } from "@/types/settings";

interface GeneralSettingsTabProps {
  settings: SettingsData;
  updateSetting: (path: string, value: any) => void;
}

export const GeneralSettingsTab = ({ settings, updateSetting }: GeneralSettingsTabProps) => {
  const daysOfWeek = [
    { key: "monday", label: "Segunda" },
    { key: "tuesday", label: "Terça" },
    { key: "wednesday", label: "Quarta" },
    { key: "thursday", label: "Quinta" },
    { key: "friday", label: "Sexta" },
    { key: "saturday", label: "Sábado" },
    { key: "sunday", label: "Domingo" }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Informações da Empresa</CardTitle>
          <CardDescription>
            Configure as informações básicas do seu negócio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Nome da Empresa</Label>
              <Input
                id="businessName"
                value={settings.businessName}
                onChange={(e) => updateSetting('businessName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessPhone">Telefone</Label>
              <Input
                id="businessPhone"
                value={settings.businessPhone}
                onChange={(e) => updateSetting('businessPhone', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="businessEmail">Email</Label>
            <Input
              id="businessEmail"
              type="email"
              value={settings.businessEmail}
              onChange={(e) => updateSetting('businessEmail', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="businessAddress">Endereço</Label>
            <Input
              id="businessAddress"
              value={settings.businessAddress}
              onChange={(e) => updateSetting('businessAddress', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horário de Funcionamento
          </CardTitle>
          <CardDescription>
            Configure os horários de funcionamento do estabelecimento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Abertura</Label>
              <Input
                id="startTime"
                type="time"
                value={settings.workingHours.start}
                onChange={(e) => updateSetting('workingHours.start', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Fechamento</Label>
              <Input
                id="endTime"
                type="time"
                value={settings.workingHours.end}
                onChange={(e) => updateSetting('workingHours.end', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Dias de Funcionamento</Label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <Badge
                  key={day.key}
                  variant={settings.workingHours.daysOfWeek.includes(day.key) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    const currentDays = settings.workingHours.daysOfWeek;
                    const newDays = currentDays.includes(day.key)
                      ? currentDays.filter(d => d !== day.key)
                      : [...currentDays, day.key];
                    updateSetting('workingHours.daysOfWeek', newDays);
                  }}
                >
                  {day.label}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
