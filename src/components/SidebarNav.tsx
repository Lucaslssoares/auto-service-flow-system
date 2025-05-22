
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart2,
  Users,
  Car,
  Settings,
  Calendar,
  Clipboard,
  DollarSign,
  LogOut
} from "lucide-react";

interface SidebarNavProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function SidebarNav({ isOpen, setIsOpen }: SidebarNavProps) {
  const location = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      icon: BarChart2,
      href: "/",
    },
    {
      title: "Clientes",
      icon: Users,
      href: "/clientes",
    },
    {
      title: "Veículos",
      icon: Car,
      href: "/veiculos",
    },
    {
      title: "Serviços",
      icon: Settings,
      href: "/servicos",
    },
    {
      title: "Funcionários",
      icon: Users,
      href: "/funcionarios",
    },
    {
      title: "Agendamentos",
      icon: Calendar,
      href: "/agendamentos",
    },
    {
      title: "Execução",
      icon: Clipboard,
      href: "/execucao",
    },
    {
      title: "Financeiro",
      icon: DollarSign,
      href: "/financeiro",
    },
  ];

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
          className={`flex items-center w-full px-4 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-md transition-colors`}
        >
          <LogOut className={`h-5 w-5 ${isOpen ? "mr-3" : "mx-auto"}`} />
          <span className={isOpen ? "" : "hidden"}>Sair</span>
        </button>
      </div>
    </div>
  );
}
