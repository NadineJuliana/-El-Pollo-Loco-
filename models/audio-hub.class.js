class AudioHub {
  static muted = false;
  static volume = 0.3;
  static backgroundMusic = new Audio("audio/game/background.mp3");
  static gameStart = new Audio("audio/game/gameStart.mp3");

  static characterSnoring = new Audio("audio/character/characterSnoring.mp3");
  static characterRun = new Audio("audio/character/characterRun.mp3");
  static characterJump = new Audio("audio/character/characterJump.wav");
  static characterDamage = new Audio("audio/character/characterDamage.mp3");
  static characterDead = new Audio("audio/character/characterDead.wav");

  static chicksDead = new Audio("audio/chicken/chicksDead.mp3");
  static chickenDead = new Audio("audio/chicken/chickenDead2.mp3");

  static bottleBreak = new Audio("audio/throwable/bottleBreak.mp3");
  static bottleCollect = new Audio("audio/collectibles/bottleCollectSound.wav");
  static coinCollect = new Audio("audio/collectibles/collectSound.wav");

  static enbossApproach = new Audio("audio/endboss/endbossApproach.wav");
  static endbossAttack = new Audio("audio/endboss/endbossAttack.mp3");
  static enbossDead = new Audio("audio/endboss/enbossDead.mp3");

  static allSounds = [
    AudioHub.backgroundMusic,
    AudioHub.gameStart,
    AudioHub.characterSnoring,
    AudioHub.characterRun,
    AudioHub.characterJump,
    AudioHub.characterDamage,
    AudioHub.characterDead,
    AudioHub.chicksDead,
    AudioHub.chickenDead,
    AudioHub.bottleBreak,
    AudioHub.bottleCollect,
    AudioHub.coinCollect,
    AudioHub.enbossApproach,
    AudioHub.endbossAttack,
    AudioHub.enbossDead,
  ];

  static initSounds() {
    this.backgroundMusic.loop = true;

    this.allSounds.forEach((sound) => {
      sound.volume = 0.1;
    });
  }

  static playOne(sound) {
    if (this.muted) return;
    sound.volume = this.volume;
    sound.currentTime = 0;
    sound.play();
  }

  static stopOne(sound) {
    sound.pause();
  }

  static stopAll() {
    AudioHub.allSounds.forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  static startBackgroundMusic() {
    if (this.muted) return;
    this.backgroundMusic.currentTime = 0;
    this.backgroundMusic.play();
  }

  static stopBackgroundMusic() {
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
  }

  static muteAll() {
    AudioHub.muted = true;
    AudioHub.allSounds.forEach((sound) => (sound.muted = true));
  }

  static unmuteAll() {
    AudioHub.muted = false;
    AudioHub.allSounds.forEach((sound) => (sound.muted = false));
  }
}
