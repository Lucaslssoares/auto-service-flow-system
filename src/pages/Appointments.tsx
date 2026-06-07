import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog } from "@/components/ui/dialog";
import { Plus, RefreshCw, Trash2, CheckCircle, LogIn, Play, Flag, XCircle } from "lucide-react";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { useAppointmentsUnified } from "@/hooks/useAppointmentsUnified";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { AppointmentStatus } from "@/types";

// ── helpers de status ──────────────────────────────────────
const STATUS_LABEL: Record<string, string> = {
  pending:     "Aguardando",
  scheduled:   "Agendado",
  confirmed:   "Confirmado",
  arrived:     "Presente",
  "in-progress": "Em Andamento",
  completed:   "Concluído",
  cancelled:   "Cancelado",
};

const STATUS_CLASS: Record<string, string> = {
  pending:     "bg-gray-100 text-gray-700 border-gray-300",
  scheduled:   "bg-blue-100 text-blue-700 border-blue-300",
  confirmed:   "bg-indigo-100 text-indigo-700 border-indigo-300",
  arrived:     "bg-yellow-100 text-yellow-700 border-yellow-300",
  "in-progress": "bg-orange-100 text-orange-700 border-orange-300",
  completed:   "bg-green-100 text-green-700 border-green-300",
  cancelled:   "bg-red-100 text-red-700 border-red-300",
};

// Próximo status no fluxo (para botão principal)
const NEXT_STATUS: Partial<Record<string, { label: string; icon: React.ReactNode; status: AppointmentStatus }>> = {
  pending:     { label: "Confirmar",    icon: <CheckCircle className="h-3.5 w-3.5" />, status: "confirmed" },
  scheduled:   { label: "Confirmar",   icon: <CheckCircle className="h-3.5 w-3.5" />, status: "confirmed" },
  confirmed:   { label: "Check-in",    icon: <LogIn className="h-3.5 w-3.5" />,       status: "arrived" },
  arrived:     { label: "Iniciar",     icon: <Play className="h-3.5 w-3.5" />,        status: "in-progress" },
  "in-progress": { label: "Concluir", icon: <Flag className="h-3.5 w-3.5" />,        status: "completed" },
};

const CAN_CANCEL = new Set(["pending", "scheduled", "confirmed", "arrived"]);

// ── componente ─────────────────────────────────────────────
const Appointments = () => {
  const { appointments, isLoading, updateStatus, deleteAppointment, isUpdating, isDeleting, getAppointmentsByStatus, refetch } = useAppointmentsUnified();
  const [formOpen, setFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ativos");

  const pending    = [...getAppointmentsByStatus("pending"), ...getAppointmentsByStatus("scheduled")];
  const confirmed  = getAppointmentsByStatus("confirmed");
  const arrived    = getAppointmentsByStatus("arrived");
  const inProgress = getAppointmentsByStatus("in-progress");
  const completed  = getAppointmentsByStatus("completed");
  const cancelled  = getAppointmentsByStatus("cancelled");

  const TAB_DATA: Record<string, typeof appointments> = {
    ativos:    [...pending, ...confirmed, ...arrived, ...inProgress],
    pendentes: pending,
    confirmados: confirmed,
    presentes: arrived,
    execucao:  inProgress,
    historico: [...completed, ...cancelled],
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este agendamento?")) deleteAppointment(id);
  };

  const rows = TAB_DATA[activeTab] ?? [];

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Agendamentos</h2>
          <p className="text-muted-foreground">Gerencie o fluxo completo de atendimento</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button className="gap-2" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" /> Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
        {[
          { label: "Aguardando",    count: pending.length,    color: "text-gray-600" },
          { label: "Confirmados",   count: confirmed.length,  color: "text-indigo-600" },
          { label: "Presentes",     count: arrived.length,    color: "text-yellow-600" },
          { label: "Em Andamento",  count: inProgress.length, color: "text-orange-600" },
          { label: "Concluídos",    count: completed.length,  color: "text-green-600" },
        ].map(({ label, count, color }) => (
          <Card key={label}>
            <CardHeader className="pb-1 pt-3 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <div className={`text-2xl font-bold ${color}`}>{count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs + Tabela */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="ativos">Ativos ({[...pending, ...confirmed, ...arrived, ...inProgress].length})</TabsTrigger>
          <TabsTrigger value="pendentes">Aguardando ({pending.length})</TabsTrigger>
          <TabsTrigger value="confirmados">Confirmados ({confirmed.length})</TabsTrigger>
          <TabsTrigger value="presentes">Presentes ({arrived.length})</TabsTrigger>
          <TabsTrigger value="execucao">Em Execução ({inProgress.length})</TabsTrigger>
          <TabsTrigger value="historico">Histórico ({completed.length + cancelled.length})</TabsTrigger>
        </TabsList>

        {Object.keys(TAB_DATA).map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardContent className="p-0">
                {rows.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Nenhum agendamento nesta categoria.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Veículo</TableHead>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Serviços</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((appt) => {
                        const next = NEXT_STATUS[appt.status];
                        return (
                          <TableRow key={appt.id}>
                            <TableCell className="font-medium">
                              {appt.customerName || "—"}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {appt.vehicleInfo || "—"}
                            </TableCell>
                            <TableCell className="text-sm">
                              {appt.date ? (
                                <>
                                  <div>{format(appt.date, "dd/MM/yyyy", { locale: ptBR })}</div>
                                  <div className="text-muted-foreground">{format(appt.date, "HH:mm")}</div>
                                </>
                              ) : "—"}
                            </TableCell>
                            <TableCell>
                              <div className="space-y-0.5">
                                {appt.services?.length > 0
                                  ? appt.services.map((s) => (
                                      <div key={s.id} className="text-xs">{s.name}</div>
                                    ))
                                  : <span className="text-xs text-muted-foreground">—</span>
                                }
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_CLASS[appt.status] ?? STATUS_CLASS.scheduled}`}>
                                {STATUS_LABEL[appt.status] ?? appt.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm font-medium">
                              {appt.totalPrice
                                ? `R$ ${appt.totalPrice.toFixed(2).replace(".", ",")}`
                                : "R$ 0,00"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-1 justify-end">
                                {/* Botão de avanço de status */}
                                {next && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 text-xs h-7"
                                    disabled={isUpdating}
                                    onClick={() => updateStatus({ id: appt.id, status: next.status })}
                                  >
                                    {next.icon}
                                    {next.label}
                                  </Button>
                                )}
                                {/* Cancelar */}
                                {CAN_CANCEL.has(appt.status) && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 text-muted-foreground hover:text-red-600"
                                    disabled={isUpdating}
                                    onClick={() => updateStatus({ id: appt.id, status: "cancelled" })}
                                    title="Cancelar agendamento"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                )}
                                {/* Excluir */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-muted-foreground hover:text-red-600"
                                  disabled={isDeleting}
                                  onClick={() => handleDelete(appt.id)}
                                  title="Excluir agendamento"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <AppointmentForm onClose={() => setFormOpen(false)} />
      </Dialog>
    </div>
  );
};

export default Appointments;
