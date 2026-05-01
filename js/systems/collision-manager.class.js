class CollisionManager {
  constructor(world) {
    this.world = world;
  }

  checkEnemyCollisions() {
    const character = this.world.character;
    const level = this.world.level;
    const stompedEnemies = [];
    this.handleEnemyCollisions(level, character, stompedEnemies);
    if (stompedEnemies.length > 0) {
      this.handleMultiStomp(stompedEnemies);
    }
  }

  handleEnemyCollisions(level, character, stompedEnemies) {
    for (let i = level.enemies.length - 1; i >= 0; i--) {
      const enemy = level.enemies[i];
      if (!enemy || !enemy.collidable) continue;
      if (!character.isColliding(enemy)) continue;
      if (this.isChickenOrChick(enemy)) {
        this.handleStompOrDamage(enemy, stompedEnemies);
      } else {
        this.damageCharacter();
      }
    }
  }

  isChickenOrChick(enemy) {
    return enemy instanceof Chicken || enemy instanceof Chick;
  }

  handleStompOrDamage(enemy, stompedEnemies) {
    if (this.isStompHit(enemy)) {
      stompedEnemies.push(enemy);
    } else {
      this.damageCharacter();
    }
  }

  handleMultiStomp(enemies) {
    const character = this.world.character;
    this.killStompedEnemies(enemies);
    this.applyStompBounce(character, enemies);
  }

  killStompedEnemies(enemies) {
    enemies.forEach((enemy) => {
      enemy.collidable = false;
      enemy.die();
      if (enemy instanceof Chicken) {
        AudioHub.playOne(AudioHub.chickenDead);
      }
      if (enemy instanceof Chick) {
        AudioHub.playOne(AudioHub.chicksDead);
      }
    });
  }

  applyStompBounce(character, enemies) {
    character.speedY = 12;
    let highestEnemy = enemies[0];
    for (const enemy of enemies) {
      if (enemy.y < highestEnemy.y) {
        highestEnemy = enemy;
      }
    }
    character.y = highestEnemy.y - character.height;
  }

  isStompHit(enemy) {
    const character = this.world.character;
    const lastBottom = character.lastY + character.height;
    const currentBottom = character.y + character.height;
    const enemyTop = enemy.y;
    const isFalling = character.speedY < -2;
    const tolerance = Math.abs(character.speedY) * 2 + 5;
    const wasAbove = lastBottom <= enemyTop + tolerance;
    const isNowInside = currentBottom >= enemyTop - tolerance;
    const horizontal =
      character.x + character.width > enemy.x + 5 &&
      character.x < enemy.x + enemy.width - 5;
    return isFalling && wasAbove && isNowInside && horizontal;
  }

  damageCharacter() {
    this.world.character.hit();
    this.world.statusbarHealth.setPercentage(this.world.character.energy);
  }

  checkCollisionCoin() {
    this.world.level.coins.forEach((coin) => {
      if (!coin.isCollected && this.world.character.isColliding(coin)) {
        coin.isCollected = true;
        AudioHub.playOne(AudioHub.coinCollect);
        this.world.character.collectCoin();
        const maxCoins = this.world.level.coins.length;
        const percent = (this.world.character.coinAmount / maxCoins) * 100;
      }
    });
  }

  checkCollisionBottle() {
    this.world.level.bottles.forEach((bottle) => {
      if (!bottle.isCollected && this.world.character.isColliding(bottle)) {
        bottle.isCollected = true;
        AudioHub.playOne(AudioHub.bottleCollect);
        this.world.character.collectBottle();
        const maxBottles = this.world.level.bottles.length;
        const percent = (this.world.character.bottleAmount / maxBottles) * 100;
      }
    });
  }

  checkThrowObjects() {
    if (!this.canThrow()) {
      this.resetThrowState();
      return;
    }
    this.createThrowableObject();
    this.world.character.registerActivity();
  }

  canThrow() {
    return (
      Keyboard.D &&
      this.world.character.bottleAmount > 0 &&
      !this.world.throwing
    );
  }

  resetThrowState() {
    if (!Keyboard.D) this.world.throwing = false;
  }

  createThrowableObject() {
    this.world.throwing = true;
    const direction = this.world.character.otherDirection ? -1 : 1;
    const bottle = new ThrowableObject(
      this.world.character.x + 50 * direction,
      this.world.character.y + 50,
    );
    bottle.otherDirection = this.world.character.otherDirection;
    bottle.speedX = 6 * direction;
    this.world.throwableObjects.push(bottle);
    this.world.character.bottleAmount--;
  }

  checkThrowableCollisions() {
    this.world.throwableObjects.forEach((bottle) => {
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
    this.world.level.enemies.forEach((enemy) => {
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
    this.world.statusbarEndboss.setPercentage(enemy.energy);
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
    this.world.throwableObjects = this.world.throwableObjects.filter(
      (b) => !b.markedForDeletion,
    );
  }
}
