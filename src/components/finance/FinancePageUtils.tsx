
import { appointments, employees, services } from "@/data/mockData";
import { AppointmentStatus } from "@/types";
import { startOfDay, subDays, addDays, isBefore, isAfter, isEqual } from "date-fns";

// Get today's date at start of day
export const today = startOfDay(new Date());

// Calculate date ranges based on period
export const getDateRange = (selectedPeriod: string) => {
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

// Filter appointments based on date range and status
export const getFilteredAppointments = (selectedPeriod: string, status?: AppointmentStatus[]) => {
  const { start, end } = getDateRange(selectedPeriod);
  
  return appointments.filter(app => {
    const appDate = startOfDay(app.date);
    const dateInRange = (isAfter(appDate, start) || isEqual(appDate, start)) && isBefore(appDate, end);
    
    if (status) {
      return dateInRange && status.includes(app.status);
    }
    
    return dateInRange;
  });
};

// Calculate total revenue for the period
export const calculateTotalRevenue = (apps = []) => {
  return apps.reduce((total, app) => total + app.totalPrice, 0);
};

// Calculate commission for each employee
export const calculateEmployeeCommissions = (completedAppointments: typeof appointments) => {
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

// Prepare data for the chart
export const prepareChartData = (completedAppointments: typeof appointments) => {
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
