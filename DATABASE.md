# Banco de Dados — Documentação

Projeto Supabase: `bciuykfoinbgkrsiljpg` (PostgreSQL 17)  
Última atualização: 2026-06-07

---

## Visão geral das tabelas

| Tabela | Descrição | RLS | Linhas (aprox.) |
|---|---|---|---|
| `profiles` | Perfil estendido de cada auth.user | Sim | 1 por usuário |
| `user_roles` | Roles RBAC (N:N user × role) | Não | vários por usuário |
| `user_settings` | Config por usuário (JSONB) | Sim | 1 por usuário |
| `customers` | Clientes do lava-car | Sim | cresce com uso |
| `vehicles` | Veículos dos clientes | Sim | 1-N por cliente |
| `services` | Catálogo de serviços | Sim | estático |
| `employees` | Funcionários | Sim | estático |
| `appointments` | Agendamentos | Sim | cresce com uso |
| `appointment_services` | Serviços por agendamento (N:N) | Sim | N por appointment |
| `appointment_status_history` | Log de mudanças de status | Sim | cresce com uso |
| `service_executions` | Execução efetiva dos serviços | Sim | 1-N por appointment |
| `employee_commissions` | Comissões calculadas | Sim | 1-N por execution |
| `payment_transactions` | Pagamentos | Sim | 1 por appointment |
| `cash_registers` | Sessões de caixa (abertura/fechamento) | Sim | 1 por turno |
| `cash_movements` | Movimentações do caixa | Sim | N por register |
| `business_config` | Config de capacidade (singleton) | Sim | 1 linha |

---

## Tipos e enums

```sql
CREATE TYPE public.app_role AS ENUM (
  'admin',    -- acesso total
  'manager',  -- financeiro + relatórios
  'employee', -- execução de serviços
  'user'      -- cliente interno
);
```

---

## Tabelas de autenticação e perfis

### `profiles`
Criada automaticamente pelo trigger `handle_new_user` ao registrar em `auth.users`.

```sql
CREATE TABLE public.profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      text NOT NULL,
  name       text NOT NULL DEFAULT '',
  role       text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### `user_roles`
Roles múltiplos por usuário. Admins têm todos os 4 roles.

```sql
CREATE TABLE public.user_roles (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       public.app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);
```

### `user_settings`
Config por usuário em JSONB.

```sql
CREATE TABLE public.user_settings (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  settings   jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);
```

---

## Tabelas operacionais

### `customers`

```sql
CREATE TABLE public.customers (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id),
  name       text NOT NULL DEFAULT '',
  cpf        text NOT NULL DEFAULT '',
  phone      text NOT NULL DEFAULT '',
  email      text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);
-- Índice: idx_customers_user_id ON (user_id)
```

### `vehicles`

```sql
CREATE TABLE public.vehicles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES auth.users(id),
  plate       text NOT NULL,
  model       text NOT NULL DEFAULT '',
  brand       text NOT NULL DEFAULT '',
  color       text NOT NULL DEFAULT '',
  type        text NOT NULL DEFAULT 'car',  -- car | motorcycle | truck | other
  year        integer,
  created_at  timestamptz DEFAULT now(),
  UNIQUE(plate)
);
-- Índices: idx_vehicles_customer_id, idx_vehicles_plate
```

### `services`

```sql
CREATE TABLE public.services (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid NOT NULL REFERENCES auth.users(id),
  name                  text NOT NULL DEFAULT '',
  description           text DEFAULT '',
  price                 numeric(10,2) NOT NULL DEFAULT 0,
  duration              integer NOT NULL DEFAULT 30,  -- minutos
  commission_percentage numeric(5,2) NOT NULL DEFAULT 0,
  created_at            timestamptz DEFAULT now()
);
```

### `employees`

```sql
CREATE TABLE public.employees (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id),
  name            text NOT NULL DEFAULT '',
  role            text NOT NULL DEFAULT '',
  phone           text NOT NULL DEFAULT '',
  email           text NOT NULL DEFAULT '',
  document        text NOT NULL DEFAULT '',  -- CPF
  join_date       date NOT NULL DEFAULT CURRENT_DATE,
  salary          numeric(10,2) NOT NULL DEFAULT 0,
  commission_type text NOT NULL DEFAULT 'percentage',  -- fixed | percentage | mixed
  active          boolean NOT NULL DEFAULT true,
  created_at      timestamptz DEFAULT now()
);
-- Índice: idx_employees_active ON (active)
```

---

## Tabelas de agendamento

### `appointments`

```sql
CREATE TABLE public.appointments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  vehicle_id  uuid REFERENCES public.vehicles(id) ON DELETE SET NULL,
  employee_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  date        timestamptz NOT NULL,
  status      text NOT NULL DEFAULT 'scheduled',
  -- pending | scheduled | confirmed | arrived | in-progress | completed | cancelled
  notes       text DEFAULT '',
  total_price numeric(10,2) NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);
-- Índices: idx_appointments_user_id, idx_appointments_date, idx_appointments_status
```

### `appointment_services`
Relacionamento N:N entre agendamento e serviços.

```sql
CREATE TABLE public.appointment_services (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE CASCADE,
  service_id     uuid REFERENCES public.services(id) ON DELETE SET NULL,
  created_at     timestamptz DEFAULT now()
);
-- Índice: idx_appointment_services_appointment_id
```

### `appointment_status_history`
Log automático via trigger `on_appointment_status_change`.

```sql
CREATE TABLE public.appointment_status_history (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  from_status    text,
  to_status      text NOT NULL,
  changed_by     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes          text,
  changed_at     timestamptz NOT NULL DEFAULT now()
);
```

---

## Tabelas de execução e financeiro

### `service_executions`

```sql
CREATE TABLE public.service_executions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE CASCADE,
  service_id     uuid REFERENCES public.services(id) ON DELETE SET NULL,
  employee_id    uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  start_time     timestamptz,
  end_time       timestamptz,
  status         text NOT NULL DEFAULT 'pending',  -- pending | in-progress | completed | cancelled
  notes          text,
  created_at     timestamptz DEFAULT now()
);
-- Índices: idx_service_executions_appointment_id, idx_service_executions_employee_id
```

### `employee_commissions`

```sql
CREATE TABLE public.employee_commissions (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id       uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  employee_id          uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  service_id           uuid REFERENCES public.services(id) ON DELETE SET NULL,
  service_execution_id uuid REFERENCES public.service_executions(id) ON DELETE SET NULL,
  base_price           numeric(10,2),
  commission_percentage numeric(5,2),
  profit_percentage    numeric(5,2),
  commission_amount    numeric(10,2) NOT NULL DEFAULT 0,
  created_at           timestamptz DEFAULT now()
);
-- Índice: idx_employee_commissions_employee_id
```

### `payment_transactions`

```sql
CREATE TABLE public.payment_transactions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE CASCADE,
  amount         numeric(10,2) NOT NULL DEFAULT 0,
  method         text NOT NULL DEFAULT 'cash',  -- cash | credit | debit | pix | other
  status         text NOT NULL DEFAULT 'completed',  -- pending | completed | cancelled
  date           timestamptz NOT NULL DEFAULT now(),
  notes          text,
  created_at     timestamptz DEFAULT now()
);
-- Índices: idx_payment_transactions_appointment_id, idx_payment_transactions_date
-- RLS: somente admin e manager podem ver
```

---

## Tabelas de caixa

### `cash_registers`
Uma por turno/sessão de caixa.

```sql
CREATE TABLE public.cash_registers (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status                  text NOT NULL DEFAULT 'open',  -- open | closed
  opening_amount          numeric(12,2) NOT NULL DEFAULT 0,
  closing_amount_expected numeric(12,2),
  closing_amount_actual   numeric(12,2),
  difference              numeric(12,2),
  notes                   text,
  opened_at               timestamptz NOT NULL DEFAULT now(),
  closed_at               timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now()
);
-- Índice: idx_cash_registers_user_status ON (user_id, status)
```

### `cash_movements`
Cada movimentação dentro de um turno.

```sql
CREATE TABLE public.cash_movements (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cash_register_id uuid NOT NULL REFERENCES public.cash_registers(id) ON DELETE CASCADE,
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type             text NOT NULL,  -- payment | sangria | suprimento
  amount           numeric(12,2) NOT NULL CHECK (amount > 0),
  payment_method   text,  -- cash | credit | debit | pix | other (null para sangria/suprimento)
  appointment_id   uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  description      text,
  created_at       timestamptz NOT NULL DEFAULT now()
);
-- Índice: idx_cash_movements_register ON (cash_register_id, created_at)
```

---

## Tabela de configuração

### `business_config`
Singleton (sempre 1 linha com id=1). Configura capacidade e horários.

```sql
CREATE TABLE public.business_config (
  id                    integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  max_per_slot          integer NOT NULL DEFAULT 3,     -- vagas por slot
  slot_duration_minutes integer NOT NULL DEFAULT 60,    -- duração em minutos
  working_start         text NOT NULL DEFAULT '08:00',  -- horário de abertura
  working_end           text NOT NULL DEFAULT '18:00',  -- horário de fechamento
  updated_at            timestamptz NOT NULL DEFAULT now()
);
-- RLS: leitura para anon+authenticated, escrita somente admin
```

---

## Funções SQL

| Função | Tipo | Descrição |
|---|---|---|
| `handle_new_user()` | TRIGGER | Cria profile + user_roles ao registrar em auth.users |
| `get_current_user_role()` | STABLE | Retorna role do usuário atual |
| `is_admin()` | STABLE | Retorna true se o usuário atual tem role 'admin' |
| `has_role(uuid, app_role)` | STABLE | Verifica se usuário X tem role Y |
| `calculate_employee_commission(...)` | VOLATILE | Calcula e insere comissão por execução |
| `create_public_appointment(jsonb, jsonb, jsonb)` | VOLATILE | Cria agendamento sem autenticação (formulário público) |
| `log_appointment_status_change()` | TRIGGER | Registra transições em appointment_status_history |

Todas as funções SECURITY DEFINER têm `REVOKE EXECUTE FROM PUBLIC` + `GRANT` seletivo.

---

## Views

### `employee_commission_summary`
View materializada para o módulo financeiro:

```sql
CREATE VIEW public.employee_commission_summary AS
SELECT
  ec.employee_id,
  e.name AS employee_name,
  COUNT(ec.id) AS total_services,
  SUM(ec.commission_amount) AS total_commission,
  AVG(ec.commission_amount) AS avg_commission,
  MAX(ec.created_at) AS last_service
FROM public.employee_commissions ec
JOIN public.employees e ON e.id = ec.employee_id
GROUP BY ec.employee_id, e.name;
```

---

## Triggers

| Trigger | Tabela | Evento | Função |
|---|---|---|---|
| `on_auth_user_created` | `auth.users` | AFTER INSERT | `handle_new_user()` |
| `on_appointment_status_change` | `appointments` | AFTER UPDATE | `log_appointment_status_change()` |

---

## Migrações (ordem de aplicação)

| Arquivo | Conteúdo |
|---|---|
| `supabase/schema_completo.sql` | Schema base: todas as tabelas + tipos + funções + trigger de usuário |
| `20260607000001-security-hardening.sql` | REVOKE EXECUTE em funções SECURITY DEFINER |
| `20260607000002-status-history.sql` | Tabela `appointment_status_history` + trigger de log |
| `20260607000003-cash-register.sql` | Tabelas `cash_registers` + `cash_movements` |
| `20260607000004-capacity.sql` | Tabela `business_config` + RLS |

---

## RLS — Estado atual

| Tabela | RLS habilitada | Policies definidas |
|---|---|---|
| `profiles` | Sim | Sim (user vê próprio, admin vê todos) |
| `user_roles` | Não | — |
| `customers` | Sim | Pendente — falta policy restritiva por user_id |
| `vehicles` | Sim | Pendente |
| `services` | Sim | Pendente |
| `employees` | Sim | Pendente |
| `appointments` | Sim | Pendente |
| `appointment_services` | Sim | Pendente |
| `appointment_status_history` | Sim | Sim |
| `service_executions` | Sim | Pendente |
| `employee_commissions` | Sim | Pendente |
| `payment_transactions` | Sim | Sim (admin + manager) |
| `cash_registers` | Sim | Sim (próprio + admin) |
| `cash_movements` | Sim | Sim (próprio via register + admin) |
| `business_config` | Sim | Sim (leitura pública, escrita admin) |

> **Nota:** As tabelas com "Pendente" têm RLS habilitada mas sem policies explícitas — qualquer autenticado acessa tudo. Isso precisa ser corrigido antes de uso em ambiente multi-empresa. Ver [ROADMAP.md](ROADMAP.md) Sprint 1.
