
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
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span
              className="block text-2xl lg:text-3xl font-extrabold text-sidebar-primary-foreground tracking-tight text-center py-6 select-none"
              style={{
                letterSpacing: "0.04em",
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
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                        : "hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground transition-colors"
                    }`}
                  >
                    <item.icon className="w-7 h-7" />
                    <span className="text-base lg:text-lg font-semibold">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <p className="text-xs text-sidebar-foreground/70 w-full text-center pb-4">
          © {new Date().getFullYear()} Lava Car
        </p>
      </SidebarFooter>
      {/* Estilos extras para deixar o fundo mais escuro e elegante */}
      <style>{`
        .ui-sidebar {
          background: linear-gradient(180deg, hsl(var(--sidebar-background)) 90%, #193559 100%);
          border-right: 2px solid hsl(var(--sidebar-border));
        }
        @media (max-width: 640px) {
          .ui-sidebar {
            min-width: 0 !important;
            width: 70vw !important;
            max-width: 20rem;
          }
        }
      `}</style>
    </Sidebar>
  );
}

