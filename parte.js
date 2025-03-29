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

  cardArray.sort(() => 0.5 - Math.random());

  const grid = document.querySelector('.grid');
  const resultDisplay = document.querySelector('#result');
  const messageDisplay = document.querySelector('#message');
  let cardsChosen = [];
  let cardsChosenId = [];
  let cardsWon = [];
  let lockBoard = false; // Impede cliques extras durante a verificação

  function createBoard() {
      for (let i = 0; i < cardArray.length; i++) {
          const card = document.createElement('img');
          card.setAttribute('src', 'imagens/blank.png');
          card.setAttribute('data-id', i);
          card.addEventListener('click', flipCard);
          grid.appendChild(card);
      }
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
          cards[optionOneId].setAttribute('src', 'imagens/blank.png');
          cards[optionTwoId].setAttribute('src', 'imagens/blank.png');
      }

      cardsChosen = [];
      cardsChosenId = [];
      resultDisplay.textContent = cardsWon.length;
      lockBoard = false; // Libera cliques novamente

      if (cardsWon.length === cardArray.length / 2) {
          messageDisplay.textContent = 'Parabéns! Você encontrou todos os pares!';
      }
  }

  function flipCard() {
      if (lockBoard) return; // Se estiver verificando pares, impede mais cliques

      let cardId = this.getAttribute('data-id');

      // Impede que o jogador clique na mesma carta duas vezes
      if (cardsChosenId.includes(cardId)) return;

      cardsChosen.push(cardArray[cardId].name);
      cardsChosenId.push(cardId);
      this.setAttribute('src', cardArray[cardId].img);

      if (cardsChosen.length === 2) {
          lockBoard = true; // Bloqueia cliques enquanto verifica pares
          setTimeout(checkForMatch, 500);
      }
  }

  createBoard();
});
