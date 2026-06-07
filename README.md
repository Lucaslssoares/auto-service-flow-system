# Lava Car — Sistema de Gestão

Sistema de gestão operacional para lava-rápidos. SPA React com backend Supabase (PostgreSQL + Auth + RLS).

**Repositório:** https://github.com/Lucaslssoares/auto-service-flow-system  
**Projeto Supabase:** `bciuykfoinbgkrsiljpg`  
**Última atualização:** 2026-06-07

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| UI | shadcn/ui + Tailwind CSS + Radix UI |
| Estado servidor | TanStack Query v5 |
| Formulários | React Hook Form + Zod |
| Backend | Supabase (PostgreSQL 17 + Auth) |
| Auth | Supabase Auth — email/senha |
| RLS | Row Level Security em todas as tabelas |
| Gráficos | Recharts |
| Datas | date-fns (pt-BR) |

---

## Módulos implementados

### Agendamentos `/agendamentos`
- Fluxo de status: `pending → confirmed → arrived → in-progress → completed / cancelled`
- Abas por status: Ativos, Aguardando, Confirmados, Presentes, Em Execução, Histórico
- Log automático de todas as transições de status (`appointment_status_history`)
- Agendamento público para clientes sem login (`/agendar`)
- Controle de disponibilidade por slot com vagas configuráveis

### Clientes `/clientes`
- CRUD completo (nome, CPF, telefone, email)
- Busca por nome/email/CPF
- Relacionamento 1:N com veículos

### Veículos `/veiculos`
- CRUD por cliente (placa única, marca, modelo, cor, tipo, ano)
- Filtro por cliente

### Serviços `/servicos`
- CRUD (nome, descrição, preço, duração, % comissão)
- Preço e comissão usados nos cálculos automáticos de agendamento

### Funcionários `/funcionarios`
- CRUD (nome, cargo, CPF, telefone, email, salário, tipo de comissão)
- Tipos de comissão: fixa, percentual, mista

### Execução `/execucao`
- Kanban de serviços em andamento e próximos
- Suporte a múltiplos funcionários por serviço
- Divisão de lucros configurável por equipe
- Rastreamento de horário de início e fim

### Caixa `/caixa`
- Abertura de turno com fundo inicial
- Movimentações: pagamento, sangria, suprimento
- Formas de pagamento: dinheiro, crédito, débito, PIX
- Fechamento com saldo esperado vs. real e diferença calculada

### Financeiro `/financeiro`
- Períodos: hoje, semana, mês, trimestre
- Receita total, ticket médio, quantidade de serviços
- Ranking de serviços mais vendidos
- Ranking de funcionários por receita
- Comissões por período
- Restrito a roles: `admin`, `manager`

### Dashboard `/`
- Cards: agendamentos hoje, clientes, veículos, serviços, receita mensal
- Próximos agendamentos e atividade recente

### Configurações `/configuracoes`
- Capacidade de slots (vagas por horário, duração, horário de funcionamento) — **persiste no Supabase** (`business_config`)
- Demais configurações (nome empresa, notificações, etc.) — **ainda em estado local, não persiste**

### Permissões `/permissoes`
- RBAC com roles: `admin`, `manager`, `employee`, `user`
- Gerenciamento de roles por usuário (somente admin)

### Auth `/auth`
- Cadastro e login por email/senha
- Auto-confirm habilitado (sem e-mail de verificação)
- Trigger `handle_new_user` cria perfil e roles automaticamente
- Admin pré-definido: `solareslucas403@gmail.com`

---

## Funcionalidades pendentes (roadmap completo em [ROADMAP.md](ROADMAP.md))

| Funcionalidade | Prioridade |
|---|---|
| Persistir todas as configurações no Supabase | Alta |
| Exportação PDF/Excel de relatórios financeiros | Alta |
| Histórico completo do cliente (total gasto, frequência) | Alta |
| Programa de fidelidade (pontos por serviço) | Média |
| Planos de assinatura mensal | Média |
| WhatsApp — confirmação e lembrete automático | Média |
| Dashboard: heatmap de pico, taxa de ocupação | Média |
| NPS pós-serviço | Baixa |
| QR Code check-in | Baixa |

---

## Setup local

```bash
# 1. Clone
git clone https://github.com/Lucaslssoares/auto-service-flow-system.git
cd auto-service-flow-system

# 2. Instale dependências
npm install

# 3. Variáveis de ambiente (já configurado no .env)
# VITE_SUPABASE_URL=https://bciuykfoinbgkrsiljpg.supabase.co
# VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...

# 4. Rode
npm run dev   # http://localhost:8080
```

Instruções detalhadas em [LOCAL_SETUP.md](LOCAL_SETUP.md).

---

## Comandos

```bash
npm run dev      # Desenvolvimento (porta 8080)
npm run build    # Build de produção
npm run preview  # Preview da build
npm run lint     # ESLint
```

---

## Documentação

| Arquivo | Conteúdo |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Arquitetura técnica, estrutura de pastas, padrões |
| [DATABASE.md](DATABASE.md) | Schema completo do banco, tabelas, funções, RLS |
| [LOCAL_SETUP.md](LOCAL_SETUP.md) | Setup detalhado, troubleshooting |
| [ROADMAP.md](ROADMAP.md) | Análise de mercado, backlog priorizado |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Guia de contribuição e padrões de código |

---

**Desenvolvedor:** Lucas Soares — solareslucas403@gmail.com
