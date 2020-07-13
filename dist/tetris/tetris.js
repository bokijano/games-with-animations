const tetrisMove = document.querySelector(".tetris-move");
const tetrisOption = document.querySelector(".tetris-option");

let backBtn = document.createElement("button");
backBtn.innerHTML = "home page";
backBtn.setAttribute("class", "home-btn");
backBtn.onclick = function () {
  location.reload();
  tetrisGame.style.display = "none";
  homePage.style.display = "block";
  playerReset();
};

tetrisGame.appendChild(backBtn);

// canvas game tetris
const canvasTetris = document.getElementById("tetris");
canvasTetris.setAttribute("width", "240");
canvasTetris.setAttribute("height", "400");
const context = canvasTetris.getContext("2d");

context.scale(20, 20);

const playground = createMatrix(12, 20);

let dropCounter = 0;
let dropInterval = 1000;

let lastUpdate = 0;

let startTetris = false;
let pause = window.cancelAnimationFrame;
let continueTetris = true;

const player = {
  pos: { x: 0, y: 0 },
  matrix: null,
  score: 0,
};

const piecesColor = [
  null,
  "#B3B034",
  "#25A6EE",
  "#264FED",
  "#46593D",
  "#2652ED",
  "#26ED36",
  "#A239CA",
];

// sweep rows from playground
function playgroundSweep() {
  let rowCount = 1;
  outer: for (let y = playground.length - 1; y > 0; y--) {
    for (let x = 0; x < playground[y].length; x++) {
      if (playground[y][x] === 0) {
        continue outer;
      }
    }

    const row = playground.splice(y, 1)[0].fill(0);
    playground.unshift(row);
    y++;

    player.score += rowCount * 10;
    rowCount *= 2;
  }
}

// functions for detecting walls for colliding
function collide(playground, player) {
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      if (
        m[y][x] !== 0 &&
        (playground[y + o.y] && playground[y + o.y][x + o.x]) !== 0
      ) {
        return true;
      }
    }
  }
  return false;
}
function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

// create seven pieces for play tetris
function createPiece(type) {
  if (type === "T") {
    return [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
  } else if (type === "O") {
    return [
      [2, 2],
      [2, 2],
    ];
  } else if (type === "L") {
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3],
    ];
  } else if (type === "J") {
    return [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0],
    ];
  } else if (type === "I") {
    return [
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
    ];
  } else if (type === "S") {
    return [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0],
    ];
  } else if (type === "Z") {
    return [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0],
    ];
  }
}

// draw main playground canvas
function draw() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvasTetris.width, canvasTetris.height);

  drawMatrix(playground, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}
// draw pieces for matrix
function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = piecesColor[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

// reset pieces
function playerReset() {
  const pieces = "ILJOTSZ";
  player.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
  player.pos.y = 0;
  player.pos.x =
    ((playground[0].length / 2) | 0) - ((player.matrix[0] / 2) | 0);
  if (collide(playground, player)) {
    //playground.forEach((row) => row.fill(0));
    stopTetris();
    const gameOver = document.createElement("h1");
    gameOver.innerHTML = "GAME OVER";
    const newGame = document.createElement("img");

    newGame.setAttribute("class", "new-game");
    newGame.setAttribute("src", "tetris/pictures/white-play.png");
    newGame.onclick = function () {
      playground.forEach((row) => row.fill(0));
      newGame.style.display = "none";
      gameOver.style.display = "none";
      continueGame();
      player.score = 0;
      dropInterval = 1000;
      updateScore();
      update();
    };

    tetrisGame.appendChild(newGame);
    tetrisGame.appendChild(gameOver);
  }
}

// merge player width bottom wall
function merge(playground, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        playground[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

// move pieces down
function playerDrop() {
  player.pos.y++;
  if (collide(playground, player)) {
    player.pos.y--;
    merge(playground, player);
    playerReset();
    playgroundSweep();
    updateScore();
  }
  dropCounter = 0;
}
// move player pieces left or right
function playerMove(dir) {
  player.pos.x += dir;
  if (collide(playground, player)) {
    player.pos.x -= dir;
  }
}

// rotate pieces
function pieceRotate(dir) {
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);
  while (collide(playground, player)) {
    player.pos.x += offset;

    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}
function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < y; x++) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }

  if (dir > 0) {
    matrix.forEach((row) => row.reverse());
  } else {
    matrix.reverse();
  }
}

// update score function
function updateScore() {
  document.getElementById("score").innerHTML = player.score;
}

// update function

function update(time = 0) {
  const deltaTime = time - lastUpdate;
  lastUpdate = time;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }

  if (player.score >= 100) {
    dropInterval = 900;
  }
  if (player.score >= 300) {
    dropInterval = 800;
  }
  if (player.score >= 500) {
    dropInterval = 600;
  }
  if (player.score >= 700) {
    dropInterval = 400;
  }
  if (player.score >= 900) {
    dropInterval = 300;
  }
  if (player.score >= 1200) {
    dropInterval = 200;
  }
  if (player.score >= 1500) {
    dropInterval = 100;
  }

  draw();
  if (continueTetris) {
    requestAnimationFrame(update);
  }
}

// pause tetris game
function stopTetris() {
  continueTetris = false;
}

// continue playing tetris
function continueGame() {
  continueTetris = !continueTetris;
  update();
}

// keyboard event listeners for manipulate with pieces
document.addEventListener("keydown", (event) => {
  // move left
  if (event.keyCode === 37) {
    playerMove(-1);
    // move right
  } else if (event.keyCode === 39) {
    playerMove(1);
    // move down
  } else if (event.keyCode === 40) {
    playerDrop();
    // rotate left
  } else if (event.keyCode === 13) {
    pieceRotate(-1);
    // rotate right
  } else if (event.keyCode === 38) {
    pieceRotate(1);
  }
});

playerReset();
updateScore();
update();
