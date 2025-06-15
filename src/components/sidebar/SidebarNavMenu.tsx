import React from "react";
import { Home, Users, Car, Wrench, UserCog, Calendar, PlayCircle, DollarSign, Settings, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarNavMenuProps {
  isOpen: boolean;
  isMobile: boolean;
  closeSidebar: () => void;
}

const menuItems = [
  {
    label: "Dashboard",
    icon: Home,
    path: "/",
  },
  {
    label: "Clientes",
    icon: Users,
    path: "/clientes",
  },
  {
    label: "Usuários",
    icon: User,
    path: "/usuarios",
  },
  {
    label: "Veículos",
    icon: Car,
    path: "/veiculos",
  },
  {
    label: "Serviços",
    icon: Wrench,
    path: "/servicos",
  },
  {
    label: "Funcionários",
    icon: UserCog,
    path: "/funcionarios",
  },
  {
    label: "Agendamentos",
    icon: Calendar,
    path: "/agendamentos",
  },
  {
    label: "Execução",
    icon: PlayCircle,
    path: "/execucao",
  },
  {
    label: "Financeiro",
    icon: DollarSign,
    path: "/financeiro",
  },
  {
    label: "Configurações",
    icon: Settings,
    path: "/configuracoes",
  },
  {
    label: "Perfil",
    icon: User,
    path: "/perfil",
  },
];

export function SidebarNavMenu({ isOpen, isMobile, closeSidebar }: SidebarNavMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = (path: string) => {
    if (isMobile) closeSidebar();
    navigate(path);
  };

  return (
    <ul
      className={cn(
        "flex-1 mt-4 space-y-1 overflow-y-auto custom-scrollbar",
        isOpen || isMobile ? "pl-2 pr-2" : "pl-1 pr-1"
      )}
      tabIndex={0}
    >
      {menuItems.map((item) => {
        const active = location.pathname === item.path;
        return (
          <li key={item.label}>
            <button
              className={cn(
                "group flex items-center gap-3 py-2 px-3 rounded-md transition-all cursor-pointer select-none whitespace-nowrap font-medium text-sidebar-foreground w-full",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:bg-sidebar-accent focus-visible:text-sidebar-accent-foreground",
                "active:bg-sidebar-accent/80 outline-none",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold shadow-sm"
                  : "",
                !isOpen && !isMobile
                  ? "justify-center px-2 py-3"
                  : "px-3",
                "duration-200"
              )}
              tabIndex={0}
              aria-current={active ? "page" : undefined}
              onClick={() => navigateTo(item.path)}
              type="button"
            >
              <item.icon className={cn("w-5 h-5 shrink-0", active && "text-sidebar-primary-foreground")} />
              {(isOpen || isMobile) && (
                <span className="ml-1 truncate">{item.label}</span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
