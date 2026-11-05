# API de usuários

API REST com Express, TypeScript, Zod, Prisma e MySQL.

## Executar com Docker

Requisitos: Docker Desktop iniciado com containers Linux e Docker Compose.
No PowerShell, entre nesta pasta (`API-User/BackEnd`).

```powershell
Copy-Item .env.example .env
docker compose up -d --build
docker compose ps -a
```

O arquivo `.env` já foi configurado. Copie o exemplo
somente se ele ainda não existir e ajuste as senhas antes de publicar.
O `.env` reúne as variáveis do Compose e a `DATABASE_URL` para executar fora do Docker. Dentro dos containers, o Compose define sua própria `DATABASE_URL` usando o host `db`.

A API fica em http://localhost:3000. O Compose inicia o MySQL, espera uma consulta
autenticada funcionar, aplica as migrations com `prisma migrate deploy` e inicia
a API. O serviço `migrate` terminar com código 0 é esperado.
A imagem da API usa JavaScript compilado e executa como usuário sem privilégios.

```powershell
Invoke-RestMethod http://localhost:3000/health
Invoke-RestMethod http://localhost:3000/api/usuario
docker compose logs -f api migrate
docker compose down
```

Para reconstruir após alterações, execute novamente `up -d --build`.
Se a porta 3000 estiver ocupada, altere `API_PORT` no `.env`.

## Banco de dados

O MySQL fica na rede interna do Compose, no host `db`, porta 3306.
O banco usa um volume persistente: `down` preserva os dados.
**`down -v` apaga o volume e todos os dados do banco Docker.**
As variáveis de usuário, senha e nome do banco são usadas na primeira inicialização
do volume; alterar o arquivo depois não altera as credenciais do banco existente.
Use letras, números, `_` e `-` nos valores de usuário, senha e nome do banco,
pois eles compõem a URL de conexão.

Para acessar o SQL pelo terminal (digite a senha de `MYSQL_PASSWORD`):

```powershell
docker compose exec db mysql -u api -p usuarios
```

O banco Docker começa vazio e recebe apenas a estrutura das migrations.
Os registros do MySQL que você já utilizava não são copiados automaticamente.
Faça exportação/importação se precisar preservar esses registros no Docker.
Para publicar em um servidor, revise autenticação, HTTPS, segredos e backups;
a configuração atual expõe a API somente no computador local.

## Desenvolvimento sem Docker

Configure `DATABASE_URL` no `.env` para o seu MySQL e execute:

```powershell
npm ci
npm run db:generate
npm run dev
```

Use `npx prisma migrate dev --name nome_da_alteracao` para criar migrations no
banco de desenvolvimento. No Docker, somente migrations existentes são aplicadas.

## Verificações e rotas

```powershell
npm run typecheck
npm run build
```

- `GET /`: mensagem de funcionamento.
- `GET /health`: verifica a conexão com o banco (200 ou 503).
- `POST /api/usuario`: cadastra usuário.
- `GET /api/usuario?pagina=1&limite=10`: lista com paginação.
- `GET /api/usuario/:id`: busca usuário.
- `PATCH /api/usuario/:id`: atualiza usuário.
- `DELETE /api/usuario/:id`: exclui usuário permanentemente.

Exemplo de cadastro:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/usuario -ContentType 'application/json' -Body '{"nome":"Maria Silva","email":"maria@example.com"}'
```

Para testar a integração com a API iniciada, use PowerShell 7:

```powershell
./scripts/smoke-test.ps1
```

O teste verifica saúde, CRUD, validação, email duplicado e o cabeçalho Location.
Cria um usuário temporário e o remove ao final. Ainda não há suíte de testes
unitários configurada; `npm test` é o placeholder original do projeto.
