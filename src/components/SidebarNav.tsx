import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart2, Users, Car, Settings, Calendar, Clipboard,
  DollarSign, LogOut, Cog, Shield
} from "lucide-react";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { toast } from "sonner";

interface SidebarNavProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function SidebarNav({ isOpen, setIsOpen }: SidebarNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, isLoading, hasPermission } = useSecureAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = [
    { title: "Dashboard", icon: BarChart2, href: "/" },
    { title: "Clientes", icon: Users, href: "/clientes" },
    { title: "Veículos", icon: Car, href: "/veiculos" },
    { title: "Serviços", icon: Settings, href: "/servicos" },
    { title: "Funcionários", icon: Users, href: "/funcionarios" },
    { title: "Agendamentos", icon: Calendar, href: "/agendamentos" },
    { title: "Execução", icon: Clipboard, href: "/execucao" },
    { title: "Financeiro", icon: DollarSign, href: "/financeiro" },
    { title: "Configurações", icon: Cog, href: "/configuracoes" },
  ];

  // Adicionar item de permissões apenas para admins
  if (hasPermission("manage_users")) {
    navItems.push({ title: "Permissões", icon: Shield, href: "/permissoes" });
  }

  const handleSignOut = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success('Logout realizado com sucesso');
      navigate('/auth', { replace: true });
    } catch (err) {
      toast.error('Erro inesperado ao fazer logout.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-sidebar flex flex-col transition-all duration-300 ease-in-out shadow-lg`}
    >
      <div className="flex items-center justify-center h-16 border-b border-sidebar-border">
        <h2 className={`text-sidebar-foreground font-bold ${isOpen ? "" : "hidden"}`}>
          LAVA CAR
        </h2>
        <span className={`text-sidebar-foreground text-2xl font-bold ${isOpen ? "hidden" : ""}`}>
          LC
        </span>
      </div>
      <nav className="mt-5 flex-grow">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  location.pathname === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className={`h-5 w-5 ${isOpen ? "mr-3" : "mx-auto"}`} />
                <span className={isOpen ? "" : "hidden"}>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-sidebar-border mt-auto">
        <button
          onClick={handleSignOut}
          disabled={isLoggingOut || isLoading}
          className={cn(
            "flex items-center w-full px-4 py-2 text-sm font-medium rounded-md transition-colors",
            "bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-900",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
            (isLoggingOut || isLoading) && "opacity-60 cursor-not-allowed"
          )}
          style={{ minHeight: 44 }}
        >
          <LogOut
            className={cn(
              "h-5 w-5",
              isOpen ? "mr-3" : "mx-auto",
              isLoggingOut && "animate-pulse"
            )}
          />
          <span className={isOpen ? "" : "hidden"}>
            {isLoggingOut ? "Saindo..." : "Sair"}
          </span>
          {!isOpen && (
            <span className="sr-only">{isLoggingOut ? "Saindo..." : "Sair"}</span>
          )}
        </button>
      </div>
    </div>
  );
}
