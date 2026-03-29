let canvas;
let world;
let keyboard = new Keyboard();
let audioStarted = false;

function init() {
  canvas = document.getElementById("canvas");
  IntervalHub.stopAllIntervals();
  AudioHub.initSounds();
  AudioHub.startBackgroundMusic();
  initLevel();
  world = new World(canvas, keyboard);
}

function startGame() {
  document.getElementById("startscreen").style.display = "none";
  document.getElementById("canvas").style.display = "block";
  AudioHub.startBackgroundMusic();
  init();
  startUIUpdater();
}

function startUIUpdater() {
  setInterval(() => {
    updateUI();
  }, 100);
}

window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = true;
  if (e.keyCode == 37) keyboard.LEFT = true;
  if (e.keyCode == 38) keyboard.UP = true;
  if (e.keyCode == 32) keyboard.SPACE = true;
  if (e.keyCode == 68) keyboard.D = true;
  // console.log(e);
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = false;
  if (e.keyCode == 37) keyboard.LEFT = false;
  if (e.keyCode == 38) keyboard.UP = false;
  if (e.keyCode == 32) keyboard.SPACE = false;
  if (e.keyCode == 68) keyboard.D = false;
  // console.log(e);
});
