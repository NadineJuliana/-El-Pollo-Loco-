/**
 * @class EndbossMovementManager
 * @description Handles movement logic for the Endboss entity
 */
class EndbossMovementManager {
  /**
   * Creates a new movement manager for the Endboss.
   * @param {Endboss} endboss - The controlled Endboss instance.
   */
    constructor(endboss) {
      this.endboss = endboss;
    }

  /** Moves Endboss to the left based on current speed.*/
  moveLeft() {
    this.endboss.x -= this.endboss.speed;
  }

  /** Moves Endboss to the right based on current speed.*/
  moveRight() {
    this.endboss.x += this.endboss.speed;
  }

  /** Moves Endboss back toward its spawn position.*/
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