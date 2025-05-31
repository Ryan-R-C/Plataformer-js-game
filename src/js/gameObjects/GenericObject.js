import { GameObject } from './GameObject.js';

export class GenericObject extends GameObject {
  constructor(x, y, image, parallax = 1) {
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