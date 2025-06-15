
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarNav } from "./SidebarNav";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, User } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useSecureAuth } from "@/hooks/useSecureAuth";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, profile, signOut, isLoading } = useSecureAuth();
  const navigate = useNavigate();

  // Redireciona para login caso não autenticado assim que detecta deslogado
  useEffect(() => {
    if (!isLoading && user === null) {
      navigate('/auth', { replace: true });
    }
  }, [user, isLoading, navigate]);

  const handleSignOut = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success('Logout realizado com sucesso');
      navigate('/auth', { replace: true });
    } catch (error) {
      toast.error('Erro ao fazer logout. Tente novamente.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNav isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-4"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Lava Car</h1>
            </div>
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline text-sm">
                      {profile?.name || user.email?.split('@')[0] || 'Usuário'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 text-sm">
                    <p className="font-medium">Conectado como:</p>
                    <p className="text-gray-600 truncate">{user.email}</p>
                    {profile?.role && (
                      <p className="text-xs text-gray-500 mt-1">Papel: {profile.role}</p>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    disabled={isLoggingOut}
                    className={cn(
                      "text-red-600 focus:text-red-700 focus:bg-red-100 cursor-pointer",
                      "hover:bg-red-50 data-[highlighted]:bg-red-50 font-semibold"
                    )}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {isLoggingOut ? 'Saindo...' : 'Sair'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export default Layout;
