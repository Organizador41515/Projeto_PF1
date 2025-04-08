const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

const FILE_PATH = './backend/rankings.json';

app.use(cors());
app.use(express.json());

// Carrega rankings do arquivo
const loadRankings = () => {
  try {
    return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
  } catch {
    return [];
  }
};

// Salva rankings no arquivo
const saveRankings = (rankings) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(rankings, null, 2), 'utf8');
};

// GET /rankings
app.get('/rankings', (req, res) => {
  const rankings = loadRankings();
  res.json(rankings);
});

// POST /rankings
app.post('/rankings', (req, res) => {
  const { name, time, attempts } = req.body;
  if (!name || time == null || attempts == null) {
    return res.status(400).json({ error: 'Dados inválidos.' });
  }

  let rankings = loadRankings();
  rankings.push({ name, time, attempts });
  rankings = rankings
    .sort((a, b) => a.time - b.time || a.attempts - b.attempts)
    .slice(0, 10);

  saveRankings(rankings);
  res.status(201).json({ message: 'Recorde salvo com sucesso.' });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
