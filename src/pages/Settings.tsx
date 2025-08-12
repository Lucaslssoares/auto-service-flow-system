
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { GeneralSettingsTab } from "@/components/settings/GeneralSettingsTab";
import { NotificationsSettingsTab } from "@/components/settings/NotificationsSettingsTab";
import { SchedulingSettingsTab } from "@/components/settings/SchedulingSettingsTab";
import { ExecutionSettingsTab } from "@/components/settings/ExecutionSettingsTab";
import { FinancialSettingsTab } from "@/components/settings/FinancialSettingsTab";
import { AdvancedSettingsTab } from "@/components/settings/AdvancedSettingsTab";
import UserPermissionsDiagnostic from "@/components/permissions/UserPermissionsDiagnostic";
import { useSettingsOptimized } from "@/hooks/useSettingsOptimized";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const { settings, loading, updateSetting, handleSave } = useSettingsOptimized();

  return (
    <div className="space-y-6">
      <SettingsHeader onSave={handleSave} loading={loading} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="scheduling">Agendamento</TabsTrigger>
          <TabsTrigger value="execution">Execução</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <GeneralSettingsTab settings={settings} updateSetting={updateSetting} />
          <UserPermissionsDiagnostic />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationsSettingsTab settings={settings} updateSetting={updateSetting} />
        </TabsContent>
        
        <TabsContent value="scheduling">
          <SchedulingSettingsTab settings={settings} updateSetting={updateSetting} />
        </TabsContent>
        
        <TabsContent value="execution">
          <ExecutionSettingsTab settings={settings} updateSetting={updateSetting} />
        </TabsContent>
        
        <TabsContent value="financial">
          <FinancialSettingsTab settings={settings} updateSetting={updateSetting} />
        </TabsContent>
        
        <TabsContent value="advanced">
          <AdvancedSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
