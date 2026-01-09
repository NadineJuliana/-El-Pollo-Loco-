class Bottle extends DrawableObject {
    height = 70;
    width = 70;
    y = 360;
    isCollected = false;

    bottlesOnGround = ImageHub.salsa_bottle.on_Ground;

    offset = { top: 15, right: 15, bottom: 10, left: 20 };

    constructor() {
        super();
        this.loadImages(this.bottlesOnGround);
        this.setRandomImage();
        this.x = 250 + Math.random() * 2500;
    }

    setRandomImage() {
        const imagePaths = Object.keys(this.imageCache);
        const randomIndex = Math.floor(Math.random() * imagePaths.length);
        const randomPath = imagePaths[randomIndex];
        this.img = this.imageCache[randomPath];
    }
}