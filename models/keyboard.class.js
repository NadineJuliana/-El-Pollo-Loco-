class Keyboard {
  static RIGHT = false;
  static LEFT = false;
  static SPACE = false;
  static D = false;

  static setControls() {
    window.addEventListener("keydown", (e) => {
      if (e.key == "ArrowRight") {
        Keyboard.RIGHT = true;
      }
      if (e.key == "ArrowLeft") {
        Keyboard.LEFT = true;
      }
      if (e.key == " ") {
        Keyboard.SPACE = true;
      }
      if (e.key == "d") {
        Keyboard.D = true;
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key == "ArrowRight") {
        Keyboard.RIGHT = false;
      }
      if (e.key == "ArrowLeft") {
        Keyboard.LEFT = false;
      }
      if (e.key == " ") {
        Keyboard.SPACE = false;
      }
      if (e.key == "d") {
        Keyboard.D = false;
      }
    });
  }

  static setMobileControls() {
    document.getElementById("btnRight").addEventListener("touchstart", () => {
      Keyboard.RIGHT = true;
    });
    document.getElementById("btnRight").addEventListener("touchend", () => {
      Keyboard.RIGHT = false;
    });
    document.getElementById("btnLeft").addEventListener("touchstart", () => {
      Keyboard.LEFT = true;
    });
    document.getElementById("btnLeft").addEventListener("touchend", () => {
      Keyboard.LEFT = false;
    });
    document.getElementById("btnJump").addEventListener("touchstart", () => {
      Keyboard.SPACE = true;
    });
    document.getElementById("btnJump").addEventListener("touchend", () => {
      Keyboard.SPACE = false;
    });
    document.getElementById("btnThrow").addEventListener("touchstart", () => {
      Keyboard.D = true;
    });
    document.getElementById("btnThrow").addEventListener("touchend", () => {
      Keyboard.D = false;
    });
  }
}
