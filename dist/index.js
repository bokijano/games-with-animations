const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colors = [
  "#2185C8",
  "#7ECEFD",
  "#FFF6E5",
  "#FF7F66",
  "#4717F6",
  "#OEOB16",
  "#A239CA",
  "#4717F6",
];

let gravity = 1;
let friction = 0.7;

// Event Listeners
addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

addEventListener("click", function () {});

// Utility Functions
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min) + 1) + min;
}

function randomColors(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

// Ball object
function Ball(x, y, dx, dy, radius, color) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.color = color;

  this.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  };
  this.update = function () {
    this.draw();

    if (
      this.x + this.radius + this.dx > canvas.width ||
      this.x - this.radius < 0
    ) {
      this.dx = -this.dx;
    }

    if (this.y + this.radius + this.dy > canvas.height) {
      this.dy = -this.dy * friction;
    } else {
      this.dy += gravity;
    }

    this.x += this.dx;
    this.y += this.dy;
  };
}

// Implementation
let ball;
let ballArray = [];
function init() {
  ballArray = [];
  for (let i = 0; i < 500; i++) {
    let radius = randomIntFromRange(10, 30);
    let x = randomIntFromRange(radius, canvas.width - radius);
    let y = randomIntFromRange(0, canvas.height - radius);
    let dx = randomIntFromRange(-2, 2);
    let dy = randomIntFromRange(-2, 2);
    let color = randomColors(colors);

    ballArray.push(new Ball(x, y, dx, dy, radius, color));
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < ballArray.length; i++) {
    ballArray[i].update();
  }

  requestAnimationFrame(animate);
}

init();
animate();
