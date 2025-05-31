import { Player } from './gameObjects/Player.js';
import { Platform } from './gameObjects/Platform.js';
import { GenericObject } from './gameObjects/GenericObject.js';
import { InputManager } from './inputManager.js';
import { Camera } from './Camera.js';
import { assetManager } from './assetManager.js';
import { GAME_CONFIG } from './constants.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
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
    /*
     * Removed dynamic resizing for platforms break.
     */
    // this.canvas.width = window.innerWidth;
    this.canvas.width = 1024;
    // this.canvas.height = window.innerHeight;
    this.canvas.height = 576;
  }

  async initialize() {
    try {
      await assetManager.loadAssets();
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
    
    // Initialize platforms
    this.createPlatforms();
    
    // Initialize background objects
    this.createGenericObjects();
  }

  createPlatforms() {
    const platformImage = assetManager.getImage('platform');
    const platformSmallTallImage = assetManager.getImage('platformSmallTall');
    
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
    const backgroundImage = assetManager.getImage('background');
    const hillsImage = assetManager.getImage('hills');

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
    this.platforms.forEach(platform => {
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
    this.genericObjects.forEach(obj => obj.draw(this.context));
    
    // Draw platforms
    this.platforms.forEach(platform => platform.draw(this.context));
    
    // Draw player (highest z-index)
    this.player.draw(this.context);
  }

  gameLoop(currentTime) {
    if (!this.isRunning) return;
    
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