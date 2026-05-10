/* =========================
 * Game State Manager
 * Handles win/lose conditions and global game state transitions
 * ========================= */
  class GameStateManager {
    /**
     * Creates a new game state manager.
     * @param {World} world - The active game world.
     */
      constructor(world) {
        this.world = world;
      }

    /* ---------- Game State Checks ---------- */
      //Checks whether the game has been won or lost.
        checkGameOver() {
          if (this.handleCharacterDeath()) return;
          this.handleWinCondition();
        }

      /**
       * Handles the player death state and triggers game over if finished.
       * @returns {boolean} True if the game over state has been triggered.
       */
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

      // Checks win condition (endboss defeated).
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

    /* ---------- Controls ---------- */
      // Stops all player inputs.
        stopControls() {
          Keyboard.RIGHT = false;
          Keyboard.LEFT = false;
          Keyboard.SPACE = false;
          Keyboard.D = false;
        }

    /* ---------- State Conditions ---------- */
      // Checks if death animation has fully completed.
        isDeathAnimationFinished(character) {
          return (
            character.deadAnimationFrame >= character.imagesDead.length - 1 &&
            character.y >= character.groundLevel + 300
          );
        }
      // Checks if endboss is fully defeated.
        isEndbossDead(endboss) {
          return (
            endboss.isDead() &&
            endboss.deadAnimationFrame >= endboss.endbossDead.length - 1
          );
        }
    /* ---------- Game End ---------- */
      // Stops all systems and ends the game.
        endGame() {
          this.world.isRunning = false;
          IntervalHub.stopAllIntervals();
          AudioHub.stopAll();
        }
  }