
import React from "react";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import UserRolesManager from "@/components/permissions/UserRolesManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle } from "lucide-react";

const UserPermissions = () => {
  const { hasPermission } = useSecureAuth();

  if (!hasPermission("manage_users")) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-orange-500" />
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar o painel de permissões de usuários.
              Esta funcionalidade é restrita apenas para administradores.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Painel de Permissões</h1>
      </div>
      
      <div className="text-sm text-gray-600">
        Gerencie os papéis e permissões dos usuários do sistema de forma centralizada.
      </div>

      <UserRolesManager />
    </div>
  );
};

export default UserPermissions;
