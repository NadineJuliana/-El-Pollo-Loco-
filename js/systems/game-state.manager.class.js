class GameStateManager {
  constructor(world) {
    this.world = world;
  }

  checkGameOver() {
    if (this.handleCharacterDeath()) return;
    this.handleWinCondition();
  }

  handleCharacterDeath() {
    const world = this.world;
    const character = world.character;
    if (world.isGameOver || !character.isDead()) return false;
    this.stopControls();
    if (this.isDeathAnimationFinished(character)) {
      world.isGameOver = true;
      this.endGame();
      return true;
    }
    return false;
  }

  handleWinCondition() {
    const world = this.world;
    const endboss = world.level.enemies.find(
      (enemy) => enemy instanceof Endboss,
    );
    if (!endboss || world.isGameWon) return;
    if (this.isEndbossDead(endboss)) {
      world.isGameWon = true;
      this.stopControls();
      this.endGame();
    }
  }

  stopControls() {
    Keyboard.RIGHT = false;
    Keyboard.LEFT = false;
    Keyboard.SPACE = false;
    Keyboard.D = false;
  }

  isDeathAnimationFinished(character) {
    return (
      character.deadAnimationFrame >= character.imagesDead.length - 1 &&
      character.y >= character.groundLevel + 300
    );
  }

  isEndbossDead(endboss) {
    return (
      endboss.isDead() &&
      endboss.deadAnimationFrame >= endboss.endbossDead.length - 1
    );
  }

  endGame() {
    this.world.isRunning = false;
    IntervalHub.stopAllIntervals();
    AudioHub.stopAll();
  }

 
}
