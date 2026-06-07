# Setup Local

Última atualização: 2026-06-07

---

## Pré-requisitos

- Node.js 18+
- npm 8+
- Git

---

## Instalação rápida

```bash
git clone https://github.com/Lucaslssoares/auto-service-flow-system.git
cd auto-service-flow-system
npm install
npm run dev
```

O `.env` já está configurado apontando para o projeto Supabase de produção. A aplicação abre em **http://localhost:8080**.

---

## Variáveis de ambiente

O arquivo `.env` na raiz já contém:

```env
VITE_SUPABASE_PROJECT_ID="bciuykfoinbgkrsiljpg"
VITE_SUPABASE_URL="https://bciuykfoinbgkrsiljpg.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjaXV5a2ZvaW5iZ2tyc2lsanBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3ODcwNzAsImV4cCI6MjA5NjM2MzA3MH0.YWEYLkhxkPRmw35rT4FvRB2gSS7vi7Qyq_LjaQMKFhM"
```

> A anon key é segura para commitar — ela não dá acesso admin. O controle de acesso é feito por RLS no banco.

---

## Login padrão

Admins pré-configurados pelo trigger de criação de usuário:

| Email | Permissão |
|---|---|
| `solareslucas403@gmail.com` | admin |
| `solareslucas403@gmail.com` | admin |

Qualquer outro e-mail cadastrado recebe role `user`.

---

## Aplicar migrações em novo projeto Supabase

Se precisar apontar para um projeto diferente, aplique os SQLs nesta ordem via Supabase Dashboard → SQL Editor:

1. `supabase/schema_completo.sql`
2. `supabase/migrations/20260607000001-security-hardening.sql`
3. `supabase/migrations/20260607000002-status-history.sql`
4. `supabase/migrations/20260607000003-cash-register.sql`
5. `supabase/migrations/20260607000004-capacity.sql`

Após aplicar, habilite auto-confirm de email:

```bash
curl -X PATCH https://api.supabase.com/v1/projects/SEU_PROJECT_REF/config/auth \
  -H "Authorization: Bearer SEU_PAT" \
  -H "Content-Type: application/json" \
  -d '{"mailer_autoconfirm": true}'
```

---

## Comandos disponíveis

```bash
npm run dev      # Servidor de desenvolvimento (localhost:8080)
npm run build    # Build de produção (dist/)
npm run preview  # Preview da build
npm run lint     # ESLint
```

---

## Solução de problemas

### "Database error saving new user"
O trigger `handle_new_user` falhou. Verifique se o schema foi aplicado corretamente, especialmente `schema_completo.sql` que contém a função e o trigger.

### Página em branco após login
Verifique se o `user_roles` existe para o usuário. Abra o Supabase Dashboard → Table Editor → `user_roles` e confira.

### Slots de horário não aparecem no formulário de agendamento
A tabela `business_config` deve ter exatamente 1 linha. Execute:
```sql
INSERT INTO public.business_config DEFAULT VALUES ON CONFLICT (id) DO NOTHING;
```

### "Failed to fetch" ao abrir o sistema
Verifique se as variáveis de ambiente estão corretas no `.env` e se o projeto Supabase está ativo em https://supabase.com/dashboard.

### Caixa: erro ao abrir sessão
Pode haver um caixa já aberto para o usuário. Verifique em `cash_registers` se há linha com `status = 'open'` para o seu `user_id`.

---

## Configurar Lovable

Se usar o Lovable para edição visual:

1. No Lovable, vá em **Settings → Supabase**
2. Conecte ao projeto `bciuykfoinbgkrsiljpg`
3. O `.env` já tem as credenciais corretas — o Lovable vai ler automaticamente

> Quando o Lovable fizer push de mudanças, faça `git pull origin main --rebase` antes de fazer novos commits locais para evitar conflito.
