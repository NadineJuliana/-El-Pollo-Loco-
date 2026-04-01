class Cloud extends MovableObject {
  width = 500;
  height = 250;

  constructor() {
    super().loadImage("img/7_background/layers/4_clouds/1.png");
  }

  animate() {
    IntervalHub.startInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }
}
