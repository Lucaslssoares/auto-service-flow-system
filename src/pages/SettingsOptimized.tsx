
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { GeneralSettingsTab } from "@/components/settings/GeneralSettingsTab";
import { SchedulingSettingsTab } from "@/components/settings/SchedulingSettingsTab";
import { FinancialSettingsTab } from "@/components/settings/FinancialSettingsTab";
import { NotificationsSettingsTab } from "@/components/settings/NotificationsSettingsTab";
import { ExecutionSettingsTab } from "@/components/settings/ExecutionSettingsTab";
import { AdvancedSettingsTab } from "@/components/settings/AdvancedSettingsTab";
import { useSettingsOptimized } from "@/hooks/useSettingsOptimized";

const SettingsOptimized = () => {
  const { settings, loading, updateSetting, handleSave } = useSettingsOptimized();

  return (
    <div className="space-y-6">
      <SettingsHeader onSave={handleSave} loading={loading} />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="scheduling">Agendamento</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="execution">Execução</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <GeneralSettingsTab settings={settings} updateSetting={updateSetting} />
        </TabsContent>

        <TabsContent value="scheduling" className="space-y-4">
          <SchedulingSettingsTab settings={settings} updateSetting={updateSetting} />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <FinancialSettingsTab settings={settings} updateSetting={updateSetting} />
        </TabsContent>

        <TabsContent value="execution" className="space-y-4">
          <ExecutionSettingsTab settings={settings} updateSetting={updateSetting} />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationsSettingsTab settings={settings} updateSetting={updateSetting} />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <AdvancedSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsOptimized;
