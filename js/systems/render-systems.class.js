/** 
 * @class RenderSystems
 * Handles all drawing logic and canvas rendering pipeline
 */
  class RenderSystems {
    /**
     * @param {World} world - The game world instance containing rendering context and game state.
     */
      constructor(world) {
        this.world = world;
        this.ctx = world.ctx;
      }
  
    /* ---------- Render Loop ---------- */
      /** Starts rendering process.*/
        start() {
          this.draw();
        }

      /** Main render loop.*/
        draw() {
          const world = this.world;
          if (!world.isRunning) return;
          this.clearCanvas();
          if (this.handleGameEndState()) return;
          this.renderScene();
          updateUI();
          requestAnimationFrame(() => this.draw());
        }

      /** Clears entire canvas.*/
        clearCanvas() {
          const world = this.world;
          this.ctx.clearRect(0, 0, world.canvas.width, world.canvas.height);
        }

       /**
       * Stops rendering if the game ended.
       * @returns {boolean}
       */
        handleGameEndState() {
          const world = this.world;
          if (!world.isGameOver && !world.isGameWon) return false;
          updateUI();
          return true;
        }

    /* ---------- Scene Rendering ---------- */
      /** Renders full game scene.*/
        renderScene() {
          this.translateCamera();
          this.addWorldObjects();
          this.resetCamera();
        }

      /** Applies camera translation.*/
        translateCamera() {
          const world = this.world;
          this.ctx.translate(world.camera_x, 0);
        }

      /** Resets camera translation.*/
        resetCamera() {
          const world = this.world;
          this.ctx.translate(-world.camera_x, 0);
        }

      /** Adds all world objects to render pipeline.*/
        addWorldObjects() {
          const world = this.world;
          this.addObjectsToMap(world.level.backgroundObjects);
          this.addObjectsToMap(world.level.clouds);
          this.ctx.translate(-world.camera_x, 0);
          this.addUI();
          this.ctx.translate(world.camera_x, 0);
          this.addGameplayObjects();
        }

      /** Renders UI elements.*/
        addUI() {
          const world = this.world;
          this.addToMap(world.statusbarHealth);
          this.addToMap(world.statusbarCoin);
          this.addToMap(world.statusbarBottle);
          this.addToMap(world.statusbarEndboss);
        }

      /** Renders gameplay objects.*/
        addGameplayObjects() {
          const world = this.world;
          this.addToMap(world.character);
          this.addObjectsToMap(world.level.enemies);
          this.addObjectsToMap(world.throwableObjects);
          this.addObjectsToMap(world.level.coins);
          this.addObjectsToMap(world.level.bottles);
        }

    /* ---------- Object Rendering ---------- */
      /**
       * Renders multiple drawable objects.
       * @param {Array<DrawableObject>} objects
       */
        addObjectsToMap(objects) {
          objects.forEach((object) => {
            this.addToMap(object);
          });
        }

      /**
       * Renders a single drawable object.
       * @param {DrawableObject} mO
       */
        addToMap(mO) {
          if ((mO instanceof Coin || mO instanceof Bottle) && mO.isCollected) {
            return;
          }
          mO.getRealFrame();
          if (mO.otherDirection) {
            this.flipImage(mO);
          }
          mO.draw(this.ctx);
          mO.drawFrame(this.ctx);
          if (mO.otherDirection) {
            this.flipImageBack(mO);
          }
        }

      /**
       * Flips an image horizontally.
       * @param {DrawableObject} mO
       */
        flipImage(mO) {
          this.ctx.save();
          this.ctx.translate(mO.x + mO.width / 2, 0);
          this.ctx.scale(-1, 1);
          this.ctx.translate(-(mO.x + mO.width / 2), 0);
        }

      /**
       * Restores the canvas state after flipping.
       * @param {DrawableObject} mO
       */
        flipImageBack(mO) {
          this.ctx.restore();
        }
  }