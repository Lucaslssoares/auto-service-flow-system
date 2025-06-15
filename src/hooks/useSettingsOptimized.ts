
import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { SettingsData } from "@/types/settings";

export const useSettingsOptimized = () => {
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
    },

    executionSettings: {
      allowMultipleEmployees: true,
      requireProfitDistribution: true,
      autoCalculateCommissions: false,
      minProfitPercentage: 5,
      maxEmployeesPerService: 5
    }
  });

  const [loading, setLoading] = useState(false);

  // Usar useCallback para evitar re-renders desnecessários
  const updateSetting = useCallback((path: string, value: any) => {
    console.log(`⚙️ Atualizando configuração: ${path} = ${value}`);
    
    const keys = path.split('.');
    setSettings(prev => {
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
  }, []);

  const handleSave = useCallback(async () => {
    setLoading(true);
    console.log('💾 Salvando configurações...');
    
    try {
      // Validações rápidas
      if (!settings.businessName?.trim()) {
        throw new Error('Nome da empresa é obrigatório');
      }
      
      if (!settings.businessEmail?.includes('@')) {
        throw new Error('Email da empresa inválido');
      }

      // Simular salvamento mais rápido
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('✅ Configurações salvas');
      toast.success("✅ Configurações salvas com sucesso!");
      
    } catch (error: any) {
      console.error('❌ Erro ao salvar:', error);
      toast.error(`❌ Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [settings]);

  // Memoizar validação para evitar recálculos
  const isValid = useMemo(() => {
    return !!(
      settings.businessName?.trim() &&
      settings.businessEmail?.includes('@') &&
      settings.workingHours.start < settings.workingHours.end
    );
  }, [settings]);

  return {
    settings,
    loading,
    updateSetting,
    handleSave,
    isValid
  };
};
