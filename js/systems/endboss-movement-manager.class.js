class EndbossMovementManager {
  constructor(endboss) {
    this.endboss = endboss;
  }

  moveLeft() {
    this.endboss.x -= this.endboss.speed;
  }

  moveRight() {
    this.endboss.x += this.endboss.speed;
  }

  moveTowardsSpawn() {
    if (this.endboss.x < this.endboss.spawnX) {
      this.moveRight();
      this.endboss.otherDirection = true;
    } else if (this.endboss.x > this.endboss.spawnX) {
      this.moveLeft();
      this.endboss.otherDirection = false;
    }
  }
}
