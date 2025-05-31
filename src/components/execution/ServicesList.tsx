
import { ServiceActions } from "./ServiceActions";

interface ServicesListProps {
  appointmentId: string;
  services: Array<{
    id: string;
    name: string;
  }> | undefined;
  onTeamWorkClick: (appointmentId: string, serviceId: string, serviceName: string) => void;
}

export const ServicesList = ({ appointmentId, services, onTeamWorkClick }: ServicesListProps) => {
  if (!services || services.length === 0) {
    return <span className="text-xs text-muted-foreground">Nenhum serviço</span>;
  }

  return (
    <div className="flex flex-col gap-2">
      {services.map(service => (
        <div key={service.id} className="flex items-center justify-between">
          <span className="text-xs">{service.name}</span>
          <ServiceActions
            appointmentId={appointmentId}
            service={service}
            onTeamWorkClick={onTeamWorkClick}
          />
        </div>
      ))}
    </div>
  );
};
