class Chick extends MovableObject {
    y = 380;
    height = 30;
    width = 40;
    

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

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            this.playAnimation(this.littleChickenWalking);
        }, 200);

    }
}