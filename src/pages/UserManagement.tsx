
import React from "react";
import { useAdminUserManagement } from "@/hooks/admin/useAdminUserManagement";
import { Loader2, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";

const UserManagement: React.FC = () => {
  const {
    users,
    loading,
    promoteToAdmin,
    demoteFromAdmin,
    refetch,
  } = useAdminUserManagement();

  return (
    <ProtectedRoute requiredPermission="manage_users">
      <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow mt-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <Users className="w-6 h-6" />
          Gerenciamento de Usuários/Admins
        </h1>
        {loading ? (
          <div className="flex items-center gap-2 text-blue-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            Carregando usuários...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm rounded-lg bg-gray-50">
              <thead>
                <tr>
                  <th className="py-2 px-3 text-left whitespace-nowrap">Nome</th>
                  <th className="py-2 px-3 text-left">Email</th>
                  <th className="py-2 px-3 text-center">Papel</th>
                  <th className="py-2 px-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b last:border-none">
                    <td className="py-2 px-3 flex items-center gap-2 font-medium">
                      <User className="w-4 h-4 text-gray-500" />
                      {u.name || <span className="italic text-gray-400">sem nome</span>}
                    </td>
                    <td className="py-2 px-3">{u.email}</td>
                    <td className="py-2 px-3 text-center capitalize">{u.role}</td>
                    <td className="py-2 px-3 text-center">
                      {u.role === "admin" ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => demoteFromAdmin(u.id)}
                          className="text-xs"
                        >
                          Remover admin
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => promoteToAdmin(u.id)}
                          className="text-xs"
                        >
                          Tornar admin
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {!users.length && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-400">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <Button onClick={refetch} size="sm" variant="outline">
            Atualizar lista
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default UserManagement;
