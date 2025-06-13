
import { Button } from "@/components/ui/button";
import { Users, User } from "lucide-react";

interface ServiceActionsProps {
  appointmentId: string;
  service: {
    id: string;
    name: string;
  };
  onTeamWorkClick: (appointmentId: string, serviceId: string, serviceName: string) => void;
  onMultipleEmployeesClick: (appointmentId: string, serviceId: string, serviceName: string) => void;
}

export const ServiceActions = ({ 
  appointmentId, 
  service, 
  onTeamWorkClick, 
  onMultipleEmployeesClick 
}: ServiceActionsProps) => {
  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onTeamWorkClick(appointmentId, service.id, service.name)}
        className="h-6 w-6 p-0"
      >
        <User className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onMultipleEmployeesClick(appointmentId, service.id, service.name)}
        className="h-6 w-6 p-0"
      >
        <Users className="h-3 w-3" />
      </Button>
    </div>
  );
};
