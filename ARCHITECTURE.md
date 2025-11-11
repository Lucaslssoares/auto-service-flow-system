# 🏗️ Arquitetura do Sistema - Lava Car SaaS

Este documento descreve a arquitetura técnica do sistema, padrões utilizados e organização do código.

## 📐 Visão Geral da Arquitetura

O Lava Car SaaS é uma aplicação **SPA (Single Page Application)** construída com uma arquitetura moderna de frontend + BaaS (Backend as a Service).

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │  Pages   │  │Components│  │  Hooks   │  │  Utils  ││
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
│         │              │              │            │     │
│         └──────────────┴──────────────┴────────────┘    │
│                          │                               │
│                   ┌──────▼──────┐                       │
│                   │ Supabase    │                       │
│                   │   Client    │                       │
│                   └──────┬──────┘                       │
└──────────────────────────┼──────────────────────────────┘
                           │
                     HTTPS/REST
                           │
┌──────────────────────────▼──────────────────────────────┐
│                 BACKEND (Supabase)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │PostgreSQL│  │   Auth   │  │  Storage │  │  Edge   ││
│  │    DB    │  │          │  │          │  │Functions││
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
│         │              │              │            │     │
│         └──────────────┴──────────────┴────────────┘    │
│                    Row Level Security                    │
└─────────────────────────────────────────────────────────┘
```

## 🎨 Frontend Stack

### Core
- **React 18.3.1** - Biblioteca UI com Concurrent Features
- **TypeScript 5.0** - Tipagem estática
- **Vite** - Build tool moderna e rápida
- **React Router 6** - Roteamento SPA

### UI & Styling
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/UI** - Componentes base acessíveis
- **Radix UI** - Primitivos de UI sem estilo
- **Lucide React** - Ícones SVG

### State Management
- **TanStack Query (React Query)** - Gerenciamento de estado servidor
- **React Context** - Estado global da aplicação
- **React Hook Form** - Gerenciamento de formulários

### Validação & Utilitários
- **Zod** - Validação de schemas
- **date-fns** - Manipulação de datas
- **clsx** - Utilitário de classes CSS

## 🔧 Backend Stack (Supabase)

### Database
- **PostgreSQL 15** - Banco de dados relacional
- **Row Level Security (RLS)** - Segurança em nível de linha
- **Triggers** - Automação de processos
- **Functions** - Lógica customizada SQL

### Authentication
- **Supabase Auth** - Sistema de autenticação completo
- **JWT Tokens** - Autenticação stateless
- **User Roles** - Sistema de permissões customizado

### Storage
- **Supabase Storage** - Armazenamento de arquivos
- **Buckets** - Organização de arquivos por tipo

### Edge Functions
- **Deno Runtime** - Funções serverless
- **HTTP Endpoints** - APIs customizadas

## 📁 Estrutura de Pastas

```
lava-car-saas/
├── public/                      # Arquivos estáticos
│   ├── robots.txt
│   └── favicon.ico
│
├── src/
│   ├── components/              # Componentes React
│   │   ├── ui/                 # Componentes base (Shadcn)
│   │   ├── auth/               # Componentes de autenticação
│   │   ├── appointments/       # Componentes de agendamentos
│   │   ├── employees/          # Componentes de funcionários
│   │   ├── execution/          # Componentes de execução
│   │   ├── finance/            # Componentes financeiros
│   │   ├── permissions/        # Componentes de permissões
│   │   ├── services/           # Componentes de serviços
│   │   ├── settings/           # Componentes de configurações
│   │   ├── system/             # Componentes do sistema
│   │   ├── common/             # Componentes compartilhados
│   │   ├── ErrorBoundary.tsx   # Tratamento de erros
│   │   ├── Layout.tsx          # Layout principal
│   │   ├── ProtectedRoute.tsx  # Rota protegida
│   │   └── SidebarNav.tsx      # Navegação lateral
│   │
│   ├── hooks/                   # Hooks customizados
│   │   ├── auth/               # Hooks de autenticação
│   │   ├── appointments/       # Hooks de agendamentos
│   │   ├── cache/              # Hooks de cache
│   │   ├── execution/          # Hooks de execução
│   │   ├── permissions/        # Hooks de permissões
│   │   ├── vehicle/            # Hooks de veículos
│   │   └── use-*.ts           # Hooks genéricos
│   │
│   ├── pages/                   # Páginas da aplicação
│   │   ├── Index.tsx           # Dashboard
│   │   ├── Auth.tsx            # Login/Cadastro
│   │   ├── Customers.tsx       # Gestão de clientes
│   │   ├── Vehicles.tsx        # Gestão de veículos
│   │   ├── Services.tsx        # Catálogo de serviços
│   │   ├── Employees.tsx       # Gestão de funcionários
│   │   ├── Appointments.tsx    # Agendamentos
│   │   ├── ExecutionPage.tsx   # Execução de serviços
│   │   ├── FinancePageOptimized.tsx  # Relatórios financeiros
│   │   ├── UserPermissions.tsx # Gestão de permissões
│   │   ├── Settings.tsx        # Configurações
│   │   └── NotFound.tsx        # 404
│   │
│   ├── types/                   # Definições TypeScript
│   │   ├── database.ts         # Tipos do banco de dados
│   │   ├── index.ts            # Tipos gerais
│   │   └── settings.ts         # Tipos de configurações
│   │
│   ├── utils/                   # Utilitários
│   │   ├── executionUtils.ts   # Utilitários de execução
│   │   ├── exportUtils.ts      # Utilitários de exportação
│   │   ├── performanceUtils.ts # Utilitários de performance
│   │   ├── security.ts         # Utilitários de segurança
│   │   └── utils.ts            # Utilitários gerais
│   │
│   ├── integrations/            # Integrações externas
│   │   └── supabase/
│   │       ├── client.ts       # Cliente Supabase
│   │       └── types.ts        # Tipos Supabase
│   │
│   ├── config/                  # Configurações
│   │   └── environment.ts      # Variáveis de ambiente
│   │
│   ├── App.tsx                  # Componente raiz
│   ├── main.tsx                 # Entry point
│   └── index.css                # Estilos globais
│
├── supabase/                    # Configurações Supabase
│   ├── config.toml             # Configuração do projeto
│   └── migrations/             # Migrações SQL
│
├── .env                         # Variáveis de ambiente (dev)
├── index.html                   # HTML principal
├── package.json                 # Dependências NPM
├── tailwind.config.ts          # Configuração Tailwind
├── tsconfig.json               # Configuração TypeScript
├── vite.config.ts              # Configuração Vite
└── README.md                    # Documentação principal
```

## 🔄 Fluxo de Dados

### 1. Autenticação

```typescript
User Login → Supabase Auth → JWT Token → Local Storage
                ↓
         SecureAuthProvider
                ↓
    useSecureAuth() Hook → Components
                ↓
         Protected Routes
```

### 2. Operações CRUD

```typescript
Component → Hook → Supabase Client → RLS Policies → PostgreSQL
                                         ↓
                                    Cache (React Query)
                                         ↓
                                   UI Update
```

### 3. Permissões

```typescript
User → user_roles table → has_role() function → RLS Policy
                ↓
        usePermissions() hook
                ↓
        Conditional UI Rendering
```

## 🎯 Padrões de Código

### 1. Componentes

```typescript
// ✅ Bom - Componente focado e tipado
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
```

### 2. Hooks Customizados

```typescript
// ✅ Bom - Hook reutilizável com tratamento de erros
export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });
}
```

### 3. Gerenciamento de Estado

```typescript
// ✅ Bom - Uso de React Query para estado servidor
const { data, isLoading, error } = useCustomers();

// ❌ Evitar - Estado local para dados do servidor
const [customers, setCustomers] = useState([]);
```

### 4. Validação de Formulários

```typescript
// ✅ Bom - Schema Zod + React Hook Form
const schema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

## 🔐 Segurança

### Row Level Security (RLS)

Todas as tabelas possuem políticas RLS:

```sql
-- Exemplo: Clientes só podem ver seus próprios dados
CREATE POLICY "users_view_own_data"
ON customers
FOR SELECT
TO authenticated
USING (user_id = auth.uid());
```

### Permissões por Role

```sql
-- Função de verificação de role
CREATE FUNCTION has_role(_user_id uuid, _role app_role)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$ LANGUAGE sql SECURITY DEFINER;

-- Política usando a função
CREATE POLICY "admins_view_all"
ON customers
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));
```

### Validação Client-Side

```typescript
// Máscara de dados sensíveis em logs
export function maskSensitiveData(data: any) {
  // Remove emails, CPFs, senhas dos logs
  return sanitizeObject(data);
}
```

## 🚀 Performance

### 1. Code Splitting

```typescript
// Lazy loading de rotas
const FinancePage = lazy(() => import('./pages/FinancePageOptimized'));
```

### 2. Otimização de Queries

```typescript
// Seleção específica de campos
const { data } = await supabase
  .from('customers')
  .select('id, name, email') // Apenas campos necessários
  .limit(100); // Paginação
```

### 3. Cache Inteligente

```typescript
// Cache com invalidação automática
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
    },
  },
});
```

### 4. Memoização

```typescript
// Evita re-renderizações desnecessárias
const expensiveCalculation = useMemo(
  () => calculateTotal(items),
  [items]
);
```

## 🗄️ Schema do Banco de Dados

### Tabelas Principais

```sql
-- Perfis de usuários
profiles (
  id uuid PRIMARY KEY,
  name text,
  email text,
  role text,
  created_at timestamp
)

-- Roles de usuários (segurança)
user_roles (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  role app_role (enum: admin, manager, operator, receptionist)
)

-- Clientes
customers (
  id uuid PRIMARY KEY,
  name text,
  cpf text,
  phone text,
  email text,
  user_id uuid
)

-- Veículos
vehicles (
  id uuid PRIMARY KEY,
  customer_id uuid REFERENCES customers,
  plate text,
  model text,
  type text
)

-- Serviços
services (
  id uuid PRIMARY KEY,
  name text,
  price decimal,
  duration integer,
  commission_type text,
  commission_value decimal
)

-- Funcionários
employees (
  id uuid PRIMARY KEY,
  name text,
  role text,
  commission_type text,
  commission_value decimal
)

-- Agendamentos
appointments (
  id uuid PRIMARY KEY,
  customer_id uuid REFERENCES customers,
  vehicle_id uuid REFERENCES vehicles,
  service_id uuid REFERENCES services,
  scheduled_at timestamp,
  status text,
  notes text
)

-- Execução de serviços
service_executions (
  id uuid PRIMARY KEY,
  appointment_id uuid REFERENCES appointments,
  employee_id uuid REFERENCES employees,
  started_at timestamp,
  completed_at timestamp,
  status text
)

-- Transações financeiras
payment_transactions (
  id uuid PRIMARY KEY,
  appointment_id uuid REFERENCES appointments,
  amount decimal,
  payment_method text,
  paid_at timestamp
)

-- Comissões de funcionários
employee_commissions (
  id uuid PRIMARY KEY,
  employee_id uuid REFERENCES employees,
  service_execution_id uuid REFERENCES service_executions,
  amount decimal,
  calculated_at timestamp
)
```

## 🔧 Build & Deploy

### Desenvolvimento

```bash
npm run dev     # Vite dev server (HMR)
```

### Produção

```bash
npm run build   # Build otimizado
npm run preview # Preview da build
```

### Otimizações de Build

- **Code Splitting**: Vendor, UI, Utils separados
- **Tree Shaking**: Remove código não utilizado
- **Minification**: Código compactado
- **Source Maps**: Apenas em dev

## 📊 Monitoramento

### Logs

```typescript
// Logs estruturados
console.info('[AUTH]', 'User logged in', { userId });
console.error('[API]', 'Request failed', { error });
```

### Performance

```typescript
// Medição de performance
const start = performance.now();
await fetchData();
const duration = performance.now() - start;
console.log(`Fetch took ${duration}ms`);
```

## 🧪 Testes (Futuro)

Estrutura recomendada para testes:

```
src/
├── components/
│   └── Button.test.tsx
├── hooks/
│   └── useAuth.test.ts
└── utils/
    └── security.test.ts
```

---

**📚 Este documento deve ser atualizado conforme o projeto evolui.**
