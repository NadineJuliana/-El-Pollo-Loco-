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
  const overlay = document.querySelector(".ui__overlay");
  if (world.isGameOver) {
    showLoseScreen();
  }
  if (world.isGameWon) {
    showWinScreen();
  }
}

function showLoseScreen() {
  document.getElementById("loseScreen").classList.remove("d-none");
}

function showWinScreen() {
  document.getElementById("winScreen").classList.remove("d-none");
}

function backHome() {}

function restartGame() {}

function toggleSound() {
  if (AudioHub.muted) {
    AudioHub.unmuteAll();
  } else {
    AudioHub.muteAll();
  }
}

function toggleScreen() {}

function toggleControls() {}
