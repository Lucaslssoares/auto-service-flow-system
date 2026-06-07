import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Wallet, ArrowDownCircle, ArrowUpCircle, CreditCard, Lock, Unlock, RefreshCw } from "lucide-react";
import {
  useOpenCashRegister,
  useCashMovements,
  useOpenRegister,
  useCloseRegister,
  useAddMovement,
  type MovementType,
  type PaymentMethod,
} from "@/hooks/useCashRegister";

// ── helpers ────────────────────────────────────────────────
const fmt = (n: number) =>
  `R$ ${n.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

const TYPE_LABEL: Record<MovementType, string> = {
  payment: "Pagamento",
  sangria: "Sangria",
  suprimento: "Suprimento",
};

const TYPE_CLASS: Record<MovementType, string> = {
  payment: "text-green-600",
  sangria: "text-red-600",
  suprimento: "text-blue-600",
};

const METHOD_LABEL: Record<string, string> = {
  cash: "Dinheiro",
  credit: "Crédito",
  debit: "Débito",
  pix: "PIX",
  other: "Outro",
};

// ── dialogs ────────────────────────────────────────────────
function OpenRegisterDialog({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState("0");
  const openRegister = useOpenRegister();

  const handleSubmit = () => {
    const val = parseFloat(amount.replace(",", "."));
    if (isNaN(val) || val < 0) return;
    openRegister.mutate(val, { onSuccess: onClose });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Abrir Caixa</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <div>
          <Label>Fundo inicial (R$)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} disabled={openRegister.isPending}>
          {openRegister.isPending ? "Abrindo..." : "Abrir Caixa"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function MovementDialog({
  type,
  registerId,
  expectedBalance,
  onClose,
}: {
  type: MovementType;
  registerId: string;
  expectedBalance: number;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [description, setDescription] = useState("");
  const addMovement = useAddMovement(registerId);

  const handleSubmit = () => {
    const val = parseFloat(amount.replace(",", "."));
    if (isNaN(val) || val <= 0) return;
    addMovement.mutate(
      {
        type,
        amount: val,
        payment_method: type === "payment" ? method : undefined,
        description: description || undefined,
      },
      { onSuccess: onClose }
    );
  };

  const titles: Record<MovementType, string> = {
    payment: "Registrar Pagamento",
    sangria: "Realizar Sangria",
    suprimento: "Registrar Suprimento",
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{titles[type]}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <div>
          <Label>Valor (R$)</Label>
          <Input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
          />
        </div>
        {type === "payment" && (
          <div>
            <Label>Forma de pagamento</Label>
            <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Dinheiro</SelectItem>
                <SelectItem value="credit">Cartão de Crédito</SelectItem>
                <SelectItem value="debit">Cartão de Débito</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        {type === "sangria" && (
          <p className="text-sm text-muted-foreground">
            Saldo atual: <strong className="text-foreground">{fmt(expectedBalance)}</strong>
          </p>
        )}
        <div>
          <Label>Descrição (opcional)</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Observações..."
            rows={2}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} disabled={addMovement.isPending}>
          {addMovement.isPending ? "Salvando..." : "Confirmar"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function CloseRegisterDialog({
  registerId,
  expectedBalance,
  onClose,
}: {
  registerId: string;
  expectedBalance: number;
  onClose: () => void;
}) {
  const [actual, setActual] = useState(expectedBalance.toFixed(2));
  const [notes, setNotes] = useState("");
  const closeRegister = useCloseRegister();

  const actualNum = parseFloat(actual.replace(",", ".")) || 0;
  const diff = actualNum - expectedBalance;

  const handleSubmit = () => {
    closeRegister.mutate(
      { registerId, expected_amount: expectedBalance, actual_amount: actualNum, notes },
      { onSuccess: onClose }
    );
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Fechar Caixa</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Saldo esperado</p>
            <p className="text-lg font-semibold">{fmt(expectedBalance)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Diferença</p>
            <p className={`text-lg font-semibold ${diff < 0 ? "text-red-600" : diff > 0 ? "text-blue-600" : "text-green-600"}`}>
              {diff >= 0 ? "+" : ""}{fmt(diff)}
            </p>
          </div>
        </div>
        <div>
          <Label>Valor real em caixa (R$)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={actual}
            onChange={(e) => setActual(e.target.value)}
          />
        </div>
        <div>
          <Label>Observações (opcional)</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button variant="destructive" onClick={handleSubmit} disabled={closeRegister.isPending}>
          {closeRegister.isPending ? "Fechando..." : "Fechar Caixa"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

// ── página principal ────────────────────────────────────────
const CashRegister = () => {
  const { data: register, isLoading, refetch } = useOpenCashRegister();
  const { data: movements = [] } = useCashMovements(register?.id);

  const [dialog, setDialog] = useState<"open" | "payment" | "sangria" | "suprimento" | "close" | null>(null);

  const summary = useMemo(() => {
    const payments  = movements.filter((m) => m.type === "payment").reduce((s, m) => s + m.amount, 0);
    const sangrias  = movements.filter((m) => m.type === "sangria").reduce((s, m) => s + m.amount, 0);
    const suprimentos = movements.filter((m) => m.type === "suprimento").reduce((s, m) => s + m.amount, 0);
    const opening   = register?.opening_amount ?? 0;
    const balance   = opening + payments + suprimentos - sangrias;
    return { payments, sangrias, suprimentos, opening, balance };
  }, [movements, register]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Controle de Caixa</h2>
          <p className="text-muted-foreground">
            {register ? `Caixa aberto em ${format(new Date(register.opened_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}` : "Nenhum caixa aberto"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          {!register ? (
            <Button onClick={() => setDialog("open")}>
              <Unlock className="h-4 w-4 mr-2" />
              Abrir Caixa
            </Button>
          ) : (
            <Button variant="destructive" onClick={() => setDialog("close")}>
              <Lock className="h-4 w-4 mr-2" />
              Fechar Caixa
            </Button>
          )}
        </div>
      </div>

      {/* Estado: caixa fechado */}
      {!register && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
            <Wallet className="h-16 w-16 text-muted-foreground/40" />
            <p className="text-muted-foreground text-lg">Nenhum caixa aberto no momento.</p>
            <Button onClick={() => setDialog("open")}>
              <Unlock className="h-4 w-4 mr-2" />
              Abrir Caixa
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Estado: caixa aberto */}
      {register && (
        <>
          {/* Cards de resumo */}
          <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
            {[
              { label: "Fundo Inicial", value: summary.opening, icon: Wallet, color: "text-gray-600" },
              { label: "Entradas",      value: summary.payments, icon: ArrowUpCircle, color: "text-green-600" },
              { label: "Sangrias",      value: summary.sangrias, icon: ArrowDownCircle, color: "text-red-600" },
              { label: "Saldo Atual",   value: summary.balance,  icon: CreditCard, color: "text-blue-700" },
            ].map(({ label, value, icon: Icon, color }) => (
              <Card key={label}>
                <CardHeader className="pb-1 pt-3 px-4 flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
                  <Icon className={`h-4 w-4 ${color}`} />
                </CardHeader>
                <CardContent className="px-4 pb-3">
                  <div className={`text-xl font-bold ${color}`}>{fmt(value)}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Ações */}
          <div className="flex gap-2 flex-wrap">
            <Button className="gap-2" onClick={() => setDialog("payment")}>
              <CreditCard className="h-4 w-4" />
              Registrar Pagamento
            </Button>
            <Button variant="outline" className="gap-2 border-red-300 text-red-600 hover:bg-red-50" onClick={() => setDialog("sangria")}>
              <ArrowDownCircle className="h-4 w-4" />
              Sangria
            </Button>
            <Button variant="outline" className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50" onClick={() => setDialog("suprimento")}>
              <ArrowUpCircle className="h-4 w-4" />
              Suprimento
            </Button>
          </div>

          {/* Tabela de movimentações */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Movimentações do Turno</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {movements.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Nenhuma movimentação registrada.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Horário</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Forma</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(m.created_at), "HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          <span className={`text-sm font-medium ${TYPE_CLASS[m.type]}`}>
                            {TYPE_LABEL[m.type]}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {m.payment_method ? METHOD_LABEL[m.payment_method] ?? m.payment_method : "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {m.description ?? "—"}
                        </TableCell>
                        <TableCell className={`text-right font-medium ${TYPE_CLASS[m.type]}`}>
                          {m.type === "sangria" ? "-" : "+"}{fmt(m.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Dialogs */}
      <Dialog open={dialog === "open"} onOpenChange={(o) => !o && setDialog(null)}>
        {dialog === "open" && <OpenRegisterDialog onClose={() => setDialog(null)} />}
      </Dialog>

      <Dialog open={dialog === "payment" || dialog === "sangria" || dialog === "suprimento"} onOpenChange={(o) => !o && setDialog(null)}>
        {(dialog === "payment" || dialog === "sangria" || dialog === "suprimento") && register && (
          <MovementDialog
            type={dialog as MovementType}
            registerId={register.id}
            expectedBalance={summary.balance}
            onClose={() => setDialog(null)}
          />
        )}
      </Dialog>

      <Dialog open={dialog === "close"} onOpenChange={(o) => !o && setDialog(null)}>
        {dialog === "close" && register && (
          <CloseRegisterDialog
            registerId={register.id}
            expectedBalance={summary.balance}
            onClose={() => setDialog(null)}
          />
        )}
      </Dialog>
    </div>
  );
};

export default CashRegister;
