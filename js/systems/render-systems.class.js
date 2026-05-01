class RenderSystems {
  constructor(world) {
    this.world = world;
    this.ctx = world.ctx;
  }

  start() {
    this.draw();
  }

  draw() {
    const world = this.world;
    if (!world.isRunning) return;
    this.clearCanvas();
    if (this.handleGameEndState()) return;
    this.renderScene();
    updateUI();
    requestAnimationFrame(() => this.draw());
  }

  clearCanvas() {
    const world = this.world;
    this.ctx.clearRect(0, 0, world.canvas.width, world.canvas.height);
  }

  handleGameEndState() {
    const world = this.world;
    if (!world.isGameOver && !world.isGameWon) return false;
    updateUI();
    return true;
  }

  renderScene() {
    this.translateCamera();
    this.addWorldObjects();
    this.resetCamera();
  }

  translateCamera() {
    const world = this.world;
    this.ctx.translate(world.camera_x, 0);
  }

  resetCamera() {
    const world = this.world;
    this.ctx.translate(-world.camera_x, 0);
  }

  addWorldObjects() {
    const world = this.world;
    this.addObjectsToMap(world.level.backgroundObjects);
    this.addObjectsToMap(world.level.clouds);
    this.ctx.translate(-world.camera_x, 0);
    this.addUI();
    this.ctx.translate(world.camera_x, 0);
    this.addGameplayObjects();
  }

  addUI() {
    const world = this.world;
    this.addToMap(world.statusbarHealth);
    this.addToMap(world.statusbarCoin);
    this.addToMap(world.statusbarBottle);
    this.addToMap(world.statusbarEndboss);
  }

  addGameplayObjects() {
    const world = this.world;
    this.addToMap(world.character);
    this.addObjectsToMap(world.level.enemies);
    this.addObjectsToMap(world.throwableObjects);
    this.addObjectsToMap(world.level.coins);
    this.addObjectsToMap(world.level.bottles);
  }

  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  addToMap(mO) {
    if ((mO instanceof Coin || mO instanceof Bottle) && mO.isCollected) {
      return;
    }
    mO.getRealFrame();
    if (mO.otherDirection) {
      this.flipImage(mO);
    }
    mO.draw(this.ctx);
    mO.drawFrame(this.ctx);
    if (mO.otherDirection) {
      this.flipImageBack(mO);
    }
  }

  flipImage(mO) {
    this.ctx.save();
    this.ctx.translate(mO.x + mO.width / 2, 0);
    this.ctx.scale(-1, 1);
    this.ctx.translate(-(mO.x + mO.width / 2), 0);
  }

  flipImageBack(mO) {
    this.ctx.restore();
  }
}
