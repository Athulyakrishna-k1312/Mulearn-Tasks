const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let screenWidth = canvas.width;
let screenHeight = canvas.height;

const counter = document.querySelector("#ball-count");
let remainingBalls = 0;

// -------------------- Utility Functions --------------------

const randomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getColor = () => {
  const red = randomNumber(0, 255);
  const green = randomNumber(0, 255);
  const blue = randomNumber(0, 255);

  return `rgb(${red} ${green} ${blue})`;
};

const distanceBetween = (object1, object2) => {
  const xDifference = object1.x - object2.x;
  const yDifference = object1.y - object2.y;

  return Math.sqrt(
    xDifference * xDifference +
    yDifference * yDifference
  );
};

// -------------------- Parent Shape --------------------

class Shape {
  constructor(x, y, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
    this.active = true;
  }
}

// -------------------- Ball --------------------

class Ball extends Shape {
  constructor(x, y, speedX, speedY, radius, color) {
    super(x, y, speedX, speedY);

    this.radius = radius;
    this.color = color;
  }

  display() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  move() {
    if (
      this.x + this.radius >= screenWidth ||
      this.x - this.radius <= 0
    ) {
      this.speedX *= -1;
    }

    if (
      this.y + this.radius >= screenHeight ||
      this.y - this.radius <= 0
    ) {
      this.speedY *= -1;
    }

    this.x += this.speedX;
    this.y += this.speedY;
  }

  findCollisions(allBalls) {
    for (const otherBall of allBalls) {
      if (otherBall === this || !otherBall.active) {
        continue;
      }

      const distance = distanceBetween(this, otherBall);

      if (distance <= this.radius + otherBall.radius) {
        const newColor = getColor();

        this.color = newColor;
        otherBall.color = newColor;
      }
    }
  }
}

// -------------------- Hunter Circle --------------------

class Hunter extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20);

    this.radius = 10;
    this.color = "white";

    this.control();
  }

  control() {
    document.addEventListener("keydown", (event) => {
      const key = event.key;

      if (key === "ArrowLeft" || key === "a") {
        this.x -= this.speedX;
      }

      if (key === "ArrowRight" || key === "d") {
        this.x += this.speedX;
      }

      if (key === "ArrowUp" || key === "w") {
        this.y -= this.speedY;
      }

      if (key === "ArrowDown" || key === "s") {
        this.y += this.speedY;
      }
    });
  }

  display() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;

    ctx.stroke();
  }

  stayInsideCanvas() {
    if (this.x < this.radius) {
      this.x = this.radius;
    }

    if (this.x > screenWidth - this.radius) {
      this.x = screenWidth - this.radius;
    }

    if (this.y < this.radius) {
      this.y = this.radius;
    }

    if (this.y > screenHeight - this.radius) {
      this.y = screenHeight - this.radius;
    }
  }

  removeBalls(allBalls) {
    for (const ball of allBalls) {
      if (!ball.active) {
        continue;
      }

      if (distanceBetween(this, ball) < this.radius + ball.radius) {
        ball.active = false;
        remainingBalls--;

        counter.textContent = remainingBalls;
      }
    }
  }
}

// -------------------- Create Balls --------------------

const ballList = [];

for (let i = 0; i < 25; i++) {
  const radius = randomNumber(10, 20);

  const newBall = new Ball(
    randomNumber(radius, screenWidth - radius),
    randomNumber(radius, screenHeight - radius),
    randomNumber(-7, 7),
    randomNumber(-7, 7),
    radius,
    getColor()
  );

  ballList.push(newBall);
  remainingBalls++;
}

counter.textContent = remainingBalls;

// -------------------- Create Hunter --------------------

const hunter = new Hunter(
  screenWidth / 2,
  screenHeight / 2
);

// -------------------- Game Loop --------------------

function animate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, screenWidth, screenHeight);

  ballList.forEach((ball) => {
    if (ball.active) {
      ball.display();
      ball.move();
      ball.findCollisions(ballList);
    }
  });

  hunter.display();
  hunter.stayInsideCanvas();
  hunter.removeBalls(ballList);

  requestAnimationFrame(animate);
}

animate();
