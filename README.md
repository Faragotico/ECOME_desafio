Módulo fullstack de repositório acadêmico construído com Next.js, Express.js, Prisma e PostgreSQL.

Backend - Node.js, Express.js, Prisma ORM, PostgreSQL, Zod
Frontend - Next.js 14 (App Router), Tailwind CSS, Axios


- Node.js 18+
- PostgreSQL rodando localmente (ou via Docker)

1. baixar todos os arquivos do github
    - abrir um cmd local
    - cd .../ECOME_DESAFIO_MAIN/backend
    - criar arquivo .env com o modelo do .env.exemple configurando para o postgre local
        - Pode ser manualmente criado o .env dentro de backend
            - copia conteudo de .env.example adiciona usuario e senha no DATABASE_URL
        - copy .env.example .env
            - adiciona usuario e senha no DATABASE_URL

2. cnofiguração dentro de backend
    - instalar node modules
        - npm install
    - criar a database com o prisma
        - npx prisma db push
3. rodar aplicação backend lógico
    - npm run dev
        - A API estará disponível em `http://localhost:3001`

4. configuração do frontent
    - abrir outro cmd local
        - cd .../ECOME_DESAFIO_MAIN/frontend
    - instalar node modules
        - npm install
    - criar arquivo .env com o modelo do .env.example
        - Pode ser manualmente criado o .env dentro de frontend
            - copia conteudo de .env.example
        - copy .env.example .env
5. rodar frontend
    - npm run dev
        - O frontend estará disponível em `http://localhost:3000`

## Variáveis de ambiente

### Backend — `backend/.env`

| `DATABASE_URL` | `postgresql://user:pass@localhost:5432/ecome_db` | String de conexão com o PostgreSQL |
| `PORT` | `3001` | Porta do servidor Express |

### Frontend — `frontend/.env`

| Variável | Exemplo | Descrição |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | URL base da API backend |

## Endpoints da API

### Categorias
| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/categories` | Criar categoria |
| `GET` | `/categories` | Listar todas |
| `GET` | `/categories/:id` | Detalhes + publicações |
| `PATCH` | `/categories/:id` | Editar |
| `DELETE` | `/categories/:id` | Remover |

### Publicações
| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/posts` | Criar publicação |
| `GET` | `/posts?search=&categoryId=` | Listar com filtros |
| `GET` | `/posts/:id` | Detalhes + comentários |
| `PATCH` | `/posts/:id` | Editar |
| `DELETE` | `/posts/:id` | Remover |

### Comentários
| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/posts/:id/comments` | Adicionar comentário |
| `GET` | `/comments/:id` | Buscar comentário |
| `PATCH` | `/comments/:id` | Editar comentário |
| `DELETE` | `/comments/:id` | Remover comentário |


- **Zod no backend** para validação tipada com mensagens de erro claras e padronizadas
- **Middleware global de erros** centraliza o tratamento de erros do Prisma e do Zod, evitando try/catch repetitivo nas rotas
- **App Router (Next.js 14)** com componentes `"use client"` apenas onde há interatividade (formulários, estado, eventos)
- **`PostForm` e `CategoryForm` reutilizáveis** — o mesmo componente serve para criação e edição, recebendo ou não um objeto existente como prop
- **Deleção em cascata manual** — comentários são removidos antes do post para garantir integridade referencial sem depender de `onDelete: Cascade` no schema
- **Feedback visual em três estados** — loading (spinner), sucesso (verde) e erro (vermelho) via componente `Toast` reutilizável
- **Confirmação de exclusão** via modal `ConfirmDialog` para evitar remoções acidentais
