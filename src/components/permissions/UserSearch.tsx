
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserSearchProps {
  searchEmail: string;
  onSearchChange: (email: string) => void;
}

const UserSearch = ({ searchEmail, onSearchChange }: UserSearchProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="search-email">Filtrar por email</Label>
      <Input
        id="search-email"
        placeholder="Digite o email do usuário..."
        value={searchEmail}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default UserSearch;
