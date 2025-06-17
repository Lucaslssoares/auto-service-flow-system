
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserX } from "lucide-react";
import { AppRole } from "@/hooks/useUserRoles";
import UserRoleBadges from "./UserRoleBadges";
import RoleCheckboxes from "./RoleCheckboxes";

interface UserWithRoles {
  id: string;
  name: string;
  email: string;
  roles: AppRole[];
}

interface UsersTableProps {
  users: UserWithRoles[];
  availableRoles: AppRole[];
  onRoleToggle: (userId: string, role: AppRole, currentRoles: AppRole[]) => void;
  isUpdating: boolean;
  searchEmail: string;
}

const UsersTable = ({ 
  users, 
  availableRoles, 
  onRoleToggle, 
  isUpdating, 
  searchEmail 
}: UsersTableProps) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <UserX className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-gray-500">
          {searchEmail ? "Nenhum usuário encontrado com esse email" : "Nenhum usuário encontrado"}
        </p>
      </div>
    );
  }

  return (
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
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <UserRoleBadges roles={user.roles} />
              </TableCell>
              <TableCell>
                <RoleCheckboxes
                  userId={user.id}
                  userRoles={user.roles}
                  availableRoles={availableRoles}
                  onRoleToggle={onRoleToggle}
                  disabled={isUpdating}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
