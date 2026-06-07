# Roadmap — Lava Car

Documento criado em 2026-06-07 com base em análise profunda do código e benchmarking de mercado (Micar, Rinsed, DRB Systems, ICS CarWash, AutoStar).

---

## Estado atual dos módulos

| Módulo | Status | Observação |
|---|---|---|
| Agendamentos | Implementado | Fluxo completo, log de status, controle de slots |
| Clientes | Implementado | CRUD completo |
| Veículos | Implementado | CRUD por cliente |
| Serviços | Implementado | CRUD com comissão |
| Funcionários | Implementado | CRUD com tipos de comissão |
| Execução | Implementado | Múltiplos funcionários, divisão de lucro |
| Caixa | Implementado | Abertura, fechamento, sangria, suprimento |
| Financeiro | Implementado | Relatórios por período, rankings |
| Dashboard | Implementado | KPIs básicos |
| Configurações | Parcial | Capacidade persiste; demais configurações são locais |
| Auth | Implementado | Email/senha, RBAC, trigger de criação |
| Permissões | Implementado | Gerenciamento de roles por usuário |

---

## Sprint 1 — Base crítica (impede uso em produção)

### 1.1 Persistir configurações no Supabase
- **Problema:** `useSettingsOptimized.ts` usa `setTimeout(800)` falso. Nenhuma configuração (nome da empresa, horários, notificações) é salva.
- **Solução:** Salvar/ler configurações gerais na tabela `user_settings` (JSONB já existe no banco).
- **Impacto:** Alto — configurações somem ao recarregar.

### 1.2 RLS policies nas tabelas principais
- **Problema:** `customers`, `vehicles`, `appointments`, `employees`, `services` têm RLS habilitada mas sem policies — qualquer usuário autenticado vê tudo.
- **Solução:** Migration com policies que isolem por `user_id` (single-tenant) ou `organization_id` (multi-tenant futuro).
- **Impacto:** Crítico em ambiente com múltiplos usuários.

### 1.3 Paginação nos listados
- **Problema:** `useAppointmentsUnified`, `useCustomerManagement` etc. carregam todos os registros sem LIMIT.
- **Solução:** Paginação cursor-based ou LIMIT/OFFSET com `count: 'exact'`.
- **Impacto:** A página trava com 5.000+ registros.

### 1.4 Validação de inputs com Zod nos mutations
- **Problema:** Hooks de criação/edição inserem dados sem validar (preço negativo, CPF inválido, etc.).
- **Solução:** Adicionar Zod schema antes de chamar `supabase.from(...).insert()`.
- **Impacto:** Dados inválidos corrompem o banco silenciosamente.

---

## Sprint 2 — KPIs e relatórios

### 2.1 Dashboard: KPIs do setor
Sistemas líderes (Micar, DRB) expõem:
- **Taxa de ocupação** — % dos slots preenchidos no período
- **Ticket médio** — por tipo de veículo, por período, por funcionário
- **Heatmap de pico** — horas × dias da semana com volume de atendimentos
- **Receita por funcionário** — ranking diário/mensal
- **Taxa de retorno** — % de clientes que voltaram em 30/60/90 dias
- **Tempo médio de serviço** — início → conclusão por tipo

### 2.2 Exportação de relatórios
Todo sistema profissional exporta. Donos de lava-car entregam relatórios para o contador.
- PDF: biblioteca `jsPDF` + `jspdf-autotable`
- Excel: biblioteca `xlsx`
- Começar pelo relatório financeiro mensal e comissões

### 2.3 Histórico completo do cliente
Na tela do cliente, mostrar:
- Total gasto (lifetime value)
- Número de visitas
- Última visita
- Serviços mais usados
- Veículos registrados com data da última lavagem

---

## Sprint 3 — Retenção e engajamento

### 3.1 Programa de fidelidade
Padrão no mercado brasileiro (Micar, Wash Control):
- Pontos acumulados por real gasto (ex: 1 ponto = R$1)
- Saldo de pontos visível na tela do cliente
- Resgate: X pontos = desconto Y% no próximo serviço
- Tabela: `loyalty_points` (customer_id, points, type: earn/redeem, reference_id, created_at)

### 3.2 NPS pós-serviço
- Ao concluir um agendamento, gerar link único de avaliação (1-10 + comentário)
- Tabela: `service_ratings` (appointment_id, rating, comment, created_at)
- Dashboard: NPS médio, últimas avaliações

### 3.3 QR Code na OS
- Gerar QR Code por agendamento que abre uma página pública `/status/:id`
- Cliente escaneia e vê o status em tempo real sem fazer login
- Diferencial de UX percebido como premium

---

## Sprint 4 — Comunicação automatizada

### 4.1 WhatsApp Business API
Funcionalidade mais impactante do mercado em 2025 no Brasil:
- **Confirmação:** ao criar agendamento → mensagem automática com data, hora, serviços
- **Lembrete:** 2h antes → "Olá {nome}, seu agendamento é às {hora}"
- **Pós-serviço:** link do NPS
- Implementação: Twilio for WhatsApp ou Meta Business API direto

### 4.2 Planos de assinatura (recorrência)
Modelo que mais cresce no setor (Rinsed é especializado nisso):
- Cliente paga mensalidade fixa → tem N lavagens/mês
- Controle de uso: quantas lavagens usou este mês
- PIX recorrente ou cartão
- Tabela: `subscription_plans` + `customer_subscriptions`

---

## Sprint 5 — Operação avançada

### 5.1 Convênio empresarial (B2B)
Empresas com frota pagam fatura consolidada mensal (AutoStar tem isso):
- Cadastro de empresa conveniada
- Veículos da frota vinculados à empresa
- Serviços liberados por placa
- Fatura mensal consolidada por empresa

### 5.2 Notificações em tempo real (Supabase Realtime)
- Dashboard atualiza automaticamente quando agendamento muda de status
- Notificação visual (toast) para o operador quando novo agendamento chega
- Supabase já tem o canal configurável: `supabase.channel('appointments').on('postgres_changes', ...)`

---

## Débitos técnicos identificados

| Item | Impacto | Esforço |
|---|---|---|
| Configurações não persistem no Supabase | Alto | Médio |
| RLS policies incompletas | Crítico | Médio |
| Paginação faltando | Alto | Médio |
| Sem validação Zod nos mutations | Alto | Baixo |
| Cache invalidation incompleta (dashboard não atualiza) | Médio | Baixo |
| Componentes grandes (Appointments.tsx 244 linhas) | Baixo | Médio |
| Sem testes automatizados | Médio | Alto |
| CPF armazenado sem criptografia | Baixo | Baixo |

---

## Referências de mercado

| Sistema | País | Diferencial principal |
|---|---|---|
| Micar | Brasil | Mais completo para lava-rápido nacional, fidelidade nativa |
| Rinsed | EUA | Especializado em assinatura/recorrência |
| DRB Systems | EUA | Enterprise chains, reconhecimento de placa |
| ICS CarWash | EUA | Multi-unidade, API aberta |
| AutoStar | Brasil | Gestão de frotas B2B, convênio empresarial |
| Wash Control | Brasil | PDV integrado, link de pagamento WhatsApp |

### KPIs que donos de lava-car monitoram (referência para o dashboard)

- Veículos atendidos / dia
- Ticket médio (total / atendimentos)
- Taxa de ocupação dos slots (agendamentos / capacidade)
- Tempo médio de serviço por tipo
- Receita por funcionário
- Comissão paga × receita bruta
- Taxa de retorno de clientes (30/60/90 dias)
- Serviços mais vendidos (volume e receita)
- Horários de pico (heatmap hora × dia)
- Resultado do caixa: esperado vs. real

---

## Como contribuir com o roadmap

1. Abra uma issue no GitHub descrevendo a funcionalidade
2. Inclua: problema que resolve, referência de mercado (se houver), critérios de aceite
3. Priorização feita pelo responsável do produto

**Responsável:** Lucas Soares — solareslucas403@gmail.com

