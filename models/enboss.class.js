class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 60;

    offset = { top: 90, right: 40, bottom: 40, left: 40 };
    energy = 100;

    speed = 0.4;

    isDeadAnimationPlaying = false;
    deadAnimationFrame = 0;
    attackCooldown = 1000;
    lastAttack = 0;
    state = 'idle';
    spawnX = 2800;
    alertPlayed = false;
    lastTimeSeen = 0;
    world;
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
        this.x = 2800;
        this.animate();
    }

    animate() {
        setInterval(() => this.updateState(), 1000 / 60);
        setInterval(() => this.updateAnimation(), 150);
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
        if (this.lastState !== this.state) {
            this.currentImage = 0;
            this.lastState = this.state;
        }

        if (this.isDead()) {
            this.animateDead();
            return;
        }

        switch (this.state) {
            case 'dead':
                this.animateDead();
                break;
            case 'hurt':
                this.animateHurt();
                break;
            case 'alert':
                this.animateAlert();
                break;
            case 'chase':
            case 'return':
                this.animateWalking();
                break;
            case 'idle':
            default:
                this.animateAlert();
                break;
        }
    }

    updateState() {
        if (this.state === 'alert') {
            if (Date.now() - this.alertStartTime > 800) {
                this.state = 'chase';
            }
        }
        if (this.isDead()) return;
        if (!this.world || !this.world.character) return;

        this.handleDetection();

        switch (this.state) {
            case 'alert':
                this.handleAlert();
                break;
            case 'chase':
                this.handleChase();
                break;
            case 'attack':
                this.handleAttack();
                break;
            case 'return':
                this.handleReturn();
                break;
        }
    }

    handleDetection() {
        const character = this.world.character;
        const distance = Math.abs(character.x - this.x);

        if (distance < 600) {
            this.lastTimeSeen = Date.now();

            if (this.state === 'idle') {
                this.state = 'alert';
                this.alertPlayed = false;
            }
        }
    }

    handleAlert() {
        if (this.alertPlayed) return;

        this.alertPlayed = true;
        this.alertStartTime = Date.now();
    }

    handleChase() {
        const character = this.world.character;
        const distance = Math.abs(character.x - this.x);
        const now = Date.now();

        if (distance < 150) {
            this.state = 'attack';
            return;
        }

        this.moveTowardsCharacter();

        if (distance > 800 && now - this.lastTimeSeen > 3000) {
            this.state = 'return';
        }
    }

    handleAttack() {
        const character = this.world.character;
        const distance = Math.abs(character.x - this.x);

        if (distance > 200) {
            this.state = 'chase';
            return;
        }

        this.tryAttack();
    }

    handleReturn() {
        this.returnToSpawn();

        if (Math.abs(this.x - this.spawnX) < 5) {
            this.x = this.spawnX;
            this.state = 'idle';
            this.alertPlayed = false;
        }
    }

    moveTowardsCharacter() {
        const character = this.world.character;

        if (character.x < this.x) {
            this.moveLeft();
            this.otherDirection = false;
        }
    }

    returnToSpawn() {
        if (this.x < this.spawnX) {
            this.moveRight();
            this.otherDirection = true;
        }
    }


    tryAttack() {
        const now = Date.now();
        if (now - this.lastAttack < this.attackCooldown) return;

        const character = this.world.character;

        if (this.isColliding(character)) {
            character.hit(10);
            this.world.statusbarHealth.setPercentage(character.energy);
            this.lastAttack = now;
        }
    }

    hit(damage = 10) {
        if (this.isDead()) return;

        this.energy -= damage;

        if (this.energy <= 0) {
            this.energy = 0;
            this.state = 'dead';
            return;
        }
        this.state = 'hurt';

        clearTimeout(this.hurtTimeout);
        this.hurtTimeout = setTimeout(() => {
            if (this.energy > 0) {
                this.state = 'chase';
            }
        }, 500);
    }
}
