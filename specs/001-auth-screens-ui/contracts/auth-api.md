# API Contract: Auth Endpoints

**Feature**: 001-auth-screens-ui  
**Date**: 2026-05-10  
**Status**: Draft — UI mockada; contrato para guiar integração futura com o backend  
**Consumer**: `authStore.ts` (via `authService` — a criar na feature de integração)

> Este documento define o contrato esperado entre o app mobile (consumer) e a API REST do Maré de Manguinhos para os endpoints de autenticação.  
> O app **não chama estes endpoints diretamente nesta feature** — as ações usam mocks com delay.  
> Quando a API for integrada, o `authService` será criado seguindo este contrato sem alterações nas telas.

---

## Base URL

```
https://api.maremanguinhos.com.br/v1
```

> Configurado em `src/services/api.ts` (a criar na feature de integração) como instância Axios base.

---

## Endpoint 1 — Login

### `POST /auth/login`

Autentica um usuário existente com e-mail e senha.

**Request**

```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "minhasenha123"
}
```

**Request Body**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `email` | string | ✅ | E-mail cadastrado. Formato válido RFC 5322. |
| `password` | string | ✅ | Senha do usuário. |

**Response 200 — Sucesso**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "uuid-v4",
    "nome": "João da Silva",
    "email": "usuario@exemplo.com",
    "telefone": "27999999999"
  }
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `token` | string | JWT de sessão. O app armazena em `expo-secure-store`. |
| `usuario` | `Usuario` | Dados do usuário autenticado. |

**Response 401 — Credenciais Inválidas**

```json
{
  "error": "invalid_credentials",
  "message": "E-mail ou senha incorretos."
}
```

> O app exibe "E-mail ou senha incorretos." como erro geral na tela. Incrementa o contador de tentativas (bloqueio após 5).

**Response 422 — Validação**

```json
{
  "error": "validation_failed",
  "fields": {
    "email": "Formato de e-mail inválido."
  }
}
```

> Validação prévia na UI deve evitar chegar a este estado.

---

## Endpoint 2 — Registro

### `POST /auth/register`

Cria uma nova conta de consumidor e retorna token de sessão (auto-login).

**Request**

```http
POST /auth/register
Content-Type: application/json

{
  "nome": "Maria das Dores",
  "email": "maria@exemplo.com",
  "password": "minhasenha123",
  "telefone": "27988887777",
  "bairro": "Manguinhos"
}
```

**Request Body**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `nome` | string | ✅ | Nome completo. Mínimo 3 caracteres. |
| `email` | string | ✅ | E-mail único. Formato válido. |
| `password` | string | ✅ | Senha. Mínimo 8 caracteres. |
| `telefone` | string | ✅ | Apenas dígitos (DDD + número). Mínimo 10 dígitos. |
| `bairro` | string | ❌ | Bairro/localidade do usuário. Opcional. |

**Response 201 — Sucesso**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "uuid-v4",
    "nome": "Maria das Dores",
    "email": "maria@exemplo.com",
    "telefone": "27988887777"
  }
}
```

> O app recebe o token, armazena no `expo-secure-store` e navega automaticamente para a vitrine.

**Response 409 — E-mail Duplicado**

```json
{
  "error": "email_conflict",
  "message": "Este e-mail já está cadastrado."
}
```

> O app exibe erro inline no campo de e-mail com o texto "Este e-mail já está cadastrado" + link "Fazer login".

**Response 422 — Validação**

```json
{
  "error": "validation_failed",
  "fields": {
    "email": "Formato de e-mail inválido.",
    "telefone": "Telefone deve conter apenas dígitos.",
    "password": "A senha deve ter no mínimo 8 caracteres."
  }
}
```

---

## Erros Genéricos

| Status | `error` | Comportamento no App |
|--------|---------|----------------------|
| 500 | `server_error` | Exibe mensagem genérica "Ocorreu um erro. Tente novamente." |
| 0 / timeout | `network_error` | Exibe "Sem conexão. Verifique sua internet." |

---

## Observações de Implementação Futura

1. **Header de autenticação**: Para endpoints protegidos (vitrine, carrinho, etc.), o token JWT deve ser enviado como `Authorization: Bearer <token>`. Configurar no Axios interceptor em `api.ts`.
2. **Refresh token**: Não definido no MVP. Quando o token expirar, o app deve deslogar o usuário e redirecionar para o login.
3. **HTTPS obrigatório**: Todos os endpoints devem usar HTTPS. Nenhuma comunicação em HTTP plain.
