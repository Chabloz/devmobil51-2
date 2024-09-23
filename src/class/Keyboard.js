export default class Keyboard {

  constructor() {
    this.keys = new Set();
    window.addEventListener("keydown", (evt) => this.handleKeyDown(evt));
    window.addEventListener("keyup", (evt) => this.handleKeyUp(evt));
  }

  handleKeyDown(evt) {
    this.keys.add(evt.code);
  }

  handleKeyUp(evt) {
    this.keys.delete(evt.code);
  }

  isKeyDown(code) {
    return this.keys.has(code);
  }
}