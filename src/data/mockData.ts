
import { 
  Customer, 
  Vehicle, 
  Service, 
  Employee, 
  Appointment, 
  ServiceExecution, 
  PaymentTransaction 
} from "@/types";

// Mock Customers
export const customers: Customer[] = [
  {
    id: "1",
    name: "João Silva",
    phone: "(11) 99999-1234",
    email: "joao.silva@email.com",
    cpf: "123.456.789-00",
    createdAt: new Date("2023-01-15")
  },
  {
    id: "2",
    name: "Maria Oliveira",
    phone: "(11) 98765-4321",
    email: "maria.oliveira@email.com",
    cpf: "987.654.321-00",
    createdAt: new Date("2023-02-20")
  },
  {
    id: "3",
    name: "Carlos Santos",
    phone: "(11) 91234-5678",
    email: "carlos.santos@email.com",
    cpf: "456.789.123-00",
    createdAt: new Date("2023-03-10")
  },
  {
    id: "4",
    name: "Ana Pereira",
    phone: "(11) 98877-6655",
    email: "ana.pereira@email.com",
    cpf: "654.321.987-00",
    createdAt: new Date("2023-04-05")
  },
];

// Mock Vehicles
export const vehicles: Vehicle[] = [
  {
    id: "1",
    customerId: "1",
    plate: "ABC-1234",
    model: "Gol",
    brand: "Volkswagen",
    color: "Prata",
    type: "car",
    year: 2019
  },
  {
    id: "2",
    customerId: "1",
    plate: "DEF-5678",
    model: "Onix",
    brand: "Chevrolet",
    color: "Branco",
    type: "car",
    year: 2021
  },
  {
    id: "3",
    customerId: "2",
    plate: "GHI-9012",
    model: "CG 160",
    brand: "Honda",
    color: "Vermelho",
    type: "motorcycle",
    year: 2020
  },
  {
    id: "4",
    customerId: "3",
    plate: "JKL-3456",
    model: "Hilux",
    brand: "Toyota",
    color: "Preto",
    type: "car",
    year: 2022
  },
  {
    id: "5",
    customerId: "4",
    plate: "MNO-7890",
    model: "Civic",
    brand: "Honda",
    color: "Azul",
    type: "car",
    year: 2023
  }
];

// Mock Services
export const services: Service[] = [
  {
    id: "1",
    name: "Lavagem Simples",
    description: "Lavagem externa do veículo",
    price: 40.00,
    duration: 30,
    commissionPercentage: 30
  },
  {
    id: "2",
    name: "Lavagem Completa",
    description: "Lavagem externa e interna do veículo",
    price: 80.00,
    duration: 60,
    commissionPercentage: 30
  },
  {
    id: "3",
    name: "Polimento",
    description: "Polimento completo da pintura",
    price: 150.00,
    duration: 120,
    commissionPercentage: 40
  },
  {
    id: "4",
    name: "Higienização Interna",
    description: "Limpeza profunda dos estofados e carpetes",
    price: 200.00,
    duration: 180,
    commissionPercentage: 35
  },
  {
    id: "5",
    name: "Lavagem Motor",
    description: "Limpeza do compartimento do motor",
    price: 70.00,
    duration: 45,
    commissionPercentage: 25
  }
];

// Mock Employees
export const employees: Employee[] = [
  {
    id: "1",
    name: "Pedro Almeida",
    role: "Lavador",
    phone: "(11) 97777-8888",
    email: "pedro.almeida@lavacar.com",
    document: "111.222.333-44",
    joinDate: new Date("2022-06-01"),
    salary: 1400.00,
    commissionType: "percentage"
  },
  {
    id: "2",
    name: "Luiz Ferreira",
    role: "Polidor",
    phone: "(11) 96666-5555",
    email: "luiz.ferreira@lavacar.com",
    document: "222.333.444-55",
    joinDate: new Date("2022-07-15"),
    salary: 1600.00,
    commissionType: "percentage"
  },
  {
    id: "3",
    name: "Mariana Costa",
    role: "Atendente",
    phone: "(11) 95555-4444",
    email: "mariana.costa@lavacar.com",
    document: "333.444.555-66",
    joinDate: new Date("2022-05-10"),
    salary: 1800.00,
    commissionType: "fixed"
  },
  {
    id: "4",
    name: "Roberto Dias",
    role: "Gerente",
    phone: "(11) 94444-3333",
    email: "roberto.dias@lavacar.com",
    document: "444.555.666-77",
    joinDate: new Date("2021-10-01"),
    salary: 3000.00,
    commissionType: "mixed"
  }
];

// Mock Appointments
export const appointments: Appointment[] = [
  {
    id: "1",
    customerId: "1",
    vehicleId: "1",
    serviceIds: ["1", "5"],
    employeeId: "1",
    date: new Date("2025-05-22T10:00:00"),
    status: "completed",
    totalPrice: 110.00
  },
  {
    id: "2",
    customerId: "2",
    vehicleId: "3",
    serviceIds: ["1"],
    employeeId: "1",
    date: new Date("2025-05-22T11:30:00"),
    status: "completed",
    totalPrice: 40.00
  },
  {
    id: "3",
    customerId: "3",
    vehicleId: "4",
    serviceIds: ["2", "3"],
    employeeId: "2",
    date: new Date("2025-05-22T14:00:00"),
    status: "in-progress",
    totalPrice: 230.00
  },
  {
    id: "4",
    customerId: "4",
    vehicleId: "5",
    serviceIds: ["2", "4"],
    employeeId: "2",
    date: new Date("2025-05-22T16:00:00"),
    status: "scheduled",
    totalPrice: 280.00
  },
  {
    id: "5",
    customerId: "1",
    vehicleId: "2",
    serviceIds: ["1"],
    employeeId: "1",
    date: new Date("2025-05-23T09:30:00"),
    status: "scheduled",
    totalPrice: 40.00
  }
];

// Helper function to get customer name by ID
export const getCustomerName = (id: string): string => {
  const customer = customers.find(c => c.id === id);
  return customer ? customer.name : "Cliente não encontrado";
};

// Helper function to get vehicle info by ID
export const getVehicleInfo = (id: string): string => {
  const vehicle = vehicles.find(v => v.id === id);
  return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.plate})` : "Veículo não encontrado";
};

// Helper function to get service name by ID
export const getServiceName = (id: string): string => {
  const service = services.find(s => s.id === id);
  return service ? service.name : "Serviço não encontrado";
};

// Helper function to get employee name by ID
export const getEmployeeName = (id: string): string => {
  const employee = employees.find(e => e.id === id);
  return employee ? employee.name : "Funcionário não encontrado";
};

// Helper function to get multiple services by IDs
export const getServicesByIds = (ids: string[]): Service[] => {
  return services.filter(service => ids.includes(service.id));
};
