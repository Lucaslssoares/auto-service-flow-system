import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart2,
  Users,
  Car,
  Settings,
  Calendar,
  Clipboard,
  DollarSign,
  LogOut,
  Cog
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface SidebarNavProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function SidebarNav({ isOpen, setIsOpen }: SidebarNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
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

  const handleSignOut = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    console.log('Iniciando logout do sidebar...');

    try {
      const { error } = await signOut();

      if (error) {
        console.error('Erro ao fazer logout:', error.message);
        toast.error('Erro ao fazer logout. Tente novamente.');
        return;
      }

      toast.success('Logout realizado com sucesso');

      // Pequeno delay para garantir que o toast apareça antes de navegar
      setTimeout(() => {
        navigate('/auth', { replace: true });
      }, 500);
    } catch (err) {
      console.error('Erro inesperado no logout:', err);
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
          disabled={isLoggingOut}
          className={cn(
            "flex items-center w-full px-4 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            isLoggingOut && "bg-sidebar-accent/20"
          )}
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
        </button>
      </div>
    </div>
  );
}
