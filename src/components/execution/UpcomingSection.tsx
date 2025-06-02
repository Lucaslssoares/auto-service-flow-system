
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
import { format } from "date-fns";
import { ExecutionActionButtons } from "./ExecutionActionButtons";
import { ServicesList } from "./ServicesList";

interface UpcomingSectionProps {
  todayAppointments: Array<{
    id: string;
    date: Date;
    customerName: string;
    vehicleInfo: string;
    services?: Array<{ id: string; name: string }>;
    status: string;
  }>;
  updateStatus: (data: { id: string; status: string }) => void;
  onTeamWorkClick: (appointmentId: string, serviceId: string, serviceName: string) => void;
  onMultipleEmployeesClick: (appointmentId: string, serviceId: string, serviceName: string) => void;
}

export const UpcomingSection = ({ todayAppointments, updateStatus, onTeamWorkClick, onMultipleEmployeesClick }: UpcomingSectionProps) => {
  const scheduledAppointments = todayAppointments.filter(app => app.status === "scheduled");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos Serviços</CardTitle>
        <CardDescription>
          Serviços agendados para hoje
        </CardDescription>
      </CardHeader>
      <CardContent>
        {scheduledAppointments.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            Nenhum serviço agendado para hoje
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Horário</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Serviços</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduledAppointments.map(app => (
                <TableRow key={app.id}>
                  <TableCell>{format(app.date, "HH:mm")}</TableCell>
                  <TableCell>{app.customerName}</TableCell>
                  <TableCell>{app.vehicleInfo}</TableCell>
                  <TableCell>
                    <ServicesList
                      appointmentId={app.id}
                      services={app.services}
                      onTeamWorkClick={onTeamWorkClick}
                      onMultipleEmployeesClick={onMultipleEmployeesClick}
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
