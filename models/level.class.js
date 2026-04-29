class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  level_end_x = 5000;

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

  placeObjectTypes(configs) {
    configs.forEach(({ objects, xMin, xMax, yMin, yMax }) => {
      this.placeObjects(objects, { xMin, xMax, yMin, yMax });
    });
  }

  placeObjects(objects, options) {
    const placed = [];
    objects.forEach((object) => {
      this.placeSingleObject(object, placed, options);
    });
  }

  getRandomPosition(xMin, xMax, yMin, yMax) {
    return {
      x: xMin + Math.random() * (xMax - xMin),
      y: yMin + Math.random() * (yMax - yMin),
    };
  }

  hasCollision(object, placed) {
    return placed.some((other) => {
      other.getRealFrame();
      return object.isColliding(other);
    });
  }

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
