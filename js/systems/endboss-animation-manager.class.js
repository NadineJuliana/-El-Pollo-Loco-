class EndbossAnimationManager {
  constructor(endboss) {
    this.endboss = endboss;
  }

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

  resetAnimationIfStateChanged() {
    const endboss = this.endboss;
    if (endboss.lastState !== endboss.state) {
      endboss.currentImage = 0;
      endboss.lastState = endboss.state;
    }
  }

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

  animateWalking() {
    this.endboss.playAnimation(this.endboss.endbossWalking);
  }

  animateAlert() {
    this.endboss.playAnimation(this.endboss.endbossAlert);
  }

  animateAttack() {
    this.endboss.playAnimation(this.endboss.endbossAttack);
  }

  animateHurt() {
    this.endboss.playAnimation(this.endboss.endbossHurt);
  }

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
