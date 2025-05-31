import { Vector2, Rectangle } from '../utils.js';

export class GameObject {
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