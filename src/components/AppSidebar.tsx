
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { SidebarLogo } from "@/components/sidebar/SidebarLogo";
import { SidebarMenuItems } from "@/components/sidebar/SidebarMenuItems";
import { SidebarFooter } from "@/components/sidebar/SidebarFooter";

export function AppSidebar() {
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
              <SidebarLogo />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenuItems />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </div>
    </Sidebar>
  );
}
