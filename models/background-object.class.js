/**
 * @class BackgroundObject
 * @extends MovableObject
 * Represents a static background element in the game world
 */
  class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;
    y = 0;

    /**
     * Creates a new background object.
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - Horizontal world position.
     */
      constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
      }
  }