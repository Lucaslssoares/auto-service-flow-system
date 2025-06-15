
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { SettingsData } from "@/types/settings";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook para Configurações do Sistema
 * Seguro para ambientes multi-tenant.
 */
export const useSettings = () => {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [missingUserSettings, setMissingUserSettings] = useState(false);
  const { user } = useSecureAuth();

  // Carregar configurações do usuário autenticado ao montar
  useEffect(() => {
    const fetchSettings = async () => {
      if (!user?.id) return;
      setLoading(true);

      // Exemplo: tente buscar as configurações do supabase para o usuário atual
      // NOTA: Troque este código assim que houver uma tabela 'user_settings' no banco
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        // Fallback para "default" apenas na primeira vez ou enquanto não há user_settings
        setMissingUserSettings(true);
        setSettings({
          businessName: "Lava Car Premium",
          businessPhone: "(11) 99999-9999",
          businessEmail: "contato@lavacar.com.br",
          businessAddress: "Rua das Flores, 123 - São Paulo/SP",
          workingHours: {
            start: "07:00",
            end: "18:00",
            daysOfWeek: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
          },
          appointmentSettings: {
            allowSameDayBooking: true,
            maxAdvanceDays: 30,
            slotDuration: 30,
            bufferTime: 15,
            autoConfirm: false
          },
          financialSettings: {
            currency: "BRL",
            taxRate: 0,
            defaultCommissionRate: 10,
            allowDiscounts: true,
            requirePaymentConfirmation: true
          },
          notifications: {
            emailNotifications: true,
            smsNotifications: false,
            appointmentReminders: true,
            paymentReminders: true
          },
          executionSettings: {
            allowMultipleEmployees: true,
            requireProfitDistribution: true,
            autoCalculateCommissions: false,
            minProfitPercentage: 5,
            maxEmployeesPerService: 5
          }
        });
      } else {
        setSettings(data.settings as SettingsData);
        setMissingUserSettings(false);
      }

      setLoading(false);
    };

    if (user?.id) {
      fetchSettings();
    }
  }, [user?.id]);

  const updateSetting = (path: string, value: any) => {
    if (!settings) return;
    const keys = path.split('.');
    setSettings(prev => {
      if (!prev) return prev;
      const newSettings = { ...prev };
      let current: any = newSettings;
      for (let i = 0; i < keys.length - 1; i++) {
        if (current[keys[i]] === undefined) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const handleSave = async () => {
    if (!user?.id || !settings) return;
    setLoading(true);

    try {
      // Adapte assim que houver tabela user_settings no banco para salvar as settings com user_id
      // Exemplo:
      // await supabase.from("user_settings").upsert({ user_id: user.id, settings });

      toast.success("✅ Configurações salvas! (modo demo)");
    } catch (error: any) {
      toast.error(`❌ Erro: ${error.message || "Erro ao salvar"}`);
    } finally {
      setLoading(false);
    }
  };

  // Validação  
  const isValid =
    !!settings?.businessName?.trim() &&
    !!settings?.businessEmail?.includes('@') &&
    !!settings?.workingHours.start &&
    !!settings?.workingHours.end &&
    settings.workingHours.start < settings.workingHours.end;

  return {
    settings,
    loading,
    updateSetting,
    handleSave,
    isValid,
    missingUserSettings // avisa se está exibindo um fallback global e não settings por usuário
  };
};
