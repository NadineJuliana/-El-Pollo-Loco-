/** 
 * @class MovableObject
 * @extends DrawableObject
 * @description Base class for all movable and physics-based game objects
 */
class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 0.7;
  energy = 100;
  lastHit = 0;
  isDeadAnimationPlaying = false;

  /** Applies gravity and vertical movement.*/
  applyGravity() {
    if (this.isAboveGround() || this.speedY > 0) {
      if (this instanceof ThrowableObject) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      } else {
        this.y -= this.speedY;
        this.speedY -= this.acceleration * 30;
      }
    }
  }

  /**
   * Checks whether the object is above ground level.
   * @returns {boolean}
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return this.y < this.groundY;
    }
    if (this.isDeadAnimationPlaying) {
      return true;
    }
    return this.y < this.groundLevel;
  }

  /**
   * Applies damage to the object.
   * @param {number} [damage=10] Amount of damage to apply
   */
  hit(damage = 10) {
    const now = Date.now();
    if (now - this.lastHit < 1000) return;
    this.energy -= damage;
    if (this.energy < 0) this.energy = 0;
    this.lastHit = now;
  }

  /**
   * Checks whether the object is currently hurt.
   * @returns {boolean}
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /**
   * Checks whether the object is dead.
   * @returns {boolean}
   */
  isDead() {
    return this.energy == 0;
  }

  /** Moves the object to the right.*/
  moveRight() {
    this.x += this.speed;
  }

  /** Moves the object to the left.*/
  moveLeft() {
    this.x -= this.speed;
  }

  /** Applies jump force.*/
  jump() {
    this.speedY = 15;
  }

  /**
   * Sets the current image from cache.
   * @param {string[]} images Array of image paths
   * @param {number} index Index of the image to use
   */
  setImageFromCache(images, index) {
    const path = images[index];
    if (this.imageCache[path]) this.img = this.imageCache[path];
  }
}