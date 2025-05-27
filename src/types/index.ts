export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  cpf: string;
  createdAt: Date;
}

export interface Vehicle {
  id: string;
  customerId: string;
  plate: string;
  model: string;
  brand: string;
  color: string;
  type: VehicleType;
  year?: number;
  customerName?: string; // Add this optional property for display purposes
}

export type VehicleType = "car" | "motorcycle" | "truck" | "other";

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // in minutes
  commissionPercentage: number;
  createdAt?: Date; // Add this optional property
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  document: string;
  joinDate: Date;
  salary: number;
  commissionType: "fixed" | "percentage" | "mixed";
}

export interface Appointment {
  id: string;
  customerId: string;
  vehicleId: string;
  serviceIds: string[];
  employeeId: string;
  date: Date;
  status: AppointmentStatus;
  notes?: string;
  totalPrice: number;
}

export type AppointmentStatus = "scheduled" | "in-progress" | "completed" | "cancelled";

export interface ServiceExecution {
  id: string;
  appointmentId: string;
  startTime: Date;
  endTime?: Date;
  employeeId: string;
  status: "pending" | "in-progress" | "completed";
  notes?: string;
}

export interface PaymentTransaction {
  id: string;
  appointmentId: string;
  amount: number;
  method: "cash" | "credit" | "debit" | "pix" | "other";
  status: "pending" | "completed" | "cancelled";
  date: Date;
  notes?: string;
}
