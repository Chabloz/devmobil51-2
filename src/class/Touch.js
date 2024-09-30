export default class Touch {

  constructor() {
    document.addEventListener("touchstart", (evt) => this.handleTouchStart(evt));
    document.addEventListener("touchend", (evt) => this.handleTouchEnd(evt));
    document.addEventListener("touchmove", (evt) => this.handleTouchMove(evt));
    this.startPos = {x: 0, y: 0}
    this.angle = false;
  }

  getAngle() {
    return this.angle;
  }

  handleTouchStart(evt) {
    // get mouse position
    this.startPos = {
      x: evt.touches[0].clientX,
      y: evt.touches[0].clientY
    };
  }

  handleTouchMove(evt) {
    const endPos = {
      x: evt.touches[0].clientX,
      y: evt.touches[0].clientY
    };
    const dx = endPos.x - this.startPos.x;
    const dy = endPos.y - this.startPos.y;
    // arctan2 returns the angle in radians
    this.angle = Math.atan2(dy, dx);
  }

  handleTouchEnd(evt) {
    this.angle = false;
  }

}