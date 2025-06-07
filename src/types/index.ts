// Representa um cliente do sistema
export interface Customer {
  id: string;           // Identificador único do cliente
  name: string;         // Nome do cliente
  phone: string;        // Telefone do cliente
  email: string;        // E-mail do cliente
  cpf: string;          // CPF do cliente
  createdAt: Date;      // Data de cadastro do cliente
}

// Representa um veículo registrado no sistema
export interface Vehicle {
  id: string;           // Identificador único do veículo
  customerId: string;   // ID do cliente ao qual o veículo pertence
  plate: string;        // Placa do veículo
  model: string;        // Modelo do veículo
  brand: string;        // Marca do veículo
  color: string;        // Cor do veículo
  type: VehicleType;    // Tipo do veículo (ex: carro, moto, caminhão)
  year?: number;        // Ano de fabricação (opcional)
  customerName?: string; // Nome do cliente (opcional, para exibição)
}

// Enumeração dos tipos de veículos possíveis
export type VehicleType = "car" | "motorcycle" | "truck" | "other";

// Representa um serviço oferecido (ex: lavagem, manutenção)
export interface Service {
  id: string;                   // Identificador único do serviço
  name: string;                 // Nome do serviço
  description?: string;         // Descrição do serviço (opcional)
  price: number;                // Preço do serviço
  duration: number;            // Duração estimada em minutos
  commissionPercentage: number; // Comissão (%) sobre o serviço para o funcionário
  createdAt?: Date;            // Data de criação (opcional)
}

// Representa um funcionário do sistema
export interface Employee {
  id: string;                       // Identificador único do funcionário
  name: string;                     // Nome do funcionário
  role: string;                     // Cargo ou função
  phone: string;                    // Telefone
  email: string;                    // E-mail
  document: string;                 // Documento (ex: CPF, RG)
  joinDate: Date;                   // Data de entrada na empresa
  salary: number;                   // Salário base
  commissionType: "fixed" | "percentage" | "mixed"; // Tipo de comissão aplicada
}

// Representa um agendamento de serviço
export interface Appointment {
  id: string;                  // Identificador único do agendamento
  customerId: string;          // ID do cliente
  customerName: string;        // Nome do cliente (usado para exibição)
  vehicleId: string;           // ID do veículo agendado
  vehicleInfo: string;         // Informações do veículo (para exibição)
  services: Service[];         // Lista de serviços incluídos no agendamento
  employeeId: string;          // Funcionário responsável
  date: Date;                  // Data e hora do agendamento
  status: AppointmentStatus;   // Status atual do agendamento
  notes?: string;              // Observações adicionais (opcional)
  totalPrice: number;          // Valor total a ser cobrado pelos serviços
}

// Enumeração dos status possíveis de um agendamento
export type AppointmentStatus = "scheduled" | "in-progress" | "completed" | "cancelled";

// Representa a execução de um serviço dentro de um agendamento
export interface ServiceExecution {
  id: string;                      // Identificador único da execução
  appointmentId: string;          // ID do agendamento relacionado
  startTime: Date;                // Hora de início da execução
  endTime?: Date;                 // Hora de término (opcional)
  employeeId: string;             // Funcionário que executou o serviço
  status: "pending" | "in-progress" | "completed"; // Status da execução
  notes?: string;                 // Observações adicionais (opcional)
}

// Representa uma transação de pagamento associada a um agendamento
export interface PaymentTransaction {
  id: string;                    // Identificador único da transação
  appointmentId: string;        // ID do agendamento relacionado
  amount: number;               // Valor pago
  method: "cash" | "credit" | "debit" | "pix" | "other"; // Método de pagamento
  status: "pending" | "completed" | "cancelled";         // Status da transação
  date: Date;                   // Data do pagamento
  notes?: string;               // Observações adicionais (opcional)
}
