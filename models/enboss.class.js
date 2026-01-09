class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 60;

    offset = { top: 90, right: 40, bottom: 40, left: 40 };

    endbossWalking = ImageHub.endboss.walk;
    endbossAlert = ImageHub.endboss.alert;
    endbossAttack = ImageHub.endboss.attack;
    endbossHurt = ImageHub.endboss.hurt;
    endbossDead = ImageHub.endboss.dead;

    constructor() {
        super().loadImage(this.endbossWalking[0]);
        this.loadImages(this.endbossWalking);
        this.loadImages(this.endbossAlert);
        this.loadImages(this.endbossAttack);
        this.loadImages(this.endbossHurt);
        this.loadImages(this.endbossDead);
        this.x = 2800;
        this.animate();
    }


    // IMAGES_WALKING = [
    //     'img/3_enemie_boss_chicken/1_walk/G1.png',
    //     'img/3_enemie_boss_chicken/1_walk/G2.png',
    //     'img/3_enemie_boss_chicken/1_walk/G3.png',
    //     'img/3_enemie_boss_chicken/1_walk/G4.png',
    // ];

    // constructor() {
    //     super().loadImage(this.IMAGES_WALKING[0]);
    //     this.loadImages(this.IMAGES_WALKING);
    //     this.x = 2500;
    //     this.animate();
    // }

    animate() {
        setInterval(() => {
            this.playAnimation(this.endbossWalking);
        }, 200);

    }
}
