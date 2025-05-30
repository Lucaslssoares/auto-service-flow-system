
import { useState } from "react";
import { toast } from "sonner";
import { SettingsData } from "@/types/settings";

export const useSettings = () => {
  const [settings, setSettings] = useState<SettingsData>({
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
    }
  });

  const [loading, setLoading] = useState(false);

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

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    updateSetting,
    handleSave
  };
};
