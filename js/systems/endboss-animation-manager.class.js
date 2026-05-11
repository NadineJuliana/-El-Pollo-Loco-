/** 
 * @class EndbossAnimationManager
 * Handles animation states and sprite rendering logic
 */
  class EndbossAnimationManager {
    /**
     * Creates a new animation manager for the Endboss.
     * @param {Endboss} endboss - The controlled Endboss instance.
     */
      constructor(endboss) {
        this.endboss = endboss;
      }

    /* ---------- Animation Update ---------- */
      /** Main animation update cycle.*/
        updateAnimation() {
          const endboss = this.endboss;
          if (endboss.turning) {
            this.animateAlert();
            return;
          }
          this.resetAnimationIfStateChanged();
          if (endboss.isDead()) {
            this.animateDead();
            return;
          }
          this.animateByState();
        }

    /* ---------- State Handling ---------- */
      /** Resets animation frame when state changes.*/
        resetAnimationIfStateChanged() {
          const endboss = this.endboss;
          if (endboss.lastState !== endboss.state) {
            endboss.currentImage = 0;
            endboss.lastState = endboss.state;
          }
        }

      /** Selects animation based on current state.*/
        animateByState() {
          const endboss = this.endboss;
          const map = {
            hurt: () => this.animateHurt(),
            alert: () => this.animateAlert(),
            chase: () => this.animateWalking(),
            return: () => this.animateWalking(),
            attack: () => this.animateAttack(),
            idle: () => this.animateAlert(),
          };
          (map[endboss.state] || map["idle"])();
        }

    /* ---------- Animation Types ---------- */
      /** Walking animation.*/
        animateWalking() {
          this.endboss.playAnimation(this.endboss.endbossWalking);
        }

      /** Alert animation.*/
        animateAlert() {
          this.endboss.playAnimation(this.endboss.endbossAlert);
        }

      /** Attack animation.*/
        animateAttack() {
          this.endboss.playAnimation(this.endboss.endbossAttack);
        }

      /** Hurt animation.*/
        animateHurt() {
          this.endboss.playAnimation(this.endboss.endbossHurt);
        }

      /** Death animation sequence.*/
        animateDead() {
          const endboss = this.endboss;
          if (!endboss.isDeadAnimationPlaying) {
            endboss.isDeadAnimationPlaying = true;
            endboss.deadAnimationFrame = 0;
          }
          if (endboss.deadAnimationFrame < endboss.endbossDead.length) {
            endboss.setImageFromCache(
              endboss.endbossDead,
              endboss.deadAnimationFrame++,
            );
          } else {
            endboss.setImageFromCache(
              endboss.endbossDead,
              endboss.endbossDead.length - 1,
            );
          }
        }
  }