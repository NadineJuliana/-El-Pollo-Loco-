class Character extends MovableObject {
    height = 280;
    y = 80;
    speed = 10;
    world;
    offset = { top: 130, right: 20, bottom: 10, left: 20 }

    // IMAGES_IDLE = [
    //     'img/1_character_pepe/1_idle/idle/I-1.png',
    //     'img/1_character_pepe/1_idle/idle/I-2.png',
    //     'img/1_character_pepe/1_idle/idle/I-3.png',
    //     'img/1_character_pepe/1_idle/idle/I-4.png',
    //     'img/1_character_pepe/1_idle/idle/I-5.png',
    //     'img/1_character_pepe/1_idle/idle/I-6.png',
    //     'img/1_character_pepe/1_idle/idle/I-7.png',
    //     'img/1_character_pepe/1_idle/idle/I-8.png',
    //     'img/1_character_pepe/1_idle/idle/I-9.png',
    //     'img/1_character_pepe/1_idle/idle/I-10.png',
    // ];

    // IMAGES_LONGIDLE = [
    //     'img/1_character_pepe/1_idle/long_idle/I-11.png',
    //     'img/1_character_pepe/1_idle/long_idle/I-12.png',
    //     'img/1_character_pepe/1_idle/long_idle/I-13.png',
    //     'img/1_character_pepe/1_idle/long_idle/I-14.png',
    //     'img/1_character_pepe/1_idle/long_idle/I-15.png',
    //     'img/1_character_pepe/1_idle/long_idle/I-16.png',
    //     'img/1_character_pepe/1_idle/long_idle/I-17.png',
    //     'img/1_character_pepe/1_idle/long_idle/I-18.png',
    //     'img/1_character_pepe/1_idle/long_idle/I-19.png',
    //     'img/1_character_pepe/1_idle/long_idle/I-20.png',
    // ];

    // IMAGES_WALKING = [
    //     'img/1_character_pepe/2_walk/W-21.png',
    //     'img/1_character_pepe/2_walk/W-22.png',
    //     'img/1_character_pepe/2_walk/W-23.png',
    //     'img/1_character_pepe/2_walk/W-24.png',
    //     'img/1_character_pepe/2_walk/W-25.png',
    //     'img/1_character_pepe/2_walk/W-26.png'
    // ];

    // IMAGES_JUMPING = [
    //     'img/1_character_pepe/3_jump/J-31.png',
    //     'img/1_character_pepe/3_jump/J-32.png',
    //     'img/1_character_pepe/3_jump/J-33.png',
    //     'img/1_character_pepe/3_jump/J-34.png',
    //     'img/1_character_pepe/3_jump/J-35.png',
    //     'img/1_character_pepe/3_jump/J-36.png',
    //     'img/1_character_pepe/3_jump/J-37.png',
    //     'img/1_character_pepe/3_jump/J-38.png',
    //     'img/1_character_pepe/3_jump/J-39.png',
    // ];

    // IMAGES_HURT = [
    //     'img/1_character_pepe/4_hurt/H-41.png',
    //     'img/1_character_pepe/4_hurt/H-42.png',
    //     'img/1_character_pepe/4_hurt/H-43.png'
    // ];

    // IMAGES_DEAD = [
    //     'img/1_character_pepe/5_dead/D-51.png',
    //     'img/1_character_pepe/5_dead/D-52.png',
    //     'img/1_character_pepe/5_dead/D-53.png',
    //     'img/1_character_pepe/5_dead/D-54.png',
    //     'img/1_character_pepe/5_dead/D-55.png',
    //     'img/1_character_pepe/5_dead/D-56.png',
    //     'img/1_character_pepe/5_dead/D-57.png'
    // ];

    imagesIdle = ImageHub.character.idle;
    imagesIdleLong = ImageHub.character.long_idle;
    imagesWalking = ImageHub.character.walk;
    imagesJumping = ImageHub.character.jump;
    imagesHurt = ImageHub.character.hurt;
    imagesDead = ImageHub.character.dead;




    constructor() {
        super().loadImage('img/1_character_pepe/1_idle/idle/I-1.png');
        // this.loadImages(this.IMAGES_IDLE);
        // this.loadImages(this.IMAGES_LONGIDLE);
        // this.loadImages(this.IMAGES_WALKING);
        // this.loadImages(this.IMAGES_JUMPING);
        // this.loadImages(this.IMAGES_HURT);
        // this.loadImages(this.IMAGES_DEAD);
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
        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
                // console.log(this.x, typeof this.x);
            }

            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
                // console.log(this.x, typeof this.x);
            }

            // console.log('this.speedY', this.speedY);
            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
            }

            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.imagesDead);
            }
            else if (this.isHurt()) {
                this.playAnimation(this.imagesHurt);
            }
            else if (this.isAboveGround()) {
                this.playAnimation(this.imagesJumping);
            } else {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.imagesWalking);
                }
            }
        }, 50);
    }


}