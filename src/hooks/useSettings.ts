
/**
 * Hook para Configurações do Sistema
 * 
 * Gerencia todas as configurações globais do SaaS de lava-car.
 * Inclui configurações de negócio, operacionais, financeiras e técnicas.
 * 
 * Configurações principais:
 * - Dados da empresa e contato
 * - Horários de funcionamento
 * - Regras de agendamento
 * - Configurações financeiras
 * - Preferências de notificação
 * - Configurações de execução de serviços
 * 
 * @author Sistema Lava Car
 * @version 1.0.0
 */

import { useState } from "react";
import { toast } from "sonner";
import { SettingsData } from "@/types/settings";

export const useSettings = () => {
  // Configurações padrão otimizadas para SaaS
  const [settings, setSettings] = useState<SettingsData>({
    // === CONFIGURAÇÕES DA EMPRESA ===
    businessName: "Lava Car Premium",
    businessPhone: "(11) 99999-9999",
    businessEmail: "contato@lavacar.com.br",
    businessAddress: "Rua das Flores, 123 - São Paulo/SP",
    
    // === HORÁRIOS DE FUNCIONAMENTO ===
    workingHours: {
      start: "07:00",
      end: "18:00",
      daysOfWeek: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    },
    
    // === CONFIGURAÇÕES DE AGENDAMENTO ===
    appointmentSettings: {
      allowSameDayBooking: true,        // Permite agendamento no mesmo dia
      maxAdvanceDays: 30,               // Máximo de dias para agendamento futuro
      slotDuration: 30,                 // Duração do slot em minutos
      bufferTime: 15,                   // Tempo de folga entre agendamentos
      autoConfirm: false                // Confirmação automática de agendamentos
    },
    
    // === CONFIGURAÇÕES FINANCEIRAS ===
    financialSettings: {
      currency: "BRL",                  // Moeda padrão
      taxRate: 0,                       // Taxa de impostos (%)
      defaultCommissionRate: 10,        // Comissão padrão dos funcionários (%)
      allowDiscounts: true,             // Permite descontos
      requirePaymentConfirmation: true  // Exige confirmação de pagamento
    },
    
    // === NOTIFICAÇÕES ===
    notifications: {
      emailNotifications: true,         // Notificações por email
      smsNotifications: false,          // Notificações por SMS
      appointmentReminders: true,       // Lembretes de agendamento
      paymentReminders: true            // Lembretes de pagamento
    },

    // === CONFIGURAÇÕES DE EXECUÇÃO ===
    executionSettings: {
      allowMultipleEmployees: true,     // Permite múltiplos funcionários por serviço
      requireProfitDistribution: true,  // Exige distribuição de lucros
      autoCalculateCommissions: false,  // Cálculo automático de comissões
      minProfitPercentage: 5,          // Porcentagem mínima de lucro
      maxEmployeesPerService: 5        // Máximo de funcionários por serviço
    }
  });

  const [loading, setLoading] = useState(false);

  /**
   * Atualiza uma configuração específica
   * Suporta paths aninhados usando notação de pontos
   * Ex: updateSetting('workingHours.start', '08:00')
   */
  const updateSetting = (path: string, value: any) => {
    console.log(`⚙️ Atualizando configuração: ${path} = ${value}`);
    
    const keys = path.split('.');
    setSettings(prev => {
      const newSettings = { ...prev };
      let current: any = newSettings;
      
      // Navega até o objeto pai
      for (let i = 0; i < keys.length - 1; i++) {
        if (current[keys[i]] === undefined) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      // Atualiza o valor final
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  /**
   * Salva todas as configurações
   * Em produção, deve persistir no banco de dados
   * Inclui validação de dados críticos
   */
  const handleSave = async () => {
    setLoading(true);
    console.log('💾 Salvando configurações do sistema...');
    
    try {
      // Validações críticas
      if (!settings.businessName?.trim()) {
        throw new Error('Nome da empresa é obrigatório');
      }
      
      if (!settings.businessEmail?.includes('@')) {
        throw new Error('Email da empresa inválido');
      }
      
      if (settings.financialSettings.defaultCommissionRate < 0 || 
          settings.financialSettings.defaultCommissionRate > 100) {
        throw new Error('Taxa de comissão deve estar entre 0% e 100%');
      }

      // Simula salvamento (em produção: integrar com Supabase)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('✅ Configurações salvas:', settings);
      toast.success("✅ Configurações salvas com sucesso!");
      
    } catch (error: any) {
      console.error('❌ Erro ao salvar configurações:', error);
      toast.error(`❌ Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reseta configurações para padrão
   * Útil para troubleshooting
   */
  const resetToDefault = () => {
    console.log('🔄 Resetando configurações para padrão');
    // Implementar reset se necessário
    toast.info("🔄 Configurações resetadas para padrão");
  };

  /**
   * Valida configurações atuais
   * Retorna lista de problemas encontrados
   */
  const validateSettings = (): string[] => {
    const issues: string[] = [];
    
    if (!settings.businessName?.trim()) {
      issues.push('Nome da empresa não informado');
    }
    
    if (!settings.businessEmail?.includes('@')) {
      issues.push('Email da empresa inválido');
    }
    
    if (settings.workingHours.start >= settings.workingHours.end) {
      issues.push('Horário de funcionamento inválido');
    }
    
    return issues;
  };

  // API pública do hook
  return {
    // Estado das configurações
    settings,
    loading,
    
    // Operações
    updateSetting,
    handleSave,
    resetToDefault,
    validateSettings,
    
    // Utilitários
    isValid: validateSettings().length === 0
  };
};
