class DrawableObject {
    x = 120;
    y = 280;
    img;
    height = 150;
    width = 100;
    imageCache = {};
    currentImage = 0;

    offset = { top: 0, right: 0, bottom: 0, left: 0 };

    realX;
    realY;
    realWidth;
    realHeight;

    constructor() {
        IntervalHub.startInterval(this.getRealFrame, 1000 / 60);
    }

    getRealFrame = () => {
        this.realX = this.x + this.offset.left;
        this.realY = this.y + this.offset.top;
        this.realWidth = this.width - this.offset.left - this.offset.right;
        this.realHeight = this.height - this.offset.top - this.offset.bottom;
    }

    isColliding(mO) {
        return this.realX + this.realWidth > mO.realX &&
            this.realY + this.realHeight > mO.realY &&
            this.realX < mO.realX + mO.realWidth &&
            this.realY < mO.realY + mO.realHeight
    }

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });

    }

    
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }



    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof Chick || this instanceof Coin || this instanceof Bottle || this instanceof ThrowableObject) {
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.realX, this.realY, this.realWidth, this.realHeight);
            ctx.stroke();
        }
    }

}
