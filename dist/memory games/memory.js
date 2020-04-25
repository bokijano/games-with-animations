const foodGame = document.querySelector(".food");
const actorsGame = document.querySelector(".actors");
const sportGame = document.querySelector(".sport");
const cardsGame = document.querySelector(".cards");

foodData.sort(() => Math.random() - 0.5);
actorsData.sort(() => Math.random() - 0.5);
sportData.sort(() => Math.random() - 0.5);
cardsData.sort(() => Math.random() - 0.5);

let cardChosen = [];
let cardChosenId = [];
let cardsWon = [];

// function for display memory game
function modalDisplay(game, data, srcImg) {
  game.style.display = "block";

  const content = document.createElement("div");
  content.setAttribute("class", "content");

  const closeModal = document.createElement("span");
  closeModal.setAttribute("class", "close");
  closeModal.innerHTML = "&times";
  closeModal.onclick = function () {
    game.style.display = "none";
    game.innerHTML = "";
  };
  content.appendChild(closeModal);

  // function for create board with same cards
  function createBord() {
    for (let i = 0; i < data.length; i++) {
      let card = document.createElement("img");
      card.setAttribute("src", srcImg);
      card.setAttribute("class", "memory-img");
      card.setAttribute("data-id", i);
      card.addEventListener("click", flipCard);

      content.appendChild(card);
    }
  }
  createBord();

  // function for checking cards match
  function checkForMatch() {
    let cards = document.querySelectorAll(".memory-img");
    const optionOneId = cardChosenId[0];
    const optionTwoId = cardChosenId[1];

    if (cardChosen[0] === cardChosen[1] && optionOneId !== optionTwoId) {
      cards[optionOneId].style.visibility = "hidden";
      cards[optionTwoId].style.visibility = "hidden";

      cardsWon.push(cardChosen);
    } else {
      cards[optionOneId].setAttribute("src", srcImg);
      cards[optionTwoId].setAttribute("src", srcImg);
    }

    cardChosen = [];
    cardChosenId = [];

    if (cardsWon.length === data.length / 2) {
      let text = document.createElement("h1");
      text.innerHTML = "Congratulations!!! You win the game!!!";
      content.appendChild(text);

      let newGameBtn = document.createElement("button");
      newGameBtn.setAttribute("class", "home-page");
      newGameBtn.innerHTML = "Play Again";
      newGameBtn.addEventListener("click", function () {
        for (let i = 0; i < data.length; i++) {
          cards[i].style.visibility = "visible";
          cards[i].setAttribute("src", srcImg);
          cardsWon = [];
          text.innerHTML = "";
          newGameBtn.style.display = "none";
        }
        data.sort(() => Math.random() - 0.5);
      });
      content.appendChild(newGameBtn);
    }
  }

  // flip card function
  function flipCard() {
    let cardId = this.getAttribute("data-id");
    cardChosen.push(data[cardId].name);
    cardChosenId.push(cardId);
    this.setAttribute("src", data[cardId].img);

    if (cardChosenId.length === 2) {
      setTimeout(checkForMatch, 500);
    }
  }

  game.appendChild(content);
}

function memoryFood() {
  modalDisplay(foodGame, foodData, "./memory pictures/food/food-card.png");
}

function memoryActors() {
  modalDisplay(actorsGame, actorsData, "./memory pictures/actors/movie.png");
}

function memorySport() {
  modalDisplay(sportGame, sportData, "./memory pictures/sport/card.png");
}

function memoryCards() {
  modalDisplay(cardsGame, cardsData, "./memory pictures/cards/card-deck.png");
}
