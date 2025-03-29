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

    let playerName = '';
    let cardsChosen = [];
    let cardsChosenId = [];
    let cardsWon = [];
    let lockBoard = false;
    let attempts = 0;
    let startTime;
    let gameInterval;

    const grid = document.querySelector('.grid');
    const resultDisplay = document.querySelector('#result');
    const messageDisplay = document.querySelector('#message');
    const timerDisplay = document.querySelector('#timer');
    const attemptsDisplay = document.querySelector('#attempts');
    const recordTable = document.querySelector('#record-table tbody');
    const playerNameInput = document.querySelector('#playerName');
    const startButton = document.querySelector('#startGame');

    startButton.addEventListener('click', startGame);

    function startGame() {
        if (!playerNameInput.value.trim()) {
            alert('Por favor, digite seu nome antes de iniciar o jogo.');
            return;
        }

        playerName = playerNameInput.value.trim();
        playerNameInput.disabled = true;
        startButton.disabled = true;

        grid.innerHTML = ''; // Limpa o tabuleiro se for reiniciar
        attempts = 0;
        attemptsDisplay.textContent = attempts;
        cardsWon = [];
        cardArray.sort(() => Math.random() - 0.5);

        createBoard();
        startTimer();
    }

    function startTimer() {
        startTime = Date.now();
        timerDisplay.textContent = '0';
        gameInterval = setInterval(() => {
            timerDisplay.textContent = Math.floor((Date.now() - startTime) / 1000);
        }, 1000);
    }

    function stopTimer() {
        clearInterval(gameInterval);
    }

    function createBoard() {
        cardArray.forEach((_, i) => {
            const card = document.createElement('img');
            card.setAttribute('src', 'imagens/blank.png');
            card.setAttribute('data-id', i);
            card.addEventListener('click', flipCard);
            grid.appendChild(card);
        });
    }

    function checkForMatch() {
        const cards = document.querySelectorAll('.grid img');
        const [optionOneId, optionTwoId] = cardsChosenId;

        if (cardsChosen[0] === cardsChosen[1] && optionOneId !== optionTwoId) {
            messageDisplay.textContent = 'Parabéns! Você encontrou um par!';
            cards[optionOneId].setAttribute('src', 'imagens/white.png');
            cards[optionTwoId].setAttribute('src', 'imagens/white.png');
            cards[optionOneId].removeEventListener('click', flipCard);
            cards[optionTwoId].removeEventListener('click', flipCard);
            cardsWon.push(cardsChosen);
        } else {
            messageDisplay.textContent = 'Tente novamente!';
            setTimeout(() => {
                cards[optionOneId].setAttribute('src', 'imagens/blank.png');
                cards[optionTwoId].setAttribute('src', 'imagens/blank.png');
                resetTurn();
            }, 500);
            return;
        }

        resetTurn();
        resultDisplay.textContent = cardsWon.length;

        if (cardsWon.length === cardArray.length / 2) {
            gameOver();
        }
    }

    function flipCard() {
        if (lockBoard) return;
        let cardId = this.getAttribute('data-id');
        if (cardsChosenId.includes(cardId)) return;

        cardsChosen.push(cardArray[cardId].name);
        cardsChosenId.push(cardId);
        this.setAttribute('src', cardArray[cardId].img);

        if (cardsChosen.length === 2) {
            attempts++;
            attemptsDisplay.textContent = attempts;
            lockBoard = true;
            setTimeout(checkForMatch, 500);
        }
    }

    function resetTurn() {
        cardsChosen = [];
        cardsChosenId = [];
        lockBoard = false;
    }

    function gameOver() {
        stopTimer();
        messageDisplay.textContent = `Parabéns, ${playerName}! Você encontrou todos os pares!`;
        saveRecord();
    }

    function saveRecord() {
        const timeTaken = parseInt(timerDisplay.textContent);
        const newRecord = { name: playerName, time: timeTaken, attempts: attempts };

        let records = JSON.parse(localStorage.getItem('memoryGameRecords')) || [];
        records.push(newRecord);
        records.sort((a, b) => a.time - b.time || a.attempts - b.attempts);
        records = records.slice(0, 10);

        localStorage.setItem('memoryGameRecords', JSON.stringify(records));
        updateRecordTable();
    }

    function updateRecordTable() {
        let records = JSON.parse(localStorage.getItem('memoryGameRecords')) || [];
        recordTable.innerHTML = '';
        records.forEach((record, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${index + 1}</td><td>${record.name}</td><td>${record.time}</td><td>${record.attempts}</td>`;
            recordTable.appendChild(row);
        });
    }

    updateRecordTable();
});
