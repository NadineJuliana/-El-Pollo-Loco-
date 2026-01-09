class ThrowableObject extends MovableObject {

    offset = { top: 15, right: 15, bottom: 10, left: 20 };

    bottleRotation = ImageHub.salsa_bottle.rotaion;
    bottleSplash = ImageHub.salsa_bottle.splash;

    isSplashed = false;
    groundY = 350;


    constructor(x, y) {
        super();
        // super().loadImage('img/4_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.bottleRotation);
        this.loadImages(this.bottleSplash);
        this.x = x;
        this.y = y;
        this.height = 70;
        this.width = 70;
        this.throw();
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.isSplashed) {
                this.playAnimation(this.bottleRotation);
            } else {
                this.playAnimation(this.bottleSplash);
            }
        }, 80);
    }

    throw() {
        this.speedY = 15;
        this.acceleration = 1.8;
        this.applyGravity();

        this.throwInterval = setInterval(() => {
            if (!this.isSplashed) {
                this.x += 10;
            }
        }, 25);
    }

    splash() {
        if (this.isSplashed) return;

        this.isSplashed = true;
        this.y = this.groundY;
        this.speedY = 0;
        clearInterval(this.throwInterval);

        setTimeout(() => {
            this.markedForDeletion = true;
        }, 500);


    }

}