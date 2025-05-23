
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface EmployeeSearchProps {
  searchTerm: string;
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EmployeeSearch = ({ searchTerm, onSearch }: EmployeeSearchProps) => {
  return (
    <div className="flex items-center">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar funcionários..."
          className="pl-8"
          value={searchTerm}
          onChange={onSearch}
        />
      </div>
    </div>
  );
};
