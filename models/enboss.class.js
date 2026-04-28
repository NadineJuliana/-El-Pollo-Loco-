class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 60;
  offset = { top: 90, right: 40, bottom: 40, left: 40 };
  spawnX = 4900;
  energy = 100;
  speed = 0.5;
  baseSpeed = 0.5;
  chaseSpeed = 1.6;
  damage = 20;
  deadAnimationFrame = 0;
  attackCooldown = 1000;
  lastAttack = 0;
  lastTimeSeen = 0;
  turnStartTime = 0;
  turnDuration = 400;
  state = "idle";
  world;
  isDeadAnimationPlaying = false;
  alertPlayed = false;
  otherDirection = false;
  turning = false;
  hasPlayedAlert = false;
  hasPlayedDead = false;
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

  updateAnimation() {
    if (this.turning) {
      this.animateAlert();
      return;
    }
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

  handleDetection() {
    const character = this.world.character;
    const distance = Math.abs(character.x - this.x);
    if (distance < 650) {
      this.lastTimeSeen = Date.now();
      if (this.state === "idle") {
        this.state = "alert";
        this.alertPlayed = false;
        this.turning = true;
        this.turnStartTime = Date.now();
      }
    }
  }

  transitionFromAlert() {
    if (this.state === "alert") {
      if (!this.alertStartTime) {
        this.alertStartTime = Date.now();
      }

      if (Date.now() - this.alertStartTime > 800 && !this.turning) {
        this.state = "chase";
        this.alertStartTime = 0;
      }
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

  handleChase() {
    const character = this.world.character;
    const distance = character.x - this.x;
    this.speed = this.chaseSpeed;
    this.otherDirection = distance < 0 ? false : true;
    if (distance < -10) this.moveLeft();
    else if (distance > 10) this.moveRight();
    if (Math.abs(distance) < 140) {
      this.state = "attack";
    }
    if (Math.abs(distance) > 900 && Date.now() - this.lastTimeSeen > 3000) {
      this.state = "return";
    }
  }

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

  tryAttack() {
    const now = Date.now();
    const character = this.world.character;
    if (this.world.isGameOver) return;
    if (now - this.lastAttack < this.attackCooldown) return;
    const distance = Math.abs(character.x - this.x);
    if (distance < 120) {
      character.hit(20);
      this.world.statusbarHealth.setPercentage(character.energy);
      AudioHub.playOne(AudioHub.endbossAttack);
      this.lastAttack = now;
    }
  }

  handleReturn() {
    if (this.isNearCharacter()) {
      this.startAlert();
      return;
    }
    this.speed = this.baseSpeed;
    this.moveTowardsSpawn();
    this.finishReturnIfClose();
  }

  applyDamage(damage) {
    this.energy = Math.max(0, this.energy - damage);
  }

  handleDeath() {
    this.state = "dead";
    AudioHub.playOne(AudioHub.endbossDead, 0.4);
  }

  handleHurt() {
    this.state = "hurt";
    AudioHub.playOne(AudioHub.endbossAttack);
    clearTimeout(this.hurtTimeout);
    this.hurtTimeout = setTimeout(() => {
      if (!this.isDead()) this.state = "chase";
    }, 500);
  }

  hit(damage = 10) {
    if (this.isDead()) return;
    this.applyDamage(damage);
    if (this.energy <= 0) {
      this.handleDeath();
    } else {
      this.handleHurt();
    }
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

  handleAlert() {
    if (!this.alertStartTime) {
      this.alertStartTime = Date.now();
    }
    if (Date.now() - this.alertStartTime > this.turnDuration) {
      this.turning = false;
      this.state = "chase";
      this.alertStartTime = 0;
    }
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
