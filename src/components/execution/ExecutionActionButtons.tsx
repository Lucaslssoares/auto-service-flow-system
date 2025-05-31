
import { Button } from "@/components/ui/button";

interface ExecutionActionButtonsProps {
  appointment: {
    id: string;
    status: string;
  };
  updateStatus: (data: { id: string; status: string }) => void;
}

export const ExecutionActionButtons = ({ appointment, updateStatus }: ExecutionActionButtonsProps) => {
  if (appointment.status === "scheduled") {
    return (
      <div className="flex gap-2">
        <Button 
          size="sm" 
          onClick={() => updateStatus({ id: appointment.id, status: "in-progress" })}
        >
          Iniciar
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => updateStatus({ id: appointment.id, status: "cancelled" })}
        >
          Cancelar
        </Button>
      </div>
    );
  } else if (appointment.status === "in-progress") {
    return (
      <Button 
        size="sm" 
        onClick={() => updateStatus({ id: appointment.id, status: "completed" })}
        className="bg-green-600 hover:bg-green-700"
      >
        Finalizar
      </Button>
    );
  }
  
  return null;
};
