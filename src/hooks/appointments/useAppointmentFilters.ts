
import { useCallback } from 'react';
import { Appointment, AppointmentStatus } from '@/types';

export const useAppointmentFilters = (appointments: Appointment[]) => {
  const getAppointmentsByStatus = useCallback((status: AppointmentStatus) => {
    return appointments.filter(app => app.status === status);
  }, [appointments]);

  const getTodayAppointments = useCallback(() => {
    const today = new Date().toDateString();
    return appointments.filter(app => app.date.toDateString() === today);
  }, [appointments]);

  return {
    getAppointmentsByStatus,
    getTodayAppointments
  };
};
