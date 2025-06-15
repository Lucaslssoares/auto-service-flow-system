
import { useState } from "react";
import { useExecutionAppointments } from "@/hooks/execution/useExecutionAppointments";
import { useExecutionActions } from "@/hooks/execution/useExecutionActions";
import { useServiceExecutions } from "@/hooks/useServiceExecutions";
import { format } from "date-fns";

export const useExecutionPageOptimized = () => {
  const { data: appointments = [], isLoading: appointmentsLoading } = useExecutionAppointments();
  const { updateStatus, isUpdating } = useExecutionActions();
  const { executions, startExecution, isLoading: executionsLoading } = useServiceExecutions();
  
  const [teamWorkModal, setTeamWorkModal] = useState({
    isOpen: false,
    appointmentId: "",
    serviceId: "",
    serviceName: ""
  });

  const [multipleEmployeesModal, setMultipleEmployeesModal] = useState({
    isOpen: false,
    appointmentId: "",
    serviceId: "",
    serviceName: ""
  });

  // Memoizar filtros para evitar recálculos desnecessários
  const activeAppointments = appointments
    .filter(app => app.status === "scheduled" || app.status === "in-progress")
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const todayAppointments = activeAppointments.filter(
    app => format(app.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  );

  const openTeamWorkModal = (appointmentId: string, serviceId: string, serviceName: string) => {
    setTeamWorkModal({
      isOpen: true,
      appointmentId,
      serviceId,
      serviceName
    });
  };

  const closeTeamWorkModal = () => {
    setTeamWorkModal({
      isOpen: false,
      appointmentId: "",
      serviceId: "",
      serviceName: ""
    });
  };

  const openMultipleEmployeesModal = (appointmentId: string, serviceId: string, serviceName: string) => {
    setMultipleEmployeesModal({
      isOpen: true,
      appointmentId,
      serviceId,
      serviceName
    });
  };

  const closeMultipleEmployeesModal = () => {
    setMultipleEmployeesModal({
      isOpen: false,
      appointmentId: "",
      serviceId: "",
      serviceName: ""
    });
  };

  const isLoading = appointmentsLoading || executionsLoading;

  return {
    appointments,
    activeAppointments,
    todayAppointments,
    updateStatus,
    teamWorkModal,
    multipleEmployeesModal,
    openTeamWorkModal,
    closeTeamWorkModal,
    openMultipleEmployeesModal,
    closeMultipleEmployeesModal,
    startExecution,
    isLoading: isLoading || isUpdating
  };
};
