import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMemo } from "react";

export interface BusinessConfig {
  id: number;
  max_per_slot: number;
  slot_duration_minutes: number;
  working_start: string;
  working_end: string;
  updated_at: string;
}

export interface SlotInfo {
  time: string;
  count: number;
  max: number;
  available: boolean;
  label: string;
}

const CONFIG_KEY = ["business_config"] as const;
const AVAILABILITY_KEY = (date: string) => ["slot_availability", date] as const;

export function useBusinessConfig() {
  return useQuery({
    queryKey: CONFIG_KEY,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_config")
        .select("*")
        .single();
      if (error) throw error;
      return data as BusinessConfig;
    },
  });
}

export function useUpdateBusinessConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (config: Partial<Omit<BusinessConfig, "id" | "updated_at">>) => {
      const { error } = await supabase
        .from("business_config")
        .update({ ...config, updated_at: new Date().toISOString() })
        .eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CONFIG_KEY });
      qc.invalidateQueries({ queryKey: ["slot_availability"] });
      toast.success("Configurações de capacidade salvas");
    },
    onError: (err: Error) => toast.error(`Erro: ${err.message}`),
  });
}

function generateSlots(start: string, end: string, durationMinutes: number): string[] {
  const slots: string[] = [];
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  let minutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  while (minutes < endMinutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    slots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    minutes += durationMinutes;
  }
  return slots;
}

export function useSlotAvailability(date: Date | undefined) {
  const { data: config } = useBusinessConfig();
  const dateKey = date ? date.toISOString().slice(0, 10) : "";

  const { data: appointments, isLoading } = useQuery({
    queryKey: AVAILABILITY_KEY(dateKey),
    enabled: !!date && !!config,
    staleTime: 30_000,
    queryFn: async () => {
      if (!date) return [];
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      const { data, error } = await supabase
        .from("appointments")
        .select("date, status")
        .gte("date", start.toISOString())
        .lte("date", end.toISOString())
        .neq("status", "cancelled");
      if (error) throw error;
      return data ?? [];
    },
  });

  const slots = useMemo((): SlotInfo[] => {
    if (!config) return [];
    const slotTimes = generateSlots(
      config.working_start,
      config.working_end,
      config.slot_duration_minutes
    );
    return slotTimes.map((time) => {
      const [h, m] = time.split(":").map(Number);
      const slotStart = h * 60 + m;
      const slotEnd = slotStart + config.slot_duration_minutes;
      const count = (appointments ?? []).filter((a) => {
        const d = new Date(a.date);
        const aMin = d.getHours() * 60 + d.getMinutes();
        return aMin >= slotStart && aMin < slotEnd;
      }).length;
      const available = count < config.max_per_slot;
      let label = time;
      if (!available) label += " — lotado";
      else if (count > 0) label += ` (${count}/${config.max_per_slot})`;
      return { time, count, max: config.max_per_slot, available, label };
    });
  }, [config, appointments]);

  return { slots, config, isLoading: isLoading || !config };
}
