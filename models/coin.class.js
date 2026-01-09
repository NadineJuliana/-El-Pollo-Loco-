class Coin extends DrawableObject {
    height = 90;
    width = 90;
    isCollected = false;

    coinImage = ImageHub.coins.coin;

    offset = { top: 30, right: 30, bottom: 30, left: 30 };

    constructor() {
        super().loadImage('img/5_coins/coin_1.png');
        this.loadImages(this.coinImage);
        this.x = 300 + Math.random() * 2000;
        this.y = 100 + Math.random() * 100;
        this.animate();
    }

    animate() {

        setInterval(() => {
            this.playAnimation(this.coinImage);
        }, 200);

    }
}