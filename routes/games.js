const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get games placeholder' });
});

router.get('/search', (req, res) => {
  res.json({ message: 'Search games placeholder' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get game details placeholder' });
});

module.exports = router;
