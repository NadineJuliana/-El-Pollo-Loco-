class Character extends MovableObject {
  height = 280;
  y = 80;
  speed = 10;
  world;
  offset = { top: 130, right: 20, bottom: 15, left: 20 };
  idleTime = 0;
  lastMoveTime = new Date().getTime();
  hasPlayedHurt = false;
  hasPlayedDead = false;
  groundLevel = 140;
  bottleAmount = 0;
  coinAmount = 0;

  imagesIdle = ImageHub.character.idle;
  imagesIdleLong = ImageHub.character.long_idle;
  imagesWalking = ImageHub.character.walk;
  imagesJumping = ImageHub.character.jump;
  imagesHurt = ImageHub.character.hurt;
  imagesDead = ImageHub.character.dead;

  constructor() {
    super().loadImage("img/1_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.imagesIdle);
    this.loadImages(this.imagesIdleLong);
    this.loadImages(this.imagesWalking);
    this.loadImages(this.imagesJumping);
    this.loadImages(this.imagesHurt);
    this.loadImages(this.imagesDead);
  }

  animate() {
    IntervalHub.startInterval(() => this.updateMovement(), 1000 / 60);
    IntervalHub.startInterval(() => this.updateAnimation(), 110);
  }

  animateWalking() {
    this.playAnimation(this.imagesWalking);
  }

  animateHurt() {
    this.playAnimation(this.imagesHurt);
    this.registerActivity();
  }

  animateJump() {
    if (this.speedY > 0) {
      this.setImageFromCache(this.imagesJumping, 0);
    } else {
      this.setImageFromCache(this.imagesJumping, 5);
    }
  }

  animateIdle() {
    const idleDuration = Date.now() - this.lastMoveTime;
    this.isJumpingAnimationPlaying = false;
    const images = idleDuration < 10000 ? this.imagesIdle : this.imagesIdleLong;
    this.setImageFromCache(images, 0);
  }

  initDeathAnimation() {
    if (!this.isDeadAnimationPlaying) {
      this.isDeadAnimationPlaying = true;
      this.deadAnimationFrame = 0;
      this.speedY = 20;
      this.deathPhase = "up";
    }
  }

  playDeadAnimationFrame() {
    if (this.deadAnimationFrame < this.imagesDead.length) {
      this.setImageFromCache(this.imagesDead, this.deadAnimationFrame++);
      return false;
    } else {
      this.setImageFromCache(this.imagesDead, this.imagesDead.length - 1);
      return true;
    }
  }

  deathJumpPhase() {
    if (this.deathPhase === "up") {
      this.y -= this.speedY;
      this.speedY -= 1;
      if (this.speedY <= 0) this.deathPhase = "fall";
    } else {
      this.applyGravity();
    }
  }

  animateDead() {
    this.initDeathAnimation();

    if (this.deadAnimationFrame < this.imagesDead.length) {
      this.setImageFromCache(this.imagesDead, this.deadAnimationFrame++);
    } else {
      this.setImageFromCache(this.imagesDead, this.imagesDead.length - 1);
    }

    this.applyGravity();
  }

  moveRightIfPossible() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      return true;
    }
    return false;
  }

  moveLeftIfPossible() {
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      return true;
    }
    return false;
  }

  jumpIfPossible() {
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      return true;
    }
    return false;
  }

  updateMovement() {
    if (this.isDeadAnimationPlaying) return;
    if (this.world.isGameOver) return;
    this.lastY = this.y;
    const jumped = this.jumpIfPossible();
    const moved = this.moveRightIfPossible() || this.moveLeftIfPossible();
    if (jumped || moved) this.lastMoveTime = Date.now();
    if (this.isAboveGround() || this.speedY > 0) {
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
      if (this.y > this.groundLevel) this.y = this.groundLevel;
    }
    this.world.camera_x = -this.x + 100;
    this.handleAllSounds();
  }

  updateAnimation() {
    if (this.isDead()) this.animateDead();
    else if (this.isHurt()) this.animateHurt();
    else if (this.isAboveGround()) this.animateJump();
    else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)
      this.animateWalking();
    else this.animateIdle();
  }

  registerActivity() {
    this.lastMoveTime = Date.now();
  }

  collectBottle() {
    this.bottleAmount = Math.min(this.bottleAmount + 1, 10);
    this.registerActivity();
  }

  collectCoin() {
    this.coinAmount = Math.min(this.coinAmount + 1, 10);
    this.registerActivity();
  }

  handleRunSound() {
    const isRunning =
      (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) &&
      !this.isAboveGround() &&
      !this.isDead() &&
      !this.isHurt();
    if (isRunning) {
      if (AudioHub.characterRun.paused) {
        AudioHub.characterRun.loop = true;
        AudioHub.playOne(AudioHub.characterRun);
      }
    } else {
      AudioHub.stopOne(AudioHub.characterRun);
    }
  }

  handleJumpSound() {
    if (
      this.isAboveGround() &&
      this.speedY > 0 &&
      !this.isDead() &&
      !this.isHurt()
    ) {
      if (AudioHub.characterJump.paused) {
        AudioHub.playOne(AudioHub.characterJump);
      }
      AudioHub.stopOne(AudioHub.characterRun);
    }
  }

  handleHurtSound() {
    if (this.isHurt() && !this.hasPlayedHurt) {
      AudioHub.stopOne(AudioHub.characterRun);
      AudioHub.playOne(AudioHub.characterDamage);
      this.hasPlayedHurt = true;
    }
    if (!this.isHurt()) this.hasPlayedHurt = false;
  }

  handleDeadSound() {
    if (this.isDead() && !this.hasPlayedDead) {
      AudioHub.stopOne(AudioHub.characterRun);
      AudioHub.stopOne(AudioHub.characterDamage);
      AudioHub.stopOne(AudioHub.characterJump);
      AudioHub.playOne(AudioHub.characterDead);
      this.hasPlayedDead = true;
    }
  }

  handleIdleSound() {
    const idleDuration = Date.now() - this.lastMoveTime;
    const isIdle =
      !this.world.keyboard.RIGHT &&
      !this.world.keyboard.LEFT &&
      !this.world.keyboard.D &&
      !this.isAboveGround() &&
      !this.isDead() &&
      !this.isHurt() &&
      idleDuration >= 10000;
    if (isIdle) {
      if (AudioHub.characterSnoring.paused) {
        AudioHub.characterSnoring.loop = true;
        AudioHub.playOne(AudioHub.characterSnoring);
      }
    } else {
      AudioHub.stopOne(AudioHub.characterSnoring);
    }
  }

  handleAllSounds() {
    this.handleDeadSound();
    this.handleHurtSound();
    this.handleJumpSound();
    this.handleRunSound();
    this.handleIdleSound();
  }
}
