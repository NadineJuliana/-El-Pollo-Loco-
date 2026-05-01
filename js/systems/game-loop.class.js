class GameLoop {
  constructor(world) {
    this.world = world;
  }

  run() {
    IntervalHub.startInterval(() => {
      if (!this.world.isRunning) return;
      this.world.collisionManager.checkEnemyCollisions();
      this.world.collisionManager.checkCollisionCoin();
      this.world.collisionManager.checkCollisionBottle();
      this.world.collisionManager.checkThrowObjects();
      this.world.collisionManager.checkThrowableCollisions();
      this.updateEndbossState();
      this.world.gameStateManager.checkGameOver();
      this.updateStatusbars();
      this.updatePreviousPositions();
    }, 1000 / 60);
  }

  updatePreviousPositions() {
    const world = this.world;
    world.character.lastX = world.character.x;
    world.character.lastY = world.character.y;
    world.level.enemies.forEach((enemy) => {
      enemy.lastX = enemy.x;
      enemy.lastY = enemy.y;
    });
  }

  updateStatusbars() {
    const world = this.world;
    const coinPercent = Math.round(
      (world.character.coinAmount / world.level.coins.length) * 100,
    );
    const bottlePercent = Math.round(
      (world.character.bottleAmount / world.level.bottles.length) * 100,
    );
    world.statusbarCoin.setPercentage(Math.min(100, Math.max(0, coinPercent)));
    world.statusbarBottle.setPercentage(
      Math.min(100, Math.max(0, bottlePercent)),
    );
  }

  updateEndbossState() {
    const world = this.world;
    world.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        const distance = Math.abs(world.character.x - enemy.x);
        enemy.isAlert = distance < 600;
        enemy.isAttacking = distance < 150;
      }
    });
  }
}
