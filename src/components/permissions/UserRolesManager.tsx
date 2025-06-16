
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Users, Shield, UserX, UserCheck } from "lucide-react";
import { AppRole } from "@/hooks/useUserRoles";

interface UserWithRoles {
  id: string;
  name: string;
  email: string;
  roles: AppRole[];
}

const UserRolesManager = () => {
  const [searchEmail, setSearchEmail] = useState("");
  const queryClient = useQueryClient();

  const availableRoles: AppRole[] = ["admin", "manager", "employee", "user"];

  // Buscar todos os usuários com seus papéis
  const { data: users, isLoading } = useQuery({
    queryKey: ["users-with-roles"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name, email");

      if (profilesError) throw profilesError;

      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Combinar perfis com seus papéis
      const usersWithRoles: UserWithRoles[] = profiles.map(profile => {
        const roles = userRoles
          .filter(ur => ur.user_id === profile.id)
          .map(ur => ur.role as AppRole);
        
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          roles
        };
      });

      return usersWithRoles;
    }
  });

  // Mutation para atualizar papéis do usuário
  const updateUserRolesMutation = useMutation({
    mutationFn: async ({ userId, roles }: { userId: string; roles: AppRole[] }) => {
      // Remover todos os papéis existentes do usuário
      const { error: deleteError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      if (deleteError) throw deleteError;

      // Adicionar os novos papéis
      if (roles.length > 0) {
        const { error: insertError } = await supabase
          .from("user_roles")
          .insert(roles.map(role => ({ user_id: userId, role })));

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      toast.success("Papéis do usuário atualizados com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar papéis:", error);
      toast.error("Erro ao atualizar papéis do usuário");
    }
  });

  const handleRoleToggle = (userId: string, role: AppRole, currentRoles: AppRole[]) => {
    const hasRole = currentRoles.includes(role);
    const newRoles = hasRole 
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];

    updateUserRolesMutation.mutate({ userId, roles: newRoles });
  };

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
        {/* Filtro por email */}
        <div className="space-y-2">
          <Label htmlFor="search-email">Filtrar por email</Label>
          <Input
            id="search-email"
            placeholder="Digite o email do usuário..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
        </div>

        {/* Tabela de usuários */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Papéis Atuais</TableHead>
                <TableHead>Gerenciar Papéis</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.length > 0 ? (
                        user.roles.map((role) => (
                          <Badge key={role} variant="secondary">
                            {role}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline">Nenhum papel</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {availableRoles.map((role) => {
                        const hasRole = user.roles.includes(role);
                        return (
                          <div key={role} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${user.id}-${role}`}
                              checked={hasRole}
                              onCheckedChange={() => handleRoleToggle(user.id, role, user.roles)}
                              disabled={updateUserRolesMutation.isPending}
                            />
                            <Label 
                              htmlFor={`${user.id}-${role}`}
                              className="text-sm font-medium capitalize cursor-pointer"
                            >
                              {role}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <UserX className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">
              {searchEmail ? "Nenhum usuário encontrado com esse email" : "Nenhum usuário encontrado"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserRolesManager;
