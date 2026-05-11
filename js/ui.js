/**
 * UI Controller
 * Handles dialogs, UI states, fullscreen, sound and game screens
 * @module UIController
 */
  /* ---------- UI State ---------- */
    let controlsVisible = false;
    let winSound = false;
    let loseSound = false;

  /* ---------- Dialog Handling ---------- */
    /**
     * Opens a dialog depending on device and orientation.
     * @param {string} id Element ID of the dialog
     */
      function openDialog(id) {
        const dialog = document.getElementById(id);
        if (dialog.open) dialog.close();
        const isTouchDeviceNow = isTouchDevice();
        const isPortrait = window.innerHeight > window.innerWidth;
        const useModal = isTouchDeviceNow && isPortrait;
        if (useModal) {
          dialog.classList.remove("in-canvas");
          dialog.classList.add("out-canvas");
          dialog.show();
        } else {
          dialog.classList.remove("out-canvas");
          dialog.classList.add("in-canvas");
          dialog.show();
        }
      }

    /** Opens instructions dialog.*/
      function openInstructions() {
        openDialog("instructions");
      }

    /** Opens imprint dialog.*/
      function openImprint() {
        openDialog("imprint");
      }

    /** Closes instructions dialog.*/
      function closeInstructions() {
        document.getElementById("instructions").close();
      }

    /** Closes imprint dialog.*/
      function closeImprint() {
        document.getElementById("imprint").close();
      }

  /* ---------- Game UI State ---------- */
    /**
     * Shows or hides a game screen and triggers a sound once.
     * Returns whether the sound has been played already.
     * @param {boolean} condition
     * @param {string} elementId
     * @param {boolean} soundAlreadyPlayed
     * @param {function} playSound
     * @returns {boolean}
     */
      function handleGameScreen(condition, elementId, soundAlreadyPlayed, playSound) {
        const element = document.getElementById(elementId);
        if (condition) {
          element.classList.remove("d-none");
          if (!soundAlreadyPlayed) {
            playSound();
            return true;
          }
        } else {
          element.classList.add("d-none");
        }
        return soundAlreadyPlayed;
      }

    /** Updates win/lose screens based on game state.*/
      function updateUI() {
        if (!world) return;
        loseSound = handleGameScreen(
          world.isGameOver,
          "lostScreen",
          loseSound,
          function playLoseSound() {
            AudioHub.playOne(AudioHub.gameOver);
          },
        );
        winSound = handleGameScreen(
          world.isGameWon,
          "winScreen",
          winSound,
          function playWinSound() {
            AudioHub.playOne(AudioHub.gameWin);
          },
        );
      }

    /**
     * Toggles image based on condition.
     * @param {string} elementId
     * @param {boolean} condition
     * @param {string} imageOn
     * @param {string} imageOff
     */
      function toggleImage(elementId, condition, imageOn, imageOff) {
        const el = document.getElementById(elementId);
        el.src = condition ? imageOn : imageOff;
      }

  /* ---------- Game Flow ---------- */
    /** Returns to home screen and resets game state.*/
      function backHome() {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        IntervalHub.stopAllIntervals();
        AudioHub.stopAll();
        document.getElementById("startscreen").style.display = "block";
        document.getElementById("canvas").style.display = "none";
        document.getElementById("lostScreen").classList.add("d-none");
        document.getElementById("winScreen").classList.add("d-none");
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        world = null;
        updateFullscreenUI(false);
      }

    /** Restarts the game.*/
      function restartGame() {
        winSound = false;
        loseSound = false;
        IntervalHub.stopAllIntervals();
        AudioHub.stopAll();
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.getElementById("lostScreen").classList.add("d-none");
        document.getElementById("winScreen").classList.add("d-none");
        world = null;
        init();
      }

  /* ---------- Screen / Layout ---------- */
    /** Toggles fullscreen mode.*/
      function toggleScreen() {
        const screen = document.getElementById("canvasContent");
        if (!document.fullscreenElement) {
          screen.requestFullscreen();
          updateFullscreenUI(true);
        } else {
          document.exitFullscreen();
          updateFullscreenUI(false);
        }
        requestAnimationFrame(() => scaleCanvasContent());
      }

    /** Toggles mobile controls visibility.*/
      function toggleControls() {
        if (!isTouch) return;
        controlsVisible = !controlsVisible;
        applyControlsState();
      }

    /** Toggles sound on/off.*/
      function toggleSound() {
        if (AudioHub.muted) {
          AudioHub.unmuteAll();
        } else {
          AudioHub.muteAll();
        }
        toggleImage(
          "soundImage",
          !AudioHub.muted,
          "icons/001-volume.png",
          "icons/002-enable-sound.png",
        );
      }

    /**
     * Updates fullscreen button UI state.
     * @param {boolean} isFullscreen
     */
      function updateFullscreenUI(isFullscreen) {
        const button = document.getElementById("screenButton");
        if (isFullscreen) {
          button.classList.add("active");
        } else {
          button.classList.remove("active");
        }
        toggleImage(
          "screenImage",
          isFullscreen,
          "icons/007-minimize-1.png",
          "icons/009-maximize.png",
        );
      }

    /** Applies mobile controls visibility state.*/
      function applyControlsState() {
        const controls = document.getElementById("mobileControls");
        const button = document.getElementById("controlsButton");
        if (controlsVisible) {
          controls.classList.remove("d-none");
          button.classList.add("active");
        } else {
          controls.classList.add("d-none");
          button.classList.remove("active");
        }
      }

  /* ---------- Canvas Scaling ---------- */  
    /** Scales canvas depending on screen size and fullscreen state.*/
      function scaleCanvasContent() {
        const container = document.getElementById("canvasContent");
        if (document.fullscreenElement) {
          container.style.transform = "none";
          return;
        }
        const baseWidth = 720;
        const baseHeight = 480;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        let scale = Math.min(windowWidth / baseWidth, windowHeight / baseHeight, 1);
        if (windowWidth > windowHeight && windowHeight < 768) {
          scale *= 0.9;
        }
        container.style.transform = `translate(-50%, -50%) scale(${scale})`;
      }

  /* ---------- Event Listeners ---------- */
    document.addEventListener("fullscreenchange", () => {
      const isFullscreen = !!document.fullscreenElement;
      updateFullscreenUI(isFullscreen);
      requestAnimationFrame(() => scaleCanvasContent());
    });

    window.addEventListener("resize", scaleCanvasContent);
    window.addEventListener("load", scaleCanvasContent);
    window.addEventListener("orientationchange", scaleCanvasContent);