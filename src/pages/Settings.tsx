
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, Save, RefreshCw, Database, Users, DollarSign, Clock } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const [settings, setSettings] = useState({
    // Configurações gerais
    businessName: "Lava Car Premium",
    businessPhone: "(11) 99999-9999",
    businessEmail: "contato@lavacar.com.br",
    businessAddress: "Rua das Flores, 123 - São Paulo/SP",
    
    // Configurações de funcionamento
    workingHours: {
      start: "07:00",
      end: "18:00",
      daysOfWeek: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    },
    
    // Configurações de agendamento
    appointmentSettings: {
      allowSameDayBooking: true,
      maxAdvanceDays: 30,
      slotDuration: 30,
      bufferTime: 15,
      autoConfirm: false
    },
    
    // Configurações financeiras
    financialSettings: {
      currency: "BRL",
      taxRate: 0,
      defaultCommissionRate: 10,
      allowDiscounts: true,
      requirePaymentConfirmation: true
    },
    
    // Configurações de notificações
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      appointmentReminders: true,
      paymentReminders: true
    }
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Aqui você salvaria as configurações no banco de dados
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (path: string, value: any) => {
    const keys = path.split('.');
    setSettings(prev => {
      const newSettings = { ...prev };
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-6 w-6" />
          <h2 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h2>
        </div>
        <Button onClick={handleSave} disabled={loading} className="gap-2">
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar Alterações
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="scheduling">Agendamento</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="scheduling" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
