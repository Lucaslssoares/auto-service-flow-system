
export interface WorkingHours {
  start: string;
  end: string;
  daysOfWeek: string[];
}

export interface AppointmentSettings {
  allowSameDayBooking: boolean;
  maxAdvanceDays: number;
  slotDuration: number;
  bufferTime: number;
  autoConfirm: boolean;
}

export interface FinancialSettings {
  currency: string;
  taxRate: number;
  defaultCommissionRate: number;
  allowDiscounts: boolean;
  requirePaymentConfirmation: boolean;
}

export interface Notifications {
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  paymentReminders: boolean;
}

export interface SettingsData {
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  businessAddress: string;
  workingHours: WorkingHours;
  appointmentSettings: AppointmentSettings;
  financialSettings: FinancialSettings;
  notifications: Notifications;
}
