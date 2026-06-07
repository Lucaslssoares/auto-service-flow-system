# Guia de Contribuição

Última atualização: 2026-06-07

---

## Setup

```bash
git clone https://github.com/Lucaslssoares/auto-service-flow-system.git
cd auto-service-flow-system
npm install
npm run dev
```

---

## Padrões de código

### Nomenclatura

| Tipo | Padrão | Exemplo |
|---|---|---|
| Componente React | PascalCase | `CashRegister.tsx` |
| Hook | camelCase com `use` | `useCashRegister.ts` |
| Constante de query key | array tipado | `["cash_registers", "open"] as const` |
| Arquivo de utilitário | camelCase | `security.ts` |
| Tipo/Interface | PascalCase | `CashMovement` |

### Componentes

- Máximo de ~150 linhas por arquivo. Extraia sub-componentes se precisar.
- Sem `import React` — projeto usa React 17+ JSX transform.
- Componentes de dialog ficam no mesmo arquivo da página que os abre (se pequenos) ou em `components/modulo/`.

### Hooks

Um hook por arquivo. Query keys sempre como constante no topo.

```typescript
// Padrão correto
const CUSTOMERS_KEY = ["customers"] as const;

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CustomerInsert) => {
      const { error } = await supabase.from("customers").insert(data);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: CUSTOMERS_KEY }),
    onError: (err: Error) => toast.error(err.message),
  });
}
```

### Banco de dados

- Toda nova tabela precisa de `ENABLE ROW LEVEL SECURITY` + pelo menos 1 policy.
- Toda função `SECURITY DEFINER` precisa de `REVOKE EXECUTE FROM PUBLIC` + `GRANT` seletivo.
- Migrations em `supabase/migrations/` com nome `YYYYMMDDHHMMSS-descricao.sql`.
- Após criar a tabela, adicionar os tipos em `src/integrations/supabase/types.ts`.

### Commits

Formato: `tipo: descrição em português`

| Tipo | Uso |
|---|---|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `refactor:` | Refatoração sem mudança de comportamento |
| `docs:` | Documentação |
| `chore:` | Dependências, configuração |

Exemplos:
```
feat: controle de caixa — abertura, sangria, suprimento, fechamento
fix: trigger handle_new_user falhava ao criar user_roles
docs: atualizar DATABASE.md com tabelas de caixa
```

> Não incluir `Co-Authored-By: Claude` nos commits.

---

## Fluxo de trabalho

```bash
# Criar branch
git checkout -b feat/nome-da-feature

# Sincronizar com main antes de commitar (Lovable faz push direto na main)
git pull origin main --rebase

# Commitar
git add arquivo1 arquivo2
git commit -m "feat: descrição"

# Push
git push origin feat/nome-da-feature
```

---

## Aplicar migrations no Supabase

```powershell
$sql = [System.IO.File]::ReadAllText("supabase/migrations/ARQUIVO.sql")
$body = @{ query = $sql } | ConvertTo-Json -Depth 5
$headers = @{
  Authorization = "Bearer SEU_PAT"
  "Content-Type" = "application/json"
}
Invoke-RestMethod -Method Post `
  -Uri "https://api.supabase.com/v1/projects/bciuykfoinbgkrsiljpg/database/query" `
  -Headers $headers -Body $body
```

---

## Estrutura de uma nova feature

Exemplo — adicionar módulo "Promoções":

```
1. supabase/migrations/TIMESTAMP-promotions.sql
   CREATE TABLE, ENABLE RLS, CREATE POLICY, CREATE INDEX

2. src/integrations/supabase/types.ts
   Adicionar Row/Insert/Update da tabela

3. src/hooks/usePromotions.ts
   usePromotions(), useCreatePromotion(), useDeletePromotion()

4. src/pages/Promotions.tsx

5. src/App.tsx → adicionar rota /promocoes

6. src/components/SidebarNav.tsx → adicionar item de menu
```

---

## Checklist antes de fazer push

- [ ] `npm run lint` sem erros
- [ ] TypeScript compila sem erros
- [ ] Migration aplicada no Supabase
- [ ] Tipos atualizados em `src/integrations/supabase/types.ts`
- [ ] README ou ROADMAP atualizado se necessário
