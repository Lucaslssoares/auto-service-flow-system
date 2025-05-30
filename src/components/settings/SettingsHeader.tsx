
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Save, RefreshCw } from "lucide-react";

interface SettingsHeaderProps {
  onSave: () => void;
  loading: boolean;
}

export const SettingsHeader = ({ onSave, loading }: SettingsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-6 w-6" />
        <h2 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h2>
      </div>
      <Button onClick={onSave} disabled={loading} className="gap-2">
        {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Salvar Alterações
      </Button>
    </div>
  );
};
