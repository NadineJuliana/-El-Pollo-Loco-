class Chick extends MovableObject {
    y = 380;
    height = 30;
    width = 40;
    offset = { top: 5, right: 5, bottom: 5, left: 5 };

    isDeadAnimationPlaying = false;

    littleChickenWalking = ImageHub.chicken_small.walk;
    littleChickenDead = ImageHub.chicken_small.dead;

    constructor() {
        super().loadImage('img/2_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.littleChickenWalking);
        this.loadImages(this.littleChickenDead);
        this.x = 800 + Math.random() * 800;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }


    die() {
        this.isDeadAnimationPlaying = true;
        this.setImageFromCache(this.littleChickenDead, 0);
        setTimeout(() => {
            if (this.world) {
                const index = this.world.level.enemies.indexOf(this);
                if (index > -1) {
                    this.world.level.enemies.splice(index, 1);
                }
            }
        }, 1000);
    }

    animate() {
        this.movementInterval = setInterval(() => {
            if (!this.isDeadAnimationPlaying) this.moveLeft();
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            if (!this.isDeadAnimationPlaying) {
                this.playAnimation(this.littleChickenWalking);
            } else {
                this.setImageFromCache(this.littleChickenDead, 0);
            }
        }, 200);
    }
}