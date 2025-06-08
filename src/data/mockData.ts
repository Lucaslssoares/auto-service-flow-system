
// Mock data for development and testing purposes
// This will be replaced with real database queries in production

export interface MockService {
  id: string;
  name: string;
  price: number;
  duration: number;
  commissionPercentage: number;
}

export interface MockEmployee {
  id: string;
  name: string;
  salary: number;
}

export interface MockCustomer {
  id: string;
  name: string;
}

// Mock services data
export const services: MockService[] = [
  {
    id: "1",
    name: "Lavagem Simples",
    price: 25.00,
    duration: 30,
    commissionPercentage: 10
  },
  {
    id: "2", 
    name: "Lavagem Completa",
    price: 45.00,
    duration: 60,
    commissionPercentage: 15
  },
  {
    id: "3",
    name: "Enceramento",
    price: 80.00,
    duration: 90,
    commissionPercentage: 20
  }
];

// Mock employees data
export const employees: MockEmployee[] = [
  {
    id: "1",
    name: "João Silva",
    salary: 2000.00
  },
  {
    id: "2",
    name: "Maria Santos", 
    salary: 2200.00
  }
];

// Mock customers data
export const customers: MockCustomer[] = [
  {
    id: "1",
    name: "Pedro Oliveira"
  },
  {
    id: "2",
    name: "Ana Costa"
  }
];

// Helper functions to get names by ID
export const getCustomerName = (customerId: string): string => {
  const customer = customers.find(c => c.id === customerId);
  return customer?.name || 'Cliente não encontrado';
};

export const getEmployeeName = (employeeId: string): string => {
  const employee = employees.find(e => e.id === employeeId);
  return employee?.name || 'Funcionário não encontrado';
};
