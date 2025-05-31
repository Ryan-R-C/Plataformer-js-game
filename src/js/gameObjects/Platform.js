import { GameObject } from './GameObject.js';

export class Platform extends GameObject {
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