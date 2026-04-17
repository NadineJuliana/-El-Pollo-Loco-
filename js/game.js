let canvas;
let world;
let audioStarted = false;
let isTouch = false;
let hasValidOrientation = false;

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

function startGame() {
  hasValidOrientation = false;
  checkOrientation();
  document.getElementById("startscreen").style.display = "none";
  document.getElementById("canvas").style.display = "block";
  AudioHub.startBackgroundMusic();
  init();
  startUIUpdater();
  initControls();
  disableContextMenu();
}

function startUIUpdater() {
  setInterval(() => {
    updateUI();
  }, 100);
}

function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

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

function disableContextMenu() {
  const mobileButtons = document.querySelectorAll("#mobileControls button");
  mobileButtons.forEach((btn) => {
    btn.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  });
}

function isDevToolsMobileView() {
  return (
    window.innerWidth < 768 &&
    !isTouch &&
    window.outerWidth - window.innerWidth > 100
  );
}

function showOverlay() {
  document.getElementById("rotateOverlay").classList.remove("d-none");
}

function hideOverlay() {
  document.getElementById("rotateOverlay").classList.add("d-none");
  scaleCanvasContent();
}

function isPortraitMode() {
  return window.innerHeight > window.innerWidth;
}

function isBelowMinWidth() {
  return window.innerWidth < 320;
}

function handleMobileOrientation() {
  if (isPortraitMode()) {
    showOverlay();
  } else {
    hideOverlay();
  }
}

function handleDesktopView() {
  if (isDevToolsMobileView()) {
    showOverlay();
  } else {
    hideOverlay();
  }
}

function checkOrientation() {
  if (isBelowMinWidth()) {
    showOverlay();
    return;
  }
  if (isTouch) {
    handleMobileOrientation();
    return;
  }
  handleDesktopView();
}

window.addEventListener("load", () => {
  isTouch = isTouchDevice();
  checkOrientation();
});

window.addEventListener("orientationchange", checkOrientation);

window.addEventListener("resize", () => {
  checkOrientation();
  if (!isTouch) {
    controlsVisible = false;
    applyControlsState();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  AudioHub.loadMuteStatus();
  toggleImage(
    "soundImage",
    !AudioHub.muted,
    "../icons/001-volume.png",
    "../icons/002-enable-sound.png",
  );
});
