class Chicken extends MovableObject {
    y = 360;
    height = 50;
    width = 70;
    // IMAGES_WALKING = [
    //     'img/2_enemies_chicken/chicken_normal/1_walk/1_w.png',
    //     'img/2_enemies_chicken/chicken_normal/1_walk/2_w.png',
    //     'img/2_enemies_chicken/chicken_normal/1_walk/3_w.png'
    // ];

    bigChickenWalking = ImageHub.chicken_normal.walk;
    bigChickenDead = ImageHub.chicken_normal.dead;

    constructor() {
        super().loadImage('img/2_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.bigChickenWalking);
        this.loadImages(this.bigChickenDead);
        this.x = 800 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            this.playAnimation(this.bigChickenWalking);
        }, 200);

    }

}
