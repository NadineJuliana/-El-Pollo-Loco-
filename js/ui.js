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

function backHome() {}

function restartGame() {
  IntervalHub.stopAllIntervals();
  AudioHub.stopAll();
  document.getElementById("loseScreen").classList.add("d-none");
  document.getElementById("winScreen").classList.add("d-none");
  startGame();
}

function toggleSound() {
  if (AudioHub.muted) {
    AudioHub.unmuteAll();
  } else {
    AudioHub.muteAll();
  }
}

function toggleScreen() {}

function toggleControls() {}
