
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
} from "lucide-react";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface SidebarNavProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function SidebarNav({ isOpen, setIsOpen }: SidebarNavProps) {
  useSecureAuth();
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <nav
      className={cn(
        "bg-white shadow-md h-full fixed md:static z-40 left-0 top-0 transition-all duration-200",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-bold text-lg">Lava Car</span>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <ul className="flex-1 space-y-2 mt-6">
          <li>
            <a
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded hover:bg-gray-100 transition"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("/");
              }}
            >
              <Home className="w-5 h-5" />
              <span className="ml-2">Dashboard</span>
            </a>
          </li>
          <li>
            <a
              href="/clientes"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded hover:bg-gray-100 transition"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("/clientes");
              }}
            >
              <Users className="w-5 h-5" />
              <span className="ml-2">Clientes</span>
            </a>
          </li>
          <li>
            <a
              href="/veiculos"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded hover:bg-gray-100 transition"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("/veiculos");
              }}
            >
              <Car className="w-5 h-5" />
              <span className="ml-2">Veículos</span>
            </a>
          </li>
          <li>
            <a
              href="/servicos"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded hover:bg-gray-100 transition"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("/servicos");
              }}
            >
              <Wrench className="w-5 h-5" />
              <span className="ml-2">Serviços</span>
            </a>
          </li>
          <li>
            <a
              href="/funcionarios"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded hover:bg-gray-100 transition"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("/funcionarios");
              }}
            >
              <UserCog className="w-5 h-5" />
              <span className="ml-2">Funcionários</span>
            </a>
          </li>
          <li>
            <a
              href="/agendamentos"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded hover:bg-gray-100 transition"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("/agendamentos");
              }}
            >
              <Calendar className="w-5 h-5" />
              <span className="ml-2">Agendamentos</span>
            </a>
          </li>
          <li>
            <a
              href="/execucao"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded hover:bg-gray-100 transition"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("/execucao");
              }}
            >
              <PlayCircle className="w-5 h-5" />
              <span className="ml-2">Execução</span>
            </a>
          </li>
          <li>
            <a
              href="/financeiro"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded hover:bg-gray-100 transition"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("/financeiro");
              }}
            >
              <DollarSign className="w-5 h-5" />
              <span className="ml-2">Financeiro</span>
            </a>
          </li>
          <li>
            <a
              href="/configuracoes"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded hover:bg-gray-100 transition"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("/configuracoes");
              }}
            >
              <Settings className="w-5 h-5" />
              <span className="ml-2">Configurações</span>
            </a>
          </li>
        </ul>
        <div className="p-4">
          <p className="text-center text-gray-500 text-xs">
            © {new Date().getFullYear()} Lava Car
          </p>
        </div>
      </div>
    </nav>
  );
}
