
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface ServiceActionsProps {
  appointmentId: string;
  service: {
    id: string;
    name: string;
  };
  onTeamWorkClick: (appointmentId: string, serviceId: string, serviceName: string) => void;
}

export const ServiceActions = ({ appointmentId, service, onTeamWorkClick }: ServiceActionsProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onTeamWorkClick(appointmentId, service.id, service.name)}
      className="flex items-center gap-1"
    >
      <Users className="h-3 w-3" />
      Equipe
    </Button>
  );
};
