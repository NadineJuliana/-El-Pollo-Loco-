let canvas;
let world;
let audioStarted = false;
let isTouch = false;

function init() {
  canvas = document.getElementById("canvas");
  IntervalHub.stopAllIntervals();
  AudioHub.initSounds();
  AudioHub.startBackgroundMusic();
  initLevel();
  Keyboard.setControls();
  world = new World(canvas, level);
}

function startGame() {
  document.getElementById("startscreen").style.display = "none";
  document.getElementById("canvas").style.display = "block";
  AudioHub.startBackgroundMusic();
  init();
  startUIUpdater();
  initControls();
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

window.addEventListener("resize", () => {
  if (!isTouch) {
    controlsVisible = false;
    applyControlsState();
  }
});
