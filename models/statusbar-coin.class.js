/**
 * @class StatusbarCoin
 * @extends DrawableObject
 * Displays collected coin progress as UI bar
 */
  class StatusbarCoin extends DrawableObject {
    /**
     * Image states for coin progress (0–100%).
     * @type {string[]}
     */
      IMAGES_COIN = [
        "img/6_statusbars/1_statusbar/3_statusbar_coin/green/0.png",
        "img/6_statusbars/1_statusbar/3_statusbar_coin/green/20.png",
        "img/6_statusbars/1_statusbar/3_statusbar_coin/green/40.png",
        "img/6_statusbars/1_statusbar/3_statusbar_coin/green/60.png",
        "img/6_statusbars/1_statusbar/3_statusbar_coin/green/80.png",
        "img/6_statusbars/1_statusbar/3_statusbar_coin/green/100.png",
      ];

    percentage = 0;

    constructor() {
      super();
      this.loadImages(this.IMAGES_COIN);
      this.x = 10;
      this.y = 50;
      this.width = 160;
      this.height = 50;
      this.setPercentage(0);
    }

    /* ---------- Status Bar Updates ---------- */
      /**
       * Updates the displayed coin percentage.
       * @param {number} percentage - Current coin percentage.
       */
        setPercentage(percentage) {
          this.percentage = Math.max(0, Math.min(100, percentage));
          const index = this.resolveImageIndex();
          this.img = this.imageCache[this.IMAGES_COIN[index]];
        }

      /**
       * Resolves the correct image index based on current percentage.
       * @returns {number} Index of the image in IMAGES_COIN array
       */
        resolveImageIndex() {
          const percent = this.percentage;
          if (percent === 0) return 0;
          if (percent === 100) return 5;
          if (percent <= 20) return 1;
          if (percent <= 40) return 2;
          if (percent <= 60) return 3;
          if (percent <= 80) return 4;
          return 5;
        }
  }