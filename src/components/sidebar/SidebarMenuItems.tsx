
import React from "react";
import { Home, Users, Settings, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Definição dos itens do menu
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
    label: "Usuários",
    path: "/usuarios",
    icon: User,
  },
  {
    label: "Configurações",
    path: "/configuracoes",
    icon: Settings,
  },
];

export function SidebarMenuItems() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton
            isActive={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            tabIndex={0}
            className={`flex items-center gap-4 px-6 py-3 my-2 rounded-xl ${
              location.pathname === item.path
                ? "bg-[#2754a8] text-white shadow-md"
                : "hover:bg-[#1c355a] hover:text-white transition-colors"
            }`}
            style={{
              background: location.pathname === item.path ? "#2754a8" : "transparent",
              color: "#fff",
            }}
          >
            <item.icon className="w-7 h-7" color="#fff" />
            <span className="text-base lg:text-lg font-semibold">{item.label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
