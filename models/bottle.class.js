/**
 * @class Bottle
 * @extends DrawableObject
 * Represents a collectible salsa bottle object
 */
  class Bottle extends DrawableObject {
    height = 70;
    width = 70;
    isCollected = false;
    bottlesOnGround = ImageHub.salsa_bottle.on_Ground;
    offset = { top: 15, right: 15, bottom: 10, left: 20 };

    constructor() {
      super();
      this.loadImages(this.bottlesOnGround);
      this.setRandomImage();
    }

    /* ---------- Image Handling ---------- */
      /** Selects a random bottle image.*/
        setRandomImage() {
          const imagePaths = Object.keys(this.imageCache);
          const randomIndex = Math.floor(Math.random() * imagePaths.length);
          const randomPath = imagePaths[randomIndex];
          this.img = this.imageCache[randomPath];
        }
  }