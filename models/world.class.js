class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusbarHealth = new StatusbarHealth();
    statusbarCoin = new StatusbarCoin();
    statusbarBottle = new StatusbarBottle();
    statusbarEndboss = new StatusbarEndboss();
    throwableObjects = [];
    coins = [];
    bottles = [];

    constructor(canvas, keyboard,) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) {
                enemy.world = this;
            }
        });
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
    }

    run() {
        setInterval(() => {
            this.checkEnemyCollisions();
            this.checkThrowObjects();
            this.checkCollisionCoin();
            this.checkCollisionBottle();
            this.checkThrowableCollisions();
            this.checkEndbossDistance();
            this.checkEndbossState();
        }, 1000 / 60);
    }

    checkStomp(enemy) {
        const charBottom = this.character.realY + this.character.realHeight;
        const charOldBottom = this.character.lastY + this.character.realHeight;
        const enemyTop = enemy.realY;
        if (charOldBottom <= enemyTop && charBottom >= enemyTop && this.character.speedY < 0) {
            if (!enemy.isDeadAnimationPlaying) { 
                enemy.die();
                this.character.speedY = 8; 
            }
            return true;
        }
        return false;
    }

    checkSideOrBottomHit(enemy) {
        const charBottom = this.character.realY + this.character.realHeight;
        const charTop = this.character.realY;
        const enemyTop = enemy.realY;
        const enemyBottom = enemy.realY + enemy.realHeight;
        if (charBottom > enemyTop && charTop < enemyBottom) {
            this.character.hit();
            this.statusbarHealth.setPercentage(this.character.energy);
        }
    }


    checkEnemyCollisions() {
        for (const enemy of this.level.enemies) {
            if (!this.character.isColliding(enemy)) continue;

            if (enemy instanceof Chicken || enemy instanceof Chick) {
                const stomped = this.checkStomp(enemy);
                if (!stomped) this.checkSideOrBottomHit(enemy);
            } else {
                this.character.hit();
                this.statusbarHealth.setPercentage(this.character.energy);
            }
        }
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.character.bottleAmount > 0) {
            let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 50);
            this.throwableObjects.push(bottle);
            this.character.bottleAmount--;
            this.statusbarBottle.setPercentage(this.character.bottleAmount * 10);
        }
    }

    checkThrowableCollisions() {
        this.throwableObjects.forEach((bottle) => {

            if (bottle.y >= bottle.groundY && bottle.speedY <= 0 && !bottle.isSplashed) {
                bottle.splash();
            }

            this.level.enemies.forEach(enemy => {
                if (enemy instanceof Endboss && bottle.isColliding(enemy) && !bottle.hasHit) {
                    bottle.hasHit = true;
                    bottle.splash();
                    enemy.hit(10);
                    const percent = (enemy.energy / enemy.maxEnergy) * 100;
                    this.statusbarEndboss.setPercentage(enemy.energy);
                }
            });
        });

        this.throwableObjects = this.throwableObjects.filter(b => !b.markedForDeletion);
    }

    checkCollisionCoin() {
        this.level.coins.forEach((coin) => {
            if (!coin.isCollected && this.character.isColliding(coin)) {
                // console.log('Collision with Coin', coin);
                coin.isCollected = true;
                this.character.collectCoin();
                this.statusbarCoin.setPercentage(this.character.coinAmount * 10);
            }
        })
    }

    checkCollisionBottle() {
        this.level.bottles.forEach((bottle) => {
            if (!bottle.isCollected && this.character.isColliding(bottle)) {
                // console.log('Collision with Bottle', bottle);
                bottle.isCollected = true;
                this.character.collectBottle();
                this.statusbarBottle.setPercentage(this.character.bottleAmount * 10);
            }
        })
    }

    checkEndbossDistance() {
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) {
                const distance = Math.abs(this.character.x - enemy.x);

                enemy.isAlert = distance < 500;
                enemy.isAttacking = distance < 200;
            }
        });
    }

    checkEndbossState() {
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) {
                const distance = Math.abs(this.character.x - enemy.x);

                enemy.isAlert = distance < 600;
                enemy.isAttacking = distance < 150;
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
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
        this.ctx.translate(mO.width, 0);
        this.ctx.scale(-1, 1);
        mO.x = mO.x * -1;
    }

    flipImageBack(mO) {
        mO.x = mO.x * -1;

        this.ctx.restore();
    }


}