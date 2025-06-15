
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
  const sidebarWidth = isOpen ? "w-64" : isMobile ? "w-0" : "w-16";
  // Show overlay on mobile when sidebar open
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
          className="fixed inset-0 z-40 bg-black/20 animate-fade-in"
          onClick={() => setIsOpen(false)}
          aria-label="Fechar menu"
        />
      )}
      <nav
        className={cn(
          "bg-white shadow-md h-full fixed z-50 top-0 left-0 transition-all duration-200 flex flex-col",
          sidebarWidth,
          isMobile
            ? [
                "h-screen",
                "transition-all",
                "duration-300",
                "overflow-hidden",
                isOpen
                  ? "left-0"
                  : "-left-64", // esconde fora da tela se fechado no mobile
                "ease-in-out",
                "border-r"
              ]
            : "border-r"
        )}
        aria-label="Sidebar"
        style={{
          minWidth: isMobile && !isOpen ? 0 : undefined,
          width: isOpen || !isMobile ? undefined : 64,
        }}
      >
        <div
          className={cn(
            "flex items-center",
            isMobile ? "px-4 py-4 h-16 min-h-16" : "px-2 py-4 h-16 min-h-16"
          )}
        >
          {/* Logo ou Nome */}
          <span
            className={cn(
              "font-bold text-lg tracking-tight text-gray-900 flex-1",
              !isOpen && !isMobile ? "hidden" : "block text-center"
            )}
          >
            Lava Car
          </span>
          {/* Botão fechar/hamburguer */}
          {isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="ml-2 rounded focus:outline-none focus:ring-2 focus:ring-primary p-1"
              aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          )}
        </div>
        {/* Menu */}
        <ul
          className={cn(
            "flex-1 mt-4 space-y-1",
            isOpen || isMobile ? "pl-0 pr-2" : "pl-0 pr-0"
          )}
        >
          {menuItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.path}
                className={cn(
                  "group flex items-center gap-2 px-4 py-2 rounded transition-colors cursor-pointer select-none whitespace-nowrap",
                  "text-gray-700 hover:bg-gray-100",
                  !isOpen && !isMobile ? "justify-center px-2" : ""
                )}
                tabIndex={0}
                onClick={e => {
                  e.preventDefault();
                  navigateTo(item.path);
                }}
              >
                <item.icon className="w-5 h-5" />
                {(isOpen || isMobile) && (
                  <span className="ml-2 truncate">{item.label}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
        {/* Footer only if expanded */}
        <div
          className={cn(
            "w-full mt-auto py-2",
            (isOpen || isMobile) ? "block" : "hidden"
          )}
        >
          <p className="text-center text-gray-400 text-xs">
            © {new Date().getFullYear()} Lava Car
          </p>
        </div>
      </nav>
      {/* Show floating menu button on mobile if closed */}
      {isMobile && !isOpen && (
        <button
          className="fixed bottom-4 left-4 z-50 bg-white border rounded-full shadow-lg p-2 transition hover:scale-105 focus:outline-none"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}
    </>
  );
}
