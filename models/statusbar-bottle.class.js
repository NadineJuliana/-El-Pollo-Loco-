class StatusbarBottle extends DrawableObject {
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

  setPercentage(percentage) {
    this.percentage = Math.max(0, Math.min(100, percentage));
    const index = this.resolveImageIndex();
    this.img = this.imageCache[this.IMAGES_BOTTLE[index]];
  }

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
