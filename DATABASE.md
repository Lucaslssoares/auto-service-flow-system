# 🗄️ Documentação do Banco de Dados

Este documento descreve em detalhes a estrutura do banco de dados do Lava Car SaaS.

## 📊 Visão Geral

O sistema utiliza **PostgreSQL** via Supabase com as seguintes características:

- ✅ **Row Level Security (RLS)** em todas as tabelas
- ✅ **Triggers automáticos** para auditoria
- ✅ **Funções customizadas** para lógica de negócio
- ✅ **Índices otimizados** para performance
- ✅ **Sistema de permissões** baseado em roles

## 🔐 Sistema de Autenticação e Roles

### auth.users (Gerenciada pelo Supabase)

Tabela de autenticação gerenciada automaticamente pelo Supabase.

```sql
-- NUNCA insira diretamente nesta tabela
-- Use Supabase Auth API
```

### profiles

Perfil estendido dos usuários autenticados.

```sql
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS Policies
-- Usuários podem ver apenas seu próprio perfil
CREATE POLICY "users_view_own_profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "users_update_own_profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
```

**Campos:**
- `id` - UUID do usuário (referência auth.users)
- `name` - Nome completo
- `email` - Email do usuário
- `role` - Role padrão (deprecated, usar user_roles)
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### user_roles

Sistema de permissões baseado em roles múltiplos.

```sql
-- Enum de roles
CREATE TYPE public.app_role AS ENUM (
  'admin',        -- Acesso total ao sistema
  'manager',      -- Gerente (acesso a relatórios)
  'operator',     -- Operador (execução de serviços)
  'receptionist'  -- Recepcionista (agendamentos)
);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Função para verificar role (SECURITY DEFINER)
CREATE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

**Campos:**
- `id` - UUID único
- `user_id` - Referência ao usuário
- `role` - Role do usuário (enum)
- `created_at` - Data de atribuição

**Roles Disponíveis:**
- **admin** - Acesso completo ao sistema
- **manager** - Acesso a relatórios financeiros e gestão
- **operator** - Execução de serviços
- **receptionist** - Gestão de agendamentos

## 👥 Gestão de Clientes

### customers

Dados dos clientes do lava-car.

```sql
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  cpf text UNIQUE,
  phone text,
  email text,
  address text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_cpf ON customers(cpf);
CREATE INDEX idx_customers_phone ON customers(phone);

-- RLS Policies
CREATE POLICY "authenticated_view_customers"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "authenticated_insert_customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

**Campos:**
- `id` - UUID único
- `user_id` - Usuário que cadastrou
- `name` - Nome do cliente
- `cpf` - CPF (único, opcional)
- `phone` - Telefone
- `email` - Email
- `address` - Endereço
- `notes` - Observações
- `created_at` - Data de cadastro
- `updated_at` - Última atualização

### vehicles

Veículos dos clientes.

```sql
CREATE TABLE public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  plate text NOT NULL,
  model text NOT NULL,
  brand text,
  year integer,
  color text,
  type text, -- 'car', 'motorcycle', 'truck', 'suv'
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(plate)
);

-- Índices
CREATE INDEX idx_vehicles_customer_id ON vehicles(customer_id);
CREATE INDEX idx_vehicles_plate ON vehicles(plate);
```

**Campos:**
- `id` - UUID único
- `customer_id` - Referência ao cliente
- `plate` - Placa do veículo (única)
- `model` - Modelo
- `brand` - Marca
- `year` - Ano
- `color` - Cor
- `type` - Tipo de veículo
- `notes` - Observações

## 🛠️ Catálogo de Serviços

### services

Serviços oferecidos pelo lava-car.

```sql
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  duration integer NOT NULL, -- minutos
  category text,
  active boolean DEFAULT true,
  commission_type text, -- 'fixed', 'percentage', 'mixed'
  commission_value decimal(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices
CREATE INDEX idx_services_active ON services(active);
CREATE INDEX idx_services_category ON services(category);
```

**Campos:**
- `id` - UUID único
- `name` - Nome do serviço
- `description` - Descrição detalhada
- `price` - Preço do serviço
- `duration` - Duração em minutos
- `category` - Categoria do serviço
- `active` - Se está ativo
- `commission_type` - Tipo de comissão
- `commission_value` - Valor da comissão
- `created_at` - Data de criação
- `updated_at` - Última atualização

## 👨‍💼 Gestão de Funcionários

### employees

Funcionários da empresa.

```sql
CREATE TABLE public.employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cpf text UNIQUE,
  phone text,
  email text,
  role text NOT NULL, -- 'operator', 'manager', 'supervisor'
  hire_date date,
  active boolean DEFAULT true,
  commission_type text, -- 'fixed', 'percentage', 'mixed'
  commission_value decimal(10,2),
  salary decimal(10,2),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices
CREATE INDEX idx_employees_active ON employees(active);
CREATE INDEX idx_employees_cpf ON employees(cpf);
```

**Campos:**
- `id` - UUID único
- `name` - Nome do funcionário
- `cpf` - CPF (único)
- `phone` - Telefone
- `email` - Email
- `role` - Cargo
- `hire_date` - Data de contratação
- `active` - Se está ativo
- `commission_type` - Tipo de comissão
- `commission_value` - Valor da comissão
- `salary` - Salário base
- `notes` - Observações

## 📅 Sistema de Agendamentos

### appointments

Agendamentos de serviços.

```sql
CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) NOT NULL,
  vehicle_id uuid REFERENCES vehicles(id) NOT NULL,
  service_id uuid REFERENCES services(id) NOT NULL,
  scheduled_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'scheduled',
  -- Status: 'scheduled', 'confirmed', 'in_progress', 
  --         'completed', 'cancelled'
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices
CREATE INDEX idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON appointments(status);
```

**Campos:**
- `id` - UUID único
- `customer_id` - Cliente
- `vehicle_id` - Veículo
- `service_id` - Serviço
- `scheduled_at` - Data/hora agendada
- `status` - Status do agendamento
- `notes` - Observações
- `created_by` - Quem criou
- `created_at` - Data de criação
- `updated_at` - Última atualização

## ⚙️ Execução de Serviços

### service_executions

Execução efetiva dos serviços.

```sql
CREATE TABLE public.service_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id) NOT NULL,
  employee_id uuid REFERENCES employees(id) NOT NULL,
  started_at timestamptz,
  completed_at timestamptz,
  status text NOT NULL DEFAULT 'pending',
  -- Status: 'pending', 'in_progress', 'completed', 'cancelled'
  quality_rating integer, -- 1-5
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Índices
CREATE INDEX idx_service_executions_appointment_id 
  ON service_executions(appointment_id);
CREATE INDEX idx_service_executions_employee_id 
  ON service_executions(employee_id);
CREATE INDEX idx_service_executions_status 
  ON service_executions(status);
```

**Campos:**
- `id` - UUID único
- `appointment_id` - Agendamento
- `employee_id` - Funcionário responsável
- `started_at` - Início da execução
- `completed_at` - Término da execução
- `status` - Status da execução
- `quality_rating` - Avaliação de qualidade
- `notes` - Observações

## 💰 Gestão Financeira

### payment_transactions

Transações de pagamento.

```sql
CREATE TABLE public.payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id) NOT NULL,
  amount decimal(10,2) NOT NULL,
  payment_method text NOT NULL,
  -- Methods: 'cash', 'credit_card', 'debit_card', 'pix'
  paid_at timestamptz DEFAULT now(),
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Índices
CREATE INDEX idx_payment_transactions_appointment_id 
  ON payment_transactions(appointment_id);
CREATE INDEX idx_payment_transactions_paid_at 
  ON payment_transactions(paid_at);

-- RLS Policy (apenas admin e manager)
CREATE POLICY "admin_manager_view_transactions"
  ON payment_transactions FOR SELECT
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin') OR 
    has_role(auth.uid(), 'manager')
  );
```

**Campos:**
- `id` - UUID único
- `appointment_id` - Agendamento
- `amount` - Valor pago
- `payment_method` - Método de pagamento
- `paid_at` - Data/hora do pagamento
- `notes` - Observações
- `created_by` - Quem registrou
- `created_at` - Data de registro

### employee_commissions

Comissões dos funcionários.

```sql
CREATE TABLE public.employee_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) NOT NULL,
  service_execution_id uuid REFERENCES service_executions(id),
  appointment_id uuid REFERENCES appointments(id),
  amount decimal(10,2) NOT NULL,
  commission_type text NOT NULL,
  calculated_at timestamptz DEFAULT now(),
  paid boolean DEFAULT false,
  paid_at timestamptz,
  notes text
);

-- Índices
CREATE INDEX idx_employee_commissions_employee_id 
  ON employee_commissions(employee_id);
CREATE INDEX idx_employee_commissions_calculated_at 
  ON employee_commissions(calculated_at);
CREATE INDEX idx_employee_commissions_paid 
  ON employee_commissions(paid);
```

**Campos:**
- `id` - UUID único
- `employee_id` - Funcionário
- `service_execution_id` - Execução do serviço
- `appointment_id` - Agendamento
- `amount` - Valor da comissão
- `commission_type` - Tipo de comissão
- `calculated_at` - Data do cálculo
- `paid` - Se foi pago
- `paid_at` - Data do pagamento
- `notes` - Observações

## 🔒 Políticas de Segurança (RLS)

### Níveis de Acesso

1. **Admin** - Acesso total a todas as tabelas
2. **Manager** - Acesso a relatórios e gestão
3. **Operator** - Acesso a execução de serviços
4. **Receptionist** - Acesso a agendamentos

### Exemplo de Políticas

```sql
-- Admin: acesso total
CREATE POLICY "admin_all_access"
  ON [tabela]
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Manager: apenas leitura em finanças
CREATE POLICY "manager_view_finances"
  ON payment_transactions
  FOR SELECT
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin') OR 
    has_role(auth.uid(), 'manager')
  );

-- Operator: apenas suas execuções
CREATE POLICY "operator_own_executions"
  ON service_executions
  FOR SELECT
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin') OR
    employee_id IN (
      SELECT id FROM employees 
      WHERE user_id = auth.uid()
    )
  );
```

## 🔧 Funções Úteis

### Calcular Comissão

```sql
CREATE FUNCTION calculate_commission(
  _service_id uuid,
  _employee_id uuid
) RETURNS decimal AS $$
DECLARE
  service_commission decimal;
  employee_commission decimal;
  commission_type text;
  final_commission decimal;
BEGIN
  -- Buscar dados do serviço e funcionário
  -- Calcular comissão baseado no tipo
  -- Retornar valor calculado
  RETURN final_commission;
END;
$$ LANGUAGE plpgsql;
```

### Verificar Disponibilidade

```sql
CREATE FUNCTION check_availability(
  _date timestamptz,
  _duration integer
) RETURNS boolean AS $$
BEGIN
  -- Verificar conflitos de agendamento
  -- Retornar true se disponível
  RETURN true;
END;
$$ LANGUAGE plpgsql;
```

## 📊 Views Úteis

### Resumo Financeiro Diário

```sql
CREATE VIEW daily_revenue AS
SELECT 
  DATE(paid_at) as date,
  COUNT(*) as transactions,
  SUM(amount) as total_revenue,
  AVG(amount) as avg_transaction
FROM payment_transactions
GROUP BY DATE(paid_at);
```

### Performance de Funcionários

```sql
CREATE VIEW employee_performance AS
SELECT 
  e.id,
  e.name,
  COUNT(se.id) as total_services,
  SUM(ec.amount) as total_commission,
  AVG(se.quality_rating) as avg_rating
FROM employees e
LEFT JOIN service_executions se ON se.employee_id = e.id
LEFT JOIN employee_commissions ec ON ec.employee_id = e.id
GROUP BY e.id, e.name;
```

## 🔄 Triggers

### Atualizar updated_at Automaticamente

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a todas as tabelas relevantes
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

**📝 Este documento deve ser mantido atualizado conforme o schema evolui.**
