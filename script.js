// JavaScript game logic goes here

// Initialize the game constants
const WIDTH = 800;
const HEIGHT = 600;
const GRID_SIZE = 20;
const SNAKE_SPEED = 10;

// Colors
const BLACK = "#000000";
const GREEN = "#00FF00";
const RED = "#FF0000";

// Initialize the game canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = WIDTH;
canvas.height = HEIGHT;

// Player initial position and direction
let playerSnake = [{ x: WIDTH / 2, y: HEIGHT / 2 }];
let playerDirection = { x: 0, y: 0 };
let playerHasEaten = false;

// Enemy snake initial position
let enemySnake = [{ x: 100, y: 100 }];  // You can set a different starting position for the enemy snake
let enemyDirection = { x: GRID_SIZE, y: 0 };
let enemyHasEaten = false;

// Food initial positions for player and enemy snakes
let playerFood = { x: Math.floor(Math.random() * (WIDTH / GRID_SIZE)) * GRID_SIZE, y: Math.floor(Math.random() * (HEIGHT / GRID_SIZE)) * GRID_SIZE };
let enemyFood = { x: Math.floor(Math.random() * (WIDTH / GRID_SIZE)) * GRID_SIZE, y: Math.floor(Math.random() * (HEIGHT / GRID_SIZE)) * GRID_SIZE };

// Touch screen controls
let touchStartX, touchStartY;

// Game loop
let running = true;
function gameLoop() {
    if (!running) {
        // Game over
        const font = "36px Arial";
        ctx.fillStyle = "white";
        ctx.font = font;
        ctx.fillText("Game Over", WIDTH / 2 - 80, HEIGHT / 2 - 18);
        return;
    }

    // Handle user input for the player snake
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowLeft':
                playerDirection = { x: -GRID_SIZE, y: 0 };
                break;
            case 'ArrowRight':
                playerDirection = { x: GRID_SIZE, y: 0 };
                break;
            case 'ArrowUp':
                playerDirection = { x: 0, y: -GRID_SIZE };
                break;
            case 'ArrowDown':
                playerDirection = { x: 0, y: GRID_SIZE };
                break;
        }
    });

    // Handle touch events for the player snake
    canvas.addEventListener('touchstart', (event) => {
        const touch = event.touches[0];
        handleTouchStart(touch);
    });

    canvas.addEventListener('touchmove', (event) => {
        const touch = event.touches[0];
        handleTouchMove(touch);
    });

    function handleTouchStart(touch) {
        // Store the initial touch coordinates
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }

    function handleTouchMove(touch) {
        // Calculate the change in touch coordinates
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;

        // Determine the direction based on the change in coordinates
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 0) {
                playerDirection = { x: GRID_SIZE, y: 0 }; // Right
            } else {
                playerDirection = { x: -GRID_SIZE, y: 0 }; // Left
            }
        } else {
            // Vertical swipe
            if (deltaY > 0) {
                playerDirection = { x: 0, y: GRID_SIZE }; // Down
            } else {
                playerDirection = { x: 0, y: -GRID_SIZE }; // Up
            }
        }

        // Prevent scrolling the page while swiping
        event.preventDefault();
    }

    // Move the player snake
    let newHead = { x: playerSnake[0].x + playerDirection.x, y: playerSnake[0].y + playerDirection.y };

    // Check for boundaries and reverse direction if wall collision occurs
    if (!(0 <= newHead.x && newHead.x < WIDTH) || !(0 <= newHead.y && newHead.y < HEIGHT)) {
        playerDirection = { x: -playerDirection.x, y: -playerDirection.y };
        newHead = { x: playerSnake[0].x + playerDirection.x, y: playerSnake[0].y + playerDirection.y };
    }

    playerSnake.unshift(newHead);

    // Check for collisions with the player food
    if (newHead.x === playerFood.x && newHead.y === playerFood.y) {
        // Generate new food
        playerFood = { x: Math.floor(Math.random() * (WIDTH / GRID_SIZE)) * GRID_SIZE, y: Math.floor(Math.random() * (HEIGHT / GRID_SIZE)) * GRID_SIZE };
        playerHasEaten = true;
    }

    // Control player snake's growth
    if (!playerHasEaten) {
        playerSnake.pop();
    } else {
        playerHasEaten = false;
    }

    // Move the enemy snake
    let enemyHead = { x: enemySnake[0].x + enemyDirection.x, y: enemySnake[0].y + enemyDirection.y };

    // Check for boundaries and reverse direction if wall collision occurs
    if (!(0 <= enemyHead.x && enemyHead.x < WIDTH) || !(0 <= enemyHead.y && enemyHead.y < HEIGHT)) {
        enemyDirection = { x: -enemyDirection.x, y: -enemyDirection.y };
        enemyHead = { x: enemySnake[0].x + enemyDirection.x, y: enemySnake[0].y + enemyDirection.y };
    }

    enemySnake.unshift(enemyHead);

    // Check for collisions with the enemy food
    if (enemyHead.x === enemyFood.x && enemyHead.y === enemyFood.y) {
        // Generate new food
        enemyFood = { x: Math.floor(Math.random() * (WIDTH / GRID_SIZE)) * GRID_SIZE, y: Math.floor(Math.random() * (HEIGHT / GRID_SIZE)) * GRID_SIZE };
        enemyHasEaten = true;
    }

    // Control enemy snake's growth
    if (!enemyHasEaten) {
        enemySnake.pop();
    } else {
        enemyHasEaten = false;
    }

    // Check for collisions with the player snake
    for (let i = 0; i < enemySnake.length; i++) {
        if (enemySnake[i].x === playerSnake[0].x && enemySnake[i].y === playerSnake[0].y) {
            running = false;  // End the game if the player snake collides with the enemy snake
        }
    }

    // Draw everything
    ctx.fillStyle = BLACK;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = GREEN;
    ctx.fillRect(playerFood.x, playerFood.y, GRID_SIZE, GRID_SIZE);

    ctx.fillStyle = RED;
    ctx.fillRect(enemyFood.x, enemyFood.y, GRID_SIZE, GRID_SIZE);

    ctx.fillStyle = GREEN;
    playerSnake.forEach((segment) => {
        ctx.fillRect(segment.x, segment.y, GRID_SIZE, GRID_SIZE);
    });

    ctx.fillStyle = RED;
    enemySnake.forEach((segment) => {
        ctx.fillRect(segment.x, segment.y, GRID_SIZE, GRID_SIZE);
    });

    // Limit the frame rate
    setTimeout(gameLoop, 1000 / SNAKE_SPEED);
}

// Start the game loop
gameLoop();
