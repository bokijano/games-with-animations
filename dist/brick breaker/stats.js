const tetrisGame = document.querySelector(".tetris-game");
const homePage = document.querySelector(".home-page");
const playBrick = document.querySelector(".brick-game");
const brickStats = document.querySelector(".stats");
const brickControls = document.querySelector(".controls");

const playGame = document.querySelector(".play-game");
const loseGame = document.querySelector(".lose");
const winGame = document.querySelector(".win");

// create stitistic for game

// score section
let score = document.createElement("section");
score.setAttribute("class", "score-stats");

let scoreImg = document.createElement("span");
scoreImg.setAttribute("id", "scoreImg");
score.appendChild(scoreImg);

let scoreCount = document.createElement("span");
scoreCount.setAttribute("id", "scoreCount");
scoreCount.innerHTML = 0;
score.appendChild(scoreCount);

brickStats.appendChild(score);

// level section
let level = document.createElement("section");
level.setAttribute("class", "level-stats");

let levelImg = document.createElement("span");
levelImg.setAttribute("id", "levelImg");
level.appendChild(levelImg);

let levelCount = document.createElement("span");
levelCount.setAttribute("id", "levelCount");
//levelCount.innerHTML = 1;
level.appendChild(levelCount);

brickStats.appendChild(level);

// life section
let life = document.createElement("section");
life.setAttribute("class", "life-stats");

let lifeImg = document.createElement("span");
lifeImg.setAttribute("id", "lifeImg");
life.appendChild(lifeImg);

let lifeCount = document.createElement("span");
lifeCount.setAttribute("id", "lifeCount");
lifeCount.innerHTML = 3;
life.appendChild(lifeCount);

brickStats.appendChild(life);

// close brick breaker game
const closeBrick = document.createElement("span");
closeBrick.setAttribute("class", "close-bricks");
closeBrick.innerHTML = "&times";
closeBrick.onclick = function () {
  homePage.style.display = "block";
  playBrick.style.display = "none";
  location.reload();
};
brickStats.appendChild(closeBrick);

// game over section

const loseMsg = document.createElement("h1");
loseMsg.innerHTML = "You lose! Try again!";
loseGame.appendChild(loseMsg);

const restartGame = document.createElement("button");
restartGame.setAttribute("id", "restart");
restartGame.innerHTML = "Play again";
loseGame.appendChild(restartGame);

const restartWinGame = document.createElement("button");
restartWinGame.setAttribute("id", "restart");
restartWinGame.innerHTML = "Play again";
winGame.appendChild(restartWinGame);
