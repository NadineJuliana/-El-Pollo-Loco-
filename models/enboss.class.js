class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 60;
  offset = { top: 90, right: 40, bottom: 40, left: 40 };
  energy = 100;
  speed = 0.4;
  damage = 20;
  isDeadAnimationPlaying = false;
  deadAnimationFrame = 0;
  attackCooldown = 1000;
  lastAttack = 0;
  state = "idle";
  spawnX = 4900;
  alertPlayed = false;
  lastTimeSeen = 0;
  world;
  otherDirection = false;
  turning = false;
  hasPlayedAlert = false;
  hasPlayedDead = false;
  turnStartTime = 0;
  turnDuration = 400;
  endbossWalking = ImageHub.endboss.walk;
  endbossAlert = ImageHub.endboss.alert;
  endbossAttack = ImageHub.endboss.attack;
  endbossHurt = ImageHub.endboss.hurt;
  endbossDead = ImageHub.endboss.dead;

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
  }

  animate() {
    IntervalHub.startInterval(() => this.updateState(), 1000 / 60);
    IntervalHub.startInterval(() => this.updateAnimation(), 150);
  }

  animateWalking() {
    this.playAnimation(this.endbossWalking);
  }

  animateAlert() {
    this.playAnimation(this.endbossAlert);
  }

  animateAttack() {
    this.playAnimation(this.endbossAttack);
  }

  animateHurt() {
    this.playAnimation(this.endbossHurt);
  }

  animateDead() {
    if (!this.isDeadAnimationPlaying) {
      this.isDeadAnimationPlaying = true;
      this.deadAnimationFrame = 0;
    }
    if (this.deadAnimationFrame < this.endbossDead.length) {
      this.setImageFromCache(this.endbossDead, this.deadAnimationFrame++);
    } else {
      this.setImageFromCache(this.endbossDead, this.endbossDead.length - 1);
    }
  }

  updateAnimation() {
    if (this.turning) return this.animateAlert();
    this.resetAnimationIfStateChanged();
    if (this.isDead()) return this.animateDead();
    this.animateByState();
  }

  resetAnimationIfStateChanged() {
    if (this.lastState !== this.state) {
      this.currentImage = 0;
      this.lastState = this.state;
    }
  }

  animateByState() {
    const map = {
      hurt: () => this.animateHurt(),
      alert: () => this.animateAlert(),
      chase: () => this.animateWalking(),
      return: () => this.animateWalking(),
      attack: () => this.animateAttack(),
      idle: () => this.animateAlert(),
    };
    (map[this.state] || map["idle"])();
  }

  updateState() {
    if (this.world.isGameOver) return;
    if (!this.canUpdateState()) return;
    if (!this.isDead()) {
      this.handleDetection();
      this.transitionFromAlert();
      this.handleCurrentState();
    }
    this.handleAlertSound();
  }

  canUpdateState() {
    return !this.isDead() && this.world && this.world.character;
  }

  transitionFromAlert() {
    if (
      this.state === "alert" &&
      Date.now() - this.alertStartTime > 800 &&
      !this.turning
    ) {
      this.state = "chase";
    }
  }

  handleCurrentState() {
    const map = {
      idle: () => {},
      alert: () => this.handleAlert(),
      chase: () => this.handleChase(),
      attack: () => this.handleAttack(),
      return: () => this.handleReturn(),
    };
    (map[this.state] || (() => {}))();
  }

  handleDetection() {
    const character = this.world.character;
    const distance = Math.abs(character.x - this.x);
    if (distance < 400) {
      this.lastTimeSeen = Date.now();
      if (this.state === "idle") {
        this.state = "alert";
        this.alertPlayed = false;
        this.turning = true;
        this.turnStartTime = Date.now();
      }
    }
  }

  handleAlert() {
    if (this.alertPlayed) return;
    this.alertPlayed = true;
    this.alertStartTime = Date.now();
    setTimeout(() => {
      if (!this.isDead() && this.world.character) {
        const character = this.world.character;
        this.otherDirection = character.x < this.x ? false : true;
        this.turning = false;
        this.state = "chase";
      }
    }, this.turnDuration);
  }

  handleChase() {
    const character = this.world.character;
    const distance = character.x - this.x;
    if (this.turning) return;
    this.otherDirection = distance < 0 ? false : true;
    if (distance < -150) this.moveLeft();
    else if (distance > 150) this.moveRight();
    if (Math.abs(distance) <= 150) this.state = "attack";
    if (Math.abs(distance) > 800 && Date.now() - this.lastTimeSeen > 3000)
      this.state = "return";
  }

  handleAttack() {
    const character = this.world.character;
    const distance = character.x - this.x;
    this.otherDirection = distance < 0 ? false : true;
    if (Math.abs(distance) > 150) {
      this.state = "chase";
      return;
    }
    if (distance < -30) this.moveLeft();
    else if (distance > 30) this.moveRight();
    this.tryAttack();
  }

  handleReturn() {
    if (this.isNearCharacter()) return this.startAlert();
    this.moveTowardsSpawn();
    this.finishReturnIfClose();
  }

  isNearCharacter() {
    return Math.abs(this.world.character.x - this.x) < 300;
  }

  startAlert() {
    this.state = "alert";
    this.alertPlayed = false;
    this.turning = true;
    this.turnStartTime = Date.now();
  }

  moveTowardsSpawn() {
    if (this.x < this.spawnX) {
      this.moveRight();
      this.otherDirection = true;
    } else if (this.x > this.spawnX) {
      this.moveLeft();
      this.otherDirection = false;
    }
  }

  finishReturnIfClose() {
    if (Math.abs(this.x - this.spawnX) < 5) {
      this.x = this.spawnX;
      this.state = "idle";
      this.alertPlayed = false;
    }
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  tryAttack() {
    const now = Date.now();
    if (now - this.lastAttack < this.attackCooldown) return;
    const character = this.world.character;
    if (this.world.isGameOver) return;
    if (this.isColliding(character)) {
      character.hit(10);
      this.world.statusbarHealth.setPercentage(character.energy);
      AudioHub.playOne(AudioHub.endbossAttack);
      this.lastAttack = now;
    }
  }

  hit(damage = 10) {
    if (this.isDead()) return;
    this.energy -= damage;
    if (this.energy <= 0) {
      this.energy = 0;
      this.state = "dead";
      AudioHub.playOne(AudioHub.endbossDead, 0.4);
      return;
    }
    this.state = "hurt";
    AudioHub.playOne(AudioHub.endbossAttack);
    clearTimeout(this.hurtTimeout);
    this.hurtTimeout = setTimeout(() => {
      if (!this.isDead()) {
        this.state = "chase";
      }
    }, 500);
  }

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
