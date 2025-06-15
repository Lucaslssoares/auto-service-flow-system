
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

const ProtectedRoute = ({ children, requiredPermission }: ProtectedRouteProps) => {
  const { user, profile, isLoading, hasPermission } = useSecureAuth();
  const navigate = useNavigate();

  // Buscamos também roles para mostrar no feedback se acesso for negado
  const { roles } = require("@/hooks/useUserRoles").useUserRoles();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (!isLoading && user && requiredPermission && !hasPermission(requiredPermission)) {
      console.warn(`Acesso negado: permissão '${requiredPermission}' necessária`);
      navigate("/");
    }
  }, [user, profile, isLoading, requiredPermission, hasPermission, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg font-medium">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    // Exibir feedback detalhado para debugging
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-2">
            Você não tem permissão para acessar esta página.
          </p>
          <div className="mb-4 p-2 border rounded bg-gray-100 text-gray-700 text-sm">
            <div>Papéis vinculados ao seu usuário:</div>
            <ul className="mt-1 mb-2 inline-block text-left">
              {(roles && roles.length > 0)
                ? roles.map((r) => <li key={r}>- {r}</li>)
                : <li><em>(nenhum papel encontrado)</em></li>
              }
            </ul>
            <div>
              <span className="font-medium">A permissão requisitada é: </span>
              <code>{requiredPermission}</code>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Para acessar, seu usuário precisa ter o papel <b>admin</b> no sistema. 
              Solicite a um administrador que adicione esse papel para você.<br />
              Se já deveria ter, faça logout/login para recarregar suas permissões.
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

