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

2. **Módulo 3: Integração RAWG & Home** - **[IMPLEMENTADO]**
   - Criação do serviço `rawgService` no Node (utilizando nativo `fetch` e escondendo a chave da API no backend) com envio do `User-Agent`.
   - Rotas de API públicas implementadas em `/games/featured`, `/games/popular` e `/games/search`.
   - Frontend provido de `GamesService` (consumindo o próprio backend, evitando expor a RAWG API ao browser).
   - Componente `LandingComponent` adaptado para exibir os jogos em destaque nativamente (Carousel com `*ngFor` e `setInterval`).
   - Componente `HomeComponent` refatorado com Carousel, Grid de populares e lógica de busca utilizando a pipeline `RxJS` completa (`map`, `debounceTime`, `distinctUntilChanged`, `filter`, `switchMap`). O `map` limpa espaços em branco e o `filter` ignora strings menores que 2 caracteres para economizar requisições e evitar tráfego inútil.
   - Tipagem rigorosa implementada na Interface `Game`.

   **Pendências / Observações (RAWG API):**
   - Graças à inclusão do `map` (para aparar a string) e do `filter` (restringindo buscas a termos maiores ou iguais a 2 caracteres) na barra de pesquisa, a mitigação de _rate limit_ está bem otimizada na aplicação, diminuindo enormemente o volume de requests errados ou muito curtos.
   - Algumas rotas de busca da RAWG podem retornar resultados misturados (jogos indie obscuros) ao invés do jogo exato, então no futuro o `searchGames` talvez precise ser otimizado (ex: filtros de `ordering=-relevance`).
   - Na ausência do .env, o backend estourará exceção avisando da ausência da `RAWG_API_KEY`.

3. **Módulo 4: Catálogo e Filtros** - **[IMPLEMENTADO]**
   - Backend estendido com `GET /games/catalog` e `GET /games/genres`.
   - O serviço do backend faz o de-para dos nossos parâmetros (`nome`, `genero`, `ordenar`, `pagina`) para os da RAWG (`search`, `genres`, `ordering`, `page`).
   - Frontend `GamesService` atualizado para conter `getCatalog(filtros)` e `getGenres()`, retornando respostas estruturadas pelas tipagens `CatalogResponse` e `Genre`.
   - `CatalogoComponent` implementado com uma interface para texto, select box de gêneros e select box de ordenação.
   - O fluxo reativo foi construído usando `combineLatest` em 3 `BehaviorSubject` diferentes (texto, gênero, ordenação). Isso unifica os filtros em um único _stream_ que, após aplicar as diretrizes de _debounceTime_ (para a string) e _distinctUntilChanged_, dispara automaticamente `switchMap` chamando o catálogo (sem necessitar de botão de Submit/Aplicar).
   - Componente atualizado com visuais de loading, mensagem de *empty state* se nenhum resultado for encontrado e grid de jogos reaproveitando a consistência definida em Home.

   **Pendências / Observações (Catálogo):**
   - A paginação infinita / bottom page loading pode ser implementada em futuros polimentos usando os dados `next` vindos de `CatalogResponse`. Atualmente está apenas trazendo a `pagina: 1`.

4. **Módulo 5: Detalhes e Polimento Final** - **[IMPLEMENTADO E CONCLUÍDO]**
   - Rota `GET /games/:id` implementada no backend (`rawgService` busca detalhes e screenshots simultaneamente e retorna o objeto consolidado).
   - `DetalhesComponent` implementado com tratamento de estado (*Loading*, *Erro 404 local* se o jogo não existir e carregamento via `ActivatedRoute` params).
   - Componente `NotFoundComponent` (`**`) estilizado com ação de volta à Home.
   - Todo o sistema de UI foi polido:
     - Escopo de cores baseadas em variáveis CSS globais (fundo escuro `var(--bg-color)` e detalhes luminescentes em Cyan/Roxo neon `var(--accent-color)`).
     - Componentes isolados (`home.component.css`, `catalogo.component.css`, etc.) com grid responsivos (auto-fill, minmax 280px).
     - Componente Pai (`app.component.html`) encapsulado com um Navbar simples pra facilitar a navegação em telas longas.
   - Cleanups de memória garantidos (destruição de timers de Carrossel no `ngOnDestroy` e *unsubscribes* manuais sempre que o `async` pipe não foi utilizado).

## Status Final do Projeto
- **Progresso:** 100% Concluído.
- **Pendências Mínimas Restantes:** Nenhuma impeditiva. O projeto compila 100% sem falhas. 
- **O que falta para produção?** 
  - Apenas as variáveis de ambiente `.env` precisam ser preenchidas por chaves válidas da RAWG e do banco real Supabase caso seja hospedado.
