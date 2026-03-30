let controlsVisible = false;

function openInstructions() {
  document.getElementById("instructions").showModal();
}

function openImprint() {
  document.getElementById("imprint").showModal();
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
  toggleImage(
    "soundImage",
    AudioHub.muted,
    "../icons/001-volume.png",
    "../icons/002-enable-sound.png",
  );
  if (AudioHub.muted) {
    AudioHub.unmuteAll();
  } else {
    AudioHub.muteAll();
  }
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
}

function toggleControls() {
  const controls = document.getElementById("mobileControls");
  const button = document.getElementById("controlsButton");
  controlsVisible = !controlsVisible;
  if (controlsVisible) {
    controls.classList.remove("d-none");
    button.classList.add("active");
  } else {
    controls.classList.add("d-none");
    button.classList.remove("active");
  }
}
