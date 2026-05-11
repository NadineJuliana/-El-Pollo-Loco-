/** 
 * @class CollisionManager
 * Handles all collision detection and combat interactions
 */
  class CollisionManager {
    /**
     * @param {World} world - The game world instance containing character, level, and entities.
     */
      constructor(world) {
        this.world = world;
      }
      
    /* ---------- Enemy Collisions ---------- */
      /** Checks collisions between character and enemies.*/
        checkEnemyCollisions() {
          const character = this.world.character;
          const level = this.world.level;
          const stompedEnemies = [];
          this.handleEnemyCollisions(level, character, stompedEnemies);
          if (stompedEnemies.length > 0) {
            this.handleMultiStomp(stompedEnemies);
          }
        }

      /**
       * Processes enemy collision logic.
       * @param {Level} level
       * @param {Character} character
       * @param {Array} stompedEnemies
       */
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

      /**
       * Checks if enemy is a basic stompable type.
       * @param {Object} enemy
       * @returns {boolean}
       */
        isChickenOrChick(enemy) {
          return enemy instanceof Chicken || enemy instanceof Chick;
        }

      /**
       * Handles stomp or damage decision.
       * @param {Object} enemy
       * @param {Array} stompedEnemies
       */
        handleStompOrDamage(enemy, stompedEnemies) {
          if (this.isStompHit(enemy)) {
            stompedEnemies.push(enemy);
          } else {
            this.damageCharacter();
          }
        }

      /**
       * Handles multiple stomped enemies at once.
       * @param {Array} enemies
       */
        handleMultiStomp(enemies) {
          const character = this.world.character;
          this.killStompedEnemies(enemies);
          this.applyStompBounce(character, enemies);
        }

      /**
       * Kills all stomped enemies.
       * @param {Array} enemies
       */
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

      /**
       * Applies bounce effect after stomping enemies.
       * @param {Character} character
       * @param {Array} enemies
       */
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

      /**
       * Determines if stomp attack is valid.
       * @param {Object} enemy
       * @returns {boolean}
       */
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

      /** Applies damage to the player.*/
        damageCharacter() {
          this.world.character.hit();
          this.world.statusbarHealth.setPercentage(this.world.character.energy);
        }

    /* ---------- Collectibles ---------- */
      /** Handles coin collection.*/
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

      /** Handles bottle collection.*/
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

    /* ---------- Throwing System ---------- */
      /** Handles throw input and creation of throwable objects.*/
        checkThrowObjects() {
          if (!this.canThrow()) {
            this.resetThrowState();
            return;
          }
          this.createThrowableObject();
          this.world.character.registerActivity();
        }

      /**
       * Checks if player is allowed to throw.
       * @returns {boolean}
       */
        canThrow() {
          return (
            Keyboard.D &&
            this.world.character.bottleAmount > 0 &&
            !this.world.throwing
          );
        }

      /** Resets throw state when key is released.*/
        resetThrowState() {
          if (!Keyboard.D) this.world.throwing = false;
        }

      /** Creates a new throwable bottle.*/
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

    /* ---------- Throwable Collisions ---------- */
      /** Checks collisions of throwable objects.*/
        checkThrowableCollisions() {
          this.world.throwableObjects.forEach((bottle) => {
            this.handleBottleGroundHit(bottle);
            this.handleBottleEnemyHit(bottle);
          });
          this.cleanupThrowableObjects();
        }

      /**
       * Handles ground collision for bottles.
       * @param {Object} bottle
       */
        handleBottleGroundHit(bottle) {
          if (
            bottle.y >= bottle.groundY &&
            bottle.speedY <= 0 &&
            !bottle.isSplashed
          ) {
            bottle.splash();
          }
        }

      /**
       * Handles enemy collision for bottles.
       * @param {Object} bottle
       */
        handleBottleEnemyHit(bottle) {
          this.world.level.enemies.forEach((enemy) => {
            if (this.isValidBottleHit(bottle, enemy)) {
              this.applyBottleHit(bottle, enemy);
            }
          });
        }

      /**
       * Validates bottle hit.
       * @param {Object} bottle
       * @param {Object} enemy
       * @returns {boolean}
       */
        isValidBottleHit(bottle, enemy) {
          return (
            (enemy instanceof Endboss ||
              enemy instanceof Chicken ||
              enemy instanceof Chick) &&
            bottle.isColliding(enemy) &&
            !bottle.hasHit
          );
        }

      /**
       * Applies bottle hit effect.
       * @param {Object} bottle
       * @param {Object} enemy
       */
        applyBottleHit(bottle, enemy) {
          bottle.hasHit = true;
          bottle.splash();
          if (enemy instanceof Endboss) {
            this.hitEndboss(enemy);
          } else {
            this.killChicken(enemy);
          }
        }

      /**
       * Damages endboss.
       * @param {Endboss} enemy
       */
        hitEndboss(enemy) {
          enemy.hit(10);
          this.world.statusbarEndboss.setPercentage(enemy.energy);
        }

      /**
       * Kills regular enemies.
       * @param {Object} enemy
       */
        killChicken(enemy) {
          enemy.die();
          if (enemy instanceof Chicken) {
            AudioHub.playOne(AudioHub.chickenDead);
          }
          if (enemy instanceof Chick) {
            AudioHub.playOne(AudioHub.chicksDead);
          }
        }

      /** Removes destroyed throwable objects.*/
        cleanupThrowableObjects() {
          this.world.throwableObjects = this.world.throwableObjects.filter(
            (b) => !b.markedForDeletion,
          );
        }
  }