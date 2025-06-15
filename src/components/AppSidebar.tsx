
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
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
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

// Itens essenciais do menu (ajuste conforme necessário)
const items = [
  {
    label: "Dashboard",
    path: "/",
    icon: Home,
  },
  {
    label: "Clientes",
    path: "/clientes",
    icon: Users,
  },
  {
    label: "Veículos",
    path: "/veiculos",
    icon: Car,
  },
  {
    label: "Serviços",
    path: "/servicos",
    icon: Wrench,
  },
  {
    label: "Funcionários",
    path: "/funcionarios",
    icon: UserCog,
  },
  {
    label: "Agendamentos",
    path: "/agendamentos",
    icon: Calendar,
  },
  {
    label: "Execução",
    path: "/execucao",
    icon: PlayCircle,
  },
  {
    label: "Financeiro",
    path: "/financeiro",
    icon: DollarSign,
  },
  {
    label: "Configurações",
    path: "/configuracoes",
    icon: Settings,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span className="font-bold text-lg text-sidebar-primary-foreground tracking-tight">Lava Car</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                    // Deixa responsivo e amigável para teclado
                    tabIndex={0}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <p className="text-xs text-sidebar-foreground/70 w-full text-center">
          © {new Date().getFullYear()} Lava Car
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}

