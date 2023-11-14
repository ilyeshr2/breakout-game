const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

function random(a, b) {
    return a + Math.random() * (b - a);
}
let c=0
class Rect {
    constructor(x, y, width, height, color, isActive = true) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isActive = isActive;
    }

    createRect() {
        if (this.isActive) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

class Ball {
    constructor(x, y, vx, vy, r, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = r;
        this.color = color;
    }

    createBall() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    move() {
        const maxMoveDistance = 10; // Adjust this value based on your requirements

        for (let i = 0; i < maxMoveDistance; i++) {
            this.x += this.vx;
            this.y += this.vy;
            this.handleBoxCollision();
            this.handleRectCollision();
        }
    }

    handleBoxCollision() {
        if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
            this.vx = -this.vx;
        }
        if (this.y - this.radius <= 0) {
            this.vy = -this.vy;
        }

        // Check collision with the paddle
        if (
            this.y + this.radius >= paddle.y &&
            this.y - this.radius <= paddle.y + paddle.height &&
            this.x + this.radius >= paddle.x &&
            this.x - this.radius <= paddle.x + paddle.width
        ) {
            this.vy = -this.vy;
        }
    }

    handleRectCollision() {
        rects.forEach((rect, index) => {
            if (rect.isActive) {
                const closestX = Math.max(rect.x, Math.min(this.x, rect.x + rect.width));
                const closestY = Math.max(rect.y, Math.min(this.y, rect.y + rect.height));

                const distanceX = this.x - closestX;
                const distanceY = this.y - closestY;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                if (distance < this.radius) {
                    c++
                    rect.isActive = false;
                    const overlap = this.radius - distance;
                    this.x += overlap * (this.x - closestX) / distance;
                    this.y += overlap * (this.y - closestY) / distance;

                    const dotProduct = (this.vx * distanceX + this.vy * distanceY) / (distance * distance);
                    this.vx -= 2 * dotProduct * distanceX;
                    this.vy -= 2 * dotProduct * distanceY;
                }
            }
        });
    }
}

class Paddle {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    createPaddle() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    moveLeft() {
        this.x -= 50; // Adjust the speed of the paddle
        if (this.x < 0) {
            this.x = 0;
        }
    }

    moveRight() {
        this.x += 50; // Adjust the speed of the paddle
        if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
        }
    }
}

function generateRects() {
    const rects = [];
    const rectWidth = 80;
    const rectHeight = 20;


    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const rectX = col * (rectWidth + 5); // 5 is the spacing between rectangles
            const rectY = row * (rectHeight + 5) + 50; // 50 is the offset for the top space
            const rectColor = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;

            const rect = new Rect(rectX, rectY, rectWidth, rectHeight, rectColor);
            rects.push(rect);
        }
    }
    return rects;
}
const numCols = 6
const numRows = 5
let rects = generateRects();
let ball = new Ball(250, 250, random(random(-3,-2),random(2,3)), 1, 10, 'black');
let paddle = new Paddle(200, canvas.height - 20, 200, 10, 'blue');

let score = 0;
const maxScore = numCols * numRows; // Maximum achievable score

function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + c, 10, 30);
}

function drawWinMessage() {
    ctx.font = "40px Arial";
    ctx.fillStyle = "green";
    ctx.fillText("You Win!", canvas.width / 2 - 100, canvas.height / 2);
}

function drawLoseMessage() {
    ctx.font = "40px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("You Lose!", canvas.width / 2 - 120, canvas.height / 2);
}

function startGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ball.createBall();
    ball.move();

    paddle.createPaddle();

    rects.forEach(rect => {
        rect.createRect();
    });

    drawScore();

    // Check for collisions and update game state
    ball.handleBoxCollision();
    ball.handleRectCollision();

    if (c === maxScore) {
        drawWinMessage();
    } else if (ball.y + ball.radius >= canvas.height) {
        drawLoseMessage();
    } else {
        requestAnimationFrame(startGame);
    }
}

document.addEventListener("keydown", function (event) {
    if (event.code === "ArrowLeft") {
        paddle.moveLeft();
    } else if (event.code === "ArrowRight") {
        paddle.moveRight();
    }
});

startGame();
