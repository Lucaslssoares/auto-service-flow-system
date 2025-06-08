
import { useAppointmentsQuery } from './appointments/useAppointmentsQuery';
import { useAppointmentMutations } from './appointments/useAppointmentMutations';
import { useAppointmentFilters } from './appointments/useAppointmentFilters';

export const useAppointmentsOptimized = () => {
  const { data: appointments = [], isLoading, error } = useAppointmentsQuery();
  const mutations = useAppointmentMutations();
  const filters = useAppointmentFilters(appointments);

  return {
    appointments,
    isLoading,
    error,
    ...mutations,
    ...filters
  };
};
