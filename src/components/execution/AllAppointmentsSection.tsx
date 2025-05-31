
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
import { getStatusBadgeClass, getStatusText } from "@/utils/executionUtils";

interface AllAppointmentsSectionProps {
  activeAppointments: Array<{
    id: string;
    date: Date;
    customerName: string;
    vehicleInfo: string;
    services?: Array<{ id: string; name: string }>;
    status: string;
  }>;
  updateStatus: (data: { id: string; status: string }) => void;
  onTeamWorkClick: (appointmentId: string, serviceId: string, serviceName: string) => void;
}

export const AllAppointmentsSection = ({ activeAppointments, updateStatus, onTeamWorkClick }: AllAppointmentsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Todos os Agendamentos Ativos</CardTitle>
        <CardDescription>
          Agendamentos que precisam ser executados
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activeAppointments.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            Nenhum agendamento ativo
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Serviços</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeAppointments.map(app => (
                <TableRow key={app.id}>
                  <TableCell>{format(app.date, "dd/MM/yyyy")}</TableCell>
                  <TableCell>{format(app.date, "HH:mm")}</TableCell>
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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(app.status)}`}>
                      {getStatusText(app.status)}
                    </span>
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
