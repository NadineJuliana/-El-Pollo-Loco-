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
  coins = [];
  bottles = [];

  throwing = false;
  isGameOver = false;
  isGameWon = false;
  isRunning = true;

  imgYouLost;
  imgYouWin;

  constructor(canvas, level) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.level = level;
    AudioHub.playOne(AudioHub.gameStart);
    this.loadWinLoseImages();
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
    }, 1000 / 60);
  }

  loadWinLoseImages() {
    this.imgYouLost = new Image();
    this.imgYouLost.src = "img/9_win_lost_screens/2_lost/Game Over.png";

    this.imgYouWin = new Image();
    this.imgYouWin.src = "img/9_win_lost_screens/1_win/You Win A.png";
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
    const tolerance = 5;
    const lastBottom = this.getCharLastBottom();
    const bottom = this.getCharBottom();
    const top = enemy.realY;
    return lastBottom <= top + tolerance && bottom >= top - tolerance;
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
    if (enemy instanceof Chicken) {
      AudioHub.playOne(AudioHub.chickenDead);
    }
    if (enemy instanceof Chick) {
      AudioHub.playOne(AudioHub.chicksDead);
    }
    this.character.speedY = 12;
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
    if (Keyboard.D && this.character.bottleAmount > 0 && !this.throwing) {
      this.throwing = true;
      const direction = this.character.otherDirection ? -1 : 1;
      let bottle = new ThrowableObject(
        this.character.x + 50 * direction,
        this.character.y + 50,
      );
      bottle.otherDirection = this.character.otherDirection;
      bottle.speedX = 6 * direction;
      this.throwableObjects.push(bottle);
      this.character.bottleAmount--;
      this.statusbarBottle.setPercentage(this.character.bottleAmount * 10);
      this.character.registerActivity();
    }
    if (!Keyboard.D) {
      this.throwing = false;
    }
  }

  checkThrowableCollisions() {
    this.throwableObjects.forEach((bottle) => {
      if (
        bottle.y >= bottle.groundY &&
        bottle.speedY <= 0 &&
        !bottle.isSplashed
      ) {
        bottle.splash();
      }

      this.level.enemies.forEach((enemy) => {
        if (
          enemy instanceof Endboss &&
          bottle.isColliding(enemy) &&
          !bottle.hasHit
        ) {
          bottle.hasHit = true;
          bottle.splash();
          enemy.hit(10);
          const percent = (enemy.energy / enemy.maxEnergy) * 100;
          this.statusbarEndboss.setPercentage(enemy.energy);
        }
      });
    });

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
        this.statusbarCoin.setPercentage(this.character.coinAmount * 10);
      }
    });
  }

  checkCollisionBottle() {
    this.level.bottles.forEach((bottle) => {
      if (!bottle.isCollected && this.character.isColliding(bottle)) {
        bottle.isCollected = true;
        AudioHub.playOne(AudioHub.bottleCollect);
        this.character.collectBottle();
        this.statusbarBottle.setPercentage(this.character.bottleAmount * 10);
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
    const character = this.character;
    const endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (!this.isGameOver && character.isDead()) {
      Keyboard.RIGHT = false;
      Keyboard.LEFT = false;
      Keyboard.SPACE = false;
      Keyboard.D = false;
      const animationDone =
        character.deadAnimationFrame >= character.imagesDead.length - 1;
      const fallenDone = character.y >= character.groundLevel + 300;
      if (animationDone && fallenDone) {
        this.isGameOver = true;
        this.endGame();
      }
    }
    if (
      !this.isGameWon &&
      endboss &&
      endboss.isDead() &&
      endboss.deadAnimationFrame >= endboss.endbossDead.length - 1
    ) {
      this.isGameWon = true;
      Keyboard.RIGHT = false;
      Keyboard.LEFT = false;
      Keyboard.SPACE = false;
      Keyboard.D = false;
      this.isGameWon = true;
      this.endGame();
    }
  }

  endGame() {
    this.isRunning = false;
    IntervalHub.stopAllIntervals();
    AudioHub.stopAll();
  }

  draw() {
    if (!this.isRunning) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.isGameOver || this.isGameWon) {
      updateUI();
      return;
    }
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusbarHealth);
    this.addToMap(this.statusbarCoin);
    this.addToMap(this.statusbarBottle);
    this.addToMap(this.statusbarEndboss);
    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.ctx.translate(-this.camera_x, 0);
    updateUI();
    requestAnimationFrame(() => this.draw());
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
