import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type CashRegisterStatus = "open" | "closed";
export type MovementType = "payment" | "sangria" | "suprimento";
export type PaymentMethod = "cash" | "credit" | "debit" | "pix" | "other";

export interface CashRegister {
  id: string;
  user_id: string;
  status: CashRegisterStatus;
  opening_amount: number;
  closing_amount_expected: number | null;
  closing_amount_actual: number | null;
  difference: number | null;
  notes: string | null;
  opened_at: string;
  closed_at: string | null;
}

export interface CashMovement {
  id: string;
  cash_register_id: string;
  user_id: string;
  type: MovementType;
  amount: number;
  payment_method: PaymentMethod | null;
  appointment_id: string | null;
  description: string | null;
  created_at: string;
}

const REGISTER_KEY = ["cash_registers", "open"] as const;
const MOVEMENTS_KEY = (registerId: string) => ["cash_movements", registerId] as const;

export function useOpenCashRegister() {
  return useQuery({
    queryKey: REGISTER_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cash_registers")
        .select("*")
        .eq("status", "open")
        .order("opened_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as CashRegister | null;
    },
  });
}

export function useCashMovements(registerId: string | undefined) {
  return useQuery({
    queryKey: MOVEMENTS_KEY(registerId ?? ""),
    enabled: !!registerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cash_movements")
        .select("*")
        .eq("cash_register_id", registerId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as CashMovement[];
    },
  });
}

export function useOpenRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (opening_amount: number) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");
      const { data, error } = await supabase
        .from("cash_registers")
        .insert({ user_id: user.id, opening_amount, status: "open" })
        .select()
        .single();
      if (error) throw error;
      return data as CashRegister;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: REGISTER_KEY });
      toast.success("Caixa aberto com sucesso");
    },
    onError: (err: Error) => toast.error(`Erro ao abrir caixa: ${err.message}`),
  });
}

export function useCloseRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      registerId,
      expected_amount,
      actual_amount,
      notes,
    }: {
      registerId: string;
      expected_amount: number;
      actual_amount: number;
      notes?: string;
    }) => {
      const { error } = await supabase
        .from("cash_registers")
        .update({
          status: "closed",
          closing_amount_actual: actual_amount,
          closing_amount_expected: expected_amount,
          difference: actual_amount - expected_amount,
          notes: notes ?? null,
          closed_at: new Date().toISOString(),
        })
        .eq("id", registerId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: REGISTER_KEY });
      toast.success("Caixa fechado com sucesso");
    },
    onError: (err: Error) => toast.error(`Erro ao fechar caixa: ${err.message}`),
  });
}

export function useAddMovement(registerId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      type,
      amount,
      payment_method,
      description,
      appointment_id,
    }: {
      type: MovementType;
      amount: number;
      payment_method?: PaymentMethod;
      description?: string;
      appointment_id?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");
      if (!registerId) throw new Error("Nenhum caixa aberto");
      const { error } = await supabase.from("cash_movements").insert({
        cash_register_id: registerId,
        user_id: user.id,
        type,
        amount,
        payment_method: payment_method ?? null,
        description: description ?? null,
        appointment_id: appointment_id ?? null,
      });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      if (registerId) qc.invalidateQueries({ queryKey: MOVEMENTS_KEY(registerId) });
      qc.invalidateQueries({ queryKey: REGISTER_KEY });
      const labels: Record<MovementType, string> = {
        payment: "Pagamento registrado",
        sangria: "Sangria realizada",
        suprimento: "Suprimento registrado",
      };
      toast.success(labels[vars.type]);
    },
    onError: (err: Error) => toast.error(`Erro: ${err.message}`),
  });
}
