export class Vector2 {
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

export class Rectangle {
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