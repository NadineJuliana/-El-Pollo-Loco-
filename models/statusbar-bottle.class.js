/**
 * @class StatusbarBottle
 * @extends DrawableObject
 * @description Displays the player's collected bottle progress
 */
class StatusbarBottle extends DrawableObject {
  /**
   * Image states for bottle progress (0–100%).
   * @type {string[]}
   */
  IMAGES_BOTTLE = [
    "img/6_statusbars/1_statusbar/2_statusbar_bottle/green/0.png",
    "img/6_statusbars/1_statusbar/2_statusbar_bottle/green/20.png",
    "img/6_statusbars/1_statusbar/2_statusbar_bottle/green/40.png",
    "img/6_statusbars/1_statusbar/2_statusbar_bottle/green/60.png",
    "img/6_statusbars/1_statusbar/2_statusbar_bottle/green/80.png",
    "img/6_statusbars/1_statusbar/2_statusbar_bottle/green/100.png",
  ];

  percentage = 0;

  constructor() {
    super();
    this.loadImages(this.IMAGES_BOTTLE);
    this.x = 10;
    this.y = 100;
    this.width = 160;
    this.height = 50;
    this.setPercentage(0);
  }

  /**
   * Updates the displayed bottle percentage.
   * @param {number} percentage - Current bottle percentage.
   */
  setPercentage(percentage) {
    this.percentage = Math.max(0, Math.min(100, percentage));
    const index = this.resolveImageIndex();
    this.img = this.imageCache[this.IMAGES_BOTTLE[index]];
  }

  /**
   * Resolves the correct image index based on current percentage.
   * @returns {number} Index of the image in IMAGES_BOTTLE array
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