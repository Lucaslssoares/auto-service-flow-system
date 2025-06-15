
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
} from "lucide-react";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

// Itens do menu
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
  const isMobile = useIsMobile();

  // Sidebar width classes
  const sidebarWidth =
    isOpen || isMobile ? "w-60 sm:w-72" : "w-16";
  const showOverlay = isMobile && isOpen;

  const navigateTo = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {showOverlay && (
        <div
          className="fixed inset-0 z-30 bg-black/30 animate-fade-in"
          onClick={() => setIsOpen(false)}
          aria-label="Fechar menu"
        />
      )}
      {/* Sidebar */}
      <nav
        className={cn(
          "h-full fixed top-0 left-0 z-40 flex flex-col bg-sidebar-DEFAULT border-r border-sidebar-border shadow-lg transition-all duration-300 ease-in-out",
          sidebarWidth,
          isMobile
            ? [
                "h-screen",
                "overflow-hidden",
                isOpen
                  ? "left-0 animate-slide-in-right"
                  : "-left-72", // hidden slide out
                "transition-all duration-300 ease-in-out",
              ]
            : "relative", // <- Apenas para desktop: relative impede sobreposição!
          !isMobile && "z-10" // desktop sidebar atrás do header
        )}
        aria-label="Sidebar"
        style={{
          minWidth: isMobile && !isOpen ? 0 : undefined,
          width: isOpen || !isMobile ? undefined : 64,
        }}
      >
        {/* Top section: logo/nome + botão de menu */}
        <div
          className={cn(
            "flex items-center gap-2 h-16 px-3 bg-sidebar-accent relative"
          )}
        >
          {/* Collapse/expand button - SEMPRE no desktop, substitui título quando sidebar está fechada */}
          {!isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "mr-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
                "p-2 bg-sidebar-accent hover:bg-sidebar-primary"
              )}
              aria-label={isOpen ? "Reduzir menu" : "Expandir menu"}
            >
              {isOpen ? (
                <ChevronLeft className="w-6 h-6 text-sidebar-primary-foreground" />
              ) : (
                <ChevronRight className="w-6 h-6 text-sidebar-primary-foreground" />
              )}
            </button>
          )}

          {/* Título (só aparece se aberto OU mobile) */}
          <span
            className={cn(
              "font-bold text-lg tracking-tight text-sidebar-primary-foreground flex-1 transition-all duration-300",
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
                "ml-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
                "p-2 bg-sidebar-accent hover:bg-sidebar-primary"
              )}
              aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-sidebar-primary-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-sidebar-primary-foreground" />
              )}
            </button>
          )}
        </div>
        {/* Menu */}
        <ul
          className={cn(
            "flex-1 mt-4 space-y-1 overflow-y-auto custom-scrollbar",
            isOpen || isMobile ? "pl-2 pr-2" : "pl-1 pr-1"
          )}
        >
          {menuItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.path}
                className={cn(
                  "group flex items-center gap-3 py-2 px-3 rounded-md transition-all cursor-pointer select-none whitespace-nowrap font-medium text-sidebar-foreground",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:bg-sidebar-accent focus-visible:text-sidebar-accent-foreground",
                  "active:bg-sidebar-accent/80",
                  !isOpen && !isMobile
                    ? "justify-center px-2 py-3"
                    : "px-3",
                  "duration-200"
                )}
                tabIndex={0}
                onClick={e => {
                  e.preventDefault();
                  navigateTo(item.path);
                }}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {(isOpen || isMobile) && (
                  <span className="ml-1 truncate">{item.label}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
        {/* Footer: sempre visível no mobile / só expandido no desktop */}
        <div
          className={cn(
            "mt-auto py-3 px-2 bg-sidebar border-t border-sidebar-border transition-all",
            !(isOpen || isMobile) && "opacity-0 h-0 p-0 overflow-hidden"
          )}
        >
          <p className="text-center text-xs text-sidebar-foreground/70">
            © {new Date().getFullYear()} Lava Car
          </p>
        </div>
      </nav>
      {/* Floating menu button (mobile only, when menu is closed) */}
      {isMobile && !isOpen && (
        <button
          className="fixed bottom-4 left-4 z-50 bg-sidebar-accent border border-sidebar-border rounded-full shadow-xl p-3 transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu className="w-7 h-7 text-sidebar-primary-foreground" />
        </button>
      )}
      {/* Custom scrollbar for sidebar (small utility) */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0.4em;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(120, 120, 120, 0.13);
          border-radius: 20px;
        }
      `}</style>
    </>
  );
}
