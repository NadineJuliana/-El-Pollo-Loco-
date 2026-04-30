class World {
  character = new Character();
  canvas;
  ctx;
  camera_x = 0;
  statusbarHealth = new StatusbarHealth();
  statusbarCoin = new StatusbarCoin();
  statusbarBottle = new StatusbarBottle();
  statusbarEndboss = new StatusbarEndboss();
  throwableObjects = [];
  throwing = false;
  isGameOver = false;
  isGameWon = false;
  isRunning = true;
  maxCoins = 20;
  maxBottles = 10;

  constructor(canvas, level) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.level = level;
    AudioHub.playOne(AudioHub.gameStart);
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
    this.character.animate();
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
      enemy.animate();
    });
    this.level.coins.forEach((coin) => {
      coin.animate();
    });
    this.level.clouds.forEach((cloud) => {
      cloud.animate();
    });
  }

  run() {
    IntervalHub.startInterval(() => {
      if (this.isGameOver) return;
      this.checkEnemyCollisions();
      this.checkThrowObjects();
      this.checkCollisionCoin();
      this.checkCollisionBottle();
      this.checkThrowableCollisions();
      this.checkEndbossDistance();
      this.checkEndbossState();
      this.checkGameOver();
      this.updateStatusbars();
    }, 1000 / 60);
  }

  updateStatusbars() {
    const coinPercent = Math.round(
      (this.character.coinAmount / this.maxCoins) * 100,
    );
    const bottlePercent = Math.round(
      (this.character.bottleAmount / this.maxBottles) * 100,
    );
    this.statusbarCoin.setPercentage(Math.min(100, Math.max(0, coinPercent)));
    this.statusbarBottle.setPercentage(
      Math.min(100, Math.max(0, bottlePercent)),
    );
  }

  checkStomp(enemy) {
    if (this.isInvalidStomp(enemy)) return false;
    if (this.isStompHit(enemy)) {
      this.handleStomp(enemy);
      return true;
    }
    return false;
  }

  isInvalidStomp(enemy) {
    return enemy.isDeadAnimationPlaying;
  }

  isStompHit(enemy) {
    return (
      this.isFalling() &&
      this.crossedEnemyTop(enemy) &&
      this.isAboveEnemy(enemy) &&
      this.isVerticalHit(enemy)
    );
  }

  isFalling() {
    return this.character.speedY < -2;
  }

  crossedEnemyTop(enemy) {
    const tolerance = Math.abs(this.character.speedY) + 5;
    const lastBottom = this.getCharLastBottom();
    const bottom = this.getCharBottom();
    const topNow = enemy.realY;
    const topLast = enemy.lastY ?? enemy.realY;
    return lastBottom <= topLast + tolerance && bottom >= topNow - tolerance;
  }

  isAboveEnemy(enemy) {
    const x = this.getCharCenterX();
    return x > enemy.realX - 10 && x < enemy.realX + enemy.realWidth + 10;
  }

  isVerticalHit(enemy) {
    return this.getCharBottom() < enemy.realY + 20;
  }

  handleStomp(enemy) {
    enemy.die();
    requestAnimationFrame(() => {
      this.character.y = enemy.realY - this.character.realHeight;
    });
    this.character.speedY = 12;
    if (enemy instanceof Chicken) {
      AudioHub.playOne(AudioHub.chickenDead);
    }
    if (enemy instanceof Chick) {
      AudioHub.playOne(AudioHub.chicksDead);
    }
  }

  getCharBottom() {
    return this.character.realY + this.character.realHeight;
  }

  getCharLastBottom() {
    return this.character.lastY + this.character.realHeight;
  }

  getCharCenterX() {
    return this.character.realX + this.character.realWidth / 2;
  }

  checkEnemyCollisions() {
    for (const enemy of this.level.enemies) {
      if (!this.character.isColliding(enemy)) continue;
      if (this.character.isDeadAnimationPlaying && this.character.isDeathJump)
        continue;
      if (enemy instanceof Chicken || enemy instanceof Chick) {
        const stomped = this.checkStomp(enemy);
        if (!stomped) this.checkSideOrBottomHit(enemy);
      } else {
        this.damageCharacter();
      }
    }
  }

  checkSideOrBottomHit(enemy) {
    if (enemy.isDeadAnimationPlaying) return;
    this.damageCharacter();
  }

  damageCharacter() {
    this.character.hit();
    this.statusbarHealth.setPercentage(this.character.energy);
  }

  checkThrowObjects() {
    if (!this.canThrow()) {
      this.resetThrowState();
      return;
    }
    this.createThrowableObject();
    this.character.registerActivity();
  }

  canThrow() {
    return Keyboard.D && this.character.bottleAmount > 0 && !this.throwing;
  }

  resetThrowState() {
    if (!Keyboard.D) this.throwing = false;
  }

  createThrowableObject() {
    this.throwing = true;
    const direction = this.character.otherDirection ? -1 : 1;
    const bottle = new ThrowableObject(
      this.character.x + 50 * direction,
      this.character.y + 50,
    );
    bottle.otherDirection = this.character.otherDirection;
    bottle.speedX = 6 * direction;
    this.throwableObjects.push(bottle);
    this.character.bottleAmount--;
  }

  checkThrowableCollisions() {
    this.throwableObjects.forEach((bottle) => {
      this.handleBottleGroundHit(bottle);
      this.handleBottleEnemyHit(bottle);
    });
    this.cleanupThrowableObjects();
  }

  handleBottleGroundHit(bottle) {
    if (
      bottle.y >= bottle.groundY &&
      bottle.speedY <= 0 &&
      !bottle.isSplashed
    ) {
      bottle.splash();
    }
  }

  handleBottleEnemyHit(bottle) {
    this.level.enemies.forEach((enemy) => {
      if (this.isValidBottleHit(bottle, enemy)) {
        this.applyBottleHit(bottle, enemy);
      }
    });
  }

  isValidBottleHit(bottle, enemy) {
    return (
      (enemy instanceof Endboss ||
        enemy instanceof Chicken ||
        enemy instanceof Chick) &&
      bottle.isColliding(enemy) &&
      !bottle.hasHit
    );
  }

  applyBottleHit(bottle, enemy) {
    bottle.hasHit = true;
    bottle.splash();

    if (enemy instanceof Endboss) {
      this.hitEndboss(enemy);
    } else {
      this.killChicken(enemy);
    }
  }

  hitEndboss(enemy) {
    enemy.hit(10);
    this.statusbarEndboss.setPercentage(enemy.energy);
  }

  killChicken(enemy) {
    enemy.die();
    if (enemy instanceof Chicken) {
      AudioHub.playOne(AudioHub.chickenDead);
    }
    if (enemy instanceof Chick) {
      AudioHub.playOne(AudioHub.chicksDead);
    }
  }

  cleanupThrowableObjects() {
    this.throwableObjects = this.throwableObjects.filter(
      (b) => !b.markedForDeletion,
    );
  }

  checkCollisionCoin() {
    this.level.coins.forEach((coin) => {
      if (!coin.isCollected && this.character.isColliding(coin)) {
        coin.isCollected = true;
        AudioHub.playOne(AudioHub.coinCollect);
        this.character.collectCoin();
        const maxCoins = this.level.coins.length;
        const percent = (this.character.coinAmount / maxCoins) * 100;
      }
    });
  }

  checkCollisionBottle() {
    this.level.bottles.forEach((bottle) => {
      if (!bottle.isCollected && this.character.isColliding(bottle)) {
        bottle.isCollected = true;
        AudioHub.playOne(AudioHub.bottleCollect);
        this.character.collectBottle();
        const maxBottles = this.level.bottles.length;
        const percent = (this.character.bottleAmount / maxBottles) * 100;
      }
    });
  }

  checkEndbossDistance() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        const distance = Math.abs(this.character.x - enemy.x);
        enemy.isAlert = distance < 500;
        enemy.isAttacking = distance < 200;
      }
    });
  }

  checkEndbossState() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        const distance = Math.abs(this.character.x - enemy.x);
        enemy.isAlert = distance < 600;
        enemy.isAttacking = distance < 150;
      }
    });
  }

  checkGameOver() {
    if (this.handleCharacterDeath()) return;
    this.handleWinCondition();
  }

  handleCharacterDeath() {
    const character = this.character;
    if (this.isGameOver || !character.isDead()) return false;
    this.stopControls();
    if (this.isDeathAnimationFinished(character)) {
      this.isGameOver = true;
      this.endGame();
      return true;
    }
    return false;
  }

  handleWinCondition() {
    const endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (!endboss || this.isGameWon) return;
    if (this.isEndbossDead(endboss)) {
      this.isGameWon = true;
      this.stopControls();
      this.endGame();
    }
  }

  stopControls() {
    Keyboard.RIGHT = false;
    Keyboard.LEFT = false;
    Keyboard.SPACE = false;
    Keyboard.D = false;
  }

  isDeathAnimationFinished(character) {
    return (
      character.deadAnimationFrame >= character.imagesDead.length - 1 &&
      character.y >= character.groundLevel + 300
    );
  }

  isEndbossDead(endboss) {
    return (
      endboss.isDead() &&
      endboss.deadAnimationFrame >= endboss.endbossDead.length - 1
    );
  }

  endGame() {
    this.isRunning = false;
    IntervalHub.stopAllIntervals();
    AudioHub.stopAll();
  }

  draw() {
    if (!this.isRunning) return;
    this.clearCanvas();
    if (this.handleGameEndState()) return;
    this.renderScene();
    updateUI();
    requestAnimationFrame(() => this.draw());
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  handleGameEndState() {
    if (!this.isGameOver && !this.isGameWon) return false;
    updateUI();
    return true;
  }

  renderScene() {
    this.translateCamera();
    this.addWorldObjects();
    this.resetCamera();
  }

  translateCamera() {
    this.ctx.translate(this.camera_x, 0);
  }

  resetCamera() {
    this.ctx.translate(-this.camera_x, 0);
  }

  addWorldObjects() {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.ctx.translate(-this.camera_x, 0);
    this.addUI();
    this.ctx.translate(this.camera_x, 0);
    this.addGameplayObjects();
  }

  addUI() {
    this.addToMap(this.statusbarHealth);
    this.addToMap(this.statusbarCoin);
    this.addToMap(this.statusbarBottle);
    this.addToMap(this.statusbarEndboss);
  }

  addGameplayObjects() {
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
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
