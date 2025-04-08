const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Caminho correto (diretamente no projeto)
const FILE_PATH = './rankings.json';

app.use(cors());
app.use(express.json());

// Função para carregar os rankings
const loadRankings = () => {
  try {
    return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
  } catch {
    return [];
  }
};

// Função para salvar os rankings
const saveRankings = (rankings) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(rankings, null, 2), 'utf8');
};

// Endpoint GET /rankings
app.get('/rankings', (req, res) => {
  const rankings = loadRankings();
  res.json(rankings);
});

// Endpoint POST /rankings
app.post('/rankings', (req, res) => {
  const { name, time, attempts } = req.body;
  if (!name || time == null || attempts == null) {
    return res.status(400).json({ error: 'Dados inválidos.' });
  }

  let rankings = loadRankings();
  rankings.push({ name, time, attempts });

  // Ordenar por tempo, depois tentativas
  rankings = rankings
    .sort((a, b) => a.time - b.time || a.attempts - b.attempts)
    .slice(0, 10); // Top 10

  saveRankings(rankings);
  res.status(201).json({ message: 'Recorde salvo com sucesso.' });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
