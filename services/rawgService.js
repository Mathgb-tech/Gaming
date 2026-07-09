const RAWG_API_KEY = process.env.RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

const fetchFromRawg = async (endpoint, queryParams = {}) => {
  if (!RAWG_API_KEY) {
    throw new Error('RAWG_API_KEY não configurada no .env');
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('key', RAWG_API_KEY);
  
  for (const [key, value] of Object.entries(queryParams)) {
    if (value) url.searchParams.append(key, value);
  }

  const response = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'CatalogoDeJogos/1.0.0'
    }
  });

  if (!response.ok) {
    throw new Error(`Erro na API da RAWG: ${response.statusText}`);
  }

  return response.json();
};

const rawgService = {
  getFeaturedGames: async () => {
    // Exemplo: Jogos muito bem avaliados lançados recentemente
    // Usaremos datas para pegar jogos deste ou do último ano
    const currentYear = new Date().getFullYear();
    const startDate = `${currentYear - 1}-01-01`;
    const endDate = `${currentYear}-12-31`;

    return fetchFromRawg('/games', {
      dates: `${startDate},${endDate}`,
      ordering: '-rating',
      page_size: 5
    });
  },

  getPopularGames: async () => {
    // Exemplo: Mais populares
    return fetchFromRawg('/games', {
      ordering: '-added',
      page_size: 12
    });
  },

  searchGames: async (query) => {
    return fetchFromRawg('/games', {
      search: query,
      page_size: 10
    });
  },

  getGenres: async () => {
    return fetchFromRawg('/genres');
  },

  getCatalog: async ({ nome, genero, ordenar, pagina }) => {
    const queryParams = {
      page_size: 20
    };

    if (nome) {
      queryParams.search = nome;
    }
    
    if (genero) {
      queryParams.genres = genero;
    }

    if (ordenar) {
      if (ordenar === 'avaliacao') {
        queryParams.ordering = '-rating';
      } else if (ordenar === 'lancamento') {
        queryParams.ordering = '-released';
      }
    }

    if (pagina) {
      queryParams.page = pagina;
    }

    return fetchFromRawg('/games', queryParams);
  },

  getGameDetails: async (id) => {
    const details = await fetchFromRawg(`/games/${id}`);
    const screenshots = await fetchFromRawg(`/games/${id}/screenshots`);
    return {
      ...details,
      screenshots: screenshots.results
    };
  }
};

module.exports = rawgService;
