import { KEY_CODES } from './constants.js';

export class InputManager {
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
    Object.keys(this.keys).forEach(key => {
      this.keys[key].pressed = false;
    });
    this.lastKeyDown = '';
  }
}