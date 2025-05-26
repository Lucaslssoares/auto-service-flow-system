
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText } from "lucide-react";
import { exportToCSV, exportToJSON } from "@/utils/exportUtils";

interface ExportButtonProps {
  data: any[];
  filename: string;
  disabled?: boolean;
}

export const ExportButton = ({ data, filename, disabled = false }: ExportButtonProps) => {
  const handleExportCSV = () => {
    exportToCSV(data, filename);
  };

  const handleExportJSON = () => {
    exportToJSON(data, filename);
  };

  if (disabled || !data.length) {
    return (
      <Button variant="outline" disabled>
        <Download className="mr-2 h-4 w-4" />
        Exportar
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border shadow-md">
        <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer">
          <FileText className="mr-2 h-4 w-4" />
          Exportar como CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON} className="cursor-pointer">
          <FileText className="mr-2 h-4 w-4" />
          Exportar como JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
