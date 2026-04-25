let canvas;
let world;
let audioStarted = false;
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

document.addEventListener("DOMContentLoaded", () => {
  AudioHub.loadMuteStatus();
  toggleImage(
    "soundImage",
    !AudioHub.muted,
    "../icons/001-volume.png",
    "../icons/002-enable-sound.png",
  );
});

function showAll() {
  setDisplay(true, true, true, false);
}

function showPortraitOnly() {
  setDisplay(false, false, false, true);
}

function showLandscapeTouch() {
  setDisplay(true, false, false, false);
}

function setDisplay(canvas, header, footer, portrait) {
  document.getElementById("canvasContent").style.display = canvas ? "block" : "none";
  document.querySelector("header").style.display = header ? "block" : "none";
  document.querySelector("footer").style.display = footer ? "block" : "none";
  const portraitScreen = document.getElementById("portraitScreen");
  portraitScreen.classList.toggle("d-none", !portrait);
}

function updateLayout() {
  const isPortrait = window.innerHeight > window.innerWidth;
  const isTouchDeviceNow = isTouchDevice();
  if (!isTouchDeviceNow) return showAll();
  if (isPortrait) return showPortraitOnly();
  showLandscapeTouch();
}

window.addEventListener("load", updateLayout);
window.addEventListener("resize", updateLayout);
window.addEventListener("orientationchange", updateLayout);
