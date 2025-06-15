
import React from "react";
import { cn } from "@/lib/utils";

interface SidebarNavFooterProps {
  isOpen: boolean;
  isMobile: boolean;
}

export function SidebarNavFooter({ isOpen, isMobile }: SidebarNavFooterProps) {
  return (
    <div
      className={cn(
        "mt-auto py-3 px-2 bg-sidebar border-t border-sidebar-border transition-all text-center",
        !(isOpen || isMobile) && "opacity-0 h-0 p-0 overflow-hidden"
      )}
    >
      <p className="text-xs text-sidebar-foreground/70">
        © {new Date().getFullYear()} Lava Car
      </p>
    </div>
  );
}
