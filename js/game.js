/**
 * Main game entry point.
 * Handles game initialization, device setup and global UI behavior.
 * @module Game
 */
  /* ---------- Global State ---------- */ 
    let canvas;
    let world;
    let audioStarted = false;
    let hasValidOrientation = false;

  /* ---------- Game Initialization ---------- */
    /** Initializes canvas, systems and world.*/
      function init() {
        canvas = document.getElementById("canvas");
        IntervalHub.stopAllIntervals();
        AudioHub.initSounds();
        AudioHub.loadMuteStatus();
        AudioHub.startBackgroundMusic();
        initLevel();
        Keyboard.setControls();
        world = new World(canvas, level);
      }

    /** Starts a new game session.*/
      function startGame() {
        winSound = false;
        loseSound = false;
        hasValidOrientation = false;
        document.getElementById("startscreen").style.display = "none";
        document.getElementById("canvas").style.display = "block";
        AudioHub.startBackgroundMusic();
        init();
        startUIUpdater();
        initControls();
        disableContextMenu();
      }

    /** Starts periodic UI updates.*/
      function startUIUpdater() {
        setInterval(() => {
          updateUI();
        }, 100);
      }

  /* ---------- Mobile Controls ---------- */
    /**
     * Checks whether the current device supports touch input.
     * @returns {boolean} True if touch input is available.
     */ 
      function isTouchDevice() {
        return "ontouchstart" in window || navigator.maxTouchPoints > 0;
      }

    /** Initializes mobile control handling depending on the device type.*/
      function initControls() {
        const button = document.getElementById("controlsButton");
        isTouch = isTouchDevice();
        if (isTouch) {
          controlsVisible = true;
          Keyboard.setMobileControls();
          button.classList.remove("d-none");
        } else {
          controlsVisible = false;
          button.classList.add("d-none");
        }
        applyControlsState();
      }

    /** Prevents the browser context menu on mobile control buttons.*/
      function disableContextMenu() {
        const mobileButtons = document.querySelectorAll("#mobileControls button");
        mobileButtons.forEach((btn) => {
          btn.addEventListener("contextmenu", (e) => {
            e.preventDefault();
          });
        });
      }

  /* ---------- Layout Handling ---------- */
    /** Displays the desktop layout.*/
      function showDesktop() {
        setDisplay(true, true, true, false);
      }

    /** Displays the mobile portrait layout.*/
      function showMobilePortrait() {
        setDisplay(false, false, false, true);
      }

    /** Displays the mobile landscape layout.*/
      function showMobileLandscape() {
        setDisplay(true, false, false, false);
      }

    /**
     * Updates the visibility of layout elements.
     * @param {boolean} canvas - Whether the canvas area should be visible.
     * @param {boolean} header - Whether the header should be visible.
     * @param {boolean} footer - Whether the footer should be visible.
     * @param {boolean} portrait - Whether the portrait warning screen should be visible.
     */
      function setDisplay(canvas, header, footer, portrait) {
        document.getElementById("canvasContent").style.display = canvas
          ? "block"
          : "none";
        document.querySelector("header").style.display = header ? "block" : "none";
        document.querySelector("footer").style.display = footer ? "block" : "none";
        const portraitScreen = document.getElementById("portraitScreen");
        portraitScreen.classList.toggle("d-none", !portrait);
      }

    /**
     * Checks whether the current layout matches mobile screen sizes.
     * @returns {boolean} True if the mobile layout is active.
     */
      function isMobileLayout() {
        return window.matchMedia("(max-width: 768px)").matches;
      }

    /** Updates the game layout depending on screen size and orientation.*/
      function updateLayout() {
        const isPortrait = window.innerHeight > window.innerWidth;
        const isMobile = isMobileLayout();
        if (!isMobile) return showDesktop();
        if (isPortrait) return showMobilePortrait();
        showMobileLandscape();
      }
  
  /* ---------- Event Listeners ---------- */
    document.addEventListener("DOMContentLoaded", () => {
      AudioHub.loadMuteStatus();
      toggleImage(
        "soundImage",
        !AudioHub.muted,
        "icons/001-volume.png",
        "icons/002-enable-sound.png",
      );
    });

    document.addEventListener("DOMContentLoaded", updateLayout);
    window.addEventListener("resize", updateLayout);
    window.addEventListener("orientationchange", updateLayout);