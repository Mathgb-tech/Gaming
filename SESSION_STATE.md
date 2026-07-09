# Session State - Catálogo de Jogos

## Estrutura Criada (Fase 1 - Base)
- **Backend**:
  - Servidor Express em `server.js`.
  - Rotas estruturadas (`auth`, `games`, `users`).
  - Configuração do Supabase pronta (`config/supabase.js`).
  - Variáveis de ambiente configuradas no `.env`.
  - Ignorados corretamente no `.gitignore`.
- **Frontend**:
  - Projeto Angular 19 Standalone (`frontend/`).
  - Configuração do `HttpClient` realizada via `provideHttpClient()`.
  - Rotas definidas para páginas principais com *lazy loading* (`/`, `/home`, `/login`, `/cadastro`, `/catalogo`, `/jogos/:id`, `/perfil`, `**` para 404).
  - Componentes vazios gerados para cada página.
  - Arquivos de ambiente (`environment.ts` e `environment.prod.ts`) configurados.

## Próximos Módulos Planejados

1. **Módulo 2: Autenticação & Perfil** - **[IMPLEMENTADO]**
   - Criação da tabela de usuários no Supabase.
   - Implementação das rotas `/auth/register`, `/auth/login`, `/auth/me`, `/users/profile`.
   - Criptografia de senha com bcrypt e geração de JWT salvo via cookie (`httpOnly`).
   - Middleware de autenticação backend validando JWT.
   - Componentes Frontend atualizados com Reactive/Template-driven forms: `CadastroComponent`, `LoginComponent`, `PerfilComponent`.
   - AuthService com chamadas API utilizando `withCredentials: true`.
   - AuthGuard protegendo as rotas internas.

   **Schema da Tabela `users` (Supabase PostgreSQL):**
   ```sql
   CREATE TABLE public.users (
       id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
       nome text NOT NULL,
       email text NOT NULL UNIQUE,
       senha_hash text NOT NULL,
       aceite_lgpd boolean NOT NULL,
       created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
   );
   ```

2. **Módulo 3: Integração RAWG & Home**
   - Configuração do consumo da API da RAWG no backend.
   - Implementação do Carousel de jogos na Apresentação (Landing) e Home.
   - Listagem de jogos populares e em destaque.
   - Barra de pesquisa integrada à API.

3. **Módulo 4: Catálogo e Filtros**
   - Construção da página de Catálogo.
   - Funcionalidade de filtros (nome, gênero) e ordenação (avaliação, lançamento).
   - Interface de cards para os jogos (imagem, nome, nota).

4. **Módulo 5: Detalhes e Polimento Final**
   - Página de detalhes de cada jogo com banner, descrição, plataformas, desenvolvedora e data.
   - Refinamentos visuais (responsividade e estilização premium).
   - Página 404 estilizada.
   - Ajustes de performance e UX.
