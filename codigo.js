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
      { name: 'batata', img: 'imagens/fries.png' },
      { name: 'hamburguer', img: 'imagens/cheeseburger.png' },
      { name: 'sorvete', img: 'imagens/ice-cream.png' },
      { name: 'pizza', img: 'imagens/pizza.png' },
      { name: 'milkshake', img: 'imagens/milkshake.png' },
      { name: 'cachorro-quente', img: 'imagens/hotdog.png' },
      { name: 'batata', img: 'imagens/fries.png' },
      { name: 'hamburguer', img: 'imagens/cheeseburger.png' },
      { name: 'sorvete', img: 'imagens/ice-cream.png' },
      { name: 'pizza', img: 'imagens/pizza.png' },
      { name: 'milkshake', img: 'imagens/milkshake.png' },
      { name: 'cachorro-quente', img: 'imagens/hotdog.png' }
    ];
  
    const Lista_de_cartas_2 = [
      { name: 'noz', img: 'imagens_2/acorn.png' },
      { name: 'abelha', img: 'imagens_2/bee.png' },
      { name: 'joaninha', img: 'imagens_2/ladybug.png' },
      { name: 'lua', img: 'imagens_2/moon.png' },
      { name: 'cogumelo', img: 'imagens_2/mushroom.png' },
      { name: 'neve', img: 'imagens_2/snow.png' },
      { name: 'agua', img: 'imagens_2/water.png' },
      { name: 'mundo', img: 'imagens_2/world.png' },
      { name: 'noz', img: 'imagens_2/acorn.png' },
      { name: 'abelha', img: 'imagens_2/bee.png' },
      { name: 'joaninha', img: 'imagens_2/ladybug.png' },
      { name: 'lua', img: 'imagens_2/moon.png' },
      { name: 'cogumelo', img: 'imagens_2/mushroom.png' },
      { name: 'neve', img: 'imagens_2/snow.png' },
      { name: 'agua', img: 'imagens_2/water.png' },
      { name: 'mundo', img: 'imagens_2/world.png' }
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
        card.setAttribute('src', 'imagens/blank.png');
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
        card1.setAttribute('src', 'imagens/blank.png');
        card2.setAttribute('src', 'imagens/blank.png');
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
  
      let records = JSON.parse(localStorage.getItem('memoryGameRecords')) || [];
      records = [...records, newRecord]
        .sort((a, b) => a.time - b.time || a.attempts - b.attempts)
        .slice(0, 10);
  
      localStorage.setItem('memoryGameRecords', JSON.stringify(records));
      updateRecordTable(records);
    };
  
    const updateRecordTable = (records = JSON.parse(localStorage.getItem('memoryGameRecords')) || []) => {
      recordTable.innerHTML = records.map((record, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${record.name}</td>
          <td>${record.time}</td>
          <td>${record.attempts}</td>
        </tr>
      `).join('');
    };
  
    updateRecordTable();
  });