/**
 * @class DrawableObject
 * @description Base class for all drawable and collidable game objects
 */
class DrawableObject {
  x = 120;
  y = 280;
  img;
  height = 150;
  width = 100;
  imageCache = {};
  currentImage = 0;
  offset = { top: 0, right: 0, bottom: 0, left: 0 };
  realX;
  realY;
  realWidth;
  realHeight;
  showCollisionFrames = false;

  /** Updates the real collision frame based on offsets.*/
  getRealFrame = () => {
    this.realX = this.x + this.offset.left;
    this.realY = this.y + this.offset.top;
    this.realWidth = this.width - this.offset.left - this.offset.right;
    this.realHeight = this.height - this.offset.top - this.offset.bottom;
  };

  /**
   * Checks collision with another drawable object.
   * @param {DrawableObject} mO - Object to check collision against.
   * @returns {boolean} True if objects collide.
   */
  isColliding(mO) {
    return (
      this.realX + this.realWidth > mO.realX &&
      this.realY + this.realHeight > mO.realY &&
      this.realX < mO.realX + mO.realWidth &&
      this.realY < mO.realY + mO.realHeight
    );
  }

  /**
   * Loads a single image.
   * @param {string} path - Image source path.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Preloads multiple images into the image cache.
   * @param {string[]} arr - List of image paths.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Plays an image-based animation sequence.
   * @param {string[]} images - Animation image paths.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Draws the object on the canvas.
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
   */
  draw(ctx) {
    if (this.img) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  /**
   * Draws collision frames for debugging.
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
   */
  drawFrame(ctx) {
    if (!this.showCollisionFrames) return;
    if (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof Endboss ||
      this instanceof Chick ||
      this instanceof Coin ||
      this instanceof Bottle ||
      this instanceof ThrowableObject
    ) {
      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "blue";
      ctx.rect(this.realX, this.realY, this.realWidth, this.realHeight);
      ctx.stroke();
    }
  }
}