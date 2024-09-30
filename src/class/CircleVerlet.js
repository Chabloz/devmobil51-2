import Circle from "./Circle";

export default class CircleVerlet extends Circle {

    constructor({
      radius = 100,
      color = "tomato",
      x = 0,
      y = 0,
      speed = 100,
      dir = 0,
    } = {}) {
      super({ radius, color, x, y, speed, dir });
      this.prevX = x;
      this.prevY = y;
      this.accelY = 0;
    }

    move(dt) {
      // verlet integration
      const vx = this.x - this.prevX;
      const vy = this.y - this.prevY;

      this.prevX = this.x;
      this.prevY = this.y;

      this.x += vx ;
      this.y += vy + this.accelY * dt * dt;

      this.accelY = 0;
    }

    applyForceY(force) {
      this.accelY += force;
    }

    constraintBox(width, height) {
      if (this.y + this.radius > height) {
        const vy = this.y - this.prevY;
        this.y = height - this.radius;
        this.prevY = this.y + vy; // invert the velocity
      }
    }


}