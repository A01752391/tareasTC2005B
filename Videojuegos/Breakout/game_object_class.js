/*
* Miranda Urban Solano
* 
* 30 de abril de 2025
*
*/

"use strict";

// Global variables
const canvasWidth = 800;
const canvasHeight = 600;

// Variable to store the times for the frames
let oldTime;

// Global settings
const paddleVelocity = 0.8;
const speedIncrease = 1.05;
const initialSpeed = 0.2;

// Context of the Canvas
let ctx;

// The game object
let game;

// Classes for the Pong game

// Class to control de ball
class Ball extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "ball");
        this.reset(); // Start game
    }

    update(deltaTime) {
        // Change the position depending on the velocity
        this.position = this.position.plus(this.velocity.times(deltaTime));
    }

    initVelocity() {
        if (this.savedVelocity) {
            this.velocity = this.savedVelocity;
            this.savedVelocity = null;
        } else {
            const angle = Math.random() * Math.PI / 3 + Math.PI / 6;
            this.velocity = new Vec(Math.cos(angle), Math.sin(angle)).times(initialSpeed);
            this.velocity.x *= Math.random() > 0.5 ? 1 : -1;
        }
        this.inPlay = true;
    }

    reset(velocity) {
        this.position = new Vec(canvasWidth / 2, canvasHeight / 2);
        this.savedVelocity = this.velocity;
        this.velocity = new Vec(0, 0);
        this.inPlay = false;
    }
}

// Class to control the paddle
class Paddle extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "paddle");
        this.velocity = new Vec(0, 0);
    }

    update(deltaTime) {
        this.position = this.position.plus(this.velocity.times(deltaTime));
        if (this.position.x < 0){
            this.position.x = 0;
        } else if (this.position.x + this.width > canvasWidth){
            this.position.x = canvasWidth- this.width;
        }
    }

    reset() {
        // Change the position of the paddle to the center
        this.position = new Vec(canvasWidth / 2 - 55, canvasHeight - 60);
    }
}

// Class to control each block
class Block extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "block");
    }
}

// Class to controll all blocks
class BlockManager {
    constructor(rows, columns, blockWidth, blockHeight, colors, marginX = 5, marginY = 5, offsetX = 2.5, offsetY = 48) {
        this.blocks = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const x = offsetX + col * (blockWidth + marginX);
                const y = offsetY + row * (blockHeight + marginY);
                const color = colors[row % colors.length];

                const block = new Block(new Vec(x, y), blockWidth, blockHeight, color);
                this.blocks.push(block);
            }
        }
    }

    draw(ctx) {
        this.blocks.forEach(block => block.draw(ctx));
    }

}


// Class that controls all the objects in the game
class Game {
    constructor(canvasWidth, canvasHeight) {
        // Create the objects of the game
        // Elements
        this.ball = new Ball(new Vec(canvasWidth / 2, canvasHeight / 2), 20, 20, "white");
        this.paddle = new Paddle(new Vec(canvasWidth / 2 - 55, canvasHeight - 60), 110, 30, "black");
        this.blocks = new BlockManager(6, 10, 75, 20, ["red", "orange", "yellow", "green", "blue", "purple"]);

        // Borders
        this.topBorder = new GameObject(new Vec(0,0), canvasWidth, 40, "black", "barrier");
        this.bottomBorder = new GameObject(new Vec(0,canvasHeight - 10), canvasWidth, 10, "#87ceeb", "barrier");
        
        this.leftBorder = new GameObject(new Vec(0,0), 10, canvasWidth, "#87ceeb", "barrier");
        this.rightBorder = new GameObject(new Vec(canvasWidth - 10, 0), 10, canvasHeight, "#87ceeb", "barrier");
        
        // Initialize text
        this.score = new TextLabel(new Vec(120, 26), "20px Arial", "white");
        this.live = new TextLabel(new Vec(600, 26), "20px Arial", "white");
        this.over = new TextLabel(new Vec(canvasWidth / 3, canvasHeight / 2 + 40), "30px Arial", "white");
        this.win = new TextLabel(new Vec(canvasWidth / 2 - 83, canvasHeight / 2 + 40), "30px Arial", "white");


        // Initialize points and lifes
        this.points = 0;
        this.lives = 3;
        this.lastSpeedUp = 0;

        this.createEventListeners();
    }

    update(deltaTime) {
        if (this.lives <= 0) return; // Finish the game if no lives left

        this.paddle.update(deltaTime);
        this.ball.update(deltaTime); 

         // Ball touches borders
         if (boxOverlap(this.ball, this.leftBorder) || 
            boxOverlap(this.ball, this.rightBorder)) {
            this.ball.velocity.x *= -1;
        }

        // Ball excedes bottom border
        if (boxOverlap(this.ball, this.bottomBorder)) {
            this.lives -= 1;
            this.ball.reset();
            this.paddle.reset();
        }

        // Ball touches paddle
        if (boxOverlap(this.ball, this.paddle) ||
            boxOverlap(this.ball, this.topBorder)) {
            this.ball.velocity.y *= -1;
        }

        // Update blocks
        this.blocks.blocks = this.blocks.blocks.filter(block => {
            if (boxOverlap(this.ball, block)) {
                this.points += 1;
                this.ball.velocity.y *= -1;

                // Increment velocity for each 10 blocks destroyed
                if (this.points % 10 === 0 && this.points !== this.lastSpeedUp) {
                    this.ball.velocity = this.ball.velocity.times(1.2);
                    this.lastSpeedUp = this.points;
                }

                return false; // Delete block
            }
            return true; // Mantain block
        })
    }

    draw(ctx) {
        // Draw objects on the canvas
        this.leftBorder.draw(ctx);
        this.rightBorder.draw(ctx);
        this.topBorder.draw(ctx);
        this.bottomBorder.draw(ctx);

        this.score.draw(ctx, `Blocks: ${this.points} / 60`);
        this.live.draw(ctx, `Lives: ${this.lives}`);

        this.blocks.draw(ctx);
        this.paddle.draw(ctx);

        if (this.lives > 0 || this.points == 60) {
            this.ball.draw(ctx);
        }

        if (this.lives <= 0){
            this.over.draw(ctx, 'G A M E   O V E R');
        }

        if (this.points == 60){
            this.win.draw(ctx, 'W I N N E R !');
        }
    }

    createEventListeners() {
        // Determine events according to the interaction of the user
        window.addEventListener('keydown', (event) => {
            if (event.key === "a") {
                this.paddle.velocity.x = -paddleVelocity;
            }
            if (event.key === "s") {
                this.paddle.velocity.x = paddleVelocity;
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key === "a") {
                this.paddle.velocity.x = 0;
            }
            if (event.key === "s") {
                this.paddle.velocity.x = 0;
            }

            // Space to initialize the game
            if (event.key == " ") {
                if(!this.ball.inPlay){
                    this.ball.initVelocity();
                }
            }
        });

    }
        
}


function main() {
    // Get a reference to the object with id 'canvas' in the page
    const canvas = document.getElementById('canvas');
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Get the context for drawing in 2D
    ctx = canvas.getContext('2d');

    game = new Game(canvasWidth, canvasHeight);

    drawScene(0);
}

function drawScene(newTime) {
    if (oldTime == undefined) {
        oldTime = newTime;
    }
    let deltaTime = newTime - oldTime;
    //console.log(⁠ DeltaTime: ${deltaTime} ⁠);

    // Clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Update all game objects
    game.update(deltaTime);

    // Draw all game objects
    game.draw(ctx);

    // Update the time for the next frame
    oldTime = newTime;
    requestAnimationFrame(drawScene);
}