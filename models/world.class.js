class World {
  constructor(canvas, level) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.level = level;
    this.character = new Character();
    this.camera_x = 0;
    this.throwableObjects = [];
    this.throwing = false;
    this.isGameOver = false;
    this.isGameWon = false;
    this.isRunning = true;
    this.statusbarHealth = new StatusbarHealth();
    this.statusbarCoin = new StatusbarCoin();
    this.statusbarBottle = new StatusbarBottle();
    this.statusbarEndboss = new StatusbarEndboss();
    AudioHub.playOne(AudioHub.gameStart);
    this.setWorld();
    this.initObjects();
    this.collisionManager = new CollisionManager(this);
    this.gameStateManager = new GameStateManager(this);
    this.gameLoopManager = new GameLoop(this);
    this.renderSystem = new RenderSystems(this);
    this.gameLoopManager.run();
    this.renderSystem.start();
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((e) => (e.world = this));
  }

  initObjects() {
    this.character.animate();
    this.level.enemies.forEach((enemy) => {
      enemy.collidable = true;
      enemy.animate();
    });
    this.level.coins.forEach((coin) => coin.animate());
    this.level.clouds.forEach((cloud) => cloud.animate());
  }
}
