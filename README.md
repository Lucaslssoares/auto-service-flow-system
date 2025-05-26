
# Lava Car System - Sistema de Gestão

Sistema completo de gestão para lava-jatos desenvolvido em React com TypeScript, integrado ao Supabase para funcionalidades de backend.

## 🚀 Funcionalidades Principais

- **Autenticação Segura**: Login/logout com proteção de rotas
- **Gestão de Clientes**: Cadastro e busca de clientes
- **Controle de Veículos**: Registro de veículos por cliente
- **Catálogo de Serviços**: Gestão de serviços oferecidos
- **Equipe**: Gerenciamento de funcionários
- **Agendamentos**: Sistema de agendamento de serviços
- **Trabalho em Equipe**: Divisão de lucros entre funcionários
- **Execução**: Acompanhamento de serviços em andamento
- **Financeiro**: Relatórios e análises financeiras

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, Shadcn/UI, Radix UI
- **Backend**: Supabase (Auth, Database, RLS)
- **Roteamento**: React Router DOM
- **Gerenciamento de Estado**: TanStack Query
- **Formulários**: React Hook Form + Zod
- **Ícones**: Lucide React

## 📋 Pré-requisitos

- Node.js 18+ e npm
- Conta no Supabase (para produção)

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd lava-car-system
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configuração de Ambiente

#### Desenvolvimento
O sistema está configurado para usar credenciais de desenvolvimento por padrão.

#### Produção
Configure as seguintes variáveis de ambiente:

```bash
# .env.production
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 4. Execute o projeto

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

## 🗄️ Estrutura do Banco de Dados

O sistema utiliza as seguintes tabelas principais:

- `profiles`: Perfis de usuários autenticados
- `customers`: Dados dos clientes
- `vehicles`: Veículos dos clientes
- `services`: Catálogo de serviços
- `employees`: Funcionários da empresa
- `appointments`: Agendamentos de serviços
- `service_executions`: Execução de serviços (trabalho em equipe)
- `payment_transactions`: Transações financeiras

## 🔐 Segurança

- **Row Level Security (RLS)**: Todas as tabelas possuem políticas RLS
- **Autenticação**: Sistema de autenticação integrado ao Supabase
- **Proteção de Rotas**: Rotas protegidas para usuários autenticados
- **Gerenciamento Seguro de Credenciais**: Variáveis de ambiente para produção

## 📱 Responsividade

O sistema é totalmente responsivo, otimizado para:
- 📱 Dispositivos móveis (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)

## 🛡️ Tratamento de Erros

- **Error Boundaries**: Captura erros de renderização
- **Tratamento Assíncrono**: Hooks especializados para erros de API
- **Feedback Visual**: Toasts e mensagens de erro para o usuário
- **Logging**: Sistema de logs para monitoramento em produção

## 🔧 Desenvolvimento

### Estrutura de Pastas

```
src/
├── components/          # Componentes reutilizáveis
├── pages/              # Páginas da aplicação
├── hooks/              # Hooks customizados
├── types/              # Definições de tipos TypeScript
├── config/             # Configurações da aplicação
├── integrations/       # Integrações externas (Supabase)
└── data/              # Dados mockados (apenas desenvolvimento)
```

### Padrões de Código

- **TypeScript**: Tipagem estrita em todo o projeto
- **Componentes Funcionais**: Uso de hooks do React
- **Custom Hooks**: Lógica de negócio isolada em hooks
- **Error Handling**: Tratamento consistente de erros
- **Responsividade**: Mobile-first design

## 📦 Build e Deploy

### Build Otimizado

```bash
npm run build
```

O build inclui:
- ✅ Minificação com Terser
- ✅ Code splitting automático
- ✅ Otimização de assets
- ✅ Tree shaking

### Deploy

1. **Build da aplicação**
2. **Configurar variáveis de ambiente no servidor**
3. **Configurar Supabase URLs no painel administrativo**
4. **Deploy dos arquivos estáticos**

## 🔍 Monitoramento

Para produção, recomenda-se integrar:
- Serviços de logging (ex: Sentry)
- Analytics (ex: Google Analytics)
- Monitoramento de performance

## 🤝 Contribuição

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através:
- Email: solareslucas403@gmail.com

---

**Desenvolvido com para otimizar a gestão de lava-jatos**
