const playAgainWin = document.getElementById("win-restart");
const playAgainLose = document.getElementById("restart");

tetrisGame.style.display = "none";
//homePage.style.display = "none";
playBrick.style.display = "none";

let GAME_OVER = true;

// display and exit from brick breaker
function playBrickBreaker() {
  tetrisGame.style.display = "none";
  homePage.style.display = "none";
  playBrick.style.display = "block";

  const playBrickGame = document.createElement("button");
  playBrickGame.setAttribute("class", "play-brick");
  playBrickGame.innerHTML = "play";

  playBrickGame.onclick = function () {
    playGame.style.display = "none";
    GAME_OVER = false;
    loop();
  };

  playGame.appendChild(playBrickGame);
}

// canvas Brick Breaker game
const cvs = document.getElementById("playBrickCvs");
const ctxBrick = cvs.getContext("2d");

ctxBrick.lineWidth = 3;

// game variables
const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 10;
const PADDLE_HEIGTH = 20;

const BALL_RADIUS = 8;

let LIFE = 3;

let SCORE = 0;
const SCORE_UNIT = 10;

let LEVEL = 1;
const MAX_LEVEL = 3;

let leftArrow = false;
let rightArrow = false;

levelCount.innerHTML = LEVEL;

// create paddle
const paddle = {
  x: cvs.width / 2 - PADDLE_WIDTH / 2,
  y: cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGTH,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGTH,
  dx: 10,
};

// draw paddle
function drawPaddle() {
  ctxBrick.fillStyle = "whitesmoke";
  ctxBrick.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  ctxBrick.strokeStyle = "orange";
  ctxBrick.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// control the paddle with keyboard
document.addEventListener("keydown", (event) => {
  if (event.keyCode == 37) {
    leftArrow = true;
  } else if (event.keyCode == 39) {
    rightArrow = true;
  }
});
document.addEventListener("keyup", (event) => {
  if (event.keyCode == 37) {
    leftArrow = false;
  } else if (event.keyCode == 39) {
    rightArrow = false;
  }
});
// move paddle
function movePaddle() {
  if (rightArrow && paddle.x + paddle.width < cvs.width) {
    paddle.x += paddle.dx;
  } else if (leftArrow && paddle.x > 0) {
    paddle.x -= paddle.dx;
  }
}

// create controls for mobile device
let moveLeft = document.createElement("span");
moveLeft.setAttribute("class", "left-move");
moveLeft.onclick = function () {
  if (paddle.x > 0) {
    paddle.x -= paddle.dx * 2;
  }
};
brickControls.appendChild(moveLeft);

let moveRight = document.createElement("span");
moveRight.setAttribute("class", "right-move");
moveRight.onclick = function () {
  if (paddle.x + paddle.width < cvs.width) {
    paddle.x += paddle.dx * 2;
  }
};
brickControls.appendChild(moveRight);

// create the ball
const ballBreak = {
  x: cvs.width / 2,
  y: paddle.y - BALL_RADIUS,
  radius: BALL_RADIUS,
  speed: 6,
  dx: 4 * (Math.random() * 2 - 1),
  dy: -4,
};

// draw the ball
function drawBallBreaker() {
  ctxBrick.beginPath();

  ctxBrick.arc(ballBreak.x, ballBreak.y, ballBreak.radius, 0, Math.PI * 2);
  ctxBrick.fillStyle = "whitesmoke";
  ctxBrick.fill();

  ctxBrick.strokeStyle = "orange";
  ctxBrick.stroke();

  ctxBrick.closePath();
}

// move the ball
function moveBall() {
  ballBreak.x += ballBreak.dx;
  ballBreak.y += ballBreak.dy;
}

// ball and wall collision
function wallCollision() {
  if (
    ballBreak.x + ballBreak.radius > cvs.width ||
    ballBreak.x - ballBreak.radius < 0
  ) {
    ballBreak.dx = -ballBreak.dx;
  }

  if (ballBreak.y - ballBreak.radius < 0) {
    ballBreak.dy = -ballBreak.dy;
  }

  if (ballBreak.y + ballBreak.radius > cvs.height) {
    LIFE--;
    lifeCount.innerHTML = LIFE;
    resetBall();
  }
}

// ball and paddle collision
function paddleCollision() {
  if (
    ballBreak.x < paddle.x + paddle.width &&
    ballBreak.x > paddle.x &&
    paddle.y < paddle.y + paddle.height &&
    ballBreak.y > paddle.y
  ) {
    // check where the ball hit the paddle
    let collidePoint = ballBreak.x - (paddle.x + paddle.width / 2);

    // normalize the value
    collidePoint = collidePoint / (paddle.width / 2);

    // calculate the angle of the ball
    let angle = (collidePoint * Math.PI) / 3;

    ballBreak.dx = ballBreak.speed * Math.sin(angle);
    ballBreak.dy = -ballBreak.speed * Math.cos(angle);
  }
}

// reset the ball
function resetBall() {
  ballBreak.x = cvs.width / 2;
  ballBreak.y = paddle.y - BALL_RADIUS;
  ballBreak.speed = ballBreak.speed;
  ballBreak.dx = 4 * (Math.random() * 2 - 1);
  ballBreak.dy = -4;

  paddle.x = cvs.width / 2 - PADDLE_WIDTH / 2;
  paddle.y = cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGTH;
  paddle.width = PADDLE_WIDTH;
  paddle.height = PADDLE_HEIGTH;
  paddle.dx = 10;
}

// create the bricks
const brick0 = {
  row: 4,
  column: 5,
  width: 50,
  height: 15,
  offsetLeft: 15,
  offsetTop: 10,
  marginTop: 20,
  fillColor: "yellow",
  strokeColor: "whitesmoke",
};

const brick1 = {
  row: 2,
  column: 5,
  width: 50,
  height: 15,
  offsetLeft: 15,
  offsetTop: 10,
  marginTop: 20,
  fillColor: "purple",
  strokeColor: "whitesmoke",
};

let bricks = [];

function createBricks(brick) {
  for (let r = 0; r < brick.row; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.column; c++) {
      bricks[r][c] = {
        x: c * (brick.offsetLeft + brick.width) + brick.offsetLeft,
        y:
          r * (brick.offsetTop + brick.height) +
          brick.offsetTop +
          brick.marginTop,
        status: true,
      };
    }
  }
}

createBricks(brick0);
createBricks(brick1);

// draw the bricks
function drawBricks(brick) {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      // if the brick is not broken
      if (b.status) {
        ctxBrick.fillStyle = brick.fillColor;
        ctxBrick.fillRect(b.x, b.y, brick.width, brick.height);

        ctxBrick.strokeStyle = brick.strokeColor;
        ctxBrick.strokeRect(b.x, b.y, brick.width, brick.height);
      }
    }
  }
}

// ball brick collision
function brickCollision(brick) {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      // if the brick is not broken
      if (b.status) {
        if (
          ballBreak.x + ballBreak.radius > b.x &&
          ballBreak.x - ballBreak.radius < b.x + brick.width &&
          ballBreak.y + ballBreak.radius > b.y &&
          ballBreak.y - ballBreak.radius < b.y + brick.height
        ) {
          ballBreak.dy = -ballBreak.dy;
          b.status = false; //the brick is broken

          SCORE += SCORE_UNIT;
          scoreCount.innerHTML = SCORE;
        }
      }
    }
  }
}

// draw function
function drawBreakBreaker() {
  drawPaddle();

  drawBallBreaker();

  drawBricks(brick0);
  drawBricks(brick1);
}

// game over function
function gameOver() {
  if (LIFE <= 0) {
    GAME_OVER = true;
    loseGame.style.display = "block";
  }
}

// level up function
function levelUp() {
  let levelDone = true;

  // check if all bricks are broken
  for (let r = 0; r < brick0.row; r++) {
    for (let c = 0; c < brick0.column; c++) {
      levelDone = levelDone && !bricks[r][c].status;
    }
    if (levelDone) {
      if (LEVEL >= MAX_LEVEL) {
        GAME_OVER = true;
        winGame.style.display = "block";
      }
      brick0.row++;
      ballBreak.speed += 1;
      createBricks(brick0);
      createBricks(brick1);
      resetBall();
      LEVEL++;
      levelCount.innerHTML = LEVEL;
    }
  }
}

// update game function
function updateBreaker() {
  movePaddle();

  moveBall();

  wallCollision();

  paddleCollision();

  brickCollision(brick0);
  brickCollision(brick1);

  gameOver();

  levelUp();
}

// game loop
function loop() {
  // clear canvas
  ctxBrick.clearRect(0, 0, cvs.width, cvs.height);

  drawBreakBreaker();

  updateBreaker();

  if (!GAME_OVER) {
    requestAnimationFrame(loop);
  }
}

// play again button
//playAgain.addEventListener("click", function () {
function playAgain() {
  GAME_OVER = false;
  LIFE = 3;

  SCORE = 0;
  LEVEL = 1;
  brick0.row = 4;
  createBricks(brick0);
  createBricks(brick1);
  loop();
  loseGame.style.display = "none";
  winGame.style.display = "none";
  resetBall();
  playBrickBreaker();
  levelCount.innerHTML = LEVEL;
  scoreCount.innerHTML = SCORE;
  lifeCount.innerHTML = LIFE;
  console.log("work");
}

playAgainWin.addEventListener("click", function () {
  playAgain();
});
playAgainLose.addEventListener("click", function () {
  playAgain();
});

loop();
