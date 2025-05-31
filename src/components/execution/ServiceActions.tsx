
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Users className="h-3 w-3" />
          Equipe
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onTeamWorkClick(appointmentId, service.id, service.name)}>
          <Users className="h-4 w-4 mr-2" />
          Um funcionário
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onMultipleEmployeesClick(appointmentId, service.id, service.name)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Múltiplos funcionários
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
