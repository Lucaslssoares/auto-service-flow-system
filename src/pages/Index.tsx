
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Car, Wrench, Clock, TrendingUp } from "lucide-react";
import { SystemStatus } from "@/components/system/SystemStatus";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: dashboardData, isLoading, error } = useDashboardData();

  if (error) {
    console.error('Erro ao carregar dados do dashboard:', error);
  }

  const stats = [
    {
      title: "Agendamentos Hoje",
      value: isLoading ? <Skeleton className="h-8 w-12" /> : dashboardData?.todayAppointments?.toString() || "0",
      description: isLoading ? <Skeleton className="h-4 w-20" /> : `${dashboardData?.inProgressAppointments || 0} em andamento`,
      icon: Calendar,
      trend: isLoading ? <Skeleton className="h-3 w-24" /> : "+2 em relação a ontem"
    },
    {
      title: "Clientes Cadastrados",
      value: isLoading ? <Skeleton className="h-8 w-16" /> : dashboardData?.totalCustomers?.toString() || "0",
      description: "Base de clientes",
      icon: Users,
      trend: "+5 este mês"
    },
    {
      title: "Veículos",
      value: isLoading ? <Skeleton className="h-8 w-16" /> : dashboardData?.totalVehicles?.toString() || "0",
      description: "Total cadastrado",
      icon: Car,
      trend: "+8 este mês"
    },
    {
      title: "Serviços Ativos",
      value: isLoading ? <Skeleton className="h-8 w-12" /> : dashboardData?.totalServices?.toString() || "0",
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
      value: isLoading ? <Skeleton className="h-8 w-20" /> : `R$ ${(dashboardData?.monthlyRevenue || 0).toFixed(2)}`,
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
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            ) : dashboardData?.recentAppointments && dashboardData.recentAppointments.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{appointment.customerName}</p>
                      <p className="text-sm text-muted-foreground">{appointment.serviceName}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{appointment.time}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">
                Nenhum agendamento para hoje
              </p>
            )}
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
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : dashboardData?.recentActivities && dashboardData.recentActivities.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">
                Nenhuma atividade recente
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
