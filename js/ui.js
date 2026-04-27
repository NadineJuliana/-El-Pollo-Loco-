let controlsVisible = false;

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

function openInstructions() {
  openDialog("instructions");
}

function openImprint() {
  openDialog("imprint");
}

function closeInstructions() {
  document.getElementById("instructions").close();
}

function closeImprint() {
  document.getElementById("imprint").close();
}

function updateUI() {
  if (!world) return;
  if (world.isGameOver) {
    document.getElementById("lostScreen").classList.remove("d-none");
  } else {
    document.getElementById("lostScreen").classList.add("d-none");
  }
  if (world.isGameWon) {
    document.getElementById("winScreen").classList.remove("d-none");
  } else {
    document.getElementById("winScreen").classList.add("d-none");
  }
}

function toggleImage(elementId, condition, imageOn, imageOff) {
  const el = document.getElementById(elementId);
  el.src = condition ? imageOn : imageOff;
}

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

function restartGame() {
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

function toggleSound() {
  if (AudioHub.muted) {
    AudioHub.unmuteAll();
  } else {
    AudioHub.muteAll();
  }
  toggleImage(
    "soundImage",
    !AudioHub.muted,
    "../icons/001-volume.png",
    "../icons/002-enable-sound.png",
  );
}

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

function toggleControls() {
  if (!isTouch) return;
  controlsVisible = !controlsVisible;
  applyControlsState();
}

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

document.addEventListener("fullscreenchange", () => {
  const isFullscreen = !!document.fullscreenElement;
  updateFullscreenUI(isFullscreen);
  requestAnimationFrame(() => scaleCanvasContent());
});

window.addEventListener("resize", scaleCanvasContent);
window.addEventListener("load", scaleCanvasContent);
window.addEventListener("orientationchange", scaleCanvasContent);
