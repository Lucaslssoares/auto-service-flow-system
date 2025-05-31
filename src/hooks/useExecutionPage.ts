
import { useState } from "react";
import { useAppointments } from "@/hooks/useAppointments";
import { useServiceExecutions } from "@/hooks/useServiceExecutions";
import { format } from "date-fns";

export const useExecutionPage = () => {
  const { appointments, updateStatus, isLoading: appointmentsLoading } = useAppointments();
  const { executions, startExecution, completeExecution, isLoading: executionsLoading } = useServiceExecutions();
  
  const [teamWorkModal, setTeamWorkModal] = useState<{
    isOpen: boolean;
    appointmentId: string;
    serviceId: string;
    serviceName: string;
  }>({
    isOpen: false,
    appointmentId: "",
    serviceId: "",
    serviceName: ""
  });

  const [multipleEmployeesModal, setMultipleEmployeesModal] = useState<{
    isOpen: boolean;
    appointmentId: string;
    serviceId: string;
    serviceName: string;
  }>({
    isOpen: false,
    appointmentId: "",
    serviceId: "",
    serviceName: ""
  });

  // Filter appointments that are scheduled or in-progress
  const activeAppointments = appointments
    .filter(app => app.status === "scheduled" || app.status === "in-progress")
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Today's appointments
  const todayAppointments = activeAppointments.filter(
    app => format(app.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  );

  // Function to open team work modal (single employee)
  const openTeamWorkModal = (appointmentId: string, serviceId: string, serviceName: string) => {
    setTeamWorkModal({
      isOpen: true,
      appointmentId,
      serviceId,
      serviceName
    });
  };

  // Function to close team work modal
  const closeTeamWorkModal = () => {
    setTeamWorkModal({
      isOpen: false,
      appointmentId: "",
      serviceId: "",
      serviceName: ""
    });
  };

  // Function to open multiple employees modal
  const openMultipleEmployeesModal = (appointmentId: string, serviceId: string, serviceName: string) => {
    setMultipleEmployeesModal({
      isOpen: true,
      appointmentId,
      serviceId,
      serviceName
    });
  };

  // Function to close multiple employees modal
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
    isLoading
  };
};
