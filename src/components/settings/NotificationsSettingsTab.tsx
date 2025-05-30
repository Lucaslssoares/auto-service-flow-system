
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { SettingsData } from "@/types/settings";

interface NotificationsSettingsTabProps {
  settings: SettingsData;
  updateSetting: (path: string, value: any) => void;
}

export const NotificationsSettingsTab = ({ settings, updateSetting }: NotificationsSettingsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Notificações</CardTitle>
        <CardDescription>
          Configure como e quando enviar notificações
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Notificações por email</Label>
            <p className="text-sm text-muted-foreground">
              Enviar notificações importantes por email
            </p>
          </div>
          <Switch
            checked={settings.notifications.emailNotifications}
            onCheckedChange={(checked) => updateSetting('notifications.emailNotifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Notificações por SMS</Label>
            <p className="text-sm text-muted-foreground">
              Enviar notificações importantes por SMS
            </p>
          </div>
          <Switch
            checked={settings.notifications.smsNotifications}
            onCheckedChange={(checked) => updateSetting('notifications.smsNotifications', checked)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Lembretes de agendamento</Label>
            <p className="text-sm text-muted-foreground">
              Enviar lembretes antes dos agendamentos
            </p>
          </div>
          <Switch
            checked={settings.notifications.appointmentReminders}
            onCheckedChange={(checked) => updateSetting('notifications.appointmentReminders', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Lembretes de pagamento</Label>
            <p className="text-sm text-muted-foreground">
              Enviar lembretes de pagamentos pendentes
            </p>
          </div>
          <Switch
            checked={settings.notifications.paymentReminders}
            onCheckedChange={(checked) => updateSetting('notifications.paymentReminders', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
