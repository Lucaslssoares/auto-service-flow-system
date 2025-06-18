
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const UserPermissionsDiagnostic = () => {
  const { user, profile } = useSecureAuth();

  const { data: userRoles, isLoading } = useQuery({
    queryKey: ['user_roles_diagnostic', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao buscar roles:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id
  });

  const { data: profileData } = useQuery({
    queryKey: ['profile_diagnostic', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Diagnóstico de Permissões</CardTitle>
          <CardDescription>Verificando permissões do usuário...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const hasFinanceAccess = userRoles?.some(role => 
    ['admin', 'manager'].includes(role.role)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnóstico de Permissões</CardTitle>
        <CardDescription>
          Status das permissões para o usuário atual
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">Informações do Usuário</h4>
          <div className="text-sm space-y-1">
            <p><strong>Email:</strong> {user?.email || 'Não disponível'}</p>
            <p><strong>ID:</strong> {user?.id || 'Não disponível'}</p>
            <p><strong>Nome (Profile):</strong> {profileData?.name || 'Não disponível'}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Papéis Atribuídos</h4>
          <div className="flex flex-wrap gap-2">
            {userRoles && userRoles.length > 0 ? (
              userRoles.map((roleData, index) => (
                <Badge key={index} variant="secondary">
                  {roleData.role}
                </Badge>
              ))
            ) : (
              <Badge variant="outline">Nenhum papel encontrado</Badge>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Verificações de Acesso</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {hasFinanceAccess ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">
                Acesso ao módulo financeiro
              </span>
            </div>

            <div className="flex items-center gap-2">
              {userRoles?.some(role => role.role === 'admin') ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">
                Permissões de administrador
              </span>
            </div>

            <div className="flex items-center gap-2">
              {profileData ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">
                Perfil criado no sistema
              </span>
            </div>
          </div>
        </div>

        {!hasFinanceAccess && (
          <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
            <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-orange-700">Acesso Restrito</p>
              <p className="text-orange-600">
                Para acessar o módulo financeiro, você precisa ter o papel de 'admin' ou 'manager'.
                Entre em contato com um administrador para solicitar as permissões necessárias.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserPermissionsDiagnostic;
