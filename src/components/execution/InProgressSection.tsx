
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExecutionActionButtons } from "./ExecutionActionButtons";
import { ServicesList } from "./ServicesList";

interface InProgressSectionProps {
  appointments: Array<{
    id: string;
    customerName: string;
    vehicleInfo: string;
    services?: Array<{ id: string; name: string }>;
    status: string;
  }>;
  updateStatus: (data: { id: string; status: string }) => void;
  onTeamWorkClick: (appointmentId: string, serviceId: string, serviceName: string) => void;
}

export const InProgressSection = ({ appointments, updateStatus, onTeamWorkClick }: InProgressSectionProps) => {
  const inProgressAppointments = appointments.filter(app => app.status === "in-progress");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Em Execução</CardTitle>
        <CardDescription>
          Serviços que estão sendo realizados no momento
        </CardDescription>
      </CardHeader>
      <CardContent>
        {inProgressAppointments.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            Nenhum serviço em execução
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Serviços</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inProgressAppointments.map(app => (
                <TableRow key={app.id}>
                  <TableCell>{app.customerName}</TableCell>
                  <TableCell>{app.vehicleInfo}</TableCell>
                  <TableCell>
                    <ServicesList
                      appointmentId={app.id}
                      services={app.services}
                      onTeamWorkClick={onTeamWorkClick}
                    />
                  </TableCell>
                  <TableCell>
                    <ExecutionActionButtons
                      appointment={app}
                      updateStatus={updateStatus}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
