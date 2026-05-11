/**
 * @class StatusbarHealth
 * @extends DrawableObject
 * @description Displays player health as a visual status bar.
 */
class StatusbarHealth extends DrawableObject {
  /**
   * Image states for player health (0–100%).
   * @type {string[]}
   */
  IMAGES_HEALTH = [
    "img/6_statusbars/1_statusbar/1_statusbar_health/green/0.png",
    "img/6_statusbars/1_statusbar/1_statusbar_health/green/20.png",
    "img/6_statusbars/1_statusbar/1_statusbar_health/green/40.png",
    "img/6_statusbars/1_statusbar/1_statusbar_health/green/60.png",
    "img/6_statusbars/1_statusbar/1_statusbar_health/green/80.png",
    "img/6_statusbars/1_statusbar/1_statusbar_health/green/100.png",
  ];

  percentage = 100;

  constructor() {
    super();
    this.loadImages(this.IMAGES_HEALTH);
    this.x = 10;
    this.y = 0;
    this.width = 160;
    this.height = 50;
    this.setPercentage(100);
  }

  /**
   * Updates health percentage and visual representation.
   * @param {number} percentage Current health percentage
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_HEALTH[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Returns the correct image index based on current health.
   * @returns {number} Image index
   */
  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}