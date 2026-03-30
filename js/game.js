let canvas;
let world;
let audioStarted = false;

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
  Keyboard.setMobileControls();
}

function startUIUpdater() {
  setInterval(() => {
    updateUI();
  }, 100);
}
