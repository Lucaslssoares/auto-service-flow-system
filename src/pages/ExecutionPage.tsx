
import { Loader2 } from "lucide-react";
import { useExecutionPage } from "@/hooks/useExecutionPage";
import { TeamWorkModal } from "@/components/employees/TeamWorkModal";
import { MultipleEmployeesModal } from "@/components/execution/MultipleEmployeesModal";
import { InProgressSection } from "@/components/execution/InProgressSection";
import { UpcomingSection } from "@/components/execution/UpcomingSection";
import { AllAppointmentsSection } from "@/components/execution/AllAppointmentsSection";

const ExecutionPage = () => {
  const {
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
  } = useExecutionPage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando dados de execução...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Execução de Serviços</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <InProgressSection
          appointments={appointments}
          updateStatus={updateStatus}
          onTeamWorkClick={openTeamWorkModal}
          onMultipleEmployeesClick={openMultipleEmployeesModal}
        />
        
        <UpcomingSection
          todayAppointments={todayAppointments}
          updateStatus={updateStatus}
          onTeamWorkClick={openTeamWorkModal}
          onMultipleEmployeesClick={openMultipleEmployeesModal}
        />
      </div>
      
      <AllAppointmentsSection
        activeAppointments={activeAppointments}
        updateStatus={updateStatus}
        onTeamWorkClick={openTeamWorkModal}
        onMultipleEmployeesClick={openMultipleEmployeesModal}
      />

      <TeamWorkModal
        isOpen={teamWorkModal.isOpen}
        onClose={closeTeamWorkModal}
        appointmentId={teamWorkModal.appointmentId}
        serviceId={teamWorkModal.serviceId}
        serviceName={teamWorkModal.serviceName}
      />

      <MultipleEmployeesModal
        isOpen={multipleEmployeesModal.isOpen}
        onClose={closeMultipleEmployeesModal}
        appointmentId={multipleEmployeesModal.appointmentId}
        serviceId={multipleEmployeesModal.serviceId}
        serviceName={multipleEmployeesModal.serviceName}
        onStartExecution={startExecution}
      />
    </div>
  );
};

export default ExecutionPage;
