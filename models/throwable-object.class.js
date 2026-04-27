class ThrowableObject extends MovableObject {
  offset = { top: 15, right: 15, bottom: 10, left: 20 };
  bottleRotation = ImageHub.salsa_bottle.rotaion;
  bottleSplash = ImageHub.salsa_bottle.splash;
  isSplashed = false;
  hasHit = false;
  groundY = 370;

  constructor(x, y) {
    super();
    this.loadImages(this.bottleRotation);
    this.loadImages(this.bottleSplash);
    this.x = x;
    this.y = y;
    this.height = 70;
    this.width = 70;
    this.throw();
    this.animate();
  }

  animate() {
    IntervalHub.startInterval(() => {
      if (!this.isSplashed) {
        this.playAnimation(this.bottleRotation);
      } else {
        this.playAnimation(this.bottleSplash);
      }
    }, 80);
  }

  throw() {
    this.speedY = 12;
    this.acceleration = 0.8;
    IntervalHub.startInterval(() => {
      if (!this.isSplashed) {
        this.x += this.speedX;
        this.applyGravity();
      }
    }, 1000 / 60);
  }

  splash() {
    if (this.isSplashed) return;
    this.isSplashed = true;
    AudioHub.playOne(AudioHub.bottleBreak);
    if (this.y > this.groundY) {
      this.y = this.groundY;
    }
    this.speedY = 0;
    setTimeout(() => {
      this.markedForDeletion = true;
    }, 500);
  }
}
