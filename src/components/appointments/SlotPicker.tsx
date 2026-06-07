import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSlotAvailability } from "@/hooks/useCapacityConfig";

interface SlotPickerProps {
  date: Date | undefined;
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
}

export function SlotPicker({ date, value, onChange, placeholder = "Selecione um horário" }: SlotPickerProps) {
  const { slots, isLoading } = useSlotAvailability(date);

  if (!date) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma data primeiro" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={onChange} disabled={isLoading}>
      <SelectTrigger>
        <SelectValue placeholder={isLoading ? "Carregando horários..." : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {slots.map((slot) => (
          <SelectItem
            key={slot.time}
            value={slot.time}
            disabled={!slot.available}
            className={
              !slot.available
                ? "text-red-400"
                : slot.count > 0
                ? "text-amber-700 font-medium"
                : ""
            }
          >
            {slot.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
