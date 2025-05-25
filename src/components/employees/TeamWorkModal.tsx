
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

interface TeamMember {
  employeeId: string;
  profitPercentage: number;
  notes?: string;
}

interface TeamWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  serviceId: string;
  serviceName: string;
}

export const TeamWorkModal = ({ 
  isOpen, 
  onClose, 
  appointmentId, 
  serviceId, 
  serviceName 
}: TeamWorkModalProps) => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { employeeId: "", profitPercentage: 100, notes: "" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("name");

      if (error) throw error;
      setEmployees(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar funcionários",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { employeeId: "", profitPercentage: 0, notes: "" }]);
  };

  const removeTeamMember = (index: number) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: any) => {
    const updated = teamMembers.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    );
    setTeamMembers(updated);
  };

  const getTotalPercentage = () => {
    return teamMembers.reduce((total, member) => total + (member.profitPercentage || 0), 0);
  };

  const handleSave = async () => {
    const totalPercentage = getTotalPercentage();
    
    if (totalPercentage !== 100) {
      toast({
        title: "Erro na divisão",
        description: "A soma das porcentagens deve ser exatamente 100%",
        variant: "destructive",
      });
      return;
    }

    const validMembers = teamMembers.filter(member => member.employeeId);
    
    if (validMembers.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um funcionário",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Remove existing service executions for this appointment and service
      await supabase
        .from("service_executions")
        .delete()
        .eq("appointment_id", appointmentId)
        .eq("service_id", serviceId);

      // Create new service executions
      const executions = validMembers.map(member => ({
        appointment_id: appointmentId,
        service_id: serviceId,
        employee_id: member.employeeId,
        start_time: new Date().toISOString(),
        profit_percentage: member.profitPercentage,
        notes: member.notes || null,
        status: "pending" as const,
      }));

      const { error } = await supabase
        .from("service_executions")
        .insert(executions);

      if (error) throw error;

      toast({
        title: "Equipe definida com sucesso!",
        description: `Divisão de lucros configurada para ${serviceName}`,
      });

      onClose();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Trabalho em Equipe - {serviceName}</DialogTitle>
          <DialogDescription>
            Defina a equipe que executará este serviço e como será dividido o lucro.
            A soma das porcentagens deve ser exatamente 100%.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Funcionário {index + 1}</h4>
                {teamMembers.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTeamMember(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Funcionário</Label>
                  <Select
                    value={member.employeeId}
                    onValueChange={(value) => updateTeamMember(index, "employeeId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem 
                          key={employee.id} 
                          value={employee.id}
                          disabled={teamMembers.some((m, i) => i !== index && m.employeeId === employee.id)}
                        >
                          {employee.name} - {employee.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Porcentagem do Lucro (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={member.profitPercentage}
                    onChange={(e) => updateTeamMember(index, "profitPercentage", Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label>Observações (opcional)</Label>
                <Textarea
                  value={member.notes || ""}
                  onChange={(e) => updateTeamMember(index, "notes", e.target.value)}
                  placeholder="Observações sobre a participação deste funcionário..."
                  rows={2}
                />
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={addTeamMember}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar Funcionário
            </Button>

            <div className="text-right">
              <p className="text-sm text-gray-600">Total: {getTotalPercentage()}%</p>
              {getTotalPercentage() !== 100 && (
                <p className="text-sm text-red-600 font-medium">
                  {getTotalPercentage() > 100 ? "Excede 100%" : "Faltam " + (100 - getTotalPercentage()) + "%"}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading || getTotalPercentage() !== 100}
          >
            {isLoading ? "Salvando..." : "Salvar Divisão"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
