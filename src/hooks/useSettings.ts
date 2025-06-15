
import { useEffect, useState } from "react";
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

      // Buscar as configurações específicas do usuário
      const { data, error } = await supabase
        .from("user_settings")
        .select("settings")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error || !data) {
        // Mostra fallback padrão se não houver settings salvos para o usuário
        setMissingUserSettings(true);
        setSettings({
          businessName: "Lava Car Premium",
          businessPhone: "(11) 99999-9999",
          businessEmail: "contato@lavacar.com.br",
          businessAddress: "Rua das Flores, 123 - São Paulo/SP",
          workingHours: {
            start: "07:00",
            end: "18:00",
            daysOfWeek: [
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
            ],
          },
          appointmentSettings: {
            allowSameDayBooking: true,
            maxAdvanceDays: 30,
            slotDuration: 30,
            bufferTime: 15,
            autoConfirm: false,
          },
          financialSettings: {
            currency: "BRL",
            taxRate: 0,
            defaultCommissionRate: 10,
            allowDiscounts: true,
            requirePaymentConfirmation: true,
          },
          notifications: {
            emailNotifications: true,
            smsNotifications: false,
            appointmentReminders: true,
            paymentReminders: true,
          },
          executionSettings: {
            allowMultipleEmployees: true,
            requireProfitDistribution: true,
            autoCalculateCommissions: false,
            minProfitPercentage: 5,
            maxEmployeesPerService: 5,
          },
        });
      } else {
        // Fix: Cast to unknown before SettingsData for type compatibility
        setSettings(data.settings as unknown as SettingsData);
        setMissingUserSettings(false);
      }

      setLoading(false);
    };

    if (user?.id) {
      fetchSettings();
    }
  }, [user?.id]);

  const updateSetting = (path: string, value: any) => {
    setSettings((prev) => {
      if (!prev) return prev;
      const keys = path.split(".");
      const newSettings: any = { ...prev };
      let current = newSettings;
      for (let i = 0; i < keys.length - 1; i++) {
        if (typeof current[keys[i]] !== "object" || current[keys[i]] === null) {
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
      // Verifica se já existe row para o usuário
      const { data: existing, error: fetchError } = await supabase
        .from("user_settings")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      let result;

      if (existing?.id) {
        // Atualização
        result = await supabase
          .from("user_settings")
          .update({
            settings: settings as unknown, // Fix: Cast to unknown for JSON
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (result.error) throw result.error;
        toast.success("✅ Configurações salvas!");
      } else {
        // Primeira vez: inserir novo registro
        result = await supabase.from("user_settings").insert([
          {
            user_id: user.id,
            settings: settings as unknown, // Fix: Cast to unknown for JSON
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
        if (result.error) throw result.error;
        toast.success("✅ Configurações salvas pela primeira vez!");
        setMissingUserSettings(false);
      }
    } catch (error: any) {
      toast.error(`❌ Erro: ${error.message || "Erro ao salvar"}`);
    } finally {
      setLoading(false);
    }
  };

  // Validação  
  const isValid =
    !!settings?.businessName?.trim() &&
    !!settings?.businessEmail?.includes("@") &&
    !!settings?.workingHours.start &&
    !!settings?.workingHours.end &&
    settings.workingHours.start < settings.workingHours.end;

  return {
    settings,
    loading,
    updateSetting,
    handleSave,
    isValid,
    missingUserSettings, // avisa se está exibindo um fallback global e não settings por usuário
  };
};
