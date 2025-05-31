import { GameObject } from './GameObject.js';
import { GAME_CONFIG } from '../constants.js';
import { assetManager } from '../assetManager.js';

export class Player extends GameObject {
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
        right: null, // Will be loaded from assetManager
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
    
    this.initializeSprites();
  }

  initializeSprites() {
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