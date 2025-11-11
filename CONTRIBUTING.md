# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o Lava Car SaaS! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Índice

- [Como Posso Contribuir?](#como-posso-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 🎯 Como Posso Contribuir?

### Reportar Bugs

Antes de criar um bug report, verifique se o problema já não foi reportado. Se você encontrar um bug:

1. Use o template de issue para bugs
2. Inclua uma descrição clara do problema
3. Adicione passos para reproduzir
4. Inclua screenshots se relevante
5. Especifique ambiente (navegador, OS, etc.)

### Sugerir Melhorias

Sugestões de melhorias são sempre bem-vindas! Ao sugerir:

1. Use o template de feature request
2. Explique por que a funcionalidade seria útil
3. Forneça exemplos de uso
4. Se possível, sugira uma implementação

### Contribuir com Código

1. Faça fork do repositório
2. Crie uma branch para sua feature
3. Desenvolva seguindo os padrões
4. Adicione testes se aplicável
5. Submeta um Pull Request

## 🔧 Configuração do Ambiente

Siga as instruções em [LOCAL_SETUP.md](LOCAL_SETUP.md) para configurar seu ambiente de desenvolvimento.

## 💻 Processo de Desenvolvimento

### 1. Fork e Clone

```bash
# Fork via GitHub interface
# Depois clone seu fork
git clone https://github.com/SEU-USUARIO/lava-car-saas.git
cd lava-car-saas
```

### 2. Configurar Upstream

```bash
git remote add upstream https://github.com/ORIGINAL-OWNER/lava-car-saas.git
git fetch upstream
```

### 3. Criar Branch

```bash
# Para features
git checkout -b feature/nome-da-feature

# Para bugs
git checkout -b fix/nome-do-bug

# Para documentação
git checkout -b docs/nome-da-doc
```

### 4. Desenvolver

```bash
npm run dev  # Inicia servidor de desenvolvimento
```

### 5. Testar

```bash
npm run build  # Verifica se build funciona
npm run lint   # Verifica código
```

## 📝 Padrões de Código

### TypeScript

```typescript
// ✅ Bom - Interfaces explícitas
interface UserProps {
  id: string;
  name: string;
  email: string;
}

export function UserCard({ id, name, email }: UserProps) {
  // ...
}

// ❌ Evitar - Tipos implícitos
export function UserCard({ id, name, email }) {
  // ...
}
```

### React Components

```typescript
// ✅ Bom - Componentes funcionais com TypeScript
export function Button({ 
  label, 
  onClick, 
  disabled = false 
}: ButtonProps) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className="btn"
    >
      {label}
    </button>
  );
}

// ❌ Evitar - Class components (sem necessidade)
export class Button extends React.Component {
  // ...
}
```

### Hooks

```typescript
// ✅ Bom - Hooks customizados com tipagem
export function useCustomers(): UseCustomersReturn {
  const [customers, setCustomers] = useState<Customer[]>([]);
  // ...
  return { customers, isLoading, error };
}

// ❌ Evitar - Sem tipagem de retorno
export function useCustomers() {
  // ...
}
```

### Estilização

```typescript
// ✅ Bom - Usar classes do Tailwind
<div className="flex items-center justify-between p-4 bg-background">

// ❌ Evitar - Estilos inline (exceto dinâmicos)
<div style={{ display: 'flex', padding: '16px' }}>
```

### Nomenclatura

- **Componentes**: PascalCase (`UserCard.tsx`)
- **Hooks**: camelCase com prefixo "use" (`useCustomers.ts`)
- **Utilitários**: camelCase (`formatDate.ts`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_ITEMS`)
- **Tipos/Interfaces**: PascalCase (`UserProps`)

## 🔖 Commit Guidelines

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/).

### Formato

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Documentação
- **style**: Formatação (não muda código)
- **refactor**: Refatoração
- **test**: Testes
- **chore**: Manutenção

### Exemplos

```bash
# Feature
git commit -m "feat(appointments): adiciona filtro por status"

# Bug fix
git commit -m "fix(auth): corrige erro de logout"

# Documentação
git commit -m "docs: atualiza guia de instalação"

# Refatoração
git commit -m "refactor(hooks): otimiza useCustomers"
```

## 🔄 Pull Request Process

### 1. Antes de Submeter

- [ ] Código segue os padrões do projeto
- [ ] Build está funcionando (`npm run build`)
- [ ] Sem erros de lint (`npm run lint`)
- [ ] Commits seguem o padrão Conventional Commits
- [ ] Documentação atualizada se necessário
- [ ] Branch atualizada com `main`

### 2. Criar Pull Request

1. Push para seu fork
2. Vá para o repositório original no GitHub
3. Clique em "New Pull Request"
4. Selecione sua branch
5. Preencha o template de PR
6. Aguarde review

### 3. Template de PR

```markdown
## Descrição
Breve descrição das mudanças

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Como Testar
Passos para testar as mudanças

## Screenshots (se aplicável)
Adicione screenshots

## Checklist
- [ ] Código segue os padrões
- [ ] Build funciona
- [ ] Sem erros de lint
- [ ] Documentação atualizada
```

### 4. Code Review

- Responda aos comentários prontamente
- Faça as alterações solicitadas
- Push das alterações para a mesma branch
- Aguarde aprovação

### 5. Merge

Após aprovação, o maintainer fará o merge.

## 🎨 Design System

Ao adicionar componentes UI:

1. Use componentes do Shadcn/UI quando possível
2. Siga o design system em `index.css`
3. Use variáveis CSS para cores
4. Mantenha consistência visual

```typescript
// ✅ Bom - Usa design system
<Button variant="primary" size="lg">

// ❌ Evitar - Estilos customizados
<Button className="bg-blue-500 px-8">
```

## 🔐 Segurança

- NUNCA commite credenciais ou secrets
- NUNCA commite arquivos `.env`
- Use `.env.example` como referência
- Reporte vulnerabilidades em privado

## 📞 Comunicação

- **Issues**: Para bugs e features
- **Pull Requests**: Para contribuições de código
- **Email**: solareslucas403@gmail.com

## 🙏 Reconhecimento

Todos os contribuidores serão adicionados ao README do projeto.

---

**Obrigado por contribuir! 🚀**

Sua ajuda torna o Lava Car SaaS cada vez melhor!
