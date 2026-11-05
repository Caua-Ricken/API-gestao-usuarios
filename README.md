# API de Gestão de Usuários

API REST para gerenciamento de usuários, desenvolvida com Node.js, TypeScript, Express, Prisma e MySQL.

O projeto permite cadastrar, consultar, atualizar, desativar e excluir usuários, com validação de dados, paginação, logs estruturados e testes automatizados.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

## Funcionalidades

- Cadastro de usuários com informações pessoais e endereço.
- Listagem com paginação.
- Consulta por ID.
- Atualização parcial dos dados.
- Ativação e desativação de usuários.
- Exclusão definitiva de registros.
- Validação e normalização dos dados com Zod.
- Email único por usuário.
- Tratamento centralizado de erros.
- Logs de requisições e operações com Pino.
- Testes HTTP automatizados com Vitest e Supertest.
- API e MySQL executados com Docker Compose.
- Persistência dos dados em volume Docker.

## Tecnologias

| Tecnologia | Utilização |
|---|---|
| Node.js | Execução da aplicação |
| TypeScript | Tipagem estática |
| Express | Servidor HTTP e rotas |
| Prisma ORM 7 | Acesso ao banco e migrations |
| MySQL 8.4 | Banco de dados relacional |
| Zod | Validação dos dados recebidos |
| Pino e Pino HTTP | Logs estruturados |
| Vitest | Execução dos testes |
| Supertest | Testes das requisições HTTP |
| Docker Compose | Execução dos containers |

## Organização do código

O backend está na pasta `API-User/BackEnd`.

| Caminho no backend | Responsabilidade |
|---|---|
| `prisma/schema.prisma` | Modelagem dos dados |
| `prisma/migrations/` | Histórico das alterações no banco |
| `prisma.config.ts` | Configuração do Prisma CLI |
| `src/app.ts` | Configuração do Express e dos middlewares |
| `src/index.ts` | Conexão com o banco e inicialização do servidor |
| `src/config/` | Configuração do logger |
| `src/controllers/` | Recebimento das requisições e envio das respostas |
| `src/services/` | Operações de acesso ao banco |
| `src/routes/` | Definição dos endpoints |
| `src/validators/` | Regras de validação |
| `src/middlewares/` | Logs e tratamento de erros |
| `src/db/` | Instância do Prisma Client |
| `src/generated/prisma/` | Código gerado pelo Prisma |
| `tests/` | Testes automatizados |

## Executando com Docker

### Pré-requisitos

- Git.
- Docker com Docker Compose.
- Docker Desktop iniciado, caso esteja utilizando Windows.

### 1. Clone o repositório

```bash
git clone https://github.com/Caua-Ricken/API-gestao-usuarios.git
cd API-gestao-usuarios/API-User/BackEnd
```

### 2. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`.

No PowerShell:

```powershell
Copy-Item .env.example .env
```

No Linux ou macOS:

```bash
cp .env.example .env
```

Exemplo de configuração para desenvolvimento:

```env
PORT=3000

MYSQL_PORT=3307
MYSQL_ROOT_PASSWORD=troque_a_senha_root
MYSQL_DATABASE=usuarios_api
MYSQL_USER=usuario_api
MYSQL_PASSWORD=troque_a_senha_usuario

DATABASE_URL="mysql://usuario_api:troque_a_senha_usuario@localhost:3307/usuarios_api"
```

O Compose utiliza essas variáveis para configurar o banco e monta a conexão interna da API usando `mysql:3306`.

A `DATABASE_URL` do `.env` permite executar comandos do Prisma pelo computador, utilizando a porta publicada pelo container.

Se o usuário ou a senha contiver caracteres especiais, eles precisam ser codificados corretamente na URL de conexão.

O arquivo `.env` não deve ser enviado ao GitHub. Utilize `.env.example` para documentar as variáveis necessárias.

### 3. Inicie os serviços

```bash
docker compose up -d --build
```

Durante a inicialização:

1. O MySQL é iniciado.
2. O healthcheck verifica se o banco aceita consultas.
3. A API aplica as migrations pendentes.
4. O servidor HTTP é iniciado.

Endereço padrão da API:

```text
http://localhost:3000
```

### 4. Confira os containers

```bash
docker compose ps
```

### Comandos úteis

| Objetivo | Comando |
|---|---|
| Iniciar os serviços | `docker compose up -d` |
| Reconstruir após alterar código ou dependências | `docker compose up -d --build` |
| Parar os serviços | `docker compose stop` |
| Remover containers e rede, mantendo o volume | `docker compose down` |
| Acompanhar os logs da API | `docker compose logs -f --tail=50 api` |
| Acompanhar os logs do MySQL | `docker compose logs -f mysql` |

Execute os comandos na pasta que contém o `compose.yaml`.

Os registros ficam armazenados no volume `mysql_dados`. O comando `docker compose down -v` remove esse volume e apaga os dados desse banco.

As credenciais de inicialização do MySQL são aplicadas quando o volume está vazio. Alterar as senhas no `.env` não modifica automaticamente as credenciais de um banco já inicializado.

## Acessando o banco pelo MySQL Workbench

Com o container do MySQL em execução, crie uma conexão:

| Campo | Valor |
|---|---|
| Hostname | `127.0.0.1` |
| Port | Valor de `MYSQL_PORT`, por padrão `3307` |
| Username | Valor de `MYSQL_USER` |
| Password | Valor de `MYSQL_PASSWORD` |
| Default Schema | Valor de `MYSQL_DATABASE` |

O Workbench é apenas um cliente: não é necessário criar essa conexão para a API funcionar.

## Endpoints

URL base do recurso:

```text
http://localhost:3000/api/usuario
```

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/usuario` | Cadastrar usuário |
| `GET` | `/api/usuario` | Listar usuários com paginação |
| `GET` | `/api/usuario/:id` | Buscar usuário por ID |
| `PATCH` | `/api/usuario/:id` | Atualizar parcialmente |
| `DELETE` | `/api/usuario/:id` | Excluir definitivamente |

Nos exemplos abaixo, utilize `Content-Type: application/json` nas requisições com body.

### Cadastrar usuário

```http
POST /api/usuario
```

Body:

```json
{
  "nome": "Cauã Ricken",
  "email": "caua@exemplo.com",
  "telefone": "48999999999",
  "dataNascimento": "2006-05-15",
  "cep": "88750-000",
  "rua": "Rua das Flores",
  "numero": "120A",
  "complemento": "Apartamento 201",
  "bairro": "Centro",
  "cidade": "Braço do Norte",
  "estado": "SC"
}
```

Nome e email são obrigatórios. Os demais campos do exemplo são opcionais.

O ID, o status inicial e as datas de criação e atualização são definidos automaticamente.

Resposta de sucesso: `201 Created`.

Exemplo de resposta:

```json
{
  "id": 1,
  "nome": "Cauã Ricken",
  "email": "caua@exemplo.com",
  "telefone": "48999999999",
  "dataNascimento": "2006-05-15T00:00:00.000Z",
  "cep": "88750-000",
  "rua": "Rua das Flores",
  "numero": "120A",
  "complemento": "Apartamento 201",
  "bairro": "Centro",
  "cidade": "Braço do Norte",
  "estado": "SC",
  "ativo": true,
  "criadoEm": "2026-11-05T12:00:00.000Z",
  "atualizadoEm": "2026-11-05T12:00:00.000Z"
}
```

### Listar usuários

```http
GET /api/usuario?pagina=1&limite=10
```

| Parâmetro | Padrão | Regra |
|---|---|---|
| `pagina` | `1` | Inteiro positivo, até `1000000` |
| `limite` | `10` | Inteiro de `1` a `100` |

A listagem retorna os registros por ID em ordem decrescente, incluindo usuários ativos e inativos.

Resposta de sucesso: `200 OK`.

Formato:

```json
{
  "usuarios": [],
  "total": 0,
  "pagina": 1,
  "limite": 10,
  "totalPaginas": 0
}
```

Quando houver registros, o array `usuarios` conterá os objetos dos usuários.

### Buscar por ID

```http
GET /api/usuario/1
```

Resposta de sucesso: `200 OK`, com o objeto do usuário.

Se o registro não existir:

```json
{
  "mensagem": "Usuário não encontrado."
}
```

Status: `404 Not Found`.

### Atualizar usuário

```http
PATCH /api/usuario/1
```

Envie apenas os campos que deseja alterar:

```json
{
  "telefone": "48988888888",
  "cidade": "Tubarão",
  "estado": "SC"
}
```

Resposta de sucesso: `200 OK`, com o usuário atualizado.

Campos omitidos mantêm os valores existentes. Para limpar um campo opcional, envie `null`:

```json
{
  "complemento": null
}
```

### Desativar ou reativar usuário

Utilize a mesma rota de atualização:

```http
PATCH /api/usuario/1
```

Desativar:

```json
{
  "ativo": false
}
```

Reativar:

```json
{
  "ativo": true
}
```

Essa operação altera o status e preserva o registro no banco.

### Excluir usuário

```http
DELETE /api/usuario/1
```

Resposta de sucesso: `204 No Content`, sem body.

Essa operação exclui definitivamente o usuário.

## Validações

- Nome com 2 a 100 caracteres, após remover espaços nas extremidades.
- Email válido, único e com até 191 caracteres.
- Email normalizado para letras minúsculas.
- Data de nascimento no formato `YYYY-MM-DD`, sem datas futuras.
- CEP com 8 dígitos, com ou sem hífen.
- Estado validado como UF brasileira e normalizado para maiúsculas.
- ID inteiro positivo.
- Atualização com pelo menos um campo.
- Campos desconhecidos rejeitados.
- Campos opcionais aceitam `null`.

## Respostas HTTP

| Status | Significado |
|---|---|
| `200` | Consulta ou atualização concluída |
| `201` | Usuário cadastrado |
| `204` | Usuário excluído, sem conteúdo na resposta |
| `400` | Dados, ID, paginação ou JSON inválidos |
| `404` | Usuário ou rota não encontrados |
| `409` | Email já cadastrado |
| `500` | Erro interno do servidor |

Exemplo de email repetido:

```json
{
  "mensagem": "Este email já está cadastrado."
}
```

Erros de validação retornam uma mensagem e uma lista de problemas:

```json
{
  "mensagem": "Dados inválidos.",
  "erros": [
    {
      "campo": "email",
      "mensagem": "Mensagem de validação do email"
    }
  ]
}
```

O texto específico de cada validação pode variar conforme a regra e a versão do Zod.

## Testando pelo Postman

1. Inicie os containers.
2. Crie uma requisição usando um dos endpoints documentados.
3. Para cadastrar ou atualizar, selecione **Body → raw → JSON**.
4. Envie o JSON de exemplo.
5. Confira o status HTTP e o conteúdo retornado.

## Testes automatizados

Os testes utilizam Vitest e Supertest, substituindo a conexão do Prisma por mocks.

Eles verificam comportamentos como:

- Cadastro e normalização dos dados.
- Rejeição de email inválido.
- Rejeição de campos controlados pelo servidor.
- Tratamento de email duplicado.
- Atualização parcial e preservação de `null`.
- Rejeição de atualização vazia.
- Validação do ID.
- Tratamento de usuário inexistente.
- Exclusão com resposta sem conteúdo.

### Executar no computador

Com uma versão do Node.js compatível com as dependências do projeto:

```bash
npm ci
npx prisma generate
npm test
```

Executar novamente ao salvar alterações:

```bash
npm run test:watch
```

Verificar os tipos do TypeScript:

```bash
npm run typecheck
```

Esses testes não precisam do MySQL em execução. Eles verificam o comportamento HTTP e a integração entre as camadas da aplicação, com o Prisma simulado.

Não verificam a conexão nem as restrições de um MySQL real.

### Executar no Docker

```bash
docker compose build api
docker compose run --rm --no-deps api npm test
```

## Logs

A API utiliza Pino e Pino HTTP para registrar:

- Método e caminho da requisição.
- Status HTTP.
- Tempo de resposta.
- Identificador da requisição.
- Operações de cadastro, atualização e exclusão.
- Erros inesperados.

Acompanhar:

```bash
docker compose logs -f --tail=50 api
```

O header `X-Request-Id` permite relacionar uma resposta aos logs daquela requisição.

Os logs HTTP não incluem automaticamente o body, os headers ou os parâmetros de busca.

| Nível | Utilização |
|---|---|
| `info` | Operações e requisições concluídas |
| `warn` | Respostas HTTP de erro do cliente |
| `error` | Falhas inesperadas |
| `fatal` | Falhas que impedem iniciar a aplicação |

Nos testes, o logger fica silencioso.

## Prisma e migrations

Depois de alterar o `schema.prisma`, no ambiente de desenvolvimento:

```bash
npx prisma migrate dev --name nome_da_alteracao
npx prisma generate
```

Para executar esses comandos pelo computador, a `DATABASE_URL` deve apontar para o MySQL acessível pelo host.

O comando `migrate dev` exige permissões para utilizar um banco auxiliar, chamado shadow database.

Ao iniciar o container da API, o projeto executa:

```bash
npx prisma migrate deploy
```

Esse comando aplica as migrations existentes. Ele não cria novas migrations.

Depois de criar migrations ou alterar o código, reconstrua a imagem:

```bash
docker compose up -d --build
```

## Autor

Desenvolvido por **Cauã Ricken**.

- [GitHub](https://github.com/Caua-Ricken)
- [Portfólio](https://caua-ricken.github.io/portifolio-dev/)
