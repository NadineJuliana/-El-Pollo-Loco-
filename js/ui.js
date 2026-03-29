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

function backHome() {}

function restartGame() {
  IntervalHub.stopAllIntervals();
  AudioHub.stopAll();
  document.getElementById("lostScreen").classList.add("d-none");
  document.getElementById("winScreen").classList.add("d-none");
  startGame();
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

function toggleScreen() {}

function toggleControls() {
  const controls = document.getElementById("mobileControls");
  const button = document.getElementById("uiButton");
  controlsVisible = !controlsVisible;
  if (controlsVisible) {
    controls.classList.remove("d-none");
    button.classList.add("active");
  } else {
    controls.classList.add("d-none");
    button.classList.remove("active");
  }
}
