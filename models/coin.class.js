class Coin extends DrawableObject {
    height = 80;
    width = 80;

    coinImage = ImageHub.coins.coin;

    offset = { top: 5, right: 5, bottom: 5, left: 5 };

    constructor() {
        super().loadImage('img/5_coins/coin_1.png');
        this.loadImages(this.coinImage);
        this.x = 300 + Math.random() * 2000;
        this.y = 200 + Math.random() * 100;
        this.animate();
    }

    animate() {

        setInterval(() => {
            this.playAnimation(this.coinImage);
        }, 200);

    }
}