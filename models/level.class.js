class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  level_end_x = 2950;

  constructor(enemies, clouds, backgroundObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
    this.placeObjectTypes([
      { objects: this.coins, xMin: 300, xMax: 2200, yMin: 100, yMax: 200 },
      { objects: this.bottles, xMin: 250, xMax: 2500, yMin: 360, yMax: 360 },
      { objects: this.clouds, xMin: 0, xMax: 2500, yMin: 20, yMax: 30 },
    ]);
  }

  placeObjectTypes(configs) {
    configs.forEach(({ objects, xMin, xMax, yMin, yMax }) => {
      this.placeObjects(objects, { xMin, xMax, yMin, yMax });
    });
  }

  placeObjects(objects, options) {
    const placed = [];
    const { xMin, xMax, yMin, yMax } = options;
    objects.forEach((object) => {
      let placedSuccessfully = false;
      let attempts = 0;

      while (!placedSuccessfully && attempts < 100) {
        object.x = xMin + Math.random() * (xMax - xMin);
        object.y = yMin + Math.random() * (yMax - yMin);
        object.getRealFrame();
        let collision = placed.some((other) => {
          other.getRealFrame();
          return object.isColliding(other);
        });
        if (!collision) {
          placed.push(object);
          placedSuccessfully = true;
        }
        attempts++;
      }
    });
  }
}
