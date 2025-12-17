class Keyboard {
    static RIGHT = false;
    static LEFT = false;
    static UP = false;
    static D = false;

    static setControls() {
        window.addEventListener('keydown', (e) => {
            if (e.key == 'ArrowRight') {
                Keyboard.RIGHT = true;
            }
            if (e.key == 'ArrowLeft') {
                Keyboard.LEFT = true;
            }
            if (e.key == ' ' || e.key == 'ArrowUp') {
                Keyboard.UP = true;
            }
            if (e.key == 'd') {
                Keyboard.D = true;
            }
        })

        window.addEventListener('keyup', (e) => {
            if (e.key == 'ArrowRight') {
                Keyboard.RIGHT = false;
            }
            if (e.key == 'ArrowLeft') {
                Keyboard.LEFT = false;
            }
            if (e.key == ' ' || e.key == 'ArrowUp') {
                Keyboard.UP = false;
            }
            if (e.key == 'd') {
                Keyboard.D = false;
            }
        })
    }

    static setMobileControls() {
        document.getElementById('btn-right').addEventListener('touchstart', () => {
            Keyboard.RIGHT = true;
        })
        document.getElementById('btn-left').addEventListener('touchstart', () => {
            Keyboard.LEFT = true;
        })
        document.getElementById('btn-jump').addEventListener('touchstart', () => {
            Keyboard.UP = true;
        })
        document.getElementById('btn-throw').addEventListener('touchstart', () => {
            Keyboard.D = true;
        })
        document.getElementById('btn-right').addEventListener('touchend', () => {
            Keyboard.RIGHT = false;
        })
        document.getElementById('btn-left').addEventListener('touchend', () => {
            Keyboard.LEFT = false;
        })
        document.getElementById('btn-jump').addEventListener('touchend', () => {
            Keyboard.UP = false;
        })
        document.getElementById('btn-throw').addEventListener('touchend', () => {
            Keyboard.D = false;
        })
    }
}