const express = require('express');
const router = express.Router();
const rawgService = require('../services/rawgService');

router.get('/featured', async (req, res) => {
  try {
    const data = await rawgService.getFeaturedGames();
    res.json(data.results);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar jogos em destaque.', error: err.message });
  }
});

router.get('/popular', async (req, res) => {
  try {
    const data = await rawgService.getPopularGames();
    res.json(data.results);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar jogos populares.', error: err.message });
  }
});

router.get('/genres', async (req, res) => {
  try {
    const data = await rawgService.getGenres();
    res.json(data.results);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar gêneros.', error: err.message });
  }
});

router.get('/catalog', async (req, res) => {
  try {
    const { nome, genero, ordenar, pagina } = req.query;
    const data = await rawgService.getCatalog({ nome, genero, ordenar, pagina });
    res.json(data); 
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar catálogo.', error: err.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'O termo de busca (q) é obrigatório.' });
    }
    const data = await rawgService.searchGames(q);
    res.json(data.results);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar jogos.', error: err.message });
  }
});

// Rota de detalhes do jogo
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await rawgService.getGameDetails(id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar detalhes do jogo.', error: err.message });
  }
});

module.exports = router;
