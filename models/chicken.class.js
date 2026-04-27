class Chicken extends MovableObject {
  y = 365;
  height = 50;
  width = 70;
  offset = { top: 5, right: 5, bottom: 10, left: 5 };
  isDeadAnimationPlaying = false;
  bigChickenWalking = ImageHub.chicken_normal.walk;
  bigChickenDead = ImageHub.chicken_normal.dead;

  constructor() {
    super().loadImage("img/2_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.bigChickenWalking);
    this.loadImages(this.bigChickenDead);
    this.x = 600 + Math.random() * 4500;
    this.speed = 0.15 + Math.random() * 1;
  }

  die() {
    this.isDeadAnimationPlaying = true;
    this.setImageFromCache(this.bigChickenDead, 0);
    setTimeout(() => {
      if (this.world) {
        const index = this.world.level.enemies.indexOf(this);
        if (index > -1) {
          this.world.level.enemies.splice(index, 1);
        }
      }
    }, 1000);
  }

  animate() {
    IntervalHub.startInterval(() => {
      if (!this.isDeadAnimationPlaying) this.moveLeft();
    }, 1000 / 60);

    IntervalHub.startInterval(() => {
      if (!this.isDeadAnimationPlaying) {
        this.playAnimation(this.bigChickenWalking);
      } else {
        this.setImageFromCache(this.bigChickenDead, 0);
      }
    }, 200);
  }
}
