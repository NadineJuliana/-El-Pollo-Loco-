let controlsVisible = false;

function openInstructions() {
  document.getElementById("instructions").show();
}

function openImprint() {
  document.getElementById("imprint").show();
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

function toggleScreen() {
  const screen = document.getElementById("canvasContent");
  const button = document.getElementById("screenButton");
  if (!document.fullscreenElement) {
    screen.requestFullscreen();
    button.classList.add("active");
  } else {
    document.exitFullscreen();
    button.classList.remove("active");
  }
  toggleImage(
    "screenImage",
    !!document.fullscreenElement,
    "icons/009-maximize.png",
    "icons/007-minimize-1.png",
  );
  setTimeout(scaleCanvasContent, 100);
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

window.addEventListener("resize", scaleCanvasContent);
window.addEventListener("load", scaleCanvasContent);
window.addEventListener("orientationchange", scaleCanvasContent);
