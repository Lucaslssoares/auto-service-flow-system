
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Car, 
  Wrench, 
  UserCheck, 
  Calendar, 
  Play, 
  DollarSign,
  ArrowRight
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Lava Car System</CardTitle>
            <CardDescription>
              Sistema completo de gerenciamento para lava-jatos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/auth">
              <Button className="w-full">
                Entrar no Sistema
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const modules = [
    {
      title: "Clientes",
      description: "Gerenciar clientes e seus dados",
      icon: Users,
      path: "/clientes",
      color: "bg-blue-500"
    },
    {
      title: "Veículos",
      description: "Cadastro e controle de veículos",
      icon: Car,
      path: "/veiculos",
      color: "bg-green-500"
    },
    {
      title: "Serviços",
      description: "Catálogo de serviços oferecidos",
      icon: Wrench,
      path: "/servicos",
      color: "bg-purple-500"
    },
    {
      title: "Funcionários",
      description: "Equipe e trabalho colaborativo",
      icon: UserCheck,
      path: "/funcionarios",
      color: "bg-orange-500"
    },
    {
      title: "Agendamentos",
      description: "Controle de agendamentos",
      icon: Calendar,
      path: "/agendamentos",
      color: "bg-red-500"
    },
    {
      title: "Execução",
      description: "Acompanhar serviços em andamento",
      icon: Play,
      path: "/execucao",
      color: "bg-indigo-500"
    },
    {
      title: "Financeiro",
      description: "Relatórios e divisão de lucros",
      icon: DollarSign,
      path: "/financeiro",
      color: "bg-emerald-500"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Bem-vindo ao Lava Car System
        </h1>
        <p className="text-lg text-muted-foreground">
          Olá, {user.email}! Escolha um módulo para começar
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Link key={module.path} to={module.path}>
            <Card className="h-full transition-all hover:shadow-lg hover:scale-105 cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${module.color} text-white`}>
                    <module.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  {module.description}
                </CardDescription>
                <div className="flex items-center text-primary hover:text-primary/80">
                  <span className="text-sm font-medium">Acessar módulo</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>🚀 Novidades - Trabalho em Equipe</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Agora você pode configurar equipes para trabalhar em serviços e dividir automaticamente os lucros entre os funcionários. 
            Acesse a página de <strong>Execução</strong> para gerenciar as equipes e acompanhar o progresso dos serviços.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
