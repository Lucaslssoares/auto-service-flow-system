# 🚀 Guia de Configuração Local - Lava Car SaaS

Este guia contém instruções detalhadas para configurar e executar o projeto localmente.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** versão 18 ou superior
- **npm** (geralmente vem com Node.js)
- **Git** para clonar o repositório
- Conta no **Supabase** (para o backend)

### Verificar Instalações

```bash
node --version  # Deve mostrar v18.x.x ou superior
npm --version   # Deve mostrar 8.x.x ou superior
git --version   # Qualquer versão recente
```

## 🔧 Passo 1: Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/lava-car-saas.git
cd lava-car-saas
```

## 📦 Passo 2: Instalar Dependências

```bash
npm install
```

Este comando instalará todas as dependências listadas no `package.json`.

## 🗄️ Passo 3: Configurar o Supabase

### 3.1 Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha os dados:
   - **Name**: Lava Car SaaS
   - **Database Password**: Escolha uma senha forte (guarde-a!)
   - **Region**: Escolha a região mais próxima
5. Aguarde a criação do projeto (pode levar alguns minutos)

### 3.2 Obter Credenciais

Após a criação do projeto:

1. Vá em **Settings** → **API**
2. Copie as seguintes informações:
   - **Project URL**: `https://[seu-projeto].supabase.co`
   - **anon public key**: Uma chave longa começando com `eyJ...`

### 3.3 Configurar Variáveis de Ambiente

O projeto já está pré-configurado para desenvolvimento, mas você pode sobrescrever as configurações criando um arquivo `.env.local`:

```bash
# Crie o arquivo .env.local na raiz do projeto
touch .env.local
```

Adicione as seguintes variáveis (opcional, pois já existem valores padrão):

```env
VITE_SUPABASE_URL=https://ppztpzbgbijpxcwgelcg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwenRwemJnYmlqcHhjd2dlbGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NjExNjEsImV4cCI6MjA2MzUzNzE2MX0.kh8wbyiceqsZa36CcgFVldd-Mn-ZkDcpmALDO7v8Kis
```

**⚠️ IMPORTANTE**: Se você criar seu próprio projeto Supabase, substitua os valores acima pelas suas credenciais.

## 🗃️ Passo 4: Executar Migrações do Banco de Dados

O projeto utiliza um banco de dados Supabase com várias tabelas. As migrações estão em `supabase/migrations/`.

### Opção A: Usar Supabase CLI (Recomendado)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login no Supabase
supabase login

# Linkar com seu projeto
supabase link --project-ref ppztpzbgbijpxcwgelcg

# Aplicar migrações
supabase db push
```

### Opção B: Executar Manualmente via Dashboard

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **SQL Editor**
3. Execute os arquivos SQL da pasta `supabase/migrations/` em ordem cronológica

## ▶️ Passo 5: Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em: **http://localhost:8080**

## 🎯 Passo 6: Criar Primeiro Usuário

### 6.1 Acessar a Página de Cadastro

1. Abra o navegador em `http://localhost:8080/auth`
2. Clique em "Criar conta"

### 6.2 Cadastrar Usuário

Preencha os dados:
- **Nome completo**
- **Email**
- **Senha** (mínimo 6 caracteres)

### 6.3 Confirmar Email (Desenvolvimento)

No desenvolvimento, o Supabase pode estar configurado para auto-confirmar emails. Se não:

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **Authentication** → **Users**
3. Localize o usuário criado
4. Clique nos 3 pontos → **Confirm email**

### 6.4 Tornar Usuário Admin (Importante!)

Para acessar todas as funcionalidades, o primeiro usuário deve ser admin:

1. No Supabase Dashboard, vá em **SQL Editor**
2. Execute o seguinte SQL (substitua o email):

```sql
-- Buscar o ID do usuário
SELECT id, email FROM auth.users WHERE email = 'seu-email@exemplo.com';

-- Adicionar role de admin (use o ID retornado acima)
INSERT INTO public.user_roles (user_id, role)
VALUES ('UUID-DO-USUARIO', 'admin');
```

## 🔍 Verificar Instalação

Após fazer login, você deve ter acesso a:

- **Dashboard** (/) - Visão geral
- **Clientes** (/customers) - Gestão de clientes
- **Veículos** (/vehicles) - Gestão de veículos
- **Serviços** (/services) - Catálogo de serviços
- **Funcionários** (/employees) - Gestão de equipe
- **Agendamentos** (/appointments) - Calendário
- **Execução** (/execution) - Controle de serviços
- **Financeiro** (/finance) - Relatórios
- **Permissões** (/permissions) - Gestão de usuários
- **Configurações** (/settings) - Personalização

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev                 # Inicia servidor de desenvolvimento

# Build
npm run build              # Cria build de produção
npm run preview            # Preview da build

# Linting
npm run lint               # Verificar código

# Supabase (com CLI instalado)
supabase status            # Ver status do projeto
supabase db reset          # Resetar banco (cuidado!)
supabase functions deploy  # Deploy de edge functions
```

## 🐛 Solução de Problemas Comuns

### Erro: "useNavigate() may be used only in the context of a Router"

**Causa**: Componente tentando usar navegação fora do contexto do Router.

**Solução**: O erro já foi corrigido, mas se aparecer novamente, certifique-se de que o `App.tsx` está envolvendo corretamente com `BrowserRouter`.

### Erro: "Failed to fetch" ao fazer login

**Causa**: Problemas de conexão com Supabase ou credenciais incorretas.

**Solução**:
1. Verifique as variáveis de ambiente em `.env`
2. Confirme que o projeto Supabase está ativo
3. Verifique sua conexão com a internet

### Página em branco após build

**Causa**: Problemas com rotas em produção.

**Solução**: Configure o servidor para redirecionar todas as rotas para `index.html` (SPA).

### Erro de permissões no banco

**Causa**: Políticas RLS (Row Level Security) não configuradas.

**Solução**: Execute todas as migrações do banco de dados em ordem.

## 📊 Estrutura do Banco de Dados

O projeto possui as seguintes tabelas principais:

- **profiles** - Perfis de usuários
- **user_roles** - Papéis/permissões dos usuários
- **customers** - Clientes
- **vehicles** - Veículos dos clientes
- **services** - Catálogo de serviços
- **employees** - Funcionários
- **appointments** - Agendamentos
- **service_executions** - Execução de serviços
- **payment_transactions** - Transações financeiras
- **employee_commissions** - Comissões dos funcionários

Todas as tabelas possuem **Row Level Security (RLS)** habilitado para segurança.

## 🔐 Segurança

### Desenvolvimento Local

- As credenciais no código são apenas para desenvolvimento
- **NUNCA** commite arquivos `.env` com credenciais reais
- Use `.env.local` para sobrescrever configurações localmente

### Produção

- Use variáveis de ambiente do servidor
- Configure HTTPS
- Habilite políticas de CORS adequadas
- Revise todas as políticas RLS

## 📞 Suporte

Se encontrar problemas:

1. Verifique a seção de solução de problemas acima
2. Consulte o [README.md](README.md) principal
3. Verifique os logs do console do navegador (F12)
4. Entre em contato: solareslucas403@gmail.com

## 🚀 Próximos Passos

Após configurar o ambiente local:

1. **Explore o sistema** - Navegue pelas diferentes seções
2. **Adicione dados de teste** - Crie clientes, veículos, serviços
3. **Teste o fluxo** - Faça um agendamento completo
4. **Personalize** - Ajuste cores, logos, configurações
5. **Deploy** - Quando pronto, faça o deploy para produção

---

**✅ Configuração concluída com sucesso!**

Você agora tem o Lava Car SaaS rodando localmente e está pronto para começar o desenvolvimento!
