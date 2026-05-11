/**
 * @class Level
 * @description Defines all game objects and handles procedural placement
 */
class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  level_end_x = 5000;
  maxCoins = 20;
  maxBottles = 10;

  /**
   * Creates a new Level instance
   * @param {Enemy[]} enemies - List of enemies in the level
   * @param {Cloud[]} clouds - List of clouds in the level
   * @param {BackgroundObject[]} backgroundObjects - Background scenery objects
   * @param {Coin[]} coins - Collectible coins
   * @param {Bottle[]} bottles - Collectible bottles
   */
  constructor(enemies, clouds, backgroundObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
    this.placeObjectTypes([
      { objects: this.coins, xMin: 300, xMax: 4500, yMin: 100, yMax: 200 },
      { objects: this.bottles, xMin: 250, xMax: 4500, yMin: 360, yMax: 360 },
      { objects: this.clouds, xMin: 0, xMax: 4500, yMin: 20, yMax: 30 },
    ]);
  }

  /**
   * Distributes different object types across the level.
   * @param {Array<{objects: Array, xMin: number, xMax: number, yMin: number, yMax: number}>} configs
   */
  placeObjectTypes(configs) {
    configs.forEach(({ objects, xMin, xMax, yMin, yMax }) => {
      this.placeObjects(objects, { xMin, xMax, yMin, yMax });
    });
  }

  /**
   * Places all objects of one type.
   * @param {Array} objects
   * @param {{xMin:number, xMax:number, yMin:number, yMax:number}} options
   */
  placeObjects(objects, options) {
    const placed = [];
    objects.forEach((object) => {
      this.placeSingleObject(object, placed, options);
    });
  }

  /**
   * Generates a random position within given bounds.
   * @param {number} xMin
   * @param {number} xMax
   * @param {number} yMin
   * @param {number} yMax
   * @returns {{x:number, y:number}}
   */
  getRandomPosition(xMin, xMax, yMin, yMax) {
    return {
      x: xMin + Math.random() * (xMax - xMin),
      y: yMin + Math.random() * (yMax - yMin),
    };
  }

  /**
   * Checks collision against already placed objects.
   * @param {Object} object
   * @param {Array} placed
   * @returns {boolean}
   */
  hasCollision(object, placed) {
    return placed.some((other) => {
      other.getRealFrame();
      return object.isColliding(other);
    });
  }

  /**
   * Attempts to place a single object without overlap.
   * @param {Object} object
   * @param {Array} placed
   * @param {{xMin:number, xMax:number, yMin:number, yMax:number}} options
   * @returns {boolean}
   */
  placeSingleObject(object, placed, options) {
    const { xMin, xMax, yMin, yMax } = options;
    let attempts = 0;
    while (attempts < 100) {
      const pos = this.getRandomPosition(xMin, xMax, yMin, yMax);
      object.x = pos.x;
      object.y = pos.y;
      object.getRealFrame();
      if (!this.hasCollision(object, placed)) {
        placed.push(object);
        return true;
      }
      attempts++;
    }
    return false;
  }
}