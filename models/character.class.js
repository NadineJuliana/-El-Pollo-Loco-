class Character extends MovableObject {
    height = 280;
    y = 80;
    speed = 10;
    world;
    offset = { top: 130, right: 20, bottom: 10, left: 20 }
    idleTime = 0;
    lastMoveTime = new Date().getTime();
    isJumpingAnimationPlaying = false;
    jumpAnimationFrame = 0;

    bottleAmount = 0;
    coinAmount = 0;

    imagesIdle = ImageHub.character.idle;
    imagesIdleLong = ImageHub.character.long_idle;
    imagesWalking = ImageHub.character.walk;
    imagesJumping = ImageHub.character.jump;
    imagesHurt = ImageHub.character.hurt;
    imagesDead = ImageHub.character.dead;

    constructor() {
        super().loadImage('img/1_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.imagesIdle);
        this.loadImages(this.imagesIdleLong);
        this.loadImages(this.imagesWalking);
        this.loadImages(this.imagesJumping);
        this.loadImages(this.imagesHurt);
        this.loadImages(this.imagesDead);
        this.applyGravity();
        this.animate();
    }


    animate() {
        setInterval(() => this.updateMovement(), 1000 / 60);
        setInterval(() => this.updateAnimation(), 110);
    }

    animateWalking() {
        this.playAnimation(this.imagesWalking);
        this.isJumpingAnimationPlaying = false;
    }

    animateHurt() {
        this.playAnimation(this.imagesHurt);
    }

    animateJump() {
        if (!this.isJumpingAnimationPlaying) {
            this.isJumpingAnimationPlaying = true;
            this.jumpAnimationFrame = 0;
        }
        if (this.jumpAnimationFrame < this.imagesJumping.length) {
            this.setImageFromCache(this.imagesJumping, this.jumpAnimationFrame++);
        } else {
            this.setImageFromCache(this.imagesJumping, this.imagesJumping.length - 1);
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
            this.deathPhase = 'up';
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
        if (this.deathPhase === 'up') {
            this.y -= this.speedY;
            this.speedY -= 1;
            if (this.speedY <= 0) this.deathPhase = 'fall';
        } else {
            this.applyGravity();
        }
    }

    animateDead() {
        this.initDeathAnimation();
        const animationDone = this.playDeadAnimationFrame();
        if (animationDone) this.deathJumpPhase();
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
        const now = Date.now();
        const jumped = this.jumpIfPossible();
        const moved = this.moveRightIfPossible() || this.moveLeftIfPossible();
        if (jumped || moved) this.lastMoveTime = now;
        this.world.camera_x = -this.x + 100;
    }

    updateAnimation() {
        if (this.isDead()) this.animateDead();
        else if (this.isHurt()) this.animateHurt();
        else if (this.isAboveGround()) this.animateJump();
        else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) this.animateWalking();
        else this.animateIdle();
    }

    collectBottle() {
        this.bottleAmount = Math.min(this.bottleAmount + 1, 10);
        // console.log(this.bottleAmount);

    }

    collectCoin() {
        this.coinAmount = Math.min(this.coinAmount + 1, 10)
        // console.log(this.coinAmount);
    }
}