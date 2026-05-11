/**
 * @class Endboss
 * @extends MovableObject
 * @description Handles AI states, movement, attacks and behavior logic
 */
class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 60;
  offset = { top: 90, right: 40, bottom: 40, left: 30 };
  spawnX = 4900;
  energy = 100;
  speed = 0.5;
  baseSpeed = 0.5;
  chaseSpeed = 1.1;
  damage = 20;
  attackCooldown = 1000;
  rushCooldown = 1200;
  turnDuration = 400;
  rushDuration = 450;
  jumpSpeedY = 18;
  jumpDuration = 700;
  deadAnimationFrame = 0;
  lastAttack = 0;
  lastTimeSeen = 0;
  turnStartTime = 0;
  rushStartTime = 0;
  lastRush = 0;
  jumpStartTime = 0;
  isJumpAttack = false;
  world;
  isDeadAnimationPlaying = false;
  alertPlayed = false;
  otherDirection = false;
  turning = false;
  hasPlayedAlert = false;
  endbossWalking = ImageHub.endboss.walk;
  endbossAlert = ImageHub.endboss.alert;
  endbossAttack = ImageHub.endboss.attack;
  endbossHurt = ImageHub.endboss.hurt;
  endbossDead = ImageHub.endboss.dead;
  
  /** @type {"idle"|"alert"|"chase"|"attack"|"return"|"rush"|"jump"|"dead"|"hurt"} */
  state = "idle";

  /**
   * Creates a new Endboss instance.
   * @param {World} world - Active game world.
   */
  constructor(world) {
    super();
    this.world = world;
    this.maxEnergy = this.energy;
    this.loadImages(this.endbossWalking);
    this.loadImages(this.endbossAlert);
    this.loadImages(this.endbossAttack);
    this.loadImages(this.endbossHurt);
    this.loadImages(this.endbossDead);
    this.x = this.spawnX;
    this.animationManager = new EndbossAnimationManager(this);
    this.movementManager = new EndbossMovementManager(this);
  }

  /** Starts endboss update and animation loops.*/
  animate() {
    IntervalHub.startInterval(() => this.updateState(), 1000 / 60);
    IntervalHub.startInterval(
      () => this.animationManager.updateAnimation(),
      150,
    );
  }

  /** Main state update handler.*/
  updateState() {
    if (this.world.isGameOver) return;
    if (this.isDead() || !this.world?.character) return;
    if (this.isJumpAttack) {
      this.handleJump();
    }
    if (!this.isDead()) {
      this.handleDetection();
      this.handleCurrentState();
    }
    this.handleAlertSound();
  }

  /** Detects player proximity and triggers alert state.*/
  handleDetection() {
    const character = this.world.character;
    const distance = Math.abs(character.x - this.x);
    if (distance < 350) {
      this.lastTimeSeen = Date.now();
      if (this.state === "idle") {
        this.state = "alert";
        this.alertPlayed = false;
        this.turning = true;
        this.turnStartTime = Date.now();
      }
    }
  }

  /** Dispatches current AI state.*/ 
  handleCurrentState() {
    const map = {
      idle: () => {},
      alert: () => this.handleAlert(),
      chase: () => this.handleChase(),
      attack: () => this.handleAttack(),
      return: () => this.handleReturn(),
      rush: () => this.handleRush(),
      jump: () => this.handleJump(),
    };
    (map[this.state] || (() => {}))();
  }

  /**
   * Calculates distance between Endboss and player.
   * @returns {number}
   */
  getDistance() {
    return this.world.character.x - this.x;
  }

  /**
   * Returns absolute distance to the player.
   * @returns {number}
   */
  getAbsDistance() {
    return Math.abs(this.getDistance());
  }
  
  /** Delegates movement towards spawn position to movement manager.*/
  moveTowardsSpawn() {
    this.movementManager.moveTowardsSpawn();
  }

  /** Resets Endboss state if it has reached spawn position.*/
  finishReturnIfClose() {
    if (Math.abs(this.x - this.spawnX) < 5) {
      this.x = this.spawnX;
      this.state = "idle";
      this.alertPlayed = false;
    }
  }

  /** Moves Endboss to the right via movement manager.*/
  moveRight() {
    this.movementManager.moveRight();
  }

  /** Moves Endboss to the left via movement manager.*/
  moveLeft() {
    this.movementManager.moveLeft();
  }

  /** Handles chasing behavior.*/
  handleChase() {
    const distance = this.getDistance();
    this.speed = this.chaseSpeed;
    this.otherDirection = distance >= 0;
    this.x += distance < 0 ? -this.chaseSpeed : this.chaseSpeed;
    if (this.getAbsDistance() < 140) this.state = "attack";
    if (this.getAbsDistance() > 900 && Date.now() - this.lastTimeSeen > 3000)
      this.state = "return";
    this.tryStartRush(distance);
  }

  /** Handles rush behavior.*/
  handleRush() {
    const distance = this.getDistance();
    if (this.tryJumpInRush()) return;
    this.speed = 4 + Math.random() * 3;
    this.otherDirection = distance >= 0;
    this.x += distance < 0 ? -this.chaseSpeed : this.chaseSpeed;
    this.finishRush();
  }

  /** Random jump during rush.*/
  tryJumpInRush() {
    if (!this.isJumpAttack && Math.random() < 0.05) {
      this.startJump();
      return true;
    }
    return false;
  }

  /** Starts jump attack.*/
  startJump() {
    this.state = "jump";
    this.isJumpAttack = true;
    this.jumpStartTime = Date.now();
    this.speedY = this.jumpSpeedY;
  }

  /** Ends rush phase.*/
  finishRush() {
    if (Date.now() - this.rushStartTime > this.rushDuration) {
      this.state = "attack";
      this.speed = this.baseSpeed;
    }
  }

  /**
   * Attempts to start rush mode.
   * @param {number} distance Distance to player
   */
  tryStartRush(distance) {
    const now = Date.now();
    if (
      this.getAbsDistance() > 50 &&
      this.getAbsDistance() < 450 &&
      now - this.lastRush > this.rushCooldown &&
      Math.random() < 0.2
    ) {
      this.state = "rush";
      this.rushStartTime = now;
      this.lastRush = now;
    }
  }

  /** Handles jump movement logic.*/
  handleJump() {
    const distance = this.getDistance();
    const direction = distance < 0 ? -1 : 1;
    this.x += direction * 8;
    this.y -= this.speedY;
    this.speedY -= 1.2;
    if (this.speedY < 0) this.x += direction * 2;
    if (this.y >= 60) {
      this.y = 60;
      this.speedY = 0;
      this.isJumpAttack = false;
      this.state = "attack";
    }
  }

  /** Handles attack behavior.*/
  handleAttack() {
    const character = this.world.character;
    const distance = character.x - this.x;
    this.otherDirection = distance < 0 ? false : true;
    if (distance < -30) this.moveLeft();
    else if (distance > 30) this.moveRight();
    if (Math.abs(distance) > 160) {
      this.state = "chase";
      return;
    }
    this.tryAttack();
  }

  /** Executes attack if possible.*/
  tryAttack() {
    const now = Date.now();
    const character = this.world.character;
    if (this.world.isGameOver) return;
    if (now - this.lastAttack < this.attackCooldown) return;
    const distance = Math.abs(character.x - this.x);
    if (this.isColliding(character)) {
      character.hit(20);
      this.world.statusbarHealth.setPercentage(character.energy);
      AudioHub.playOne(AudioHub.endbossAttack);
      this.lastAttack = now;
    }
  }

  /** Handles return to spawn position.*/
  handleReturn() {
    if (this.isNearCharacter()) {
      this.startAlert();
      return;
    }
    this.speed = this.baseSpeed;
    this.moveTowardsSpawn();
    this.finishReturnIfClose();
  }

  /**
   * Applies damage to the Endboss.
   * @param {number} damage Damage amount
   */
  applyDamage(damage) {
    this.energy = Math.max(0, this.energy - damage);
  }

  /**Handles death state.*/
  handleDeath() {
    this.state = "dead";
    AudioHub.playOne(AudioHub.endbossDead, 0.4);
  }

  /**Handles hurt reaction.*/
  handleHurt() {
    if (this.isJumpAttack) return;
    this.state = "hurt";
    AudioHub.playOne(AudioHub.endbossAttack);
    clearTimeout(this.hurtTimeout);
    this.hurtTimeout = setTimeout(() => {
      if (!this.isDead()) this.state = "chase";
    }, 500);
  }

  /**
   * Public damage handler.
   * @param {number} [damage=10] Damage amount
   */
  hit(damage = 10) {
    if (this.isDead()) return;
    this.applyDamage(damage);
    if (this.energy <= 0) {
      this.handleDeath();
      return;
    } else {
      this.handleHurt();
    }
  }

  /** Handles alert transition logic.*/
  handleAlert() {
    if (!this.alertStartTime) {
      this.alertStartTime = Date.now();
    }
    if (this.turning && Date.now() - this.turnStartTime > this.turnDuration) {
      this.turning = false;
    }
    if (Date.now() - this.alertStartTime > 800 && !this.turning) {
      this.state = "chase";
      this.alertStartTime = 0;
    }
  }

  /**
   * Checks whether the character is nearby.
   * @returns {boolean}
   */
  isNearCharacter() {
    return Math.abs(this.world.character.x - this.x) < 300;
  }

  /** Starts alert state manually.*/
  startAlert() {
    this.state = "alert";
    this.alertPlayed = false;
    this.turning = true;
    this.turnStartTime = Date.now();
  }

  /** Handles alert sound trigger.*/
  handleAlertSound() {
    if (this.state === "alert" && !this.hasPlayedAlert) {
      AudioHub.playOne(AudioHub.enbossApproach, 1);
      this.hasPlayedAlert = true;
    }
    if (this.state !== "alert") {
      this.hasPlayedAlert = false;
    }
  }
}