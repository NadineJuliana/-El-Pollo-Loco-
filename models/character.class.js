/* =========================
 * Character
 * Main player entity handling movement, animation and sound logic
 * ========================= */
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
    deathPhase = null;
    isDeathJump = false;
    imagesIdle = ImageHub.character.idle;
    imagesIdleLong = ImageHub.character.long_idle;
    imagesWalking = ImageHub.character.walk;
    imagesJumping = ImageHub.character.jump;
    imagesHurt = ImageHub.character.hurt;
    imagesDead = ImageHub.character.dead;

  // Creates the player character and loads animations.
    constructor() {
      super().loadImage("img/1_character_pepe/1_idle/idle/I-1.png");
      this.loadImages(this.imagesIdle);
      this.loadImages(this.imagesIdleLong);
      this.loadImages(this.imagesWalking);
      this.loadImages(this.imagesJumping);
      this.loadImages(this.imagesHurt);
      this.loadImages(this.imagesDead);
    }

  /* ---------- Animation System ---------- */
    // Starts movement and animation loops.
      animate() {
        IntervalHub.startInterval(() => this.updateMovement(), 1000 / 60);
        IntervalHub.startInterval(() => this.updateAnimation(), 110);
      }

    // Walking animation.
      animateWalking() {
        this.playAnimation(this.imagesWalking);
      }

    // Hurt animation.
      animateHurt() {
        this.playAnimation(this.imagesHurt);
        this.registerActivity();
      }

    // Jump animation depending on vertical velocity.
      animateJump() {
        if (this.speedY > 0) {
          this.setImageFromCache(this.imagesJumping, 0);
        } else {
          this.setImageFromCache(this.imagesJumping, 5);
        }
      }

    // Idle animation (normal or long idle).
      animateIdle() {
        const idleDuration = Date.now() - this.lastMoveTime;
        this.isJumpingAnimationPlaying = false;
        if (idleDuration < 10000) {
          this.playAnimation(this.imagesIdle);
        } else {
          this.playAnimation(this.imagesIdleLong);
        }
      }

  /* ---------- Death System ---------- */
    // Initializes death animation sequence.
      initDeathAnimation() {
        if (!this.isDeadAnimationPlaying) {
          this.isDeadAnimationPlaying = true;
          this.deadAnimationFrame = 0;
          this.speedY = 20;
          this.deathPhase = "up";
        }
      }
    
    // Plays death animation frames.
      playDeadAnimationFrame() {
        if (this.deadAnimationFrame < this.imagesDead.length) {
          this.setImageFromCache(this.imagesDead, this.deadAnimationFrame++);
          return false;
        } else {
          this.setImageFromCache(this.imagesDead, this.imagesDead.length - 1);
          return true;
        }
      }

    // Handles vertical movement during death sequence.
      deathJumpPhase() {
        if (!this.isDeathJump) return;
        if (this.deathPhase === "up") {
          this.y -= this.speedY;
          this.speedY -= 7;
          if (this.speedY <= 0) this.deathPhase = "fall";
        } else if (this.deathPhase === "fall") {
          this.y -= this.speedY;
          this.speedY -= 5;
        }
      }

    // Initializes death animation state once.
      initDeathState() {
        this.isDeadAnimationPlaying = true;
        this.deadAnimationFrame = 0;
        this.speedY = 25;
        this.deathPhase = "up";
        this.isDeathJump = true;
        this.lastDeathFrameTime = Date.now();
      }

    // Handles death animation frame timing.
      updateDeathAnimationFrame() {
        const now = Date.now();
        if (now - this.lastDeathFrameTime > 300) {
          if (this.deadAnimationFrame < this.imagesDead.length - 1) {
            this.deadAnimationFrame++;
          }
          this.lastDeathFrameTime = now;
        }
      }

    // Full death animation handler.
       animateDead() {
        if (!this.isDeadAnimationPlaying) this.initDeathState();
        this.updateDeathAnimationFrame();
        this.setImageFromCache(this.imagesDead, this.deadAnimationFrame);
        this.deathJumpPhase();
      }

  /* ---------- Movement ---------- */
    // Applies damage and triggers death state if needed.
      hit() {
        super.hit();
        if (this.isDead()) {
          this.isDeathJump = true;
        }
      }

    // Move right if possible.
      moveRightIfPossible() {
        if (Keyboard.RIGHT && this.x < this.world.level.level_end_x) {
          this.moveRight();
          this.otherDirection = false;
          return true;
        }
        return false;
      }

    // Move left if possible.
      moveLeftIfPossible() {
        if (Keyboard.LEFT && this.x > 0) {
          this.moveLeft();
          this.otherDirection = true;
          return true;
        }
        return false;
      }

    // Jump if grounded.
      jumpIfPossible() {
        if (Keyboard.SPACE && !this.isAboveGround()) {
          this.jump();
          AudioHub.playOne(AudioHub.characterJump);
          AudioHub.stopOne(AudioHub.characterRun);
          return true;
        }
        return false;
      }

    // Main movement update loop.
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

    // Handles animation state switching.
      updateAnimation() {
        if (this.isDead()) this.animateDead();
        else if (this.isHurt()) this.animateHurt();
        else if (this.isAboveGround()) this.animateJump();
        else if (Keyboard.RIGHT || Keyboard.LEFT) this.animateWalking();
        else this.animateIdle();
      }

  /* ---------- Game Interaction ---------- */
    // Marks player activity timestamp
      registerActivity() {
        this.lastMoveTime = Date.now();
      }

    // Collects bottle
      collectBottle() {
        this.bottleAmount = Math.min(
          this.bottleAmount + 1,
          this.world.level.maxBottles,
        );
        this.registerActivity();
      }

    // Collects coin.
      collectCoin() {
        this.coinAmount = Math.min(this.coinAmount + 1, this.world.level.maxCoins);
        this.registerActivity();
      }

  /* ---------- Sound System ---------- */
    // Handles running sound
      handleRunSound() {
        const isRunning =
          (Keyboard.RIGHT || Keyboard.LEFT) &&
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

    // Handles hurt sound.
      handleHurtSound() {
        if (this.isHurt() && !this.hasPlayedHurt) {
          AudioHub.stopOne(AudioHub.characterRun);
          AudioHub.playOne(AudioHub.characterDamage);
          this.hasPlayedHurt = true;
        }
        if (!this.isHurt()) this.hasPlayedHurt = false;
      }

    // Handles death sound.
      handleDeadSound() {
        if (this.isDead() && !this.hasPlayedDead) {
          AudioHub.stopOne(AudioHub.characterRun);
          AudioHub.stopOne(AudioHub.characterDamage);
          AudioHub.stopOne(AudioHub.characterJump);
          AudioHub.playOne(AudioHub.characterDead);
          this.hasPlayedDead = true;
        }
      }

    // Checks if character has been idle long enough for snoring.
      isIdleForSnoring() {
        const idleDuration = Date.now() - this.lastMoveTime;
        return (
          !Keyboard.RIGHT &&
          !Keyboard.LEFT &&
          !Keyboard.D &&
          !this.isAboveGround() &&
          !this.isDead() &&
          !this.isHurt() &&
          idleDuration >= 10000
        );
      }

    // Handles idle snoring sound logic.
      handleIdleSound() {
        if (this.isIdleForSnoring()) {
          if (AudioHub.characterSnoring.paused) {
            AudioHub.characterSnoring.loop = true;
            AudioHub.playOne(AudioHub.characterSnoring);
          }
        } else {
          AudioHub.stopOne(AudioHub.characterSnoring);
        }
      }

    // Central sound handler.
      handleAllSounds() {
        this.handleDeadSound();
        this.handleHurtSound();
        this.handleRunSound();
        this.handleIdleSound();
      }
  }