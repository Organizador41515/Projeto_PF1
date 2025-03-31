document.addEventListener('DOMContentLoaded', () => {
    const cardArray = [
        { name: 'fries', img: 'imagens/fries.png' },
        { name: 'cheeseburger', img: 'imagens/cheeseburger.png' },
        { name: 'ice-cream', img: 'imagens/ice-cream.png' },
        { name: 'pizza', img: 'imagens/pizza.png' },
        { name: 'milkshake', img: 'imagens/milkshake.png' },
        { name: 'hotdog', img: 'imagens/hotdog.png' },
        { name: 'fries', img: 'imagens/fries.png' },
        { name: 'cheeseburger', img: 'imagens/cheeseburger.png' },
        { name: 'ice-cream', img: 'imagens/ice-cream.png' },
        { name: 'pizza', img: 'imagens/pizza.png' },
        { name: 'milkshake', img: 'imagens/milkshake.png' },
        { name: 'hotdog', img: 'imagens/hotdog.png' }
    ];

    const grid = document.querySelector('.grid');
    const resultDisplay = document.querySelector('#result');
    const messageDisplay = document.querySelector('#message');
    const timerDisplay = document.querySelector('#timer');
    const attemptsDisplay = document.querySelector('#attempts');
    const recordTable = document.querySelector('#record-table tbody');
    const playerNameInput = document.querySelector('#playerName');
    const startButton = document.querySelector('#startGame');

    let gameState = {
        playerName: '',
        attempts: 0,
        startTime: 0,
        gameInterval: null,
        cardsChosen: [],
        cardsChosenId: [],
        cardsWon: [],
        lockBoard: false,
        shuffledCards: []
    };

    const startGame = () => {
        if (!playerNameInput.value.trim()) {
            alert('Por favor, digite seu nome antes de iniciar o jogo.');
            return;
        }

        gameState = {
            ...gameState,
            playerName: playerNameInput.value.trim(),
            attempts: 0,
            startTime: Date.now(),
            cardsWon: [],
            shuffledCards: [...cardArray].sort(() => Math.random() - 0.5)
        };

        playerNameInput.disabled = true;
        startButton.disabled = true;
        attemptsDisplay.textContent = gameState.attempts;
        messageDisplay.textContent = '';
        grid.innerHTML = '';

        createBoard(gameState.shuffledCards);
        startTimer();
    };

    const startTimer = () => {
        gameState.gameInterval = setInterval(() => {
            timerDisplay.textContent = Math.floor((Date.now() - gameState.startTime) / 1000);
        }, 1000);
    };

    const stopTimer = () => clearInterval(gameState.gameInterval);

    const createBoard = (shuffledCards) => {
        shuffledCards.forEach((_, i) => {
            const card = document.createElement('img');
            card.setAttribute('src', 'imagens/blank.png');
            card.setAttribute('data-id', i);
            card.addEventListener('click', () => flipCard(i));
            grid.appendChild(card);
        });
    };

    const flipCard = (cardId) => {
        if (gameState.lockBoard || gameState.cardsChosenId.includes(cardId)) return;

        const newChosen = [...gameState.cardsChosen, gameState.shuffledCards[cardId].name];
        const newChosenId = [...gameState.cardsChosenId, cardId];
        document.querySelector(`[data-id='${cardId}']`).setAttribute('src', gameState.shuffledCards[cardId].img);

        if (newChosen.length === 2) {
            gameState = { ...gameState, lockBoard: true, attempts: gameState.attempts + 1 };
            attemptsDisplay.textContent = gameState.attempts;
            setTimeout(() => checkForMatch(newChosen, newChosenId), 500);
        } else {
            gameState = { ...gameState, cardsChosen: newChosen, cardsChosenId: newChosenId };
        }
    };

    const checkForMatch = (chosen, chosenId) => {
        const cards = document.querySelectorAll('.grid img');
        let newCardsWon = [...gameState.cardsWon];

        if (chosen[0] === chosen[1] && chosenId[0] !== chosenId[1]) {
            messageDisplay.textContent = 'Parabéns! Você encontrou um par!';
            newCardsWon.push(chosen);
            chosenId.forEach(id => {
                cards[id].setAttribute('src', 'imagens/white.png');
                cards[id].removeEventListener('click', flipCard);
            });
        } else {
            messageDisplay.textContent = 'Tente novamente!';
            setTimeout(() => chosenId.forEach(id => cards[id].setAttribute('src', 'imagens/blank.png')), 500);
        }

        gameState = { ...gameState, cardsChosen: [], cardsChosenId: [], cardsWon: newCardsWon, lockBoard: false };
        resultDisplay.textContent = newCardsWon.length;
        if (newCardsWon.length === cardArray.length / 2) gameOver();
    };

    const gameOver = () => {
        stopTimer();
        messageDisplay.textContent = `Parabéns, ${gameState.playerName}! Você encontrou todos os pares!`;
        saveRecord();
    };

    const saveRecord = () => {
        const timeTaken = parseInt(timerDisplay.textContent);
        const newRecord = { name: gameState.playerName, time: timeTaken, attempts: gameState.attempts };
        let records = JSON.parse(localStorage.getItem('memoryGameRecords')) || [];

        records = [...records, newRecord].sort((a, b) => a.time - b.time || a.attempts - b.attempts).slice(0, 10);
        localStorage.setItem('memoryGameRecords', JSON.stringify(records));
        updateRecordTable(records);
    };

    const updateRecordTable = (records = JSON.parse(localStorage.getItem('memoryGameRecords')) || []) => {
        recordTable.innerHTML = records.map((record, index) => `<tr><td>${index + 1}</td><td>${record.name}</td><td>${record.time}</td><td>${record.attempts}</td></tr>`).join('');
    };

    startButton.addEventListener('click', startGame);
    updateRecordTable();
});
