document.addEventListener('DOMContentLoaded', () => {
  const loginScreen = document.getElementById('login-screen');
  const gameInterface = document.getElementById('game-interface');
  const playerNameInput = document.getElementById('playerName');
  const startButton = document.getElementById('startGame');
  const playerNameDisplay = document.getElementById('playerNameDisplay');
  const grid1 = document.querySelector('.grid1');
  const grid2 = document.querySelector('.grid2');

  const resultDisplay = document.querySelector('#result');
  const messageDisplay = document.querySelector('#message');
  const timerDisplay = document.querySelector('#timer');
  const attemptsDisplay = document.querySelector('#attempts');
  const recordTable = document.querySelector('#record-table tbody');

  const Lista_de_cartas_1 = [
    { name: 'batata', img: 'imagens/fries.png' }, //1 
    { name: 'hamburguer', img: 'imagens/cheeseburger.png' }, //2
    { name: 'sorvete', img: 'imagens/ice-cream.png' }, //3
    { name: 'pizza', img: 'imagens/pizza.png' }, //4
    { name: 'milkshake', img: 'imagens/milkshake.png' }, //5
    { name: 'cachorro-quente', img: 'imagens/hotdog.png' }, //6
    { name: 'sopa', img: 'imagens/sopa.png' }, //7
    { name: 'salada', img: 'imagens/salada.png' }, //8


    { name: 'batata', img: 'imagens/fries.png' }, //1  copia
    { name: 'hamburguer', img: 'imagens/cheeseburger.png' }, //2 copia
    { name: 'sorvete', img: 'imagens/ice-cream.png' }, //3 copia
    { name: 'pizza', img: 'imagens/pizza.png' }, //4 copia
    { name: 'milkshake', img: 'imagens/milkshake.png' }, //5 copia
    { name: 'cachorro-quente', img: 'imagens/hotdog.png' }, //6 copia
    { name: 'sopa', img: 'imagens/sopa.png' }, //7  copia
    { name: 'salada', img: 'imagens/salada.png' }, //8 copia

  ];

  const Lista_de_cartas_2 = [
    { name: 'noz', img: 'imagens/acorn.png' },//1
    { name: 'abelha', img: 'imagens/bee.png' },//2
    { name: 'joaninha', img: 'imagens/ladybug.png' },//3
    { name: 'lua', img: 'imagens/moon.png' },//4
    { name: 'cogumelo', img: 'imagens/mushroom.png' },//5
    { name: 'neve', img: 'imagens/snow.png' },//6
    { name: 'agua', img: 'imagens/water.png' },//7
    { name: 'mundo', img: 'imagens/world.png' },//8
    { name: 'noz', img: 'imagens/acorn.png' },// 1 copia
    { name: 'abelha', img: 'imagens/bee.png' },//2 copia
    { name: 'joaninha', img: 'imagens/ladybug.png' },//3 copia
    { name: 'lua', img: 'imagens/moon.png' },//4 copia
    { name: 'cogumelo', img: 'imagens/mushroom.png' },//5 copia
    { name: 'neve', img: 'imagens/snow.png' },//6 copia
    { name: 'agua', img: 'imagens/water.png' },//7 copia
    { name: 'mundo', img: 'imagens/world.png' },//8 copia
  ];

  let gameState = {};

  startButton.addEventListener('click', () => {
    const nome = playerNameInput.value.trim();
    if (!nome || nome.length < 2) {
      alert('Digite um nome válido (mínimo 2 caracteres).');
      return;
    }

    playerNameDisplay.textContent = nome;
    loginScreen.style.display = 'none';
    gameInterface.style.display = 'block';

    startGame(nome);
  });

  const startGame = (nome) => {
    gameState = {
      playerName: nome,
      attempts: 0,
      startTime: Date.now(),
      gameInterval: null,
      cardsWon: [],
    };

    attemptsDisplay.textContent = '0';
    resultDisplay.textContent = '0';
    messageDisplay.textContent = '';
    grid1.innerHTML = '';
    grid2.innerHTML = '';

    iniciarFase1();
    iniciarFase2();
    startTimer();
  };

  const iniciarFase1 = () => {
    const cartas1 = [...Lista_de_cartas_1].sort(() => 0.5 - Math.random());
    createBoard(grid1, cartas1, 'fase1');
  };

  const iniciarFase2 = () => {
    const cartas2 = [...Lista_de_cartas_2].sort(() => 0.5 - Math.random());
    createBoard(grid2, cartas2, 'fase2');
  };

  const startTimer = () => {
    gameState.gameInterval = setInterval(() => {
      timerDisplay.textContent = Math.floor((Date.now() - gameState.startTime) / 1000);
    }, 1000);
  };

  const stopTimer = () => clearInterval(gameState.gameInterval);

  const createBoard = (grid, cards, fase) => {
    const state = {
      cardsChosen: [],
      cardsChosenId: [],
      shuffledCards: cards,
      cardsElementMap: new Map(),
    };

    cards.forEach((_, i) => {
      const card = document.createElement('img');
      card.setAttribute('src', 'imagens/Blanck.png');
      card.setAttribute('data-id', i);
      card.setAttribute('data-fase', fase);
      card.classList.add('card-img');
      grid.appendChild(card);
      card.addEventListener('click', () => handleCardClick(card, state, fase));
      state.cardsElementMap.set(i, card);
    });

    gameState[fase] = state;
  };

  const handleCardClick = (card, state, fase) => {
    const id = Number(card.getAttribute('data-id'));

    if (state.cardsChosenId.includes(id) || state.cardsChosen.length === 2) return;

    state.cardsChosen.push(state.shuffledCards[id].name);
    state.cardsChosenId.push(id);
    state.cardsElementMap.get(id).setAttribute('src', state.shuffledCards[id].img);

    if (state.cardsChosen.length === 2) {
      gameState.attempts++;
      attemptsDisplay.textContent = gameState.attempts;
      setTimeout(() => checkForMatch(state, fase), 500);
    }
  };

  const checkForMatch = (state, fase) => {
    const [id1, id2] = state.cardsChosenId;
    const [name1, name2] = state.cardsChosen;
    const card1 = state.cardsElementMap.get(id1);
    const card2 = state.cardsElementMap.get(id2);

    if (name1 === name2 && id1 !== id2) {
      messageDisplay.textContent = 'Parabéns! Você encontrou um par!';
      card1.removeEventListener('click', handleCardClick);
      card2.removeEventListener('click', handleCardClick);
      gameState.cardsWon.push(name1);
    } else {
      messageDisplay.textContent = 'Tente novamente!';
      card1.setAttribute('src', 'imagens/Blanck.png');
      card2.setAttribute('src', 'imagens/Blanck.png');
    }

    state.cardsChosen = [];
    state.cardsChosenId = [];

    resultDisplay.textContent = gameState.cardsWon.length;

    const totalCards = Lista_de_cartas_1.length + Lista_de_cartas_2.length;
    if (gameState.cardsWon.length === totalCards / 2) gameOver();
  };

  const gameOver = () => {
    stopTimer();
    messageDisplay.textContent = `Parabéns, ${gameState.playerName}! Você encontrou todos os pares!`;
    saveRecord();
  };

  const saveRecord = () => {
    const timeTaken = parseInt(timerDisplay.textContent);
    const newRecord = {
      name: gameState.playerName,
      time: timeTaken,
      attempts: gameState.attempts
    };

    fetch('http://localhost:3000/rankings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newRecord)
    })
    .then(() => loadRecords())
    .catch((err) => {
      console.error('Erro ao salvar ranking:', err);
    });
  };

  const loadRecords = () => {
    fetch('http://localhost:3000/rankings')
      .then(res => res.json())
      .then(updateRecordTable)
      .catch(err => {
        console.error('Erro ao carregar rankings:', err);
      });
  };

  const updateRecordTable = (records = []) => {
    recordTable.innerHTML = records.map((record, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${record.name}</td>
        <td>${record.time}</td>
        <td>${record.attempts}</td>
      </tr>
    `).join('');
  };

  // Carrega rankings ao abrir o jogo
  loadRecords();
});
