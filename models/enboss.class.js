class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 50;

    offset = { top: 90, right: 40, bottom: 40, left: 40 };


    IMAGES_WALKING = [
        'img/3_enemie_boss_chicken/1_walk/G1.png',
        'img/3_enemie_boss_chicken/1_walk/G2.png',
        'img/3_enemie_boss_chicken/1_walk/G3.png',
        'img/3_enemie_boss_chicken/1_walk/G4.png',
    ];

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 2500;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);

    }
}
