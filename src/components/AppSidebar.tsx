
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
import { Home, Users, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const items = [
  {
    label: "Dashboard",
    path: "/",
    icon: Home,
  },
  {
    label: "Usuários",
    path: "/clientes",
    icon: Users,
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
      <div
        className="min-h-screen h-screen flex flex-col"
        style={{
          background: "linear-gradient(180deg, #15294a 90%, #193559 100%)",
          borderRight: "2px solid #193559",
        }}
      >
        <SidebarContent className="flex-1">
          <SidebarGroup>
            <SidebarGroupLabel>
              <span
                className="block text-2xl lg:text-3xl font-extrabold text-white tracking-tight text-center py-6 select-none"
                style={{
                  letterSpacing: "0.04em",
                  color: "#fff",
                  textShadow: "0 2px 12px #1935599c",
                }}
              >
                LAVA CAR
              </span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
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
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <p className="text-xs text-white/80 w-full text-center pb-4" style={{ color: "#E3EFFF" }}>
            © {new Date().getFullYear()} Lava Car
          </p>
        </SidebarFooter>
      </div>
      {/* Estilo extra removido, pois agora os estilos estão fixos inline */}
    </Sidebar>
  );
}
