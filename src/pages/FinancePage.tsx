
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { appointments, employees, getCustomerName, getEmployeeName, services } from "@/data/mockData";
import { format, startOfDay, subDays, addDays, isBefore, isAfter, isEqual } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { AppointmentStatus } from "@/types";
import { DollarSign } from "lucide-react";

const FinancePage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  
  // Get today's date at start of day
  const today = startOfDay(new Date());
  
  // Calculate date ranges based on period
  const getDateRange = () => {
    switch (selectedPeriod) {
      case "today":
        return { start: today, end: addDays(today, 1) };
      case "yesterday":
        return { start: subDays(today, 1), end: today };
      case "week":
        return { start: subDays(today, 7), end: addDays(today, 1) };
      case "month":
        return { start: subDays(today, 30), end: addDays(today, 1) };
      default:
        return { start: today, end: addDays(today, 1) };
    }
  };
  
  const { start, end } = getDateRange();
  
  // Filter appointments based on date range and status
  const getFilteredAppointments = (status?: AppointmentStatus[]) => {
    return appointments.filter(app => {
      const appDate = startOfDay(app.date);
      const dateInRange = (isAfter(appDate, start) || isEqual(appDate, start)) && isBefore(appDate, end);
      
      if (status) {
        return dateInRange && status.includes(app.status);
      }
      
      return dateInRange;
    });
  };
  
  const completedAppointments = getFilteredAppointments(["completed"]);
  
  // Calculate total revenue for the period
  const calculateTotalRevenue = (apps = completedAppointments) => {
    return apps.reduce((total, app) => total + app.totalPrice, 0);
  };
  
  // Calculate commission for each employee
  const calculateEmployeeCommissions = () => {
    const commissions: Record<string, number> = {};
    
    completedAppointments.forEach(app => {
      const employee = employees.find(e => e.id === app.employeeId);
      if (!employee) return;
      
      // Get services for this appointment
      const appServices = app.serviceIds.map(
        serviceId => services.find(s => s.id === serviceId)
      ).filter(Boolean);
      
      // Calculate commission based on employee's commission type and services
      let commission = 0;
      
      appServices.forEach(service => {
        if (!service) return;
        
        if (employee.commissionType === "percentage" || employee.commissionType === "mixed") {
          commission += (service.price * service.commissionPercentage) / 100;
        }
      });
      
      // Add to employee's commission
      if (commissions[employee.id]) {
        commissions[employee.id] += commission;
      } else {
        commissions[employee.id] = commission;
      }
    });
    
    return commissions;
  };
  
  const employeeCommissions = calculateEmployeeCommissions();
  
  // Prepare data for the chart
  const prepareChartData = () => {
    const serviceData: Record<string, number> = {};
    
    completedAppointments.forEach(app => {
      app.serviceIds.forEach(serviceId => {
        const service = services.find(s => s.id === serviceId);
        if (!service) return;
        
        if (serviceData[service.name]) {
          serviceData[service.name] += service.price;
        } else {
          serviceData[service.name] = service.price;
        }
      });
    });
    
    return Object.keys(serviceData).map(name => ({
      name,
      valor: serviceData[name]
    }));
  };
  
  const chartData = prepareChartData();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Financeiro</h2>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="commissions">Comissões</TabsTrigger>
        </TabsList>
        
        <div className="flex items-center justify-end mb-4">
          <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <TabsList>
              <TabsTrigger value="today">Hoje</TabsTrigger>
              <TabsTrigger value="yesterday">Ontem</TabsTrigger>
              <TabsTrigger value="week">Últimos 7 dias</TabsTrigger>
              <TabsTrigger value="month">Últimos 30 dias</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Faturamento Total
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {calculateTotalRevenue().toFixed(2).replace(".", ",")}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {completedAppointments.length} serviços concluídos
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ticket Médio
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {completedAppointments.length > 0
                    ? `R$ ${(calculateTotalRevenue() / completedAppointments.length).toFixed(2).replace(".", ",")}`
                    : "R$ 0,00"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Valor médio por atendimento
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Comissões
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {Object.values(employeeCommissions).reduce((a, b) => a + b, 0).toFixed(2).replace(".", ",")}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total de comissões a pagar
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Lucro Estimado
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {(calculateTotalRevenue() - Object.values(employeeCommissions).reduce((a, b) => a + b, 0)).toFixed(2).replace(".", ",")}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Receita - Comissões
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Receita por Serviço</CardTitle>
              <CardDescription>
                Distribuição de receita por tipo de serviço
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 30,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="valor" name="Valor (R$)" fill="#1e40af" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Sem dados para o período selecionado</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Serviços Recentes</CardTitle>
              <CardDescription>
                Últimos serviços concluídos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {completedAppointments.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  Nenhum serviço concluído no período selecionado
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedAppointments
                      .sort((a, b) => b.date.getTime() - a.date.getTime())
                      .slice(0, 5)
                      .map(app => (
                        <TableRow key={app.id}>
                          <TableCell>{format(app.date, "dd/MM/yyyy HH:mm")}</TableCell>
                          <TableCell>{getCustomerName(app.customerId)}</TableCell>
                          <TableCell>{getEmployeeName(app.employeeId)}</TableCell>
                          <TableCell className="text-right font-medium">
                            R$ {app.totalPrice.toFixed(2).replace(".", ",")}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Serviços</CardTitle>
              <CardDescription>
                Desempenho dos serviços no período
              </CardDescription>
            </CardHeader>
            <CardContent>
              {completedAppointments.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  Nenhum serviço concluído no período selecionado
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Serviço</TableHead>
                      <TableHead className="text-right">Quantidade</TableHead>
                      <TableHead className="text-right">Valor Total</TableHead>
                      <TableHead className="text-right">% da Receita</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(() => {
                      // Count service occurrences and revenue
                      const serviceCounts: Record<string, { count: number; revenue: number }> = {};
                      const totalRevenue = calculateTotalRevenue();
                      
                      completedAppointments.forEach(app => {
                        app.serviceIds.forEach(serviceId => {
                          const service = services.find(s => s.id === serviceId);
                          if (!service) return;
                          
                          if (serviceCounts[service.id]) {
                            serviceCounts[service.id].count += 1;
                            serviceCounts[service.id].revenue += service.price;
                          } else {
                            serviceCounts[service.id] = {
                              count: 1,
                              revenue: service.price,
                            };
                          }
                        });
                      });
                      
                      return Object.keys(serviceCounts)
                        .map(serviceId => {
                          const service = services.find(s => s.id === serviceId);
                          if (!service) return null;
                          
                          const data = serviceCounts[serviceId];
                          const percentRevenue = (data.revenue / totalRevenue) * 100;
                          
                          return {
                            id: serviceId,
                            name: service.name,
                            count: data.count,
                            revenue: data.revenue,
                            percentRevenue,
                          };
                        })
                        .filter(Boolean)
                        .sort((a, b) => b!.revenue - a!.revenue)
                        .map(item => (
                          <TableRow key={item!.id}>
                            <TableCell>{item!.name}</TableCell>
                            <TableCell className="text-right">{item!.count}</TableCell>
                            <TableCell className="text-right">
                              R$ {item!.revenue.toFixed(2).replace(".", ",")}
                            </TableCell>
                            <TableCell className="text-right">
                              {item!.percentRevenue.toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ));
                    })()}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comissões por Funcionário</CardTitle>
              <CardDescription>
                Valores a serem pagos a cada funcionário
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(employeeCommissions).length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  Nenhuma comissão no período selecionado
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Funcionário</TableHead>
                      <TableHead className="text-right">Serviços Realizados</TableHead>
                      <TableHead className="text-right">Comissão</TableHead>
                      <TableHead className="text-right">Salário Base</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.keys(employeeCommissions).map(employeeId => {
                      const employee = employees.find(e => e.id === employeeId);
                      if (!employee) return null;
                      
                      // Count services by this employee
                      const servicesCount = completedAppointments
                        .filter(app => app.employeeId === employeeId)
                        .reduce((count, app) => count + app.serviceIds.length, 0);
                      
                      const commission = employeeCommissions[employeeId];
                      const totalPay = employee.salary + commission;
                      
                      return (
                        <TableRow key={employeeId}>
                          <TableCell>{employee.name}</TableCell>
                          <TableCell className="text-right">{servicesCount}</TableCell>
                          <TableCell className="text-right">
                            R$ {commission.toFixed(2).replace(".", ",")}
                          </TableCell>
                          <TableCell className="text-right">
                            R$ {employee.salary.toFixed(2).replace(".", ",")}
                          </TableCell>
                          <TableCell className="font-medium text-right">
                            R$ {totalPay.toFixed(2).replace(".", ",")}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter className="justify-end">
              <Button>Gerar Relatório de Comissões</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancePage;
