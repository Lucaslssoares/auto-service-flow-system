
import React from "react";
import { SidebarFooter as ShadcnSidebarFooter } from "@/components/ui/sidebar";

export function SidebarFooter() {
  return (
    <ShadcnSidebarFooter>
      <p className="text-xs text-white/80 w-full text-center pb-4" style={{ color: "#E3EFFF" }}>
        © {new Date().getFullYear()} Lava Car
      </p>
    </ShadcnSidebarFooter>
  );
}
