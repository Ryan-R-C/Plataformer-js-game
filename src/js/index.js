// ==================== CONSTANTS ====================
const GAME_CONFIG = {
    GRAVITY: 0.5,
    MAX_RIGHT_POSITION_BEFORE_SCROLL: 400,
    MIN_RIGHT_POSITION_BEFORE_SCROLL: 100,
    END_OF_LEVEL: 4310,
    PLAYER_SPEED: 10,
    PLAYER_JUMP_BOOST: 15,
    PLAYER_WEIGHT: 20,
    PLAYER_WIDTH: 66,
    PLAYER_HEIGHT: 150,
    STAND_SPRITE_FRAMES: 59,
    RUN_SPRITE_FRAMES: 29
};

const COLORS = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

const BASE_URL = "https://raw.githubusercontent.com/Ryan-R-C/Plataformer-js-game/main/assets";

const ASSET_URLS = {
    background: `${BASE_URL}/background.png`,
    hills: `${BASE_URL}/hills.png`,
    platform: `${BASE_URL}/platform.png`,
    platformSmallTall: `${BASE_URL}/platformSmallTall.png`,
    spriteRunLeft: `${BASE_URL}/spriteRunLeft.png`,
    spriteRunRight: `${BASE_URL}/spriteRunRight.png`,
    spriteStandLeft: `${BASE_URL}/spriteStandLeft.png`,
    spriteStandRight: `${BASE_URL}/spriteStandRight.png`
};

const KEY_CODES = {
    // WASD
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    // Arrows
    UP: 38,
    LEFT: 37,
    DOWN: 40,
    RIGHT: 39
};

// ==================== UTILITY CLASSES ====================
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    clone() {
        return new Vector2(this.x, this.y);
    }
}

class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    get left() { return this.x; }
    get right() { return this.x + this.width; }
    get top() { return this.y; }
    get bottom() { return this.y + this.height; }

    intersects(other) {
        return this.left < other.right &&
               this.right > other.left &&
               this.top < other.bottom &&
               this.bottom > other.top;
    }
}

// ==================== ASSET MANAGER ====================
class AssetManager {
    constructor() {
        this.images = {};
        this.loadedCount = 0;
        this.totalAssets = 0;
    }

    async loadAssets() {
        const imagePromises = Object.entries(ASSET_URLS).map(([key, url]) => {
            return this.loadImage(key, url);
        });

        this.totalAssets = imagePromises.length;
        
        try {
            await Promise.all(imagePromises);
            console.log('All assets loaded successfully');
        } catch (error) {
            console.error('Failed to load assets:', error);
            throw error;
        }
    }

    loadImage(key, url) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            
            image.onload = () => {
                this.images[key] = image;
                this.loadedCount++;
                resolve(image);
            };
            
            image.onerror = () => {
                reject(new Error(`Failed to load image: ${url}`));
            };
            
            image.src = url;
        });
    }

    getImage(key) {
        const image = this.images[key];
        if (!image) {
            throw new Error(`Image not found: ${key}`);
        }
        return image;
    }

    getLoadingProgress() {
        return this.totalAssets === 0 ? 0 : this.loadedCount / this.totalAssets;
    }
}

// ==================== INPUT MANAGER ====================
class InputManager {
    constructor() {
        this.keys = {
            up: { pressed: false },
            left: { pressed: false },
            down: { pressed: false },
            right: { pressed: false }
        };
        
        this.lastKeyDown = '';
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('keydown', (event) => this.handleKeyDown(event));
        window.addEventListener('keyup', (event) => this.handleKeyUp(event));
    }

    handleKeyDown(event) {
        const { keyCode } = event;
        
        switch (keyCode) {
            case KEY_CODES.W:
            case KEY_CODES.UP:
                this.keys.up.pressed = true;
                break;
            case KEY_CODES.A:
            case KEY_CODES.LEFT:
                this.keys.left.pressed = true;
                this.lastKeyDown = 'left';
                break;
            case KEY_CODES.S:
            case KEY_CODES.DOWN:
                this.keys.down.pressed = true;
                break;
            case KEY_CODES.D:
            case KEY_CODES.RIGHT:
                this.keys.right.pressed = true;
                this.lastKeyDown = 'right';
                break;
        }
    }

    handleKeyUp(event) {
        const { keyCode } = event;
        
        switch (keyCode) {
            case KEY_CODES.W:
            case KEY_CODES.UP:
                this.keys.up.pressed = false;
                break;
            case KEY_CODES.A:
            case KEY_CODES.LEFT:
                this.keys.left.pressed = false;
                this.lastKeyDown = '';
                break;
            case KEY_CODES.S:
            case KEY_CODES.DOWN:
                this.keys.down.pressed = false;
                break;
            case KEY_CODES.D:
            case KEY_CODES.RIGHT:
                this.keys.right.pressed = false;
                this.lastKeyDown = '';
                break;
        }
    }

    isKeyPressed(key) {
        return this.keys[key]?.pressed || false;
    }

    getLastKeyDown() {
        return this.lastKeyDown;
    }

    reset() {
        Object.keys(this.keys).map(key => {
            this.keys[key].pressed = false;
        });
        this.lastKeyDown = '';
    }
}

// ==================== GAME OBJECTS ====================
class GameObject {
    constructor(x = 0, y = 0) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);
        this.width = 0;
        this.height = 0;
    }

    getBounds() {
        return new Rectangle(this.position.x, this.position.y, this.width, this.height);
    }

    update(deltaTime) {
        // Override in subclasses
    }

    draw(context) {
        // Override in subclasses
    }
}

class Player extends GameObject {
    constructor(x = 100, y = 100) {
        super(x, y);
        
        this.speed = GAME_CONFIG.PLAYER_SPEED;
        this.jumpBoost = GAME_CONFIG.PLAYER_JUMP_BOOST;
        this.weight = GAME_CONFIG.PLAYER_WEIGHT;
        this.width = GAME_CONFIG.PLAYER_WIDTH;
        this.height = GAME_CONFIG.PLAYER_HEIGHT;
        
        this.frames = 0;
        this.isGrounded = false;
        
        this.sprites = {
            stand: {
                right: null,
                left: null,
                cropWidth: 177,
                width: 66
            },
            run: {
                right: null,
                left: null,
                cropWidth: 341,
                width: 127.875
            }
        };
        
        this.currentSprite = null;
        this.currentCropWidth = this.sprites.stand.cropWidth;
        this.currentSpriteType = 'stand';
        this.currentDirection = 'right';
    }

    initializeSprites(assetManager) {
        try {
            this.sprites.stand.right = assetManager.getImage('spriteStandRight');
            this.sprites.stand.left = assetManager.getImage('spriteStandLeft');
            this.sprites.run.right = assetManager.getImage('spriteRunRight');
            this.sprites.run.left = assetManager.getImage('spriteRunLeft');
            
            this.currentSprite = this.sprites.stand.right;
        } catch (error) {
            console.error('Failed to initialize player sprites:', error);
        }
    }

    jump() {
        if (this.isGrounded) {
            this.velocity.y = -this.jumpBoost;
            this.isGrounded = false;
        }
    }

    moveLeft() {
        this.velocity.x = -this.speed;
        this.updateSprite('run', 'left');
    }

    moveRight() {
        this.velocity.x = this.speed;
        this.updateSprite('run', 'right');
    }

    stopMoving() {
        this.velocity.x = 0;
    }

    updateSprite(type, direction) {
        if (this.currentSpriteType !== type || this.currentDirection !== direction) {
            this.currentSpriteType = type;
            this.currentDirection = direction;
            this.currentSprite = this.sprites[type][direction];
            this.currentCropWidth = this.sprites[type].cropWidth;
            this.width = this.sprites[type].width;
            this.frames = 0;
        }
    }

    update(deltaTime, canvasHeight) {
        // Update position
        this.position.add(this.velocity);
        
        // Apply gravity
        if (this.position.y + this.height < canvasHeight) {
            this.velocity.y += GAME_CONFIG.GRAVITY;
            this.isGrounded = false;
        }
        
        // Update animation frames
        this.updateAnimationFrame();
        
        // Reset if player falls off screen
        if (this.position.y > canvasHeight) {
            return 'restart';
        }
        
        return null;
    }

    updateAnimationFrame() {
        this.frames++;
        
        const maxFrames = this.currentSpriteType === 'stand' 
            ? GAME_CONFIG.STAND_SPRITE_FRAMES 
            : GAME_CONFIG.RUN_SPRITE_FRAMES;
            
        if (this.frames > maxFrames) {
            this.frames = 0;
        }
    }

    draw(context) {
        if (!this.currentSprite) return;
        
        context.drawImage(
            this.currentSprite,
            this.currentCropWidth * this.frames, // Source X
            0, // Source Y
            this.currentCropWidth, // Source Width
            400, // Source Height
            this.position.x, // Destination X
            this.position.y, // Destination Y
            this.width, // Destination Width
            this.height // Destination Height
        );
    }

    onGroundCollision() {
        this.velocity.y = 0;
        this.isGrounded = true;
    }

    reset() {
        this.position.x = 100;
        this.position.y = 100;
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.frames = 0;
        this.isGrounded = false;
        this.updateSprite('stand', 'right');
    }
}

class Platform extends GameObject {
    constructor(x, y, image) {
        super(x, y);
        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }

    draw(context) {
        context.drawImage(this.image, this.position.x, this.position.y);
    }

    // Check collision with player from above
    checkCollision(player) {
        const playerBounds = player.getBounds();
        const platformBounds = this.getBounds();
        
        const isPlayerAbovePlatform = playerBounds.bottom <= platformBounds.top + 10 &&
                                      playerBounds.bottom + player.velocity.y >= platformBounds.top;
        
        const isPlayerWithinPlatformWidth = playerBounds.right > platformBounds.left &&
                                            playerBounds.left < platformBounds.right;
        
        return isPlayerAbovePlatform && isPlayerWithinPlatformWidth;
    }
}

class GenericObject extends GameObject {
    constructor(x, y, image, parallax) {
        super(x, y);
        this.image = image;
        this.width = image.width;
        this.height = image.height;
        this.parallax = parallax;
    }

    draw(context) {
        context.drawImage(this.image, this.position.x, this.position.y);
    }

    updateParallax() {
        this.position.x -= this.parallax;
    }
}

// ==================== CAMERA ====================
class Camera {
    constructor() {
        this.scrollOffset = 0;
    }

    shouldScrollRight(player) {
        return player.position.x >= GAME_CONFIG.MAX_RIGHT_POSITION_BEFORE_SCROLL;
    }

    shouldScrollLeft(player) {
        return player.position.x <= GAME_CONFIG.MIN_RIGHT_POSITION_BEFORE_SCROLL && 
               this.scrollOffset > 0;
    }

    scrollRight(platforms, genericObjects, speed) {
        platforms.map(platform => {
            platform.position.x -= speed;
        });

        genericObjects.map(obj => {
            obj.updateParallax(speed / obj.parallax);
        });

        this.scrollOffset += speed;
    }

    scrollLeft(platforms, genericObjects, speed) {
        if (this.scrollOffset <= 0) return;

        platforms.map(platform => {
            platform.position.x += speed;
        });

        genericObjects.map(obj => {
            obj.position.x += obj.parallax;
        });

        this.scrollOffset -= speed;
    }

    reset() {
        this.scrollOffset = 0;
    }

    hasReachedEnd() {
        return this.scrollOffset >= GAME_CONFIG.END_OF_LEVEL;
    }
}

// ==================== MAIN GAME CLASS ====================
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.assetManager = new AssetManager();
        this.inputManager = new InputManager();
        this.camera = new Camera();
        
        this.player = null;
        this.platforms = [];
        this.genericObjects = [];
        
        this.isRunning = false;
        this.lastFrameTime = 0;
        
        this.setupCanvas();
        this.setupEventListeners();
    }

    setupCanvas() {
        this.resizeCanvas();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    async initialize() {
        try {
            await this.assetManager.loadAssets();
            this.initializeGameObjects();
            this.isRunning = true;
            console.log('Game initialized successfully');
        } catch (error) {
            console.error('Failed to initialize game:', error);
            throw error;
        }
    }

    initializeGameObjects() {
        // Initialize player
        this.player = new Player();
        this.player.initializeSprites(this.assetManager);
        
        // Initialize platforms
        this.createPlatforms();
        
        // Initialize background objects
        this.createGenericObjects();
    }

    createPlatforms() {
        const platformImage = this.assetManager.getImage('platform');
        const platformSmallTallImage = this.assetManager.getImage('platformSmallTall');
        
        const floorY = (image) => this.canvas.height - image.height;
        const platformWidth = (image) => image.width - 2;

        this.platforms = [
            new Platform(platformWidth(platformSmallTallImage) + 200, floorY(platformSmallTallImage) - 100, platformSmallTallImage),
            new Platform(platformWidth(platformSmallTallImage), floorY(platformSmallTallImage), platformSmallTallImage),
            new Platform(0, floorY(platformImage), platformImage),
            new Platform(platformWidth(platformImage), floorY(platformImage), platformImage),
            new Platform(platformWidth(platformImage) * 3 + 389, floorY(platformSmallTallImage) - 100, platformSmallTallImage),
            new Platform(platformWidth(platformImage) * 3 + 150, floorY(platformSmallTallImage), platformSmallTallImage),
            new Platform(platformWidth(platformImage) * 2 + 100, floorY(platformImage), platformImage),
            new Platform(platformWidth(platformImage) * 3 + 100, floorY(platformImage), platformImage),
            new Platform(platformWidth(platformImage) * 4 + 200, floorY(platformSmallTallImage) * 0.6, platformSmallTallImage),
            new Platform(platformWidth(platformImage) * 5 + 200, floorY(platformSmallTallImage) * 0.3, platformSmallTallImage),
            new Platform(platformWidth(platformImage) * 6 + 400, floorY(platformSmallTallImage) * 0.8, platformSmallTallImage),
            new Platform(platformWidth(platformImage) * 7 + 400, floorY(platformSmallTallImage), platformSmallTallImage),
        ];
    }

    createGenericObjects() {
        const backgroundImage = this.assetManager.getImage('background');
        const hillsImage = this.assetManager.getImage('hills');

        this.genericObjects = [
            new GenericObject(-1, -1, backgroundImage, 0),
            new GenericObject(10, -1, hillsImage, 2),
            new GenericObject(700, 50, hillsImage, 3),
            new GenericObject(1200, 120, hillsImage, 4),
            new GenericObject(2400, 120, hillsImage, 4),
        ];
    }

    handleInput() {
        const input = this.inputManager;
        const lastKey = input.getLastKeyDown();

        // Handle jumping
        if (input.isKeyPressed('up')) {
            this.player.jump();
        }

        // Handle horizontal movement
        if (input.isKeyPressed('left')) {
            if (this.player.position.x > GAME_CONFIG.MIN_RIGHT_POSITION_BEFORE_SCROLL || 
                (this.camera.scrollOffset === 0 && this.player.position.x > 0)) {
                this.player.moveLeft();
            } else if (this.camera.scrollOffset > 0) {
                this.player.stopMoving();
                this.camera.scrollLeft(this.platforms, this.genericObjects, GAME_CONFIG.PLAYER_SPEED);
            }
        } else if (input.isKeyPressed('right')) {
            if (this.player.position.x < GAME_CONFIG.MAX_RIGHT_POSITION_BEFORE_SCROLL) {
                this.player.moveRight();
            } else {
                this.player.stopMoving();
                this.camera.scrollRight(this.platforms, this.genericObjects, GAME_CONFIG.PLAYER_SPEED);
            }
        } else {
            this.player.stopMoving();
        }

        // Update player sprite based on movement
        if (input.isKeyPressed('left')) {
            this.player.updateSprite('run', 'left');
        } else if (input.isKeyPressed('right')) {
            this.player.updateSprite('run', 'right');
        } else {
            const direction = lastKey === 'left' ? 'left' : 'right';
            this.player.updateSprite('stand', direction);
        }
    }

    update(deltaTime) {
        this.handleInput();
        
        // Update player
        const playerState = this.player.update(deltaTime, this.canvas.height);
        
        // Check for restart conditions
        if (playerState === 'restart' || this.camera.hasReachedEnd()) {
            this.restart();
            return;
        }
        
        // Handle platform collisions
        this.checkPlatformCollisions();
    }

    checkPlatformCollisions() {
        this.platforms.map(platform => {
            if (platform.checkCollision(this.player)) {
                this.player.onGroundCollision();
                // Adjust player position to sit exactly on platform
                this.player.position.y = platform.position.y - this.player.height;
            }
        });
    }

    render() {
        // Clear canvas
        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background objects
        this.genericObjects.map(obj => obj.draw(this.context));
        
        // Draw platforms
        this.platforms.map(platform => platform.draw(this.context));
        
        // Draw player (highest z-index)
        this.player.draw(this.context);
    }

    gameLoop(currentTime) {
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    start() {
        if (this.isRunning) {
            this.gameLoop(0);
        }
    }

    restart() {
        this.player.reset();
        this.camera.reset();
        this.createPlatforms();
        this.createGenericObjects();
        console.log('Game restarted');
    }

    stop() {
        this.isRunning = false;
    }
}

// ==================== GAME APPLICATION ====================
class GameApplication {
    constructor() {
        this.game = null;
        this.canvas = null;
    }

    async initialize() {
        try {
            // Get canvas element
            this.canvas = document.querySelector('canvas');
            if (!this.canvas) {
                throw new Error('Canvas element not found');
            }

            // Create and initialize game
            this.game = new Game(this.canvas);
            await this.game.initialize();
            
            // Start the game
            this.game.start();
            
            console.log('Game application started successfully');
        } catch (error) {
            console.error('Failed to start game application:', error);
            this.showErrorMessage(error.message);
        }
    }

    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff4444;
            color: white;
            padding: 20px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            z-index: 1000;
        `;
        errorDiv.textContent = `Error: ${message}`;
        document.body.appendChild(errorDiv);
    }
}

// ==================== INITIALIZATION ====================
// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new GameApplication();
    app.initialize();
});

// Fallback initialization for immediate execution
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new GameApplication();
        app.initialize();
    });
} else {
    const app = new GameApplication();
    app.initialize();
}