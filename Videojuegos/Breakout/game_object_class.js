/*
* Miranda Urban Solano
* 
* 7 de abril de 2025
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
        // Determine the vector of velocity with a random angle in the range [-45°, 45°]
        const angle = Math.random() * (Math.PI / 2 - Math.PI / 4);
        this.velocity = new Vec(Math.cos(angle), Math.sin(angle)).times(initialSpeed);
        this.velocity = this.velocity.times(Math.random() > 0.5 ? 1 : -1); // Randomly select the direction on x (left or right)
        this.inPlay = true;
    }

    reset() {
        // Change the position of the ball to the center
        this.position = new Vec(canvasWidth / 2, canvasHeight / 2);
        this.velocity = new Vec(0,0);
        this.inPlay = false;
    }
}

class Paddle extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "paddle");
        this.velocity = new Vec(0, 0);
    }

    update(deltaTime) {
        this.position = this.position.plus(this.velocity.times(deltaTime));
        if (this.position.y < 0){
            this.position. y = 0;
        } else if (this.position.y + this.height > canvasHeight){
            this.position.y = canvasHeight - this.height;
        }
    }
}

// Class that controls all the objects in the game
class Game {
    constructor(canvasWidth, canvasHeight) {
        // Create the objects of the game
        // Elements
        this.ball = new Ball(new Vec(canvasWidth / 2, canvasHeight / 2), 20, 20, "black");
        this.paddleLeft = new Paddle(new Vec(20, canvasHeight / 2 - 50), 50, 100, "green");
        this.paddleRight = new Paddle(new Vec(canvasWidth - 70, canvasHeight / 2 - 50), 50, 100, "green");
        
        // Borders
        this.topBorder = new GameObject(new Vec(0,0), canvasWidth, 10, "red", "barrier");
        this.bottomBorder = new GameObject(new Vec(0,canvasHeight - 10), canvasWidth, 10, "red");
        
        this.goalLeft = new GameObject(new Vec(0,0), 10, canvasWidth, "white", "goal");
        this.goalRight = new GameObject(new Vec(canvasWidth - 10, 0), 10, canvasHeight, "white", "goal");
        
        // Score text
        this.scoreLeft = new TextLabel(new Vec(200, 100), "30px Arial", "white");
        this.scoreRight = new TextLabel(new Vec(600, 100), "30px Arial", "white");

        // Initialize points
        this.pointsLeft = 0;
        this.pointsRight = 0;

        this.createEventListeners();
    }

    update(deltaTime) {
        this.paddleLeft.update(deltaTime);
        this.paddleRight.update(deltaTime);
        this.ball.update(deltaTime); 

        if (boxOverlap(this.ball, this.paddleRight) || boxOverlap(this.ball, this.paddleLeft)) {
            this.ball.velocity.x *= -1;
        }
        if (boxOverlap(this.ball, this.topBorder) || boxOverlap(this.ball, this.bottomBorder)) {
            this.ball.velocity.y *= -1;
        }
        if (boxOverlap(this.ball, this.goalLeft)){
            this.pointsRight += 1; 
            this.ball.reset();
            console.log(`Score: ${this.pointsLeft}  |  ${this.pointsRight}`);
        }
        if (boxOverlap(this.ball, this.goalRight)){
            this.pointsLeft += 1;
            this.ball.reset();
            console.log(`Score: ${this.pointsLeft}  |  ${this.pointsRight}`);
        }
    }

    draw(ctx) {
        // Draw objects on the canvas
        this.scoreLeft.draw(ctx, `${this.pointsLeft}`);
        this.scoreRight.draw(ctx, `${this.pointsRight}`);
    
        this.goalLeft.draw(ctx);
        this.goalRight.draw(ctx);
        this.topBorder.draw(ctx);
        this.bottomBorder.draw(ctx);

        this.paddleLeft.draw(ctx);
        this.paddleRight.draw(ctx);
        this.ball.draw(ctx);
    }

    createEventListeners() {
        // Determine events according to the interaction of the user
        window.addEventListener('keydown', (event) => {
            if (event.key === "q") {
                this.paddleLeft.velocity.y = -paddleVelocity;
            }
            if (event.key === "a") {
                this.paddleLeft.velocity.y = paddleVelocity;
            }
            if (event.key === "o") {
                this.paddleRight.velocity.y = -paddleVelocity;
            }
            if (event.key === "l") {
                this.paddleRight.velocity.y = paddleVelocity;
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key === "q") {
                this.paddleLeft.velocity.y = 0;
            }
            if (event.key === "a") {
                this.paddleLeft.velocity.y = 0;
            }
            if (event.key === "o") {
                this.paddleRight.velocity.y = 0;
            }
            if (event.key === "l") {
                this.paddleRight.velocity.y = 0;
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