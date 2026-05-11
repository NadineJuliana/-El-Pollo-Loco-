/**
 * @class StatusbarEndboss
 * @extends DrawableObject
 * Visualizes the health state of the endboss.
 */
  class StatusbarEndboss extends DrawableObject {
    /**
     * Image states for endboss health (0–100%).
     * @type {string[]}
     */
      IMAGES_ENDBOSS = [
        "img/6_statusbars/2_statusbar_endboss/orange/orange0.png",
        "img/6_statusbars/2_statusbar_endboss/orange/orange20.png",
        "img/6_statusbars/2_statusbar_endboss/orange/orange40.png",
        "img/6_statusbars/2_statusbar_endboss/orange/orange60.png",
        "img/6_statusbars/2_statusbar_endboss/orange/orange80.png",
        "img/6_statusbars/2_statusbar_endboss/orange/orange100.png",
      ];

    percentage = 100;

    constructor() {
      super();
      this.loadImages(this.IMAGES_ENDBOSS);
      this.x = 550;
      this.y = 40;
      this.width = 160;
      this.height = 50;
      this.setPercentage(100);
    }

    /* ---------- Status Bar Updates ---------- */
      /**
       * Updates the displayed percentage and image.
       * @param {number} percentage Current health percentage
       */
        setPercentage(percentage) {
          this.percentage = percentage;
          let path = this.IMAGES_ENDBOSS[this.resolveImageIndex()];
          this.img = this.imageCache[path];
        }

      /**
       * Converts percentage into image index (0–5).
       * @returns {number} Image index
       */
        resolveImageIndex() {
          let index = Math.round((this.percentage / 100) * 5);
          if (index < 0) index = 0;
          if (index > 5) index = 5;
          return index;
        }
  }