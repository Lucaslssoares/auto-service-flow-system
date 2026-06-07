# Arquitetura — Lava Car

Última atualização: 2026-06-07

---

## Visão geral

SPA React servida por Vite, com todo o backend gerenciado pelo Supabase (PostgreSQL, Auth, RLS). Não há servidor Node.js customizado — toda a lógica de negócio fica em hooks React Query + funções PL/pgSQL no banco.

```
Browser
  └── React 18 SPA (Vite)
        ├── TanStack Query  ←→  Supabase REST API
        ├── React Hook Form
        └── shadcn/ui
              │
        Supabase (bciuykfoinbgkrsiljpg)
              ├── Auth (JWT)
              ├── PostgreSQL 17 + RLS
              └── Management API (migrations via PAT)
```

---

## Estrutura de pastas

```
src/
├── App.tsx                    # Roteamento + providers
├── integrations/
│   └── supabase/
│       ├── client.ts          # createClient (lê VITE_SUPABASE_URL + KEY)
│       └── types.ts           # Tipos gerados do schema (Database interface)
├── pages/                     # Uma página por rota
│   ├── Index.tsx              # Dashboard /
│   ├── Customers.tsx          # /clientes
│   ├── Vehicles.tsx           # /veiculos
│   ├── Services.tsx           # /servicos
│   ├── Employees.tsx          # /funcionarios
│   ├── Appointments.tsx       # /agendamentos
│   ├── ExecutionPage.tsx      # /execucao
│   ├── CashRegister.tsx       # /caixa
│   ├── FinancePageOptimized.tsx # /financeiro
│   ├── Settings.tsx           # /configuracoes
│   ├── UserPermissions.tsx    # /permissoes
│   ├── ClientAppointment.tsx  # /agendar (público)
│   └── Auth.tsx               # /auth
├── hooks/                     # Toda lógica de dados aqui
│   ├── auth/
│   │   ├── useAuthState.ts
│   │   ├── useLogin.ts
│   │   ├── useSignup.ts
│   │   └── useUserProfile.ts
│   ├── useSecureAuth.ts       # Context provider de auth
│   ├── useAppointmentsUnified.ts
│   ├── useCustomerManagement.ts
│   ├── useVehicleManagement.ts
│   ├── useServiceManagement.ts
│   ├── useEmployeeManagement.ts
│   ├── useCapacityConfig.ts   # business_config + disponibilidade de slots
│   ├── useCashRegister.ts     # caixa: abertura, fechamento, movimentos
│   ├── useFinanceOptimized.ts
│   ├── useDashboardData.ts
│   ├── usePublicAppointments.ts
│   ├── usePermissions.ts
│   └── useSettingsOptimized.ts
├── components/
│   ├── Layout.tsx             # Shell com sidebar + outlet
│   ├── SidebarNav.tsx         # Navegação lateral
│   ├── ProtectedRoute.tsx     # Guard de rota por permissão
│   ├── ErrorBoundary.tsx
│   ├── appointments/
│   │   ├── AppointmentForm.tsx
│   │   └── SlotPicker.tsx     # Seletor de horário com disponibilidade real
│   ├── execution/             # Componentes do módulo de execução
│   ├── finance/               # Componentes do módulo financeiro
│   ├── settings/              # Abas de configurações
│   ├── auth/                  # LoginForm, SignupForm
│   └── ui/                    # shadcn/ui (não modificar)
├── types/
│   └── index.ts               # Tipos de domínio (Customer, Vehicle, etc.)
└── utils/
    └── security.ts            # Sanitização, rate limiter, headers
supabase/
├── schema_completo.sql        # Schema base inicial
├── fix_trigger_v2.sql         # Trigger handle_new_user final
└── migrations/
    ├── 20260607000001-security-hardening.sql
    ├── 20260607000002-status-history.sql
    ├── 20260607000003-cash-register.sql
    └── 20260607000004-capacity.sql
```

---

## Roteamento

```
/auth                     → Auth.tsx              (público)
/agendar                  → ClientAppointment.tsx  (público)
/                         → Layout.tsx (ProtectedRoute)
  ├── index               → Index.tsx (dashboard)
  ├── /clientes           → Customers.tsx
  ├── /veiculos           → Vehicles.tsx
  ├── /servicos           → Services.tsx
  ├── /funcionarios       → Employees.tsx
  ├── /agendamentos       → Appointments.tsx
  ├── /execucao           → ExecutionPage.tsx
  ├── /caixa              → CashRegister.tsx
  ├── /financeiro         → FinancePageOptimized.tsx
  ├── /configuracoes      → Settings.tsx
  └── /permissoes         → UserPermissions.tsx (requer manage_users)
```

---

## Padrão de dados — TanStack Query

Cada módulo segue o mesmo padrão:

```typescript
// 1. Query key como constante
const CUSTOMERS_KEY = ["customers"] as const;

// 2. useQuery para leitura
export function useCustomers() {
  return useQuery({
    queryKey: CUSTOMERS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*");
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// 3. useMutation para escrita + invalidação
export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => { /* ... */ },
    onSuccess: () => qc.invalidateQueries({ queryKey: CUSTOMERS_KEY }),
    onError: (err) => toast.error(err.message),
  });
}
```

---

## Autenticação e autorização

### Fluxo de login
1. `useLogin` chama `supabase.auth.signInWithPassword`
2. Supabase retorna JWT com `role: anon → authenticated`
3. `SecureAuthProvider` armazena sessão e expõe `hasPermission()`
4. `ProtectedRoute` verifica sessão; redireciona para `/auth` se ausente

### Roles (RBAC)
```
admin    → tudo
manager  → financeiro, relatórios, gestão
employee → execução de serviços
user     → agendamento próprio
```

### Trigger de novo usuário
```sql
-- Criado em auth.users → cria automaticamente:
-- 1. profiles (nome, email, role)
-- 2. user_roles (admin recebe 4 roles, demais recebem 'user')
```

Admin pré-definido por e-mail: `solareslucas403@gmail.com`.

---

## Controle de capacidade (slots)

```
business_config (Supabase)
  └── working_start, working_end, slot_duration_minutes, max_per_slot
        │
useBusinessConfig()          ← lê a config
useSlotAvailability(date)    ← conta appointments do dia por slot
        │
SlotPicker                   ← exibe slots com indicador de vagas
  ├── disponível   → texto normal
  ├── quase cheio  → texto âmbar + "(2/3)"
  └── lotado       → desabilitado + "— lotado"
```

---

## Controle de caixa

```
cash_registers (1 por turno)
  └── cash_movements (N por registro)
        ├── type: payment  → soma ao saldo
        ├── type: suprimento → soma ao saldo
        └── type: sangria  → subtrai do saldo

saldo = opening_amount + Σ(payments) + Σ(suprimentos) - Σ(sangrias)
```

---

## Variáveis de ambiente

| Variável | Valor |
|---|---|
| `VITE_SUPABASE_URL` | `https://bciuykfoinbgkrsiljpg.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (anon key) |
| `VITE_SUPABASE_PROJECT_ID` | `bciuykfoinbgkrsiljpg` |

A anon key é segura para commitar — não dá acesso admin. O acesso a dados é controlado por RLS no banco.

---

## Decisões de design

| Decisão | Motivo |
|---|---|
| Supabase em vez de API própria | Reduz infra; RLS garante segurança sem middleware |
| TanStack Query em vez de Context | Cache automático, stale/revalidation, optimistic updates |
| shadcn/ui | Componentes headless copiados no projeto — sem lock-in de biblioteca |
| Trigger `handle_new_user` | Garante que profile e roles existam antes de qualquer query |
| SECURITY DEFINER + REVOKE | Funções elevadas não ficam expostas a `anon` |
| `business_config` singleton | Config global única; row com `CHECK (id = 1)` impede duplicatas |
