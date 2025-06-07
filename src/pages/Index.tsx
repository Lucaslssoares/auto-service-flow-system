
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Car, Wrench, Clock, TrendingUp } from "lucide-react";
import { SystemStatus } from "@/components/system/SystemStatus";

const Index = () => {
  const stats = [
    {
      title: "Agendamentos Hoje",
      value: "12",
      description: "3 em andamento",
      icon: Calendar,
      trend: "+2 em relação a ontem"
    },
    {
      title: "Clientes Cadastrados",
      value: "248",
      description: "Base de clientes",
      icon: Users,
      trend: "+5 este mês"
    },
    {
      title: "Veículos",
      value: "312",
      description: "Total cadastrado",
      icon: Car,
      trend: "+8 este mês"
    },
    {
      title: "Serviços Ativos",
      value: "15",
      description: "Tipos de serviço",
      icon: Wrench,
      trend: "Catálogo completo"
    },
    {
      title: "Tempo Médio",
      value: "45min",
      description: "Por serviço",
      icon: Clock,
      trend: "Otimizado"
    },
    {
      title: "Receita Mensal",
      value: "R$ 12.5k",
      description: "Este mês",
      icon: TrendingUp,
      trend: "+15% vs mês anterior"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Bem-vindo ao sistema de gestão do seu lava-jato
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {stat.trend}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="lg:w-80">
          <SystemStatus />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
            <CardDescription>
              Agendamentos para as próximas horas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">João Silva</p>
                  <p className="text-sm text-muted-foreground">Lavagem Completa</p>
                </div>
                <div className="text-sm text-muted-foreground">14:30</div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Maria Santos</p>
                  <p className="text-sm text-muted-foreground">Enceramento</p>
                </div>
                <div className="text-sm text-muted-foreground">15:00</div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Pedro Costa</p>
                  <p className="text-sm text-muted-foreground">Lavagem Simples</p>
                </div>
                <div className="text-sm text-muted-foreground">15:30</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Últimas movimentações do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Novo cliente cadastrado</p>
                  <p className="text-xs text-muted-foreground">há 15 minutos</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Agendamento confirmado</p>
                  <p className="text-xs text-muted-foreground">há 30 minutos</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Serviço finalizado</p>
                  <p className="text-xs text-muted-foreground">há 1 hora</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
