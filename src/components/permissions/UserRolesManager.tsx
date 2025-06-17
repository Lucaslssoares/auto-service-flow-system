
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield } from "lucide-react";
import { AppRole } from "@/hooks/useUserRoles";
import { useUserRolesOperations } from "@/hooks/permissions/useUserRolesOperations";
import UserSearch from "./UserSearch";
import UsersTable from "./UsersTable";

const UserRolesManager = () => {
  const [searchEmail, setSearchEmail] = useState("");
  const { users, isLoading, handleRoleToggle, isUpdating } = useUserRolesOperations();

  const availableRoles: AppRole[] = ["admin", "manager", "employee", "user"];

  const filteredUsers = users?.filter(user => 
    searchEmail === "" || user.email.toLowerCase().includes(searchEmail.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Users className="h-8 w-8 animate-pulse mx-auto mb-2" />
          <p>Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <CardTitle>Gerenciar Permissões de Usuários</CardTitle>
        </div>
        <CardDescription>
          Gerencie os papéis e permissões dos usuários do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <UserSearch 
          searchEmail={searchEmail} 
          onSearchChange={setSearchEmail} 
        />
        
        <UsersTable
          users={filteredUsers}
          availableRoles={availableRoles}
          onRoleToggle={handleRoleToggle}
          isUpdating={isUpdating}
          searchEmail={searchEmail}
        />
      </CardContent>
    </Card>
  );
};

export default UserRolesManager;
