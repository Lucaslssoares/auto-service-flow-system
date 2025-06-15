import React from "react";
import {
  Home,
  Users,
  Car,
  Wrench,
  UserCog,
  Calendar,
  PlayCircle,
  DollarSign,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User, // Import para o ícone de usuário
} from "lucide-react";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarNavMenu } from "./sidebar/SidebarNavMenu";
import { SidebarNavFooter } from "./sidebar/SidebarNavFooter";

// Itens do menu (AGORA COM GERENCIAMENTO DE USUÁRIOS/ADMINS)
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
    icon: User, // Ícone de usuário individual
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
];

interface SidebarNavProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function SidebarNav({ isOpen, setIsOpen }: SidebarNavProps) {
  useSecureAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Sidebar width classes
  const sidebarWidth = isOpen || isMobile ? "w-60 sm:w-72" : "w-16";
  const showOverlay = isMobile && isOpen;

  return (
    <>
      {/* Overlay para mobile */}
      {showOverlay && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"
          onClick={() => setIsOpen(false)}
          aria-label="Fechar menu"
        />
      )}
      {/* Sidebar */}
      <nav
        className={cn(
          "h-full fixed top-0 left-0 z-40 flex flex-col bg-sidebar-DEFAULT border-r border-sidebar-border shadow-lg transition-all duration-300",
          sidebarWidth,
          isMobile
            ? [
                "h-screen",
                "overflow-hidden",
                isOpen
                  ? "left-0 animate-slide-in-right"
                  : "-left-72 pointer-events-none",
                "transition-all duration-300 ease-in-out",
              ]
            : [
                "relative",
                "!z-10",
                !isOpen && "hover:z-40",
              ]
        )}
        aria-label="Sidebar"
        style={{
          minWidth: isMobile && !isOpen ? 0 : undefined,
          width: isOpen || !isMobile ? undefined : 64,
        }}
      >
        {/* Topo: logo/nome + botão de menu */}
        <div
          className={cn(
            "flex items-center gap-2 h-16 px-3",
            "bg-sidebar-accent border-b border-sidebar-border"
          )}
        >
          {/* Collapse/expand button (desktop) */}
          {!isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "mr-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary group",
                "p-2 bg-sidebar-accent hover:bg-sidebar-primary"
              )}
              aria-label={isOpen ? "Reduzir menu" : "Expandir menu"}
              tabIndex={0}
              type="button"
            >
              {isOpen ? (
                <ChevronLeft className="w-6 h-6 text-sidebar-primary-foreground transition-transform group-hover:-translate-x-1" />
              ) : (
                <ChevronRight className="w-6 h-6 text-sidebar-primary-foreground transition-transform group-hover:translate-x-1" />
              )}
            </button>
          )}

          {/* Logo/título (se aberto OU mobile) */}
          <span
            className={cn(
              "font-bold text-lg tracking-tight text-sidebar-primary-foreground flex-1 transition-all duration-300 select-none",
              !isOpen && !isMobile ? "opacity-0 w-0 overflow-hidden" : "block text-center"
            )}
            style={{
              transition: "opacity 0.2s, width 0.2s",
            }}
          >
            Lava Car
          </span>
          {isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "ml-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary group",
                "p-2 bg-sidebar-accent hover:bg-sidebar-primary"
              )}
              aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
              tabIndex={0}
              type="button"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-sidebar-primary-foreground transition group-hover:rotate-90" />
              ) : (
                <Menu className="w-6 h-6 text-sidebar-primary-foreground" />
              )}
            </button>
          )}
        </div>
        {/* Menu */}
        <SidebarNavMenu isOpen={isOpen} isMobile={isMobile} closeSidebar={() => setIsOpen(false)} />
        {/* Footer */}
        <SidebarNavFooter isOpen={isOpen} isMobile={isMobile} />
      </nav>
      {/* Botão flutuante (mobile only, menu fechado) */}
      {isMobile && !isOpen && (
        <button
          className="fixed bottom-4 left-4 z-50 bg-sidebar-accent border border-sidebar-border rounded-full shadow-xl p-3 transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir menu"
          tabIndex={0}
          type="button"
        >
          <Menu className="w-7 h-7 text-sidebar-primary-foreground" />
        </button>
      )}
      {/* Custom scrollbar para sidebar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0.4em;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(120, 120, 120, 0.13);
          border-radius: 20px;
        }
      `}
      </style>
    </>
  );
}
