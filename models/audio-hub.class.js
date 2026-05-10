/* =========================
 * Audio Hub
 * Centralized audio management for music and sound effects
 * ========================= */
  class AudioHub {
    /* ---------- Global Audio State ---------- */
      static muted = false;
      static volume = 0.3;

    /* ---------- Game Audio ---------- */
      static backgroundMusic = new Audio("audio/game/background.mp3");
      static gameStart = new Audio("audio/game/gameStart.mp3");
      static gameWin = new Audio("audio/game/win.mp3");
      static gameOver = new Audio("audio/game/loose.mp3");

    /* ---------- Character Audio ---------- */
      static characterSnoring = new Audio("audio/character/characterSnoring.mp3");
      static characterRun = new Audio("audio/character/characterRun.mp3");
      static characterJump = new Audio("audio/character/characterJump.mp3");
      static characterDamage = new Audio("audio/character/characterDamage.mp3");
      static characterDead = new Audio("audio/character/characterDead.wav");

     /* ---------- Enemy Audio ---------- */
      static chicksDead = new Audio("audio/chicken/chicksDead.mp3");
      static chickenDead = new Audio("audio/chicken/chickenDead2.mp3");

    /* ---------- Collectible & Throwable Audio ---------- */
      static bottleBreak = new Audio("audio/throwable/bottleBreak.mp3");
      static bottleCollect = new Audio("audio/collectibles/bottleCollectSound.wav");
      static coinCollect = new Audio("audio/collectibles/collectSound.wav");

    /* ---------- Endboss Audio ---------- */
      static enbossApproach = new Audio("audio/endboss/endbossApproach.wav");
      static endbossAttack = new Audio("audio/endboss/endbossAttack.mp3");
      static endbossDead = new Audio("audio/endboss/enbossDead.mp3");

    /* ---------- Audio Collection ---------- */
      static allSounds = [
        AudioHub.backgroundMusic,
        AudioHub.gameStart,
        AudioHub.gameWin,
        AudioHub.gameOver,
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
        AudioHub.endbossDead,
      ];
    
    /* ---------- Audio Initialization ---------- */
      // Initializes global audio settings.
        static initSounds() {
          this.backgroundMusic.loop = true;

          this.allSounds.forEach((sound) => {
            sound.volume = 0.1;
          });
        }

    /* ---------- Playback Controls ---------- */
      /**
       * Plays a sound effect.
       * @param {HTMLAudioElement} sound - Audio element to play.
       * @param {number} [volume=this.volume] - Playback volume.
       */
        static playOne(sound, volume = this.volume) {
          if (this.muted) return;
          sound.volume = volume;
          sound.currentTime = 0;
          const playPromise = sound.play();
          if (playPromise) playPromise.catch(() => {});
        }

      // Stops a specific sound.
        static stopOne(sound) {
          sound.pause();
        }

      // Stops all currently playing sounds.
        static stopAll() {
          AudioHub.allSounds.forEach((sound) => {
            if (!sound.paused) {
              sound.pause();
              sound.currentTime = 0;
            }
          });
        }

    /* ---------- Background Music ---------- */
      // Starts background music playback.
        static startBackgroundMusic() {
          if (this.muted) return;
          this.backgroundMusic.currentTime = 0;
          this.backgroundMusic.play();
        }
      
      // Stops background music playback.
        static stopBackgroundMusic() {
          this.backgroundMusic.pause();
          this.backgroundMusic.currentTime = 0;
        }

    /* ---------- Mute Controls ---------- */
      // Mutes all game audio.
        static muteAll() {
          AudioHub.muted = true;
          AudioHub.allSounds.forEach((sound) => (sound.muted = true));
          localStorage.setItem("gameMuted", "true");
        }

      // Unmutes all game audio.
        static unmuteAll() {
          AudioHub.muted = false;
          AudioHub.allSounds.forEach((sound) => (sound.muted = false));
          localStorage.setItem("gameMuted", "false");
          if (AudioHub.backgroundMusic.paused) {
            AudioHub.startBackgroundMusic();
          }
        }

      // Loads saved mute settings from local storage.
        static loadMuteStatus() {
          const savedMuted = localStorage.getItem("gameMuted");
          AudioHub.muted = savedMuted === "true" ? true : false;
          AudioHub.allSounds.forEach((sound) => (sound.muted = AudioHub.muted));
        }
  }