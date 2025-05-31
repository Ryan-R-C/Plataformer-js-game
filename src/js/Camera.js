import { GAME_CONFIG } from './constants.js';

export class Camera {
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
    platforms.forEach(platform => {
      platform.position.x -= speed;
    });

    genericObjects.forEach(obj => {
      obj.updateParallax(speed / obj.parallax);
    });

    this.scrollOffset += speed;
  }

  scrollLeft(platforms, genericObjects, speed) {
    if (this.scrollOffset <= 0) return;

    platforms.forEach(platform => {
      platform.position.x += speed;
    });

    genericObjects.forEach(obj => {
      obj.position.x += obj.parallax * speed;
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
